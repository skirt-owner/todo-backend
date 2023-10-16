const express = require('express');

const morganMiddleware = require('./middlewares/morgan.middleware');
const responseTimeMiddleware = require('./middlewares/responseTime.middleware');
const logger = require('./utils/logger');

const app = express();
const serverPort = 3000;

app.use(express.json());
app.use(responseTimeMiddleware);
app.use(morganMiddleware);

app.get('/api/status', (req, res) => {
    logger.info('API is UP');
    res.status(200).send('The API is up and running!');
});

app.listen(serverPort, () => {
    logger.info(`Server is running on port ${serverPort}`);
});