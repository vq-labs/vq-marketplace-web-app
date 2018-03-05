import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
import apiTask from '../api/task';
import { CONFIG } from '../core/config';
import ListingHeader from '../Components/ListingHeader';
import { openRequestDialog } from '../helpers/open-requests-dialog';
import REQUEST_STATUS from '../constants/REQUEST_STATUS';
import TASK_STATUS from '../constants/TASK_STATUS';
import TASK_TYPES from '../constants/TASK_TYPES';
export default class TaskListItem extends Component {
  constructor(props) {
      super(props);

      this.state = {
          task: props.task
      };
  }

  componentDidMount() {
      this.setState({
        ready: true
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
                    <ListingHeader task={task} />
                    <div className="row">
                        { this.props.displayManagement &&
                          <div className="col-xs-12">
                            <div className="row">
                              <div className="col-xs-12 col-sm-6">
                                  { CONFIG.LISTING_EDIT_ENABLED === "1" && this.state.task &&
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
                                            style={{color: CONFIG.COLOR_PRIMARY}}
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
                                          style={{color: CONFIG.COLOR_PRIMARY}}
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
                              { Number(this.state.task.taskType) === TASK_TYPES.DEMAND &&
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
                                            backgroundColor={CONFIG.COLOR_PRIMARY}
                                            onTouchTap={() => {
                                              openRequestDialog(task.requests.filter(_ => _.status === REQUEST_STATUS.PENDING));
                                            }}
                                        />
                                      </div>
                                </div>
                              }
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