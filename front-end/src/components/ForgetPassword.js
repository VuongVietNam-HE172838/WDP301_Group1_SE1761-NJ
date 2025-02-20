
import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import registerBanner2 from "../assets/auth4.png"; // Đảm bảo đường dẫn hình ảnh đúng

const ForgetPassword = () => {
  const [step, setStep] = useState("email"); // Các bước: 'email', 'otp', 'resetPassword', 'success'
  const [email, setEmail] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Hook để điều hướng

  // Hàm sinh OTP ngẫu nhiên
  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // OTP 6 chữ số
    return otp;
  };

  // Hàm xử lý gửi OTP
  const handleSendOTP = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    // Kiểm tra định dạng email đơn giản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Vui lòng nhập một địa chỉ email hợp lệ.");
      return;
    }
    const otp = generateOTP();
    setGeneratedOTP(otp);
    console.log(`OTP đã được gửi tới email ${email}: ${otp}`); // Trong thực tế, OTP sẽ được gửi qua email
    setMessage("Đã gửi OTP đến email của bạn.");
    setStep("otp");
  };

  // Hàm xử lý xác thực OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (enteredOTP === generatedOTP) {
      setMessage("OTP hợp lệ. Bạn có thể đổi mật khẩu.");
      setStep("resetPassword");
    } else {
      setError("OTP không hợp lệ. Vui lòng thử lại.");
    }
  };

  // Hàm xử lý đổi mật khẩu
  const handleResetPassword = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    // Ở đây, chúng ta sẽ chỉ mô phỏng việc đổi mật khẩu thành công
    setMessage("Đổi mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ.");
    setStep("success");
    // Reset các trạng thái
    setEmail("");
    setGeneratedOTP("");
    setEnteredOTP("");
    setPassword("");
    setConfirmPassword("");
  };

  // Hàm điều hướng về trang chủ
  const handleBackToHome = () => {
    navigate("/"); // Redirect về trang chủ
  };

  // Hàm điều hướng tới trang đăng nhập
  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row shadow-lg rounded overflow-hidden border bg-white mx-auto" style={{ maxWidth: "100%", width: "900px"}}>
      {/* Left Section: Banner */}
        <div className="d-none d-lg-block col-lg-7 p-0">
                  <img src={registerBanner2} alt="Login Banner" className="img-fluid w-100 h-100" />
                </div>

        {/* Right Section: Forgot Password Form */}
        <div className="col-12 col-lg-5 p-4 d-flex flex-column justify-content-center">
          <p className="text-center text-muted fs-5 mt-3">Quên mật khẩu?</p>

          {/* Step: Nhập Email */}
          {step === "email" && (
            <form onSubmit={handleSendOTP} className="mt-4">
              <div className="mb-3">
                <label className="form-label">
                  Địa chỉ Email <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div className="mt-3">
                <button type="submit" className="btn btn-danger w-100">
                  Gửi OTP
                </button>
              </div>

              <div className="mt-3 text-center">
                <a href="/login" className="text-muted small">
                  Đã có tài khoản? <span className="text-primary">Đăng nhập ngay</span>
                </a>
              </div>
            </form>
          )}

          {/* Step: Nhập OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="mt-4">
              <div className="mb-3">
                <label className="form-label">
                  OTP <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  required
                  value={enteredOTP}
                  onChange={(e) => setEnteredOTP(e.target.value)}
                  placeholder="Nhập OTP đã nhận"
                />
              </div>

              <div className="mt-3">
                <button type="submit" className="btn btn-danger w-100">
                  Xác Thực OTP
                </button>
              </div>

              <div className="mt-2">
                <button type="button" onClick={() => setStep("email")} className="btn btn-secondary w-100">
                  Quay lại
                </button>
              </div>

              <div className="mt-3 text-center">
                <a href="/login" className="text-muted small">
                  Đã có tài khoản? <span className="text-primary">Đăng nhập ngay</span>
                </a>
              </div>
            </form>
          )}

          {/* Step: Đổi Mật Khẩu */}
          {step === "resetPassword" && (
            <form onSubmit={handleResetPassword} className="mt-4">
              {/* Mật khẩu mới */}
              <div className="mb-3 position-relative">
                <label className="form-label">
                  Mật Khẩu Mới <span className="text-danger">*</span>
                </label>
                <div className="position-relative">
                  <input
                    className="form-control pe-5"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <div className="position-absolute top-50 end-0 me-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                  </div>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="mb-3 position-relative">
                <label className="form-label">
                  Xác Nhận Mật Khẩu <span className="text-danger">*</span>
                </label>
                <div className="position-relative">
                  <input
                    className="form-control pe-5"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                  />
                  <div className="position-absolute top-50 end-0 me-3 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <button type="submit" className="btn btn-danger w-100">
                  Đổi Mật Khẩu
                </button>
              </div>

              <div className="mt-2">
                <button type="button" onClick={() => setStep("otp")} className="btn btn-secondary w-100">
                  Quay lại
                </button>
              </div>

              <div className="mt-3 text-center">
                <a href="/login" className="text-muted small">
                  Đã có tài khoản? <span className="text-primary">Đăng nhập ngay</span>
                </a>
              </div>
            </form>
          )}

          {/* Step: Thành Công */}
          {step === "success" && (
            <div className="text-center mt-4">
              <p className="text-success">{message}</p>
              <button
                onClick={handleGoToLogin}
                className="btn btn-danger w-100 mt-3"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}

          {/* Hiển thị thông báo lỗi hoặc thành công */}
          {message && <p className="text-success text-center mt-4">{message}</p>}
          {error && <p className="text-danger text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
