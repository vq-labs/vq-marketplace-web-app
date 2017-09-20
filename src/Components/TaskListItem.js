import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import * as coreNavigation from '../core/navigation';
import displayTaskTiming from '../helpers/display-task-timing';
import { translate } from '../core/i18n';
import { displayPrice, displayLocation, displayListingDesc } from '../core/format';
import { getCategoriesAsync } from '../core/categories';
import { goTo } from '../core/navigation';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import apiTask from '../api/task';
import { getConfigAsync } from '../core/config';
import ReactStars from 'react-stars'
import ListingHeader from '../Components/ListingHeader';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import { openRequestDialog } from '../helpers/open-requests-dialog';

export default class TaskListItem extends Component {
  constructor(props) {
      super(props);

      this.state = {
          task: props.task
      };
  }

  componentDidMount() {
    getConfigAsync(config => {
      this.setState({
        ready: true,
        config
      });
    });
  }

  getTaskListItem(task) {
    return (
      <div
        className="col-xs-12"
        style={{ marginTop: 10 }}
      >
          { this.state.ready &&
          <Paper
            style={{
              padding: 10,
              cursor: this.props.displayManagement ? '' : 'pointer'
            }}
            onTouchTap={() => {
              if (!this.props.displayManagement) {
                return goTo(`/task/${task.id}`);
              }
            }}
          >
                    <ListingHeader
                      task={task}
                      config={this.state.config}
                    />
                    <div className="row">
                        { this.props.displayManagement &&
                          <div className="col-xs-12">
                            <div className="row">
                              <div className="col-xs-12 col-sm-6">
                                  { this.state.task &&
                                    this.state.task.requests &&
                                    !this.state.task.requests.length &&
                                    <div style={{
                                        display: 'inline-block',
                                        marginTop: 10,
                                        marginRight: 5
                                    }}>
                                      <strong>
                                        <a
                                            className="vq-link"
                                            label={`${translate('EDIT')}`}
                                            labelStyle={{color: this.state.config.COLOR_PRIMARY}}
                                            onTouchTap={() => goTo(`/task/${task.id}/edit`)}
                                        >
                                            {translate('EDIT')}
                                        </a>
                                      </strong>
                                    </div>
                                  }
                                  <div style={{
                                      display: 'inline-block',
                                      marginTop: 10,
                                      marginRight: 5
                                  }}>
                                    <strong>
                                      <a  
                                          className="vq-link"
                                          label={`${translate('CANCEL')}`}
                                          labelStyle={{color: this.state.config.COLOR_PRIMARY}}
                                          onTouchTap={() => {
                                            openConfirmDialog({
                                              headerLabel: translate("CANCEL"),
                                              confirmationLabel: translate("CANCEL_LISTING_DESC")
                                            }, () => {
                                              apiTask
                                                .updateItem(task.id, {
                                                  status: '103'
                                                })
                                                .then(_ => {
                                                  task.status = '103';

                                                  this.setState({
                                                    task
                                                  });
                                                  
                                                  if (this.props.onCancel) {
                                                    this.props.onCancel(task);
                                                  }
                                                }, err => {
                                                  console.error(err);
                                                })
                                            });
                                          }}
                                        >
                                          {translate('CANCEL')}
                                        </a>
                                      </strong>
                                  </div>
                              </div>
                              <div className="col-xs-12 col-sm-6 text-right">
                                    <div style={{
                                      display: 'inline-block',
                                      padding: 2
                                    }}>
                                      <RaisedButton
                                          label={`${this.state.task.requests
                                            .filter(_ => _.status === REQUEST_STATUS.PENDING)
                                            .length} ${translate('REQUESTS')}`}
                                          labelStyle={{color: 'white '}}
                                          backgroundColor={this.state.config.COLOR_PRIMARY}
                                          onTouchTap={() => {
                                            openRequestDialog(task.requests);
                                          }}
                                      />
                                    </div>
                              </div>
                            </div>
                          </div>
                        }
                    </div>
                </Paper>
                }
            </div>
    );
  }

