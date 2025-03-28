import React from 'react';
// import '../style/ShowPosts.css';

export const ShowPost = ({postId, postTopic, postData, postStamp, responses}) => {
    const replies = [];
    if (Array.isArray(responses)) {
        responses.forEach(element => {
            if (element.parentId === postId) {
                replies.push(element);
            }
        });
    }
    return (
        <div>
            <h1>{postTopic}</h1>
            <p id='data'>{postData}</p>
            <p id='timestamp'>{postStamp}</p>
            {replies?.map((item)=> (
                <div key={item.id}>
                    <p id='data'>{item.data}</p>
                    <p id='timestamp'>{item.stamp}</p>
                </div>
            ))}
        </div>
    )
}