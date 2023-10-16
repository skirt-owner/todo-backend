require('dotenv').config();

module.exports = {
    db: {
        name: process.env.PG_DB_NAME,
        username: process.env.PG_DB_USER,
        password: process.env.PG_DB_PASSWORD,
        host: process.env.PG_DB_HOST,
        port: process.env.PG_DB_PORT
    }
};