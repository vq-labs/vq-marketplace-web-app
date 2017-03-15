import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default
<Paper zDepth={1} style={ { marginTop: '10px', marginBottom: '10px', padding: '10px' } }>
    <div className="row">
        <div className="col-xs-12" style={ { marginBottom: '20px'} }>
            <h4>Wollen Sie Ihr eigenes Angebot anderen anbieten? </h4>
            <p>
                Kostenlos inserieren und schnell Kunden finden.
            </p>
        </div>
    </div>
    <div className="row">
        <div className="col-xs-12" style={ { marginBottom: '20px'} }>
            <a href="https://studentask.de/aufgabe-vergeben?task_type=1" target="_self">
            <RaisedButton label="Angebot hinzufügen"  />
            </a>
        </div>  
    </div>  
</Paper>;