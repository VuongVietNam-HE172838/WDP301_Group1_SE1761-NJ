import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = ({ cartItemCount, toggleCart, showCart }) => {
    if (showCart) return null; // Hide CartIcon when cart is open

    return (
        <Button variant="light" onClick={toggleCart} style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 1050 }}>
            <FaShoppingCart size={24} />
            {cartItemCount > 0 && (
                <Badge pill bg="danger" style={{ position: 'absolute', top: '0', right: '0' }}>
                    {cartItemCount}
                </Badge>
            )}
        </Button>
    );
};

export default CartIcon;