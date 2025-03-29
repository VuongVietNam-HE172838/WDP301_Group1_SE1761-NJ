import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from 'react-bootstrap';

const ConfirmOrderStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems: initialCartItems, totalPrice } = location.state;
  const [cartItems, setCartItems] = useState(initialCartItems);

  const [userInfo, setUserInfo] = useState({ full_name: "", phone_number: "", address: "" });
  const [deliveryMethod, setDeliveryMethod] = useState("Tự đến nhận hàng");

  // Set initial delivery time to 16 minutes from now
  const initialDeliveryTime = new Date(new Date().getTime() + 16 * 60000);
  const [deliveryTime, setDeliveryTime] = useState(initialDeliveryTime);

  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/account/information`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            full_name: data.full_name || "",
            phone_number: data.phone_number || "",
            address: data.address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  const updateQuantity = (index, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  const updateNote = (index, note) => {
    setCartItems((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, note } : item))
    );
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.optional.price * item.quantity, 0);
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này!");
      return;
    }


    try {
      const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/order/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ensure token is sent
        },
        body: JSON.stringify({
          items: cartItems,
          order_type: 'counter',
          total_price: totalPrice,
          user_info: userInfo, // Include user info
          delivery_method: deliveryMethod, // Include delivery method
          delivery_time: deliveryTime, // Include delivery time
          payment_method: selectedPaymentMethod // Include payment method
        }), // Set order type to 'counter'
      });


      if (response.ok) {
        const data = await response.json();
        toast.success("Đơn hàng đã được tạo thành công!");
        if (selectedPaymentMethod === 'cash') {
          navigate("/staff-order");
        } else {
          navigate("/payments", { state: { cartItems, deliveryMethod, deliveryTime, billId: data.order.bill, totalAmount: totalPrice } });
        }
      } else {
        const errorData = await response.json();
        console.error('Error creating order:', errorData); // Log the error response
        toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
    }
  };

  const handleShowModal = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-4">Giỏ hàng</h2>
          <div className="accordion" id="cartAccordion">
            {cartItems.map((item, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#item-${index}`}>
                    {item.name}
                  </button>
                </h2>
                <div id={`item-${index}`} className={`accordion-collapse collapse ${index === cartItems.length - 1 ? "show" : ""}`} data-bs-parent="#cartAccordion">
                  <div className="accordion-body">
                    <img src={item.img} alt={item.name} className="img-fluid rounded mb-3" style={{ maxWidth: "150px" }} />
                    <p><strong>Kích thước:</strong> {item.optional.size}</p>
                    <p><strong>Giá:</strong> {formatAmount(item.optional.price)}</p>
                    <div className="d-flex align-items-center mb-3">
                      {/* <button className="btn btn-outline-secondary" onClick={() => updateQuantity(index, -1)}>-</button> */}
                      <p><strong>Số lượng: </strong>{item.quantity}</p>
                      {/* <button className="btn btn-outline-secondary" onClick={() => updateQuantity(index, 1)}>+</button> */}
                    </div>
                    <p><strong>Tổng:</strong> {formatAmount(item.optional.price * item.quantity)}</p>
                    <textarea
                      className="form-control"
                      placeholder="Ghi chú"
                      value={item.note}
                      onChange={(e) => updateNote(index, e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h3 className="mt-3">Tổng tiền: {formatAmount(calculateTotalAmount())}</h3>
        </div>
        <div className="col-md-4">
          <h2 className="mb-4">Thông tin người dùng</h2>
          <form>
            <div className="mb-3">
              <label className="form-label">Họ và Tên</label>
              <input type="text" className="form-control" onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })} />
            </div>

          </form>
          <button className="btn btn-primary mt-3" onClick={() => handleShowModal('qr')}>Thanh toán bằng QR</button>
          <button className="btn btn-secondary mt-3" onClick={() => handleShowModal('cash')}>Thanh toán bằng tiền mặt</button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn thanh toán bằng {selectedPaymentMethod === 'cash' ? 'tiền mặt' : 'QR'} không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="primary" onClick={handlePayment}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConfirmOrderStaff;