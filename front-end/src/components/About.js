import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Import CSS của slick
import "slick-carousel/slick/slick-theme.css"; // Import theme CSS của slick
import food from "../assets/anhHome.JPG";

function About() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data.slice(0, 6)))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const handleButtonClick = () => {
    navigate("/menu");
  };

  const handleBlogClick = (id) => {
    navigate(`/blogs/${id}`);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Giảm xuống 3 để tránh lỗi tràn trên một số màn hình
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };
  const steps = [
    {
      number: 1,
      title: "Thực Đơn",
      description: "Chọn món ăn từ thực đơn chi tiết.",
    },
    {
      number: 2,
      title: "Phần ăn đã chọn",
      description: "Xem và chỉnh sửa món đã chọn.",
    },
    {
      number: 3,
      title: "Đặt hàng",
      description: 'Nhấn "Đặt hàng" để tiếp tục.',
    },
    {
      number: 4,
      title: "Thông tin giao hàng",
      description: "Điền thông tin giao hàng của bạn.",
    },
    {
      number: 5,
      title: "Xác nhận đơn hàng",
      description: 'Kiểm tra và nhấn "Đồng ý đặt hàng".',
    },
    {
      number: 6,
      title: "Xác nhận từ hệ thống",
      description: "Nhận thông báo xác nhận.",
    },
  ];
  
  return (
    <section className="container mt-5 pt-5 bg-gradient" style={{ background: "linear-gradient(to right, #ec4899, #3b82f6)" }}>
      <div className="row align-items-center">
        <div className="col-md-6 text-start">
          <h1 className="mt-4 fw-bold text-danger">Hôm Nay Ăn Gì?</h1>
          <p className="mt-3 text-secondary">
            Không biết hôm nay ăn gì? Hãy để FoodTrip giúp bạn!
            <br />
            Với tính năng thông minh, chúng tôi gợi ý món ăn phù hợp cho bạn.
            <br />
            Chỉ vài thao tác, bạn sẽ khám phá địa điểm ăn uống lý tưởng cùng FoodTrip.
          </p>
          <button
            onClick={handleButtonClick}
            className="btn btn-danger fw-bold text-white py-3 px-4 rounded-xl"
          >
            Tìm Món Ngay
          </button>
        </div>
        <div className="col-md-6 text-center">
          <img src={food} alt="Món ăn ngon" className="img-fluid rounded w-75" />
        </div>
      </div>

 {/* Hướng Dẫn Thao Tác */}
 <div className="mt-5">
      <h5 className="text-center fw-bold instruction-title text-danger">Hướng Dẫn Thao Tác</h5>
      <h3 className="text-center fw-bold instruction-subtitle mt-2 text-danger">
        Hãy để chúng tôi giúp bạn chọn món.
      </h3>
      <div className="row mt-5">
        {steps.map((step) => (
          <div key={step.number} className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
              <div
  className="step-number bg-danger text-white d-inline-flex align-items-center justify-content-center"
  style={{
    width: "40px",  // Giảm kích thước hình tròn
    height: "40px",
    borderRadius: "50%",
    fontSize: "16px", // Giảm cỡ chữ để cân đối
    fontWeight: "bold"
  }}
>
  {step.number}
</div>

                <h6 className="text-danger fw-bold">{step.title}</h6>
                <p className="text-secondary">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      <div className="mt-5">
        
        <h5 className="text-center fw-bold text-danger">Các Bài Viết Nổi Bật</h5>
        <h3 className="text-center fw-bold text-danger mt-2">Hãy để chúng tôi giúp bạn chọn món.</h3>

        <div className="mt-5">
          {blogs.length > 0 ? (
            <Slider {...settings}>
              {blogs.map((post) => (
                <div key={post._id} className="px-2">
                  <div
                    className="card h-100 border-0 shadow-sm"
                    onClick={() => handleBlogClick(post._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={post.img}
                      alt={post.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h6 className="card-title text-dark fw-bold">{post.title}</h6>
                      <p className="card-text text-secondary">
                        {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-white">Đang tải dữ liệu...</p>
          )}
        </div>
      </div>
      
    </section>
  );
}

export default About;
