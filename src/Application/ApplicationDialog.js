import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import AuthService from '../AuthService';
import StActions from '../StActions';
import GoogleAd from 'react-google-ad'
import LoginSignup from '../Components/LoginSignup';

import { browserHistory } from 'react-router';
import * as coreAuth from '../core/auth';

const _ = require('underscore');

export default class ApplicationDialog extends React.Component {
  state = {
      isBeingPosted: false,
      mask: 'init', 
      logged: Boolean(coreAuth.getToken()),
      open: false,
      application: {
          taskId: this.props.taskId,
          message: ''
      }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.taskId){
        const application = _.extend({}, this.state.application);

        application.taskId = nextProps.taskId;

        this.setState({ application: application });
    }

    if (nextProps.open !== this.state.open) {
      this.setState({ open: nextProps.open });
    }
  }
  goBack(currentMask) {
      switch (currentMask) {
          case 'init':
          case 'success':
            this.setState({ open: false });
            break;
          default:
            this.setState({ mask: 'init'});
      }
  }
  showBackBtnLabel (currentMask) {
    switch (currentMask) {
        case 'init':
            return 'Abbrechen';
        case 'success':
            return 'Zurück';
        default:
            return 'Zurück';
    }
  }
  showContinueBtnLabel (currentMask) {
      switch (currentMask) {
        case 'success':
            return 'Weitere Inserate durchsuchen';
        default:
            return 'Anfrage senden';
    }
  }
  continuePosting (currentMask) {
         switch (currentMask) {
            case 'init':
                if (Boolean(coreAuth.getToken())) {
                    StActions['sendApplication'](this.state.application, result => {
                        this.setState({ mask: 'success', isBeingPosted: false });
                    });

                    this.setState({ mask: 'success', isBeingPosted: false });
                } else {
                    this.setState({ mask: 'auth' });
                }

                break;
            case 'confirmation':
                const methodName = AuthService.isAuth() ? 'sendApplication' : 'loginAndSendApplication';    

                this.setState({ isBeingPosted: true });

                StActions[methodName](this.state.application, result => {
                    this.setState({ mask: 'success', isBeingPosted: false });
                });

                break;
            case 'success':
                return browserHistory.push('/app');
            default:
                return alert('I do not know what to do');
        }   
  }
  getDialogTitle = currentMask => 
  currentMask === 'success' ? "Die Nachricht wurde erfolgreich gesendet" : "Ihre Nachricht";
  
  render() {
     const backBtn = <FlatButton
        onTouchTap={ () => this.goBack(this.state.mask) }
        label={ this.showBackBtnLabel(this.state.mask) }
        disabled={ false }
        primary={ true }
      />;

      const continueBtn = <FlatButton
        label = { this.showContinueBtnLabel(this.state.mask) }
        primary = { true }
        disabled = { false }
        onTouchTap = { () => this.continuePosting(this.state.mask) }
      />;
     
     const getActions = currentMask => currentMask !== 'success' ? [
      backBtn,
      continueBtn
    ] : [ continueBtn ];

    const InitApplication = 
        <div>
                <div className="row"> 
                    <TextField
                        rows = {4}
                        multiLine = {true}
                        onChange={ e => {
                            const newState = _.extend({}, this.state.application);
                            newState.message = e.target.value;
                            this.setState({
                                application: newState
                            });
                        }}
                        value = { this.state.application.message }
                        style = {{width: '100%'}}
                        inputStyle = {{width: '100%'}}
                        floatingLabelText = "Nachricht"
                    />
                </div>
            
            <GoogleAd client="ca-pub-2487354108758644" slot="4660780818" format="auto" />
        </div>;

    const ApplicationConfirmation = 
    <div>
        { this.state.isBeingPosted && 
            <div className="text-center" style={{ 'marginTop': '40px' }}>
                <CircularProgress size={80} thickness={5} />
            </div>
        }
        { !this.state.isBeingPosted && 
        <p>
            Ihre Nachricht wird geschickt.
        </p>
        }
    </div>;

    const Success = <div>
        <div className="col-sm-12 col-xs-12">
            <h3>
                Die Nachricht wurde geschickt.
            </h3>

            <div>
                <a href="https://geo.itunes.apple.com/de/app/studentask/id1084813293?mt=8" target="_blank">
                    <img style={{ "width": "120px;" }} alt="Get StudenTask App on Google Play" src="https://studentask.de/images/badge_appstore-lrg.svg"/>
                </a>
                <a href="https://play.google.com/store/apps/details?id=de.viciqloud.studentask" target="_blank">
                    <img alt="Get StudenTask on App Store for iOS" style={{"width": "120px" }}src="https://studentask.de/images/badge_playstore_lrg.png"/>
                </a>
            </div>
        </div>
    </div>;

    return (
      <Dialog
          autoScrollBodyContent={true}
          title = { this.getDialogTitle(this.state.currentMask) }
          actions = { getActions(this.state.currentMask) }
          modal = { true }
          open = { this.state.open }
        >
          { this.state.mask === 'init' && InitApplication }
          { this.state.mask === 'auth' && <LoginSignup
                onSuccess={ () => this.setState({ mask: 'confirmation' }) }
          /> }
          { this.state.mask === 'confirmation' && ApplicationConfirmation }
          { this.state.mask === 'success' && Success }
        </Dialog>
    );
  }
}  