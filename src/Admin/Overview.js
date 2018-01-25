import React from 'react';
import Loader from "../Components/Loader";
import * as apiAdmin from '../api/admin';
export default class SectionOverview extends React.Component {
    constructor() {
        super();
        
        this.state = {
            isLoading: true,
            reports: []
        };
    }

    componentDidMount() {
        apiAdmin
        .report
        .overview()
        .then(reports => this.setState({
            isLoading: false,
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
                        <p>
                            Reports are refreshed every few hours.
                        </p>

                        { this.state.isLoading &&
                            <Loader isLoading={true} />
                        }

                        { !this.state.isLoading && this.state.reports.map((overviewItem, index) =>
                            <div key={index} className="col-xs-6 col-sm-4 col-md-3 col-lg-2" style={{ padding: 3 }}>
                                <div style={{ padding: 3 }} className="col-xs-12 panel">
                                    <h2>{overviewItem.reportValue}</h2>
                                    <p className="text-muted">{overviewItem.reportName}</p>
                                </div>
                            </div>  
                        )}
                    </div>
                </div>
            );
    }
};
