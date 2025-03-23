import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminStatistics = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [totalPages, setTotalPages] = useState(1); // Track the total pages
    const [selectedBill, setSelectedBill] = useState(null); // Track the selected bill for the modal
    const [showModal, setShowModal] = useState(false); // Track modal visibility
    const [filters, setFilters] = useState({
        isPaid: '',
        status: '',
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        startDate: '', // Start date for delivery time filter
        endDate: '', // End date for delivery time filter
    }); // Filters for the API
    const [statisticsData, setStatisticsData] = useState({ revenueData: [], orderData: [] }); // Combined data
    const [timeRange, setTimeRange] = useState(3); // Default time range in months
    const pageSize = 10; // Number of items per page

    const fetchOrders = async (page) => {
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
            const params = new URLSearchParams({ pageno: page, pagesize: pageSize });
            if (filters.customerName) params.append('customerName', filters.customerName);
            if (filters.customerPhone) params.append('customerPhone', filters.customerPhone);
            if (filters.customerAddress) params.append('customerAddress', filters.customerAddress);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            // Fetch order history with filters and pagination
            const orderResponse = await axios.get(
                `${process.env.REACT_APP_URL_API_BACKEND}/admin/orders?${params.toString()}`,
                config
            );

            setOrders(orderResponse.data.orders);
            setCurrentPage(orderResponse.data.currentPage);
            setTotalPages(orderResponse.data.totalPages);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchStatistics = async () => {
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

            // Fetch combined statistics
            const response = await axios.get(
                `${process.env.REACT_APP_URL_API_BACKEND}/admin/revenue?months=${timeRange}`,
                config
            );

            setStatisticsData({
                revenueData: response.data.revenueData,
                orderData: response.data.orderData,
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage, filters]); // Refetch when filters or page changes

    useEffect(() => {
        fetchStatistics(); // Fetch statistics when time range changes
    }, [timeRange]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleShowDetails = (bill) => {
        setSelectedBill(bill); // Set the selected bill
        setShowModal(true); // Show the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Hide the modal
        setSelectedBill(null); // Clear the selected bill
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
        setCurrentPage(1); // Reset to the first page when filters change
    };

    const handleTimeRangeChange = (e) => {
        setTimeRange(parseInt(e.target.value)); // Update the time range
    };

    // Prepare data for the combined chart
    const chartData = (() => {
        // Create a map for revenue and order data
        const revenueMap = new Map(statisticsData.revenueData.map(data => [data._id, data.totalRevenue]));
        const orderMap = new Map(statisticsData.orderData.map(data => [data._id, data.totalOrders]));

        // Get all unique months from both datasets
        const allMonths = Array.from(new Set([
            ...statisticsData.revenueData.map(data => data._id),
            ...statisticsData.orderData.map(data => data._id),
        ])).sort((a, b) => a - b); // Sort months in ascending order

        // Prepare labels and datasets
        const labels = allMonths.map(month => `Tháng ${month}`);
        const revenueDataset = allMonths.map(month => revenueMap.get(month) || 0); // Fill missing months with 0
        const orderDataset = allMonths.map(month => orderMap.get(month) || 0); // Fill missing months with 0

        return {
            labels,
            datasets: [
                {
                    label: 'Doanh thu (VND)',
                    data: revenueDataset,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)', // Light blue
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    yAxisID: 'y', // Associate with the left y-axis
                },
                {
                    label: 'Số lượng đơn hàng',
                    data: orderDataset,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)', // Light purple
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1', // Associate with the right y-axis
                },
            ],
        };
    })();

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14, // Increase font size for better readability
                    },
                },
            },
            title: {
                display: true,
                text: `Thống kê ${timeRange} tháng gần nhất`,
                font: {
                    size: 18, // Larger title font size
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true, // Ensure the y-axis starts at 0
                type: 'linear',
                position: 'left', // Left y-axis for revenue
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString('vi-VN') + ' VND'; // Format numbers with commas and VND
                    },
                },
                title: {
                    display: true,
                    text: 'Doanh thu (VND)',
                },
            },
            y1: {
                beginAtZero: true, // Ensure the y-axis starts at 0
                type: 'linear',
                position: 'right', // Right y-axis for order count
                grid: {
                    drawOnChartArea: false, // Prevent grid lines from overlapping with the left y-axis
                },
                ticks: {
                    callback: function (value) {
                        return value + ' đơn'; // Append "đơn" to order count
                    },
                },
                title: {
                    display: true,
                    text: 'Số lượng đơn hàng',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Tháng',
                },
            },
        },
    };

    return (
        <div className="container">
            <h2 className="mb-4">Admin Statistics</h2>

            {/* Time Range Selector */}
            <div className="mb-3">
                <label htmlFor="timeRange" className="form-label">Chọn khoảng thời gian:</label>
                <select
                    id="timeRange"
                    className="form-select"
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                >
                    <option value={3}>3 tháng</option>
                    <option value={5}>5 tháng</option>
                    <option value={12}>12 tháng</option>
                </select>
            </div>

            {/* Combined Chart Section */}
            <div className="mb-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3>Thống kê Doanh thu và Đơn hàng</h3>
                <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Order History Section */}
            <div className="mb-5">
                <h3>Order History</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>
                                Thanh toán
                            </th>
                            <th>
                                Trạng thái
                            </th>
                            <th>
                                Tên khách hàng
                                <input
                                    type="text"
                                    name="customerName"
                                    className="form-control"
                                    placeholder="Tìm tên khách hàng"
                                    value={filters.customerName}
                                    onChange={handleFilterChange}
                                />
                            </th>
                            <th>
                                Số điện thoại
                                <input
                                    type="text"
                                    name="customerPhone"
                                    className="form-control"
                                    placeholder="Tìm số điện thoại"
                                    value={filters.customerPhone}
                                    onChange={handleFilterChange}
                                />
                            </th>
                            <th>
                                Địa chỉ
                                <input
                                    type="text"
                                    name="customerAddress"
                                    className="form-control"
                                    placeholder="Tìm địa chỉ"
                                    value={filters.customerAddress}
                                    onChange={handleFilterChange}
                                />
                            </th>
                            <th>Tổng số tiền</th>
                            <th>Loại đặt hàng</th>
                            <th>Phương thức giao hàng</th>
                            <th>
                                Thời gian nhận hàng
                                <div className="d-flex">
                                    <input
                                        type="date"
                                        name="startDate"
                                        className="form-control"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                    />
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="form-control"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order.bill?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                <td>{order.status}</td>
                                <td>{order.bill?.customer_name || 'N/A'}</td>
                                <td>{order.bill?.customer_phone || 'N/A'}</td>
                                <td>{order.bill?.customer_address || 'N/A'}</td>
                                <td>{order.bill?.total_amount || 0}</td>
                                <td>{order.order_type}</td>
                                <td>{order.bill?.delivery_method || 'N/A'}</td>
                                <td>{order.bill?.delivery_time ? new Date(order.bill.delivery_time).toLocaleString() : 'N/A'}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => handleShowDetails(order.bill)}
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="btn btn-primary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal for Bill Details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết hóa đơn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBill ? (
                        <div>
                            <p><strong>Tên khách hàng:</strong> {selectedBill.customer_name || 'N/A'}</p>
                            <p><strong>Số điện thoại:</strong> {selectedBill.customer_phone || 'N/A'}</p>
                            <p><strong>Địa chỉ:</strong> {selectedBill.customer_address || 'N/A'}</p>
                            <p><strong>Tổng số tiền:</strong> {selectedBill.total_amount || 0}</p>
                            <p><strong>Phương thức giao hàng:</strong> {selectedBill.delivery_method || 'N/A'}</p>
                            <p><strong>Thời gian nhận hàng:</strong> {selectedBill.delivery_time ? new Date(selectedBill.delivery_time).toLocaleString() : 'N/A'}</p>
                            <h5>Danh sách sản phẩm:</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Tên món</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBill.items.map(item => (
                                        <tr key={item._id}>
                                            <td>{item.item_id.name || 'N/A'}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Không có dữ liệu</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminStatistics;