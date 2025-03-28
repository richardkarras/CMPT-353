import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const serverURL="http://localhost:8080"

function AddReply({user,setUser,parentId,refreshReply,setRefreshReply}) {
    const [state,setState]=useState({
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
        const res=await axios.post(serverURL+"/addReply/"+parentId,{
            data:state.data
        }, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json"
            },
          }    
        )
        console.log(res.data)
        setRefreshReply(!refreshReply)
        setState({data:""})
    }catch(err){
        localStorage.setItem("token","")
        setUser({name:"",logged:false})
        navigator("/")
        console.log(err)
        }
    }
    return (
      <div className="AddReply">
        <form onSubmit={handleSubmit}>
        <label forHtml="Data"> Add Reply:</label><br />
        <input type="text" name="data" value={state.data} onChange={handleChange}/><br />
        <input type="submit" value="Submit"/><br />
        </form>
      </div>
    );
  }
  
  export default AddReply;