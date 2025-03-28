//import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";

const serverURL="http://localhost:8080"

function Landing() {
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
        <p>
            Welcome to Assignment 4
        </p>
        <a href="/AddPosts">
          <Button> Add Posts </Button>
        </a>
        <a href="/ShowPosts">
          <Button> Show Posts </Button>
        </a>
        <Button onClick={initializeDatabase}> Reinitialize Database </Button>
      </div>
    );
  }else{
    return (
      <div className="Landing">
        <p>
            Welcome to Assignment 4
        </p>
        <Button onClick={initializeDatabase}> Initialize Database </Button>
      </div>
    );
  }
}

  
  export default Landing;