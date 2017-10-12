import React from 'react';
import Chip from 'material-ui/Chip';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import ReactStars from 'react-stars'
import FormatQuote from 'material-ui/svg-icons/editor/format-quote';
import IconFileAttachment from 'material-ui/svg-icons/file/attachment';
import apiUser from '../api/user';
import apiReview from '../api/review';
import DOMPurify from 'dompurify'
import * as coreAuth from '../core/auth';
import { goTo } from '../core/navigation';
import * as apiMedia from '../api/media';
import * as requestOrder from '../api/requestOrder';
import * as apiUserPreference from '../api/user-preference';
import Moment from 'react-moment';
import ProfileImage from '../Components/ProfileImage';
import TaskCard from '../Components/TaskCard';
import USER_TYPES from '../Components/USER_TYPES';
import { translate } from '../core/i18n';
import { displayErrorFactory } from '../core/error-handler';
import { getCategoriesAsync } from '../core/categories.js';
import { getConfigAsync } from '../core/config';
import { getUserAsync } from '../core/auth';
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import getUserProperty from '../helpers/get-user-property';
import Loader from "../Components/Loader";

class Profile extends React.Component {
     constructor(props) {
        super();
        const userId = Number(props.params.profileId);

        this.state = {
            isProfileImgLoaded: true,
            isMyProfile: Number(coreAuth.getUserId()) === userId,
            userId,
            open: false,
            isLoading: true,
            isMyTask: false,
            skills: [],
            offers: [],
            reviews: [],
            preferences: [],
            talents: [],
            profile: {}
        };

        this.getUserTalent = this.getUserTalent.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    shouldShowPreferences() {
        return this.state.profile && this.state.profile.userType === USER_TYPES.SELLER;
    }

    getUserTalent(skill) {
        const styles = {
            chip: {
                margin: 4
            }
        };

        return (            
            <Chip style={styles.chip}>
                {skill} 
            </Chip>
        );
    }

    loadData(config) {
        let userId = this.props.params.profileId;

        this.setState({
            config,
            ready: true
        });

        apiUser
            .getItem(userId)
            .then(profile => {
                if (profile.status === '20') {
                    goTo('/');

                    return alert('Page cannot be accessed');
                }

                this.setState({
                    ready: true,
                    isLoading: false,
                    isProfileImgLoaded: false,
                    profile
                });
            });

        apiUserPreference
            .getItems(userId, 'category')
            .then(preferences => this.setState({
                preferences
            }));

        apiReview
            .getItems({
                toUserId: userId
            })
            .then(reviews => this.setState({
                reviews
            }));
    }

    componentDidMount() {
        getUserAsync(user => {
            if (!user) {
                return goTo(`/login?redirectTo=/profile/${this.state.userId}`);
            }

            const categoryLabels = {};

            getCategoriesAsync(categories => {
                categories.forEach(category => {
                    categoryLabels[category.code] = category.label;
                });

                this.setState({
                    categoryLabels
                });

                getConfigAsync(config => {
                    this.loadData(config);
                });
            });
        }, true);
    }

    componentWillReceiveProps() {
        this.setState({
            isLoading: true
        });

        getConfigAsync(config => {
            this.loadData(config);
        });
    }

    onDrop(files) {
            this.setState({ 
                isProfileImgLoaded: true
            });

            apiMedia
            .upload(files[0], {
                width: 150,
                height: 150 
            })
            .then(result => {
                const imageUrl = result.url;
                const profile = this.state.profile;

                profile.imageUrl = imageUrl;  

                this.setState({
                    profile,
                    isProfileImgLoaded: false
                });

                
                apiUser
                .updateItem(this.state.userId, {
                    imageUrl
                })
                .then(() => {
                    
                }, err => {
                    alert('Error in updating profile');
                });

                setTimeout(() => {
                    coreAuth.getUserAsync(user => {
                        try {
                            user.imageUrl = imageUrl;
    
                            coreAuth.setUser(user);
                        } catch (err) {
                            return alert('Error: Could not update internal model.')
                        }
                    });
                }, 500);
            }, err => {
                this.setState({ 
                    isProfileImgLoaded: false
                });

                displayErrorFactory()(err);
            });
        }

        showProfileName() {
            if (!this.state.profile) {
                return '';
            }

            if (!this.state.profile.firstName && !this.state.profile.lastName) {
                return '';
            }

            const profileName = `${this.state.profile.firstName} ${this.state.profile.lastName}`;

            return profileName;
        }

        render() {
            const profileImageUrl = this.state.profile && this.state.profile.imageUrl || '/images/avatar.png';

            const ProfileHeader =
                <div className="row" style={{ 'marginTop': 30}}>
                    <div className="col-xs-12 col-sm-12 col-md-2" style={{ 'paddingTop': 20}}>
                        <ProfileImage
                            isLoading={this.state.isProfileImgLoaded}
                            allowChange={this.state.isMyProfile}
                            onDrop={this.onDrop}
                            image={profileImageUrl}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-10">
                        <div className="row">  
                            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                                { this.state.ready && this.state.profile && 
                                    <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                                        { this.showProfileName() }
                                    </h1>
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                    
                            </div>
                            <div className="col-xs-1"><FormatQuote /></div>
                            <div className="col-xs-11 text-muted" style={{ padding: 10 }} >
                                    { this.state.profile && 
                                        <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.profile.bio)}}></div>
                                    }
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                { this.state.reviews &&
                                    <ReactStars
                                        edit={false}
                                        disable={true}
                                        count={5}
                                        size={16}
                                        half={false}
                                        value={this.state.profile.avgReviewRate}
                                        color2={'#ffd700'}
                                    />
                                }
                            </div>
                            { this.state.profile && this.state.profile.status === '10' &&
                                <div className="col-sm-2 col-xs-6 text-center" style={{ marginTop: 10 }}>
                                    <div className="col-xs-12">
                                        <CheckCircleIcon color={'green'}/>
                                    </div>
                                    <div className="col-xs-12">
                                        <small style={{
                                                paddingBottom: 20,
                                                fontSize: 10
                                        }}>{translate('EMAIL_VERIFIED')}</small>
                                    </div>
                                </div>
                            }
                            { this.state.profile && Boolean(getUserProperty(this.state.profile, 'studentIdUrl')) &&
                                <div className="col-xs-6 col-sm-2 text-center" style={{ marginTop: 10 }}>
                                    <div className="col-xs-12">
                                        <CheckCircleIcon color={'green'}/>
                                    </div>
                                    <div className="col-xs-12">
                                        <small style={{
                                                paddingBottom: 20,
                                                fontSize: 10
                                        }}>{translate('DOCUMENT_UPLOADED')}</small>
                                    </div>
                                </div>
                            }
                            { this.state.profile && Boolean(getUserProperty(this.state.profile, 'referenceUrl')) &&
                                <div className="col-xs-6 col-sm-2 text-center" style={{ marginTop: 10 }}>
                                    <div className="col-xs-12">
                                        <a href={getUserProperty(this.state.profile, 'referenceUrl')} target="_blank">
                                            <IconFileAttachment/>
                                        </a>
                                    </div>
                                    <div className="col-xs-12">
                                        <small style={{
                                                paddingBottom: 20,
                                                fontSize: 10
                                        }}>{translate('PROFILE_REFERENCE_UPLOADED')}</small>
                                    </div>
                                </div>
                            }
                        </div>            

