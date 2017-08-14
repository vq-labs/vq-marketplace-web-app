import React from 'react';
import * as apiConfig from '../api/config';
import apiPost from '../api/post';
import EditableEntity from '../Components/EditableEntity';
import * as coreNavigation from '../core/navigation';
import HtmlTextField from '../Components/HtmlTextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import * as coreUtil from '../core/util.js'
import { translate } from '../core/i18n';
import DOMPurify from 'dompurify'
import { getConfigAsync } from '../core/config';

export default class Imprint extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
        };
    }
   
  
    componentDidMount() {
        getConfigAsync(config => this.setState({
            ready: true,
            config
        }))
    }

    render() {
        return (
            <div className="container">
                 { this.state.ready &&
                    <div className="row">
                        <div className="col-xs-12 col-md-8 col-md-offset-2">
                            <div className="row">
                                <div className="col-xs-12">
                                    <h1 style={{color: this.state.config.COLOR_PRIMARY}}>{translate("IMPRINT")}</h1>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xs-12">
                                    <p>
                                        <strong>{this.state.config.COMPANY_NAME}</strong>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <p>{this.state.config.COMPANY_ADDRESS}</p>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-xs-12">
                                    CEO: <p>{this.state.config.COMPANY_CEO}</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12">
                                    <p><a href={this.state.config.COMPANY_URL} target="_blank">{this.state.config.COMPANY_URL}</a></p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12">
                                    <p>{this.state.config.NAME} is powered by <a href="https://vq-labs.com" target="_blank">VQ-MARKETPLACE</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
