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
            Welcome to CMPT 353 Project forum board
        </p>
        <a href="/SignIn">
          <Button> Sign in </Button>
        </a>
        <a href="/createUser">
          <Button> Sign up </Button>
        </a>
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