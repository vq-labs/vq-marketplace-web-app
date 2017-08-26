import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { getConfigAsync } from '../core/config';

class Loader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: props.isLoading
        };
    }

    componentDidMount() {
        getConfigAsync(config => {
            this.setState({
                config
            });
        });
    }
    
    componentWillReceiveProps (nextProps) {
        this.setState({
            isLoading: nextProps.isLoading
        });
    } 

    render() {
        return (
            <div style={{
                display: this.state.isLoading ? 'block' : 'hidden' 
            }}>
                { this.state.config && 
                    <div className="text-center" style={{
                        marginTop: '40px',
                        height: 200
                    }}>
                        <CircularProgress
                            size={80}
                            thickness={5}
                            color={this.state.config.COLOR_PRIMARY}
                        />
                    </div>
                }
            </div>
        );
    }
}

export default Loader;
