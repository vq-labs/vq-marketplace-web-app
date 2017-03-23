import EditableText from '../Components/EditableText';
import React from 'react';
import * as apiConfig from '../api/config';

export default class SectionBasics extends React.Component {
    constructor() {
        super();
        
        this.state = { meta: {} };
        this.handleAppMetaChange = this.handleAppMetaChange.bind(this);
    }

    componentDidMount() {
        apiConfig.meta.getItems().then(meta => {
            this.setState({ meta: meta[0] });
        });
    }

    handleAppMetaChange(newAppConfig) {
            apiConfig.meta.updateItem(newAppConfig._id, newAppConfig);

            this.setState({ meta: newAppConfig })
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12 col-sm-7 col-md-6">
                    <div class="row" style={ {marginBottom:10} }>
                        <label>Marketplace name</label>
                        <p className="text-muted">
                            The name of your marketplace. This is shown to users in emails and various other places.
                        </p>
                        <EditableText
                            fields={{
                                name: {type: 'string', placeholder: 'Marketplace name'}
                            }}
                            style={{'marginTop': '20px'}}
                            autoEditMode={false}
                            alwaysShowEditIcon={true}
                            values={this.state.meta}
                            displayValue={this.state.meta.name}
                            onCancel={() => {}}
                            onChange={this.handleAppMetaChange}
                        />
                    </div>
                    <div class="row">
                        <h2>For buyers</h2>
                    </div> 
                    <div class="row">
                        <label>Marketplace slogan</label>
                        <p className="text-muted">
                        This is shown on the buyer's homepage of the marketplace.
                        </p>
                        <EditableText
                            fields={ {
                                slogan: { type: 'string', placeholder: 'Marketplace slogan' },
                            } }
                            style={{  'marginTop': '20px'  }}
                            autoEditMode={ false }
                            alwaysShowEditIcon={true}
                            values={this.state.meta}
                            displayValue={this.state.meta.slogan}
                            placeholder={ 'Marketplace slogan' }
                            onChange={this.handleAppMetaChange}
                        />
                        <hr />
                    </div>
                    
                    <div class="row">
                        <label>Marketplace description</label>
                        <p className="text-muted">
                            This is shown on the buyer's homepage of the marketplace.
                        </p>
                        <EditableText
                            fields={ {
                                desc: { type: 'string', placeholder: 'Marketplace description' },
                            } }
                            style={{  'marginTop': '20px'  }}
                            autoEditMode={false}
                            alwaysShowEditIcon={true}
                            values={this.state.meta}
                            displayValue={this.state.meta.desc}
                            placeholder={ 'Marketplace description' }
                            onChange={this.handleAppMetaChange }
                        />
                    </div>
                    <div class="row" style={ {marginTop:10} }>
                        <h2>For sellers</h2>
                    </div>

                    <div class="row">
                        <label>Marketplace slogan</label>
                        <p className="text-muted">
                        This is shown on the buyer's homepage of the marketplace.
                        </p>
                        <EditableText
                            fields={ {
                                sloganSellers: { type: 'string', placeholder: 'Marketplace slogan' },
                            } }
                            style={{  'marginTop': '20px'  }}
                            autoEditMode={ false }
                            alwaysShowEditIcon={true}
                            values={this.state.meta}
                            displayValue={this.state.meta.sloganSellers}
                            placeholder={ 'Marketplace slogan' }
                            onChange={this.handleAppMetaChange }
                        />
                        <hr />
                    </div>

                    <div class="row">
                        <label>Marketplace description</label>
                        <p className="text-muted">
                            This is shown on the seller's homepage of the marketplace.
                        </p>
                        <EditableText
                            fields={ {
                                descSellers: { type: 'string', placeholder: 'Marketplace description' },
                            } }
                            style={{  'marginTop': '20px'  }}
                            autoEditMode={false}
                            alwaysShowEditIcon={true}
                            values={this.state.meta}
                            displayValue={this.state.meta.descSellers}
                            placeholder={ 'Marketplace description' }
                            onChange={this.handleAppMetaChange }
                        />
                    </div>
                </div>
            </div>);
        }
}
