import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-2">
          <nav className="nav flex-column nav-pills">
            <Link className="nav-link" to="/admin/verify-accounts">Account List</Link>
            <Link className="nav-link" to="/admin/billing">Bill History</Link>
          </nav>
        </div>
        <div className="col-md-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;