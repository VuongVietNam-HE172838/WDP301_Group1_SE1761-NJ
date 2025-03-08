import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const QRComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, billId } = location.state || { cartItems: [], billId: "" };

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calculateTotalAmount = () => {
      return cartItems.reduce((total, item) => total + item.optional.price * item.quantity, 0);
    };
    setTotalAmount(calculateTotalAmount());
  }, [cartItems]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/payments/checkstatus/${billId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.isPaid) {
            navigate("/success");
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    const intervalId = setInterval(checkPaymentStatus, 10000); // Check every 30 seconds

    // Stop checking after 10 minutes
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, 600000); // 10 minutes

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [billId, navigate]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  const bank = {
    BANK_ID: "MbBank",
    ACCOUNT_NO: "0889516992",
    TEMPLATE: "compact2",
    AMOUNT: totalAmount,
    DESCRIPTION: `Thanh toán đơn hàng ${billId}`,
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
                    <p><strong>Số lượng:</strong> {item.quantity}</p>
                    <p><strong>Tổng:</strong> {formatAmount(item.optional.price * item.quantity)}</p>
                    <p><strong>Ghi chú:</strong> {item.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h3 className="mt-3">Tổng tiền: {formatAmount(totalAmount)}</h3>
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