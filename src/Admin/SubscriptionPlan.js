import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import * as apiAdmin from '../api/admin';

const modules = {
  registration: [
    {
      name: 'E-Mail',
      status: 'Enabled',
    }, {
      name: 'Login with Facebook',
      status: 'Disabled',
    }, {
      name: 'Login with Twitter',
      status: 'Disabled',
    }
  ],
  general: [
    {
      name: 'Basic Landing Page',
      status: 'Enabled',
    }
  ],
  i18n: [
    {
      name: 'Multilanguage',
      status: '1 Language enabled'
    }
  ],
  support: [
    {
      name: 'Support plan (Basic / Premium / Enterprise)',
      status: 'Basic'
    }
  ],
  listing: [
    {
      name: 'Listing Calendar',
      status: 'Enabled'
    }, {
      name: 'Listing Duration',
      status: 'Enabled'
    }, {
      name: 'Listing Comments',
      status: 'Enabled'
    }, {
      name: 'Listing Geolocation',
      status: 'Enabled'
    }, {
      name: 'Listing Images',
      status: 'Disabled'
    }, {
      name: 'Listing Templates',
      status: 'Disabled'
    }
  ]
}

const tableData = [
  {
    name: 'Client (User Type 1)',
    status: 'Enabled',
  },
  {
    name: 'Provider (User Type 2)',
    status: 'Enabled',
  },
  {
    name: 'Client/Provider (User Type 3)',
    status: 'Disabled',
  }
];

/**
 * A more complex example, allowing the table height to be set, and key boolean properties to be toggled.
 */
export default class TableExampleComplex extends Component {
  constructor() {
    super()

    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: true,
      height: '300px',
    };
  }

  handleToggle(event, toggled) {
    this.setState({
      [event.target.name]: toggled,
    });
  }

  handleChange(event) {
    this.setState({
      height: event.target.value
    });
  };

  upgrade = () => {
    console.log("click");
    apiAdmin.tenant.upgradeSubscription()
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    })
  };

  componentDidMount() {
    apiAdmin.tenant
    .getTenant()
    .then(tenant => {
        this.setState({
            tenant
        });
    });
}

  render() {
    return (
      <div>
        { this.state.tenant &&
          <h2>
            Your package: {this.state.tenant.tenant.chargebeeSubscriptionId ? "Paid" : "Starter" }
          </h2>
        }

        { this.state.tenant &&
          <div className="row">
          <div className="col-xs-12 col-md-4 col-lg-4">
                <div className="price-wrapp">
                  <div classname="price-header">
                    <h1>Starter</h1>
                    <h2>Free</h2>
                    <span>Have your product/market fit, get more users, gain your initial "traction".</span>
                  </div>
                
                  <div class="price-body">
                    <ul>
                      <li><b>1,000</b> users included</li>
                      <li><b>Unlimited</b> listings</li>
                      <li><b>2 languages</b></li>
                      <li>Create 2 Landing Pages</li>
                      <li>Hosted under vqmarketplace.com domain</li>
                      <li>No export of data</li>
                    </ul>
                    </div>
                    <div className="price-footer">
                      <button className="wsk-btn red" onTouchTap={() => this.upgrade()}>Upgrade</button>
                    </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-4 col-lg-4">
                <div className="price-wrapp">
                  <div classname="price-header">
                    <h1>Traction</h1>
                    <h2>249 € / Month</h2>
                    <span>Have your product/market fit, get more users, gain your initial "traction".</span>
                  </div>
                
                  <div class="price-body">
                    <ul>
                      <li><b>1,000</b> users included</li>
                      <li><b>Unlimited</b> listings</li>
                      <li><b>2 languages</b></li>
                      <li>Create 2 Landing Pages</li>
                      <li>Use your own domain</li>
                      <li>Export all data at the same time</li>
                    </ul>
                    </div>
                    <div className="price-footer">
                      <button className="wsk-btn red" onTouchTap={() => this.upgrade()}>Upgrade</button>
                    </div>
                </div>
              </div>
          </div>
        }

      </div>
    );
  }
}
