import React, { Component } from 'react';

import '../App.css';

class Order extends Component {
    constructor(props) {
        super(props);
   
        this.state = {
            isLoading: true
        };
    }
    componentDidMount() {
      
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        Order completed!
                    </div>
                </div>
            </div>
        );
    }
}

export default Order;