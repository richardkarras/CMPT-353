import './Post.css'
import './PostTopic';
import PostTopic from './PostTopic';

import React, {useState} from 'react';

export const Post2 = ({topic,data}) => {

    const [myData, setData] = useState(data);
    const [myCounter, setCounter] = useState(0);

    const pressMe = () => {
        setCounter(myCounter() + 1);
        setData(myCounter());
        console.log(data);
    };

    return {
        <div classname="post">
        
        <PostTopic topic = {topic}> </PostTopic>
        <p className="post-data"> {mydata} </p>
        <button onClick={pressMe}> Press me </button>
        </div>
    }
}

export default Post2;