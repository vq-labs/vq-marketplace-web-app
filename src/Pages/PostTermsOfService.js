import React from 'react';
import Post from './Post';

export default class PostTermsOfService extends React.Component {
    constructor() {
        super();
    }
    
    render() {
        return (
            <Post postCode='terms-of-service' />
        );
    }
}
