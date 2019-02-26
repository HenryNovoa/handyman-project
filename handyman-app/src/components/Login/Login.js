import React, { Component } from 'react'
import LoginForm from './LoginForm'
import Error from '../Error/Error'

class Login extends Component {
  
  render() {

    return <section className="hero is-info is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
              <p className='has-text-dark has-text-weight-bold'>Login</p>
            <Error message={this.props.error}/>
             
            <LoginForm  error={this.props.error} onLogin={this.props.onLoginClick} onGoBack={this.props.onGoBackClick}/>
          
               
            
            </div>
          </div>
        </div>
      </div>
    </section>

  }
}

export default Login