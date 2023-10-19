const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../utils/database');
const logger = require('../utils/logger');

const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
    },
});

Todo.beforeCreate(async (todo, options) => {
    logger.info(`Creating new todo with ID:${todo.id}`);
    todo.createdAt = Sequelize.fn('NOW');
    todo.updatedAt = Sequelize.fn('NOW');
});

Todo.beforeUpdate(async (todo, options) => {
    logger.info(`Updating todo with ID:${todo.id}`);
    todo.updatedAt = Sequelize.fn('NOW');
});

Todo.beforeDestroy(async (todo, options) => {
    logger.info(`Deleting todo with ID:${todo.id}meme`);
})

module.exports = { Todo };
