import React from 'react';
import * as apiConfig from '../api/config';
import EditableEntity from '../Components/EditableEntity';

export default class SectionBasics extends React.Component {
    constructor() {
        super();
        this.state = { 
            meta: {} 
        };
    }

    componentDidMount() {
        apiConfig.meta.getItems().then(meta => this.setState({ meta: meta[0] }));
    }

    render() {
        return (
            <div className="row">
                    <div className="col-xs-12">
                        <h1>Marktplace basics</h1>
                        { this.state.meta &&
                            <EditableEntity
                                showCancelBtn={false}
                                value={this.state.meta} 
                                fields={[
                                    {
                                        key: 'name',
                                        label: 'Marketplace name'
                                    },
                                    {
                                        key: 'slogan',
                                        label: 'Marketplace slogan (for buyers)'
                                    },
                                    {
                                        key: 'sloganSellers',
                                        label: 'Marketplace slogan (for sellers)',
                                        hint: "This is shown on the seller's homepage of the marketplace."
                                    },
                                    {
                                        key: 'desc',
                                        label: 'Marketplace description (for buyers)'
                                    },
                                    {
                                        key: 'descSellers',
                                        label: 'Marketplace description (for sellers)'
                                    },
                                    {
                                        key: 'logoUrl',
                                        label: 'Marketplace logo'
                                    },
                                    {
                                        key: 'promoUrl',
                                        label: 'Marketplace promo'
                                    },
                                    {
                                        key: 'teaserBoxColor',
                                        label: 'The color of the teaser box where your slogan and description is displayed'
                                    },
                                    {
                                        key: 'sellerLabel',
                                        label: 'How do you label your sellers?',
                                        hint: 'Examples: "Freelancer", "Publisher", "Seller"'
                                    },
                                    {
                                        key: 'listingLabel',
                                        label: "Listing label",
                                        hint: 'Examples: "App", "Offer", "Product", "Contingent", "Rental", "Bike"'
                                    },
                                    {
                                        key: 'filterLocation',
                                        label: "Location based listings?",
                                        hint: 'true or false'
                                    }
                                ]}
                                onConfirm={
                                    updatedEntity => {
                                        apiConfig.meta.updateItem(this.state.meta._id, updatedEntity);

                                        this.setState({ meta: updatedEntity })
                                    }
                                }
                            />
                        }
                </div>    
            </div>);
        }
}
