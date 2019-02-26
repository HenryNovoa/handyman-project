import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Error from './components/Error/Error'
import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../node_modules/bulma/css/bulma.css';


ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
