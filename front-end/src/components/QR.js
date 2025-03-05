import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const QRComponent = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      name: "Đùi Gà Quay",
      optional: {
        size: "Lớn",
        price: 75000,
      },
      img: "https://static.kfcvietnam.com.vn/images/items/lg/BJ.jpg?v=gMXG84",
      quantity: 1,
      note: ""
    },
    {
      name: "Pepsi",
      optional: {
        size: "Vừa",
        price: 19000,
      },
      img: "https://static.kfcvietnam.com.vn/images/items/lg/PEPSI_CAN.jpg?v=gMXG84",
      quantity: 1,
      note: ""
    },
    {
        name: "Burger Zinger",
        optional: {
          size: "Vừa",
          price: 54000,
        },
        img: "https://static.kfcvietnam.com.vn/images/items/lg/Burger-Zinger.jpg?v=gMXG84",
        quantity: 1,
        note: ""
    }
  ]);

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

  const totalAmount = cartItems.reduce((acc, item) => acc + item.optional.price * item.quantity, 0);

  const bank = {
    BANK_ID: "TpBank",
    ACCOUNT_NO: "41110316698",
    TEMPLATE: "compact2",
    AMOUNT: totalAmount,
    DESCRIPTION: `Thanh toán đơn hàng` ,
    ACCOUNT_NAME: "FOODTRIPVNS",
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Danh sách sản phẩm */}
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
          <h3 className="mt-3">Tổng tiền: {formatAmount(bank.AMOUNT)}</h3>
        </div>

        {/* Mã QR thanh toán */}
        <div className="col-md-4 text-center">
          <h2 className="mb-4">Quét QR để thanh toán</h2>
          <img
            src={`https://img.vietqr.io/image/${bank.BANK_ID}-${bank.ACCOUNT_NO}-${bank.TEMPLATE}.png?amount=${bank.AMOUNT}&addInfo=${bank.DESCRIPTION}&accountName=${bank.ACCOUNT_NAME}`}
            alt="QR Code"
            className="img-fluid rounded"
            style={{ maxWidth: "350px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default QRComponent;
