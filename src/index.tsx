import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SnackbarProvider } from 'notistack';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

ReactDOM.render(
    <SnackbarProvider maxSnack={3}>
        <Router history={history}>
        <App />
      </Router>
    </SnackbarProvider>,
    document.getElementById('root')
);