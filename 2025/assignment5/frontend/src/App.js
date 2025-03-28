import './App.css';
import Router from './components/Router'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {   
  const [getAll, setAll] = useState([]);

  useEffect( () => {
    let processing = true;
    axFetch(processing)
    return () => {
      processing = false;
    }
  },[])

  const axFetch = async(processing) => {
    await axios.get('http://localhost:81/alldata')
    .then(res => {
      if (processing) {
        console.log(res.data);
        setAll(res.data);
      }
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Assignment 5</h1>
          <Router getAll={getAll}/>
        </div>
      </header>
    </div>
  );
}

export default App;