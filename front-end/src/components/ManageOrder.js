import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button, Modal, Image, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FeedbackModal from "./FeedbackModal";
import ViewFeedbackModal from "./ViewFeedbackModal";
const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sortOrder, setSortOrder] = useState('desc');
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [isViewFeedbackModalVisible, setIsViewFeedbackModalVisible] = useState(false);
  const [isPaidFilter, setIsPaidFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${process.env.REACT_APP_URL_API_BACKEND}/order/allOrders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        let orders = response.data.orders;
        if (isPaidFilter !== 'all') {
          const isPaid = isPaidFilter === 'true';
          orders = orders.filter(order => order.bill && order.bill.isPaid === isPaid);
        }
        setOrders(orders);
        setFilteredOrders(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [isPaidFilter]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.bill.created_at);
        return orderDate >= start && orderDate <= new Date(end.setHours(23, 59, 59, 999));
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    const sorted = [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.bill.created_at);
      const dateB = new Date(b.bill.created_at);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredOrders(sorted);
  };

  const handlePaidFilterChange = (e) => {
    setIsPaidFilter(e.target.value);
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <span style={{ color: 'green' }}>✔️</span>;
      case 'on going':
        return <span style={{ color: 'orange' }}>✈️</span>;
      case 'cancel':
        return <span style={{ color: 'red' }}>❌</span>;
      default:
        return null;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'done':
        return { color: 'green' };
      case 'on going':
        return { color: 'orange' };
      case 'cancel':
        return { color: 'red' };
      default:
        return {};
    }
  };
  const handleFeedbackSubmit = async () => {
    if (!selectedOrder || !selectedOrder._id || !selectedOrder.order_by) {
      alert("Lỗi: Không có đơn hàng hợp lệ!");
      return;
    }

    if (!rating || feedbackText.trim() === "") {
      alert("Vui lòng nhập đánh giá và nội dung feedback!");
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Kiểm tra xem đơn hàng này đã có feedback chưa
      const feedbackResponse = await axios.get(
        `http://localhost:9999/api/feedback/order/${selectedOrder._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (feedbackResponse.data.length > 0) {
        alert("Bạn đã gửi feedback cho đơn hàng này rồi!");
        return;
      }

      // Nếu chưa có feedback, tiến hành gửi feedback mới
      await axios.post(`${process.env.REACT_APP_URL_API_BACKEND}/feedback`, {
        order: selectedOrder._id,
        rating: rating,
        comment: feedbackText.trim(),
        feedback_by: selectedOrder.order_by
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsFeedbackModalVisible(false);
      setFeedbackText('');
      setRating(0);
      alert('Gửi feedback thành công!');
    } catch (error) {
      console.error('Error submitting feedback:', error.response?.data || error.message);
      alert(`Gửi feedback thất bại! ${error.response?.data?.message || "Không xác định"}`);
    }
  };


  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lịch sử đơn hàng</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Group controlId="filterDate" className="me-3">
          <Form.Label><strong>Chọn khoảng thời gian:</strong></Form.Label>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            isClearable
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="sortOrder" className="me-3">
          <Form.Label><strong>Sắp xếp theo thời gian:</strong></Form.Label>
          <Form.Control as="select" value={sortOrder} onChange={handleSortChange}>
            <option value="desc">Mới đến cũ</option>
            <option value="asc">Cũ đến mới</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="isPaidFilter">
          <Form.Label><strong>Lọc theo trạng thái thanh toán:</strong></Form.Label>
          <Form.Control as="select" value={isPaidFilter} onChange={handlePaidFilterChange}>
            <option value="all">Tất cả</option>
            <option value="true">Đã thanh toán</option>
            <option value="false">Chưa thanh toán</option>
          </Form.Control>
        </Form.Group>
      </div>
      <div className="order-history-list">
        {filteredOrders.map(order => (
          <div key={order._id} className="order-card border rounded mb-4 p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5><strong>Ngày đặt hàng:</strong> {new Date(order.bill.created_at).toLocaleString()}</h5>
                <p><strong>Trạng thái:</strong> <span style={getStatusStyle(order.status)}>{order.status}</span></p>
              </div>
              <div>
                <p><strong>Tổng tiền:</strong> {order.bill.total_amount} đ</p>
              </div>
            </div>
            <div className="order-items mb-3">
              <h6><strong>Chi tiết món:</strong></h6>
              <ul className="list-unstyled">
                {order.bill.items.map(item => (
                  <li key={item.item_id} className="d-flex align-items-center mb-2">
                    <Image src={item.item_id.img} thumbnail style={{ width: '50px', marginRight: '10px' }} />
                    <div>
                      <p className="mb-0"><strong>{item.item_id.name}</strong></p>
                      <p className="mb-0">{item.quantity} x {item.price} đ</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="d-flex justify-content-end">
              <Button variant="primary" className="me-2" onClick={() => showOrderDetails(order)}>Xem chi tiết</Button>
              {order.status === "done" && (
                <>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsFeedbackModalVisible(true);
                    }}
                  >
                    Feedback
                  </Button>

                  <Button
                    variant="info"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsViewFeedbackModalVisible(true);
                    }}
                  >
                    Xem Feedback
                  </Button>
                </>
              )}

            </div>
          </div>
        ))}
      </div>
      <FeedbackModal
        show={isFeedbackModalVisible}
        onHide={() => setIsFeedbackModalVisible(false)}
        onSubmit={handleFeedbackSubmit}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        rating={rating}
        setRating={setRating}
      />
      <ViewFeedbackModal
        show={isViewFeedbackModalVisible}
        onHide={() => setIsViewFeedbackModalVisible(false)}
        orderId={selectedOrder?._id}
      />
      <Modal show={isModalVisible} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && selectedOrder.bill && (
            <div>
              <h4>Ngày đặt hàng: {new Date(selectedOrder.bill.created_at).toLocaleString()}</h4>
              <p><strong>Trạng thái:</strong> <span style={getStatusStyle(selectedOrder.status)}>{selectedOrder.status}</span></p>
              <p><strong>Loại đơn hàng:</strong> {selectedOrder.order_type}</p>
              <h5>Chi tiết hóa đơn</h5>
              <p><strong>Tên khách hàng:</strong> {selectedOrder.bill.customer_name}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.bill.customer_phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.bill.customer_address}</p>
              <p><strong>Tổng tiền:</strong> {selectedOrder.bill.total_amount} đ</p>
              <h5>Chi tiết món</h5>
              <ul>
                {selectedOrder.bill.items.map(item => (
                  <li key={item.item_id}>
                    <Image src={item.item_id.img} thumbnail style={{ width: '50px', marginRight: '10px' }} />
                    {item.item_id.name} - {item.quantity} x {item.price} đ
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageOrder;
