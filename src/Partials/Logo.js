import React, { Component } from 'react';
import { goTo, goStartPage } from '../core/navigation';
import { getUserAsync } from '../core/auth';

class Logo extends Component {
  constructor(props) {
    super();
  }

  render() {
      return (
        <div style={{ cursor: 'marker' }}>
            <a
              onClick={ 
                () => {
                  getUserAsync(user => {
                    if (user) {
                      if (Number(user.userType) === 1) {
                        return goStartPage();
                      }
                      
                      return goTo('/');
                    }



                    return goStartPage();
                  }, true);
                }
              }
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
