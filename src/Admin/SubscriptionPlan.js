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

  render() {
    return (
      <div>
        <h2>
          Your package: <b>Custom</b>
        </h2>
        <p className="text-muted">
          Available packages: Startup, Growth, Scale, Enterprise. Legacy contracts are listed under 'Custom' pricing plan. Learn more about our pricing <a href="https://vq-labs.com/pricing?source=marketplace" target="_blank">here</a>.
        </p>
        <Table selectable={false} >
          <TableBody displayRowCheckbox={false}>
            <TableRow>
                <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                    General
                </TableHeaderColumn>
            </TableRow>

            {modules.general.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn colSpan="2">{row.name}</TableRowColumn>
                <TableRowColumn colSpan="1">{row.status}</TableRowColumn>
                <TableRowColumn colSpan="1"><a target="_blank" href="https://vqlabs.freshdesk.com/support/tickets/new">Upgrade / Downgrade</a></TableRowColumn>
              </TableRow>
            ))}

            <TableRow>
              <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                  Registration
              </TableHeaderColumn>
            </TableRow>
            {modules.registration.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn colSpan="2">{row.name}</TableRowColumn>
                <TableRowColumn colSpan="1">{row.status}</TableRowColumn>
                <TableRowColumn colSpan="1"><a target="_blank" href="https://vqlabs.freshdesk.com/support/tickets/new">Upgrade / Downgrade</a></TableRowColumn>
              </TableRow>
            ))}

            <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                Internationalisation
            </TableHeaderColumn>
            {modules.i18n.map((row, index) => (
              <TableRow key={index}>
                <TableRowColumn colSpan="2">{row.name}</TableRowColumn>
                <TableRowColumn colSpan="1">{row.status}</TableRowColumn>
                <TableRowColumn colSpan="1"><a target="_blank" href="https://vqlabs.freshdesk.com/support/tickets/new">Upgrade / Downgrade</a></TableRowColumn>
              </TableRow>
            ))}

            <TableRow>
              <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                  Users
              </TableHeaderColumn>
            </TableRow>
            {tableData.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn colSpan="2">{row.name}</TableRowColumn>
                <TableRowColumn colSpan="1">{row.status}</TableRowColumn>
                <TableRowColumn colSpan="1"><a target="_blank" href="https://vqlabs.freshdesk.com/support/tickets/new">Upgrade / Downgrade</a></TableRowColumn>
              </TableRow>
            ))}

            <TableRow>
              <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                  Support
              </TableHeaderColumn>
            </TableRow>
            {modules.support.map((row, index) => (
              <TableRow key={index}>
                <TableRowColumn colSpan="2">{row.name}</TableRowColumn>
                <TableRowColumn colSpan="1">{row.status}</TableRowColumn>
                <TableRowColumn colSpan="1"><a target="_blank" href="https://vqlabs.freshdesk.com/support/tickets/new">Upgrade / Downgrade</a></TableRowColumn>
              </TableRow>
            ))}

              <TableRow>
                <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                    Listing
                </TableHeaderColumn>
              </TableRow>
              {modules.listing.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn colSpan="2">{row.name}</TableRowColumn>
                <TableRowColumn colSpan="1">{row.status}</TableRowColumn>
                <TableRowColumn colSpan="1"><a target="_blank" href="https://vqlabs.freshdesk.com/support/tickets/new">Upgrade / Downgrade</a></TableRowColumn>
              </TableRow>
            ))}
           

            <TableRow>
              <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                  Notifications (under construction)
              </TableHeaderColumn>
            </TableRow>

            <TableRow>
              <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                  Pricing scenarios (under construction)
              </TableHeaderColumn>
            </TableRow>

            <TableRow>
              <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                  Booking scenarios (under construction)
              </TableHeaderColumn>
            </TableRow>

            <TableRow>
              <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                  Browse page (under construction)
              </TableHeaderColumn>
            </TableRow>

            <TableRow>
              <TableHeaderColumn colSpan="4" style={{textAlign: 'center'}}>
                  Artificial Intelligence modules (under construction)
              </TableHeaderColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}
