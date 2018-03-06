import React, {Component} from 'react';

import * as apiAdmin from '../api/admin';
import { openConfirmDialog } from '../helpers/confirm-before-action.js';
export default class TableExampleComplex extends Component {
  constructor() {
    super()

    this.state = {};

  }

  componentDidMount() {
    openConfirmDialog({
      headerLabel: `You will be redirected to customer portal.`,
      okLabel: 'Confirm',
      cancelLabel: 'Cancel'
    }, () => {
        apiAdmin
        .tenant
        .signOnToCustomerPortal()
        .then(data => {
          console.log(data);
    
          location.href = data.portal_session.access_url;
        })
        .catch(err => {
          console.log(err);
        })
    });
  }

  render() {
    return (
      <div>
        
      </div>
    );
  }
}
