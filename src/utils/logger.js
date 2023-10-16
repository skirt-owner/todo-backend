const winston = require('winston');

const levels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    colors: {
        error: 'bold red',
        warn: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'white'
    }
};

winston.addColors(levels.colors);

const format = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss:ms'
    }),
    winston.format.colorize({
        all: true
    }),
    winston.format.printf(
        (info) =>  `${info.timestamp} ${info.level}: ${info.message}`
    ),
    // winston.format.prettyPrint(),
);

const transports = [
    new winston.transports.Console({
        level: 'debug'
    }),
    
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
    }),

    new winston.transports.File({
        filename: 'logs/all.log'
    })
];

const logger = winston.createLogger({
    levels: levels.levels,
    format: format,
    transports: transports,
});

module.exports = logger;