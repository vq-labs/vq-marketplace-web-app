import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import GoogleAd from 'react-google-ad'
import LoginSignup from '../Components/LoginSignup';
import * as apiRequest from '../api/request';
import * as coreAuth from '../core/auth';
import { translate } from '../core/i18n';
import { browserHistory } from 'react-router';

const _ = require('underscore');

export default class ApplicationDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isBeingPosted: false,
            mask: 'init', 
            logged: Boolean(coreAuth.getToken()),
            open: false,
            application: {
                toUserId: this.props.toUserId,
                taskId: this.props.taskId,
                message: ''
            }
        };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.taskId && nextProps.toUserId) {
        const application = _.extend({}, this.state.application);

        application.taskId = nextProps.taskId;
        application.toUserId = nextProps.toUserId;
        
        this.setState({ application });
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
  sendRequest() {
    if (Boolean(coreAuth.getToken())) {
            this.setState({ isBeingPosted: true });
            
            apiRequest.createItem(this.state.application)
                .then(result => this.setState({
                    mask: 'success', 
                    isBeingPosted: false 
                }));
    } else {
        this.setState({ mask: 'auth' });
    }
  }
  continuePosting (currentMask) {
         if (!this.state.application.message) {
            return this.setState({
                openSnackbar: true,
                snackbarMessage: translate("MESSAGE") + " " + translate("IS_REQUIRED")
            });
         }

         switch (currentMask) {
            case 'init':
                this.sendRequest();
                break;
            case 'confirmation':
                this.sendRequest();

                break;
            case 'success':
                return browserHistory.push('/app');
            default:
                return alert('I do not know what to do');
        }   
  }
  getDialogTitle = currentMask => 
  currentMask==='success' ? "Die Nachricht wurde erfolgreich gesendet" : "Ihre Nachricht";
  
  render() {
     const backBtn = <FlatButton
        onTouchTap={ () => this.goBack(this.state.mask) }
        label={ this.showBackBtnLabel(this.state.mask) }
        disabled={ false }
        primary={ true }
      />;

      const continueBtn = <FlatButton
        label={ this.showContinueBtnLabel(this.state.mask) }
        primary={ true }
        disabled={ false }
        onTouchTap={ () => this.continuePosting(this.state.mask) }
      />;
     
     const getActions = currentMask => {
         if (currentMask === 'auth') {
             return [ ];
         }

         return currentMask !== 'success' ? [
            backBtn,
            continueBtn
         ] : [ continueBtn ];
    };

    const InitApplication = 
        <div>
                <div className="row"> 
                    <TextField
                        rows={4}
                        multiLine={true}
                        onChange={ e => {
                            const newState = _.extend({}, this.state.application);

                            newState.message = e.target.value;

                            this.setState({
                                application: newState
                            });
                        }}
                        value={this.state.application.message}
                        style={{width: '100%'}}
                        inputStyle={{width: '100%'}}
                        floatingLabelText="Nachricht"
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

    const Success=<div>
        <div className="col-sm-12 col-xs-12">
            <h3>Die Nachricht wurde geschickt.</h3>
        </div>
    </div>;

    return (
      <Dialog
          autoScrollBodyContent={true}
          title={ this.getDialogTitle(this.state.mask) }
          actions={ getActions(this.state.mask) }
          modal={ true }
          open={ this.state.open }
        >
          { this.state.mask==='init' && InitApplication }
          { this.state.mask==='auth' && <LoginSignup
                onSuccess={ () => this.sendRequest() }
          /> }
          { this.state.mask==='confirmation' && ApplicationConfirmation }
          { this.state.mask==='success' && Success }
          <Snackbar
            open={this.state.openSnackbar}
            message={this.state.snackbarMessage}
            autoHideDuration={4000}
          />
        </Dialog>

    );
  }
}  