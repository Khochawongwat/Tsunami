import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Room from './components/Room/Room';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/room/:serverCode" component={Room} />
        <Route path="/">
            <App />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>
);