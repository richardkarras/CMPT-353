import './App.css';

import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import {useState} from 'react';

import {Landing} from './Landing';
// import {ShowPosts} from './ShowPosts';
// import {AddPosts} from './AddPosts';

function App() {   
  // const [getList, setList] = useState([]);
  // if(getList.length <1) {fetch('http://localhost:81/alldata').then(response => response.json()).then(response => setList(response))};
  const Layout = () => {
    return (
      <>
        <Outlet/>
      </>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <p>Homepage</p>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Landing/>}>
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </header>
    </div>
  );
}

export default App;
