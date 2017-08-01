import React from 'react';
import Chip from 'material-ui/Chip';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FormatQuote from 'material-ui/svg-icons/editor/format-quote';
import apiTask from '../api/task';
import apiUser from '../api/user';
import * as apiSkills from '../api/skills';
import * as coreAuth from '../core/auth';
import * as coreNavigation from '../core/navigation';
import * as apiMedia from '../api/media';
import * as apiUserProperty from '../api/user-property.js';

import ProfileImage from '../Components/ProfileImage';
import EditableSkill from '../Components/EditableSkill';
import TaskCard from '../Components/TaskCard';
import { translate } from '../core/i18n';

import '../App.css';

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
            talents: [],
            profile: {}
        };

        this.getUserTalent = this.getUserTalent.bind(this);
        this.onDrop = this.onDrop.bind(this);
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

    componentDidMount() {
        let userId = this.props.params.profileId;
        let section = this.props.params.section;
        let isMyProfile = coreAuth.getUserId() === userId;

        const getProfileTasks = () => apiTask.getItems({
            status: isMyProfile ? undefined : 0,
            userId: userId,
            taskType: 1
        })
        .then(offers => {
            this.setState({
                offers: offers
            });
        });

        getProfileTasks();

        apiUser
            .getItem(userId)
            .then(result => {
                this.setState({
                    isLoading: false,
                    isProfileImgLoaded: false,
                    profile: result,
                    section: section,
                });
            });
        }
        
        onDrop(files) {
            this.setState({ 
                isProfileImgLoaded: true
            });

            apiMedia.upload(files[0], {
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
                });
            })
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
                <div className="row" style={{ 'marginTop': 30}} >
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
                                { this.state.profile && 
                                    <h1>
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
                                        <p>{ this.state.profile.bio }</p>
                                    }
                            </div>
                            </div>
                            <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                                { this.state.profile && 
                                    <a target="_blank" href={this.state.profile.website}> {this.state.profile.website}</a>
                                }
                            </div>
                        </div>
                        { this.state.isMyProfile &&
                            <div className="row">
                                <div className="col-xs-12" style={{ marginTop: 10 }}>
                                    <RaisedButton label={ translate('EDIT_PROFILE') } onTouchTap={
                                        () => coreNavigation.goTo(`/profile/${this.state.profile.id}/edit`)
                                    } />
                                </div>
                            </div>
                        }
                    </div>
                </div>;

        const newOfferBtn = 
            <FloatingActionButton onClick={ () => coreNavigation.goTo('/new-listing') } mini={true} backgroundColor={"#546e7a"} >
                <ContentAdd />
            </FloatingActionButton>


        const NoOfferSection = 
            <div className="text-center">
                <h4>{ translate('NO_ACTIVE_LISTINGS') }</h4>
                <RaisedButton onTouchTap={() => coreNavigation.goTo('/new-listing')} label={ translate('POST_NEW_LISTING') } primary={true}  />
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
                        { this.state.offers && this.state.offers.filter( offer => this.state.isMyProfile ? true : offer.status===0).map((offer, _id) =>
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
                <div className="col-xs-12"> 
                    <div className="row">
                        <div className="col-xs-12">
                            {ProfileHeader}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12">
                            {OfferSection}     

                            { this.state.isMyProfile && this.state.offers && !this.state.offers.length && NoOfferSection }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12">
                            <h1>Reviews</h1>
                            <p className="text-muted">
                                No reviews
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            );
    }
}  

export default Profile;
