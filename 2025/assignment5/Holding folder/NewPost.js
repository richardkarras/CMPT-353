import React, {useState} from 'react';

var counter = 0;

const NewPost = ({topic,data}) => {
    const [myData, setData] = useState(data);
    const pressMe = () => {
        counter++;
        setData(counter.toString());
        console.log(data);
    };
    return (
        <div classname='post'>
            <PostTopic topic = {topic}/>
            <p className='post-data'>{myData}</p>
            <button onClick={pressMe}>Press me</button>
        </div>
    )
}
export default NewPost;