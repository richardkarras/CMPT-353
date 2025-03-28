import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Search from './Search';
import { useState,useEffect } from 'react';
import Auth from '../Pages/Auth';
import { useNavigate } from 'react-router';
import axios from 'axios';

const serverURL="http://localhost:8080"

function NavBar({setSearchChannels,setSearchPosts,setSearchReplies,setUsers,setVoteBW}){
    const [user,setUser]=useState({name:"",logged:false});
    const [type,setType]=useState(1)
    const navigator = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        alert ("User logged out");
        setUser({...user, logged: false});
        navigator(0);
    }
    useEffect(()=>{
        if(window.localStorage.getItem("token")){
          setUser({
            ...user,
            logged:true
          })
        }
      },[])
      if(!user.logged){
        return <Auth user={user} setUser={setUser} />
      }
return (
    <Navbar expand="lg" className="d-flex justify-content-center" >
        <div className="d-flex align-items-center">
            <Navbar.Brand href="/" style={{ fontSize: '24px', padding: '10px'}}>CMPT 353 Forum Project</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="container-fluid">
                    <Nav.Item>
                        <Nav.Link href="/" className="d-flex justify-content-center align-items-center" style={{fontSize: '18px', padding: '10px'}}>Channels</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="ms-auto">
                        <Search setSearchPosts={setSearchPosts} setSearchChannels={setSearchChannels} setSearchReplies={setSearchReplies} setType={setType} setUsers={setUsers} setVoteBW={setVoteBW} />
                    </Nav.Item>
                    <Nav.Item>
                        <button onClick={logout} style={{ fontSize: '18px', padding:'10px'}}>Log out</button>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </div>
    </Navbar>
    );
}

export default NavBar;