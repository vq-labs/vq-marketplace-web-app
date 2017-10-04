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
import { openRequestDialog } from '../helpers/open-requests-dialog';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';

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
                                    this.state.task.status === TASK_STATUS.ACTIVE &&
                                    !this.state.task.requests
                                      .filter(_ => _.status === REQUEST_STATUS.PENDING).length &&
                                    <div style={{
                                        display: 'inline-block',
                                        marginTop: 10,
                                        marginRight: 5
                                    }}>
                                      <strong>
                                        <a
                                            className="vq-link"
                                            label={`${translate('EDIT_LISTING')}`}
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
                                          label={`${translate('CANCEL_LISTING_ACTION_HEADER')}`}
                                          labelStyle={{color: this.state.config.COLOR_PRIMARY}}
                                          onTouchTap={() => {
                                            openConfirmDialog({
                                              headerLabel: translate("CANCEL_LISTING_ACTION_HEADER"),
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