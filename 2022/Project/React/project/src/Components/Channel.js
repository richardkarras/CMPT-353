import { useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const serverURL="http://localhost:8080"

const Channel = ({id,channelName,description,key,isMod}) => {
  const navigator = useNavigate()
  const DeleteChannel=async()=>{
    const res=await axios.delete(serverURL+"/removeChannel/"+id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
      }    
    )
    navigator("/")
    }
  const handleClick = () => {
    navigator("/addposts/"+id)
  }
  return (
      <div className="channel" onClick={handleClick}>
        <h2>{channelName}{isMod&&<FontAwesomeIcon icon={faTrash} className="delete-channel" onClick={DeleteChannel}/>}</h2>
        <p>{description}</p>
      </div>
    );
  };
  
    export default Channel;