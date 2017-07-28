import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import DOMPurify from 'dompurify'
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ApplicationDialog from '../Application/ApplicationDialog';
import TaskCategories from '../Partials/TaskCategories';
import * as coreAuth from '../core/auth';
import * as apiRequest from '../api/request';
import { appConfig } from '../api/config';
import apiUser from '../api/user';
import { translate } from '../core/i18n';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

import '../App.css';

class BookRequest extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            isLoading: true
        };
    }
   
    componentDidMount() {
      let requestId = this.props.params.requestId;

      apiRequest.getItem(requestId)
      .then(requestDetails => {
            this.setState({
                isLoading: false,
                requestDetails
            });
        });
    }
    render() {
        return (
            <div className="container">
                { this.state.isLoading && 
                    <div className="text-center" style={{ 'marginTop': '40px' }}>
                        <CircularProgress size={80} thickness={5} />
                    </div>
                }
                { !this.state.isLoading &&
                    <div className="row">
                        <div className="col-xs-12">
                            <h3>{this.state.requestDetails.task.title}</h3>
                            <hr />
                            {this.state.requestDetails.task.price} {this.state.requestDetails.task.currency}
                        </div>
                        <div className="col-xs-12">
                            <p className="text-muted">Application by:</p>
                            <h3>{this.state.requestDetails.users[this.state.requestDetails.request.ownerUserId].firstName} {this.state.requestDetails.users[this.state.requestDetails.request.ownerUserId].lastName}</h3>
                            <hr />
                        </div>
                        <div className="col-xs-12">
                            <RaisedButton
                                backgroundColor={"#546e7a"}
                                labelColor={"white"}
                                label={translate("CONFIRM_BOOKING")} 
                                onClick={() => {
                                    
                                }}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default BookRequest;