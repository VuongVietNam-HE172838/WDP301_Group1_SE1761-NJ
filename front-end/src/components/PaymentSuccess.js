import React, { useEffect } from "react";

const SuccessPayment = () => {
  useEffect(() => {
    const time = setTimeout(() => {
      window.location.href = "/"; // Redirect về trang chủ sau 2s
    }, 4000);
    return () => clearTimeout(time);
  });

  return (
    <div style={styles.container}>
      <div style={styles.circle}>
        <svg style={styles.svg} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" style={styles.circlePath} />
          <polyline points="30,55 45,70 70,35" style={styles.checkmark} />
        </svg>
      </div>
      <h1 style={styles.text}>Thanh toán thành công!</h1>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#ffffff",
    backgroundSize: "cover", // Ảnh bao phủ toàn bộ container
    backgroundPosition: "center", // Đặt vị trí ảnh ở trung tâm
  },
  circle: {
    width: "150px",
    height: "150px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    width: "100%",
    height: "100%",
  },
  circlePath: {
    fill: "none",
    stroke: "#EF4444", // Màu hình tròn
    strokeWidth: "5",
    strokeDasharray: "283", // Tổng chu vi của hình tròn
    strokeDashoffset: "283", // Bắt đầu từ ẩn toàn bộ hình tròn
    strokeLinecap: "round", // Đầu nét tròn để mượt hơn
    animation: "drawCircle 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards", // Tăng thời gian vẽ và dùng cubic-bezier để mượt hơn
  },
  checkmark: {
    fill: "none",
    stroke: "#EF4444", // Màu dấu checkmark (trắng)
    strokeWidth: "5",
    strokeDasharray: "100", // Tăng độ dài để cho phép mượt mà hơn
    strokeDashoffset: "100",
    strokeLinecap: "round", // Đầu nét tròn để mượt hơn
    animation: "drawCheckmark 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards",
    animationDelay: "0.9s", // Đồng bộ với hình tròn
  },
  text: {
    marginTop: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#EF4444",
  },
};

// Keyframes cho hoạt ảnh
const keyframes = `
  @keyframes drawCircle {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes drawCheckmark {
    to {
      stroke-dashoffset: 0;
    }
  }
`;

// Thêm keyframes vào document style
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

export default SuccessPayment;