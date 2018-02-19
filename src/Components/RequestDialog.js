import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import LoginSignup from '../Components/LoginSignup';
import BookRequest from '../Pages/BookRequest';
import * as apiRequest from '../api/request';
import * as coreAuth from '../core/auth';
import { goTo } from '../core/navigation';
import { CONFIG } from '../core/config';
import { translate } from '../core/i18n';
import { browserHistory } from 'react-router';
import { displayMessage } from '../helpers/display-message.js';

const _ = require('underscore');

export default class RequestDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isBeingPosted: true,
            mask: 'init', 
            logged: Boolean(coreAuth.getToken()),
            open: false,
            listing: this.props.listing,
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
            return translate("CANCEL");
        case 'success':
            return translate("BACK");
        default:
            return translate("BACK");
    }
  }
  
  showContinueBtnLabel (currentMask) {
      switch (currentMask) {
        case 'success':
            return translate("OK");
        default:
            return translate("REQUEST_MESSAGE_CONFIRM");
    }
  }

  sendRequest() {
    if (!Boolean(coreAuth.getToken())) {
        return this.setState({
            mask: 'auth'
        });
    }

    this.setState({ isBeingPosted: true });
    
    return apiRequest
        .createItem(this.state.application)
        .then(result => {
            const requestId = result.requestId;

            this.setState({
                requestId,
                /**
                 * A) this.state.listing.taskType) === 1
                 * Model where a request needs to be explicitely accepted by the supplier.
                 * Currently its the only supported model for demand listings.
                
                */
                mask: 'success',

                isBeingPosted: false 
            });

        /**
        * B) this.state.listing.taskType) === 2
        * Instant Booking
        * Currently its the only model supported for supply listings
        */
            if (Number(this.state.listing.taskType) === 2) {
                return goTo(`/request/${requestId}/book`);
            }
        });
  }

  continuePosting (currentMask) {
         if (!this.state.application.message) {
            return displayMessage({
                label: translate("MESSAGE") + " " + translate("IS_REQUIRED")
            })
         }

         switch (currentMask) {
            case 'init':
                this.sendRequest();

                return;
            case 'confirmation':
                this.sendRequest();

                break;
            case 'success':
                return browserHistory.push('/app');
            default:
                return alert('I do not know what to do');
        }   
  }

  getDialogTitle(currentMask) {
    return translate('SEND_REQUEST');
  } 
  
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
         if (currentMask === 'auth' || currentMask === 'billing') {
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
                        hintText={translate('REQUEST_MESSAGE_DESC')}
                        floatingLabelText={translate('REQUEST_MESSAGE_HEADER')}
                    />
                </div>
        </div>;

    const ApplicationConfirmation =
    <div>
        { this.state.isBeingPosted && 
            <div className="text-center" style={{ 'marginTop': '40px' }}>
                <CircularProgress size={80} thickness={5} />
            </div>
        }
    </div>;

    const Success=<div>
        <div className="col-sm-12 col-xs-12">
            <h3>{translate("REQUEST_SUBMITTED_HEADER")}</h3>
            <p>{translate("REQUEST_SUBMITTED_DESC")}</p>
        </div>
    </div>;

    return (
      <Dialog
          autoScrollBodyContent={true}
          actions={getActions(this.state.mask)}
          modal={ true }
          open={ this.state.open }
        >
          { this.state.mask === 'init' && InitApplication }
          { this.state.mask === 'auth' && <LoginSignup
                onSuccess={ () => this.sendRequest() }
          /> }

          { this.state.mask==='confirmation' && ApplicationConfirmation }
          { this.state.mask==='success' && Success }
        </Dialog>
    );
  }
}  