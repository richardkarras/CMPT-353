import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Post from "../Components/Post";
import Reply from "../Components/Reply";
import NavBar from "../Components/Navbar";
import {Link} from "react-router-dom";

function SearchBW({user,setUser,search_Posts,search_Replies,voteBW}){
    const bestPost=voteBW.bestPost;
    const bestReply=voteBW.bestReply;
    const worstPost=voteBW.worstPost;
    const worstReply=voteBW.worstReply;
    return(
        <div>
            <h1>Posts</h1>
            {
                bestPost&&<p className="post">Best Post: <Link to={"/showPost/"+bestPost.id}>{bestPost.topic}</Link> with votes: {bestPost.VotePost}</p>
            }
            {
                worstPost&&<p className="post">Worst Post: <Link to={"/showPost/"+worstPost.id}>{worstPost.topic}</Link> with votes: {worstPost.VotePost}</p>
            }

                
            <h1>Replies</h1>
            {
                bestReply&&<p className="reply">Best Reply: <Link to={"/showPost/"+bestReply.id}>{bestReply.data}</Link> with votes: {bestReply.VoteReply}</p>
            }
            {
                worstReply&&<p className="reply">Worst Reply: <Link to={"/showPost/"+worstReply.id}>{worstReply.data}</Link> with votes: {worstReply.VoteReply}</p>
            }
        </div>
    )
}

export default SearchBW
