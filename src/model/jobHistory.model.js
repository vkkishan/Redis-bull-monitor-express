const mongoose = require("mongoose");
const { QUEUE_TYPES } = require("../helper/constant.helper");

const jobHistorySchema = mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
    },
    queueName: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: [QUEUE_TYPES.delay, QUEUE_TYPES.completed, QUEUE_TYPES.failed],
      required: true,
    },
    delete_status: {
      type: String,
      enum: [QUEUE_TYPES.removed, QUEUE_TYPES.cleaned],
    },
    processedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    removedAt: {
      type: Date,
      default: null,
    },
    failedAt: [
      {
        error: {
          type: String,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamp: true,
    versionKey: false,
  }
);

const jobHistory = mongoose.model("job_history", jobHistorySchema);

module.exports = jobHistory;
