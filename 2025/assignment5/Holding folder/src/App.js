// import './App.css';
import { Routes,Route } from 'react-router';
import { useState,useEffect } from 'react';
import AddPosts from './Pages/AddPosts';
import ShowPosts from './Pages/ShowPosts';
import ShowPost from './Pages/ShowPost';
import Landing from './Pages/Landing';
import NavBar from './Components/Navbar';

function App() {
  const [refreshPost, setRefreshPost]=useState("");
  // const [type, setType]=useState(1);
  return (
    <div>
      <p>Assignment 5</p>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ShowPosts />}/>
          <Route path='/addposts' element={<AddPosts refreshPost={refreshPost} setRefreshPost={setRefreshPost}/>}/>
          <Route path='/showposts' element={<ShowPosts />}/>
          <Route path='/showpost/:postId' element={<ShowPost />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;