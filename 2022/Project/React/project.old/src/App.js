import './App.css';
import { Routes,Route } from 'react-router';
import Landing from './Pages/Landing';
import AddPosts from './Pages/AddPosts';
import ShowPosts from './Pages/ShowPosts';
import { useState,useEffect } from 'react';
import Auth from './Pages/Auth';

function App() {
  const [user,setUser]=useState({name:"",logged:false})

  if(!user.logged){
    return <Auth user={user} setUser={setUser} />
  }
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/addposts" element={<AddPosts />} />
        <Route path="/showposts" element={<ShowPosts />} />
      </Routes>
    </div>
  );
}

export default App;
