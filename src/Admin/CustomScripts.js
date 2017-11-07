import React from 'react';
import CodeEditor from './Components/CodeEditor';

export default class SectionCustomScripts extends React.Component {
    render() {
        return (
            <div className="row">
                <h1>Custom scripts</h1>
                <p className="text-muted">This script is injected inside the head tag of every page and can be used to insert custom CSS, JavaScript or HTML. Please note that future changes to VQ-MARKETPLACE may render your script incompatible. Read more here: <a target="_blank" href="https://vqlabs.freshdesk.com/solution/articles/33000212407-using-custom-html-javascript-and-css-on-your-landing-page">Using Custom HTML, JavaScript and CSS on Your Landing Page</a></p>
                <hr />

                <CodeEditor postKey={"CUSTOM_SCRIPTS"} />
            </div>
        );
    }
}
