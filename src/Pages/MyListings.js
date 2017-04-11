import React, { Component } from 'react';
import apiTask from '../api/task';
import DOMPurify from 'dompurify';
import { Link } from 'react-router'
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import * as coreNavigation from '../core/navigation';
import LinearProgress from 'material-ui/LinearProgress';
import {Card, CardTitle, CardMedia, CardText} from 'material-ui/Card';

const style = {
    height: 350,
    width: 400,
    margin: 20,
    textAlign: 'center',
    display: 'block',
    color: '#546e7a',
    overlfow: 'scroll'
};

class MyListings extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
                    isLoading: false,
                    description: "",
                    title: "",
                    offers: [
                        
                    ]
            };
            this.getOfferProgress = this.getOfferProgress.bind(this);
         
    }
      componentDidMount() {
        this.loadTasks();
    }
    
     loadTasks(query) {
         this.setState({
            isLoading: true
        });
        
        apiTask.getItems({
            task_type: 1,
            // status: 0,
            // owner_user_id: coreApi.getMyUserId
        })
        .then(offers => {
            this.setState({
                isLoading: false,
                offers: offers
                
            });
        });
    }

    getOfferProgress(offer) {
        var offerProgress = 0;
        if (offer.title && offer.price && offer.description && offer.images) {
            return  offerProgress = 100;
        }
        else if (offer.title && offer.price && offer.description ) {
            return offerProgress = 75;
        }
          else if (offer.title && offer.price  ) {
            return offerProgress = 50;
        }
          else if (offer.title ) {
            return offerProgress = 25;
        }
          else {
            return offerProgress;
        }
    }


    render() {
       
        return (
            <div>                   
                <div className="container" >
                    <div className="row">
                        <div className="col-xs-3 col-xs-offset-1 ">
                            <RaisedButton   label="Add new Insertion" primary={true}  onClick={ () => coreNavigation.goTo(`/new-listing`)} />
                        </div> 
                        <div className="col-xs-8">
                            <h1 style={{ "fontSize":"30px"}}>In Progress</h1>
                                { this.state.offers.map( offer => {
                                  const offerProgress = this.getOfferProgress(offer);
                                return(
                                                    <Paper style={style} zDepth={1} >
                                           
                                                         <div className="container col-xs-12">
                                                            <div className="row" >
                                                                      <div className="col-xs-12" style={{'padding':'0'}} >
                                                                        <img className="img-responsive"  src={ offer.images && offer.images[0] ? offer.images[0].imageUrl  : 'https://talentwand.de/images/categories/design.jpg' } role="presentation" />
                                                                      </div>
                                                            </div>
                                                             <div className="row">
                                                                    <div className="col-xs-12">
                                                                        <div style={{ 'marginTop':'10px' }} >
                                                                            <h3>{offer.title}</h3>
                                                                        </div>
                                                                    </div>
                                                            </div>
                                                            <div className="row" style={{ 'marginTop':'10px' }} >
                                                                    <div className="col-xs-6" >
                                                                        <LinearProgress mode="determinate" value={offerProgress}  />
                                                                        <span style={{'color':'#546e7a'}} >{offerProgress}%</span>
                                                                    </div>
                                                                    <div className="col-xs-6">
                                                                        <RaisedButton label="Edit" primary={true}   />
                                                                    </div>
                                                            </div>
                                                            
                                                        </div>
                                                   
                                        </Paper>
                                       
                                        )    
                                }) 
                            }  
                        </div> 
                    </div> 
                </div> 
            </div>  
        )
    }
}

export default MyListings;