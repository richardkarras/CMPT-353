import { Button, Navbar } from "react-bootstrap";
import { useState, useEffect } from "react";
import AddChannel from "../Components/AddChannel";
import ShowChannels from "./ShowChannels";
import NavBar from "../Components/Navbar";

const serverURL="http://localhost:8080"

function Landing({user,setUser}) {
  const [init,setInit]=useState(false)
  const initializeDatabase=async()=>{
    try{await fetch(serverURL+"/initialize")
    }catch(err){
      console.log(err);
    }
  }
  const checkDatabase=async()=>{
    const res=await fetch(serverURL+"/check");
    const result=await res.json();
    setInit(result.exists)
     }
 
     useEffect(()=>{
         checkDatabase();
         },[])

  if(init){
    return (
      <div className="Landing">
        <h1>
            Welcome to CMPT 353 Project forum board
        </h1>
        <h2>Channels:</h2>
        <ShowChannels user={user} setUser={setUser} />
      </div>
    );
  }else{
    return (
      <div className="Landing">
        <p>
            Click to build project database
        </p>
        <Button onClick={initializeDatabase}> Clickme </Button>
      </div>
    );
  }
}

  
  export default Landing;