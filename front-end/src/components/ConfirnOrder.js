import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems: initialCartItems, totalPrice } = location.state;
  const [cartItems, setCartItems] = useState(initialCartItems);

  const [userInfo, setUserInfo] = useState({ full_name: "", phone_number: "", address: "" });
  const [originalUserInfo, setOriginalUserInfo] = useState(null); // Store original user info for comparison
  const [deliveryMethod, setDeliveryMethod] = useState("Tự đến nhận hàng");
  const [showModal, setShowModal] = useState(false);

  // Set initial delivery time to 16 minutes from now
  const initialDeliveryTime = new Date(new Date().getTime() + 16 * 60000);
  const [deliveryTime, setDeliveryTime] = useState(initialDeliveryTime);

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
          setUserInfo({ full_name: data.full_name || "", phone_number: data.phone_number || "", address: data.address || "" });
          setOriginalUserInfo({ full_name: data.full_name || "", phone_number: data.phone_number || "", address: data.address || "" }); // Save original info
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
      currency: "VND",
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

  const updateUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Check if user info has changed
    if (
      userInfo.full_name !== originalUserInfo.full_name ||
      userInfo.phone_number !== originalUserInfo.phone_number ||
      userInfo.address !== originalUserInfo.address
    ) {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/account/information`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userInfo),
        });

        if (response.ok) {
          toast.success("Thông tin cá nhân đã được cập nhật!");
        } else {
          toast.error("Không thể cập nhật thông tin cá nhân!");
        }
      } catch (error) {
        console.error("Error updating user profile:", error);
        toast.error("Có lỗi xảy ra khi cập nhật thông tin cá nhân!");
      }
    }
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này!");
      return;
    }
    if (
      userInfo.full_name !== originalUserInfo.full_name ||
      userInfo.phone_number !== originalUserInfo.phone_number ||
      userInfo.address !== originalUserInfo.address
    ) {
      setShowModal(true); // Show the modal if user info has changed
    } else {
      await proceedWithPayment(); // Proceed with payment directly
    }
  };

  const proceedWithPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/order/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          order_type: "online",
          total_price: totalPrice,
          user_info: userInfo,
          delivery_method: deliveryMethod,
          delivery_time: deliveryTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Đơn hàng đã được tạo thành công!");
        navigate("/payments", { state: { cartItems, deliveryMethod, deliveryTime, billId: data.order.bill } });
      } else {
        const errorData = await response.json();
        toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
    }
  }
  const handleModalConfirm = async () => {
    setShowModal(false);
    await updateUserProfile(); // Update user profile
    await proceedWithPayment(); // Proceed with payment
  };

  const handleModalCancel = async () => {
    setShowModal(false);
    await proceedWithPayment(); // Skip updating and proceed with payment
  };

  return (
    <div className="container mt-5" style={{ paddingTop: "70px" }}>
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
                    <p><strong>Số lượng:</strong> {item.quantity}</p>
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
              <input type="text" className="form-control" value={userInfo.full_name} onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input type="text" className="form-control" value={userInfo.phone_number} onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input type="text" className="form-control" value={userInfo.address} onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Phương thức nhận hàng</label>
              <select className="form-select" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
                <option value="Tự đến nhận hàng">Tự đến nhận hàng</option>
                <option value="Giao hàng">Giao hàng</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Thời gian nhận hàng</label>
              <DatePicker
                selected={deliveryTime}
                onChange={(date) => setDeliveryTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={new Date()}
                minTime={new Date().getDate() === deliveryTime.getDate() ? initialDeliveryTime : undefined}
                maxTime={new Date().setHours(23, 45)}
                className="form-control"
              />
            </div>
          </form>
          <button className="btn btn-primary mt-3" onClick={handlePayment}>Thanh toán</button>
        </div>
      </div>
      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>Thông tin của bạn vừa bị thay đổi. Bạn có muốn cập nhật thông tin cá nhân trước khi thanh toán không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalCancel}>
            Không
          </Button>
          <Button variant="primary" onClick={handleModalConfirm}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConfirmOrder;