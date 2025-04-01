import { useState } from "react";
import axios from "axios";

const serverURL="http://localhost:8080"

function AddPost() {
    const [state,setState]=useState({
        topic:"",
        data:""
    })

    const handleChange=(e)=>{
        setState({
            ...state,
            [e.target.name]:e.target.value
        })
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(state)
        try{
        const res=await axios.post(serverURL+"/addPost",{
            data:state.data,
            topic:state.topic
        })
        console.log(res.data)
    }catch(err){
        console.log(err)
        }
    }

    return (
      <div className="AddPost">
        <form onSubmit={handleSubmit}>
            <label forHtml="Topic"> Topic:</label><br />
            <input value={state.topic} onChange={handleChange} type="text" name="topic"/><br />
            <label forHtml="Data"> Data:</label><br />
            <input type="text" name="data" value={state.data} onChange={handleChange}/><br />
            <input type="submit" value="Submit"/><br />
        </form>
      </div>
    );
  }

  export default AddPost;