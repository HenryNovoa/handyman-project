import React, { Component } from 'react'
import Logo from './images/handyman.png'
import Error from '../Error/Error'
class LoginForm extends Component {
    state = { username: '', password: '',error:'' }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { username, password } = this.state

        this.props.onLogin(username, password)
    }

    handleOnGoBack = event => {
        event.preventDefault()

        this.props.onGoBack()
    }


    render() {

        return <form className="box" onSubmit={this.handleSubmit}>
        <Error message={this.props.error}/>
            <div className="field has-text-centered">
                <img src={Logo} width="167" />
            </div>
            <div className="field">
                <label className="label">Username</label>
                <div className="control has-icons-left">
                    <input className="input" type="text" placeholder="e.g. manuelbarzi" onChange={this.handleUsernameChange} required />
                    <span className="icon is-small is-left">
                        <i className="fas fa-user"></i>
                    </span>
                </div>
            </div>
            <div className="field">
                <label className="label">Password</label>
                <div className="control has-icons-left">
                    <input className="input" type="password" placeholder="********" onChange={this.handlePasswordChange} required/>
                    <span className="icon is-small is-left">
                        <i className="fa fa-lock"></i>
                    </span>
                </div>
            </div>
            {/* <div className="field">
                <label className="checkbox">
                    <input type="checkbox" required />
                    Remember me
                                                             </label>
            </div> */}
            <div className="field">
                <button className="button is-success">
                    Login
               </button>

            </div>

            <button href='#' onClick={this.handleOnGoBack} className="button is-dark is-small">
                Back
            </button>    
            




        </form>


    }
} export default LoginForm