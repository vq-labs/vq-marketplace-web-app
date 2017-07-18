import React, { Component } from 'react';
import { goTo } from '../core/navigation';
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
                    <ul className="list-unstyled list-inline text-center">
                        <li>
                            <a onClick={() => goTo('/privacy')}>Privacy policy</a>
                        </li>
                        <li>
                            <a onClick={() => goTo('/terms')}>Terms of Service</a>
                        </li>
                        <li>
                            <a onClick={() => goTo('/imprint')}>Imprint</a>
                        </li>
                    </ul>
                </div>
                <div className="col-xs-12 text-center">
                    <small>Powered by <a target="_blank" href="https://vq-labs.com">VQ-MARKETPLACE</a></small>
                </div>
            </div>
      );
   }
}  

export default Footer;