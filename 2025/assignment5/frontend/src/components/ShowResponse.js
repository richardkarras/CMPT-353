import React from 'react';
// import './components/ShowResponses.css';

export const ShowResponse = ({parentId,responses}) => {
return (
    <>
        {responses?.filter(item => item.parentId === parentId).map((item) =>
            <div key={item.id}>
                <p id='type'>{item.type}</p>
                <p id='data'>{item.data}</p>
                <p id='timestamp'>{item.stamp}</p>
            </div>
        )}
    </>
);

}