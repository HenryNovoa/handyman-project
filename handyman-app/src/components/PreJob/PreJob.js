import React, { Component } from 'react'
    

    function PreJob(props) {
      
      const photo = props.photo
      const defaultImage="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" 

      

  
      return  <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={photo} alt="Placeholder image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          {/* <div className="media-left">
             <figure className="image is-48x48">
              <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
            </figure> 
          </div> */}
          <div className="media-content">
            <p className="title is-4">{props.title}</p>
            <p className="subtitle is-6">{props.budget}</p>
            <p className="subtitle is-6">{props.location}</p>
          </div>
        </div>
          <button className='button is-info' onClick={()=>props.onViewJobClick(props.userId,props.id)}>View Job</button>
        </div>
      
    </div>
  
  
  
  
    }     

    
    




//ReactStrap component
    {/* function PreJob(props) {
      
        const photo = props.photo
        const defaultImage="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" 

        

        




        return<div className='prejob'>
        <Card body outline color="secondary">
          <CardImg top width="100%" src={photo? photo : defaultImage} alt="Card image cap" />
          <CardBody>
            <CardTitle>{props.title}</CardTitle>
            <CardSubtitle className='prejob__subtitle__text'>Budget:{props.budget}</CardSubtitle>
            <br/>
            <CardSubtitle>Location:{props.location}</CardSubtitle>
            <Button onClick={()=>props.onViewJobClick(props.userId,props.id)}>View Job</Button>
          </CardBody>
        </Card>
      </div>
    }      */}
  
  



export default PreJob