import React from 'react';
import CodeEditor from './Components/CodeEditor';

export default class SectionLandingPage extends React.Component {
    render() {
        return (
            <div className="row">
                <p className="text-muted">This section may be in the future intended for "SCALE" subscriptions. Once the beta phase is over, it may make it available only for customers with the relevant subscription.</p>
                
                <p className="text-muted">This HTML is injected inside the client page and can be used to insert custom defined HTML. Please note that future changes to VQ-MARKETPLACE may render your HTML incompatible.</p>

                <div className="row">
                    <h1>Custom HTML for Clients / Buyers (beta)</h1>
                    <hr />

                    <CodeEditor postKey={"LANDING_PAGE"} />
                </div>
                <hr />
                <div className="row" style={{ marginTop: 30 }}>
                    <h1>Custom HTML for Providers / Sellers (beta)</h1>
                    

                    <CodeEditor postKey={"LANDING_PAGE_PROVIDERS"} />
                </div>
            </div>
        );
    }
}
