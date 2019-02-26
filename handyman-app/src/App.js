import React, { Component } from 'react'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import Error from './components/Error/Error'
import Landing from './components/Landing/Landing'
import logic from './logic'
import { Route, withRouter, Redirect } from 'react-router-dom'
import Job from './components/Job/Job'
import NavBar from './components/NavBar/NavBar'
import CreateJob from './components/CreateJob/CreateJob'
import OtherProfile from './components/OtherProfile/OtherProfile'
import Profile from './components/Profile/Profile'


logic.url=process.env.REACT_APP_API_URL
//logic.url = 'http://localhost:5000/api'

class App extends Component {
    state = { job: null, error: null, jobView: null, userId: 'hello',otherProfile:null,otherJobs:null }

    handleRegisterClick = () =>{
        this.setState({error:null})
        this.props.history.push('/register')
    } 
        

    handleLoginClick = () =>{
        this.setState({error:null})
        this.props.history.push('/login')
    }
        

    handleRegister = (name, surname, username, password) => {
        try {
            logic.registerUser(name, surname, username, password)
                .then(() => {
                    this.setState({ error: null }, () => this.props.history.push('/login'))
                })
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogin = (username, password) => {
        try {
            logic.login(username, password)
                .then(() => this.props.history.push('/home'))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogoutClick = () => {
        logic.logout()

        this.props.history.push('/')
    }

    handleGoBack = () => this.props.history.push('/')

    handleCreateJobClick = () => this.props.history.push('/create')

    handleOnCreateJob = (details) => {
        try {
            logic.createJob(details)
                .then(()=>this.props.history.push('/home'))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }


    }

    handleOnHomeClick = () => {
        this.props.history.push('/home')
        this.setState({ error: null })
    }

    handleOnViewJobClick = (userId, jobId) => {
        try {
            this.props.history.push(`/users/${userId}/job/${jobId}/view`)

        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleOnRequestJob = (userId, jobId) => {

        try {
           
            return logic.requestJob(userId, jobId)



        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleOnAssignJob = (toAssignId, jobId) => {
    
        const newStatus = 'DOING'
        try {
           return logic.assignJob(toAssignId, jobId).then(() => logic.modifyJob({ jobId, newStatus }))

        } catch ({ message }) {
            this.setState({ error: message })
        }

    }
    handleRemoveJob = (jobId) => {

        try {
            logic.removeJob(jobId)
                .then(()=>this.props.history.push('/home'))
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleRateJob = (rating, text, jobId) => {

        const newStatus = 'DONE'
        try {
            logic.rateJob(rating, text, jobId)
                .then(() => logic.modifyJob({ jobId, newStatus }))
                .then(this.props.history.push('/home'))

        } catch ({ message }) {
            this.setState({ error: message })
        }


    }

    handleOnProfileView = (userId) => {
       
        try {
            logic.retrieveUser(userId)
                .then(user =>{
                     logic.retrieveJobsFromUser(user.id)
                        .then((jobs)=>{
                            this.setState({otherProfile:user})
                            
                            this.setState({otherJobs:jobs})
                            
                            this.props.history.push(`/users/${userId}`)
                            
                        })
                    })
        } catch ({ message }) {
            this.setState({ error: message })
        }

    }

    handleProfileClick = () =>{

        this.props.history.push('/profile')

    }

    render() {
        const { error } = this.state

        return <div>
            <Route exact path='/' render={() => !logic.loggedIn ? <Landing onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} /> : <Redirect to='/home' />} />

            <Route path='/register' render={() => !logic.loggedIn ? <Register error={this.state.error} onRegister={this.handleRegister} onGoBack={this.handleGoBack} /> : <Redirect to='/home' />} />

            <Route path='/login' render={() => !logic.loggedIn ? <Login error={this.state.error} onLoginClick={this.handleLogin} onGoBackClick={this.handleGoBack} /> : <Redirect to='/home' />} />

            <Route path='/create' render={() => logic.loggedIn ? <CreateJob onCreateJobClick={this.handleCreateJobClick}  onLogoutClick={this.handleLogoutClick} onProfileClick={this.handleProfileClick} onGoBackClick={this.handleOnHomeClick} onHomeClick={this.handleOnHomeClick} CreateJob={this.handleOnCreateJob} /> : <Redirect to='/home' />} />

            <Route path='/home' render={() => logic.loggedIn ? <Home onHomeClick={this.handleOnHomeClick} onLogoutClick={this.handleLogoutClick} onProfileClick={this.handleProfileClick} onViewJobClick={this.handleOnViewJobClick} onCreateJobClick={this.handleCreateJobClick} /> : <Redirect to='/' />} />

            <Route path='/users/:userId/job/:jobId/view' render={(props) => logic.loggedIn ? <Job onHomeClick={this.handleOnHomeClick} onCreateJobClick={this.handleCreateJobClick}  onLogoutClick={this.handleLogoutClick} onProfileClick={this.handleProfileClick} key={props.match.params.jobId} onBackClick={this.handleOnHomeClick} jobId={props.match.params.jobId} userId={props.match.params.userId} onInitialize={this.state.jobView} onRequestJob={this.handleOnRequestJob} onAssignJob={this.handleOnAssignJob} onRemoveJob={this.handleRemoveJob} onRateJob={this.handleRateJob} onProfileView={this.handleOnProfileView} /> : <Redirect to='home' />} />

            <Route path='/profile' render={() => logic.loggedIn ? <Profile key={logic.sessionId} onViewJobClick={this.handleOnViewJobClick} onHomeClick={this.handleOnHomeClick} onCreateJobClick={this.handleCreateJobClick}  onLogoutClick={this.handleLogoutClick} onProfileClick={this.handleProfileClick}  /> : <Redirect to='home' />} />

            <Route exact path='/users/:userId' render={(props) => logic.loggedIn ? <OtherProfile onCreateJobClick={this.handleCreateJobClick}  onLogoutClick={this.handleLogoutClick} onProfileClick={this.handleProfileClick} onInitializeUser={this.state.otherProfile} onInitializeJobs={this.state.otherJobs} key={props.match.params.userId} userId={props.match.params.userId} onLogoutClick={this.handleLogoutClick} onViewJobClick={this.handleOnViewJobClick} onCreateJobClick={this.handleCreateJobClick} /> : <Redirect to='/' />} />

            {/* {error && <Error message={error} />} */}


        </div>
    }
}

export default withRouter(App)
