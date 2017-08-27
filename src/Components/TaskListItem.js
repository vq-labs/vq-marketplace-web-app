import React, { Component } from 'react';
import { Card, CardActions, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/FlatButton';
import Moment from 'react-moment';
import StActions from '../StActions';
import * as coreNavigation from '../core/navigation';
import displayTaskTiming from '../helpers/display-task-timing';
import { translate } from '../core/i18n';
import { stripHtml } from '../core/util';
import { goTo } from '../core/navigation';

export default class TaskListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: props.task
        };
    }

  displayPrice (offer) {
    if (offer.priceType === 2) {
        return translate('PRICING_MODEL_REQUEST_QUOTE');
    }

    let priceLabel;

    if (offer.currency === 'EUR') {
       priceLabel = String((offer.price / 100 ).toFixed(0)) + '€';
    }

    if (offer.currency === 'HUF') {
       priceLabel = String(offer.price) + 'Ft.';
    }
    
    if (offer.priceType === 0) {
        return `${priceLabel} ${translate('PRICING_MODEL_TOTAL')}`;
    }

    if (offer.priceType === 1) {
        return `${priceLabel} ${translate('PRICING_MODEL_HOURLY')}`;
    }

    throw new Error(`Unknown price model ${offer.priceType}`);
  }

  handleGoToTask (taskId) {
    coreNavigation.goTo(`/task/${taskId}`)
  }

  changeStatus (taskId, statusCode) {
    const updatedTask = this.state.task;

    if (statusCode === 0) {
      StActions.activateTask(taskId, () => {} );
      updatedTask.status = 0;

      this.setState({ task: updatedTask });
    }

    if (statusCode === 103) {
      StActions.deactivateTask(taskId, () => {} );

      updatedTask.status = 103;

      this.setState({ task: updatedTask });
    }
  }

  formatTitle (title) {
    if (title) {
       return title.substring(0, 55) + '..';
    }

    return 'No title';
  }

  formatDesc (desc) {
    if (desc) {
       return stripHtml(desc).substring(0, 75) + '..'
    }

    return 'No description';
  }

  formatLocation (task) {
    if (task.location) {
       return `${task.location.street}, ${task.location.postalCode} ${task.location.city}`
    }

    return '';
  }

  getTaskListItem(task) {
    return (
            <div className="row" key={task.id} style={{ cursor: "pointer" }} >
                <div className="col-xs-10">
                  <div onClick={() => this.handleGoToTask(task.id) } style={{
                      height: '80px',
                      paddingBottom: 0,
                      lineHeight: '18px', 
                      overflow: 'hidden'
                  }} onClick={() => this.handleGoToTask(task.id) } >    
                        <h3>{ this.formatTitle(task.title) }</h3>
                        { task.location &&
                          <p className="text-muted">
                            {this.formatLocation(task)}
                          </p>
                        }
                  </div>
                  <div onClick={() => this.handleGoToTask(task.id) } style={{
                      height: '65px',
                      paddingTop: 0,
                      paddingBottom: 0,
                      lineHeight: '20px',
                      overflow: 'hidden'
                  }}>
                    { this.formatDesc(this.state.task.description) }
                    { displayTaskTiming(this.state.task.taskTimings) }
                  </div>
                  { this.props.editable &&
                    <div class="row" style={{'marginBottom': '10px'}}>
                      { !task.requests.length &&
                        <a
                          style={{ padding: 5 }}
                          onTouchTap={() => goTo(`/task/${task.id}/edit`)}>
                            <strong>
                                {translate("EDIT")} 
                            </strong>
                        </a>
                      }
                      <a
                        style={{ padding: 5 }} 
                        onTouchTap={() => alert('Task should be cancelled')}>
                          <strong>
                              {translate("CANCEL")} 
                          </strong>
                      </a>
                    </div>
                  }
                  { this.props.showRequests &&
                      <div class="row" style={{'marginBottom': '10px'}}>
                      <div className="col-xs-12">
                        <strong>{translate('REQUESTS')}:</strong>
                      </div>
                       { this.state.task.requests.map(request => 
                          <div className="col-xs-4 col-sm-3 col-md-1" onTouchTap={
                                          () => goTo(`/request/${request.id}`)
                                      }>
                                <div className="col-xs-12 text-center">
                                  <Avatar src={request.fromUser.imageUrl || '/images/avatar.png' }/>
                                </div>
                                <div className="col-xs-12 text-center text-muted">
                                   {request.fromUser.firstName}
                                </div>
                          </div>
                       )}
                      </div>
                  }
                  { this.props.displayManagement &&
                    <div style={{'marginBottom': '10px'}}>
                      <div class="row">
                        <div className="col-xs-10 col-sm-11 col-md-9 col-lg-10 text-muted">
                          <p style={{ marginTop: '16px', marginLeft: '-17px'} }>
                            { task.status !== 0 && <span>{translate('INACTIVE')}</span> }
                            { task.status === 0 && <span>{translate('ACTIVE')}</span> }
                          </p>
                        </div>
                        <div className="col-xs-1 col-sm-1 col-md-2 col-lg-1 text-right"> 
                              <IconMenu
                                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                              > 
                                  <MenuItem primaryText={translate('EDIT')} onTouchTap={() => {
                                    if (task.status === 10) {
                                      return coreNavigation.goTo(`/new-listing/${task.id}`);
                                    }

                                    return coreNavigation.goTo(`/task/${task.id}/edit`);
                                  }} />
                                  { task.status !== 0 && <MenuItem primaryText={translate('ACTIVATE')} onTouchTap={ () => this.changeStatus(task.id, 0) } /> }
                                  { task.status === 0 && <MenuItem primaryText={translate('DEACTIVATE')} onTouchTap={ () => this.changeStatus(task.id, 103) } /> }
                                  
                              </IconMenu>
                        </div>
                      </div> 
                    </div>
                  }
                  </div>
                  <div className="col-xs-2">
                    <div onClick={() => this.handleGoToTask(task.id) } style={ {
                    }}>
                          <h4 style={{ 
                            color: '#26a69a', 
                            marginTop: 20,
                            width: '100%' 
                          }} primary={true}>
                            { this.displayPrice(this.state.task) }
                          </h4>
                    </div>
                  </div>
            </div>
    );
  }

  render() {
    return this.getTaskListItem(this.props.task);
  }
}