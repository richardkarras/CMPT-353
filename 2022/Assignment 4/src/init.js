import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  const handleInitClick = () => {
    fetch('/init')
      .then((response) => response.text())
      .then((data) => {
        setMessage(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <button onClick={handleInitClick}>Initialize Database</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
