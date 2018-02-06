import React, { Component } from 'react';
import ReactStars from 'react-stars'
import RaisedButton from 'material-ui/RaisedButton';
import HtmlTextField from '../Components/HtmlTextField';
import ProfileImage from '../Components/ProfileImage';
import apiReview from '../api/review';
import apiOrder from '../api/order';
import * as apiRequest from '../api/request';
import { getConfigAsync } from '../core/config';
import { getUserAsync } from '../core/auth';
import { goTo, convertToAppPath, goBack } from '../core/navigation';
import { translate } from '../core/i18n';
import { openDialog } from '../helpers/open-message-dialog.js';

const REVIEW_TYPES = {
    ORDER: 1,
    REQUEST: 2
};

class Review extends Component {
    constructor(props) {
        super(props);
   
        const orderId = props.params.orderId;
        const requestId = props.params.requestId;
        
        const reviewType = orderId ? REVIEW_TYPES.ORDER : REVIEW_TYPES.REQUEST;

        this.state = {
            userUnderReview: null,
            reviewType,
            requestId,
            orderId,
            request: null,
            user: null,
            order: null,
            config: null,
            body: {
              value: '',
              rawText: ''
            },
            selectedRating: 0,
            isLoading: true
        };
    }
    componentDidMount() {
        getConfigAsync(config => {
            getUserAsync(user => {
                if (!user) {
                    goTo(`/login?redirectTo=${convertToAppPath(`${location.pathname}`)}`);
            
                    return true;
                }

                this.setState({
                    user,
                    config
                });
    
                if (this.state.reviewType === REVIEW_TYPES.ORDER) {
                    return apiOrder
                        .getItem(this.state.orderId)
                        .then(order => {
                            
                            if (order.userId !== user.id) {
                                return goTo('/');
                            }

                            if (order.review) {
                                return goTo('/');
                            }

                            const userUnderReview = order.request.fromUser;

                            this.setState({
                                userUnderReview,
                                order
                            })
                        }, err => {
                            return goTo('/');
                        });
                }
                
                if (this.state.reviewType === REVIEW_TYPES.REQUEST) {
                    return apiRequest
                        .getItem(this.state.requestId)
                        .then(request => {

                            if (request.request.fromUserId !== user.id) {
                                return goTo('/');
                            }

                            if (request.request.review) {
                                return goTo('/');
                            }

                            const userUnderReview = request.request.toUser;
                            
                            this.setState({
                                userUnderReview,
                                request: request.request
                            })
                        }, err => {
                            return goTo('/');
                        });
                }
            }, true);
        });
    }
    render() {
        return (
            <div className="container" style={{ marginBottom: 75, marginTop: 50 }}>
                
                {this.state.config &&
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-xs-12">
                        <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                                {this.state.reviewType === REVIEW_TYPES.ORDER ?
                                    translate('ORDER_REVIEW_RATE_HEADER') :
                                    translate('REQUEST_REVIEW_RATE_HEADER')
                                }
                            </h1>
                            <p>
                                {this.state.reviewType === REVIEW_TYPES.ORDER ?
                                    translate('ORDER_REVIEW_RATE_DESC') :
                                    translate('REQUEST_REVIEW_RATE_DESC')
                                }
                            </p>
                        </div>
                        <div className="col-xs-12" style={{
                            lineHeight: 2
                        }}>
                            <ReactStars
                                count={5}
                                size={42}
                                half={false}
                                value={this.state.selectedRating}
                                onChange={selectedRating => {
                                    this.setState({ selectedRating });
                                }}
                                color2={'#ffd700'}
                            />
                        </div>
                        <div className="col-xs-12">
                            <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                                { this.state.reviewType === REVIEW_TYPES.ORDER ?
                                    translate('ORDER_REVIEW_TEXT_HEADER') :
                                    translate('REQUEST_REVIEW_TEXT_HEADER')
                                }
                            </h1>
                            <p>
                                { this.state.reviewType === REVIEW_TYPES.ORDER ?
                                    translate('ORDER_REVIEW_TEXT_DESC') :
                                    translate('REQUEST_REVIEW_TEXT_DESC')
                                }
                            </p>
                        </div>
                        <div className="col-xs-12">
                            <HtmlTextField
                                onChange={(ev, value, rawText) => {
                                    this.setState({ body: {
                                      value,
                                      rawText
                                    } });
                                }}
                                value={this.state.body.value}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xs-12">
                            <RaisedButton
                                style={{
                                    float: 'right'
                                }}
                                disabled={!this.state.body.rawText || this.state.isProcessing || this.state.isProcessed}
                                labelStyle={{color: 'white '}}
                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                label={translate("REVIEW_SUBMIT")}
                                onTouchTap={() => {
                                    const reviewType = this.state.reviewType;
                                    const order = this.state.order;
                                    const request = this.state.request;

                                    const orderId = order ? order.id : null;
                                    const requestId = request ? request.id : null;

                                    const body = this.state.body.rawText;

                                    if (!this.state.selectedRating) {
                                        return alert('Rate is required (min. 1 start)');
                                    }

                                    if (!this.state.body.rawText) {
                                        return alert('Review text is required');
                                    }

                                    const review = {
                                        rate: String(this.state.selectedRating),
                                        body: this.state.body.value
                                    };

                                    this.setState({
                                        isProcessing: true
                                    });

                                    if (reviewType === REVIEW_TYPES.ORDER) {
                                        review.orderId = orderId;
                                    }

                                    if (reviewType === REVIEW_TYPES.REQUEST) {
                                        review.requestId = requestId;
                                    }

                                    apiReview
                                        .createItem(review)
                                        .then(review => {
                                            this.setState({
                                                isProcessing: false,
                                                isProcessed: true,
                                            });

                                            openDialog({
                                                header: translate('REVIEW_SUBMITTED_SUCCESS_HEADER'),
                                                desc: translate('REVIEW_SUBMITTED_SUCCESS_DESC')
                                            }, () => {
                                                const user = this.state.user;

                                                if (user.userType === 1) {
                                                    return goTo(`/profile/${user.id}`);
                                                }

                                                if (user.userType === 2) {
                                                    return goTo(`/profile/${user.id}`);
                                                }

                                                goBack();
                                            });
                                        }, err => {
                                            console.error(err);

                                            this.setState({
                                                isProcessing: false,
                                                isProcessed: false
                                            });
                                        });
                                }}
                            />
                        </div>
                    </div>
                </div>
                }
                {   this.state.config &&
                    this.state.userUnderReview &&
                    <div className="col-md-4 text-center" style={{ paddingTop: 50 }}>
                        <ProfileImage
                            isLoading={false}
                            allowChange={false}
                            onDrop={_ => _}
                            imageUrl={this.state.userUnderReview.imageUrl}
                        />

                        <h3>
                            <a href="#"
                               onTouchTap={() => {
                                goTo(`/profile/${this.state.userUnderReview.id}`)
                               }}
                            >
                                {this.state.userUnderReview.firstName}  {this.state.userUnderReview.lastName}
                            </a>
                        </h3>
                    </div>
                }
            </div>
        );
    }
}

export default Review;