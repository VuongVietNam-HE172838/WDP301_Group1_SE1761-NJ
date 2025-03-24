const express = require("express");
const router = express.Router();
const feedbackController = require("../controller/feedback.controller");

router.get("/order/:orderId", feedbackController.getFeedbackByOrder);
router.post("/", feedbackController.addFeedback);
router.put("/:feedbackId", feedbackController.updateFeedback);
router.delete("/:feedbackId", feedbackController.deleteFeedback);
router.get("/", feedbackController.getAllFeedback);

module.exports = router;
