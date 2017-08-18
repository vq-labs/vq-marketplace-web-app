import React, { Component } from 'react';

class Review extends Component {
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
                        Review
                    </div>
                </div>
            </div>
        );
    }
}

export default Review;