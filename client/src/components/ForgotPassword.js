import React, {Component} from 'react'
import axios from 'axios'

import {Link} from 'react-router-dom'

class ForgotPassword extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
    };
    this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value})
}


  onSubmit = e => {
    e.preventDefault();

    if (this.state.email === '') {
      this.setState({
        showError: false,
        messageFromServer: '',
        showNullError: true,
      });
    }
    else{
        axios
        .post('users/forgotpassword', {
          email: this.state.email,
        })
        .then(response => {
          console.log(response.data);
          if (response.data === 'email not in db') {
            this.setState({
              showError: true,
              messageFromServer: '',
              showNullError: false,
            });
          } else if (response.data === 'recovery email sent') {
            this.setState({
              showError: false,
              messageFromServer: 'recovery email sent',
              showNullError: false,
            });
          }
        })
        .catch(error => {
          console.log(error.data);
        });
    }
  };

  render() {
    const { email, messageFromServer, showNullError, showError } = this.state;
    return (
      <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">
                                Forgot Password
                            </h1>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={this.onChange}/>
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Submit
                            </button>
                            {messageFromServer === 'recovery email sent' && (
                              <div>
                                <h3>Password Reset Email Successfully Sent Check mail!</h3>
                              </div>
                            )}
                            <Link to="/login" className="nav-link">
                                LOGIN
                            </Link>
                        </form>
                        {showNullError && (
                          <div>
                            <p>The email address cannot be null.</p>
                          </div>
                        )}
                        {showError && (
                          <div>
                            <p>
                              That email address isn't recognized. Please try again or register
                              for a new account.
                            </p>
                            <Link to="/register" className="nav-link">
                                                Register
                            </Link>
                          </div>
                        )}
        
                    </div>
                </div>
            </div>
    );
  }
}

export default ForgotPassword