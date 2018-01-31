import React, { Component } from 'react';
import { goTo } from '../core/navigation';
import { translate } from '../core/i18n';
import Logo from './Logo';
import { getConfigAsync } from '../core/config';
import '../App.css';

const linkStyle = {
    cursor: 'pointer'
};

class Footer extends Component {
    constructor() {
        super();

        this.state = {
            config: null
        };
    }
    componentDidMount() {
        getConfigAsync(config => {
            this.setState({
                config
            });
        });
    }
    render() {
        return (
                <div id="vq-footer" className="container">
                { this.state.config &&
                    <div className="row">
                        <div className="col-xs-12 text-center" style={{
                            marginTop: 50
                        }}>
                            <Logo
                                appName={this.props.appName}
                                logo={this.props.logo}
                            />
                        </div>
                        <div className="col-xs-12 text-center">
                            <ul className="list-unstyled list-inline text-center">
                                

                                { this.state.config.CUSTOM_HOW_IT_WORKS_URL &&
                                    <li>
                                        <a
                                            style={linkStyle}
                                            href={this.state.config.CUSTOM_HOW_IT_WORKS_URL}
                                            target="_blank"
                                        >
                                            {translate("HOMEPAGE_FOOTER_HOW_IT_WORKS")}
                                        </a>
                                    </li>
                                }

                                { this.state.config.CUSTOM_BLOG_PAGE_URL &&
                                    <li>
                                        <a
                                            style={linkStyle}
                                            href={this.state.config.CUSTOM_BLOG_PAGE_URL}
                                            target="_blank"
                                        >
                                            {translate("HOMEPAGE_FOOTER_BLOG")}
                                        </a>
                                    </li>
                                }

                                { this.state.config.CUSTOM_CONTACT_PAGE_URL &&
                                    <li>
                                        <a
                                            style={linkStyle}
                                            href={this.state.config.CUSTOM_CONTACT_PAGE_URL}
                                            target="_blank"
                                        >
                                            {translate("HOMEPAGE_FOOTER_CONTACT")}
                                        </a>
                                    </li>
                                }

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
                            <small>Powered by <a target="_blank" href="https://vqmarketplace.com/?source=marketplace">VQ-MARKETPLACE</a></small>
                        </div>
                    </div>
                    }
                </div>
        );
    }
}  

export default Footer;