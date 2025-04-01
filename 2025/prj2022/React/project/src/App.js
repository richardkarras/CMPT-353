import './App.css';
import { Routes,Route } from 'react-router';
import Landing from './Pages/Landing';
import AddPosts from './Pages/AddPosts';
import ShowPosts from './Pages/ShowPosts';
import ShowPost from './Pages/ShowPost';
import { useState,useEffect } from 'react';
import Auth from './Pages/Auth';
import Search from './Components/Search';
import SearchResult from './Pages/SearchResult';
import SearchResultsUser from './Pages/SearchResultsUser';
import SearchBW from './Pages/SearchBW';
import NavBar from './Components/Navbar';
import Profile from './Components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user,setUser]=useState({name:"",logged:false});
  const [search_Posts, setSearchPosts]=useState("")
  const [search_Channels, setSearchChannels]=useState("")
  const [search_Replies, setSearchReplies]=useState("")
  const [refreshPost, setRefreshPost]=useState("")
  const [type,setType]=useState(1)
  const [users,setUsers]=useState("")
  const [voteBW,setVoteBW]=useState("")
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
    <div className="App">
      <NavBar setSearchPosts={setSearchPosts} setSearchChannels={setSearchChannels} setSearchReplies={setSearchReplies} setUsers={setUsers} setVoteBW={setVoteBW}/>
      <Routes>
        <Route path="/" element={<Landing user={user} setUser={setUser} />} />
        <Route path="/addposts/:channelId" element={<AddPosts user={user} setUser={setUser} refreshPost={refreshPost} setRefreshPost={setRefreshPost} />} />
        <Route path="/showposts/:channelId" element={<ShowPosts user={user} setUser={setUser}/>} />
        <Route path="/showpost/:postId" element={<ShowPost user={user} setUser={setUser}/>} />
        <Route path="/searchResults/" element={<SearchResult user={user} setUser={setUser} search_Posts={search_Posts} search_Channels={search_Channels} search_Replies={search_Replies} type={type} users={users} voteBW={voteBW}/>} />
        <Route path="/searchResultsUser/" element={<SearchResultsUser user={user} setUser={setUser} users={users} />} />
        <Route path="/searchBW/" element={<SearchBW search_Posts={search_Posts} search_Replies={search_Replies} voteBW={voteBW} />} />
        <Route path="/searchUser/:id" element={<Profile />}/>
      </Routes>
    </div>
  );
}

export default App;
