import React from 'react'
import './ImageContainerStyles.css' ;
import TenPointLogo from "../assets/10pointlogo.png" ;

const ImageContainer = () => {

  
  return (
    <div className='initial_image_container' >
        <div >
        <img height={"200px"} width={"200px"} src="https://www.bacancytechnology.com/main-boot-5/images/chatbot/side-img-1.gif"/>
        </div>
        <div style={{ height : '200px', display : 'flex' , alignItems : 'center' , justifyContent : 'center' , flexDirection :'column'}}>
        <h2 className='query_line'>Hey, Looks like you have queries to reply !</h2>
        <button className='getAppBtn'><img src={TenPointLogo} style={{ width : '25px' , height : '25px'}}/>&nbsp;Get The App !</button>
        </div>
    </div>
  )
}

export default ImageContainer ;