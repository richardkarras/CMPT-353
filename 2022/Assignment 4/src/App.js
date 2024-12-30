import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [topic, setTopic] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get('/getPosts')
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/addPost', { topic, data })
      .then(() => {
        setTopic('');
        setData('');
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h1>Topic &amp; Data</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">Topic:</label><br />
        <input type="text" id="topic" name="topic" value={topic} onChange={e => setTopic(e.target.value)} /><br />
        <label htmlFor="data">Data:</label><br />
        <input type="text" id="data" name="data" value={data} onChange={e => setData(e.target.value)} /><br />
        <button type="submit">Submit</button>
      </form>
      <div>
        {posts.map(post => (
          <div key={post._id}>
            <h2>{post.topic}</h2>
            <p>{post.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
