import React, { useState } from 'react';
import ManageCategory from './ManageCategory';
import ManageDish from './ManageDish';
import '../AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav id="sidebar" className="col-md-2 d-md-block bg-light sidebar" style={{ marginTop: "100px" }}>
          <div className="position-sticky">
            <h4 className="text-center">Admin</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "accounts" ? "active" : ""}`}
                  onClick={() => setActiveTab("accounts")}
                >
                  <i className='bx bxs-user'></i> Manage Account
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "category" ? "active" : ""}`}
                  onClick={() => setActiveTab("category")}
                >
                  <i className='bx bxs-box'></i> Manage Category
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "dish" ? "active" : ""}`}
                  onClick={() => setActiveTab("dish")}
                >
                  <i className='bx bxs-food'></i> Manage Dish
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
                  onClick={() => setActiveTab("reports")}
                >
                  <i className='bx bxs-report'></i> Báo cáo
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-10 ms-sm-auto px-md-4">

          {activeTab === "dish" && <ManageDish />}
          {activeTab === "category" && <ManageCategory />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
