import React from 'react';
import './CustomModalStyles.css';

const CustomModal = (props) => {
  const { show, handleClose, imageUrl, videoUrl } = props;

  return (
    <div className={`customModal ${show ? 'show' : ''}`} onClick={() => handleClose()}>
      <div className='customModalContent' onClick={(event) => event.stopPropagation()}>
        <div className='customModalBody'>
          {imageUrl.length > 0 ? (
            <img src={imageUrl} style={{ width: '300px', height: 'auto' }} />
          ) : null}
          {videoUrl.length > 0 ? (
            <video className='modalBodyMediaVideo' controls>
              <source src={videoUrl}></source>
            </video>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
