import './App.css';
import React from 'react';
// import { Route, Router } from 'react-router-dom';

import Announcement from './components/announcement';
import Navigation from './components/navigation';

import Camera from './components/camera';


function App() {
  return (
    <>
      <Announcement />
      <Navigation />
      <Camera />
    </>
  );
}

export default App;
