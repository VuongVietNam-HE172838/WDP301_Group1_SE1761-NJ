import React from "react";
import logo from "../assets/LOGOBIG.png";

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <a href="/" aria-label="Trang chủ" title="Trang chủ" className="flex items-center">
              <img src={logo} alt="Logo công ty" className="w-40 h-auto" />
              <span className="ml-2 text-xl font-bold uppercase">FoodTripVN</span>
            </a>
            <p className="mt-4 text-sm">
              Mang đến trải nghiệm ẩm thực độc đáo với những món ăn được chế biến tỉ mỉ và đầy cảm hứng.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Liên hệ</h2>
            <ul className="text-sm space-y-2">
              <li>
                <strong>Điện thoại:</strong> <a href="tel:0949602xxx" className="hover:text-red-500">0949.602.xxx</a>
              </li>
              <li>
                <strong>Email:</strong> <a href="mailto:foodtrip.exe201@gmail.com" className="hover:text-red-500">foodtrip.exe201@gmail.com</a>
              </li>
              <li>
                <strong>Địa chỉ:</strong> <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, Hà Nội</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Mạng xã hội</h2>
            <div className="flex space-x-4">
              <a href="/" aria-label="Facebook" className="text-gray-600 hover:text-blue-600">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="/" aria-label="Instagram" className="text-gray-600 hover:text-pink-500">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="/" aria-label="Twitter" className="text-gray-600 hover:text-blue-400">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Liên kết nhanh</h2>
            <ul className="text-sm space-y-2">
              <li><a href="/faq" className="hover:text-red-500">Câu hỏi thường gặp</a></li>
              <li><a href="/privacy" className="hover:text-red-500">Chính sách bảo mật</a></li>
              <li><a href="/terms" className="hover:text-red-500">Điều khoản &amp; Điều kiện</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-4 text-center text-sm text-gray-500">
          © 2022 FoodTripVN Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
