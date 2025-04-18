const { REDIS_QUEUE } = require("../helper/constant.helper");
const { createQueue } = require("../utils/queue.common");

// Blog queue processor function
const processBlogJob = async (job) => {
  // Process notification blog logic
  switch (job.data.referenceFrom) {
    case "blog":
      console.log("\x1B[92m==========>\x1B[0m");
      break;

    default:
      break;
  }
};

// Email queue processor function
const processEmailJob = async (job) => {
  console.log("\x1B[92m=====email=====>\x1B[0m", job.data);
  // Process email sending logic
};

// Notification queue processor function
const processNotificationJob = async (job) => {
  console.log("\x1B[92m=====notification=====>\x1B[0m", job.data);
  // Process notification sending logic
};

// Create queues with custom options
const blogQueue = createQueue(REDIS_QUEUE.blog, processBlogJob);

const emailQueue = createQueue(REDIS_QUEUE.email, processEmailJob);

const notificationQueue = createQueue(
  REDIS_QUEUE.notification,
  processNotificationJob,
  {
    defaultJobOptions: {
      removeOnComplete: true, // After processed queue then remove instantly in completed.
    },
  }
);

module.exports = {
  blogQueue,
  emailQueue,
  notificationQueue
};