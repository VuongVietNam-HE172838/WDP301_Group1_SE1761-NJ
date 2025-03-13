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
import AccountList from './components/AccountList';
import BillHistory from './components/BillHisory';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import QR from './components/QR';
import ConfirmOrder from './components/ConfirnOrder';
import AdminDashboard from './components/AdminDashboard';
import ManageBlog from './components/ManageBlog';
import Cart from './components/Cart';
import StaffOrder from './components/StaffOrder';
import ConfirmOrderStaff from './components/ConfirmOrder';
import CartStaff from './components/CartStaff';
import UserProfile from './components/UserProfile';
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
          <Route path="/admin/manage-blog" element={<ManageBlog />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/payments" element={<QR/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cartStaff" element={<CartStaff />} />
          <Route path="/staff-order" element={<StaffOrder />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/confirm-orderStaff" element={<ConfirmOrderStaff />} />
          <Route path='*' element={<h1>Not Found</h1>} />
          <Route path='/success' element={<PaymentSuccess/>} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;