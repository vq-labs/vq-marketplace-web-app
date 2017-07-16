import React from 'react';
import Post from './Post';

export default class PostPrivacyPolicy extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Post postCode='privacy-policy' />
        );
    }
}
