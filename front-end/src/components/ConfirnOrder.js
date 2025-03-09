import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: "67b35e1c0a211a676bad5e1c",
      name: "Đùi Gà Quay",
      optional: {
        size: "Lớn",
        price: 2000,
      },
      img: "https://static.kfcvietnam.com.vn/images/items/lg/BJ.jpg?v=gMXG84",
      quantity: 1,
      note: ""
    },
    {
      id: "67b35e7f0a211a676bad5e22",
      name: "Pepsi",
      optional: {
        size: "Vừa",
        price: 1000,
      },
      img: "https://static.kfcvietnam.com.vn/images/items/lg/PEPSI_CAN.jpg?v=gMXG84",
      quantity: 1,
      note: ""
    },
    {
      id: "67c4992bad3ed5902ba34c6b",
      name: "Burger Zinger",
      optional: {
        size: "Vừa",
        price: 2000,
      },
      img: "https://static.kfcvietnam.com.vn/images/items/lg/Burger-Zinger.jpg?v=gMXG84",
      quantity: 1,
      note: ""
    }
  ]);
  
  const [userInfo, setUserInfo] = useState({ full_name: "", phone_number: "", address: "" });
  const [deliveryMethod, setDeliveryMethod] = useState("Tự đến nhận hàng");

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
    if (!userInfo.full_name || !userInfo.phone_number || !userInfo.address) {
      toast.error("Vui lòng nhập đầy đủ thông tin người dùng!");
      return;
    }

    if (!/^\d{10}$/.test(userInfo.phone_number)) {
      toast.error("Số điện thoại phải có 10 chữ số!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItems, deliveryMethod, deliveryTime, orderType: 'online' }), // Set order type to 'online'
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Hóa đơn đã được tạo thành công!");
        navigate("/payments", { state: { cartItems, deliveryMethod, deliveryTime, billId: data.bill._id } });
      } else {
        toast.error("Có lỗi xảy ra khi tạo hóa đơn!");
      }
    } catch (error) {
      console.error("Error creating bill:", error);
      toast.error("Có lỗi xảy ra khi tạo hóa đơn!");
    }
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
                      <button className="btn btn-outline-secondary" onClick={() => updateQuantity(index, -1)}>-</button>
                      <span className="mx-3">{item.quantity}</span>
                      <button className="btn btn-outline-secondary" onClick={() => updateQuantity(index, 1)}>+</button>
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
    </div>
  );
};

export default ConfirmOrder;