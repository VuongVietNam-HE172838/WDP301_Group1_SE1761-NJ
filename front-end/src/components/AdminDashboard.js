import React from 'react';
import { Link } from 'react-router-dom';
import ManageCategory from './ManageCategory';
import ManageDish from './ManageDish';
import '../AdminDashboard.css';
import ManageBlog from './ManageBlog';

const AdminDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav id="sidebar" className="col-md-2 d-md-block bg-light sidebar" style={{ marginTop: "100px" }}>
          <div className="position-sticky">
            <h4 className="text-center">Admin</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link" to="/admin/verify-accounts">
                  <i className='bx bxs-user'></i> Danh sách tài khoản
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/billing">
                  <i className='bx bxs-receipt'></i> Danh sách hóa đơn
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/manage-category">
                  <i className='bx bxs-box'></i> Manage Category
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/manage-dish">
                  <i className='bx bxs-food'></i> Manage Dish
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/manage-blog">
                  <i className='bx bxs-food'></i> Manage Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/reports">
                  <i className='bx bxs-report'></i> Báo cáo
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-10 ms-sm-auto px-md-4">
          {/* Hiển thị component dựa trên route */}
          <ManageDish />
          <ManageCategory />
          <ManageBlog/>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
