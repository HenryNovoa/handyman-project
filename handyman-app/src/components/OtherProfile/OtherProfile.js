import React, { Component } from 'react'
import PreJob from '../PreJob/PreJob'
import NavBar from '../NavBar/NavBar'
import logic from '../../logic'
import Rating from '../Rating/Rating'
import Footer from '../Footer/Footer'



class OtherProfile extends Component {
    state ={mySession: false ,userId:this.props.userId , jobsPosted:[],jobsDone:[], user: '', postsLiked: [], grid: [],created:true, completed:false,averageRating:'' }

    componentDidMount(){
        
        const isDone = 'DONE'
        try {
            logic.retrieveUser(this.state.userId)
                .then(user =>{
                     logic.retrieveJobsFromUser(user.id)
                        .then((jobs)=>{
                            this.setState({user:user})
                        
                            this.setState({jobs:jobs})
                
                            jobs.forEach(job =>{
                                if(job.user === this.state.userId)  this.setState({ jobsPosted: [...this.state.jobsPosted, job] }) 
                                if(job.status === isDone && job.assignedTo === this.state.userId ) this.setState({jobsDone : [...this.state.jobsDone,job]})
                            })    
                           
                        })
                    })


        } catch ({ message }) {
            this.setState({ error: message })
        }
    }
    handleOnViewJobClick = (userId, jobId) => {
        
        this.props.onViewJobClick(userId, jobId)
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

    handleShowCreatedJobs=(event)=>{
        event.preventDefault()
        this._resetShowJobs()
        this.setState({created:true})
    }   

    handleShowCompletedJobs=(event)=>{
        event.preventDefault()
        this._resetShowJobs()
        this.setState({completed:true})
    }  

    _resetShowJobs=()=>{
        this.setState({created:false,completed:false})
    }




    render() {

    
        const { userId,user,created,completed } = this.state
        
        
        return <div className=''>
         <NavBar onLogout={this.handleLogoutClick} onCreateJobClick={this.handleCreateJobClick} onProfileClick={this.handleProfileClick} />
        <div className='box columns'>
    
        
        <div className='column'>
        <h2 className='title'>Username:{user.username}</h2>
        </div>
        </div>
         <div class="tabs is-toggle is-fullwidth">
        <ul className='container'>
          <li className="" onClick={this.handleShowCreatedJobs}>
            <a>
              <span class="icon is-small"><i class="fas fa-image" aria-hidden="true"></i></span>
              <span>Created jobs</span>
            </a>
          </li>
          <li className='' onClick={this.handleShowCompletedJobs}>
            <a>
              <span class="icon is-small"><i class="fas fa-check" aria-hidden="true"></i></span>
              <span>Jobs completed</span>
            </a>
          </li>
       
        </ul>
      </div>

       <div className="has-background-primary has-gutter-top-bottom ">
              
                {/* Iterates through data (jobs) */}
                <h1 className="title has-background-info has-text-centered is-2">Jobs</h1>
                <div className="columns is-multiline">
                
                    {this.state.jobs && created && this.state.jobsPosted.map(job => {
                         return   <div className="column is-4 has-shadow">
                            <PreJob onViewJobClick={this.handleOnViewJobClick} photo={job.photo} key={job.id} id={job.id} userId={job.user} location={job.location} title={job.title} budget={job.budget} />
                        </div>})
                    }

                </div>

                <div className="columns is-multiline">
                
                {this.state.jobs && completed && this.state.jobsDone.map(job => {
                     return   <div className="column is-4 has-shadow">
                        <PreJob onViewJobClick={this.handleOnViewJobClick} photo={job.photo} key={job.id} id={job.id} userId={job.user} location={job.location} title={job.title} budget={job.budget} />
                    <Rating ratingNumber={job.rating} ratingText={job.ratingText} />
                    </div>})
                }

            </div>
           <Footer />
               
            </div>
        
         </div>
    }
}



export default OtherProfile