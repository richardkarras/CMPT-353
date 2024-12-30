import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const serverURL="http://localhost:8080"

function AddPost({user,setUser,channelId,refreshPost,setRefreshPost}) {
    const [state,setState]=useState({
        topic:"",
        data:""
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
        const res=await axios.post(serverURL+"/addPost/"+channelId,{
            topic:state.topic,
            data:state.data,
            timeStamp:state.timeStamp
        }, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json"
            },
          }    
        )
        console.log(res.data)
        setRefreshPost(!refreshPost)
        setState({topic:"",description:""})
    }catch(err){
        localStorage.setItem("token","")
        setUser({name:"",logged:false})
        navigator("/")
        console.log(err)
        }
    }

    return (
      <div className="AddPost">
        <form onSubmit={handleSubmit}>
            <label forHtml="Topic">New Topic:</label><br />
            <input value={state.topic} onChange={handleChange} type="text" name="topic"/><br />
            <label forHtml="Data"> Data:</label><br />
            <input type="text" name="data" value={state.data} onChange={handleChange}/><br />
            <input type="submit" value="Submit"/><br />
        </form>
      </div>
    );
  }

  export default AddPost;