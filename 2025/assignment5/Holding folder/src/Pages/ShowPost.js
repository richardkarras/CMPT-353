import Post from "../Components/Post";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import ShowReplies from "../Components/ShowReplies";

const serverURL="http://localhost:8080"

function ShowPost({user,setUser}) {
  const [post, setPost] = useState(null);
  const postId = useParams().postId;
  console.log("PostId " + postId);
  const getPost=async()=>{
    try{
    const res=await axios.get(serverURL+"/getPost/"+postId, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
          // Add other headers as needed
        },
      }    
    )
    console.log("res.data showpost:23")
    console.log(res.data)
    setPost(res.data.result[0])
}catch(err){
    localStorage.setItem("token","")
    setUser({name:"",logged:false})
    navigator("/")
    console.log(err)
    }
  }
  useEffect(() => {
    getPost();
  }, []);
    return (
      <div className="ShowPost">
        
       {post&&<Post id={postId} topic={post.topic} data={post.data} vote={post.VotePost} uName = {post.uName} user = {user} setUser = {setUser} timeStamp={post.timeStamp} details={true} deletable={post.deletable}/>}
      </div>
    );
  }
  
  export default ShowPost;