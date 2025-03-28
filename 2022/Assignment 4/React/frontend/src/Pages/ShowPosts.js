import Post from "../Components/Post";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const serverURL="http://localhost:8080"

function ShowPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch(serverURL + "/getPosts");
        const data = await response.json();
        console.log(data);
        setPosts(data.result);
      } catch (err) {
        console.error(err);
      }
    };

    getPosts();
  }, []);
    return (
      <div className="ShowPosts">
        
        {posts.map(post=>{
          return<Post id={post.id} topic={post.topic} data={post.data} />
        })}
        <p><a href="/AddPosts">
      <Button> Add Posts </Button>
    </a></p>
      </div>
      
    );
  }
  
  export default ShowPosts;