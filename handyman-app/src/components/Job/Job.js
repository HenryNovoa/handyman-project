import React, { Component } from 'react'
import logic from '../../logic'
import { throws } from 'assert';
import Error from '../Error/Error'
import CollaboratorModal from '../CollaboratorModal/CollaboratorModal'
import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'




class Job extends Component {
    state = { job: '', error: null, requestedBy: [], myJob: false, toAssign: '', assignedTo: '', requested: false, modal: false, done: false, assigned: false }


    componentDidMount() {
        this.handleMount()
    }

    handleMount = () => {

        const statusDone = 'DONE'
        if (logic._userId === this.props.userId) this.setState({ myJob: true })

        logic.getJob(this.props.userId, this.props.jobId)
            .then(job => this.setState({ job }))
            .then(() => {
                if (this.state.job.status === statusDone) this.setState({ done: true })
                if (this.state.job.assignedTo === logic._userId) this.setState({ assigned: true })
                if (this.state.job.requestedBy) {
                    this.state.job.requestedBy.forEach((requestId) => {
                        if (requestId === logic._userId) this.setState({ requested: true })

                        logic.retrieveUser(requestId)
                            .then(user => this.setState({ requestedBy: [...this.state.requestedBy, user] }))
                    })
                }
            }).then(() => {
                if (this.state.job.assignedTo) {
                    logic.retrieveUser(this.state.job.assignedTo)
                        .then(user => this.setState({ assignedTo: user }))
                }
            })


    }


    handleBackClick = () => this.props.onBackClick()


    handleRequestJob = () => this.props.onRequestJob(this.props.userId, this.props.jobId)
        .then(() => this.setState({ requested: true }))




    handleRequestChange = event => {
        const toAssign = event.target.value

        this.setState({ toAssign })
    }

    handleAssignJob = () =>{ 
        try{
        this.props.onAssignJob(this.state.toAssign, this.props.jobId).then(() => this.handleMount())
        }catch(err){
            this.setState({error:'Must Assign Valid User'})
        }
    
    }
      
    handleRemoveClick = () =>
        this.props.onRemoveJob(this.props.jobId)

    handleFinishedClick = event => {

        this.setState({ modal: true })
    }
    handleOnCloseModal = () => {

        this.setState({ modal: false })
    }

    handleRateJob = (rating, text) => {

        try {
            this.props.onRateJob(rating, text, this.props.jobId)
            this.setState({ modal: false })
        } catch ({ message }) {
            this.setState({ error: message })
        }

    }

    handleProfileView = () => {

        this.props.onProfileView(this.state.toAssign)

    }

    //NavBar functions
    handleOnHomeClick = () => {

        this.props.onHomeClick()


    }

    handleLogoutClick = () => {

        this.props.onLogoutClick()

    }

    handleProfileClick = () => {

        this.props.onProfileClick()
    }

    handleCreateJobClick = event => {
        event.preventDefault()

        this.props.onCreateJobClick()
    }



    render() {


        const { job, myJob, done, requested, assigned } = this.state
        const { error } = this.state
        const jobIsDoing = 'DOING'
        const jobIsDone = 'DONE'
        const photo = job.photo
        const defaultPicture = "https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"


        return <div className='job'>
            <NavBar onHomeClick={this.handleOnHomeClick} onLogout={this.handleLogoutClick} onCreateJobClick={this.handleCreateJobClick} onProfileClick={this.handleProfileClick} />
            <div className='has-background-primary'>
            <div className="columns has-background-primary is-multiline is-centered has-text-centered">
                <div className="column is-6 has-shadow card">
                    <header className="card-header">
                        <p className="card-header-title box title is-2">
                            {job.title}
                        </p>
                            {(myJob && job.status !== jobIsDone) ? <button className='button is-danger is-small' onClick={this.handleRemoveClick}>Delete Job</button> : null}
                        {/* <a href="#" className="card-header-icon" aria-label="more options">
                            <span className="icon">
                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </a> */}
                    </header>

                    <div className="card-image">
                        <figure className="image is-4by3">
                            <img src={photo ? photo : defaultPicture} />
                        </figure>
                        {error && <Error message={error} />}
                    </div>
                    <div className="card-content">
                        <div className="media">
                            {/* <div className="media-left">
             <figure className="image is-48x48">
              <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
            </figure> 
          </div> */}
                            <div className="media-content">
                                
                                <div className='box'>
                                <p className="title is-4">Budget:{job.budget}</p>
                                <p className="subtitle is-6">Location:{job.location}</p>
                                <p className="subtitle is-6">Status:{job.status}</p>
                                 {myJob ? <p className='subtitle is-6'>Assigned to: {job && this.state.assignedTo.username}</p> : null}
                                 </div>
                                 <label className='label'>Description</label>
                                <p className="box is-2">{job.description}</p>
                                
                               
                            </div>
                            <button className='button is-dark' onClick={this.handleBackClick}>Home</button>
                          
                        </div>
                       
                        {myJob ? <select defaultValue="none" onChange={this.handleRequestChange}>
                           
                            <option disabled={true} value="none">Users who requested job</option>

                            {this.state.requestedBy.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
                        </select> : (!done && !requested) ? <button className='button is-warning' onClick={this.handleRequestJob}>Request Job</button> : (!assigned) ? <p>You have requested to do this job</p> : <p>You have been assigned this job</p>}
                        {(done && assigned) ? <p>You have completed this job</p> : null}
                        
                    </div>
                    <footer className="card-footer">
                     {(myJob && job.status === jobIsDoing) ? <button className='button card-footer-item is-warning' onClick={this.handleFinishedClick}>Mark as finished</button> : null}
                     
                     {(myJob && !done) ? <button className='button has-text-centered card-footer-item is-success' onClick={this.handleAssignJob}>Assign Job</button> : null}  
                     {(myJob) ? <button className='card-footer-item button is-info' onClick={this.handleProfileView}>View Profile</button> :null} 

                        {/* <a href="#" class="card-footer-item">Delete</a> */}
                    </footer>
                </div>
            </div>
          <Footer />
          </div>

          <CollaboratorModal modal={this.state.modal} onCloseModal={this.handleOnCloseModal} onRateJob={this.handleRateJob} />
        </div>
    }
}

export default Job