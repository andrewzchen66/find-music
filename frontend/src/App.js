import logo from './logo.svg';
import './App.css';
import Navbar from './components/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import Search from './pages/Search';
import PlaylistPage from './pages/playlist';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Col, Card, Dropdown} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from "axios";

// async function search 

function App() {
  // Fetches Spotify Access Token on render
  useEffect(() => {
    try{
      console.log("Fetching access tokens");
      const tok = axios.get("http://localhost:8080/get-token")
    } catch(error) {
      console.log("Error fetching data: ", error)
    }
  }, [])

  

  return (
    <div className="App">
      <Router >
            <Navbar />
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/search' element={<Search />} />
                <Route path='/playlist' element={<PlaylistPage />} />
            </Routes>
      </Router>
    </div>
  );
}

export default App;
