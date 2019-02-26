import React, { Component } from 'react'
import logic from '../../logic'
import NavBar from '../NavBar/NavBar'
import FileBase64 from "react-file-base64"
import Footer from '../Footer/Footer'


class CreateJob extends Component {
    state = { pictures: [], title: '', budget: '', description: '', location: '', tags: [], contact: '', loading: false, photo: '',error:'' }



    getFiles = files => {
        this.setState({
            loading: false
        })
        this.uploadUserPhoto(files.base64)
    }


    uploadUserPhoto(photo) {
        logic.uploadUserPhoto(photo)
            .then(photo => {
                this.setState({
                    photo,
                    loading: true
                })
            })
            .catch(err => this.setState({ error: err.message }))

    }

    handleBudgetChange = event => {
        const budget = event.target.value

        this.setState({ budget })
    }
    handleTitleChange = event => {
        const title = event.target.value

        this.setState({ title })
    }

    handleDescriptionChange = event => {
        const description = event.target.value

        this.setState({ description })
    }

    handleLocationChange = event => {
        const location = event.target.value

        this.setState({ location })
    }

    // handleTagChange = event => {
    //     const tagsNonArray = event.target.value

    //     const tags = tagsNonArray.split(' ')

    //     this.setState({ tags })
    // }

    handleContactChange = event => {
        const contact = event.target.value

        this.setState({ contact })
    }

    handleCreateJob = event => {
        event.preventDefault()

        const budget = this.state.budget

        const contact = this.state.contact

        const location = this.state.location

        const tags = this.state.tags

        const description = this.state.description

        const title = this.state.title

        //Add here modal to add pic
        const photo = this.state.photo
        debugger
        this.props.CreateJob({ title, budget, contact, location, tags, description, photo })




    }



    handlePictureUpload = (event) => {
        event.preventDefault()
        const image = event.target.value

        logic.insertPhotoToJob(image)



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
        debugger

        event.preventDefault()

        this.props.onCreateJobClick()
    }




    render() {

        return <div >
            <NavBar onHomeClick={this.handleOnHomeClick} onLogout={this.handleLogoutClick} onCreateJobClick={this.handleCreateJobClick} onProfileClick={this.handleProfileClick} />
            <div className='has-background-primary'>
                <div className='columns is-centered'>

                    <form className="box is-8-desktop" onSubmit={this.handleCreateJob}>
                        <div className="field has-text-centered">
                            <p className='has-text-centered has-text-dark has-text-weight-bold'>Create a new job</p>
                        </div>
                        <div className="field">
                            <label className="label">Title</label>
                            <div className="control has-icons-left">
                                <input className="input" type="text" placeholder="e.g. manuelbarzi" onChange={this.handleTitleChange} required />
                                <span className="icon is-small is-left">
                                    <i class="far fa-file"></i>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Contact</label>
                            <div className="control has-icons-left">
                                <input className="input" type="text" placeholder="e.g. manuelbarzi" onChange={this.handleContactChange} required />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>
                        </div>



                        <div className="field">
                            <label className="label">Budget</label>
                            <div className="control has-icons-left">                                
                                <input className="input" type="text" placeholder="50€" onChange={this.handleBudgetChange} required />
                                
                                <span className="icon is-small is-left">
                                    <i class="fas fa-money-bill-alt"></i>
                                </span>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Location</label>
                            <div class="control">
                                <div class="select">
                                    <select onChange={this.handleLocationChange}>
                                        <option value="none">Choose a city</option>
                                        <option value='madrid'>Madrid</option>
                                        <option value='barcelona'>Barcelona</option>
                                        <option value='sevilla'>Sevilla</option>
                                        <option value='bilbao'>Bilbao</option>
                                        <option value='valencia'>Valencia</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Description</label>
                            <div class="control has-icons-left">
                                <textarea class="textarea" placeholder='Write down the specifics' onChange={this.handleDescriptionChange} ></textarea>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Picture</label>
                            <FileBase64 className="input" multiple={false} onDone={this.getFiles} />

                        </div>
                        <div class="field has-text-centered">
                            <p>Picture Preview</p>
                            <figure className="image is-4by3">
                                <img src={this.state.photo} />
                            </figure>
                        </div>
                        <div className="field">
                            <button className="button is-success">
                                Create Job
               </button>

                        </div>

                        <button onClick={this.handleOnHomeClick} className="button is-dark is-small">
                            Back
            </button>
                    </form>
                </div>
                <Footer />
            </div>
        </div>
    }

    // render() {

    //     return <div>
    //         <NavBar onLogout={this.handleLogoutClick} onCreateJobClick={this.handleCreateJobClick} onProfileClick={this.handleProfileClick} /> 
    //         <div className='image__container'>
    //             <img src={this.state.photo} />
    //         </div>
    //         <Form onSubmit={this.handleCreateJob}>
    //             <h2>Create Job</h2>

    //             <FormGroup>
    //                 <Label for="exampleEmail">Title</Label>
    //                 <Input onChange={this.handleTitleChange} type="text" name="text" id="exampleEmail" placeholder="with a placeholder" />
    //             </FormGroup>
    //             <FormGroup>
    //                 <Label for="exampleEmail">Budget</Label>
    //                 <Input onChange={this.handleBudgetChange} type="text" name="text" id="exampleEmail" placeholder="with a placeholder" />
    //             </FormGroup>
    //             <FormGroup>
    //                 <Label for="exampleText">Description</Label>
    //                 <Input onChange={this.handleDescriptionChange} type="textarea" name="text" id="exampleText" />
    //             </FormGroup>
    //             <FormGroup>
    //                 <Label for="exampleSelect">Select</Label>
    //                 <Input onChange={this.handleLocationChange} type="select" name="select" id="exampleSelect">
    //                     <option value="none">Choose a city</option>
    //                     <option value='madrid'>Madrid</option>
    //                     <option value='barcelona'>Barcelona</option>
    //                     <option value='sevilla'>Sevilla</option>
    //                     <option value='bilbao'>Bilbao</option>
    //                     <option value='valencia'>Valencia</option>
    //                 </Input>
    //             </FormGroup>
    //             <FormGroup>
    //                 <Label for="exampleText">Contact</Label>
    //                 <Input onChange={this.handleContactChange} type="text" name="text" id="exampleText" />
    //             </FormGroup>
    //             <Label for="exampleFile">File</Label>
    //             <FormGroup>
    //                 <FileBase64 className="input" multiple={false} onDone={this.getFiles} />
    //                 <FormText color="muted">
    //                     Please upload a picture if possible, it will be much easier for potencial canditates to judge and view your job
    //                </FormText>
    //                 <div className='image__container'>
    //                     <img src={this.state.photo} />
    //                 </div>
    //             </FormGroup>

    //             <Button>Submit</Button>
    //         </Form>
    //             <Button onClick={this.props.onGoBackClick}>Back</Button>
    //         <Footer />
    //     </div>
    // }



}

export default CreateJob
