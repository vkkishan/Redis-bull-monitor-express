const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queue.controller");
const { validate } = require("../middlewares/validation");
const queueValidation = require("../validations/queue.validation");

// Add email job to queue
router.get("/get/:jobId", queueController.getJob);

router.post("/add", validate(queueValidation.addJob), queueController.addJob);

router.put("/update/:jobId", queueController.updateJob);

router.delete("/delete/:jobId", queueController.removeJob);

// Notification
router.post("/notification", queueController.notificationJob);

module.exports = router;
