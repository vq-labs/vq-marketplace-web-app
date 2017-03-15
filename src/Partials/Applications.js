import React, { Component } from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import Avatar from 'material-ui/Avatar';
import { blue500 } from 'material-ui/styles/colors';
import Chip from 'material-ui/Chip';
import { browserHistory } from 'react-router';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


export default class Applications extends Component {
    constructor(props) {
        super(props);
    }
    handleGoToTask(profileId) {
         browserHistory.push('/app/profile/' + profileId);
    }
    getApplicantName (application) {
        return application.applicant.profile.firstName + ' ' + application.applicant.profile.lastName;
    }
    getApplication (application) {
        return application.applicant && (
        <div className="col-xs-12">
            <Card style={{ 'marginBottom': '15px'}} onClick={() => this.handleGoToTask(application.userId) }>
                <CardHeader
                title={this.getApplicantName(application)}
                subtitle={application.applicant.profile.bio}
                avatar={application.applicant.profile.imageUrl ? application.applicant.profile.imageUrl : 'https://studentask.de/images/avatar.png'}
                />
                <CardText>
                    {application.message}
                </CardText>
                <CardActions>
                    {  this.props.showContactBtn && 
                    <Chip>
                            <Avatar size={32}>M</Avatar>
                            {application.applicant.mobile.number}
                    </Chip>
                } 
                </CardActions>
        </Card>
      </div>);
    }
    render() {
        return (
            <div className="row">
                { this.props.applications.map( application => this.getApplication(application) ) }
            </div>     
        );
    };
}