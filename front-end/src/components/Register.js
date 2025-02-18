import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import registerBanner from "../assets/auth4.png";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row shadow-lg rounded overflow-hidden border bg-white mx-auto" style={{ maxWidth: "100%", width: "1000px" , marginTop:"50px"}}>
        {/* Left Section: Banner */}
        <div className="d-none d-lg-block col-lg-7 p-0">
          <img src={registerBanner} alt="Register Banner" className="img-fluid w-100 h-100" />
        </div>

        {/* Right Section: Register Form */}
        <div className="col-12 col-lg-5 p-4 d-flex flex-column justify-content-center">
          <p className="text-center text-muted fs-5 mt-3">Tạo tài khoản mới</p>

          {/* Full Name Field */}
          <div className="mt-3">
            <label className="form-label fw-bold">Họ và Tên</label>
            <input type="text" className="form-control" required />
          </div>

          {/* Username Field */}
          <div className="mt-3">
            <label className="form-label fw-bold">Tên tài khoản</label>
            <input type="text" className="form-control" required />
          </div>

          {/* Email Field */}
          <div className="mt-3">
            <label className="form-label fw-bold">Địa chỉ Email</label>
            <input type="email" className="form-control" required />
          </div>

          {/* Phone Number Field */}
          <div className="mt-3">
            <label className="form-label fw-bold">Số điện thoại</label>
            <input type="tel" className="form-control" required />
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
          </div>

          {/* Confirm Password Field */}
          <div className="mt-3">
            <label className="form-label fw-bold">Nhập lại mật khẩu</label>
            <div className="input-group">
              <input type={showConfirmPassword ? "text" : "password"} className="form-control" required />
              <span className="input-group-text bg-white border" onClick={toggleConfirmPasswordVisibility} style={{ cursor: "pointer" }}>
                {showConfirmPassword ? <IconEye size={18} /> : <IconEyeOff size={18} />}
              </span>
            </div>
          </div>

          {/* Register Button */}
          <div className="mt-4">
            <button className="btn btn-danger w-100 fw-bold">Đăng ký</button>
          </div>

          {/* Google Register Button */}
          <div className="mt-3">
            <button className="btn btn-outline-dark w-100 fw-bold d-flex align-items-center justify-content-center">
              <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="me-2" />
              Đăng ký với Google
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-3 text-center">
            <a href="/login" className="text-muted small">
              Đã có tài khoản? <span className="text-primary">Đăng nhập ngay</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
