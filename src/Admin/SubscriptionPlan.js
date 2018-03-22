import React, {Component} from 'react';

import * as apiAdmin from '../api/admin';

export default class TableExampleComplex extends Component {
  constructor() {
    super()

    this.state = {
      plans: []
    };
  }

  componentDidMount() {
      apiAdmin
        .tenant
        .getSubPlans()
        .then(data => {
          console.log(data);
    
          this.setState({
            plans: data
          })
        })
        .catch(err => {
          console.log(err);
        });

      apiAdmin
        .tenant
        .getTenant()
        .then(data => {
          this.setState({
            tenant: data.tenant
          })
        })
        .catch(err => {
          console.log(err);
        });
  }

  render() {
    return (
      <div>
            <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Plan</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Period unit</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            { this.state.plans
                            .map(plan => 
                                <tr key={plan.id}>
                                    <td>
                                        {plan.name}
                                    </td>
                                    <td>
                                        {plan.price / 100}
                                    </td>
                                    <td>
                                        {plan.period_unit}
                                    </td>
                                    <td>
                                       <button onTouchTap={() => {
                                         apiAdmin
                                         .tenant
                                         .initSubCheckout(plan.id)
                                         .then(data => {
                                           location.href = data.url;
                                         })
                                       }}>Subscribe</button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
      </div>
    );
  }
}