                        { this.state.profile && this.state.profile.website &&
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                                        <a target="_blank" href={this.state.profile.website}> {this.state.profile.website}</a>
                                </div>
                            </div>
                        }   
                        { this.state.isMyProfile &&
                            <div className="row">
                                <div className="col-xs-12" style={{ marginTop: 10 }}>
                                    <RaisedButton label={ translate('EDIT_PROFILE') } onTouchTap={
                                        () => goTo(`/profile/${this.state.profile.id}/edit`)
                                    } />
                                </div>
                            </div>
                        }
                    </div>
                </div>;

        const newOfferBtn = 
            <FloatingActionButton onClick={ () => goTo('/new-listing') } mini={true} backgroundColor={"#546e7a"} >
                <ContentAdd />
            </FloatingActionButton>


        const NoOfferSection = 
            <div className="text-center">
                <h4>{ translate('NO_ACTIVE_LISTINGS') }</h4>
                <RaisedButton onTouchTap={() => goTo('/new-listing')} label={ translate('POST_NEW_LISTING') } primary={true}  />
            </div>;

        const OfferSection =
            <div className="row" style={{ 'marginTop': '40px' }}>
                    <div className="col-xs-12">
                        <h1>
                            { translate('ACTIVE_LISTINGS') }
                            {this.state.isMyProfile && <div className="pull-right">{newOfferBtn}</div> }
                        </h1>
                        <p className="text-muted">{ translate('ACTIVE_LISTINGS_DESC') }</p> 
                    </div>

