import AddPost from "../Components/AddPost";
import { useParams } from "react-router";
import ShowPosts from "./ShowPosts";

function AddPosts({user,setUser}) {
    let { channelId } = useParams();
    return (
      <div className="AddPosts">
        <ShowPosts user = {user} setUser = {setUser} channelId = {channelId} />     
      </div>
    );
  }
  
  export default AddPosts;