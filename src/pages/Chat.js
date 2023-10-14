import React,{useEffect , useState , useRef} from 'react'
import './ChatStyles.css' ;
import io from 'socket.io-client' ;
import axios from 'axios' ;
import ImageContainer from '../components/ImageContainer';
import {IoSendSharp} from "react-icons/io5" ;
import {BsImageFill , BsFillCameraVideoFill, BsSearch} from "react-icons/bs" ;
import TenPointLogo from "../assets/10pointlogo.png" ;

const finalUrl = process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_DEV : process.env.REACT_APP_SERVER_PROD
const socket = io.connect(finalUrl) ;

const Chat = () => {

  // setting current message
  const [curr_message , setCurrMessage] = useState("") ;
  
  const containerRef = useRef(null);

  // loading the messages on click
  const [loadmessages , setLoadMessage] = useState([]) ;
  
  // setting the room with current user
  const [room , setRoom] = useState("") ;

  const [chatName , setChatName] = useState("") ;

  const [profileImage , setprofileImage] = useState("") ;
  // setting up chat
  const [chat , setChat] = useState(false) ;
  
  // setting all the active users
  const [active , setActive] = useState([]) ;

  //
  const [show, setShow] = useState(false);
  
  const [imageUrl, setImageUrl] = useState('');

  const [videoUrl, setVideoUrl] = useState('');

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      if (imageUrl.length > 0) setImageUrl('');
      if (videoUrl.length > 0) setVideoUrl('');
    }, 300);
  };

  const handleShowImage = (url) => {
    setImageUrl(url);
    setTimeout(() => {
      setShow(true);
    }, 300);
  };

  const handleShowVideo = (url) => {
    setVideoUrl(url);
    setTimeout(() => {
      setShow(true);
    }, 300);
  };

  // scroll to Bottom 
  const scrollToDown = () => {
    containerRef.current?.scrollIntoView({ behaviour: 'smooth' });
  };

  // getting all user which is having a query 
  const allQueryUser = async() =>{
      const {data} = await axios.get(`${finalUrl}/api/allquery`);
      setActive(data.result) ;
      console.log(data.result) ;
  }

  useEffect(()=>{
    allQueryUser() ;
    scrollToDown() ;
  },[]) ;

  // scroll To Bottom will automatically take to last message
  const scrollToBottom = () => {
    containerRef.current?.scrollIntoView({ behaviour: 'smooth' });
  };

  useEffect(() =>{
    scrollToBottom() ;
  },[curr_message])

  useEffect(() =>{

    socket.on("sending_to_admin",(data) =>{
      allQueryUser() ;
    }) ;

     socket.on("sending_to_clients" ,(data)=>{
      allQueryUser() ;
      if(data.sent_by == 'admin' && data.room != room) return;
        setLoadMessage(loadmessages => [...loadmessages , data]) ;
        setTimeout(() =>{
          scrollToDown() ;
        },100) ;
      });

      return (() =>{
        socket.off("sending_to_admin") ;
        socket.off("sending_to_clients");
      })
  },[]) ;

  // getting all the chats
  const chatWindow = async(id , name , profileImage) => {
           if(room != id){
            if(room != "")
              socket.emit('leave' , room) ;
            
              socket.emit("joinRoom" , id) ;
              setRoom(id) ;
              setChatName(name) ;
              setprofileImage(profileImage) ;
              setChat(true) ;
             const {data} = await axios.get(`${finalUrl}/api/userchat/${id}`) ;
             setLoadMessage(data.result) ;
           }
           else{
             const {data} = await axios.get(`${finalUrl}/api/userchat/${id}`) ;
             setLoadMessage(data.result) ;
           }

           setTimeout(() =>{
            scrollToDown() ;
          }, 1) ;
          
  }

  // sending the message
  const  sendMessage = async(event) =>{

    event.preventDefault() ;

    if(curr_message.trim().length && active.length > 0){
        const created_at = Math.round(new Date().getTime() / 1000);
        const messageData = {
          sent_by : 'admin',
          Id : room,
          message : curr_message,
          url : null ,
          media_type : 'text' ,
          created_at : created_at,
          updatemssg: `${curr_message.replaceAll("'", `\'\'`)}`
        }
    
     setCurrMessage("") ;
     setLoadMessage([...loadmessages , {message : curr_message , sent_by : 'admin' , media_type : 'text' ,created_at : created_at }]) ;
     socket.emit("joinRoom" , room) ;
     socket.emit("send_message" , messageData) ;
     scrollToDown() ;
  }
  }

  const handleTime = (created_at) => {
    const d = new Date(created_at * 1000);
    let am_pm,
      hrs = d.getHours(),
      min = d.getMinutes();
    if (hrs >= 12) {
      am_pm = ' pm ';
    } else {
      am_pm = ' am ';
    }

    if (hrs < 10) hrs = '0' + hrs;

    if (min < 10) min = '0' + min;

    return hrs + ':' + min + am_pm;
  };

  return (
    <div className='chat-container'>
        <div className='chatLeftSection'>
            <div className='tenPointQuerySupportContainer'>
              <div className='tenPointLogoNameCont'>
               <img className="tenPointLogo" src={TenPointLogo} style={{ width : "50px" , height : "50px" , borderRadius : "50%" }}/>
               <p className='TenPointName'>Ten Point Query Support</p>
              </div>
               <div className="searchInputContainer">
                <div className='searchInput'>
               <input className='search' type="text" placeholder='Search'/>
                </div>
                <div className='searchBtnCont'>
                  <button className="searchBtn"><BsSearch style={{color:'gray'}}/></button>
                </div>
               </div>
            </div>
            <div className='user_query_list_container'>
           {
            active.length > 0 && active.map((user , index) =>{
                return(
                    <>
                <div className="user_query_list" key={index} onClick={() => chatWindow(user.user_user_id , user.full_name , user.profile_image)}>
                      <div className='userImageAndNameCont'>
                        <img src={user.profile_image} className="userProfileImageInChatInfo" />
                      </div>
                      <div className="userLastMessageContainer">
                      <p className='userNameQuery'>{user.full_name}</p>
                        {
                          user.media_type == "image" ? 
                          <div className='userLastMessageInfo'>
                            <div className='userMessage'>
                            <p className='lastMessage'><BsImageFill/>&nbsp;Image</p>
                            </div>
                            <div className='userTimeAndUnseenMessageCont'>
                              <span className='lastMessagedeliverDate'>{handleTime(user.created_at)}</span>
                              {/* <span className='unseenMessageCount'>{user.delivered_count > 0 ? user.delivered_count : null}</span> */}
                            </div>
                          </div> : 
                          user.media_type == "video" ? 
                           <div className='userLastMessageInfo'>
                          <div className='userMessage'>
                          <p className='lastMessage'><BsFillCameraVideoFill/>&nbsp;Video</p>
                          </div>
                          <div className='userTimeAndUnseenMessageCont'>
                            <span className='lastMessagedeliverDate'>{handleTime(user.created_at)}</span>
                            {/* <span className='unseenMessageCount'>{user.delivered_count > 0 ? user.delivered_count : null }</span> */}
                          </div>
                          </div>
                          :  <div className='userLastMessageInfo'>
                            <div className='userMessage'>
                            <p className='lastMessage'>{user.message}</p>
                            </div>
                            <div className='userTimeAndUnseenMessageCont'>
                              <span className='lastMessagedeliverDate'>{handleTime(user.created_at)}</span>
                              {/* <span className='unseenMessageCount'>{user.delivered_count > 0 ? user.delivered_count : null}</span> */}
                            </div>
                            </div>
                        }
                       
                      </div>
                    </div>
                    </>
                )
                })
                }
            </div>
        </div>
        <div className='chatRightSection'>
            {
                loadmessages.length == 0 ?  
                <ImageContainer/> :   
                <>
                <div className='chatHeaderContainer'>
                  <div className='user_image_placeholder_container'  style={{ width : "50px" , height:"50px", backgroundImage : `url(${profileImage})` , backgroundPosition : "center" , backgroundSize : "cover" , borderRadius : "50%" , }}></div>
                    <p className='chatUserName'>{chatName}</p>
                </div>
                <div className='chatBodyContainer'>
                {
                chat && loadmessages && loadmessages.map((lmsg , index)=>{
                    return(
                          lmsg.sent_by == 'admin' ?
                              <div className='rightSideChatContainer' key={index}>
                                <div className='messageInfoContainerRight'>
                                <p className='userSentByName'>You</p>
                               {
                                  lmsg.media_type == 'text' ? <p className='message'>{lmsg.message}&nbsp;&nbsp;<span className='messageTime'>{handleTime(lmsg.created_at)}</span></p>: lmsg.media_type == 'image' ?  <><img src={lmsg.url} width={"200px"} height={"200px"} onClick={() => handleShowImage(lmsg.url)}/> <p className='messageTime'>{handleTime(lmsg.created_at)}</p> </>:<> <video height={"200px"} width={"200px"} controls onClick={() =>handleShowVideo(lmsg.url)}> <source src={ lmsg.url }/></video><p className='messageTime'>{handleTime(lmsg.created_at)}</p></>
                               }
                                </div>
                               
                              </div>:
                              <div className='leftSideChatContainer' key={index}>
                                  <div className='messageInfoContainerLeft'>
                                <p className='userSentByName'>{lmsg.sent_by}</p>
                               {
                                  lmsg.media_type == 'text' ? <p>{lmsg.message} <span className='messageTime'>{handleTime(lmsg.created_at)}</span></p> : lmsg.media_type == 'image' ?  <><img src={lmsg.url} width={"200px"} height={"200px"} onClick={() => handleShowImage(lmsg.url)}/> <p className='messageTimeMedia'>{handleTime(lmsg.created_at)}</p> </>:<> <video height={"200px"} width={"200px"} controls onClick={() =>handleShowVideo(lmsg.url)}> <source src={ lmsg.url }/></video><p className='messageTimeMedia'>{handleTime(lmsg.created_at)}</p></>
                               }
                                </div>
                              </div>
                        )
                    })
                  }
                  <div ref={containerRef}></div>
                  </div>
                <div className='chatFooterContainer'>
                      <input className='messageInput' name="message" value={curr_message} placeholder='Type a message' onChange={(event) => setCurrMessage(event.target.value)}/>
                      <button className='sendMessageBtn' onClick={(event) => sendMessage(event)}><IoSendSharp/></button>
                </div>
               </>
}
        </div>
    </div>
  )
}

export default Chat