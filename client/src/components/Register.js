import React, {Component} from 'react'
import {register} from './UserFunctions'

class Register extends Component {

    constructor(){
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            messageFromServer: '',
            showError: false,
            registerError: false,
            confirmed: false,
            registered: false,
            exists: false,
            loginError: false
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }


    onSubmit(e){
        e.preventDefault()

        const user = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            confirmed: false

        }
        if (
            user.first_name === '' ||
            user.password === '' ||
            user.email === '' ||
            user.last_name === ''
          ) {
            this.setState({
              showError: true,
              loginError: false,
              registerError: true,
            });
          }
          else{ 

        register(user).then(res => {
            console.log(res);
            if(res)
            {
                if(res.error === "user exists")
                {
                    this.setState({
                        exists: true
                      });
                }
                else{
                    this.setState({
                        registered: true
                      });
                }
            }
            else{
                this.props.history.push(`/login`, {msg:'Email has been sent!'})
            }
        })
    }
    }

    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">
                                Sign Up
                            </h1>
                            {this.state.showError === true && this.state.registerError === true && (
                                <div>
                                <p>All are required fields.</p>
                                </div>
                            )}
                            {this.state.exists === true && (
                                <div>
                                <p>User already exists!</p>
                                </div>
                            )}
                            {this.state.registered === true && (
                                <div>
                                <p>Check your email to confirm and continue to login!</p>
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input
                                type="text"
                                className="form-control"
                                name="first_name"
                                value={this.state.first_name}
                                onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <input
                                type="text"
                                className="form-control"
                                name="last_name"
                                value={this.state.last_name}
                                onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={this.state.email}
                                onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={this.state.password}
                                onChange={this.onChange}/>
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register