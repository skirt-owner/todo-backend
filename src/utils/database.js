const { Sequelize } = require('sequelize');

const logger = require('./logger');
const { db } = require('./dotenv'); 

const sequelize = new Sequelize({
    database: db.name,
    username: db.username,
    password: db.password,
    host: db.host,
    port: db.port,
    dialect: 'postgres',
    logging: (message) => {
        logger.debug(message);
    },
});

async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        logger.info('Connected to the PostgreSQL database');
    } catch (error) {
        logger.error(`Unable to connect to the PostgreSQL database: ${error.message}`);
    }
};

testDatabaseConnection();

module.exports = sequelize;