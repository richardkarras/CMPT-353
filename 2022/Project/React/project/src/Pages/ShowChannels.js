import Channel from "../Components/Channel";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import AddChannel from "../Components/AddChannel";

const serverURL="http://localhost:8080"

function ShowChannels({user,setUser,refreshChannels}) {
  const [channel, setChannel] = useState([]);
  const [isMod, setisMod] = useState(false);
  const [refreshPost, setRefreshPost] = useState(false);
  const navigator = useNavigate()
  const getChannels = async () => {
    try {
      const response = await axios.get(serverURL + "/getChannels", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
            // Add other headers as needed
          },
        }  
      );
      const data = response.data;
      //console.log(data);
      setChannel(data.result);
      setisMod(data.isMod==1);
    } catch (err) {
      localStorage.setItem("token","")
      setUser({name:"",logged:false})
      navigator("/")
      console.error(err);
    }
  };
  useEffect(() => {
    getChannels();
  }, [refreshChannels]);
  useEffect(() => {
    getChannels();
  }, []);
    return (
      <div className="ShowChannels">
        
        {channel.map(channel=>{
          return<Channel id={channel.id} channelName={channel.channelName} description={channel.description} key={channel.id} isMod={isMod} />
        })}
        <AddChannel user={user} setUser={setUser} getChannels={getChannels} refreshPost={refreshPost} setRefreshPost={setRefreshPost} />
      </div>
    );
  }
  
  export default ShowChannels;