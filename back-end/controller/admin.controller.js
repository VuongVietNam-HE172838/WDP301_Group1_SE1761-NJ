const Account = require('../models/account');
const Order = require('../models/order');
const Bill = require('../models/bill');

// Get paginated list of accounts
const getAccounts = async (req, res) => {
  try {
    const page = parseInt(req.query.pageNo) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * limit;

    // Extract filters from query parameters
    const { role, isVerified, user_name } = req.query;
    // Build the query object
    const query = {};

    if (role) {
      // Filter by role name (populate role_id and match by name)
      const roleDoc = await Role.findOne({ name: role });
      if (roleDoc) {
        query.role_id = roleDoc._id;
      } else {
        return res.status(404).json({ message: 'Role not found' });
      }
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true'; // Convert string to boolean
    }

    if (user_name) {
      query.user_name = { $regex: user_name, $options: 'i' }; // Case-insensitive search
    }

    // Fetch accounts with filters, pagination, and role population
    const accounts = await Account.find(query)
      .populate('role_id', 'name') // Populate role name
      .skip(skip)
      .limit(limit);
    const totalAccounts = await Account.countDocuments(query);

    res.json({
      accounts,
      totalPages: Math.ceil(totalAccounts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error });
  }
};

const updateAccountVerification = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { isVerified } = req.body;

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { isVerified },
      { new: true }
    );

    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: 'Error updating account verification', error });
  }
};

const getAccountStatistics = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 3; // Default to 3 months
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    const accountStats = await Account.aggregate([
      {
        $match: {
          start_working: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: { $month: "$start_working" }, // Group by month
          totalAccounts: { $sum: 1 }, // Count accounts
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    res.json(accountStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching account statistics', error });
  }
};

// Get order history
const getOrderHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.pageno) || 1; // Use `pageno` for the page number
    const limit = parseInt(req.query.pagesize) || 10; // Use `pagesize` for the limit
    const skip = (page - 1) * limit;

    // Filters from query parameters
    const status = req.query.status || ''; // Status filter
    const customerName = req.query.customerName || ''; // Customer name filter
    const customerPhone = req.query.customerPhone || ''; // Customer phone filter
    const customerAddress = req.query.customerAddress || ''; // Customer address filter
    const startDate = req.query.startDate; // Start date for delivery time filter
    const endDate = req.query.endDate; // End date for delivery time filter

    // Build the query object for the Bill collection
    const billQuery = {
      isPaid: true, // Always filter for bills where isPaid is true
    };

    if (customerName) {
      billQuery.customer_name = { $regex: customerName, $options: 'i' }; // Case-insensitive search
    }
    if (customerPhone) {
      billQuery.customer_phone = { $regex: customerPhone, $options: 'i' };
    }
    if (customerAddress) {
      billQuery.customer_address = { $regex: customerAddress, $options: 'i' };
    }
    if (startDate || endDate) {
      billQuery.delivery_time = {};
      if (startDate) {
        billQuery.delivery_time.$gte = new Date(startDate); // Greater than or equal to startDate
      }
      if (endDate) {
        billQuery.delivery_time.$lte = new Date(endDate); // Less than or equal to endDate
      }
    }

    // Find matching bills
    const matchingBills = await Bill.find(billQuery).select('_id'); // Only select the `_id` field
    const billIds = matchingBills.map(bill => bill._id); // Extract the IDs of the matching bills

    // Build the query object for the Order collection
    const orderQuery = {
      bill: { $in: billIds }, // Filter orders by the matching bill IDs
    };

    if (status) {
      orderQuery.status = { $regex: status, $options: 'i' }; // Case-insensitive search
    }

    // Query to find orders with filters
    const orders = await Order.find(orderQuery)
      .populate({
        path: 'bill',
        populate: {
          path: 'items.item_id', // Populate the dish details
          select: 'name category_id description price img', // Select specific fields from the dish
        },
      })
      .sort({ updated_at: -1 }) // Sort by updated_at in descending order
      .populate('order_by')
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(orderQuery);

    res.json({
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history', error });
  }
};

// Get bill history
const getBillHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bills = await Bill.find()
      .populate('user_id', 'email') // Populate user details
      .populate('items.item_id', 'name price') // Populate item details
      .skip(skip)
      .limit(limit);

    const totalBills = await Bill.countDocuments();

    res.json({
      bills,
      totalPages: Math.ceil(totalBills / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bill history', error });
  }
};

const getRevenueStatistics = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 3;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    // Lọc đơn hàng có trạng thái "done" trước, rồi mới tính doanh thu từ Bill
    const revenueData = await Order.aggregate([
      {
        $match: { status: "done"}, // Lọc đơn hàng có trạng thái "done"
      },
      {
        $lookup: {
          from: "bills",
          localField: "bill",
          foreignField: "_id",
          as: "billDetails",
        },
      },
      { $unwind: "$billDetails" },
      {
        $match: {
          "billDetails.isPaid": true, // Chỉ tính hóa đơn đã thanh toán
          "billDetails.delivery_time": { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: { $month: "$billDetails.delivery_time" },
          totalRevenue: { $sum: "$billDetails.total_amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Lọc đơn hàng có trạng thái "done" trước, rồi đếm số lượng đơn hàng
    const orderData = await Order.aggregate([
      {
        $match: {
          status: "done", // Chỉ lấy đơn có trạng thái "done"
          updated_at: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: { $month: "$updated_at" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      revenueData,
      orderData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error });
  }
};


module.exports = {
  getAccounts,
  getOrderHistory,
  getBillHistory,
  getRevenueStatistics,
  getAccountStatistics,
  updateAccountVerification,
};