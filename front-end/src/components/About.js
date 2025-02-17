import React from "react";
import { useNavigate } from "react-router-dom";
import food from "../assets/anhHome.JPG";

function About() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/menu");
  };
  return (
    <section className="container mt-4 pt-10 bg-gradient" style={{ background: "linear-gradient(to right, #ec4899, #3b82f6)" }}>
      <div className="row align-items-center">
        {/* Left Section */}
        <div className="col-md-6 text-start">
          {/* Title */}
          <h1 className="mt-4 fw-bold text-danger">Hôm Nay Ăn Gì?</h1>
          {/* Description */}
          <p className="mt-3 text-secondary">
            Không biết hôm nay ăn gì? Hãy để FoodTrip giúp bạn!
            <br />
            Với tính năng thông minh, chúng tôi gợi ý món ăn phù hợp cho bạn.
            <br />
            Chỉ vài thao tác, bạn sẽ khám phá địa điểm ăn uống lý tưởng cùng
            FoodTrip.
          </p>
          {/* Order Button Section */}
          <div className="mt-4 d-flex gap-3">
            <div class="d-flex flex-column w-43 max-md:w-100">
              <button
                onClick={handleButtonClick}
                class="btn btn-danger fw-bold text-white text-2xl py-3 px-4 my-auto rounded-xl min-vh-25 
           hover-bg-danger-dark focus-outline-none focus-ring-2 focus-ring-danger-light 
           active-scale-95 active-bg-danger transition-transform duration-100 max-md:mt-3"
              >
                Tìm Món Ngay
              </button>
            </div>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="col-md-6 text-center">
          <img
            src={food}
            alt="Món ăn ngon"
            className="img-fluid rounded w-75" // Giảm kích thước ảnh nếu cần
          />
        </div>
      </div>
    </section>
  );
}

export default About;
