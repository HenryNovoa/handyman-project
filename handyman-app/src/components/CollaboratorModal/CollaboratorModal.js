import React, { Component } from 'react'

class CollaboratorModal extends Component {
    state = { rating: null, text:'' }

    handleRatingChange = event => {
        const rating = event.target.value

        this.setState({ rating })


    }

    handleChangeText = event =>{
        const text = event.target.value

        this.setState({text})
    }

    handleOnCloseModal = () => {

        this.props.onCloseModal()
    }

    onRateJobClick=()=>{
        
        const rating = parseFloat(this.state.rating)

        const text = this.state.text

        this.props.onRateJob(rating,text)

    }

    render() {
        const { modal } = this.props

        return <div style={modal ? { display: 'block' } : { display: 'none' }} className={modal ? 'modal fade show' : 'modal fade'} id="chooseCollaboratorModal" tabIndex={-1} role="dialog" aria-labelledby="chooseCollaboratorModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="chooseCollaboratorModalLabel">Rate the job done please</h5>
                        <button onClick={this.handleOnCloseModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <form className='columns' onSubmit={this.onRateJobClick} >
                            <div className='column'>
                            <label>Qualification</label>

                            <select onChange={this.handleRatingChange} defaultValue='none' >

                                <option disabled={true} value="none">Choose a rating</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </select>
                            </div>
                            <div className='column'>
                            <textarea placeholder='Rating Text here' defaultValue={this.state.text} onChange={this.handleChangeText} />
                            </div>
                            <button type="submit">Submit</button>
                           
                        </form>
                        {/* <select onChange={this.handleCollaboratorChange} defaultValue="none">
                            <option disabled="true" value="none">Choose a collaborator...</option>
                            {collaborators.map(({ id, name }) => <option value={id}>{name}</option>)}
                        </select> */}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default CollaboratorModal