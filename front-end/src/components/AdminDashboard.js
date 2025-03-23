import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import ManageCategory from './ManageCategory';
import ManageDish from './ManageDish';
import ManageBlog from './ManageBlog';
import Feedback from './Feedback';

import '../AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("");

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav id="sidebar" className="col-md-2 d-md-block bg-light sidebar" style={{ marginTop: "100px" }}>
          <div className="position-sticky">
            <h4 className="text-center">Admin</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${activeTab === "accounts" ? "active" : ""}`} 
                  
                  onClick={() => setActiveTab("accounts")}
                >
                  <i className='bx bxs-user'></i> Manage Account
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${activeTab === "billing" ? "active" : ""}`} 
                 
                  onClick={() => setActiveTab("billing")}
                >
                  <i className='bx bxs-receipt'></i> Danh sách hóa đơn
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${activeTab === "category" ? "active" : ""}`} 
                  
                  onClick={() => setActiveTab("category")}
                >
                  <i className='bx bxs-box'></i> Manage Category
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${activeTab === "dish" ? "active" : ""}`} 
                 
                  onClick={() => setActiveTab("dish")}
                >
                  <i className='bx bxs-food'></i> Manage Dish
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${activeTab === "blog" ? "active" : ""}`} 
                  
                  onClick={() => setActiveTab("blog")}
                >
                  <i className='bx bxs-food'></i> Manage Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${activeTab === "feedback" ? "active" : ""}`} 
                  
                  onClick={() => setActiveTab("feedback")}
                >
                  <i className='bx bxs-food'></i> Feedback
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${activeTab === "reports" ? "active" : ""}`} 
                 
                  onClick={() => setActiveTab("reports")}
                >
                  <i className='bx bxs-report'></i> Báo cáo
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-10 ms-sm-auto px-md-4">
          {activeTab === "dish" && <ManageDish />}
          {activeTab === "category" && <ManageCategory />} 
          {/* {activeTab === "accounts" && <ManageAccount />} */}
          {/* {activeTab === "billing" && <ManageBill />}  */}
          {activeTab === "blog" && <ManageBlog />} 
          {activeTab === "feedback" && <Feedback />} 
          {/* {activeTab === "reports" && <Managereports />}  */}


        
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
