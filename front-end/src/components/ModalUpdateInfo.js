import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Image, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ModalUpdateInfo({ show, handleClose, userInfo, onUpdate  }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    birth_of_date: "",
    id_number: "",
    gender: "",
    address: "",
    profile_picture: "",
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (userInfo) {
      setFormData({
        full_name: userInfo.full_name || "",
        email: userInfo.email || "",
        phone_number: userInfo.phone_number || "",
        birth_of_date: userInfo.birth_of_date || "",
        id_number: userInfo.id_number || "",
        gender: userInfo.gender || "",
        address: userInfo.address || "",
        profile_picture: userInfo.profile_picture || "",
      });
      setPreviewImage(userInfo.profile_picture || "");
    }
  }, [userInfo, show]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_picture" && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile_picture: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("Bạn chưa đăng nhập");
      return;
    }
  
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });
  
      const response = await fetch("http://localhost:9999/api/account/information", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      const data = await response.json();
      setLoading(false);
  
      if (response.ok) {
        toast.success("Cập nhật thông tin thành công!");
        handleClose();
        if (typeof onUpdate === "function") {
          onUpdate(); // Gọi callback để cập nhật thông tin người dùng
        }
      } else {
        toast.error(data.message || "Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const renderFormGroup = (label, key, type = "text") => {
    if (key === "gender") {
      return (
        <Form.Group className="mb-3" controlId={key}>
          <Form.Label>{label}</Form.Label>
          <Form.Select name={key} value={formData[key] || ""} onChange={handleChange}>
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </Form.Select>
        </Form.Group>
      );
    }
  
    return (
      <Form.Group className="mb-3" controlId={key}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          name={key}
          value={formData[key] || ""}
          onChange={handleChange}
        />
      </Form.Group>
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cập Nhật Thông Tin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            {renderFormGroup("Họ và tên", "full_name")}
            <Form.Group className="mb-3" controlId="email">
  <Form.Label>Email</Form.Label>
  <Form.Control
    type="email"
    name="email"
    value={formData.email || ""}
    readOnly // Ngăn chặn người dùng chỉnh sửa
  />
</Form.Group>

            {renderFormGroup("Số điện thoại", "phone_number")}
            {renderFormGroup("Ngày sinh", "birth_of_date","date")}
            {renderFormGroup("Số CMND", "id_number")}
          </Col>
          <Col md={6}>
            {renderFormGroup("Giới tính", "gender")}
            {renderFormGroup("Địa chỉ", "address")}
            <div className="text-center">
            <Image
  src={previewImage || "https://via.placeholder.com/150"}
  roundedCircle
  fluid
  className="mb-3"
  style={{ width: "200px", height: "200px" }}
/>

              <Form.Control
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : "Lưu"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}