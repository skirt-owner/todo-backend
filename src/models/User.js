// const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = require('../utils/database');
// const logger = require('../utils/logger');
// const { Todo } = require('./Tag');

// const User = sequelize.define('User', {
//     id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     username: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     createdAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.fn('NOW'),
//     },
//     updatedAt: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.fn('NOW'),
//     },
// });

// Todo.beforeCreate(async (todo, options) => {
//     logger.info(`Creating new todo with ID:${todo.id}`);
//     todo.createdAt = Sequelize.fn('NOW');
//     todo.updatedAt = Sequelize.fn('NOW');
// });

// Todo.beforeDestroy(async (todo, options) => {
//     const tags = await todo.getTags();
//     await todo.removeTags(tags);
//     logger.info(`Deleting todo with ID:${todo.id}meme`);
// })

// Todo.beforeUpdate(async (todo, options) => {
//     logger.info(`Updating todo with ID:${todo.id}`);
//     todo.updatedAt = Sequelize.fn('NOW');
// });

// Tag.belongsToMany(Todo, { through: 'TodoTag', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
// Todo.belongsToMany(Tag, { through: 'TodoTag', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// module.exports = { Todo };
