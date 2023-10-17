const express = require('express');

const morganMiddleware = require('./middlewares/morgan.middleware');
const responseTimeMiddleware = require('./middlewares/responseTime.middleware');

const { handleRouteNotFoundError, handleIncorrectPath } = require('./controllers/todoController');
const todoRoutes = require('./routes/todoRoutes');
const logger = require('./utils/logger');

const app = express();

const serverPort = 3000;

app.use(express.json());

app.use(responseTimeMiddleware);
app.use(morganMiddleware);

app.use('/api', todoRoutes);

app.get('/error', handleRouteNotFoundError);

app.use('*', handleIncorrectPath);

app.listen(serverPort, () => {
    logger.info(`Server is running on port ${serverPort}`);
});