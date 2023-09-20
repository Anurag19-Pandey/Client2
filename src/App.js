import {useEffect,useState} from 'react' ;
import io from 'socket.io-client' ;
import './App.css' ;
import axios from 'axios' ;

const socket = io.connect("https://chap-api-zids.onrender.com") ;

function App() {

  const [messages , setMessage] = useState([]) ;
  const [loadmessages , setLoadMessage] = useState([]) ;
  const [room , setRoom] = useState("") ;
  const [curr_message , setCurrMessage] = useState("") ;
  const [chat , setChat] = useState(false) ;

  useEffect(() =>{
    socket.on("sending_to_client2" , (data) =>{
      
      setMessage([]) ;
      
      setMessage((messages) => [...messages , data]) ;
    });
    socket.on("receiver_from_client2" , (data)=>{
      console.log(data) ;
      setLoadMessage(data) ;
    }) ;
  
  },[socket]) ;



  // getting all the chats
  const chatWindow = async(id) => {
           setRoom(id) ;
           setChat(true) ;
           const {data} = await axios.get(`https://chap-api-zids.onrender.com/userchat/${id}`) ;
           setLoadMessage(data.messages) ;
  }

  console.log(messages) ;

  const  sendMessage = async() =>{

    if(curr_message !== ""){
    
        const messageData = {
          name : 'Ingenium' ,
          room : room,
          msg : curr_message,
          time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() ,

        }

     socket.emit("receive_message" , messageData) ;
     setCurrMessage("") ;

  }
}
  console.log(messages) ;
  return (
    <div>
         <h1>Chats / Queries</h1>

    <div className='container'>
     <div className='left-section'>
     {
       messages && messages.map((message , index) =>{
          console.log(message.name) ;
          return (
            <div key={index} className='user-message-container' onClick={() => chatWindow(message._id)}>
              <img className='user-image' src="https://imagedelivery.net/5MYSbk45M80qAwecrlKzdQ/f454ce5b-8a6c-41a8-a708-65c45e56e700/public"/>
              <h2>{message.name}</h2>
            </div>
          )
         })
     }
    </div>
    <div className='right-section'>
      {
          loadmessages && loadmessages.map((ldmsg , index)=>{
            return (
              <div key={index}>
                <h1>{ldmsg.message}</h1>
              </div>
            )
          })
      }
      <input type="text" placeholder='Message here...' onChange={(event) => setCurrMessage(event.target.value)}/>
      <button onClick={() => sendMessage()}>&#9658;</button>
    </div>
    </div>
    </div>
  );
} 

export default App;
