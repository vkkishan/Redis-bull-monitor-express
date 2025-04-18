const { QUEUE_TYPES } = require("../helper/constant.helper");
const { emailQueue, notificationQueue } = require("../helper/job.helper");
const { jobHistoryService } = require("../services");

exports.addJob = async (req, res, next) => {
  try {
    const { delayDate, jobBody } = req.body;

    const targetDate = new Date(delayDate); // Your desired date & time
    const now = new Date();
    const delay = targetDate.getTime() - now.getTime(); // Milliseconds until target

    const job = await emailQueue.add(
      jobBody,
      (jobOptions = {
        delay,
      })
    );

    await jobHistoryService.create({
      jobId: job.id,
      queueName: job.queue.name,
      data: job.data,
      status: QUEUE_TYPES.delay,
      processedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Email job added to queue",
      data: job.data,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await emailQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      jobId,
      // state,
      // progress,
      data: job,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

exports.removeJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const queueName = "email queue";

    await emailQueue.removeJobs(queueName, jobId);

    res.status(200).json({
      success: true,
      message: `Job ${jobId} removed from queue ${queueName}`,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { data } = req.body;

    const queueName = "email queue";

    await emailQueue.updateJob(queueName, jobId, data);

    res.status(200).json({
      success: true,
      message: `Job ${jobId} removed from queue ${queueName}`,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

exports.notificationJob = async (req, res, next) => {
  try {
    const { body, delay } = req.body;

    // Create job options object
    const jobOptions = {};

    // Add delay if specified (in milliseconds)
    if (delay !== undefined && delay !== null) {
      jobOptions.delay = parseInt(delay, 10);
    }

    const job = await notificationQueue.add(
      {
        body,
      },
      jobOptions
    );

    res.status(201).json({
      success: true,
      message: "Email job added to queue",
      jobId: job.id,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};
