import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart, updateCartItemQuantity }) => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState(cartItems.map(item => ({ ...item, selected: true })));
    const [inputValues, setInputValues] = useState({}); // State để quản lý giá trị hiển thị của input

    useEffect(() => {
        setSelectedItems(cartItems.map(item => ({ ...item, selected: true })));
        setInputValues(cartItems.reduce((acc, item) => {
            acc[item.dish._id] = item.quantity.toString(); // Khởi tạo giá trị hiển thị từ số lượng
            return acc;
        }, {}));
    }, [cartItems]);

    const totalPrice = selectedItems.reduce((total, item) => item.selected ? total + (item.dish.optional?.price || 0) * item.quantity : total, 0);

    const isOrderButtonEnabled = selectedItems.some(item => item.selected); // Kiểm tra nếu có ít nhất một mục được chọn

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
        navigate('/confirm-order', { state: { cartItems: formattedCartItems, totalPrice } });
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
        } else if (quantity > maxQuantity) {
            updateCartItemQuantity(dishId, maxQuantity); // Set to max quantity if exceeded
        } else {
            updateCartItemQuantity(dishId, quantity);
        }
    };

    const handleQuantityInputChange = (dishId, value, maxQuantity) => {
        const sanitizedValue = value.replace(/[^0-9]/g, ""); // Loại bỏ ký tự không phải số
        const quantity = sanitizedValue === "" ? 0 : parseInt(sanitizedValue, 10); // Chuyển thành số hoặc 0 nếu rỗng

        // Cập nhật giá trị hiển thị ngay lập tức
        setInputValues(prev => ({ ...prev, [dishId]: sanitizedValue }));

        if (quantity <= 0) {
            updateCartItemQuantity(dishId, 1); // Đặt số lượng về 1 nếu không hợp lệ
        } else if (quantity > maxQuantity) {
            updateCartItemQuantity(dishId, maxQuantity); // Đặt số lượng về tối đa nếu vượt quá
        } else {
            updateCartItemQuantity(dishId, quantity); // Cập nhật số lượng hợp lệ
        }
    };

    return (
        <Container>
            <h2 className="my-4">Giỏ hàng</h2>
            {cartItems.length > 0 ? (
                <>
                    {selectedItems.map((item, index) => (
                        <Card key={item._id} className="mb-3">
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
                                                value={inputValues[item.dish._id] || ""}
                                                onChange={(e) => handleQuantityInputChange(item.dish._id, e.target.value, item.dish.quantity)}
                                                className="mx-2"
                                                style={{ width: '60px', textAlign: 'center' }}
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
                                        <Button variant="danger" className="mt-2" onClick={() => removeFromCart(item.dish._id)}>Xóa</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                    <div className="text-end">
                        <h4 className="fw-bold">Tổng giá: {totalPrice.toLocaleString()} đ</h4>
                        <Button 
                            variant="success" 
                            onClick={handleOrder} 
                            disabled={!isOrderButtonEnabled} // Vô hiệu hóa nút nếu không có mục nào được chọn
                        >
                            Đặt hàng
                        </Button>
                    </div>
                </>
            ) : (
                <p className="text-center">Giỏ hàng trống</p>
            )}
        </Container>
    );
};

export default Cart;