import React from 'react';
import Paper from 'material-ui/Paper';
import * as apiAdmin from '../api/admin';

export default class SectionOverview extends React.Component {
    constructor() {
        super();
        this.state = {
            taskReport: [ ],
            userReport: [ ],
            taskWeekReport: [ ],
            requestWeekReport: [ ],
            messageWeekReport: [ ]
        };

        this.getStatusLabel = status => {
            if (status === 0) {
                return 'ACTIVE';
            }

            if (status === 10) {
                return 'IN_EDIT';
            }

            if (status === 103) {
                return 'DISABLED';
            }
                
            return 'UNKNOWN';
        };

        this.wrapGrowthRateNicely = growthRate => {
            return growthRate > 0 ?
                `(+${growthRate}%)` : `(-${growthRate}%)`;
        };

        this.getGrowthRate = (currentWeek, lastWeek) => {
            const currentValue = currentWeek.count;

            if (!lastWeek) {
                return 100;
            }

            return (currentValue - lastWeek.count) / lastWeek.count;
        }

        this.getMarketplaceGrade = reports => {
            let totalSum = 0;
            let length = 0;

            reports.forEach(report => {
                if (report.length) {
                    length++;
                    totalSum += this.getGrowthRate(report[report.length - 1], report[report.length - 2]);
                }
            });

            if (length) {
                const rate = totalSum / length;
            
                if (rate > 90) {
                    return 'on an evil fire with a rocket fuel';
                }

                if (rate > 50) {
                    return 'growing like crazy';
                }

                
                if (rate > 10) {
                    return 'growing a bit shy';
                }

                if (rate > 0) {
                    return 'something is happening, add fuel commander!';
                }

                if (rate <= 0) {
                    return 'turning into zombie.';
                }
            } else {
                return 'Just starting';
            }

        }
    }
    componentDidMount() {
        apiAdmin.report.task()
        .then(taskReport => this.setState({ taskReport }));

        apiAdmin.report.user()
        .then(userReport => this.setState({ userReport }));

        apiAdmin.weekReport.task()
        .then(taskWeekReport => this.setState({ taskWeekReport }));

        apiAdmin.weekReport.request()
        .then(requestWeekReport => this.setState({ requestWeekReport }));

        apiAdmin.weekReport.message()
        .then(messageWeekReport => this.setState({ messageWeekReport }));
    }
    render() {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <h1>Current Growth: {this.getMarketplaceGrade([ this.state.taskWeekReport, this.state.requestWeekReport, this.state.messageWeekReport ])}</h1>
                    </div>
                    <hr />
                    <div className="col-xs-12">
                        <h3>Listings</h3>
                        <p className="text-muted">Your marketplace is about it how much it can offer to your users.</p>
                        { this.state.taskReport.map(overviewItem => 
                            <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" style={{ padding: 3 }}>
                                <Paper>
                                    <div className="container" style={{ padding: 3 }}>
                                        <div className="col-xs-12">
                                            <h2>{overviewItem.count}</h2>
                                            <p className="text-muted">{this.getStatusLabel(overviewItem.status)}</p>
                                        </div>
                                    </div>
                                </Paper>
                            </div>  
                        )}
                    </div>

                    <div className="col-xs-12">
                        <h3>Weekly report: Listings</h3>
                        <p className="text-muted">Week by week numbers. New listings are popping in?</p>
                        { this.state.taskWeekReport.map((overviewItem, index) => 
                            <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" style={{ padding: 3 }}>
                                <Paper>
                                    <div className="container" style={{ padding: 3 }}>
                                        <div className="col-xs-12">
                                            <h2>{overviewItem.count}</h2>
                                            <p className="text-muted">
                                                {'Week ' + overviewItem.weekOfYear} { this.wrapGrowthRateNicely(this.getGrowthRate(overviewItem, this.state.requestWeekReport[index - 1])) }
                                            </p>
                                        </div>
                                    </div>
                                </Paper>
                            </div>  
                        )}
                    </div>

                    <div className="col-xs-12">
                        <h3>Weekly report: Requests and Transactions</h3>
                        <p className="text-muted">Week by week numbers. Keep rollin'.</p>
                        { this.state.requestWeekReport.map((overviewItem, index) => 
                            <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" style={{ padding: 3 }}>
                                <Paper>
                                    <div className="container" style={{ padding: 3 }}>
                                        <div className="col-xs-12">
                                            <h2>{overviewItem.count}</h2>
                                            <p className="text-muted">
                                                {'Week ' + overviewItem.weekOfYear} { this.wrapGrowthRateNicely(this.getGrowthRate(overviewItem, this.state.requestWeekReport[index - 1])) }
                                            </p>
                                        </div>
                                    </div>
                                </Paper>
                            </div>  
                        )}
                    </div>

                    <div className="col-xs-12">
                        <h3>Weekly report: Messages</h3>
                        <p className="text-muted">A successful marketplace is such of whose users can interact and communicate freely</p>
                        { this.state.messageWeekReport.map((overviewItem, index) => 
                            <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" style={{ padding: 3 }}>
                                <Paper>
                                    <div className="container" style={{ padding: 3 }}>
                                        <div className="col-xs-12">
                                            <h2>{overviewItem.count}</h2>
                                            <p className="text-muted">
                                                {'Week ' + overviewItem.weekOfYear} { this.wrapGrowthRateNicely(this.getGrowthRate(overviewItem, this.state.messageWeekReport[index - 1])) }
                                            </p>
                                        </div>
                                    </div>
                                </Paper>
                            </div>  
                        )}
                    </div>
                </div>
            );
    }
};
