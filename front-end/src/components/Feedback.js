import React, { useState, useEffect } from "react";
import { Table, Container, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập!");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_URL_API_BACKEND}/feedback`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('feedback: ',response.data);
        
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        console.error("Lỗi tải feedback:", error);
        setError("Không thể tải danh sách feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-3 text-center">Danh sách Feedback</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Đánh giá</th>
              <th>Nhận xét</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={feedback._id}>
                <td>{index + 1}</td>
                <td>{feedback.order?._id || "N/A"}</td>
                <td>{feedback.feedback_by || "Ẩn danh"}</td>
                <td>
                  {feedback.order?.items.length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {feedback.order.items.map((item, idx) => (
                        <li key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                          <img
                            src={item.img}
                            alt={item.name}
                            style={{ width: "50px", height: "50px", marginRight: "10px" }}
                          />
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "Không có sản phẩm"
                  )}
                </td>
                <td>{feedback.order?.totalAmount ? `${feedback.order.totalAmount.toLocaleString()} VND` : "N/A"}</td>
                <td>{feedback.order?.status || "N/A"}</td>
                <td>{feedback.rating} ⭐</td>
                <td>{feedback.comment}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Feedback;
