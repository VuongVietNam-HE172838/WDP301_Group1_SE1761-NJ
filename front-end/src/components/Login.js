import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import loginBanner2 from "../assets/auth4.png";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row shadow-lg rounded overflow-hidden border bg-white mx-auto" style={{ maxWidth: "100%", width: "750px" }}>
        {/* Left Section: Banner */}
        <div className="d-none d-lg-block col-lg-7 p-0">
          <img src={loginBanner2} alt="Login Banner" className="img-fluid w-100 h-100" />
        </div>

        {/* Right Section: Login Form */}
        <div className="col-12 col-lg-5 p-4 d-flex flex-column justify-content-center">
          <p className="text-center text-muted fs-5 mt-3">Chào mừng trở lại!</p>

          {/* Email Field */}
          <div className="mt-3">
            <label className="form-label fw-bold">Địa chỉ Email</label>
            <input type="email" className="form-control" required />
          </div>

          {/* Password Field */}
          <div className="mt-3">
            <label className="form-label fw-bold">Mật khẩu</label>
            <div className="input-group">
              <input type={showPassword ? "text" : "password"} className="form-control" required />
              <span className="input-group-text bg-white border" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                {showPassword ? <IconEye size={18} /> : <IconEyeOff size={18} />}
              </span>
            </div>
            <a href="/forgetpassword" className="d-block text-end text-muted small mt-2">
              Quên mật khẩu?
            </a>
          </div>

          {/* Login Button */}
          <div className="mt-4">
            <button className="btn btn-danger w-100 fw-bold">Đăng nhập</button>
          </div>

          {/* Google Login Button */}
          <div className="mt-3">
            <button className="btn btn-outline-dark w-100 fw-bold d-flex align-items-center justify-content-center">
              <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="me-2" />
              Đăng nhập với Google
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-3 text-center">
            <a href="/register" className="text-muted small">
              Chưa có tài khoản? <span className="text-primary">Đăng ký ngay</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
