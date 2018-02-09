import React from 'react';
import Chip from 'material-ui/Chip';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Badge from 'material-ui/Badge';
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
import {goTo, convertToAppPath} from '../core/navigation';
import * as apiMedia from '../api/media';
import * as requestOrder from '../api/requestOrder';
import * as apiUserPreference from '../api/user-preference';
import Moment from 'react-moment';
import ProfileImage from '../Components/ProfileImage';
import TaskCard from '../Components/TaskCard';
import USER_TYPES from '../Components/USER_TYPES';
import {translate} from '../core/i18n';
import {displayErrorFactory} from '../core/error-handler';
import {getCategoriesAsync} from '../core/categories.js';
import {CONFIG} from '../core/config';
import {getUserAsync} from '../core/auth';
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
            skills: [],
            offers: [],
            reviews: [],
            preferences: [],
            talents: [],
            profile: {}
        };

        this.getUserTalent = this
            .getUserTalent
            .bind(this);
        this.onDrop = this
            .onDrop
            .bind(this);
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

    loadData() {
        const config = CONFIG;
        let userId = this.props.params.profileId;

        this.setState({ready: true});

        apiUser
            .getItem(userId)
            .then(profile => {
                if (profile.status === '20') {
                    goTo('/');

                    return alert('Page cannot be accessed');
                }

                this.setState({ready: true, isLoading: false, isProfileImgLoaded: false, profile});
            });

        apiUserPreference
            .getItems(userId, 'category')
            .then(preferences => this.setState({preferences}));

        apiReview
            .getItems({toUserId: userId})
            .then(reviews => {
                this.setState({reviews});
            });
    }

    componentDidMount() {
        getUserAsync(user => {
            if (CONFIG.USER_ENABLE_PUBLIC_VIEW !== "1" && !user) {
                return goTo(`/login?redirectTo=/profile/${this.state.userId}`);
            }

            const categoryLabels = {};

            getCategoriesAsync(categories => {
                categories.forEach(category => {
                    categoryLabels[category.code] = category.label;
                });

                this.setState({categoryLabels});

                this.loadData();
            });
        }, true);
    }

    componentWillReceiveProps() {
        this.setState({isLoading: true});

        this.loadData();
    }

    onDrop(files) {
        this.setState({isProfileImgLoaded: true});

        apiMedia.upload(files[0], {
            width: 150,
            height: 150
        }).then(result => {
            const imageUrl = result.url;
            const profile = this.state.profile;

            profile.imageUrl = imageUrl;

            this.setState({profile, isProfileImgLoaded: false});

            apiUser
                .updateItem(this.state.userId, {imageUrl})
                .then(() => {}, err => {
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
            this.setState({isProfileImgLoaded: false});

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
        const profileImageUrl = this.state.profile && this.state.profile.imageUrl || CONFIG.USER_PROFILE_IMAGE_URL || '/images/avatar.png';

        const ProfileHeader = <div className="row" style={{
            'marginTop': 30
        }}>
            <div
                className="col-xs-12 col-sm-12 col-md-2"
                style={{
                'paddingTop': 20
            }}>
                <ProfileImage
                    isLoading={this.state.isProfileImgLoaded}
                    allowChange={this.state.isMyProfile}
                    onDrop={this.onDrop}
                    imageUrl={profileImageUrl}/>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-10">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        {this.state.ready && this.state.profile && <h1
                            style={{
                            color: CONFIG.COLOR_PRIMARY
                        }}>
                            {this.showProfileName()}
                        </h1>
}
                    </div>
                </div>
                {this.state.profile.bio && this.state.profile.bio.length > 0 && (
                    <div className="row">
                        <div className="col-xs-12"></div>

                        <div className="col-xs-1"><FormatQuote/></div>
                        <div
                            className="col-xs-11 text-muted"
                            style={{
                            padding: 10
                        }}>
                            {this.state.profile && <div
                                className="content"
                                dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(this.state.profile.bio)
                            }}></div>
}
                        </div>
                    </div>
                )
}

                <div className="row">
                    <div className="col-xs-12">
                        {this.state.reviews && <ReactStars
                            edit={false}
                            disable={true}
                            count={5}
                            size={16}
                            value={Math.round(this.state.profile.avgReviewRate * 2) / 2}
                            color2={'#ffd700'}/>
}
                    </div>
                    {this.state.profile && this.state.profile.status === '10' && <div
                        className="col-xs-12"
                        style={{
                        marginTop: 10
                    }}>
                        <Chip labelColor={'white'} backgroundColor={'#4CAF50'}>
                            <Avatar
                                backgroundColor={'#43A047'}
                                color={'white'}
                                icon={< CheckCircleIcon />}/> {translate('EMAIL_VERIFIED')}
                        </Chip>
                    </div>
}

                    {((this.state.profile && this.state.profile.userType === 0 && (CONFIG.USER_DOCUMENTS_ENABLED_FOR_SUPPLY === "1" || CONFIG.USER_DOCUMENTS_ENABLED_FOR_DEMAND === "1")) || (this.state.profile && this.state.profile.userType === 1 && CONFIG.USER_DOCUMENTS_ENABLED_FOR_DEMAND === "1") || (this.state.profile && this.state.profile.userType === 2 && CONFIG.USER_DOCUMENTS_ENABLED_FOR_SUPPLY === "1")) && this.state.profile && Boolean(getUserProperty(this.state.profile, 'studentIdUrl')) && <div
                        className="col-xs-12"
                        style={{
                        marginTop: 10
                    }}>
                        <Chip labelColor={'white'} backgroundColor={'#4CAF50'}>
                            <Avatar
                                backgroundColor={'#43A047'}
                                color={'white'}
                                icon={< CheckCircleIcon />}/> {translate('DOCUMENT_UPLOADED')}
                        </Chip>
                    </div>
}
                    {((this.state.profile && this.state.profile.userType === 0 && (CONFIG.USER_VERIFICATIONS_ENABLED_FOR_SUPPLY === "1" || CONFIG.USER_VERIFICATIONS_ENABLED_FOR_DEMAND === "1")) || (this.state.profile && this.state.profile.userType === 1 && CONFIG.USER_VERIFICATIONS_ENABLED_FOR_DEMAND === "1") || (this.state.profile && this.state.profile.userType === 2 && CONFIG.USER_VERIFICATIONS_ENABLED_FOR_SUPPLY === "1")) && this.state.profile && Boolean(getUserProperty(this.state.profile, 'referenceUrl')) && <div
                        className="col-xs-12"
                        style={{
                        marginTop: 10
                    }}>
                        <Chip labelColor={'white'} backgroundColor={'#4CAF50'}>
                            <Avatar
                                backgroundColor={'#43A047'}
                                color={'white'}
                                icon={< IconFileAttachment />}/> {translate('PROFILE_REFERENCE_UPLOADED')}
                        </Chip>
                    </div>
}
                </div>

                {this.state.profile && this.state.profile.website && <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        <a target="_blank" href={this.state.profile.website}>
                            {this.state.profile.website}</a>
                    </div>
                </div>
}
                {false && this.state.isMyProfile && <div className="row">
                    <div
                        className="col-xs-12"
                        style={{
                        marginTop: 10
                    }}>
                        <RaisedButton
                            label={translate('EDIT_PROFILE')}
                            onTouchTap={() => goTo(`/profile/${this.state.profile.id}/edit`)}/>
                    </div>
                </div>
}
            </div>
        </div>;

        const newOfferBtn = <FloatingActionButton
            onClick={() => goTo('/new-listing')}
            mini={true}
            backgroundColor={"#546e7a"}>
            <ContentAdd/>
        </FloatingActionButton>

        const NoOfferSection = <div className="text-center">
            <h4>{translate('NO_ACTIVE_LISTINGS')}</h4>
            <RaisedButton
                onTouchTap={() => goTo('/new-listing')}
                label={translate('POST_NEW_LISTING')}
                primary={true}/>
        </div>;

        const OfferSection = <div className="row" style={{
            'marginTop': '40px'
        }}>
            <div className="col-xs-12">
                <h1>
                    {translate('ACTIVE_LISTINGS')}
                    {this.state.isMyProfile && <div className="pull-right">{newOfferBtn}</div>}
                </h1>
                <p className="text-muted">{translate('ACTIVE_LISTINGS_DESC')}</p>
            </div>

            <Divider/>

            <div
                className="col-xs-12"
                style={{
                marginTop: '20px'
            }}>
                {this.state.offers && this
                    .state
                    .offers
                    .filter(offer => this.state.isMyProfile
                        ? true
                        : offer.status === 0)
                    .map((offer, _id) => <div
                        key={offer._id}
                        className="col-xs-12 col-sm-12 col-md-4 text-left"
                        style={{
                        marginBottom: '40px'
                    }}>
                        <TaskCard
                            task={offer}
                            displayManagement={this.state.isMyProfile}
                            displayPrice={false}/>
                    </div>)
}
            </div>
        </div>;
        return (
            <div
                className="container"
                style={{
                marginBottom: 20
            }}>
                {this.state.isLoading && <Loader isLoading={true}/>
}

                {!this.state.isLoading && <div className="col-xs-12">
                    {this.state.ready && <div className="row">
                        <div className="col-xs-12">
                            {ProfileHeader}
                        </div>
                    </div>
}
                    {false && <div className="row">
                        <div className="col-xs-12 col-sm-12">
                            {OfferSection}

                            {this.state.isMyProfile && this.state.offers && !this.state.offers.length && NoOfferSection}
                        </div>
                    </div>
}
                    {this.state.ready && <div
                        className="row"
                        style={{
                        marginTop: 20
                    }}>
                        {((this.state.profile && this.state.profile.userType === 0 && (CONFIG.USER_PREFERENCES_ENABLED_FOR_SUPPLY === "1" || CONFIG.USER_PREFERENCES_ENABLED_FOR_DEMAND === "1")) || (this.state.profile && this.state.profile.userType === 1 && CONFIG.USER_PREFERENCES_ENABLED_FOR_DEMAND === "1") || (this.state.profile && this.state.profile.userType === 2 && CONFIG.USER_PREFERENCES_ENABLED_FOR_SUPPLY === "1")) && <div className="col-xs-12 col-sm-12">
                            <div className="row">
                                <div className="col-xs-12 col-sm-11">
                                    <h1
                                        style={{
                                        color: CONFIG.COLOR_PRIMARY
                                    }}>
                                        {translate("PROFILE_PREFERENCES_HEADER")}
                                    </h1>
                                    <p className="text-muted">
                                        {translate("PROFILE_PREFERENCES_DESC")}
                                    </p>
                                    {!this.state.preferences.length && <p className="text-muted">
                                        {translate("PROFILE_PREFERENCES_NONE")}
                                    </p>
}
                                </div>
                                {false && this.state.isMyProfile && <div className="col-xs-12 col-sm-1">
                                    <FloatingActionButton
                                        onClick={() => goTo(`/user-preferences?redirectTo=${convertToAppPath(location.pathname)}`)}
                                        mini={true}
                                        backgroundColor={"#546e7a"}>
                                        <ModeEdit/>
                                    </FloatingActionButton>
                                </div>
}
                            </div>
                            <div
                                className="col-xs-12"
                                style={{
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}>
                                {this
                                    .state
                                    .preferences
                                    .filter(_ => this.state.categoryLabels[_.value])
                                    .map((preference, index) => <Chip
                                        key={index}
                                        onTouchTap={() => {
                                        goTo(`/?category=${preference.value}`)
                                    }}
                                        style={{
                                        margin: 5
                                    }}>
                                        {this.state.categoryLabels[preference.value]}
                                    </Chip>)}
                            </div>
                        </div>
}
                        {((this.state.profile && this.state.profile.userType === 0 && ((CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED === "1") || (CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED === "1"))) || (this.state.profile && this.state.profile.userType === 1 && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_ENABLED === "1") || (this.state.profile && this.state.profile.userType === 2 && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_ENABLED === "1")) && <div
                            className="col-xs-12 col-sm-12"
                            style={{
                            marginTop: 20
                        }}>
                            <h1
                                style={{
                                color: CONFIG.COLOR_PRIMARY
                            }}>
                                {translate("PROFILE_REVIEWS_HEADER")}
                            </h1>
                            <p className="text-muted">
                                {translate("PROFILE_REVIEWS_DESC")}
                            </p>
                            {!this.state.reviews.length && <p className="text-muted">
                                {translate("NO_REVIEWS")}
                            </p>
}

                            {this.state.isMyProfile && this
                                .state
                                .reviews
                                .map((review, index) => <div key={index} className="row">
                                    <div className="col-xs-12">
                                        <div
                                            style={{
                                            marginTop: 4,
                                            paddingLeft: 0,
                                            paddingRight: 0
                                        }}
                                            className="col-xs-12 col-sm-3 col-md-2"
                                            onTouchTap={() => goTo(`/profile/${review.fromUser.id}`)}>
                                            <div className="row">
                                                <div
                                                    className="col-xs-4 col-sm-12 text-center"
                                                    style={{
                                                    paddingLeft: 0,
                                                    paddingRight: 0
                                                }}>
                                                    <IconButton
                                                        style={{
                                                        bottom: 5
                                                    }}
                                                        tooltip={`${review.fromUser.firstName} ${review.fromUser.lastName}`}>
                                                        <Avatar
                                                            src={review.fromUser.imageUrl || CONFIG.USER_PROFILE_IMAGE_URL || '/images/avatar.png'}/>
                                                    </IconButton>
                                                </div>
                                                <div
                                                    className="col-xs-8 col-sm-12"
                                                    style={{
                                                    paddingLeft: 0,
                                                    paddingRight: 0
                                                }}>
                                                    <p className="text-muted text-center hidden-xs">
                                                        {review.fromUser.firstName}<span className="hidden-xs">
                                                            {review.fromUser.lastName}</span>
                                                    </p>
                                                    <p
                                                        className="text-muted visible-xs text-left"
                                                        style={{
                                                        paddingTop: 17
                                                    }}>
                                                        {review.fromUser.firstName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-xs-12 col-sm-9 col-md-10"
                                            style={{
                                            paddingLeft: 0,
                                            paddingRight: 0
                                        }}>
                                            {((CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS === "1") || (CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS === "1")) && !review.rate && <div
                                                className="row"
                                                style={{
                                                marginTop: 15
                                            }}>
                                                <div className="col-xs-12">
                                                    {translate("YOU_MUST_LEAVE_REVIEW")}
                                                </div>
                                                <div
                                                    className="col-xs-12"
                                                    style={{
                                                    marginTop: 5
                                                }}>
                                                    <RaisedButton
                                                        labelStyle={{
                                                        color: 'white '
                                                    }}
                                                        backgroundColor={CONFIG.COLOR_PRIMARY}
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
                                                    }}/>
                                                </div>
                                            </div>
}
                                            {((CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS !== "1") || (CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS !== "1")) && review.rate && <div className="row">
                                                <div className="col-xs-12">
                                                    <div
                                                        style={{
                                                        lineHeight: 2
                                                    }}>
                                                        <ReactStars
                                                            edit={false}
                                                            disable={true}
                                                            count={5}
                                                            size={16}
                                                            half={false}
                                                            value={review.rate}
                                                            color2={'#ffd700'}/>
                                                    </div>
                                                </div>
                                            </div>
}
                                            {((CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS !== "1") || (CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS !== "1")) && review.rate && <div className="row">
                                                <div
                                                    className="col-xs-12"
                                                    style={{
                                                    padding: 30
                                                }}>
                                                    <div
                                                        className="row content"
                                                        dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(review.body)
                                                    }}></div>
                                                </div>
                                            </div>
}
                                            <div
                                                className="row"
                                                style={{
                                                marginTop: 15
                                            }}>
                                                <div className="col-xs-12 text-muted">
                                                    <Moment format={`${CONFIG.DATE_FORMAT}, ${CONFIG.TIME_FORMAT}`}>{review.createdAt}</Moment>
                                                    <span></span>
                                                    <a
                                                        style={{
                                                        cursor: 'pointer'
                                                    }}
                                                        onClick={() => goTo(`/task/${review.task.id}`)}>
                                                        {review.task.title}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xs-12">
                                            <hr/>
                                        </div>
                                    </div>
                                </div>)}

                            {!this.state.isMyProfile && this
                                .state
                                .reviews
                                .filter(review => {
                                    return ((((CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS !== "1") || (CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS !== "1")) || ((CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_SUPPLY_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS === "1") || (CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS === "1" && CONFIG.LISTING_TASK_WORKFLOW_FOR_DEMAND_LISTINGS_REVIEW_STEP_REQUIRE_BOTH_REVIEWS === "1") && review.rate)))
                                })
                                .map((review, index) => <div key={index} className="row">
                                    <div className="col-xs-12">
                                        <div
                                            style={{
                                            marginTop: 4,
                                            paddingLeft: 0,
                                            paddingRight: 0
                                        }}
                                            className="col-xs-12 col-sm-3 col-md-2"
                                            onTouchTap={() => goTo(`/profile/${review.fromUser.id}`)}>
                                            <div className="row">
                                                <div
                                                    className="col-xs-4 col-sm-12 text-center"
                                                    style={{
                                                    paddingLeft: 0,
                                                    paddingRight: 0
                                                }}>
                                                    <IconButton
                                                        style={{
                                                        bottom: 5,
                                                        padding: 0
                                                    }}
                                                        tooltip={`${review.fromUser.firstName} ${review.fromUser.lastName}`}>
                                                        <Avatar
                                                            src={review.fromUser.imageUrl || CONFIG.USER_PROFILE_IMAGE_URL || '/images/avatar.png'}/>
                                                    </IconButton>
                                                </div>
                                                <div
                                                    className="col-xs-8 col-sm-12"
                                                    style={{
                                                    paddingLeft: 0,
                                                    paddingRight: 0
                                                }}>
                                                    <p className="text-muted text-center hidden-xs">
                                                        {review.fromUser.firstName}<span className="hidden-xs">
                                                            {review.fromUser.lastName}</span>
                                                    </p>
                                                    <p
                                                        className="text-muted visible-xs text-left"
                                                        style={{
                                                        paddingTop: 17
                                                    }}>
                                                        {review.fromUser.firstName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="col-xs-12 col-sm-9 col-md-10"
                                            style={{
                                            paddingLeft: 0,
                                            paddingRight: 0
                                        }}>

                                            <div className="row">
                                                <div className="col-xs-12">
                                                    <div
                                                        style={{
                                                        lineHeight: 2
                                                    }}>
                                                        <ReactStars
                                                            edit={false}
                                                            disable={true}
                                                            count={5}
                                                            size={16}
                                                            half={false}
                                                            value={review.rate}
                                                            color2={'#ffd700'}/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div
                                                    className="col-xs-12"
                                                    style={{
                                                    padding: 30
                                                }}>
                                                    {JSON.stringify(review, null, 2)
}
                                                    <div
                                                        className="row content"
                                                        dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(review.body)
                                                    }}></div>
                                                </div>
                                            </div>
                                            <div
                                                className="row"
                                                style={{
                                                marginTop: 15
                                            }}>
                                                <div className="col-xs-12 text-muted">
                                                    <Moment format={`${CONFIG.DATE_FORMAT}, ${CONFIG.TIME_FORMAT}`}>{review.createdAt}</Moment>
                                                    <span></span>
                                                    <a
                                                        style={{
                                                        cursor: 'pointer'
                                                    }}
                                                        onClick={() => goTo(`/task/${review.task.id}`)}>
                                                        {review.task.title}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xs-12">
                                            <hr/>
                                        </div>
                                    </div>
                                </div>)}

                        </div>
}

                    </div>
}
                </div>
}
            </div>
        );
    }
}

export default Profile;
