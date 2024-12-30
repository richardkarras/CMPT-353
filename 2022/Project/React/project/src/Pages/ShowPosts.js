import Post from "../Components/Post";
import { useState, useEffect } from "react";
import axios from "axios";
import AddPost from "../Components/AddPost";
import { useNavigate } from "react-router";

const serverURL="http://localhost:8080"

function ShowPosts({user,setUser,channelId,refreshPost,setRefreshPost}) {
  const [posts, setPosts] = useState([]);
  const navigator = useNavigate();
  const getPosts=async()=>{
    try{
    const res=await axios.get(serverURL+"/getPosts/"+channelId, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
          // Add other headers as needed
        },
      }    
    )
    console.log(res.data)
    setPosts(res.data.result)
}catch(err){
    localStorage.setItem("token","")
    setUser({name:"",logged:false})
    navigator("/")
    console.log(err)
    }
  }
  useEffect(() => {
    getPosts();
  },[refreshPost]);
  useEffect(() => {
    getPosts();
  }, []);
    return (
      <div className="ShowPosts">
        
        {posts.map(post=>{
          return<Post id={post.id} topic={post.topic} data={post.data} vote={post.VotePost} user = {user} uName = {post.uName} setUser = {setUser} timeStamp={post.timeStamp} deletable={post.deletable} />
        })}
        <AddPost user={user} setUser = {setUser} channelId = {channelId} refreshPost={refreshPost} setRefreshPost={setRefreshPost}/>
      </div>
    );
  }
  
  export default ShowPosts;