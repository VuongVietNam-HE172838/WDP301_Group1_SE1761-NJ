// src/App.js
import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import About from './components/About';
import Footer from './components/Footer';
import Reviews from './components/Reviews';
import Login from './components/Login';
import Register from './components/Register';
import ForgetPassword from './components/ForgetPassword';
import VerifyEmail from './components/VerifyEmail';
import './App.css';
import Intro from './components/Intro';
import AdminDashboard from './components/AdminDashboard';
import AccountList from './components/AccountList';
import BillHistory from './components/BillHisory';

const App = () => {
  return (

    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/home" element={<About />} />
          <Route path="/" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/introduction" element={<Intro />} />
          <Route path="/verify-email" element={<VerifyEmail/>} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="verify-accounts" element={<AccountList />} />
            <Route path="billing" element={<BillHistory />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>

  );
};

export default App;