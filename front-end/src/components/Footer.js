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
    <footer className="bg-white text-dark py-5" style={{ borderTop: "1px solid #dee2e6" }}>
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

export default Footer;