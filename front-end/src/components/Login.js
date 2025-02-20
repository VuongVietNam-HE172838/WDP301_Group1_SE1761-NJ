import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginBanner2 from "../assets/auth4.png";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    // Gửi credential đến back-end để xác thực
    const res = await fetch(`http://localhost:9999/api/authen/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokenId: credential }),
    });
    const data = await res.json();
    // Xử lý phản hồi từ back-end
    console.log(data);

    // Lưu thông tin vào localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('accountDetail', JSON.stringify(data.accountDetail));

    // Chuyển hướng người dùng về path "/"
    window.location.href = '/';
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed', error);
    toast.error('Google login failed');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Gửi thông tin đăng nhập đến back-end để xác thực
    const res = await fetch(`http://localhost:9999/api/authen/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_name: userName, password: password }),
    });
    const data = await res.json();
    // Xử lý phản hồi từ back-end
    if (res.ok) {
      console.log(data);

      // Lưu thông tin vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('accountDetail', JSON.stringify(data.accountDetail));

      // Chuyển hướng người dùng về path "/"
      window.location.href = '/';
    } else {
      console.error('Login failed', data.message);
      toast.error(data.message); // Hiển thị thông báo lỗi dưới dạng popup
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
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
              <input
                type="email"
                className="form-control"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="mt-3">
              <label className="form-label fw-bold">Mật khẩu</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
              <button className="btn btn-danger w-100 fw-bold" onClick={handleLogin}>Đăng nhập</button>
            </div>

            {/* Google Login Button */}
            <div className="mt-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                className="btn btn-outline-dark w-100 fw-bold d-flex align-items-center justify-content-center"
              />
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
      <ToastContainer />
    </GoogleOAuthProvider>
  );
};

export default Login;