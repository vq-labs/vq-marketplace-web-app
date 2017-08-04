import React, { Component } from 'react';

class Logo extends Component {
  constructor(props) {
    super();
  }

  render() {
      return (
        <div>
            <a 
              href="/"
              target="_self" 
              style={{ textDecoration: 'none' }}
            >
              { this.props.logo &&
                <img
                  alt={`${this.props.appName} (Logo)`}
                  className='imgCenter hidden-xs' 
                  src={this.props.logo} 
                  role="presentation" 
                  style={{
                    marginTop: '6px',
                    marginBottom: '3px',
                    maxHeight: '45px'
                  }}
                />
              }
              { !this.props.logo &&
                <div style={{
                        paddingTop: 20,
                        marginBottom: 10,
                        fontSize: 20
                      }}>
                    <span
                      className=""
                    >
                  {this.props.appName}
                </span>
                </div>
              }
            </a>  
        </div>
      );
   }
}   

export default Logo;
