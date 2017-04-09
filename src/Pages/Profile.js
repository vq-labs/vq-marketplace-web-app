import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Chip from 'material-ui/Chip';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FormatQuote from 'material-ui/svg-icons/editor/format-quote';
import * as apiSkills from '../api/skills';
import apiTask from '../api/task';
import apiUser from '../api/user';
import * as coreAuth from '../core/auth';
import * as coreNavigation from '../core/navigation';
import * as apiMedia from '../api/media';

import ProfileImage from '../Components/ProfileImage';
import EditableSkill from '../Components/EditableSkill';
import TaskCard from '../Components/TaskCard';
import { translate } from '../core/i18n';

import '../App.css';

class Profile extends Component {
  constructor() {
      super();
      this.state={
        isMyProfile: false,
        userId: '',
        open: false,
        applicationInProgress: false,
        isLoading: true,
        isMyTask: false,
        skills: [],
        offers: [],
        profile: {
            talents: [],
            profile : {}
        }
    };

    this.getUserTalent=this.getUserTalent.bind(this);
    this.goToNewTask=this.goToNewTask.bind(this);
    this.onDrop=this.onDrop.bind(this);
  }

 getUserTalent(skill) {
    const styles={
        chip: {
            margin: 4,
        }
    };

    return (            
        <Chip style={styles.chip}>
            {skill} 
        </Chip>
    );
  }

  componentDidMount() {
    let userId=this.props.params.profileId;
    let section=this.props.params.section;

    apiSkills.getItems().then(skills => {
        this.setState( { skills: skills });
    });

    apiTask.getItems({
        owner_user_id: userId,
        task_type: 1
    }).then(offers => {
        this.setState( { offers: offers });
    });

    apiUser.getItem(userId).then(result => this.setState({
        isMyProfile: coreAuth.getUserId()===userId,
        userId: userId,
        profile: result,
        section: section,
    }));

    coreAuth.addListener('login', () => this.setState({
        sMyProfile: coreAuth.getUserId()===userId,
    }));
  }

  goToNewTask() {
      browserHistory.push('/new-task');
  }

  onDrop(files) {
      apiMedia.upload(files[0], { width: 150, height: 150 })
        .then(result => {
            const imageUrl = result.url;
            const profile = this.state.profile;

            profile.profile.imageUrl = imageUrl;  
            
            this.setState({ profile });

            apiUser.updateItem(this.state.user._id, { profile: { imageUrl } });
        })
  }

