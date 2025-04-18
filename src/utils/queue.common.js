const Queue = require("bull");
const redisConfig = require("../config/redis.config");
const { jobHistory } = require("../model");
const { jobHistoryService } = require("../services");
const { QUEUE_TYPES } = require("../helper/constant.helper");
// const BULL_QUEUE = require("../constants/bull-queue.constants");
// const bullJobService = require("../services/bull-job.service");

/**
 * Create and configure a Bull queue with event listeners
 * @param {string} queueName - The name of the queue
 * @param {function} processCallback - The function to process jobs in this queue
 * @param {object} options - Optional configuration for the queue
 * @returns {Queue} Configured Bull queue
 */
const createQueue = (queueName, processCallback, options = {}) => {
  // Default queue options
  const defaultOptions = {
    redis: redisConfig,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: false, // true is after the completed queue then remove directly
      removeOnFail: false, //  { ageInSeconds: 3600 } => Delete after 1 hour OR If add 10 => most recent failures OR If true failed jobs are automatically deleted from the queue.
      // Can be overridden by options parameter
    },
  };

  // Merge default options with provided options
  const queueOptions = {
    ...defaultOptions,
    defaultJobOptions: {
      ...defaultOptions.defaultJobOptions,
      ...(options.defaultJobOptions || {}),
    },
  };

  // Create the queue
  const queue = new Queue(queueName, queueOptions);

  // Set up job processing
  queue.process(async (job, done) => {
    try {
      await processCallback(job);
      done();
    } catch (error) {
      done(error);
    }
  });

  // Handle completed jobs
  queue.on("completed", async (job, err) => {
    console.log(`=====job.data===completed==>`, job);
    // Update job status in database if bullJobId is provided
    if (job.id) {
      await jobHistoryService.update(
        { jobId: job.id, queueName: job.queue.name },
        {
          status: QUEUE_TYPES.completed,
          completedAt: new Date(),
        }
      );
    }
  });

  // Handle cleaned jobs
  queue.on("cleaned", async (job) => {
    console.log(`=====job.data===cleaned==>`, job);
    // Update job status in database if bullJobId is provided
    if (job.length) {
      await jobHistoryService.updateMany(
        { jobId: { $in: job } },
        {
          delete_status: QUEUE_TYPES.cleaned,
          removedAt: new Date(),
        }
      );
    }
  });

  // Handle removed jobs
  queue.on("removed", async (job) => {
    console.log(`=====job.data===removed==>`, job.data);
    // Update job status in database if bullJobId is provided
    if (job.id) {
      await jobHistoryService.update(
        { jobId: job.id, queueName: job.queue.name },
        {
          delete_status: QUEUE_TYPES.removed,
          removedAt: new Date(),
        }
      );
    }
  });

  // Handle failed jobs
  queue.on("failed", async (job, err) => {
    console.log(`=====job.data===failed==>`, job.data);
    // Update job status in database if bullJobId is provided
    if (job.id) {
      await jobHistoryService.update(
        { jobId: job.id, queueName: job.queue.name },
        {
          $set: {
            status: QUEUE_TYPES.failed,
          },
          $push: {
            failedAt: {
              error: job.failedReason,
              date: new Date(),
            },
          },
        }
      );
    }
  });

  // Handle active jobs
  queue.on("active", async (job) => {
    console.log(`=====job.data===active==>`, job.data);
  });

  // Handle stalled jobs
  queue.on("stalled", async (job) => {
    console.log(`=====job.data===stalled==>`, job);
  });

  // Handle progress jobs
  queue.on("progress", async (job) => {
    console.log(`=====job.data===progress==>`, job.data);
  });

  // Handle paused jobs
  queue.on("paused", async (job) => {
    console.log(`=====job.data===paused==>`, job.data);
  });

  // Handle resumed jobs
  queue.on("resumed", async (job) => {
    console.log(`=====job.data===resumed==>`, job.data);
  });

  // Handle drained jobs
  queue.on("drained", async (job) => {
    console.log(`=======drained==>`);
  });

  // Handle waiting jobs
  queue.on("waiting", async (job) => {
    console.log(`=======waiting==>`);
  });

  return queue;
};

module.exports = { createQueue };
