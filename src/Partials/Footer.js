import React, { Component } from 'react';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';
import Logo from './Logo';
import '../App.css';

const linkStyle = {
    cursor: 'pointer'
};

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
                    <Logo
                        appName={this.props.appName}
                        logo={this.props.logo}
                    />
                </div>
                <div className="col-xs-12 text-center">
                    <ul className="list-unstyled list-inline text-center">
                        <li>
                            <a  
                                style={linkStyle}
                                onClick={() => goTo('/privacy')}
                            >
                                {translate('PRIVACY_POLICY')}
                            </a>
                        </li>
                        <li>
                            <a 
                                style={linkStyle}
                                onClick={() => goTo('/terms')}
                            >
                                {translate('TERMS_OF_SERVICE')}
                            </a>
                        </li>
                        <li>
                            <a
                                style={linkStyle}
                                onClick={() => goTo('/imprint')}>
                                {translate('IMPRINT')}
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="col-xs-12 text-center">
                    <small>Powered by <a target="_blank" href="https://vq-labs.com?source=marketplace">VQ-MARKETPLACE</a></small>
                </div>
            </div>
      );
   }
}  

export default Footer;