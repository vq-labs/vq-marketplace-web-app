import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import DOMPurify from 'dompurify'
import HtmlTextField from '../Components/HtmlTextField';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Autocomplete from 'react-google-autocomplete';
import LoginSignup from '../Components/LoginSignup';
import * as coreAuth from '../core/auth';
import * as apiCategory from '../api/category';
import apiTask from '../api/task';
import { translate } from '../core/i18n';
import { formatGeoResults } from '../core/util';
import Snackbar from 'material-ui/Snackbar';

import Paper from 'material-ui/Paper';
const _chunk = require('lodash.chunk');

const PRICING_MODELS = {
    TOTAL: 0,
    HOURLY: 1,
    REQUEST_QUOTE: 2
};

export default class Onboarding extends Component {
    constructor(props) {
        super();

        this.state={
            value: 'signup',
            auth: coreAuth.getUserId(),
            step: 1,
            categories: [],
            insertedTask: {},
            task: {
                taskType: 1,
                categories: [],
                price: 20,
                priceType: 1,
                utm: {
                    source: 'web-app',
                    medium: 'web'
                }
            }
        };

        this.handlePriceTypeChange=this.handlePriceTypeChange.bind(this);
        this.handlePriceChange=this.handlePriceChange.bind(this);
        this.handleDescChange=this.handleDescChange.bind(this);
        this.handleTitleChange=this.handleTitleChange.bind(this);
    }

    componentDidMount() {
        apiCategory.getItems().then(categories => {
            this.setState({ categories: _chunk(categories, 3) });
        });
    }
    
    setTaskPrice (price) {
      const task = this.state.task;

      task.price = Number(price);

      this.setState({ task })
    }

    handlePriceTypeChange (event) {
      const task = this.state.task;

      task.priceType = Number(event.target.value);

      this.setState({ task });
    }

    handleTitleChange (event) {
      const task = this.state.task;
      
      task.title = event.target.value;

      this.setState({ task });
    }

    handleDescChange (event, value) {
      const task = this.state.task;
      
      task.description = value || event.target.value;

      this.setState({ task });
    }

    handlePriceChange (event) {
      const task = this.state.task;
      
      task.price = event.target.value;

      this.setState({ task });
    }
    
