import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LOGOBIG.png";
import { FaUserCircle } from "react-icons/fa"; // Icon user

function Header() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accountDetail");
    setToken(null);
    navigate("/login");
  };

  const navItems = ["TRANG CHỦ", "MENU", "ĐẶT HÀNG", "GIỚI THIỆU", "TIN TỨC"];
  const navItemLinks = ["home", "menu", "order", "introduction", "blog"];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Company logo" width="80" className="d-inline-block align-top" />
          </Link>

          {/* Toggle Button for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto gap-4">
              {navItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  <Link className="nav-link fw-semibold text-dark position-relative" to={`/${navItemLinks[index]}`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            {/* User Menu */}
            <div className="d-flex gap-3 align-items-center">
              {token ? (
                <div className="dropdown">
                  {/* Profile Icon */}
                  <button
                    className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUserCircle className="fs-4 me-2" /> Tài khoản
                  </button>

                  {/* Dropdown Menu */}
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Chi tiết Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/cart">
                        Giỏ hàng
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/transaction-history">
                        Lịch sử giao dịch
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <button className="btn btn-outline-secondary text-dark hover-effect">Đăng nhập</button>
                  </Link>
                  <Link to="/register">
                    <button className="btn btn-danger text-white">Đăng ký</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: "70px" }}></div>
      <style>
        {`
          .nav-link {
            position: relative;
            transition: color 0.3s ease-in-out;
          }
          .nav-link::after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 0;
            height: 2px;
            background-color: red;
            transition: all 0.3s ease-in-out;
            transform: translateX(-50%);
          }
          .nav-link:hover {
            color: red !important;
          }
          .nav-link:hover::after {
            width: 100%;
          }
          .hover-effect:hover {
            background-color: white !important;
            color: red !important;
            border-color: red !important;
          }
        `}
      </style>
    </>
  );
}

export default Header;
