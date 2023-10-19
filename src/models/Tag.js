const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../utils/database');
const logger = require('../utils/logger'); 
const { Todo } = require('./Todo');

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    todoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Todo,
          key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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

Todo.hasMany(Tag, { as: 'tags', foreignKey: 'todoId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Tag.belongsTo(Todo, { foreignKey: 'todoId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = { Tag };
