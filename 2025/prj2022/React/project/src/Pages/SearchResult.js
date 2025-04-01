import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Channel from "../Components/Channel";
import Post from "../Components/Post";
import Reply from "../Components/Reply";
import UserSearch from "../Components/UserSearch";
import NavBar from "../Components/Navbar";
import {Link} from "react-router-dom";

function SearchResult({user,setUser,search_Channels,search_Posts,search_Replies,users,voteBW}){
    return(
            <div>
                <h1>Channels</h1>
                {search_Channels&&search_Channels.map(channel=>{
                    console.log(channel)
                    return<Channel id={channel.id} channelName={channel.channelName} description={channel.description} user = {user} setUser = {setUser} isMod={false} />
                })}
                
                <h1>Posts</h1>
                {search_Posts&&search_Posts.map(post=>{
                    return<Post id={post.id} topic={post.topic} data={post.data} vote={post.VotePost} user = {user} setUser = {setUser} timeStamp={post.timeStamp} deletable={post.deletable} />
                })}
                <h1>Replies</h1>
                {search_Replies&&search_Replies.map(reply=>{
                    return<Reply id={reply.id} data={reply.data} vote={reply.VoteReply} user = {user} setUser = {setUser} timeStamp={reply.timeStamp} deletable={reply.deletable} />
                })}
            </div>
        
        )
    
}

export default SearchResult