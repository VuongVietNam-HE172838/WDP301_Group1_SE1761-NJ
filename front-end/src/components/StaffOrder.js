import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const StaffOrder = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState({ full_name: "", phone_number: "", address: "" });
  const [deliveryMethod, setDeliveryMethod] = useState("Tự đến nhận hàng");
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/menu`);
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data.items);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/order/staffOrders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
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
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePayment = async () => {
    if (!userInfo.full_name) {
      toast.error("Vui lòng nhập đầy đủ thông tin người dùng!");
      return;
    }

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          order_type: 'counter',
          total_price: calculateTotalAmount(),
          user_info: userInfo,
          delivery_method: deliveryMethod,
          delivery_time: deliveryTime
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Đơn hàng đã được tạo thành công!");
        navigate("/confirm-order", { state: { cartItems, deliveryMethod, deliveryTime, billId: data.order.bill } });
      } else {
        const errorData = await response.json();
        toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
    }
  };

  const filteredOrders = orders.filter(order => order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row">
        <div className="col-md-2">
          <h2 className="mb-4">Quản lý đơn hàng</h2>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Tìm kiếm đơn hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="accordion" id="orderAccordion">
            {filteredOrders.map((order, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#order-${index}`}>
                    {order.customer_name} - {new Date(order.created_at).toLocaleString()}
                  </button>
                </h2>
                <div id={`order-${index}`} className="accordion-collapse collapse" data-bs-parent="#orderAccordion">
                  <div className="accordion-body">
                    <p><strong>Tổng tiền:</strong> {formatAmount(order.total_amount)}</p>
                    <p><strong>Phương thức nhận hàng:</strong> {order.delivery_method}</p>
                    <p><strong>Thời gian nhận hàng:</strong> {new Date(order.delivery_time).toLocaleString()}</p>
                    <p><strong>Trạng thái thanh toán:</strong> {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                    <h5>Chi tiết đơn hàng:</h5>
                    {order.items.map((item, i) => (
                      <div key={i}>
                        <p>{item.name} - {item.quantity} x {formatAmount(item.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-7">
          <h2 className="mb-4">Menu</h2>
          <div className="row">
            {menuItems.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card">
                  <img src={item.img} alt={item.name} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{formatAmount(item.price)}</p>
                    <button className="btn btn-primary" onClick={() => addToCart(item)}>Thêm vào giỏ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-3">
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
                    <p><strong>Giá:</strong> {formatAmount(item.price)}</p>
                    <div className="d-flex align-items-center mb-3">
                      <button className="btn btn-outline-secondary" onClick={() => updateQuantity(index, -1)}>-</button>
                      <span className="mx-3">{item.quantity}</span>
                      <button className="btn btn-outline-secondary" onClick={() => updateQuantity(index, 1)}>+</button>
                    </div>
                    <p><strong>Tổng:</strong> {formatAmount(item.price * item.quantity)}</p>
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
          <button className="btn btn-primary mt-3" onClick={handlePayment}>Thanh toán</button>
        </div>
      </div>
    </div>
  );
};

export default StaffOrder;
