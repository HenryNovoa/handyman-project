import React, { Component } from 'react'
import Logo from './images/handyman.png'
import Error from '../Error/Error'

class Register extends Component {
    state = { name: '', surname: '', username: '', password: '', error: '' }



   componentWillReceiveProps(){
    this.setState({error:this.props.error})
   }

   


    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

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

        const { name, surname, username, password } = this.state

        this.props.onRegister(name, surname, username, password)
    }

    render() {
        return <section className="hero is-info is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                            <p className='has-text-dark has-text-weight-bold'>Register</p>
                            <form className="box" onSubmit={this.handleSubmit}>
                                <Error message={this.props.error} />
                                <div className="field has-text-centered">
                                    <img src={Logo} width="167" />
                                </div>
                                <div className="field">
                                    <label className="label">Name</label>
                                    <div className="control has-icons-left">
                                        <input className="input" type="text" placeholder="e.g. manuel" onChange={this.handleNameChange} required />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-user"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Surname</label>
                                    <div className="control has-icons-left">
                                        <input className="input" type="text" placeholder="e.g. barzi" onChange={this.handleSurnameChange} required />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-user"></i>
                                        </span>
                                    </div>
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
                                        <input className="input" type="password" placeholder="********" onChange={this.handlePasswordChange} required />
                                        <span className="icon is-small is-left">
                                            <i className="fa fa-lock"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <button className="button is-success">
                                        Register
           </button>

                                </div>
                                <div className="field">
                                    <button onClick={this.props.onGoBack} className="button is-dark is-small">
                                        Back
           </button>

                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    }
}

export default Register