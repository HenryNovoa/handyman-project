import React from 'react'

function Rating(props) {
    return <div className='box'>

        <h5>Rating</h5>
        <p className='rating__number'>{props.ratingNumber}</p>

        <p className="rating__text">{props.ratingText}</p>
        </div>
}

export default Rating