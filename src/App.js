import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";

import Routes from './Routes'
import './App.css';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Route path="/" component={Routes} />
      </HashRouter>
    );
  }
}

export default App;
