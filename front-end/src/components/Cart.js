import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart, updateCartItemQuantity }) => {
    const navigate = useNavigate();
    const totalPrice = cartItems.reduce((total, item) => total + (item.optional?.price || 0) * item.quantity, 0);

    const handleOrder = () => {
        navigate('/confirm-order', { state: { cartItems, totalPrice } });
    };

    return (
        <Container>
            <h2 className="my-4">Giỏ hàng</h2>
            {cartItems.length > 0 ? (
                <>
                    {cartItems.map(item => (
                        <Card key={item._id} className="mb-3">
                            <Card.Body>
                                <Row>
                                    <Col md={8}>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                        <Card.Text className="fw-bold text-danger">
                                            {item.optional?.price ? `${item.optional.price.toLocaleString()} đ` : 'N/A'}
                                        </Card.Text>
                                    </Col>
                                    <Col md={4} className="text-end">
                                        <Button variant="danger" onClick={() => removeFromCart(item._id)}>Xóa</Button>
                                        <div className="d-flex justify-content-end align-items-center mt-2">
                                            <Button variant="secondary" size="sm" onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}>-</Button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <Button variant="secondary" size="sm" onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}>+</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                    <div className="text-end">
                        <h4 className="fw-bold">Tổng giá: {totalPrice.toLocaleString()} đ</h4>
                        <Button variant="success" onClick={handleOrder}>Đặt hàng</Button>
                    </div>
                </>
            ) : (
                <p className="text-center">Giỏ hàng trống</p>
            )}
        </Container>
    );
};

export default Cart;