/* src/app.js */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import MainFrame from './login/MainFrame';
import ServiceFrame from './service/ServiceFrame';
//import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className='App'>
          <Router>
            <Route exact path="/" component={MainFrame}/>
          </Router>
          <Router>
            <Route exact path="/service" component={ServiceFrame}/>
          </Router>
      </div> 
    )
  }
}

export default App;