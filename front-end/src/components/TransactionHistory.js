import React, { useEffect, useState } from 'react';
import { Container, Table, Row, Col, Card, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập để xem lịch sử giao dịch!");
        return;
      }
      try {
        const response = await fetch('http://localhost:9999/api/account/transaction-history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const paidTransactions = data.filter(transaction => transaction.isPaid);
        setTransactions(paidTransactions);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        toast.error("Có lỗi xảy ra khi lấy lịch sử giao dịch!");
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <Card>
            <Card.Header as="h5">Lịch sử Giao Dịch</Card.Header>
            <Card.Body>
              <Table bordered className="text-center align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên Món Ăn</th>
                    <th>Hình Ảnh</th>
                    <th>Số Lượng</th>
                    <th>Đơn Giá</th>
                    <th>Tổng Tiền</th>
                    <th>Thời Gian Đặt Hàng</th>
                    <th>Trạng Thái Thanh Toán</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      {transaction.items.map((item, i) => (
                        <tr key={`${transaction.id}-${i}`}>
                          {i === 0 && (
                            <td rowSpan={transaction.items.length}>{index + 1}</td>
                          )}
                          <td>{item.name}</td>
                          <td><Image src={item.img} alt={item.name} width={50} height={50} /></td>
                          <td>{item.quantity}</td>
                          <td>{item.price.toLocaleString()} VND</td>
                          {i === 0 && (
                            <td rowSpan={transaction.items.length}>{transaction.totalAmount.toLocaleString()} VND</td>
                          )}
                          {i === 0 && (
                            <td rowSpan={transaction.items.length}>{new Date(transaction.orderTime).toLocaleString()}</td>
                          )}
                          {i === 0 && (
                            <td rowSpan={transaction.items.length}>{transaction.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                          )}
                          {i === 0 && (
                            <td rowSpan={transaction.items.length}>{transaction.status}</td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionHistory;
