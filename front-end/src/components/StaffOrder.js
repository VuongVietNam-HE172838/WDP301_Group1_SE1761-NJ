import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Accordion, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import Cart from './Cart';
import CartIcon from './CartIcon';
import CartStaff from './CartStaff';

const StaffOrder = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showCart, setShowCart] = useState(false);

    // Lấy danh sách categories từ MongoDB
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:9999/menu/menu');
                setCategories(response.data);
                if (response.data.length > 0) {
                    setSelectedCategory(response.data[0]._id); // Mặc định chọn category đầu tiên
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Lấy danh sách dishes theo categoryId
    useEffect(() => {
        const fetchDishes = async () => {
            if (!selectedCategory) return;
            try {
                const response = await axios.get(`http://localhost:9999/menu/${selectedCategory}/dishes`);
                // **Lọc những món ăn có quantity > 0**
                const filteredDishes = response.data.filter(dish => parseInt(dish.quantity) > 0);
                setDishes(filteredDishes);
            } catch (error) {
                console.error("Error fetching dishes:", error);
            }
        };
        fetchDishes();
    }, [selectedCategory]);

    // Lấy danh sách orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token'); // Get the token from local storage
                const response = await axios.get(`${process.env.REACT_APP_URL_API_BACKEND}/order/staffOrders`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });
                setOrders(response.data.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    const addToCart = (dish) => {
        const existingItem = cartItems.find(item => item.dish._id === dish._id);
        if (existingItem) {
            setCartItems(cartItems.map(item => item.dish._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCartItems([...cartItems, { dish, quantity: 1 }]);
        }
    };

    const removeFromCart = (dishId) => {
        setCartItems(cartItems.filter(item => item.dish._id !== dishId));
    };

    const updateCartItemQuantity = (dishId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(dishId);
        } else {
            setCartItems(cartItems.map(item => item.dish._id === dishId ? { ...item, quantity } : item));
        }
    };

    const toggleCart = () => setShowCart(!showCart);

    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_URL_API_BACKEND}/order/${orderId}/status`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(orders.map(order => order._id === orderId ? { ...order, status: response.data.order.status } : order));
            console.log("Updated order status:", response.data.order);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={3} style={{ bottom: '0', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '20px', paddingTop:'50px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
                    <h5>Danh sách đơn hàng</h5>
                    <Tabs defaultActiveKey="counter" id="order-tabs" className="mb-3">
                        <Tab eventKey="counter" title="Tại quầy">
                            <Accordion>
                                {orders.filter(order => order.order_type === 'counter' && order.bill.isPaid).map(order => (
                                    <Accordion.Item eventKey={order._id} key={order._id}>
                                        <Accordion.Header>{order.bill.customer_name} - {new Date(order.bill.created_at).toLocaleString()}</Accordion.Header>
                                        <Accordion.Body>
                                            <p><strong>Loại đơn:</strong> {order.order_type}</p>
                                            <p><strong>Trạng thái:</strong> <span style={{ color: order.status === 'done' ? 'green' : order.status === 'on going' ? 'orange' : 'red', fontWeight: 'bold' }}>{order.status}</span></p>
                                            <p><strong>Tổng tiền:</strong> {order.bill.total_amount.toLocaleString()} đ</p>
                                            <p><strong>Danh sách món:</strong></p>
                                            <ul>
                                                {order.bill.items.map((item, index) => (
                                                    <li key={`${item.item_id._id}-${index}`}>{item.item_id.name} - Số lượng: {item.quantity} - Giá: {item.price.toLocaleString()} đ</li>
                                                ))}
                                            </ul>
                                            <p><strong>Ghi chú</strong> {order.note}</p>
                                            <div>
                                                <Button variant="success" onClick={() => updateOrderStatus(order._id, 'done')}>Hoàn thành</Button>
                                                <Button variant="warning" onClick={() => updateOrderStatus(order._id, 'on going')}>Đang làm</Button>
                                                <Button variant="danger" onClick={() => updateOrderStatus(order._id, 'cancel')}>Hủy</Button>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Tab>
                        <Tab eventKey="online" title="Online">
                            <Accordion>
                                {orders.filter(order => order.order_type !== 'counter' && order.bill.isPaid).map(order => (
                                    <Accordion.Item eventKey={order._id} key={order._id}>
                                        <Accordion.Header>{order.bill.customer_name} - {new Date(order.bill.created_at).toLocaleString()}</Accordion.Header>
                                        <Accordion.Body>
                                            <p><strong>Địa chỉ:</strong> {order.bill.customer_address}</p>
                                            <p><strong>Số điện thoại:</strong> {order.bill.customer_phone}</p>
                                            <p><strong>Thời gian giao hàng:</strong> {order.bill.delivery_time}</p>
                                            <p><strong>Phương thức giao hàng:</strong> {order.bill.delivery_method}</p>
                                            <p><strong>Loại đơn:</strong> {order.order_type}</p>
                                            <p><strong>Trạng thái:</strong> <span style={{ color: order.status === 'done' ? 'green' : order.status === 'on going' ? 'orange' : 'red', fontWeight: 'bold' }}>{order.status}</span></p>
                                            <p><strong>Tổng tiền:</strong> {order.bill.total_amount.toLocaleString()} đ</p>
                                            <p><strong>Danh sách món:</strong></p>
                                            <ul>
                                                {order.bill.items.map((item, index) => (
                                                    <li key={`${item.item_id._id}-${index}`}>{item.item_id.name} - Số lượng: {item.quantity} - Giá: {item.price.toLocaleString()} đ</li>
                                                ))}
                                            </ul>
                                            <div>
                                                <Button variant="success" onClick={() => updateOrderStatus(order._id, 'done')}>Hoàn thành</Button>
                                                <Button variant="warning" onClick={() => updateOrderStatus(order._id, 'on going')}>Đang làm</Button>
                                                <Button variant="danger" onClick={() => updateOrderStatus(order._id, 'cancel')}>Hủy</Button>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Tab>
                    </Tabs>
                </Col>
                {/* Main Content */}
                <Col md={6}>
                    {/* Category List */}
                    <Row className="justify-content-center my-3" style={{ paddingTop: '50px' }}>
                        {categories.map(category => (
                            <Col xs={3} md={2} key={category._id} className="text-center">
                                <Button
                                    onClick={() => setSelectedCategory(category._id)}
                                    className={`w-100 py-2 ${selectedCategory === category._id ? 'btn-danger' : 'btn-light'}`}
                                    style={{ borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem' }} // Adjust font size
                                >
                                    {category.name}
                                </Button>
                            </Col>
                        ))}
                    </Row>

                    {/* Dish List */}
                    <Row >
                        {dishes.length > 0 ? (
                            dishes.map(dish => (
                                <Col md={6} key={dish._id} className="mb-2">
                                    <Card style={{
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                        transition: 'transform 0.3s ease-in-out',
                                        cursor: 'pointer',
                                        width: '100%' // Adjust card width
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>                                        
                                        <Card.Body className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <Card.Img
                                                    variant="left"
                                                    src={dish.img || 'https://via.placeholder.com/50'}
                                                    alt={dish.name}
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                                                    style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '5px' }} // Small image
                                                />
                                                <Card.Title className="fw-bold mb-0 ms-3" style={{ fontSize: '1rem' }}>{dish.name}</Card.Title> {/* Adjust font size */}
                                            </div>
                                            <Button variant="danger" className="fw-bold" onClick={() => addToCart(dish)} style={{ fontSize: '0.9rem' }}>Thêm</Button> {/* Adjust font size */}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p className="text-center w-100">Chưa có món ăn trong danh mục này</p>
                        )}
                    </Row>
                </Col>
                {/* Cart Sidebar */}
                <Col md={3} style={{ top: '50px', bottom: '0', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '20px', paddingTop:'0px', boxShadow: '-2px 0 5px rgba(0,0,0,0.1)' }}>
                    <h5>Giỏ hàng</h5>
                    <CartStaff cartItems={cartItems} removeFromCart={removeFromCart} updateCartItemQuantity={updateCartItemQuantity} />
                </Col>
            </Row>
        </Container>
    );
};

export default StaffOrder;