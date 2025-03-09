import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillHistory = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_API_BACKEND}/bills`);
        const data = await response.json();
        setBills(data);
      } catch (error) {
        console.error('Error fetching bill history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Billing History</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill.id}>
              <td>{bill.id}</td>
              <td>{new Date(bill.date).toLocaleDateString()}</td>
              <td>${bill.amount.toFixed(2)}</td>
              <td>{bill.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BillHistory;