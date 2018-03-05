import React from 'react';
import CodeEditor from './Components/CodeEditor';
import ConfigEdit from './Components/ConfigEdit';
import { sluggify } from '../core/format';

const landingPageFields = [
    {
        type: 'bool',
        key: 'LANDING_PAGE_DEMAND_SECTION_CATEGORIES_ENABLED',
        label: "Enable categories' section"
    },
    {
        type: 'bool',
        key: 'LANDING_PAGE_DEMAND_SECTION_HOW_IT_WORKS_ENABLED',
        label: "Enable 'How it Works' section"
    }
];


const landingPageGeneralSettings = [
    {
        transformOnSave: sluggify,
        showTransformMirror: true,
        transform: sluggify,
        key: 'LANDING_PAGE_HEADER_BUTTON_TEXT_FOR_SELLERS',
        type: "string",
        label: "The route (link) for the Tasker (supplier) button in the landing page",
        explanation: 'The default landing page is for the demand side but we have a supplier landing page aswell which by default is yourDomain/taskers page. You can customize this \'taskers\' keyword. Please note that all non-Latin characters will be removed and spaces will be converted to dashes.'
    },
];

export default class SectionLandingPage extends React.Component {
    render() {
        return (
            <div className="row">
                <ConfigEdit
                    header={'Landing page general settings'}
                    fields={landingPageGeneralSettings}
                />

                { //03012018, Sercan: disabled at the request of Ani; VM-152
                /* <ConfigEdit
                    header={'Landing page template sections'}
                    desc={'You can use pre-configured templates to include on the landing page.'}
                    fields={landingPageFields}
                /> */}

                <div className="row">
                    <h1>Custom HTML for Demand Side (Buyers, Clients)</h1>
                    <hr />
                    <p className="text-muted">
                        This HTML is injected inside the client page and can be used to insert custom defined HTML. Please note that future changes to VQ-MARKETPLACE may render your HTML incompatible.
                    </p>

                    <CodeEditor postKey={"LANDING_PAGE"} />
                </div>
                <hr />
                <div className="row" style={{ marginTop: 30 }}>
                    <h1>Custom HTML for Supply Side (Sellers, Providers)</h1>
                    

                    <CodeEditor postKey={"LANDING_PAGE_PROVIDERS"} />
                </div>
            </div>
        );
    }
}
