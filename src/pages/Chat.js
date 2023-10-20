import React,{useEffect , useState , useRef} from 'react'
import './ChatStyles.css' ;
import io from 'socket.io-client' ;
import axios from 'axios' ;
import ImageContainer from '../components/ImageContainer';
import {IoSendSharp} from "react-icons/io5" ;
import {BsImageFill , BsFillCameraVideoFill , BsFillPlayCircleFill} from "react-icons/bs" ;
import {AiOutlineCloseCircle , AiOutlineStop} from "react-icons/ai" ;
import {MdAttachment , MdDelete} from 'react-icons/md';
import {RiUserSearchLine} from "react-icons/ri";
import TenPointLogo from "../assets/10pointlogo.png" ;
import CustomModal from '../components/CustomModal';
import { uploadingImage } from '../utilities/customUpload';

const finalUrl = 'https://test-765857d6-8ee2-4ea8-aef6-80efe5a112f6.10point.ai'
const socket = io.connect(finalUrl) ;

const Chat = () => {

  // setting current message
  const [curr_message , setCurrMessage] = useState("") ;

  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  // setting conversation happened on a particular day
  let conversation = [];
  
  const [search , setSearch] = useState('') ;

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

  const [searchArray , setSearchArray] = useState([]) ;
  
  const [show, setShow] = useState(false);
  
  const [imageUrl, setImageUrl] = useState('');

  const [videoUrl, setVideoUrl] = useState('');

  const [mediaModalShow , setMediaModalShow] = useState(false) ;
  // const [loader , setLoader] = useState(false) ;
  
  const [file , setFile] = useState('') ;

  const handleClose = () => {
    setShow(false);
    setMediaModalShow(false) ;
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
      // console.log(data.result) ;
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
      if(data.sent_by == 'admin' && data.room != room) return;
        setLoadMessage(loadmessages => [...loadmessages , data]) ;
        setTimeout(() =>{
          scrollToDown() ;
        },100) ;
     
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
        
           setCurrMessage("") ;
           
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
           
           if(searchArray.length > 0){
             setSearchArray([]) ;
             setSearch('') ;
           }
           setTimeout(() =>{
            scrollToDown() ;
          }, 1) ;
          
  }

  // sending the message
  const  sendMessage = async(url , media_type) =>{

    if((curr_message.trim().length || url != null) && active.length > 0){
        const created_at = Math.round(new Date().getTime() / 1000);
        const messageData = {
          sent_by : 'admin',
          Id : room,
          message : curr_message,
          url : url ,
          media_type : media_type ,
          created_at : created_at,
          updatemssg: `${curr_message.replaceAll("'", `\'\'`)}`
        }
    
     setCurrMessage("") ;
     setLoadMessage([...loadmessages , {message : curr_message , sent_by : 'admin' , media_type : media_type ,created_at : created_at , url : url}]) ;
     socket.emit("joinRoom" , room) ;
     socket.emit("send_message" , messageData) ;
     if(mediaModalShow)
        handleClose() ;
     scrollToDown() ;
  }
  }

  const handleTime = (created_at) => {
    const d = new Date(parseInt(created_at) * 1000);
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

  // search function to 
  const searchUser = (event) =>{
      
      setSearch(event.target.value) ;

      if(event.target.value.length == 0){
        setSearchArray([]) ;
        return ;
      }

      setSearchArray(active.filter((search)=>{
        return search.full_name.toLowerCase().includes(event.target.value.toLowerCase()) ;
    })) ;
}

  const clearSearch = () =>{
    setSearch('');
  }

  const handleFile = (event) => {
    if (
      event.target.files &&
      event.target.files.length > 0 &&
      event.target.files[0].type.includes('video')
    ) {
      // setLoader(true);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener('load', () => {
        uploadImage(reader.result , 'video');
      });
    }

    if (
      event.target.files &&
      event.target.files.length > 0 &&
      event.target.files[0].type.includes('image')
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener('load', () => {
        uploadImage(reader.result , 'image');
      });
    }
  };

  const uploadImage = (file , type) => {
    if (type == 'video') {
      uploadingImage(dataURItoBlob(file), `chat`, `${room}`)
        .then((res) => {
          setVideoUrl(res.filename) ;
          setTimeout(() => {
            setMediaModalShow(true) ;
            scrollToDown();
            // setVideoUrl('') ;
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // setLoader(true);
      uploadingImage(
        dataURItoBlob(file),
        `chat`,
        `${room}`,
      )
        .then((res) => {
          setImageUrl(res.filename) 
          setTimeout(() => {
            setMediaModalShow(true) ;
            scrollToDown();
            // setImageUrl('') ;
            // handleLoaderClosing();
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const dataURItoBlob = (dataURI) => {
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleDate = (created_at) => {
    const d = new Date(created_at * 1000);
    const completeDate = d.getDate() + ' ' + month[d.getMonth()] + ' ' + d.getFullYear();
    if (conversation.includes(completeDate)) {
      return null;
    } else {
      conversation.push(completeDate);
      return   <p className='chatStartDate'>{completeDate}</p>;
    }
  };

  const deleteMsg = async(chat_id) =>{

    const deleteInfo = {
      chat_id: chat_id ,
      user_id: room
    }

    socket.emit("delete_message" , deleteInfo) ;

    setLoadMessage(loadmessages.map((lmsg)=>{
          if(lmsg.chat_id == chat_id)
            lmsg.message_status = 'inactive' ;

          return lmsg ;
    }))
  }

  return (
    <div className='chat-container'>
        <div className='chatLeftSection'>
            <div className='tenPointQuerySupportContainer'>
              <div className='tenPointLogoNameCont'>
               <img className="tenPointLogo" src={TenPointLogo} style={{ width : "50px" , height : "50px" , borderRadius : "50%" }}/>
               <p className='TenPointName'>Ten Point Query Support</p>
              </div>
               <div className="searchInputContainer">
               <div className='searchBtnCont'>
                 <RiUserSearchLine style={{color:'gray' , fontSize : '12px'}}/>
                </div>
                <div className='searchInput'>
               <input className='search' name='search' type="text" value={search} placeholder='Search' onChange={(event) => searchUser(event)}/>
                </div>
                <div className='closeBtnContainer' onClick={()=> clearSearch()} style={{  visibility : search.length > 0 ? 'visible' : 'hidden'}}>
                    <AiOutlineCloseCircle style={{fontSize : '12px' , color : 'gray'}} />
                </div>
               </div>
            </div>
            <div className='user_query_list_container'>
           {

            searchArray.length > 0 ? 
             searchArray.map((user , index) =>{
              return(
                  <>

              <div className="user_query_list" key={index} onClick={() => chatWindow(user.user_user_id , user.full_name , user.profile_image)}>
                    <div className='userImageAndNameCont'>
                      <img src={user.profile_image} className="userProfileImageInChatInfo" />
                    </div>
                    <div className="userLastMessageContainer">
                    <p className='userNameQuery'>{user.full_name}</p>
                      {
                        user.message_status != 'inactive' ?
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
                          <p className='lastMessage'>{user.message.length <= 10 ? user.message : user.message.substring(0 , 10) + " ..."}</p>
                          </div>
                          <div className='userTimeAndUnseenMessageCont'>
                            <span className='lastMessagedeliverDate'>{handleTime(user.created_at)}</span>
                            {/* <span className='unseenMessageCount'>{user.delivered_count > 0 ? user.delivered_count : null}</span> */}
                          </div>
                          </div> :
                         <p className='deletedMessage'><AiOutlineStop/>&nbsp;You deleted this message&nbsp;&nbsp;<span className='messageTime'>{handleTime(user.created_at)}</span></p>

                      }
                     
                    </div>
                  </div>
                  </>
              )
              }) 
            :
            search.length > 0 ? 
            <p style={{ width : '100%' , height : '50%' , display : 'flex' , justifyContent : 'center' , alignItems : 'center' , fontSize : '30px' , color : 'gray'}}><RiUserSearchLine style={{fontSize : '40px'}}/>&nbsp;No results found</p> : 
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
                          user.message_status != 'inactive' ?
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
                            <p className='lastMessage'>{user.message.length <= 10 ? user.message : user.message.substring(0 , 10) + " ..."}</p>
                            </div>
                            <div className='userTimeAndUnseenMessageCont'>
                              <span className='lastMessagedeliverDate'>{handleTime(user.created_at)}</span>
                              {/* <span className='unseenMessageCount'>{user.delivered_count > 0 ? user.delivered_count : null}</span> */}
                            </div>
                            </div>
                            :
                            <p className='deletedMessage'><AiOutlineStop/>&nbsp;You deleted this message&nbsp;&nbsp;<span className='messageTime'>{handleTime(user.created_at)}</span></p>
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
                      <div>
                         <div className='chatStartDateContainer'>
                              {handleDate(lmsg.created_at)}
                         </div>
                          {lmsg.sent_by == 'admin' ?
                              (
                              <div className='rightSideChatContainer' key={index}>
                               {
                               lmsg.message_status != 'inactive' ? 
                               <div className='deleteMsgContainer' onClick={() => deleteMsg(lmsg.chat_id)}>
                                      <MdDelete/>
                                  </div> : null
                                  }
                                <div className='messageInfoContainerRight'>
                                <p className='userSentByName'>You</p>
                               {
                                  lmsg.message_status != 'inactive' ?
                                  lmsg.media_type == 'text' ? 
                                  <p className='message'>{lmsg.message}&nbsp;&nbsp;<span className='messageTime'>{handleTime(lmsg.created_at)}</span></p>: 
                                  lmsg.media_type == 'image' ?  
                                  <><img src={lmsg.url} width={"200px"} height={"200px"} onClick={() => handleShowImage(lmsg.url)}/> <p className='messageMediaTime'>{handleTime(lmsg.created_at)}</p> </>:
                                  <div className="chatVideo" onClick={() =>handleShowVideo(lmsg.url)}> <video className='rightChatVideo' height={"200px"} width={"200px"} > <source src={ lmsg.url }/></video>
                                   <BsFillPlayCircleFill className='videoPlayBtn' style={{ fontSize : '40px' , color : '#fff'}}/>
                                  <p className='messageMediaTime'>{handleTime(lmsg.created_at)}</p></div> : 
                                  <p className='deletedMessage'><AiOutlineStop/>&nbsp;You deleted this message&nbsp;&nbsp;<span className='messageTime'>{handleTime(lmsg.created_at)}</span></p>
                               }
                                </div>
                               
                              </div>
                              ):
                              (
                              <div className='leftSideChatContainer' key={index}>
                                  <div className='messageInfoContainerLeft'>
                                <p className='userSentByName'>{lmsg.sent_by}</p>
                               {
                                  lmsg.media_type == 'text' ? 
                                  <p>{lmsg.message} <span className='messageTime'>{handleTime(lmsg.created_at)}</span></p> : 
                                  lmsg.media_type == 'image' ? 
                                  <><img src={lmsg.url} width={"200px"} height={"200px"} onClick={() => handleShowImage(lmsg.url)}/> <p className='messageTimeMedia'>{handleTime(lmsg.created_at)}</p> </>:
                                  <div className="chatVideo" onClick={() =>handleShowVideo(lmsg.url)}> <video className='rightChatVideo' height={"200px"} width={"200px"}> <source src={ lmsg.url }/></video>
                                  <BsFillPlayCircleFill className='videoPlayBtn' style={{ fontSize : '40px' , color : '#fff'}}/>
                                  <p className='messageTimeMedia'>{handleTime(lmsg.created_at)}</p></div>
                               }
                                </div>
                              </div>
                              )}
                        </div>
                        )
                    })
                  }
                  <div ref={containerRef}></div>
                  </div>
                <div className='chatFooterContainer'>
                <label className='chatAttachmentLabel'>
              <div className='chatFileButton'>
                <MdAttachment className='chatFileBtn' style={{ color: '#fff' }} />
              </div>
              <input
                type='file'
                name='file'
                className='chatAttachment'
                onChange={handleFile}
              />
            </label>
                      <input className='messageInput' name="message" value={curr_message} placeholder='Type a message' onChange={(event) => setCurrMessage(event.target.value)}/>
                      <button className='sendMessageBtn' onClick={() => sendMessage(null , 'text')}><IoSendSharp/></button>
                </div>
               </>
}
        </div>
        <CustomModal
          show={show}
          handleClose={handleClose}
          imageUrl={imageUrl}
          videoUrl={videoUrl}
          title={''}
          btnText={''}
          bodyContent={''}
          displayHeader={false}
          displayBody={true}
          displayFooter={false} 
          backgroundClr={'transparent'}
          sendMessage={null}
        />
         <CustomModal
          show={mediaModalShow}
          handleClose={handleClose}
          imageUrl={imageUrl}
          videoUrl={videoUrl}
          title={'Preview'}
          btnText={'Send'}
          bodyContent={''}
          displayHeader={true}
          displayBody={true}
          displayFooter={true} 
          backgroundClr={'white'}
          sendMessage={sendMessage}
        />
    </div>
  )
}

export default Chat