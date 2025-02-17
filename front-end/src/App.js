// src/App.js
import React from 'react';
<<<<<<< HEAD
import Header from './components/Header';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
=======
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import About from './components/About';
import Footer from './components/Footer';
import Reviews from './components/Reviews';
import Login from './components/Login';
>>>>>>> main
import './App.css';

const App = () => {
  return (
<<<<<<< HEAD
    <div>
      <Header />
      <About />
      <Contact />

    </div>
=======
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
        <Footer />
      </div>
    </Router>
>>>>>>> main
  );
};

export default App;