                    <Divider />
                    
                    <div className="col-xs-12" style={ { marginTop: '20px' }}>                
                        { this.state.offers && this.state.offers.filter(offer => this.state.isMyProfile ? true : offer.status===0).map((offer, _id) =>
                                <div key={offer._id} className="col-xs-12 col-sm-12 col-md-4 text-left" style={{ marginBottom: '40px' }}>
                                    <TaskCard task={offer} displayManagement={this.state.isMyProfile} displayPrice={false} />
                                </div>
                            )
                        }
                    </div>
                </div>       
        ;
        return (
            <div className="container" style={{
                marginBottom: 20
            }}>
                { this.state.isLoading &&
                    <Loader isLoading={true} />
                }

                { !this.state.isLoading &&
                <div className="col-xs-12">
                    { this.state.ready &&
                    <div className="row">
                        <div className="col-xs-12">
                            {ProfileHeader}
                        </div>
                    </div>
                    }
                    { false &&
                    <div className="row">
                        <div className="col-xs-12 col-sm-12">
                            { OfferSection}     

                            { this.state.isMyProfile && this.state.offers && !this.state.offers.length && NoOfferSection }
                        </div>
                    </div>
                    }
                    { this.state.ready &&
                    <div className="row">
                        {this.shouldShowPreferences() &&
                        <div className="col-xs-12 col-sm-12">
                            <div className="row">
                                <div className="col-xs-12 col-sm-11">
                                    <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                                        Preferences
                                    </h1>
                                    {!this.state.preferences.length &&
                                        <p className="text-muted">
                                            No preferences
                                        </p>
                                    }
                                </div>
                                { this.state.isMyProfile &&
                                    <div className="col-xs-12 col-sm-1">     
                                        <FloatingActionButton 
                                            onClick={() => goTo('/user-preferences')}
                                            mini={true}
                                            backgroundColor={"#546e7a"}
                                        >
                                            <ModeEdit />
                                        </FloatingActionButton>
                                    </div>
                                }
                            </div>
                             <div className="col-xs-12" style={{
                                 display: 'flex',
                                 flexWrap: 'wrap'
                            }}>
                            {this.state.preferences
                            .filter(_ => this.state.categoryLabels[_.value])
                            .map(preference =>
                                <Chip
                                    onTouchTap={() => {
                                        goTo(`/?category=${preference.value}`)
                                    }}
                                    style={{
                                        margin: 5
                                    }}
                                >
                                    {this.state.categoryLabels[preference.value]}
                                </Chip>
                            )}
                            </div>
                        </div>
                        }
                        <div className="col-xs-12 col-sm-12">
                            <h1 style={{color: this.state.config.COLOR_PRIMARY}}>
                                Reviews
                            </h1>
                            {!this.state.reviews.filter(review => {
                                if (!review.rate) {
                                    return this.state.isMyProfile;
                                }

                                return true;
                            }).length &&
                                <p className="text-muted">
                                    {translate("NO_REVIEWS")}
                                </p>
                            }

                            {this.state.reviews
                            .filter(review => {
                                if (!review.rate) {
                                    return this.state.isMyProfile;
                                }

                                return true;
                            })
                            .map(review =>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div
                                            style={{ marginTop: 4, paddingLeft: 0, paddingRight: 0}}
                                            className="col-xs-12 col-sm-3 col-md-2"
                                            onTouchTap={() => goTo(`/profile/${review.fromUser.id}`)}
                                        >   
                                                <div className="row">
                                                    <div className="col-xs-4 col-sm-12 text-center" style={{ paddingLeft: 0, paddingRight: 0}}>
                                                        <IconButton
                                                            style={{ bottom: 5 }}
                                                            tooltip={
                                                                `${review.fromUser.firstName} ${review.fromUser.lastName}`
                                                            }
                                                        >
                                                            <Avatar src={review.fromUser.imageUrl || '/images/avatar.png'} />
                                                        </IconButton>
                                                    </div>
                                                    <div className="col-xs-8 col-sm-12" style={{ paddingLeft: 0, paddingRight: 0}}>
                                                        <p className="text-muted text-center hidden-xs">
                                                            {review.fromUser.firstName}<span className="hidden-xs"> {review.fromUser.lastName}</span>
                                                        </p>
                                                        <p className="text-muted visible-xs text-left" style={{ paddingTop: 17 }}>
                                                            {review.fromUser.firstName}
                                                        </p>
                                                    </div>
                                                </div>
                                        </div>
                                     
                                        <div className="col-xs-12 col-sm-9 col-md-10" style={{ paddingLeft: 0, paddingRight: 0}}>
                                        { !review.rate &&
                                            <div className="row" style={{ marginTop: 15 }}>
                                                    <div className="col-xs-12">
                                                        {translate("YOU_MUST_LEAVE_REVIEW")}
                                                    </div>
                                                    <div className="col-xs-12" style={{ marginTop: 5 }}>
                                                        <RaisedButton
                                                            labelStyle={{color: 'white '}}
                                                            backgroundColor={this.state.config.COLOR_PRIMARY}
                                                            label={translate('LEAVE_REVIEW')}
                                                            onTouchTap={() => {
                                                                if (review.orderId) {
                                                                    requestOrder
                                                                    .getCorrespondingRequestForOrder(review.orderId)
                                                                    .then(request => {
                                                                        return goTo(`/request/${request.id}/review`);
                                                                    })
                                                                }

                                                                if (review.requestId) {
                                                                    requestOrder
                                                                    .getCorrespondingOrderForRequest(review.requestId)
                                                                    .then(order => {
                                                                        return goTo(`/order/${order.id}/review`);
                                                                    })
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                            </div>
                                        }
                                        { review.rate &&
                                        <div className="row">
                                                <div className="col-xs-12">
                                                    <div style={{
                                                        lineHeight: 2
                                                    }}>
                                                        <ReactStars
                                                            edit={false}
                                                            disable={true}
                                                            count={5}
                                                            size={16}
                                                            half={false}
                                                            value={review.rate}
                                                            color2={'#ffd700'}
                                                        />
                                                    </div>
                                                </div>
                                        </div>
                                        }
                                        { review.rate &&
                                        <div className="row">
                                            <div className="col-xs-12" style={{ padding: 30}}>
                                                <div className="row content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(review.body)}}></div> 
                                            </div>
                                        </div>
                                        }
                                        { review.rate &&
                                        <div className="row">
                                            <div className="col-xs-12 text-muted">
                                                    <Moment format="MM.YYYY">{review.createdAt}</Moment>
                                                    <span> </span>
                                                    <a style={{ cursor: 'pointer' }} onClick={() => goTo(`/task/${review.task.id}`)}>
                                                        {review.task.title}
                                                    </a>
                                            </div>
                                        </div>
                                        }
                                        </div>
                                        
                                        <div className="col-xs-12">
                                        <hr />
                                    </div>
                                </div>
                            </div>
                            )}

                        </div>
                    </div>
                    }
                </div>
                }
            </div>
            );
    }
}  

export default Profile;