    render() {
            const step1 = <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <h1 className="text-left">Step 1. What would you like to offer?</h1>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-xs-12">
                                {this.state.categories.map(row => (
                                    <div className="row" style={ { marginBottom: 10 } }>
                                        { row.map(tile =>
                                            <div className="col-xs-12 col-sm-4">
                                                    <Card onClick={() => {
                                                        const task= this.state.task;
                                                        const category= { label: translate(tile.code), code: tile.code };

                                                        task.categories = [ category ];    

                                                        this.setState({ step: 2, task });
                                                    }}>
                                                        <CardMedia
                                                            overlay={<CardTitle title={translate(tile.code)} />}
                                                            >
                                                            <img alt="category" src={tile.imageUrl} />
                                                        </CardMedia>
                                                    </Card>
                                            </div>
                                        )} 
                                    </div>
                                ))}
                            </div>
                        </div>
                </div>;
        
                

                const step2 = 
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>Step 2. Determine the pricing</h1>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-xs-12">
                                <RadioButtonGroup 
                                    name="priceTypeButtons" 
                                    onChange={this.handlePriceTypeChange} 
                                    ref="priceType"
                                    style={{width: '100%'}}
                                    inputStyle={{width: '100%'}}
                                    defaultSelected={this.state.task.priceType}>
                                            <RadioButton
                                                value={PRICING_MODELS.HOURLY}
                                                label={translate("PRICING_MODEL_HOURLY")}
                                            />
                                            <RadioButton
                                                value={PRICING_MODELS.TOTAL}
                                                label={translate("PRICING_MODEL_TOTAL")}
                                            />
                                            <RadioButton
                                                value={PRICING_MODELS.REQUEST_QUOTE}
                                                label={translate("PRICING_MODEL_REQUEST_QUOTE")}
                                            />
                                </RadioButtonGroup>
                                </div>
                            </div>
                            { this.state.task.priceType !== 2 &&
                                <div className="row">
                                    <div className="col-xs-12">
                                        <TextField
                                            onChange={this.handlePriceChange}
                                            value={this.state.task.price}
                                            style={{width: '100%'}}
                                            inputStyle={{width: '100%'}}
                                            floatingLabelText="Preis"
                                        />
                                    </div>
                                </div>
                            } 
                            { this.state.task.priceType !== 2 &&
                                <div className="row">
                                    <div className="col-xs-12">
                                        <em>Quick choice:</em>
                                        { this.state.task.priceType===1 &&
                                            <div>
                                                <FlatButton label="10€" onClick={() => this.setTaskPrice(10)}/>
                                                <FlatButton label="20€" onClick={() => this.setTaskPrice(20)} />
                                                <FlatButton label="30€" onClick={() => this.setTaskPrice(30)} />
                                                <FlatButton label="40€" onClick={() => this.setTaskPrice(40)} />
                                            </div>
                                        }
                                        { this.state.task.priceType === 0 &&
                                            <div>
                                                <FlatButton label="20€" onClick={() => this.setTaskPrice(20)} />
                                                <FlatButton label="50€" onClick={() => this.setTaskPrice(50)} />
                                                <FlatButton label="100€" onClick={() => this.setTaskPrice(100)} />
                                                <FlatButton label="500€" onClick={() => this.setTaskPrice(500)} />
                                            </div>
                                        }
                                </div>
                            </div>
                          }
                </div>;

            const step3 = 
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>Step 3. Describe your offer</h1>
                        </div>
                    </div>
                    <hr />
                    <div className="row"> 
                        <div className="col-xs-12">
                            <div className="row">
                            <div className="col-xs-12">
                                <h4>Title</h4>
                                <TextField
                                    name="title"
                                    onChange={this.handleTitleChange}
                                    style={{width: '100%'}}
                                    inputStyle={{width: '100%'}}
                                    value={this.state.task.title}
                                />
                            </div>  
                        </div>  
                        <div className="row">
                            <div className="col-xs-12">
                                <h4>Description</h4>
                                <HtmlTextField onChange={this.handleDescChange} value={this.state.task.description}/>
                                <hr />
                            </div>    
                        </div>

                        <div className="row">
                           <div className="col-xs-12">
                                    <h4>Location (optional)</h4>
                                    <TextField name="location" style={{width: '100%'}}
                                        >
                                        <Autocomplete
                                            style={{width: '100%'}}
            
                                            onPlaceSelected={ place => {
                                                const task = this.state.task;

                                                task.location = formatGeoResults([ place ])[0];

                                                this.setState({ task });
                                            }}
                                            types={['(regions)']}
                                        />
                                    </TextField>
                               </div>   
                            </div>
                        </div>   
                    </div>
                </div>;


              const confirmBeforePosting = 
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>Step 4. Confirm before posting</h1>
                        </div>
                    </div>
                

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>Category</h4>
                            { this.state.task.categories.map(category => <span>{category.label}</span>) }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h4>Title</h4>
                            {this.state.task.title}
                        </div>
                    </div>
                   
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>Description</h4>
                            <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.task.description)}}></div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h4>Pricing</h4>
                            { this.state.task.priceType === 1 ? 'pro Stunde' : this.state.task.priceType === 0 ? 'pro Auftrag' : 'auf Anfrage' }
                        </div>
                    </div>

                    { this.state.task.priceType !== 2 && 
                        <div className="row">
                            <div className="col-xs-12">
                                <h4>Price</h4>
                                {this.state.task.price + '€' }
                            </div>
                        </div>
                    }
                </div>
              </div>;



              const success=<div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>Bravo! Your offer is online!</h1>
                    </div>
                </div>

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                           <RaisedButton
                                label={ 'Go to your offer' }
                                primary={ true }
                                disabled={ false }
                                onTouchTap={ () => browserHistory.push(`/app/task/${this.state.insertedTask._id}`) }
                            />
                        </div>
                    </div>
                </div>
              </div>;


              const createAccountSection = 
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>Erstellen Sie ein Konto</h1>
                        </div>
                    </div>
                

                <div className="col-xs-12">
                    <div className="row">
                        <LoginSignup
                            onSuccess={ () => this.setState({ auth: true }) }
                        />
                    </div>
                </div>
              </div>;


            return (
                    <div className="container">
                        { this.state.step===1 && step1 }
                          { this.state.step > 1 &&
                        <div className="col-xs-12 col-sm-8 col-md-6">
                            { this.state.step===2 && step2 }
                            { this.state.step===3 && step3 }
                            { this.state.step===4 && this.state.auth && confirmBeforePosting }
                            { this.state.step===4 && !this.state.auth && createAccountSection }

                            { this.state.step===5 && success }

                            

                            { this.state.step !== 5 && <hr /> }
                            
                            <div class="row" style={ { marginTop: 20 } }>
                                { this.state.step !== 5 &&  this.state.step !== 1 &&    
                                    <FlatButton
                                        style={ { float: 'left' } }
                                        label='Zurück' 
                                        primary={ true }
                                        disabled={ false }
                                        onTouchTap={ () => this.setState({ step: this.state.step - 1 }) }
                                    />
                                }
                                { this.state.step > 1 && this.state.step < 4 && 
                                    <RaisedButton
                                        style={ { float: 'right' } }
                                        label='Weiter'
                                        primary={ true }
                                        disabled={ false }
                                        onTouchTap={ () => {
                                            const nextStep = this.state.step + 1;

                                            if (nextStep === 4) {
                                                if (!this.state.task.title) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: "Titel fehlt"
                                                    });
                                                }
                                                if (!this.state.task.description) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: "Beschreibung fehlt"
                                                    });
                                                }
                                            }
                                            this.setState({ step: this.state.step + 1 })
                                        } }
                                    />
                                }
                                { this.state.step === 4 && this.state.auth &&
                                    <RaisedButton
                                        style={ { float: 'right' } }
                                        label='Inserieren'
                                        primary={ true }
                                        disabled={ false }
                                        onTouchTap={ () => {
                                            const task = this.state.task;

                                            task.price = task.priceType === 2 ? 0 : task.price * 100;

                                            this.setState({ task });
                                            
                                            apiTask
                                                .createItem(this.state.task)
                                                .then(task => this.setState({ 
                                                    insertedTask: task, 
                                                    step: this.state.step + 1
                                                }));
                                        } }
                                    />
                                }
                                <Snackbar
                                    open={this.state.openSnackbar}
                                    message={this.state.snackbarMessage}
                                    autoHideDuration={4000}
                                />
                            </div>
                        </div> 
                        }
                    </div>
            );
    }
};