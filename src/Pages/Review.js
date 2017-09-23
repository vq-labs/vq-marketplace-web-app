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
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';

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
            reviewType,
            requestId,
            orderId,
            request: null,
            order: null,
            config: null,
            body: '',
            selectedRating: 0,
            isLoading: true
        };
    }
    componentDidMount() {
        getConfigAsync(config => {
            getUserAsync(user => {
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
            }, false);
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
                                onChange={(ev, body) => {
                                    this.setState({ body });
                                }}
                                value={this.state.body} 
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
                                disabled={this.state.isProcessing || this.state.isProcessed}
                                labelStyle={{color: 'white '}}
                                backgroundColor={this.state.config.COLOR_PRIMARY}
                                label={translate("SUBMIT")}
                                onTouchTap={() => {
                                    const reviewType = this.state.reviewType;
                                    const order = this.state.order;
                                    const request = this.state.request;

                                    const orderId = order ? order.id : null;
                                    const requestId = request ? request.id : null;


                                    const review = {
                                        rate: String(this.state.selectedRating),
                                        body: this.state.body
                                    };


                                    if (!this.state.selectedRating) {
                                        return alert('Rate is required (min. 1 start)');
                                    }

                                    if (!this.state.body) {
                                        return alert('Review text is required');
                                    }

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

                                            goTo('/review-completed')

                                            console.log(review);
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
                {this.state.config && this.state.userUnderReview &&
                    <div className="col-md-4 text-center" style={{ paddingTop: 50 }}>
                        <ProfileImage
                            isLoading={false}
                            allowChange={false}
                            onDrop={_ => _}
                            image={this.state.userUnderReview.imageUrl}
                        />

                        <h3><a href="#" onTouchTap={() => {
                            goTo(`/profile/${this.state.userUnderReview.id}`)
                        }}>{this.state.userUnderReview.firstName}  {this.state.userUnderReview.lastName}</a></h3>
                    </div>
                }
            </div>
        );
    }
}

export default Review;