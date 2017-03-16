import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import * as apiSubscription from '../api/subscription';

export default class PremiumPage extends Component {
  constructor() {
    super();
    this.state = {
        newMessage: '',
        task: {},
        users: {},
        messages: [] 
    };

    this.handleSubscribe = this.handleSubscribe.bind(this);
  }

  handleSubscribe () {
    apiSubscription.createItem({
      email: this.refs.email.getValue(),
      exp_month: this.refs.exp_month.getValue(),
      exp_year: this.refs.exp_year.getValue(),
      number: this.refs.number.getValue(),
      cvc: this.refs.cvc.getValue()
    });
  }

  render() {
        return (
          <div className="container">
            <div className="col-xs-12 col-sm-8">
              <Paper style={{ padding: 10 }}>
                <div className="row" >
                  <div className="col-xs-12 col-sm-12" >
                      <h2>Rechnungsadresse</h2>
                  </div> 

                  <div className="col-xs-12 col-sm-6" >
                        <TextField
                              ref="email"
                              style={ { width: '100%' } }
                              floatingLabelText="Email"
                          />
                  </div>   

                  <div className="col-xs-12 col-sm-12" >
                      <div className="row">
                        <div className="col-xs-12 col-sm-6" >
                            <TextField
                                  ref="firstName"
                                  style={ { width: '100%' } }
                                  floatingLabelText="Vorname"
                              />
                          </div>   
                          <div className="col-xs-12 col-sm-6" >
                              <TextField
                                  ref="lastName"
                                  style={ { width: '100%' } }
                                  floatingLabelText="Nachname"
                              />
                          </div>
                        </div>      
                  </div>  
                  <div className="col-xs-12 col-sm-12" >
                    <div className="row">
                      <div className="col-xs-12 col-sm-6" >
                          <TextField
                                ref="companyName"
                                style={ { width: '100%' } }
                                floatingLabelText="Unternehmensname (optional)"
                            />
                        </div>   
                        <div className="col-xs-12 col-sm-6" >
                            <TextField
                                ref="vat"
                                style={ { width: '100%' } }
                                floatingLabelText="Umsatzsteuernummer (optional)"
                            />
                        </div>  
                      </div>     
                  </div>       
                  <div className="col-xs-12 col-sm-12" >
                      <div className="row">
                          <div className="col-xs-12 col-sm-6" >
                              <TextField
                                  ref="number"
                                  style={ { width: '100%' } }
                                  floatingLabelText="Kreditkartennummer"
                              />
                          </div> 


                          <div className="col-xs-12 col-sm-6" >
                              <div className="row">
                                <div className="col-xs-6" >
                                  <TextField
                                      ref="exp_year"
                                      style={ { width: '100%' } }
                                      floatingLabelText="Jahr"
                                  />
                                </div>
                                <div className="col-xs-6" > 
                                  <TextField
                                      ref="exp_month"
                                      style={ { width: '100%' } }
                                      floatingLabelText="Monat"
                                  />
                              </div>
                            </div>  
                        </div> 
                      </div>
                      <div className="col-xs-12 col-sm-6" >
                        <div className="row">
                              <div className="col-xs-6">
                                  <TextField
                                      ref="cvc"
                                      style={ { width: '100%' } }
                                      floatingLabelText="CVC"
                                   />
                              </div>
                           </div> 
                      </div>   

                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12">
                    <div className="col-xs-12 col-sm-6">
                      <RaisedButton type="submit" onClick={this.handleSubscribe} label="Jetzt kaufen" />
                    </div> 
                  </div>  
                </div>  
              </Paper>  
            </div>
            <div className="col-xs-12 col-sm-4">
              <Paper>
                  <div class="row">
                    <div class="col-xs-12">
                      <h2>Ihre Bestellung</h2>
                      ST Premium<br />
                      Preis: 10€<br />
                      (incl. VAT)
                    </div>
                  </div>  
               </Paper>  
            </div>


            
          </div>
        );
  }
}