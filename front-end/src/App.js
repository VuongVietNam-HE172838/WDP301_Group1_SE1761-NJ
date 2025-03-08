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
import PaymentSuccess from './components/PaymentSuccess';
import './App.css';
import Intro from './components/Intro';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import QR from './components/QR';
import ConfirmOrder from './components/ConfirnOrder';
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
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/payments" element={<QR/>} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          {/* <Route path='*' element={<h1>Not Found</h1>} /> */}
          <Route path='/success' element={<PaymentSuccess/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;