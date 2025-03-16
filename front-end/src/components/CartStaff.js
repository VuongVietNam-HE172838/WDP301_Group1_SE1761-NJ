import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CartStaff = ({ cartItems, removeFromCart, updateCartItemQuantity }) => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState(cartItems.map(item => ({ ...item, selected: true })));

    useEffect(() => {
        setSelectedItems(cartItems.map(item => ({ ...item, selected: true })));
    }, [cartItems]);

    const totalPrice = selectedItems.reduce((total, item) => item.selected ? total + ((item.dish.optional?.price || 0) * item.quantity) : total, 0);

    const handleOrder = () => {
        const formattedCartItems = selectedItems
            .filter(item => item.selected && item.dish.quantity > 0)
            .map(item => ({
                id: item.dish._id,
                name: item.dish.name,
                optional: item.dish.optional || { size: 'Không có thông tin', price: 0 },
                img: item.dish.img,
                quantity: item.quantity,
                note: item.note
            }));
        navigate('/confirm-orderStaff', { state: { cartItems: formattedCartItems, totalPrice } });
    };

    const handleSelectItem = (index) => {
        setSelectedItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index].selected = !newItems[index].selected;
            return newItems;
        });
    };

    const handleUpdateQuantity = (dishId, quantity, maxQuantity) => {
        if (quantity <= 0) {
            removeFromCart(dishId);
        } else if (quantity <= maxQuantity) {
            updateCartItemQuantity(dishId, quantity);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Giỏ hàng</h2>
            {cartItems.length > 0 ? (
                <>
                    {selectedItems.map((item, index) => (
                        <Card key={`${item.dish._id}-${index}`} className="mb-3">
                            <Card.Body>
                                <Row>
                                    <Col md={1} className="d-flex align-items-center">
                                        <Form.Check 
                                            type="checkbox" 
                                            checked={item.selected} 
                                            onChange={() => handleSelectItem(index)} 
                                            disabled={item.dish.quantity === 0}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Card.Img
                                            variant="top"
                                            src={item.dish.img || 'https://via.placeholder.com/150'}
                                            alt={item.dish.name}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                            style={{ height: '150px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <Card.Title>{item.dish.name || "Không xác định"}</Card.Title>
                                        <Card.Text><strong>Kích thước:</strong> {item.dish.optional?.size || 'Không có thông tin'}</Card.Text>
                                        <Card.Text className="fw-bold text-danger">
                                            {item.dish.optional?.price ? `${item.dish.optional.price.toLocaleString()} đ` : 'Chưa có giá'}
                                        </Card.Text>
                                        <div className="d-flex justify-content-end align-items-center mt-2">
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                onClick={() => handleUpdateQuantity(item.dish._id, item.quantity - 1, item.dish.quantity)}
                                            >
                                                -
                                            </Button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                onClick={() => handleUpdateQuantity(item.dish._id, item.quantity + 1, item.dish.quantity)}
                                                disabled={item.quantity >= item.dish.quantity}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <Button variant="danger" className="mt-2" onClick={() => removeFromCart(item.dish._id)}>Xóa</Button>
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

export default CartStaff;