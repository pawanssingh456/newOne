import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

export default class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      update: false,
      error: false,
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updatePassword = e => {
    e.preventDefault();
    axios
      .put('users/updatePassword', {
        email: this.state.email,
        password: this.state.password,
      })
      .then(response => {
        console.log(response.data);
        if (response.data.message === 'password updated') {
          this.setState({
            updated: true,
            error: false,
          });
        } else {
          this.setState({
            updated: false,
            error: true,
          });
        }
      })
      .catch(error => {
        console.log(error.data);
      });
  };

  render() {
    const { password, error, updated } = this.state;

    if (error) {
      return (
        <div>
          <div>
            <h4>Problem resetting password. Please send another reset link.</h4>
            <Link to="/forgetpassword" className="nav-link">
                                Forget Password
            </Link>
          </div>
        </div>
      );
    } 
     else {
      return (
        <div>
          <form className="password-form" onSubmit={this.updatePassword}>
            <h1 className="h3 mb-3 font-weight-normal">
                Reset Password
            </h1>
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
            type="password"
            className="form-control"
            name="email"
            value={password}
            onChange={this.handleChange('password')}/>
            </div>
            <button type="submit" className="btn btn-lg btn-primary btn-block">
            Submit
            </button>
          </form>

          {updated && (
            <div>
              <p>
                Your password has been successfully reset, please try logging in
                again.
              </p>
              <Link to="/login" className="nav-link">
                                Login
            </Link>
            </div>
          )}
          <Link to="/" className="nav-link">
            Home
            </Link>
        </div>
      );
    }
  }
}
