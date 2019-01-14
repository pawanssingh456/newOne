import React, { Component } from 'react';
import {BrowserRouter as Router , Route} from 'react-router-dom'

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing}/>
          <div className="container">
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/forgotpassword" component={ForgotPassword}/>
          <Route exact path="/resetpassword" component={ResetPassword}/>
          <Route exact path="/profile" component={Profile}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
