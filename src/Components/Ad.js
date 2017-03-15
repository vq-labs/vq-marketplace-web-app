import React, { Component } from 'react';
import GoogleAd from 'react-google-ad'

export default class Ad extends Component {
  constructor(props) {
    super();
  }

  render() {
      return (
        <GoogleAd client="ca-pub-2487354108758644" slot="4660780818" format="auto" />
      );
   }
};
