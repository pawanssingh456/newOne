import React, {Component} from 'react'
import {login} from './UserFunctions'
import {Link} from 'react-router-dom'

class Login extends Component {
    constructor(){
        super()
        this.state = {
            email: '',
            password: '',
            loggedIn: false,
            showError: false,
            showNullError: false,
            showConfirmError: false
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillMount(){
        let token = window.localStorage.getItem('usertoken') || undefined;
        if(token !== undefined){
            this.props.history.push(`/profile`)
        } 
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit(e){
        e.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password

        }
        if (this.state.username === '' || this.state.password === '') {
            this.setState({
                showError: false,
                showNullError: true,
                loggedIn: false,
                showConfirmError: false
            });
          }
          else{
                login(user).then(res => {
                    if(res){
                        if(res.error === 'user does not exist')
                        {
                            this.setState({showError: true})
                        }
                        else if(res.error === 'confirm your email')
                        {
                            this.setState({showConfirmError: true})
                        }
                        else
                        this.props.history.push(`/profile` , this.setState({ loggedIn: true }));                
                    } 
                })
            }
    }

    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">
                                Sign In
                            </h1>
                            {this.state.showError && (
                                <div>
                                <p>Email or password is wrong.</p>
                                </div>
                            )}
                            {this.state.showNullError && (
                                <div>
                                <p>email or password cannot be null.</p>
                                </div>
                            )}
                            {this.state.showConfirmError && (
                                <div>
                                <p>Confirm Your Email.</p>
                                </div>
                            )}
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
                                Sign In
                            </button>
                            <Link to="/forgotpassword" className="nav-link">
                                Forgot Password
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        );      

    }
}

export default Login