import React from 'react';
import ReactDOM from 'react-dom';
import { StateXProvider } from '@cloudio/statex';
import './index.css';
import App from './App';
import Demo from './Demo';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <StateXProvider>
      <Demo />
    </StateXProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
