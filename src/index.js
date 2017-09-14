import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import injectTapEventPlugin from 'react-tap-event-plugin';

import 'react-input-range/lib/css/index.css';
import './App.css';

injectTapEventPlugin();

ReactDOM.render(
  <App />
  ,
  document.getElementById('root')
);
