import { useNavigate } from "react-router"

function UserSearch({user}){
    const navigator=useNavigate();
    const handleClick=(id)=>{
        navigator("/searchUser/"+id);
    }
    return <div className="user" onClick={()=>{
        handleClick(user.id)
    }}>
        <h1>{user.uName}</h1>
    </div>
}

export default UserSearch