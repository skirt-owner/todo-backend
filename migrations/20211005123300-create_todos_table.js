'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
        async up (queryInterface, Sequelize) {
            await queryInterface.createTable('Todos', {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                completed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.fn('NOW'),
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.fn('NOW'),
                },
            });
        },
        down: async (queryInterface, Sequelize) => {
                await queryInterface.dropTable('Todos');
        }
};
