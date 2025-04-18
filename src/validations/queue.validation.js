const Joi = require('joi');

/**
 * All job validations are exported from here 👇
 */
module.exports = {
    /**
     * Add job.
     */
    addJob: {
        body: Joi.object().keys({
            delayDate: Joi.string().required(),
            jobBody: Joi.object().required()
        }),
    },
};