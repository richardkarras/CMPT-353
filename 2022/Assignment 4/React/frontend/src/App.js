import './App.css';
import { Routes,Route } from 'react-router';
import Landing from './Pages/Landing';
import AddPosts from './Pages/AddPosts';
import ShowPosts from './Pages/ShowPosts';

function App() {
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