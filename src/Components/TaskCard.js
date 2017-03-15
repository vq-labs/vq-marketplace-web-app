import React, { Component } from 'react';
import { Card, CardActions, CardText } from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/FlatButton';

import StActions from '../StActions';

import * as coreNavigation from '../core/navigation';

export default class TaskCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: this.props.task
    }
  }

  displayPrice (offer) {
        let label = String((offer.price / 100 ).toFixed(0)) + '€';

        if (offer.priceType === 0) {
            label += " pro Auftrag";
        } else {
            label += " pro Stunde";
        }

        return label;
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

  getTaskListItem(task) {
    return (
            <Card key={task._id}>
                <CardText style={ {
                    height: '60px',
                    lineHeight: '20px', 
                    overflow: 'hidden'
                }} onClick={() => this.handleGoToTask(task._id) } >    
                      <h4>{task.title.substring(0, 23) + '...'}</h4>
                </CardText>  
                <CardText onClick={() => this.handleGoToTask(task._id) } style={ {
                    height: '60px',
                    lineHeight: '20px', 
                    overflow: 'hidden'
                }}>
                  {task.description.substring(0, 100) + '...'}
                </CardText>
                { this.props.displayManagement && 
                  <CardText style={{'marginBottom': '20px'}}>
                    <div class="row">
                      <div className="col-xs-10 col-sm-9 col-md-9 col-lg-10 text-muted">
                        <p style={ { marginTop: '16px', marginLeft: '-17px'} }>
                        { task.status !== 0 && <span>Inaktiv</span> }
                        { task.status === 0 && <span>{task.applyingUsers.length} Anfragen</span> }
                        </p>
                      </div>
                      <div className="col-xs-1 col-sm-2 col-md-2 col-lg-1"> 
                            <IconMenu
                                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                { task.status !== 0 && <MenuItem primaryText="Aktivieren" onTouchTap={ () => this.changeStatus(task._id, 0) } /> }
                                { task.status === 0 && <MenuItem primaryText="Deaktivieren" onTouchTap={ () => this.changeStatus(task._id, 103) } /> }
                                <MenuItem primaryText="Editieren" onTouchTap={ () => coreNavigation.goTo(`/task/${task._id}/edit`) } />
                            </IconMenu>
                      </div> 
                    </div> 
                  </CardText>
                }
                { this.props.displayPrice && 
                  <CardActions className="text-center">
                      <FlatButton label={ this.displayPrice(this.state.task) } style={{ width: '100%' }} primary={true} />
                  </CardActions>
                }
            </Card>
    );
  }

  render() {
        return this.getTaskListItem(this.props.task);
  }
}