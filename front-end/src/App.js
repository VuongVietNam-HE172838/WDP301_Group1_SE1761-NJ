// src/App.js
import React from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <div>
      <Header />
      <About />
      <Contact />

    </div>
  );
};

export default App;
