import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Card,  CardTitle } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FormatQuote from 'material-ui/svg-icons/editor/format-quote';
import StActions from '../StActions';
import * as apiSkills from '../api/skills';
import apiTask from '../api/task';
import apiUser from '../api/user';
import * as coreAuth from '../core/auth';

import ProfileImage from '../Components/ProfileImage';
import EditableSkill from '../Components/EditableSkill';
import EditableText from '../Components/EditableText';

import TaskCard from '../Components/TaskCard';

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

    this.goToDashboard=this.goToDashboard.bind(this);
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
  
  goToDashboard() {
    browserHistory.push('/profile/'+this.state.userId+'/dashboard');
    this.setState({ section: 'dashboard' });
  }

  goToNewTask() {
      browserHistory.push('/new-task');
  }

  onDrop(files) {
        StActions.uploadImage(files[0], response => {
         
            const profile = this.state.profile;

            profile.profile.imageUrl= response.url;  
        
            this.setState({ profile });
        });
  }

  render() {
   

    const ProfileHeader = 
            <div className="row">
                <div className="col-xs-12 col-sm-3 col-md-2">
                    <ProfileImage allowChange={this.state.isMyProfile} onDrop={this.onDrop} image={this.state.profile.profile.imageUrl || 'https://studentask.de/images/avatar.png'} />
                </div>
                <div className="col-xs-12 col-sm-9 col-md-10">
                    <div className="row">  
                        <div className="col-xs-12 col-sm-8 col-md-7 col-lg-7">
                            <h1 style={{ 'marginTop': '20px'  }}>
                                <EditableText 
                                    style={{  'marginTop': '20px'  }}
                                    fields={{
                                        firstName: { type: 'string', placeholder: 'Vorname' },
                                        lastName: { type: 'string', placeholder: 'Nachname' }
                                    }}
                                    values={this.state.profile.profile}
                                    displayValue={
                                        this.state.profile.profile.firstName + ' ' + this.state.profile.profile.lastName
                                    }
                                    placeholder={ 'Dein Name' }
                                    onCancel={ () => {}}
                                    onChange={ newProfile => {
                                        const profile=this.state.profile;
                                        
                                        profile.profile.firstName=newProfile.firstName;
                                        profile.profile.lastName=newProfile.lastName;

                                        this.setState({ isLoading: true, profile });

                                        apiUser.updateItem(coreAuth.getUserId(), { profile: { 
                                            firstName: profile.profile.firstName, 
                                            lastName: profile.profile.lastName 
                                        }}).then(() => this.setState({ isLoading: false }));
                                    }}
                            />
                            </h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                              
                        </div>
                        <div className="col-xs-1"><FormatQuote /></div>
                        <div className="col-xs-11" style={{  'padding': 10  }} >
                            <EditableText 
                                style={{  'marginTop': '20px', 'padding': 10  }} 
                                values={this.state.profile.profile}
                                fields={{ bio: { type: 'string', placeholder: 'Erzählen Sie Profilbesuchern in einem kurzen Satz, wer Sie sind.' }}} 
                                displayValue={ this.state.profile.profile.bio }
                                onChange={ newProfile => {
                                    const profile=this.state.profile;
                                    
                                    profile.profile.bio=newProfile.bio;

                                    this.setState({ isLoading: true, profile });

                                    apiUser.updateItem(coreAuth.getUserId(), {
                                        profile: { 
                                            bio: profile.profile.bio 
                                        }
                                    })
                                    .then(() => this.setState({ isLoading: false }));
                                }}
                            />
                        </div>
                     </div>
                     <div className="row">
                                <div className="col-xs-12 col-sm-8 col-md-7 col-lg-7">
                                    <EditableText 
                                        style={{  'marginTop': '20px', 'padding': 10  }} 
                                        values={this.state.profile.profile}
                                        fields={{ website: { type: 'string', placeholder: 'Verlinken Sie hier Ihre Webseite' }}} 
                                        displayValue={ 
                                            <a target="_blank" href={this.state.profile.profile.website}> {this.state.profile.profile.website} </a> || 'Verlinken Sie hier Ihre Webseite' }
                                        onChange={newProfile => {
                                            const profile = this.state.profile;
                                            
                                            profile.profile.website = newProfile.website;

                                            this.setState({ isLoading: true, profile });

                                            apiUser.updateItem(coreAuth.getUserId(), {
                                                profile: { 
                                                    website: profile.profile.website 
                                                }
                                            })
                                            .then(() => this.setState({ isLoading: false }));
                                        }}
                                    />
                                </div>
                         </div>  
                </div>
            </div>;
    const newOfferBtn = 
   
        <FloatingActionButton onClick={ () => browserHistory.push('app/new-listing') } mini={true} backgroundColor={"#546e7a"} >
            <ContentAdd />
        </FloatingActionButton>


    const NoOfferSection = 
        <Paper style={{ 'marginTop': '40px' }}>
                <div className="row">
                    <div className="col-xs-12 text-center" style={ { marginTop: '20px', marginBottom: '20px' } }>
                            <h3>Du bietest noch nichts an!</h3>
                        </div>
                </div>      
        </Paper>;

    const OfferSection = 
        <div className="row" style={{ 'marginTop': '40px' }}>
                <div className="col-xs-12">
                                <h2>
                                    {this.state.profile.profile.firstName + "'s Angebote"}
                                    {this.state.isMyProfile && <div className="pull-right">{newOfferBtn}</div> }
                                </h2>
                                <p className="text-muted">Das biete ich an.</p> 
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
        <Card style={{ 'marginTop': '40px' }}>
                            <CardTitle title="Skills" subtitle="Das kann ich am Besten." />
  
                            { this.state.profile.talents.map((talent, index) =>
                            <div className="row" key={'talent' + index} >
                                <EditableSkill
                                    skillId={talent._id}
                                    allowChange={this.state.isMyProfile}
                                    skill={talent} 
                                    options={this.state.skills}
                                    onCancel={
                                        skill => {
                                            if (!skill._id) {
                                                const index = this.state.profile.talents.indexOf(talent);
            
                                                this.state.profile.talents.splice(index, 1);
                                                this.setState( { profile: this.state.profile });
                                            }
                                        }
                                    }
                                    onConfirm={ skill => {
                                        if (skill.skillId) {
                                            // @todo differentiate between create and update
                                            apiSkills.createItem({ skill });
                                        } else {
                                            apiSkills.createItem({ skill }).then(talent => {
                                               // this.state.profile.talents[this.state.profile.talents.length - 1]=talent;

                                                const talents = this.state.profile.talents;

                                                talents[this.state.profile.talents.length - 1] = talent;

                                                this.setState({ profile: talents });

                                                
                                            });
                                        }
                                    }}
                                    onDelete={ () => {
                                        apiSkills.deleteItem(this.state.userId, talent._id);
                                        
                                        const index=this.state.profile.talents.indexOf(talent);
                                        
                                        this.state.profile.talents.splice(index, 1);
                                        
                                        this.setState( { profile: this.state.profile });
                                    }}
                                />
                            </div>        
                            ) } 
                            
                            { this.state.isMyProfile && 
                                <div style={ { float: 'right', padding: '10px' }}>
                                    <FloatingActionButton mini={true} backgroundColor={"#546e7a"} 
                                        onClick={ () => {
                                            this.state.profile.talents.push({ 
                                                level: 0, 
                                                name: '', 
                                                editMode: true 
                                            });
                                            
                                            this.setState({
                                                profile: this.state.profile
                                            });
                                        }} >
                                        <ContentAdd />
                                    </FloatingActionButton>
                                </div>
                             }   
        </Card>;

    return (
        <div className="container">
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

                    <Paper zDepth={1}>
                        <div className="col-xs-12 col-sm-6 col-md-8">
                            
                                {OfferSection}     
                            

                                { this.state.isMyProfile && this.state.offers && !this.state.offers.length && NoOfferSection }
                
                        </div>
                    </Paper>  
                </div>
            </div>
        </div>
      );
   }
}  

export default Profile;
