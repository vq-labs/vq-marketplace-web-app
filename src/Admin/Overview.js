import React from 'react';
import Paper from 'material-ui/Paper';
import * as apiAdmin from '../api/admin';

export default class SectionOverview extends React.Component {
    constructor() {
        super();
        this.state = {
            reports: [ ]
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
    }
    componentDidMount() {
        apiAdmin.report.overview()
        .then(reports => this.setState({
            reports
        }));
    }

    render() {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <h1>Marketplace overview</h1>
                    </div>
                    <hr />
                    <div className="col-xs-12">
                        <h3>Reports</h3>
                        { this.state.reports.map(overviewItem => 
                            <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" style={{ padding: 3 }}>
                                <Paper>
                                    <div className="container" style={{ padding: 3 }}>
                                        <div className="col-xs-12">
                                            <h2>{overviewItem.reportValue}</h2>
                                            <p className="text-muted">{overviewItem.reportName}</p>
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
