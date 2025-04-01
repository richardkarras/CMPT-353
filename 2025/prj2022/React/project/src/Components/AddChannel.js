import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const serverURL="http://localhost:8080"

function AddChannel({user, setUser, getChannels}) {
    const [state,setState]=useState({
        channelName:"",
        description:""
    })
    const navigator = useNavigate()
    const handleChange=(e)=>{
        setState({
            ...state,
            [e.target.name]:e.target.value
        })
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(state);
        let token=window.localStorage.getItem("token");
        const header = `Authorization: Bearer ${token}`;
        try{
        const res=await axios.post(serverURL+"/addChannel",{
            channelName:state.channelName,
            description:state.description
        }, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
              // Add other headers as needed
            },
          }    
        )
        console.log(res.data)
        setState({channelName:"",description:""})
        getChannels()
    }catch(err){
        localStorage.setItem("token","")
        setUser({name:"",logged:false})
        navigator("/")
        console.log(err)
        }
    }

    return (
      <div className="AddChannel">
        <form style={{margin:50}} onSubmit={handleSubmit}>
            <label forHtml="channelName"> Channel Name:</label><br />
            <input value={state.channelName} onChange={handleChange} type="text" name="channelName"/><br />
            <label forHtml="description"> Description:</label><br />
            <input value={state.description} onChange={handleChange} type="text" name="description" /><br />
            <button type="submit">Create new channel</button>
        </form>
      </div>
    );
  }

  export default AddChannel;