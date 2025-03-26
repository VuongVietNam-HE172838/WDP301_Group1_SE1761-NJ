const Feedback = require("../models/feedback");
const Order = require("../models/order");
const AccountDetail = require("../models/accountDetail"); // Import AccountDetail

// Thêm feedback
exports.addFeedback = async (req, res) => {
    try {
        let { order, rating, comment, feedback_by } = req.body;

        // Kiểm tra dữ liệu nhập vào
        if (!rating || !comment) {
            return res.status(400).json({ message: "Thiếu rating hoặc comment" });
        }

        // Nếu không có `order`, lấy Order gần nhất của `feedback_by`
        if (!order) {
            if (!feedback_by || !mongoose.Types.ObjectId.isValid(feedback_by)) {
                return res.status(400).json({ message: "Thiếu order hoặc feedback_by hợp lệ" });
            }

            const latestOrder = await Order.findOne({ order_by: feedback_by })
                .sort({ updated_at: -1 }) // Sắp xếp theo thời gian gần nhất
                .select("_id order_by");

            if (!latestOrder) {
                return res.status(404).json({ message: "Không tìm thấy đơn hàng nào của người dùng này" });
            }

            order = latestOrder._id; // Lấy _id của Order
            feedback_by = latestOrder.order_by; // Lấy order_by từ Order
        }

        // Nếu `feedback_by` chưa có, lấy từ `order`
        if (!feedback_by) {
            if (!mongoose.Types.ObjectId.isValid(order)) {
                return res.status(400).json({ message: "Order ID không hợp lệ" });
            }

            const orderData = await Order.findById(order).select("order_by");
            if (!orderData) {
                return res.status(404).json({ message: "Order không tồn tại" });
            }

            feedback_by = orderData.order_by; // Lấy `order_by` của order
        }

        // Tìm AccountDetail bằng feedback_by (Account ID)
        const accountDetail = await AccountDetail.findOne({ account_id: feedback_by });
        if (!accountDetail) {
            return res.status(404).json({ message: "Không tìm thấy chi tiết tài khoản" });
        }

        feedback_by = accountDetail._id; // Gán ID của AccountDetail vào feedback_by
        
        // Kiểm tra lại trước khi lưu
        if (!order || !feedback_by) {
            return res.status(400).json({ message: "Thiếu order hoặc feedback_by hợp lệ" });
        }

        // **Kiểm tra xem order này đã có feedback chưa**
        const existingFeedback = await Feedback.findOne({ order });
        if (existingFeedback) {
            return res.status(400).json({ message: "Đơn hàng này đã có feedback!" });
        }

        // Tạo feedback mới
        const newFeedback = new Feedback({ order, rating, comment, feedback_by });
        await newFeedback.save();

        res.status(201).json({ message: "Thêm feedback thành công!", feedback: newFeedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Sửa feedback
exports.updateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { rating, comment } = req.body;

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { rating, comment },
            { new: true } // Trả về dữ liệu sau khi cập nhật
        ).populate({ path: "order", model: "Order", select: "_id" })
        .populate({
            path: "feedback_by",
            model: "AccountDetail",
            select: "full_name" 
        });

        if (!updatedFeedback) {
            return res.status(404).json({ message: "Không tìm thấy feedback" });
        }

        // Format lại dữ liệu
        const formattedFeedback = {
            _id: updatedFeedback._id,
            order: updatedFeedback.order?._id || null,
            rating: updatedFeedback.rating,
            comment: updatedFeedback.comment,
            feedback_by: updatedFeedback.feedback_by?.full_name || "Không có tên",
            created_at: updatedFeedback.created_at
        };

        res.status(200).json({ message: "Cập nhật feedback thành công", feedback: formattedFeedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


// Xóa feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

        if (!deletedFeedback) {
            return res.status(404).json({ message: "Không tìm thấy feedback" });
        }

        res.status(200).json({ message: "Xóa feedback thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
        const feedbackList = await Feedback.find()
            .populate({
                path: "order",
                model: "Order",
                populate: {
                    path: 'bill',
      populate: {
        path: 'items.item_id',
        model: 'Dish'
      }
                }
            })
            .populate({
                path: "feedback_by",
                model: "AccountDetail",
                select: "full_name"
            });

            console.log('feedback controller: ',feedbackList);

        // 🛑 In log ra để kiểm tra dữ liệu nhận được từ DB

        // Format lại dữ liệu
        const formattedFeedbacks = feedbackList.map(feedback => ({
            _id: feedback._id,
            order: feedback.order ? {
                _id: feedback.order._id,
                items: (feedback.order.bill?.items || []).map(item => ({
                    name: item.item_id?.name || "Không có tên món",
                    img: item.item_id?.img || "",
                    
                })),
                totalAmount: feedback.order.bill?.total_amount || 0,
                status: feedback.order.status || "Chưa xác định"
            } : null,
            rating: feedback.rating,
            comment: feedback.comment,
            feedback_by: feedback.feedback_by?.full_name || "Không có tên",
            created_at: feedback.created_at
        }));

        

        res.status(200).json({ feedbacks: formattedFeedbacks });
    } catch (error) {
        console.error("Lỗi khi lấy feedback:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};





exports.getFeedbackByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const feedbackList = await Feedback.find({ order: orderId })
            .populate({ path: "order", model: "Order", select: "_id" })
            .populate({
                path: "feedback_by",
                model: "AccountDetail",
                select: "full_name" 
            });

        // Format lại dữ liệu
        const formattedFeedbacks = feedbackList.map(feedback => ({
            _id: feedback._id,
            order: feedback.order?._id || null,
            rating: feedback.rating,
            comment: feedback.comment,
            feedback_by: feedback.feedback_by?.full_name || "Không có tên",
            created_at: feedback.created_at
        }));

        res.status(200).json({ feedbacks: formattedFeedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
