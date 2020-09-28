const rateLimit = require('express-rate-limit'),
    slowDown = require('express-slow-down'),
    configs = require('../configs/index');

module.exports.limiter = () => {
    return rateLimit({
        windowMs: configs.requests.limiter.rateLimitWindow,
        max: configs.requests.limiter.maxRequestsPerRateLimitWindow,
        message: 'Too many requests, try again later...'
    });
}

module.exports.slower = () => {
    return slowDown({
        windowMs: configs.requests.slower.rateLimitWindow,
        delayAfter: configs.requests.slower.delayAfterPerRateLimitWindow,
        delayMs: configs.requests.slower.delayMs 
    });
}