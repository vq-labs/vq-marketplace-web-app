import React, { Component } from 'react';
import apiTask from '../api/task';
import DOMPurify from 'dompurify';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardTitle, CardText} from 'material-ui/Card';


class YourInserate extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
                    isLoading: false,
                   description: "",
                    title: "",
               offers: []

         
            
        };

         
    }
      componentDidMount() {
        this.loadTasks(this.props.location.query);
    }
    
     loadTasks(query) {
         this.setState({
            isLoading: true
        });
        
        apiTask.getItems({
            task_type: 1,
            owner_user_id: query.owner_user_id
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
                        <div className="col-sm-4 col-sm-offset-1">
                            <h4>Insert</h4>
                            <h4>Buchung</h4>
                            <RaisedButton label="Primary" primary={true}  />
                          
                        </div> 
                        <div className="col-sm-6">
                            <Card style={{ marginBottom:'40px' } } >
                                <CardTitle title="In Progress" style={ { backgroundColor:'silver'  }} />
                                    <CardText>
                                    
                                      
                                    </CardText>
                            
                            </Card>

                            <Card>
                                <CardTitle title="Not Inserted" style={ { backgroundColor:'silver'  }} />
                                    <CardText>
                                        
                                    </CardText>
                            
                            </Card>
                        </div> 
                    </div> 
                </div> 
            </div>  
        )
    }
}

export default YourInserate;