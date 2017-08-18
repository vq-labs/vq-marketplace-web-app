import React from 'react';
import Post from './Post';

export default class ReviewCompleted extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Post postCode='review-completed' />
        );
    }
}
