import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ManageCategory from './ManageCategory';
import ManageDish from './ManageDish';
import ManageBlog from './ManageBlog';

import AdminStatistics from './AdminStatistics';
import ManageAccounts from './ManageAccounts';

import Feedback from './Feedback';

import '../AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("statistics");

  const renderContent = () => {
    switch (activeTab) {
      case "dish":
        return <ManageDish />;
      case "category":
        return <ManageCategory />;
      case "blog":
        return <ManageBlog />;
      case "statistics":
        return <AdminStatistics />;
      case "accounts":
        return <ManageAccounts />;
      case "feedback":
        return <Feedback />;
      default:
        return <AdminStatistics />;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav
          className="col-md-2 d-none d-md-block bg-light sidebar"
          style={{ position: 'fixed', top: 0, left: 0, height: '100vh', paddingTop: '100px' }}
        >
          <div className="position-sticky">
            <h4 className="text-center">Admin</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeTab === "statistics" ? "active" : ""}`}
                  onClick={() => setActiveTab("statistics")}
                >
                  <i className="bx bxs-user"></i> Thống kê Doanh Thu
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeTab === "accounts" ? "active" : ""}`}
                  onClick={() => setActiveTab("accounts")}
                >
                  <i className="bx bxs-user"></i> Quản lí Tài khoản
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeTab === "category" ? "active" : ""}`}
                  onClick={() => setActiveTab("category")}
                >
                  <i className="bx bxs-box"></i> Quản lí Danh Mục
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeTab === "dish" ? "active" : ""}`}
                  onClick={() => setActiveTab("dish")}
                >
                  <i className="bx bxs-food"></i> Quản lí Món ăn
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeTab === "blog" ? "active" : ""}`}
                  onClick={() => setActiveTab("blog")}
                >

                  <i className="bx bxs-news"></i> Quản lí Blog

                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeTab === "feedback" ? "active" : ""}`}
                  onClick={() => setActiveTab("feedback")}
                >

                  <i className="bx bxs-news"></i> FeedBack

                </Link>
              </li>
            </ul>
          </div>
        </nav>


        {/* Main content */}
        <main
          className="col-md-10 offset-md-2"
          style={{ paddingTop: '120px', paddingBottom: '40px' }}
        >
          {renderContent()}


        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
