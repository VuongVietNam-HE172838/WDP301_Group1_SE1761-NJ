import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartStaff = ({ cartItems, removeFromCart, updateCartItemQuantity }) => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState(cartItems.map(item => ({ ...item, selected: true, error: '' })));

    useEffect(() => {
        setSelectedItems(cartItems.map(item => ({ ...item, selected: true, error: '' })));
    }, [cartItems]);

    const totalPrice = selectedItems.reduce((total, item) => item.selected ? total + ((item.dish.optional?.price || 0) * item.quantity) : total, 0);

    const handleOrder = () => {
        let hasError = false;
        selectedItems.forEach(item => {
            if (item.quantity <= 0) {
                toast.dismiss();
                toast.error('Số lượng món phải lớn hơn 0');
                hasError = true;
            } else if (item.quantity > item.dish.quantity) {
                toast.dismiss();
                toast.error(`Số lượng món không được vượt quá ${item.dish.quantity}`);
                hasError = true;
            }
        });

        if (hasError) return;

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
        setSelectedItems(prevItems => {
            const newItems = prevItems.map(item => {
                if (item.dish._id === dishId) {
                    if (quantity <= 0) {
                        item.error = 'Số lượng món phải lớn hơn 0';
                        toast.dismiss();
                        toast.error('Số lượng món phải lớn hơn 0');
                    } else if (quantity > maxQuantity) {
                        item.error = `Số lượng món không được vượt quá ${maxQuantity}`;
                        toast.dismiss();
                        toast.error(`Số lượng món không được vượt quá ${maxQuantity}`);
                    } else {
                        item.error = '';
                        updateCartItemQuantity(dishId, quantity);
                    }
                }
                return item;
            });
            return newItems;
        });
    };

    const handleQuantityInputChange = (dishId, value, maxQuantity) => {
        const quantity = parseInt(value, 10);
        setSelectedItems(prevItems => {
            const newItems = prevItems.map(item => {
                if (item.dish._id === dishId) {
                    if (isNaN(quantity) || quantity <= 0) {
                        item.error = 'Số lượng món phải lớn hơn 0';
                        toast.dismiss();
                        toast.error('Số lượng món phải lớn hơn 0');
                    } else if (quantity > maxQuantity) {
                        item.error = `Số lượng món không được vượt quá ${maxQuantity}`;
                        toast.dismiss();
                        toast.error(`Số lượng món không được vượt quá ${maxQuantity}`);
                    } else {
                        item.error = '';
                        updateCartItemQuantity(dishId, quantity);
                    }
                }
                return item;
            });
            return newItems;
        });
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
                                    <Col>
                                        <Card.Img
                                            src={item.dish.img || 'https://via.placeholder.com/150'}
                                            alt={item.dish.name}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                            style={{ height: '100px', width:'100px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                        <Card.Title>{item.dish.name || "Không xác định"}</Card.Title>
                                        <Card.Text><strong>Kích thước:</strong> {item.dish.optional?.size || 'Không có thông tin'}</Card.Text>
                                        <Card.Text className="fw-bold text-danger">
                                            {item.dish.optional?.price ? `${item.dish.optional.price.toLocaleString()} đ` : 'Chưa có giá'}
                                        </Card.Text>
                                        <Card.Text className="text-muted">
                                            <strong>Số lượng còn lại:</strong> {item.dish.quantity}
                                        </Card.Text>
                                        <div className="d-flex justify-content-end align-items-center mt-2">
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                onClick={() => handleUpdateQuantity(item.dish._id, item.quantity - 1, item.dish.quantity)}
                                            >
                                                -
                                            </Button>
                                            <Form.Control
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => setSelectedItems(prevItems => {
                                                    const newItems = [...prevItems];
                                                    newItems[index].quantity = e.target.value;
                                                    return newItems;
                                                })}
                                                onBlur={(e) => handleQuantityInputChange(item.dish._id, e.target.value, item.dish.quantity)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleQuantityInputChange(item.dish._id, e.target.value, item.dish.quantity);
                                                    }
                                                }}
                                                className="mx-2"
                                                style={{ width: '100px', textAlign: 'center' }}
                                            />
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                onClick={() => handleUpdateQuantity(item.dish._id, item.quantity + 1, item.dish.quantity)}
                                                disabled={item.quantity >= item.dish.quantity}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        {item.error && <p className="text-danger mt-2">{item.error}</p>}
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