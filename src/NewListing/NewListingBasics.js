import React, { Component } from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import DOMPurify from 'dompurify'
import HtmlTextField from '../Components/HtmlTextField';
import TextField from 'material-ui/TextField';
import Autocomplete from 'react-google-autocomplete';
import * as coreAuth from '../core/auth';
import apiTask from '../api/task';
import { translate } from '../core/i18n';
import * as coreNavigation from '../core/navigation';
import { formatGeoResults } from '../core/util';

export default class NewListingBasics extends Component {
    constructor(props) {
        super();

        this.state = {
            title: props.title,
            description: props.description,
            location: props.location
        };
    }

    componentDidMount() {
       
    }
    
    render() {
     return <div className="row">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>{translate("NEW_LISTING_BASICS_HEADER")}</h1>
                            <p>{translate("NEW_LISTING_BASICS_DESC")}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="row"> 
                        <div className="col-xs-12">
                            <div className="row">
                            <div className="col-xs-12">
                                <h4>{translate("TITLE")}</h4>
                                <TextField
                                    name="title"
                                    onChange={(ev, title) => {
                                        this.setState({ title });
                                        this.props.onTitleChange(title);
                                    }}
                                    style={{width: '100%'}}
                                    inputStyle={{width: '100%'}}
                                    value={this.state.title}
                                />
                            </div>  
                        </div>  
                        <div className="row">
                            <div className="col-xs-12">
                                <h4>{translate("DESCRIPTION")}</h4>
                                <HtmlTextField 
                                    onChange={(ev, description) => {
                                        this.setState({ description })
                                        this.props.onDescriptionChange(description);
                                    }}
                                    value={this.state.description} 
                                />
                            </div>    
                        </div>

                        <div className="row">
                           <div className="col-xs-12">
                                    <h4>{translate("LOCATION")} ({translate("OPTIONAL")})</h4>
                                    {this.state.location && this.state.location.formattedAddress}
                                    <TextField name="location" style={{width: '100%'}}>
                                        <Autocomplete
                                            style={{width: '100%'}}
                                            onPlaceSelected={place => {
                                                const location = formatGeoResults([ place ])[0];
                                                this.setState({ virtual: false, location });
                                                this.props.onLocationChange(location);
                                            }}
                                            types={['(regions)']}
                                        />
                                    </TextField>
                               </div>   
                            </div>
                        </div>   
                    </div>
                </div>
            </div>
    }
}
