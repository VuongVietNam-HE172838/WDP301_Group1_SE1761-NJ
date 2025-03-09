const Bill = require('../models/bill');
const Dish = require('../models/dish');

exports.callBackPayment = async (req, res) => {
    const data = req.body;
    const billId = data.payment.content;

    try {
        // Find the bill by ID
        const bill = await Bill.findById(billId);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Update the isPaid status of the bill
        bill.isPaid = true;
        await bill.save();

        // Update the quantity of each dish in the bill
        for (const item of bill.items) {
            const dish = await Dish.findById(item.item_id);
            if (dish) {
                dish.quantity -= item.quantity;
                await dish.save();
            }
        }

        res.status(200).json({ message: 'Payment processed and quantities updated' });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createBill = async (req, res) => {

    try {
        const { cartItems, deliveryMethod } = req.body;
        const userId = req.user.accountId;

        const totalAmount = cartItems.reduce((total, item) => total + item.optional.price * item.quantity, 0);

        const items = cartItems.map(item => ({
            item_id: item.id,
            quantity: item.quantity,
            price: item.optional.price,
        }));

        const newBill = new Bill({
            user_id: userId,
            total_amount: totalAmount,
            items,
            delivery_method: deliveryMethod,
        });

        await newBill.save();

        res.status(201).json({ message: 'Bill created successfully', bill: newBill });
    } catch (error) {
        console.error('Error creating bill:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.checkPaymentStatus = async (req, res) => {
    const { billId } = req.params;
  
    try {
      const bill = await Bill.findById(billId);
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }
  
      res.status(200).json({ isPaid: bill.isPaid });
    } catch (error) {
      console.error('Error checking payment status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };