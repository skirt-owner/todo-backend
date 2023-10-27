const { v4: uuidv4 } = require('uuid');

const requestIdMiddleware = (req, res, next) => {
    const requestId = uuidv4();
    res.setHeader('X-Request-ID', requestId);
    next();
};

module.exports = requestIdMiddleware;
