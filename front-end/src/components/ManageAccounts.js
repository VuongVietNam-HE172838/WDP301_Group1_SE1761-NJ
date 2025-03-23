import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountStats, setAccountStats] = useState([]);
  const [timeRange, setTimeRange] = useState(3); // Default time range in months
  const [filters, setFilters] = useState({
    user_name: '',
    role: '',
    isVerified: '',
  }); // Filters for the API

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Dynamically build query parameters
      const params = new URLSearchParams();
      if (filters.user_name) params.append('user_name', filters.user_name);
      if (filters.role) params.append('role', filters.role);
      if (filters.isVerified) params.append('isVerified', filters.isVerified);

      const response = await axios.get(
        `${process.env.REACT_APP_URL_API_BACKEND}/admin/accounts?${params.toString()}`,
        config
      );
      setAccounts(response.data.accounts || []); // Ensure accounts is an array
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchAccountStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${process.env.REACT_APP_URL_API_BACKEND}/admin/accounts/statistics?months=${timeRange}`,
        config
      );
      setAccountStats(response.data || []); // Ensure accountStats is an array
    } catch (error) {
      console.error('Error fetching account statistics:', error);
    }
  };

  const toggleVerification = async (accountId, isVerified) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_URL_API_BACKEND}/admin/accounts/${accountId}`,
        { isVerified: !isVerified },
        config
      );

      setAccounts(accounts.map(acc => (acc._id === accountId ? response.data : acc)));
    } catch (error) {
      console.error('Error updating account verification:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchAccountStatistics();
  }, [timeRange, filters]); // Refetch when filters or time range changes

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Prepare chart data
  const chartData = {
    labels: accountStats.map(stat => `Tháng ${stat._id}`),
    datasets: [
      {
        label: 'Số lượng tài khoản',
        data: accountStats.map(stat => stat.totalAccounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Thống kê số lượng tài khoản ${timeRange} tháng gần nhất`,
      },
    },
  };

  return (
    <div className="container">
      <h2 className="mb-4">Quản lí tài khoản</h2>

      {/* Time Range Selector */}
      <div className="mb-3" style={{ maxWidth: '800px', margin: '0 auto'}}>
        <label htmlFor="timeRange" className="form-label">Chọn khoảng thời gian:</label>
        <select
          id="timeRange"
          className="form-select"
          value={timeRange}
          onChange={(e) => setTimeRange(parseInt(e.target.value))}
        >
          <option value={3}>3 tháng</option>
          <option value={6}>6 tháng</option>
          <option value={12}>12 tháng</option>
        </select>
      </div>

      {/* Chart Section */}
      <div className="mb-5" style={{ maxWidth: '800px', margin: '0 auto'}}>
        <h3>Thống kê số lượng tài khoản</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Account List Section */}
      <div className="mb-5">
        <h3>Danh sách tài khoản</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>
                Tên tài khoản
                <input
                  type="text"
                  name="user_name"
                  className="form-control"
                  placeholder="Tìm tên tài khoản"
                  value={filters.user_name}
                  onChange={handleFilterChange}
                />
              </th>
              <th>
                Vai trò
                <select
                  name="role"
                  className="form-select"
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF</option>
                  <option value="USER">USER</option>
                </select>
              </th>
              <th>
                Xác thực
                <select
                  name="isVerified"
                  className="form-select"
                  value={filters.isVerified}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  <option value="true">Đã xác thực</option>
                  <option value="false">Chưa xác thực</option>
                </select>
              </th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length > 0 ? (
              accounts.map(account => (
                <tr key={account._id}>
                  <td>{account.user_name || 'N/A'}</td>
                  <td>{account.role_id?.name || 'N/A'}</td>
                  <td>{account.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => toggleVerification(account._id, account.isVerified)}
                    >
                      {account.isVerified ? 'Hủy xác thực' : 'Xác thực'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Không có tài khoản nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAccounts;