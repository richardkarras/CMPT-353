import './App.css';
<<<<<<< HEAD
import { Routes,Route } from 'react-router';
import { useState,useEffect } from 'react';
import AddPosts from './Pages/AddPosts';
import ShowPosts from './Pages/ShowPosts';
import ShowPost from './Pages/ShowPost';

function App() {
  const [refreshPost, setRefreshPost]=useState("");
  const [type, setType]=useState(1);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ShowPosts />}/>
          <Route path='/addposts' element={<AddPosts refreshPost={refreshPost} setRefreshPost={setRefreshPost}/>}/>
          <Route path='/showposts' element={<ShowPosts />}/>
          <Route path='/showpost/:postId' element={<ShowPost />}/>
        </Routes>
      </BrowserRouter>
=======

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Things go here

          <br></br>And this too?
        </p>
      </header>
>>>>>>> origin/main
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> origin/main
