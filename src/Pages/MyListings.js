import React, { Component } from 'react';
import apiTask from '../api/task';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import * as coreNavigation from '../core/navigation';
import LinearProgress from 'material-ui/LinearProgress';


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
        
        if ( offer.title ) {
             offerProgress++
        }
        if ( offer.price ) {
             offerProgress++
        }
        if ( offer.description ) {
             offerProgress++
        }
        if ( offer.images) {
             offerProgress++
        }
        return offerProgress * 25 ;
        
    }


    render() {
       
        return (<div>
                    <div className="container" >
                            <div className="row">
                                        <div className="col-xs-12 col-sm-4" style={{'paddingLeft':'20px'}} >
                                                <RaisedButton   label="Add new Insertion" primary={true}  onClick={ () => coreNavigation.goTo(`/new-listing`)} />
                                        </div>
                                        <div className="col-xs-12 col-sm-8">
                                            <div className="row" >
                                                <div className="col-xs-12 col-sm-12">
                                                     <h1 style={{'fontSize':'30px', 'marginTop':'0px'}} >In Progress</h1>
                                                 </div>
                                            </div>  {/* this respective row is closed  */}
                                             <div className="row" >
                                             <div className="col-xs-12 col-sm-12"  >
                                               
                                               { this.state.offers.map( offer => {
                                                    const offerProgress = this.getOfferProgress(offer);
                                                    return(
                                                            <Paper style={style} zDepth={1} >
                                                                        <div className="col-xs-12 col-sm-12" style={{ 'padding':'0 0 0 0' }}>
                                                                        <img className="img-responsive"  src={ offer.images && offer.images[0] ? offer.images[0].imageUrl  : 'https://talentwand.de/images/categories/design.jpg' } role="presentation" />
                                                                        </div>     
                                                                    
                                                                            <div className="col-xs-12 col-sm-12"  >
                                                                                    <h3>{offer.title}</h3>
                                                                                </div>
                                                                    
                                                                    
                                                                            <div className="col-xs-12 col-sm-6"  style={{ 'marginTop':'10px' }}>
                                                                                <LinearProgress mode="determinate" value={offerProgress}  />
                                                                                <span style={{'color':'#546e7a'}} >{offerProgress}%</span>
                                                                            </div>
                                                                            <div className="col-xs-12 col-sm-6">
                                                                                <RaisedButton label="Edit" primary={true} />
                                                                            </div>
                                                            </Paper>
                                                        )    
                                                    }) 
                                                }  
                                                </div> {/* sm-12 closed */}
                                      </div>   {/* row closed before sm-12 */}
                                </div> {/* sm-8 close */}
                          </div> {/* 1st row closed  */}
                    </div> {/* container closed  */}
          </div>)
    }
}

export default MyListings;