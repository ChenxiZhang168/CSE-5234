import logo from './logo.svg';
import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ViewOrder from './components/viewOrder';
import ViewConfirmatoin from './components/viewConfirmation';

function App() {
  return (
    <div className="App">
    <Router>
      <div className='content'>
        <Routes>
          <Route path='/purchase/viewOrder' element={<ViewOrder/>} />
          <Route path='/purchase/viewConfirmation' element={<ViewConfirmatoin/>} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
