import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default
<Paper zDepth={1} style={ { padding: '10px' } }>
    <div className="row">
        <div className="col-xs-12" style={ { marginBottom: '20px'} }>
            <h4>Womit brauchen Sie Hilfe?</h4>
            <p>
                Kostenlos inserieren und Bewerbungen von qualifizierten Taskers erhalten.
            </p>
        </div>
    </div>
    <div className="row">
        <div className="col-xs-12" style={ { marginBottom: '20px'} }>
            <a href="https://studentask.de/aufgabe-vergeben?task_type=0" target="_self">
            <RaisedButton label="Neues Inserat"  />
            </a>
        </div>  
    </div>  
</Paper>;