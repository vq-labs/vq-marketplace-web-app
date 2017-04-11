import React, { Component } from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import DOMPurify from 'dompurify'
import HtmlTextField from '../Components/HtmlTextField';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Autocomplete from 'react-google-autocomplete';
import LoginSignup from '../Components/LoginSignup';
import ImageUploader from '../Components/ImageUploader';
import * as coreAuth from '../core/auth';
import * as apiCategory from '../api/category';
import apiTask from '../api/task';
import * as apiTaskImage from '../api/task-image';
import * as apiTaskLocation from '../api/task-location';
import * as apiTaskCategory from '../api/task-category';
import { translate } from '../core/i18n';
import * as coreNavigation from '../core/navigation';
import { formatGeoResults } from '../core/util';
import Snackbar from 'material-ui/Snackbar';

const _chunk = require('lodash.chunk');

const PRICING_MODELS = {
    TOTAL: 0,
    HOURLY: 1,
    REQUEST_QUOTE: 2
};

export default class NewListing extends Component {
    constructor(props) {
        super();

        this.state = {
            value: 'signup',
            auth: coreAuth.getUserId(),
            step: 1,
            categories: [],
            insertedTask: {},
            task: {
                taskType: 1,
                categories: [],
                images: [],
                utm: {
                    source: 'web-app',
                    medium: 'web'
                }
            }
        };

        if (props.params.taskId) {
            apiTask
                .getItem(props.params.taskId)
                .then(task => {
                    let step = 1;

                    task.price = task.price / 100;

                    if (task.categories && task.categories.length) {
                        step = 2;
                    }

                    if (typeof task.priceType !== 'undefined' & task.priceType !== null) {
                        step = 3;
                    }

                    if (task.title && task.description) {
                        step = 4;
                    }

                    if (task.images && task.images.length) {
                        step = 5;
                    }

                    this.setState({ task, step })
                });
        }

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
                                <h1 className="text-left">{translate("STEP")} 1. {translate("CHOOSE_CATEGORY_LISTING")}</h1>
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
                                                        const task = this.state.task;

                                                        if (task.id) {
                                                            task.categories = [ tile.code ];    

                                                            apiTaskCategory.createItem(task.id, [ tile.code ]);

                                                            this.setState({ step: 2, task });
                                                        } else {
                                                             apiTask
                                                                .createItem({})
                                                                .then(rTask => {
                                                                    task.categories = [ tile.code ];

                                                                    apiTaskCategory
                                                                    .createItem(rTask.id, [ tile.code ])
                                                                    .then(data => {
                                                                        this.setState({ step: 2, task: rTask })
                                                                    });
                                                                });
                                                        }
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
                                <h1>{translate("STEP")} 2. {translate("DETERMINE_PRICING_MODEL")}</h1>
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
                                            floatingLabelText={translate("PRICE")}
                                        />
                                    </div>
                                </div>
                            } 
                            { this.state.task.priceType !== 2 &&
                                <div className="row">
                                    <div className="col-xs-12">
                                        <em>{translate("QUICK_CHOICE")}:</em>
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
                            <h1>{translate("STEP")} 3. {translate("DESCRIBE_YOUR_LISTING")}</h1>
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
                                    onChange={this.handleTitleChange}
                                    style={{width: '100%'}}
                                    inputStyle={{width: '100%'}}
                                    value={this.state.task.title}
                                />
                            </div>  
                        </div>  
                        <div className="row">
                            <div className="col-xs-12">
                                <h4>{translate("DESCRIPTION")}</h4>
                                <HtmlTextField onChange={this.handleDescChange} value={this.state.task.description}/>
                                <hr />
                            </div>    
                        </div>

                        <div className="row">
                           <div className="col-xs-12">
                                    <h4>{translate("LOCATION")} ({translate("OPTIONAL")})</h4>
                                    {this.state.task.location && this.state.task.location.formattedAddress}
                                    <TextField name="location" style={{width: '100%'}}>
                                        <Autocomplete
                                            style={{width: '100%'}}
                                            onPlaceSelected={ place => {
                                                const task = this.state.task;
                                                
                                                task.virtual = false;
                                                task.location = formatGeoResults([ place ])[0];

                                                apiTaskLocation.createItem(task.id, task.location);

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
                            <h1>Step 4. {translate("CONFIRM_BEFORE_POSTING")}</h1>
                        </div>
                    </div>
                

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("CATEGORY")}</h4>
                            { this.state.task.categories.map(category => <span>{category.label}</span>) }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("TITLE")}</h4>
                            {this.state.task.title}
                        </div>
                    </div>
                   
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("DESCRIPTION")}</h4>
                            <div className="content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.task.description)}}></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h4>{translate("PRICING")}</h4>
                            { this.state.task.priceType === 1 ? translate("PRICING_MODEL_HOURLY") : this.state.task.priceType === 0 ? translate("PRICING_MODEL_TOTAL") : translate("PRICING_MODEL_REQUEST_QUOTE") }
                        </div>
                    </div>

