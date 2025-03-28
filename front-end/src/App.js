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
import TransactionHistory from './components/TransactionHistory';
import OrderHistory from './components/OrderHistory';

import AdminStatistics from './components/AdminStatistics';
import ManageAccounts from './components/ManageAccounts';

import Feedback from './components/Feedback';

const getRole = () => {
  const accountDetail = JSON.parse(localStorage.getItem('accountDetail'));
  return accountDetail?.role || null;
};

const RoleBasedRoute = ({ role, children }) => {
  const userRole = getRole();
  if (userRole === role) {
    return children;
  }
  return <h1 className="access-denied">Access Denied</h1>;  
};

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
          <Route
            path="/admin"
            element={
              <RoleBasedRoute role="ADMIN">
                <AdminDashboard />
              </RoleBasedRoute>
            }
          >
            <Route path="verify-accounts" element={<AccountList />} />
            <Route path="billing" element={<BillHistory />} />
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="manage-account" element={<ManageAccounts />} />
          </Route>
          <Route
            path="/admin/manage-blog"
            element={
              <RoleBasedRoute role="ADMIN">
                <ManageBlog />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <RoleBasedRoute role="ADMIN">
                <Feedback />
              </RoleBasedRoute>
            }
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/payments" element={<QR/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cartStaff" element={<CartStaff />} />
          <Route
            path="/staff-order"
            element={
              <RoleBasedRoute role="STAFF">
                <StaffOrder />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/confirm-orderStaff"
            element={
              <RoleBasedRoute role="STAFF">
                <ConfirmOrderStaff />
              </RoleBasedRoute>
            }
          />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path='*' element={<h1 className="access-denied">Not Found</h1>} />
          <Route path='/success' element={<PaymentSuccess/>} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;