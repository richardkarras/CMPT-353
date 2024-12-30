import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faThumbsUp, faThumbsDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpEmpty, faThumbsDown as faThumbsDownEmpty} from '@fortawesome/free-regular-svg-icons';
import Post from "./Post";
import Reply from "./Reply";


const serverURL="http://localhost:8080"

const Profile = ({user,setUser}) => {
    const id = useParams().id;
    console.log("ID for user posts");
    console.log(id);
    const [posts,setPosts]=useState([])
    const [replies,setReplies]=useState([])
    const loadUserPosts=async()=>{
        let {data}=await axios.get(serverURL+'/posts/'+id, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json"
            },
        })
        setPosts(data.posts)    
    }
    const loadUserReplies=async()=>{
        let {data}=await axios.get(serverURL+'/replies/'+id, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json"
            },
        })
        setReplies(data.replies)    
    }
    useEffect(()=>{
        loadUserPosts();
        loadUserReplies();
    },[]);
  return (
    <div>
    <h1>Posts</h1>
                {posts&&posts.map(post=>{
                    return<Post id={post.id} topic={post.topic} data={post.data} vote={post.VotePost} user = {user} setUser = {setUser} timeStamp={post.timeStamp} deletable={post.deletable} />
                })}
    <h1>Replies</h1>    
                {replies&&replies.map(reply=>{
                    return<Reply id={reply.id} data={reply.data} vote={reply.VoteReply} user = {user} setUser = {setUser} timeStamp={reply.timeStamp} deletable={reply.deletable} />
                })}
    </div>
  );
};

  export default Profile;