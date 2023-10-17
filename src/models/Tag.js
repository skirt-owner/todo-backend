const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../utils/database');
const logger = require('../utils/logger'); 

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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

Tag.beforeDestroy((todo, options) => {
    logger.info(`Deleting tag with ID:${todo.id}`);
});

Tag.beforeCreate((todo, options) => {
    logger.info(`Creating new tag with ID:${todo.id}`);
    todo.createdAt = Sequelize.fn('NOW');
    todo.updatedAt = Sequelize.fn('NOW');
});

Tag.beforeUpdate((todo, options) => {
    logger.info(`Updating tag with ID:${todo.id}`);
    todo.updatedAt = Sequelize.fn('NOW');
});

module.exports = { Tag };
