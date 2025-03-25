import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import registerBanner from "../assets/auth4.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Họ và Tên là bắt buộc';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Địa chỉ Email là bắt buộc';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Địa chỉ Email không hợp lệ';
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải có 9 chữ số (bỏ số 0 đầu)';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
    }

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
    setErrors(newErrors); // set lỗi để hiển thị dưới input

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/authen/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, phoneNumber, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Đăng ký thất bại');
        }

        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
        toast.success(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 5000); // Wait for 5 seconds before navigating
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    try {
      const res = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/authen/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google register failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('accountDetail', JSON.stringify(data.accountDetail));
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
          <div className="d-none d-lg-block col-lg-7 p-0">
            <img src={registerBanner} alt="Register Banner" className="img-fluid w-100 h-100" />
          </div>

          <div className="col-12 col-lg-5 p-4 d-flex flex-column justify-content-center">
            <p className="text-center text-muted fs-5 mt-3">Tạo tài khoản mới</p>
            <form onSubmit={handleRegister}>
              <div className="mt-3">
                <label className="form-label fw-bold">Họ và Tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && <div className="text-danger small">{errors.fullName}</div>}
              </div>

              <div className="mt-3">
                <label className="form-label fw-bold">Địa chỉ Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="text-danger small">{errors.email}</div>}
              </div>

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
                {errors.phoneNumber && <div className="text-danger small">{errors.phoneNumber}</div>}
              </div>

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
                {errors.password && <div className="text-danger small">{errors.password}</div>}
              </div>

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
                {errors.confirmPassword && <div className="text-danger small">{errors.confirmPassword}</div>}
              </div>

              <div className="mt-4">
                <button type="submit" className="btn btn-danger w-100 fw-bold">Đăng ký</button>
              </div>
            </form>

            <div className="mt-3">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
