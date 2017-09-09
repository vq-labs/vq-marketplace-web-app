import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { goStartPage } from '../core/navigation';

const NotFound = () =>
  <div className="container">
    <div className="row">
        <div className="col-xs-12">
            <h1>404 page not found</h1>
            <p>We are sorry but the page you are looking for does not exist.</p>
        </div>

        <div className="col-xs-12">
            <RaisedButton
                style={{ marginLeft: 10 }}
                onClick={() => {
                    goStartPage();
                }}
                label={'Go back to homepage'}
            />
        </div>
    </div>
  </div>;

export default NotFound;