import {useEffect,useState} from 'react' ;
import './App.css' ;
import Chat from './pages/Chat';
import {getTokenn , onMessageListener} from './utilities/firebase';
import axios from 'axios' ;

const finalUrl = process.env.REACT_APP_NODE_ENV == 'development' ? process.env.REACT_APP_SERVER_DEV : process.env.REACT_APP_SERVER_PROD;


function App() {

  useEffect(()=>{

    const getTok = getTokenn(() => { });
    
    Promise.all([getTok]).then((res) => {
      
      const token = res[0];
      let topicString = `chatadmin_topicstring`;
      
        axios.post(`${finalUrl}/api/subscribeToTopicsForWeb`,
        { topic_array: topicString, token })
          .then((resp) => {
            onMessageListener();
          })
          .catch((err) => console.log(err));
    // });
    })
  },[]) ;

  return (
    <div className='app-container'>
      <Chat/>  
  </div> 
  );
} 

export default App ;
