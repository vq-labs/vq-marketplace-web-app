import React, { Component } from 'react';
import apiTask from '../api/task';
import Paper from 'material-ui/Paper';
import * as coreAuth from '../core/auth';
import Toggle from 'material-ui/Toggle';
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import * as coreNavigation from '../core/navigation';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';

const style = {
    margin: 20,
    textAlign: 'center',
    display: 'block',
    color: '#546e7a',
    overlfow: 'scroll'
};

const styles = {
  block: {
    maxWidth: 250
  },
  thumbOff: {
    backgroundColor: '#ffcccc',
  },
  trackOff: {
    backgroundColor: '#ff9d9d',
  },
  thumbSwitched: {
    backgroundColor: 'red',
  },
  trackSwitched: {
    backgroundColor: '#ff9d9d',
  },
  labelStyle: {
    color: 'red',
  },
};

class MyListings extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            
            activeTab: 0,
            isLoading: false,
            offers: []
            
        };

        this.getOfferProgress = this.getOfferProgress.bind(this);
        this.handleActive = this.handleActive.bind(this);
        this.getOfferHeadline = this.getOfferHeadline.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.deactivateTask = this.deactivateTask.bind(this);   
        this.getTaskId = this.getTaskId.bind(this);
    }

    componentDidMount() {
        let listingStatus = 0;

        this.loadTasks(listingStatus);
    }

    deactivateTask(taskId) {
        this.changeStatus(taskId, 103);
    }

    activateTask(taskId) {
        this.changeStatus(taskId, 0); 
    }

    changeStatus(taskId, status) { 
        let offers = this.state.offers;

        apiTask
            .updateItem(taskId, { status })
            .then(task => {
              let  offer = offers.find((item) => item.id === taskId);
                offer.status = status;
                this.setState({ offers: offer })
            });
    }


     loadTasks(listingStatus) {
         this.setState({
            isLoading: true
        });
      
        apiTask.getItems({
            taskType: 1,
            status: listingStatus,
            userId: coreAuth.getUserId()
        })
        .then(offers => {
            this.setState({
                isLoading: false,
                offers: offers
            });
        });
    }
    handleActive(tab) {
        let tabType = tab.props.value;
        let listingStatus = 0;

        if (tabType === 0) {
            listingStatus = 0
        }

        if (tabType === 10) {
            listingStatus = 10
        }

        if (tabType === 103) {
            listingStatus = 103
        }

        this.setState({ 
            activeTab: listingStatus
        });
        this.loadTasks(listingStatus);
    }

    getOfferHeadline(offer) {
        if (offer.categories && offer.categories[0]) {
            return offer.categories[0].code;
        }

        return offer.title || 'Title/Task In Progress';
    }
                                                                        
    getOfferProgress(offer) {
        var offerProgress = 0;
        
        if (offer.title ) {
             offerProgress++
        }

        if (offer.price ) {
             offerProgress++
        }

        if (offer.description ) {
             offerProgress++
        }

        if (offer.images) {
             offerProgress++
        }
        
        return offerProgress * 25 ;
        
    }
    getTaskId(offer){
        let taskId= offer.id;

        return taskId;   
    }
    render() {
        return (<div>
                    <div className="container" >
                            <div className="row">
                                    <div className="col-xs-12 col-sm-4" style={{'paddingLeft':'30px', 'marginTop':'70px', 'marginBottom':'10px' }} >
                                                <RaisedButton   label="Add new Insertion" primary={true}  onClick={ () => coreNavigation.goTo(`/new-listing`)} />
                                    </div>
                                    <div className="col-xs-12 col-sm-8">
                                        <div className="col-xs-12 col-sm-12"> 
                                                  <Tabs value={this.state.activeTab}
                                                    tabItemContainerStyle={{ backgroundColor: 'transparent' }}
                                                     >  
                                                         <Tab label="Activated"  
                                                              value={0}
                                                              data-route="activate"
                                                              style={{ color: 'black' }}
                                                              onActive={this.handleActive}
                                                              >
                                                               { this.state.isLoading && <CircularProgress size={80} thickness={5} style={{ 'marginTop':'125px', 'marginLeft':'300px' }}  /> }
                                                                    { !this.state.isLoading &&   <div className="col-xs-12 col-sm-12">
                                                                        { this.state.offers.map(offer => {
                                                                            const offerProgress = this.getOfferProgress(offer);
                                                                            const taskId = offer.id;
                                                                                return( 
                                                                                     <Paper style={style} zDepth={1} >
                                                                                                <div className="row">  
                                                                                                    <div className="col-xs-12 col-sm-8"  >
                                                                                                            <img className="img-responsive"  src={ offer.images && offer.images[0] ? offer.images[0].imageUrl  : 'https://talentwand.de/images/categories/design.jpg' } role="presentation" />
                                                                                                    </div>
                                                                                                    <div className="col-xs-12 col-sm-4"  >
                                                                                                        
                                                                                                            <div className="col-xs-12 col-sm-12" style={{ 'marginTop':'5px', 'marginBottom':'5px' }} >
                                                                                                                    <LinearProgress mode="determinate" value={offerProgress}  />
                                                                                                                    <span style={{'color':'#546e7a'}} >{offerProgress}%</span>  
                                                                                                            </div>
                                                                                                        
                                                                                                            <div className="col-xs-12 col-sm-12" style={{ 'marginTop':'15px' }}>
                                                                                                                    <h5>{offer.title}</h5> <h5>{taskId}</h5> 
                                                                                                            </div>
                                                                                                        
                                                                                                            <div className="col-xs-12 col-sm-12" style={{ 'marginTop':'15px', 'marginBottom':'10px'  }} >
                                                                                                                 <RaisedButton label="Deactivate" primary={true} fullWidth={true}  onClick= { () => this.deactivateTask(taskId) } /> 
                                                                                                            </div>
                                                                                                        </div>  
                                                                                                </div>
                                                                                        </Paper> 
                                                                                        )    
                                                                                    }) 
                                                                                }
                                                                            </div>
                                                                         }
                                                                    </Tab>
                                                                    <Tab label="Draft" 
                                                                         value={10}
                                                                         data-route="inEdit"
                                                                         style={{ color: 'black' }}
                                                                         onActive={this.handleActive}
                                                                         >
                                                                         { this.state.isLoading && <CircularProgress size={80} thickness={5} style={{ 'marginTop':'125px', 'marginLeft':'300px' }}  /> }
                                                                            { !this.state.isLoading &&  <div className="col-xs-12 col-sm-12">
                                                                                { this.state.offers.map( offer => {
                                                                                   const offerProgress = this.getOfferProgress(offer);
                                                                                     return(
                                                                                        <Paper style={style} zDepth={1} >
                                                                                            <div className="row">  
                                                                                                <div className="col-xs-12 col-sm-8"  >
                                                                                                        <img className="img-responsive"  src={ offer.images && offer.images[0] ? offer.images[0].imageUrl  : 'https://talentwand.de/images/categories/design.jpg' } role="presentation" />
                                                                                                </div>
                                                                                                <div className="col-xs-12 col-sm-4"  >
                                                                                                        <div className="col-xs-12 col-sm-12" style={{ 'marginTop':'5px', 'marginBottom':'5px'   }}>
                                                                                                                <LinearProgress mode="determinate" value={offerProgress}  />
                                                                                                                <span style={{'color':'#546e7a'}} >{offerProgress}%</span>  
                                                                                                        </div>
                                                                                                        <div className="col-xs-12 col-sm-12" style={{ 'marginTop':'5px' }}>
                                                                                                                <h5>{ this.getOfferHeadline(offer) }</h5>
                                                                                                        </div>
                                                                                                        <div className="col-xs-12 col-sm-12"  style={{ 'marginTop':'5px', 'marginBottom':'5px'  }}>
                                                                                                                <RaisedButton label="Edit" primary={true} fullWidth={true}  onClick={ () => coreNavigation.goTo(`/task/8/edit`)} /> 
                                                                                                        </div>
                                                                                                        <div className="col-xs-12 col-sm-12" style={{ 'marginTop':'5px', 'marginBottom':'5px'  }} >
                                                                                                                <RaisedButton label="Deactivate" primary={true} fullWidth={true}   /> 
                                                                                                        </div>
                                                                                                    </div>  
                                                                                                </div> 
                                                                                          </Paper>
                                                                                        )    
                                                                                    }) 
                                                                                } 
                                                                            </div> 
                                                                          }
                                                                    </Tab>
                                                                    <Tab
                                                                        label="Deactived"
                                                                        value={103}
                                                                        data-route="deActivate"
                                                                        style={{ color: 'black' }}
                                                                        onActive={this.handleActive}
                                                                        >
                                                                        { this.state.isLoading && <CircularProgress size={80} thickness={5} style={{ 'marginTop':'125px', 'marginLeft':'300px' }}  /> }
                                                                            { !this.state.isLoading && <div className="col-xs-12 col-sm-12">
                                                                                 { this.state.offers.map( offer => {
                                                                                     const offerProgress = this.getOfferProgress(offer);
                                                                                     const taskId = this.getTaskId(offer);
                                                                                        return(
                                                                                                <Paper style={style} zDepth={1} >
                                                                                                    <div className="row">  
                                                                                                            <div className="col-xs-12 col-sm-8"  >
                                                                                                                    <img className="img-responsive"  src={ offer.images && offer.images[0] ? offer.images[0].imageUrl  : 'https://talentwand.de/images/categories/design.jpg' } role="presentation" />
                                                                                                            </div>
                                                                                                            <div className="col-xs-12 col-sm-4"  >
                                                                                                                    <div className="col-xs-12 col-sm-12" style={{ 'marginTop':'5px', 'marginBottom':'5px'   }}>
                                                                                                                            <LinearProgress mode="determinate" value={offerProgress}  />
                                                                                                                            <span style={{'color':'#546e7a'}} >{offerProgress}%</span>  
                                                                                                                    </div>
                                                                                                                    <div className="col-xs-12 col-sm-12" >
                                                                                                                            <h5>{offer.title}</h5>  <h5>{taskId}</h5> 
                                                                                                                    </div>
                                                                                                                    <div className="col-xs-12 col-sm-12"  style={{ 'marginTop':'15px', 'marginBottom':'10px'  }}>
                                                                                                                            <RaisedButton label="Activate" primary={true} fullWidth={true}  onClick={ () =>   this.activateTask(taskId) }  /> 
                                                                                                                    </div>
                                                                                                                </div>  
                                                                                                           </div> 
                                                                                                    </Paper>
                                                                                                  )    
                                                                                                }) 
                                                                                                }
                                                                                          </div> 
                                                                                          }
                                                                                    </Tab> 
                                                                             </Tabs>
                                                                         </div>
                                                                     </div> 
                                                                </div> 
                                                         </div> 
                                                    </div>)
                                                    }
                                                }
export default MyListings;