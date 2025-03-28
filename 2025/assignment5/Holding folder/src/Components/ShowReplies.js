import Reply from "../Components/Reply";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const serverURL="http://localhost:8080"

function ShowReplies({user,setUser,parentId,refreshReply}) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate()
  const getReplies=async()=>{
    try{
    console.log("Parent ID " +parentId)
    const res=await axios.get(serverURL+"/getReplies/"+parentId, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
          // Add other headers as needed
        },
      }    
    )
    console.log(res.data)
    setReplies(res.data.result)
    setLoading(false);
    console.log(setReplies)
}catch(err){
    localStorage.setItem("token","")
    setUser({name:"",logged:false})
    navigator("/")
    console.log(err)
    }
  }
  useEffect(() => {
    getReplies();
  }, [refreshReply]);
  useEffect(() => {
    getReplies();
  }, []);
    return (
      <div className="ShowReplies">
        {loading ? (
          <p> Loading... </p>
        ) : (
        replies.map(reply=>{
          if(!reply)
            return;
          return<Reply id={reply.id} user={reply.user} uName={reply.uName} data={reply.data} timeStamp={reply.timeStamp} vote={reply.VoteReply} deletable={reply.deletable}/>
        }))}
      </div>
    );
  }
  
  export default ShowReplies;