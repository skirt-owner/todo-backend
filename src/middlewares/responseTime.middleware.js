const logger = require('../utils/logger');

const responseTime = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`Response time: ${duration}ms`);
    });
  
    next();
};

module.exports = responseTime;