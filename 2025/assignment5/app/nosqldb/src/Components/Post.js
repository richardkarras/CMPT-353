import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import AddReply from "./AddReply";
import ShowReplies from "./ShowReplies";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faThumbsUp, faThumbsDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpEmpty, faThumbsDown as faThumbsDownEmpty} from '@fortawesome/free-regular-svg-icons';

const serverURL="http://localhost:8080"

const Post = ({id,topic,data,timeStamp,user,uName,setUser,vote,details,deletable}) => {
  const [state,setState]=useState({
    reply:"",
    upVotePost:0,
    downVotePost:0
})
  const [numVote,setNumVote]=useState(vote)
  const [direction,setDirection]=useState(0)
  const [refreshReply,setRefreshReply]=useState(false)
  const [replyCount, setReplyCount]=useState(0)
  const [relevantReply, setRelevantReply]=useState("")
  const navigator = useNavigate()
  const UpVote=async()=>{
    try{
    const res=await axios.get(serverURL+"/upVotePost/"+id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
      }    
    )
    console.log(res.data)
    setNumVote(res.data.vote)
    setDirection(res.data.direction)
}catch(err){
    localStorage.setItem("token","")
    setUser({name:"",logged:false})
    navigator("/")
    console.log(err)
    }
  }
  const DownVote=async()=>{
    try{
    const res=await axios.get(serverURL+"/downVotePost/"+id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
      }    
    )
    console.log(res.data)
    setNumVote(res.data.vote)
    setDirection(res.data.direction)
}catch(err){
    localStorage.setItem("token","")
    setUser({name:"",logged:false})
    navigator("/")
    console.log(err)
    }
  }
  const DeletePost=async()=>{
    try{
    const res=await axios.delete(serverURL+"/removePost/"+id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
      }    
    )
}catch(err){
    localStorage.setItem("token","")
    setUser({name:"",logged:false})
    navigator("/")
    console.log(err)
    }
  }
const getRepliesCount=async()=>{
  const res=await axios.get(serverURL+"/metaReply/"+id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
    }    
  )
  setReplyCount(res.data.count)
  setRelevantReply(res.data.relevant)
}
useEffect(() => {
  getRepliesCount();
}, [refreshReply]);
useEffect(() => {
  getRepliesCount();
}, []);
  return (
    <div className="post">
      <h3>{topic}</h3>
      <p1>{uName} said:</p1>
      <p>{data}</p>
      <FontAwesomeIcon icon={(direction==1)?faThumbsUp:faThumbsUpEmpty} className="like-icon" onClick={UpVote} />
      <span>{numVote}</span>
      <FontAwesomeIcon icon={(direction==-1)?faThumbsDown:faThumbsDownEmpty} className="dislike-icon" onClick={DownVote}/>
      <p>{timeStamp}{deletable&&<FontAwesomeIcon icon={faTrash} className="delete-post" onClick={DeletePost}/>}</p>
      {!details&&<button onClick={()=>{navigator("/showPost/"+id)}}>View replies {replyCount}</button>}
      {details&&<ShowReplies user = {user} setUser = {setUser} parentId = {id} refreshReply = {refreshReply} />}
      <AddReply user = {user} setUser = {setUser} parentId = {id} refreshReply = {refreshReply} setRefreshReply = {setRefreshReply} />
      {!details&&<div>{relevantReply}</div>}
    </div>
  );
};

  export default Post;