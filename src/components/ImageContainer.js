import React from 'react'
import './ImageContainerStyles.css' ;

const ImageContainer = () => {
  return (
    <div className='initial_image_container'>
        <img height={"200px"} width={"200px"} src="https://www.bacancytechnology.com/main-boot-5/images/chatbot/side-img-1.gif"/>
        <h2 className='query_line'>Hey, Looks like you have queries to reply !</h2>
    </div>
  )
}

export default ImageContainer ;