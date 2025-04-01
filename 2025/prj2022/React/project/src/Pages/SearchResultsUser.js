import { useParams } from "react-router";
import axios from "axios";
import { useState,useEffect } from "react";
import UserSearch from "../Components/UserSearch";

const serverURL="http://localhost:8080"

function SearchResultsUser({user,setUser,users}){
    const {id}=useParams();
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
    return (<div>
        <h1>Users</h1>
        {users && users.map(user=>{
                return<UserSearch user={user} />}
                )}  
    </div>)
}

export default SearchResultsUser