  render() {
   

    const ProfileHeader = 
            <div className="row" style={{ 'marginTop': 30}} >
                <div className="col-xs-12 col-sm-3 col-md-2" style={{ 'paddingTop': 20}}>
                    <ProfileImage allowChange={this.state.isMyProfile} onDrop={this.onDrop} image={this.state.profile.profile && this.state.profile.profile.imageUrl || 'https://studentask.de/images/avatar.png'} />
                </div>
                <div className="col-xs-12 col-sm-9 col-md-10">
                    <div className="row">  
                        <div className="col-xs-12 col-sm-8 col-md-7 col-lg-7">
                            { this.state.profile.profile && 
                                <h1>
                                    { this.state.profile.profile.firstName + ' ' + this.state.profile.profile.lastName }
                                </h1>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                              
                        </div>
                        <div className="col-xs-1"><FormatQuote /></div>
                        <div className="col-xs-11 text-muted" style={{ padding: 10 }} >
                             { this.state.profile.profile && 
                                <p>{ this.state.profile.profile.bio }</p>
                             }
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-xs-12 col-sm-8 col-md-7 col-lg-7">
                            { this.state.profile.profile && 
                                <a target="_blank" href={this.state.profile.profile.website}> {this.state.profile.profile.website}</a>
                            }
                        </div>
                    </div>
                    { this.state.isMyProfile &&
                        <div className="row">
                            <div className="col-xs-12" style={{ marginTop: 10 }}>
                                <RaisedButton label={ translate('EDIT_PROFILE') } onTouchTap={ () => coreNavigation.goTo(`/profile/${this.state.profile._id}/edit`)} />
                            </div>
                        </div>
                    }
                </div>
            </div>;
    const newOfferBtn = 
   
        <FloatingActionButton onClick={ () => browserHistory.push('app/new-listing') } mini={true} backgroundColor={"#546e7a"} >
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
                    <h2>
                        { translate('ACTIVE_LISTINGS') }
                        {this.state.isMyProfile && <div className="pull-right">{newOfferBtn}</div> }
                    </h2>
                    <p className="text-muted">{ translate('ACTIVE_LISTINGS_DESC') }</p> 
                </div>

                <Divider />
                
                <div className="col-xs-12" style={ { marginTop: '20px' } }>                
                    { this.state.offers && this.state.offers.filter( offer => this.state.isMyProfile ? true : offer.status===0).map((offer, _id) =>
                            <div key={offer._id} className="col-xs-12 col-sm-6 text-left" style={{ 'marginBottom': '40px' }}>
                                <TaskCard task={offer} displayManagement={this.state.isMyProfile} displayPrice={false} />
                            </div>
                        )
                    }
                </div>
         </div>       
    ;

    const SkillSection = 
        <Paper style={{ 'marginTop': '40px' }}>
                            <div className="row">
                                <div className="col-xs-12">
                                    <h2 style={{ padding: 2, marginLeft: 10 }}>
                                        <span>{ translate('TALENTS') }</span>
                                        { this.state.isMyProfile && 
                                            <div style={ { float: 'right', padding: '5px' }}>
                                                <FloatingActionButton mini={true} backgroundColor={"#546e7a"} 
                                                    onClick={ () => {
                                                        const profile = this.state.profile;
                                                        
                                                        profile.talents.unshift({
                                                            level: 0, 
                                                            name: '', 
                                                            editMode: true 
                                                        });
                                                        
                                                        this.setState({ profile });
                                                    }} >
                                                    <ContentAdd />
                                                </FloatingActionButton>
                                            </div>
                                        }
                                    </h2>
                                </div>
                            </div>
                             { this.state.profile.talents.length === 0 &&
                                <div className="row">
                                    <div className="col-xs-12" style={{ marginLeft: 10, paddingBottom: 10 }}>
                                       { translate('NO_TALENTS') }
                                    </div>    
                                </div>    
                             }
                            { this.state.profile.talents.map((talent, index) =>
                            <div className="row" key={`talent-${index}-${talent.editMode}`} >
                                <EditableSkill
                                    skillId={talent._id}
                                    allowChange={this.state.isMyProfile}
                                    skill={talent} 
                                    options={this.state.skills}
                                    onCancel={
                                        skill => {
                                            if (!skill._id) {
                                                const profile = this.state.profile;

                                                profile.talents.splice(index, 1);

                                                this.setState( { profile });
                                            }
                                        }
                                    }
                                    onConfirm={ skill => {
                                        if (skill.skillId) {
                                            // @todo differentiate between create and update
                                            apiSkills.createItem({ skill });
                                        } else {
                                            apiSkills.createItem({ skill }).then(talent => {
                                                const profile = this.state.profile;

                                                profile.talents[index] = talent;

                                                this.setState({ profile });
                                            });
                                        }
                                    }}
                                    onDelete={ () => {
                                        apiSkills.deleteItem(this.state.userId, talent._id);
                                        
                                        const index = this.state.profile.talents.indexOf(talent);
                                        
                                        this.state.profile.talents.splice(index, 1);
                                        
                                        this.setState( { profile: this.state.profile });
                                    }}
                                />
                            </div>        
                            ) }
        </Paper>;

    return (
        <div className="container" style={{ marginBottom: 20 }}>
            <div className="col-xs-12"> 
                <div className="row">
                    <div className="col-xs-12">
                        {ProfileHeader}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-4">
                        {SkillSection}   
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-8">
                        {OfferSection}     

                        { this.state.isMyProfile && this.state.offers && !this.state.offers.length && NoOfferSection }
                    </div>
                </div>
            </div>
        </div>
      );
   }
}  

export default Profile;
