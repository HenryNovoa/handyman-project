import React from 'react'


function Error(props) {
    return<div className=''> <p className="has-text-danger ">{props.message===''? null : props.message}</p></div>
}

export default Error