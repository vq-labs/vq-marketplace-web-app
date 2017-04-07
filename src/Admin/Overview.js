import React from 'react';
import Paper from 'material-ui/Paper';
import * as apiAdmin from '../api/admin';

export default class SectionOverview extends React.Component {
    constructor() {
        super();
        this.state = { overview: [] };
    }
    componentDidMount() {
        apiAdmin.overview.getItems().then(overview => {
            this.setState({ overview });
        });
    }
    render() {
            return (
                <div className="col-xs-12">
                    { this.state.overview.map(overviewItem => 
                        <div className="col-xs-6 col-sm-4" style={{ padding: 3 }}>
                            <Paper>
                                <div className="container" style={{ padding: 3 }}>
                                    <div className="col-xs-12">
                                        <h1>{overviewItem.value}</h1>
                                        <h4>{overviewItem.label}</h4>
                                    </div>
                                </div>
                            </Paper>
                        </div>  
                    )}
                </div>
            );
    }
};
