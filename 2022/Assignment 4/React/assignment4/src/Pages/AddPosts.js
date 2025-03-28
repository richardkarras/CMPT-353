import AddPost from "../components/AddPost";
import { Button } from "react-bootstrap";

function AddPosts() {
    return (
      <div className="AddPosts">
        <AddPost />
        <p> 
          <a href="/ShowPosts">
          <Button> Show Posts </Button>
          </a>
        </p>
      </div>
    );
  }
  
  export default AddPosts;