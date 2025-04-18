const { jobHistory } = require("../model");

/**
 * Create a jobHistory.
 * @returns {Promise<jobHistory>}
 */
exports.create = async (filter) => {
  return jobHistory.create(filter);
};

/**
 * Get a jobHistory.
 * @returns {Promise<jobHistory>}
 */
exports.get = (filter) => {
  return jobHistory.findOne(filter);
};

/**
 * Get list jobHistory.
 * @returns {Promise<jobHistory>}
 */
exports.getList = (filter, sort) => {
  return jobHistory.find(filter).sort(sort);
};

/**
 * Update jobHistory.
 * @returns {Promise<jobHistory>}
 */
exports.update = (filter, data) => {
  return jobHistory.findOneAndUpdate(filter, data, { new: true });
};

/**
 * Update Many jobHistory.
 * @returns {Promise<jobHistory>}
 */
exports.updateMany = (filter, data) => {
  return jobHistory.updateMany(filter, data);
};

/**
 * Delete jobHistory.
 * @returns {Promise<jobHistory>}
 */
exports.delete = (filter) => {
  return jobHistory.deleteOne(filter);
};

/**
 * Aggregate jobHistory.
 * @returns {Promise<jobHistory>}
 */
exports.aggregate = (filter) => {
  return jobHistory.aggregate(filter);
};
