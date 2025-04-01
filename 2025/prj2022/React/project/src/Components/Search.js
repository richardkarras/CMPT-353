import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const serverURL="http://localhost:8080"

function Search({setSearchPosts,setSearchChannels,setSearchReplies,setUsers,setVoteBW,setType}){
    const [searchTerm,setSearchTerm]=useState("")
    const [show, setShow] = useState(false);
    const navigator = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSearch = async () => {
        const {data}=await axios.get(serverURL+'/stringSearch/'+searchTerm, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json"
            },
        })
        console.log(data.posts);
        setSearchChannels(data.channels);
        setSearchPosts(data.posts);
        setSearchReplies(data.replies);
        setType(1);
        navigator('/searchResults/')
    }
    const handleUserSearch = async () => {
        const {data}=await axios.get(serverURL+'/searchUser/'+searchTerm, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json"
            },
        })
        setUsers(data.users);
        console.log(data.users);
        setType(2);
        navigator('/searchResultsUser/')
    }
    const handleVoteBW = async () => {
        const {data}=await axios.get(serverURL+'/bestWorst/', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
        })
        console.log(data);
        setVoteBW(data);
        setType(3);
        navigator('/searchBW/')
    }
    
    return (
        <div>
            <>
      <Button variant="primary" onClick={handleShow}>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Search</Form.Label>
              <Form.Control
              value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} 
                type="text"
                placeholder="Search string or user"
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="primary" onClick={handleUserSearch}>
            User search
          </Button>
          <Button variant="primary" onClick={handleVoteBW}>
            Best and Worst Post and Reply
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
        </div>
    )
}

export default Search