import React from 'react';
import './style/ShowPosts.css';
import { ShowPost } from './components/ShowPost';
import { ShowResponse } from './components/ShowResponse'
import {Link} from 'react-router-dom';

export const ShowPosts = ({ posts, responses}) => {
  return (
    <>
      {posts?.map((item) => (
        <div key={item._id}>
          <h2>{item.topic}</h2>
          <p id='type'>{item.type}</p>
          <p id='data'>{item.data}</p>
          <p id='timestamp'>{item.stamp}</p>
          <ShowResponse key={`showresponse-${item._id}`} parentId={item._id} responses={responses} />
          <button id="addReply">Add Reply</button>
        </div>
      ))}
    </>
  );
};