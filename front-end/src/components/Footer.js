<<<<<<< HEAD
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
=======
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import logo from "../assets/LOGOBIG.png";

const Footer = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendFeedback = () => {
    const mailtoLink = `mailto:foodtrip2vn@gmail.com?subject=Phản hồi từ ${formData.name}&body=Tên: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ASố điện thoại: ${formData.phone}%0D%0ANội dung: ${formData.message}`;
    window.location.href = mailtoLink;
  };

  return (
    <footer className="bg-white text-dark py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <img src={logo} alt="Logo FoodTripVn" className="img-fluid mb-3" style={{ maxWidth: "100px" }} />
            <p>
              Được sinh ra từ sự hoàn hảo và cảm hứng, chúng tôi mang đến trải
              nghiệm ẩm thực độc đáo và hấp dẫn.
            </p>
            <p>
              Mỗi món ăn đều kể một câu chuyện, từ quy trình chuẩn bị đến cách
              phục vụ, đều được thực hiện với tâm huyết và đam mê.
            </p>
          </Col>

          <Col md={3} className="mb-4 offset-md-2">
            <h5>Liên hệ</h5>
            <p>Địa chỉ: Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, huyện Thạch Thất, Hà Nội.</p>
            <p>
              Điện thoại: <a href="tel:0949602XXXX" className="text-dark" style={{ textDecoration: "none" }}>0949.602.XXXX</a>
            </p>
            <p>
              Email: <a href="mailto:foodtrip2vn@gmail.com" className="text-dark" style={{ textDecoration: "none" }}>foodtrip2vn@gmail.com</a>
            </p>
            <Button variant="primary" className="mt-2" onClick={handleShow}>
              Gửi phản hồi
            </Button>
          </Col>

          <Col md={3} className="mb-4">
            <h5>Kết nối với chúng tôi</h5>
            <div className="d-flex gap-3">
              <a href="https://www.facebook.com/yourpage" className="text-dark" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="https://www.instagram.com/yourpage" className="text-dark" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.twitter.com/yourpage" className="text-dark" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Đam mê ẩm thực được truyền tải qua từng món ăn, từng chi tiết nhỏ nhất.
            </p>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="text-center">
            <p className="mb-0">
              © Bản quyền {new Date().getFullYear()} thuộc về FoodTripVn Inc. Đã đăng ký bản quyền.
            </p>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Gửi phản hồi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên của bạn</Form.Label>
              <Form.Control type="text" name="name" placeholder="Nhập tên của bạn" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" placeholder="Nhập email" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control type="text" name="phone" placeholder="Nhập số điện thoại" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung phản hồi</Form.Label>
              <Form.Control as="textarea" name="message" rows={3} placeholder="Nhập phản hồi của bạn" onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSendFeedback}>
            Gửi phản hồi
          </Button>
        </Modal.Footer>
      </Modal>
    </footer>
  );
};
>>>>>>> main

export default Footer;