                    { this.state.task.priceType !== 2 && 
                        <div className="row">
                            <div className="col-xs-12">
                                <h4>{translate("PRICE")}</h4>
                                {this.state.task.price + '€' }
                            </div>
                        </div>
                    }
                </div>
              </div>;

              const success=<div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>Bravo! {translate("YOUR_LISTING_HAS_BEEN_SUBMITTED")}</h1>
                    </div>
                </div>

                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                           <RaisedButton
                                label={'Go to your offer'}
                                primary={true}
                                disabled={false}
                                onTouchTap={() => coreNavigation.goTo(`/task/${this.state.task.id}`)}
                            />
                        </div>
                    </div>
                </div>
              </div>;

              const addImages =
                <div className="col-xs-12" style={{ marginTop: 10, marginBottom: 20 }}>
                       
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>{translate("STEP")} 4. {translate("ADD_PICTURE_HEADER")}</h1>
                                <p className="text-muted">{translate("ADD_PICTURE_DESC")}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <ImageUploader images={this.state.task.images} onChange={images => {
                                    const task = this.state.task;

                                    apiTaskImage.createItem(task.id, images);

                                    task.images = images;
                       
                                    this.setState({ task });
                             }} />
                        </div>
                </div>;

              const createAccountSection =
                <div className="col-xs-12">
                        <div className="row">
                            <LoginSignup
                                onSuccess={ () => this.setState({ auth: true }) }
                            />
                        </div>
                </div>;

            return (
                    <div className="container">
                        { this.state.step===1 && step1 }
                          { this.state.step > 1 &&
                        <div className="col-xs-12 col-sm-8 col-md-6">
                            { this.state.step===2 && step2 }
                            { this.state.step===3 && step3 }
                            { this.state.step===4 && this.state.auth && addImages }
                            { this.state.step===4 && !this.state.auth && createAccountSection }
                            { this.state.step===5 && this.state.auth && confirmBeforePosting }
                            { this.state.step===6 && success }

                            { this.state.step !== 5 && <hr /> }
                            
                            <div class="row" style={ { marginTop: 20 } }>
                                { this.state.step !== 6 &&  this.state.step !== 1 &&    
                                    <FlatButton
                                        style={ { float: 'left' } }
                                        label={translate("BACK")}
                                        primary={ true }
                                        disabled={ false }
                                        onTouchTap={ () => this.setState({ step: this.state.step - 1 }) }
                                    />
                                }
                                { this.state.step > 1 && this.state.step < 5 && 
                                    <RaisedButton
                                        style={ { float: 'right' } }
                                        label={translate("CONTINUE")}
                                        primary={ true }
                                        disabled={ false }
                                        onTouchTap={() => {
                                            const nextStep = this.state.step + 1;
                                            const updatedTask = JSON.parse(JSON.stringify(this.state.task));

                                            updatedTask.price *= 100;
                                            
                                            apiTask.updateItem(this.state.task.id, updatedTask);

                                            if (nextStep === 4) {
                                                if (!this.state.task.title) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("TITLE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                                if (!this.state.task.description) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("DESCRIPTION") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                            }

                                            if (nextStep === 3) {
                                                if (typeof this.state.task.priceType === 'undefined') {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("PRICE_TYPE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                                if (!this.state.task.price && this.state.task.priceType !== 2) {
                                                    return this.setState({
                                                        openSnackbar: true,
                                                        snackbarMessage: translate("PRICE") + " " + translate("IS_REQUIRED")
                                                    });
                                                }
                                            }

                                            this.setState({ step: this.state.step + 1 })
                                        } }
                                    />
                                }
                                { this.state.step === 5 && this.state.auth &&
                                    <RaisedButton
                                        style={ { float: 'right' } }
                                        label={translate("CONFIRM_AND_POST")}
                                        primary={true}
                                        disabled={false}
                                        onTouchTap={ () => {
                                            const task = this.state.task;

                                            apiTask
                                                .updateItem(task.id, { status: 0 })
                                                .then(task => this.setState({
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