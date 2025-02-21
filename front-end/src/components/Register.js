import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import registerBanner from "../assets/auth4.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validate = () => {
    const newErrors = {};
  
    // Kiểm tra Họ và Tên
    if (!fullName.trim()) newErrors.fullName = 'Họ và Tên là bắt buộc';
  
    // Kiểm tra Email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Địa chỉ Email là bắt buộc';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Địa chỉ Email không hợp lệ';
    }
  
    // Kiểm tra Số điện thoại (10 số)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải có 10 chữ số';
    }
  
    // Kiểm tra Mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 12 ký tự, gồm 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt';
    }
  
    // Kiểm tra Mật khẩu nhập lại
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }
  
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach(error => {
        toast.error(error);
      });
    } else {
      try {
        // Gửi dữ liệu đăng ký đến back-end
        const response = await fetch('http://localhost:9999/api/authen/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName,
            email,
            phoneNumber,
            password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Đăng ký thất bại');
        }

        const data = await response.json();
        console.log(data);

        // Reset form
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        toast.success(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    try {
      // Gửi credential đến back-end để xác thực
      const res = await fetch(`http://localhost:9999/api/authen/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId: credential }),
      });

      if (!res.ok) {
        throw new Error('Google register failed');
      }

      const data = await res.json();
      console.log(data);

      // Lưu thông tin vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('accountDetail', JSON.stringify(data.accountDetail));

      // Chuyển hướng người dùng về path "/"
      window.location.href = '/';
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google register failed', error);
    toast.error('Google register failed');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row shadow-lg rounded overflow-hidden border bg-white mx-auto" style={{ maxWidth: "100%", width: "1000px", marginTop: "50px" }}>
          {/* Left Section: Banner */}
          <div className="d-none d-lg-block col-lg-7 p-0">
            <img src={registerBanner} alt="Register Banner" className="img-fluid w-100 h-100" />
          </div>

          {/* Right Section: Register Form */}
          <div className="col-12 col-lg-5 p-4 d-flex flex-column justify-content-center">
            <p className="text-center text-muted fs-5 mt-3">Tạo tài khoản mới</p>

            <form onSubmit={handleRegister}>
              {/* Full Name Field */}
              <div className="mt-3">
                <label className="form-label fw-bold">Họ và Tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email Field */}
              <div className="mt-3">
                <label className="form-label fw-bold">Địa chỉ Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Phone Number Field */}
              <div className="mt-3">
                <label className="form-label fw-bold">Số điện thoại</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <img src="https://img.icons8.com/color/24/000000/vietnam-circular.png" alt="Vietnam Flag" style={{ width: '20px', marginRight: '5px' }} />
                    +84
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
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
                  />
                  <span className="input-group-text bg-white border" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                    {showPassword ? <IconEye size={18} /> : <IconEyeOff size={18} />}
                  </span>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mt-3">
                <label className="form-label fw-bold">Nhập lại mật khẩu</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span className="input-group-text bg-white border" onClick={toggleConfirmPasswordVisibility} style={{ cursor: "pointer" }}>
                    {showConfirmPassword ? <IconEye size={18} /> : <IconEyeOff size={18} />}
                  </span>
                </div>
              </div>

              {/* Register Button */}
              <div className="mt-4">
                <button type="submit" className="btn btn-danger w-100 fw-bold">Đăng ký</button>
              </div>
            </form>

            {/* Google Register Button */}
            <div className="mt-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                className="btn btn-outline-dark w-100 fw-bold d-flex align-items-center justify-content-center"
              />
            </div>

            {/* Login Link */}
            <div className="mt-3 text-center">
              <a href="/login" className="text-muted small">
                Đã có tài khoản? <span className="text-primary">Đăng nhập ngay</span>
              </a>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;