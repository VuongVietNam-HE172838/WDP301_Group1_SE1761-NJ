import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundEmail from '../assets/email.jpg'; // Nhập ảnh background

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      fetch(`${process.env.REACT_APP_URL_API_BACKEND}/authen/verify-email?token=${token}`)
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            toast.success(data.message);
            setTimeout(() => {
              navigate('/login');
            }, 3000); // Chuyển hướng sau 3 giây
          } else {
            toast.error('Xác nhận email thất bại.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          toast.error('Xác nhận email thất bại.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundImage: `url(${backgroundEmail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <ToastContainer />
    </div>
  );
};

export default VerifyEmail;