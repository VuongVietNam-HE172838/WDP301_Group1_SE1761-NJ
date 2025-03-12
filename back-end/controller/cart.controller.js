const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Dish = require('../models/dish');

const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ account_id: userId }).populate('items');

        if (!cart) {
            cart = new Cart({ account_id: userId });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const addItemToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { dish_id, quantity, note } = req.body;

        let cart = await Cart.findOne({ account_id: userId });

        if (!cart) {
            cart = new Cart({ account_id: userId });
            await cart.save();
        }

        // Check if the dish already exists in the cart
        let cartItem = await CartItem.findOne({ cart_id: cart._id, dish_id });

        if (cartItem) {
            // If the dish exists, update the quantity
            cartItem.quantity += quantity;
            cartItem.note = note;
            await cartItem.save();
        } else {
            // If the dish does not exist, create a new cart item
            cartItem = new CartItem({ cart_id: cart._id, dish_id, quantity, note });
            await cartItem.save();

            cart.items.push(cartItem._id);
            await cart.save();
        }

        res.status(201).json({ message: 'Item added to cart', cartItem });
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cartItemId, quantity, note } = req.body;
        // Find the cart for the user
        const cart = await Cart.findOne({ account_id: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        // Find the cart item using cartId and dishId
        const cartItem = await CartItem.findOneAndUpdate(
            { cart_id: cart._id, dish_id: cartItemId },
            { quantity, note },
            { new: true, runValidators: true }
        );

        // if (!cartItem) {
        //     return res.status(404).json({ message: 'Cart item not found' });
        // }

        res.json(cartItem);
    } catch (error) {
        console.error('Error updating cart item:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cartItemId } = req.params;

        // Find the cart for the user
        const cart = await Cart.findOne({ account_id: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the cart item using cartId and dishId
        const cartItem = await CartItem.findOneAndDelete({ cart_id: cart._id, dish_id: cartItemId });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await Cart.updateOne({ _id: cart._id }, { $pull: { items: cartItem._id } });

        res.json({ message: 'Cart item removed' });
    } catch (error) {
        console.error('Error removing cart item:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getCart, addItemToCart, updateCartItem, removeCartItem };