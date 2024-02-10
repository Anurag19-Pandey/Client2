import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import { FaCheckCircle } from "react-icons/fa";
import '../pages/ChatStyles.css';

const SnackBar = (props) => {

    const {status , snackBarState} = props ;

    const vertical = 'top';
    const horizontal= 'center';

    const handleClose = () => {
        snackBarState(false); 
    };

  return (
    <Snackbar
    className='snackbarCustom'
    anchorOrigin={{ vertical, horizontal }}
    open={status}
    onClose={handleClose}
    message=<p style={{ marginBottom:'0px' , display : 'flex' , justifyContent : 'center' , alignItems : 'center'}}><FaCheckCircle style={{ color: '#0dcd0d'}}/>&nbsp;Message Copied !</p>
    autoHideDuration={1200}
  />
)
}

export default SnackBar