import React from 'react';
import './CustomModalStyles.css';

const CustomModal = (props) => {
  const { show, handleClose, imageUrl, videoUrl, title , btnText , bodyContent, displayBody , displayFooter , displayHeader, backgroundClr , sendMessage} = props;

  console.log(imageUrl) ;

  const sendMsg = ()=>{
    console.log("called") ;
    console.log( "ImageUrl : " + imageUrl) ;
    console.log( "videoUrl : " + videoUrl) ;
    if(imageUrl.length > 0)
      sendMessage(imageUrl , 'image') ;
    
    if(videoUrl.length > 0)
      sendMessage(videoUrl , 'video') ; 
  }

  return (
    <div className={`customModal ${show ? 'show' : ''}`} onClick={() => handleClose()}>
      <div className='customModalContent' onClick={(event) => event.stopPropagation()} style={{ background : backgroundClr}}>
        <div className='customModalHeader' style={{ display : displayHeader == false ? 'none' : 'block'}}>
        <p>{title}</p>
        </div>
        <div className='customModalBody' style={{ display : displayBody == false ? 'none' : 'block'}}>
          {imageUrl.length > 0 ? (
            <img src={imageUrl} style={{ width: '300px', height: 'auto' }} />
          ) : null}
          {videoUrl.length > 0 ? (
            <video className='modalBodyMediaVideo' controls>
              <source src={videoUrl}></source>
            </video>
          ) : null}
        </div>
        <div className='customModalFooter' style={{ display : displayFooter == false ? 'none' : 'block'}}>
            <button className='customModalBtn' onClick={() => sendMsg()}>{btnText}</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
