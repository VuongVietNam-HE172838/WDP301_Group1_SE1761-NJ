import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import Cart from './Cart';
import CartIcon from './CartIcon';

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cartItems, setCartItems] = useState([]);
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

    const addToCart = (dish) => {
        const existingItem = cartItems.find(item => item._id === dish._id);
        if (existingItem) {
            setCartItems(cartItems.map(item => item._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCartItems([...cartItems, { ...dish, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item._id !== id));
    };

    const updateCartItemQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
        } else {
            setCartItems(cartItems.map(item => item._id === id ? { ...item, quantity } : item));
        }
    };

    const toggleCart = () => setShowCart(!showCart);

    return (
        <Container fluid>
            <Row>
                {/* Main Content */}
                <Col md={{ span: 8, offset: 2 }}>
                    {/* Category List */}
                    <Row className="justify-content-center my-3" style={{ paddingTop: '50px', paddingBottom: '70px' }}>
                        {categories.map(category => (
                            <Col xs={3} md={2} key={category._id} className="text-center">
                                <Button
                                    onClick={() => setSelectedCategory(category._id)}
                                    className={`w-100 py-2 ${selectedCategory === category._id ? 'btn-danger' : 'btn-light'}`}
                                    style={{ borderRadius: '15px', fontWeight: 'bold' }}
                                >
                                    {category.name}
                                </Button>
                            </Col>
                        ))}
                    </Row>

                    {/* Dish List */}
                    <Row>
                        {dishes.length > 0 ? (
                            dishes.map(dish => (
                                <Col md={4} key={dish._id} className="mb-4">
                                    <Card style={{
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                        transition: 'transform 0.3s ease-in-out',
                                        cursor: 'pointer'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                        <Card.Img
                                            variant="top"
                                            src={dish.img || 'https://via.placeholder.com/150'}
                                            alt={dish.name}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                            style={{ height: '400px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
                                        />
                                        <Card.Body>
                                            <Card.Title className="fw-bold">{dish.name}</Card.Title>
                                            <Card.Text className="text-muted">{dish.description || 'Không có mô tả'}</Card.Text>
                                            <Card.Text className="fw-bold text-danger">
                                                {dish.optional?.price ? `${dish.optional.price.toLocaleString()} đ` : 'N/A'}
                                            </Card.Text>
                                            <Button variant="danger" className="w-100 fw-bold" onClick={() => addToCart(dish)}>Thêm</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p className="text-center w-100">Chưa có món ăn trong danh mục này</p>
                        )}
                    </Row>
                </Col>
            </Row>

            {/* Cart Icon */}
            <CartIcon cartItemCount={cartItems.reduce((count, item) => count + item.quantity, 0)} toggleCart={toggleCart} showCart={showCart} />

            {/* Cart Sidebar */}
            <Offcanvas show={showCart} onHide={toggleCart} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Giỏ hàng</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Cart cartItems={cartItems} removeFromCart={removeFromCart} updateCartItemQuantity={updateCartItemQuantity} />
                </Offcanvas.Body>
            </Offcanvas>
        </Container>
    );
};

export default Menu;