import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button, Modal, Image, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${process.env.REACT_APP_URL_API_BACKEND}/order/onlinePaidOrders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const paidOrders = response.data.orders.filter(order => order.bill && order.bill.isPaid);
        setOrders(paidOrders);
        setFilteredOrders(paidOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

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

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lịch sử đơn hàng</h2>
      <Form.Group controlId="filterDate">
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
          style={{ width: '300px' }} // Extend the width of the date picker
        />
      </Form.Group>
      <Form.Group controlId="sortOrder" className="mt-3">
        <Form.Label><strong>Sắp xếp theo thời gian:</strong></Form.Label>
        <Form.Control as="select" value={sortOrder} onChange={handleSortChange} style={{ width: '150px' }}>
          <option value="desc">Mới đến cũ</option>
          <option value="asc">Cũ đến mới</option>
        </Form.Control>
      </Form.Group>
      <Row className="mt-4">
        {filteredOrders.map(order => (
          <Col md={6} key={order._id} className="mb-3">
            <Card>
              <Card.Header>
                <strong>Ngày đặt hàng:</strong> {new Date(order.bill.created_at).toLocaleString()} {getStatusIcon(order.status)}
              </Card.Header>
              <Card.Body>
                {order.bill ? (
                  <>
                    <strong>Trạng thái:</strong><Card.Text style={getStatusStyle(order.status)}> {order.status}</Card.Text>
                    <Card.Text><strong>Tổng tiền:</strong> {order.bill.total_amount} đ</Card.Text>
                    <Button variant="primary" onClick={() => showOrderDetails(order)}>Xem chi tiết</Button>
                  </>
                ) : (
                  <Card.Text>Thông tin hóa đơn không có sẵn</Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={isModalVisible} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && selectedOrder.bill && (
            <div>
              <h3>Ngày đặt hàng: {new Date(selectedOrder.bill.created_at).toLocaleString()}</h3>
              <p><strong>Trạng thái:</strong> <span style={getStatusStyle(selectedOrder.status)}>{selectedOrder.status}</span></p>
              <p><strong>Loại đơn hàng:</strong> {selectedOrder.order_type}</p>
              <h4>Chi tiết hóa đơn</h4>
              <p><strong>Tên khách hàng:</strong> {selectedOrder.bill.customer_name}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.bill.customer_phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.bill.customer_address}</p>
              <p><strong>Tổng tiền:</strong> {selectedOrder.bill.total_amount} đ</p>
              <h4>Chi tiết món</h4>
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

export default OrderHistory;
