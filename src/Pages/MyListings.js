import React, { Component } from 'react';
import apiTask from '../api/task';
import DOMPurify from 'dompurify';
import { Link } from 'react-router'
import Paper from 'material-ui/Paper';
import * as coreNavigation from '../core/navigation';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardTitle, CardMedia, CardText} from 'material-ui/Card';

const style = {
    height: 150,
    width: 300,
    margin: 20,
    textAlign: 'center'
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


    render() {
       
        return (
            <div>                   
                <div className="container" >
                    <div className="row">
                        <div className="col-sm-3 col-sm-offset-1">
                            <RaisedButton label="Add new Insertion" primary={true}  onClick={ () => coreNavigation.goTo(`/new-listing`)} />
                        </div> 
                        <div className="col-sm-8">
                            <h1 style={{ "fontSize":"30px"}}>In Progress</h1>
                              { this.state.offers.map( offer => {
                                return(<Paper style={style} zDepth={1}>
                                            <div className="col-xs-12" style={{ 'display':'inline' } } >
                                                <div  className="col-xs-6" >
                                                <img src={ offer.images && offer.images[0] ? offer.images[0].imageUrl  : '' } />
                                            </div>
                                            <div  className="col-xs-6"  style={{ 'textAlign':'right'}} >
                                                <h4 style={{ 'marginTop':'30px' } }>{offer.title}</h4>
                                                <RaisedButton label="Edit" secondary={true} style={{ 'marginTop':'10px' } } />
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