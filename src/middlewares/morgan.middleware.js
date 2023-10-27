const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const logger = require('../utils/logger');

morgan.token('requestId', (req, res) => {
    return res.getHeader('X-Request-ID');
});  

const stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

const morganMiddleware = morgan(
    ':requestId :remote-addr :method :url :status :res[content-length] - :response-time ms',
    {
        stream: stream,
    }
);

module.exports = morganMiddleware;