  render() {
    return this.getTaskListItem(this.props.task);
  }
}

/**
 * 
 * <div className="row">
                    { this.props.showRequests &&
                      <div class="col-xs-12">
                        <div className="col-xs-12">
                          <strong>{translate('REQUESTS')}:</strong>
                        </div>
                        { !this.state.task.requests.length && 
                          <div className="col-xs-12 text-muted">
                            <p>{translate('NO_REQUESTS')}</p>
                          </div>
                        }

                        { this.state.task.requests.map(request => 
                            <div 
                              className="col-xs-4 col-sm-4 col-md-3" 
                              onTouchTap={
                                () => goTo(`/request/${request.id}`)
                              }
                            >
                                  <div className="col-xs-12">
                                    <Avatar src={request.fromUser.imageUrl || '/images/avatar.png' }/>
                                  </div>
                                  <div className="col-xs-12"> 
                                      <ReactStars
                                        style={{
                                          margin: '0 auto',
                                          display: 'block'
                                        }}
                                        edit={false}
                                        disable={true}
                                        count={5}
                                        size={10}
                                        half={false}
                                        value={request.fromUser.avgReviewRate}
                                        color2={'#ffd700'}
                                      />
                                  </div>
                                  <div className="col-xs-12 text-muted">
                                    {request.fromUser.firstName} {request.fromUser.lastName}
                                  </div>
                            </div>
                          )}
                        </div>
                      }
                      </div>
 *  <div className="row" key={task.id} style={{ cursor: "pointer" }} >
                <div className="hidden-xs col-sm-3">
                    <img
                      style={{ marginTop: 20, marginBottom: 20 }}
                      className="img-responsive"
                      src={task.categories[0].imageUrl || '/images/category-default-img.jpeg'}
                    />
                </div>
                <div className="col-xs-10 col-sm-6">
                  <div onClick={() => this.handleGoToTask(task.id)}
                    style={{
                      height: '80px',
                      paddingBottom: 0,
                      overflow: 'hidden'
                    }} 
                  >    
                        <h3>{ this.formatTitle(task.title) }</h3>
                        { task.location &&
                          <p className="text-muted">
                            {displayLocation(task)}
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
                        onTouchTap={() => {
                          openConfirmDialog({
                            headerLabel: translate("CANCEL")
                          }, () => {
                            apiTask
                              .updateItem(task.id, {
                                status: '103'
                              })
                              .then(_ => {
                                task.status = '103';

                                this.setState({
                                  task
                                });
                                
                                if (this.props.onCancel) {
                                  this.props.onCancel(task);
                                }
                              }, err => {
                                console.error(err);
                              })
                          });
                        }}>
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
                      { !this.state.task.requests.length && 
                        <div className="col-xs-12 text-muted">
                          <p>{translate('NO_REQUESTS')}</p>
                        </div>
                      }
                      { this.state.task.requests.map(request => 
                          <div className="col-xs-4 col-sm-4 col-md-3" onTouchTap={
                                          () => goTo(`/request/${request.id}`)
                                      }>
                                <div className="col-xs-12">
                                  <Avatar src={request.fromUser.imageUrl || '/images/avatar.png' }/>
                                </div>
                                <div className="col-xs-12"> 
                                    <ReactStars
                                      style={{ margin: '0 auto', display: 'block' }}
                                      edit={false}
                                      disable={true}
                                      count={5}
                                      size={10}
                                      half={false}
                                      value={request.fromUser.avgReviewRate}
                                      color2={'#ffd700'}
                                    />
                                </div>
                                <div className="col-xs-12 text-muted">
                                   {request.fromUser.firstName} {request.fromUser.lastName}
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
                            { displayPrice(this.state.task.price, this.state.task.currency, this.state.task.priceType) }
                          </h4>
                    </div>
                  </div>
            </div>
 */