import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

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
            this.setState({ categories: _chunk(categories, 2) });
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

    handleDescChange (event) {
      const task = this.state.task;
      
      task.description = event.target.value;

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
                                <h1 className="text-left">SCHRITT 1. Was möchtest du anbieten?</h1>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-xs-12">
                                {this.state.categories.map(row => (
                                    <div className="row" style={ { marginBottom: 10 } }>
                                        { row.map(tile =>
                                            <div className="col-xs-12 col-sm-6">
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
                                <h1>SCHRITT 2. Angaben zum Preis</h1>
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
                                        <em>Schnelle Auswahl:</em>
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
                            <h1>SCHRITT 3. Beschreib dein Angebot.</h1>
                            <p className="text-muted">Titel, Kurzbeschreibung</p>
                        </div>
                    </div>
                    <hr />
                    <div className="row"> 
                        <div className="col-xs-12">
                            <div className="row">
                            <div className="col-xs-12"> 
                                <TextField
                                    name="title"
                                    onChange={this.handleTitleChange}
                                    style={{width: '100%'}}
                                    inputStyle={{width: '100%'}}
                                    floatingLabelText="Titel"
                                    value={this.state.task.title}
                                />
                            </div>  
                        </div>  
                        <div className="row">
                            <div className="col-xs-12"> 
                                <TextField
                                    name="desc"
                                    onChange={this.handleDescChange}
                                    floatingLabelText="Beschreibung"
                                    hintText="Beschreib hier dein Angebot"
                                    multiLine={true}
                                    rows={4}
                                    style={{width: '100%'}}
                                    inputStyle={{width: '100%'}}
                                    value={this.state.task.description}
                                />
                            </div>    
                        </div>

                        <div className="row">
                           <div className="col-xs-12"> 
                                    <TextField name="location" style={{width: '100%'}}
                                        >
                                        <Autocomplete
                                            placeholder="Ort (optional)"
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
                            <h1>SCHRITT 4. Bestätigung</h1>
                        </div>
                    </div>
                

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h2>
                                Kategorie: { this.state.task.categories.map(category => <span>{category.label}</span>) }
                            </h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <TextField
                                name="title"
                                onChange={this.handleTitleChange}
                                style={{width: '100%'}}
                                disabled={true}
                                inputStyle={{width: '100%'}}
                                floatingLabelText="Titel"
                                value={this.state.task.title}
                            />
                        </div>
                    </div>
                   
                    <div className="row">
                        <div className="col-xs-12">
                            <TextField
                                style={{width: '100%'}}
                                disabled={true}
                                inputStyle={{width: '100%'}}
                                floatingLabelText="Kurzbeschreibung"
                                value={this.state.task.description}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <TextField
                                style={{width: '100%'}}
                                disabled={true}
                                inputStyle={{width: '100%'}}
                                floatingLabelText="Preistyp"
                                value={this.state.task.priceType}
                            />
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-xs-12">
                            <TextField
                                style={{width: '100%'}}
                                disabled={true}
                                inputStyle={{width: '100%'}}
                                floatingLabelText="Preis"
                                value={this.state.task.price + '€' }
                            />
                        </div>
                    </div>
                </div>
              </div>;



              const success=<div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>Bravo! Dein Angebot ist online!</h1>
                    </div>
                </div>

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                           <RaisedButton
                                label={ 'Zur Angebot-Seite' }
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
                                            debugger;
                                            this.setState({ step: this.state.step + 1 })
                                        } }
                                    />
                                }
                                { this.state.step===4 && this.state.auth &&
                                    <RaisedButton
                                        style={ { float: 'right' } }
                                        label='Inserieren'
                                        primary={ true }
                                        disabled={ false }
                                        onTouchTap={ () => {
                                            const task = this.state.task;

                                            task.price = this.state.task.price * 100;

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
                            </div>
                        </div> 
                        }
                    </div>
                    
            );
    }
};