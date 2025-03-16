import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ModalChangePassword from "./ModalChangePassword";
import ModalUpdateInfo from "./ModalUpdateInfo";

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    birth_of_date: "",
    id_number: "",
    gender: "",
    address: "",
    profile_picture: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập để xem thông tin tài khoản!");
        return;
      }
      try {
        const response = await fetch("http://localhost:9999/api/account/information", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            full_name: data.full_name || "Chưa cập nhật",
            email: data.account_id.user_name || "Chưa cập nhật",
            phone_number: data.phone_number || "Chưa cập nhật",
            birth_of_date: data.birth_of_date
              ? new Date(data.birth_of_date).toLocaleDateString("vi-VN")
              : "Chưa cập nhật",
            id_number: data.id_number || "Chưa cập nhật",
            gender: data.gender === "Nam" ? "Nam" : data.gender === "Nữ" ? "Nữ" : "Khác",
            address: data.address || "Chưa cập nhật",
            profile_picture: data.profile_picture || "",
          });
        } else {
          toast.error("Không thể tải thông tin tài khoản!");
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
        toast.error("Có lỗi xảy ra khi lấy thông tin tài khoản!");
      }
    };
    fetchUserInfo();
  }, []);

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleUpdateModal = () => setUpdateModalOpen(!updateModalOpen);

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để xem thông tin tài khoản!");
      return;
    }
    try {
      const response = await fetch("http://localhost:9999/api/account/information", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo({
          full_name: data.full_name || "Chưa cập nhật",
          email: data.account_id.user_name || "Chưa cập nhật",
          phone_number: data.phone_number || "Chưa cập nhật",
          birth_of_date: data.birth_of_date
            ? new Date(data.birth_of_date).toLocaleDateString("vi-VN")
            : "Chưa cập nhật",
          id_number: data.id_number || "Chưa cập nhật",
          gender: data.gender === "Nam" ? "Nam" : data.gender === "Nữ" ? "Nữ" : "Khác",
          address: data.address || "Chưa cập nhật",
          profile_picture: data.profile_picture || "",
        });
      } else {
        toast.error("Không thể tải thông tin tài khoản!");
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
      toast.error("Có lỗi xảy ra khi lấy thông tin tài khoản!");
    }
  };
  
  return (
    <section style={{ backgroundColor: "#eee" }}>
      <Container className="py-5">
        <Row>
          <Col lg="4">
            <Card className="mb-4">
              <Card.Body className="text-center">
                <Card.Img
                  src={userInfo.profile_picture || "https://via.placeholder.com/150"}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "180px", height: "180px", objectFit: "cover" }}
                />
                <h5 className="mt-3">{userInfo.full_name}</h5>
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="primary" onClick={toggleUpdateModal}>Update Info</Button>
                  <Button variant="outline-secondary" className="ms-2" onClick={toggleModal}>
                    Change Password
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg="8">
            <Card className="mb-4">
              <Card.Body>
                {[{ label: "Full Name", value: userInfo.full_name },
                  { label: "Email", value: userInfo.email },
                  { label: "Phone Number", value: userInfo.phone_number },
                  { label: "Date of Birth", value: userInfo.birth_of_date },
                  { label: "ID Number", value: userInfo.id_number },
                  { label: "Gender", value: userInfo.gender },
                  { label: "Address", value: userInfo.address },
                ].map((item, index) => (
                  <div key={index}>
                    <Row className="align-items-center">
                      <Col sm="3">
                        <Card.Text className="fw-bold">{item.label}</Card.Text>
                      </Col>
                      <Col sm="9">
                        <Card.Text className="text-muted">{item.value}</Card.Text>
                      </Col>
                    </Row>
                    {index < 10 && <hr />}
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ModalChangePassword show={modalOpen} handleClose={toggleModal} email={userInfo.email} />
      <ModalUpdateInfo show={updateModalOpen} handleClose={toggleUpdateModal} userInfo={userInfo} onUpdate={fetchUserInfo} />
      <ToastContainer />
    </section>
  );
}
