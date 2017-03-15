import React, { Component } from 'react';

import { Card, } from 'material-ui/Card';
// Custom styles
import '../App.css';

class Footer extends Component {
  render() {
      return (
       <Card style={{'background': '#546e7a', 'color': 'white'}} >   
            <div className="container">
            
                <div className="row st-menu-line">
                
                    <div className="col-sm-3">
                        
                        <h5 className="st-text-white st-bold">StudenTask</h5>
                        <ul className="st-menu-group list-unstyled">
                            <li><a href="/">Home</a></li>
                            <li><a href="/CareerPage">Karriere</a></li>
                            <li><a href="/PressPage">Presse</a></li>
                            <li><a href="/DatenschutzPage">Datenschutz</a></li>
                            <li><a href="/terms">AGBs</a></li>
                            <li><a href="/sitemap">Sitemap</a></li>
                            <li><a href="/ContactPage">Kontakt</a></li>
                        </ul>	
                    </div>
                        <div className="col-sm-3">
                        <h5 className="st-text-white st-bold">Entdecken</h5>
                        <ul className="st-menu-group list-unstyled">
                            <li><a href="/how-does-it-work">So funktioniert's</a></li>    
                            <li><a href="/featured/tasks">Beispielaufgaben</a></li>                
                            <li><a href="/blog/quote-of-the-day">#QuoteofTheDay</a></li>
                            <li><a href="/faq">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="col-sm-3">
                        <h5 className="st-text-white st-bold">Leistungen</h5>
                        <ul className="st-menu-group list-unstyled">
                            <li><a href="/job-vergeben">Aufgabe vergeben</a></li>
                            <li><a href="/partner">Aufgabe erledigen</a></li>
                        </ul>	
                    </div> 
                                

                        <div className="col-sm-3">
                            <h5 className="st-text-white st-bold">Unternehmen</h5>
                            <ul className="st-menu-group list-unstyled">
                                <li><a href="http://viciqloud.com">ViciQloud</a></li>
                                <li><a href="/impressum">Impressum</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="row-fluid">
                    <div className="col-sm-12">
                        <div className="pull-right">
                            <ul className="list-unstyled list-inline">
                                <li>
                                    <a target="_blank" href="https://www.facebook.com/StudenTaskApp/">
                                        <i className="fa fa-facebook-official fa-2x" aria-hidden="true"></i>
                                    </a>
                                </li>  
                                <li>
                                    <a target="_blank" href="https://www.instagram.com/studentask/">
                                        <i className="fa fa-instagram fa-2x" aria-hidden="true"></i>
                                    </a>
                                </li>   
                            </ul> 
                        </div>       
                    </div> 
                    </div>
                </div>
        </Card > 
         
      );
   }
}  

export default Footer;