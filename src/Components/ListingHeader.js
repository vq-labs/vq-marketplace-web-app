import React, { Component } from 'react';
import { displayPrice, displayLocation, displayListingDesc }  from '../core/format';
import { goTo } from '../core/navigation';
import displayTaskTiming from '../helpers/display-task-timing';
import TaskCategories from '../Partials/TaskCategories';

const displayTotalPrice = (price, timings) => {
    try {
        return price * timings[0].duration;
    } catch (err) {
        return '?';
    }
};

const displayDuration = timings => {
    try {
        return timings[0].duration;
    } catch (err) {
        return '?';
    }
}

class ListingHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            task: props.task
        };
    }

    componentDidMount() {
        
    }
    
    componentWillReceiveProps (nextProps) {
        this.setState({
            config: nextProps.config,
            task: nextProps.task
        });
    } 

    render() {
        return (
            <div className="row">
                <div className={`col-xs-12 ${this.props.noColumns ? 'col-sm-12' : 'col-sm-9 text-left'}`}>
                    <h3>
                        <a  href="#"
                            style={{
                                color: 'black',
                                cursor: 'pointer'
                            }}
                            onTouchTap={() => goTo(`/task/${this.state.task.id}`)}
                        >
                            {this.state.task.title}
                        </a>
                    </h3>
                    
                    {!this.props.hideCategories &&
                        <div style={{
                            marginTop: 5,
                            marginBottom: 5
                        }}>
                            <TaskCategories
                                clickable={false}
                                categories={this.state.task.categories}
                            />
                        </div>
                    }

                    { this.state.task.taskLocations &&
                        this.state.task.taskLocations.length &&
                        <p className="text-muted">
                            {displayLocation(this.state.task.taskLocations[0])}
                        </p>
                    }

                    { this.state.task.taskTimings &&
                        Boolean(this.state.task.taskTimings.length) &&
                        <p className="text-muted">
                            { displayTaskTiming(this.state.task.taskTimings) }
                        </p>
                    }

                    { !this.props.hideDesc &&
                    <p>
                        { displayListingDesc(this.state.task.description) }
                    </p>
                    }
                </div>
                <div className={`col-xs-12 ${this.props.noColumns ? 'col-sm-12' : 'col-sm-3 text-right'}`} > 
                    <h1 style={{
                        marginTop: this.props.noPaddings ? 5 : 30,
                        color: this.state.config.COLOR_PRIMARY
                    }}>
                        {displayTotalPrice(this.state.task.price, this.state.task.taskTimings)} {this.state.task.currency}<br />
                    </h1>
                    <p className="text-muted">{displayPrice(this.state.task.price, this.state.task.currency, this.state.task.priceType)}, {displayDuration(this.state.task.taskTimings)}h</p>
                </div>
            </div>
        );
    }
}

export default ListingHeader;
