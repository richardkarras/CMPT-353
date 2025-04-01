import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faThumbsUp, faThumbsDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpEmpty, faThumbsDown as faThumbsDownEmpty} from '@fortawesome/free-regular-svg-icons';

const serverURL="http://localhost:8080"

const Reply = ({id,data,user,uName,timeStamp,setUser,vote,deletable}) => {
  const [state,setState]=useState({
    reply:"",
    upVotePost:0,
    downVotePost:0
})
  const navigator = useNavigate()
  const [numRVote,setNumRVote]=useState(vote)
  const [direction,setDirection]=useState(0)
  const UpVote=async()=>{
    try{
    const res=await axios.get(serverURL+"/upVoteReply/"+id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
      }    
    )
    console.log(res.data)
    setNumRVote(res.data.vote)
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
    const res=await axios.get(serverURL+"/downVoteReply/"+id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
      }    
    )
    console.log(res.data)
    setNumRVote(res.data.vote)
    setDirection(res.data.direction)
}catch(err){
    localStorage.setItem("token","")
    setUser({name:"",logged:false})
    navigator("/")
    console.log(err)
    }
  }
  const DeleteReply=async()=>{
    try{
    const res=await axios.delete(serverURL+"/removeReply/"+id, {
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
  return (
    
    <div className="reply">
      <p1>{uName} said:</p1>
      <p>{data}</p>
      <FontAwesomeIcon icon={(direction==1)?faThumbsUp:faThumbsUpEmpty} className="like-icon" onClick={UpVote} />
      <span>{numRVote}</span>
      <FontAwesomeIcon icon={(direction==-1)?faThumbsDown:faThumbsDownEmpty} className="dislike-icon" onClick={DownVote}/>
      {/*<p>{user}</p>*/}
      <p>{timeStamp}{deletable&&<FontAwesomeIcon icon={faTrash} className="delete-reply" onClick={DeleteReply}/>}</p>
    </div>
  );
};

  export default Reply;