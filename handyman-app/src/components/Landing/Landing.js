import React from 'react'

function Landing(props) {
    return <section className="hero is-info is-fullheight">
        <div className="hero-body">
            <div className="container">

                <div className="columns is-centered">

                    <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                        <p className='has-text-dark has-text-weight-bold'>HandyMan App</p>

                        <div className='columns'>
                            <section className='column'>
                                <button className='button is-large is-primary' onClick={props.onRegisterClick}>Register</button>
                            </section>
                           
                            <section className='column'>
                                <button className='button is-large is-warning' onClick={props.onLoginClick}>Login</button>

                            </section>

                        </div>


                    </div>
                </div>
            </div>
        </div>
    </section>




}

export default Landing