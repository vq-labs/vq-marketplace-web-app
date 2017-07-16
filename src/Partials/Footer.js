import React, { Component } from 'react';

import { Card, } from 'material-ui/Card';
// Custom styles
import '../App.css';

class Footer extends Component {
  render() {
      return (
            <div className="container" style={{
                verticalAlign: 'baseline',
                bottom: 0,
                width: '100%',
                minHeight: 50
            }}>
                <div className="col-xs-12 text-center">
                    <a href="/" target="_self">
                        <img src={this.props.logo} role="presentation" style={{ 'marginTop': '6px','marginBottom': '8px', maxHeight: '45px' }}/>
                    </a>
                </div>
                <div className="col-xs-12 text-center">
                    Powered by <a target="_blank" href="https://vq-labs.com">VQ-MARKETPLACE</a>
                </div>
            </div>
      );
   }
}  

export default Footer;