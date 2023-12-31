const { Sequelize } = require('sequelize');

const { Todo } = require('../models/Todo');
const { Tag } = require('../models/Tag');
const logger = require('../utils/logger');

const getStatus = async (req, res) => {
    res.status(200).json({
        status: 'API is up and running'
    });
};

const getServerInfo = async (req, res) => {
    res.status(200).json({
        os: process.platform,
        version: process.version
    });
};

const createTodo = async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        if (!title) {
            logger.error('Title for todo not provided');
            return res.status(400).json({ error: 'Title for todo not provided' });
        }

        const todo = await Todo.create({ title, description }, { individualHooks: true });

        if (tags && tags.length > 0) {
            const tagNames = tags.split(',');
            const tagObjects = tagNames.map((tagName) => ({
                name: tagName,
                todoId: todo.id
            }));
            const createdTags = await Tag.bulkCreate(tagObjects, { individualHooks: true });
        }

        const createdTodo = await Todo.findByPk(todo.id, {
            include: 'tags',
        });

        logger.info(`Created new todo with ID:${todo.id}`);
        res.status(201).json(createdTodo);
    } catch (error) {
        logger.error(`Failed to create a new todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to create a new todo' });
    }
};

const deleteTodos = async (req, res) => {
    try {
        const { ids } = req.body;
        const todoIds = ids.split(",");
        
        await Todo.destroy({ where: { id: todoIds }, individualHooks: true });
        logger.info(`Deleted ${todoIds.length} todos`);
        res.status(204).end();
    } catch (error) {
        logger.error(`Failed to delete chosen todos: ${error.message}`);
        res.status(500).json({ error: 'Failed to delete chosen todos' });
    }    
};

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCount = await Todo.destroy({ where: { id }, individualHooks: true });

        if (deletedCount === 0) {
            logger.warn(`Todo with ID:${id} not found`);
            return res.status(404).json({ error: 'Todo not found' });
        }

        logger.info(`Deleted todo with ID:${id}`);
        res.status(204).end();
    } catch (error) {
        logger.error(`Failed to delete todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
};

const editTodo = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info(id);
        const { title, description, tags } = req.body;
    
        if (!(title || description || (tags && tags.length > 0))) {
            logger.warn("No data to update");
            return res.status(400).json({ error: "No data to update" });
        }
    
        const updatedValues = {};
        if (title) updatedValues.title = title;
        if (description) updatedValues.description = description;
    
        const [updatedRowsCount, [updatedTodo]] = await Todo.update(updatedValues, {
            where: { id },
            individualHooks: true,
            returning: true,
        });
    
        if (updatedRowsCount === 0 && !updatedTodo) {
            logger.warn("Todo not found");
            return res.status(404).json({ error: "Todo not found" });
        }
  
        if (tags && tags.length > 0) {
            const existingTags = await Tag.findAll({
                where: { todoId: updatedTodo.id },
            });
    
            const tagNames = tags.split(",");
            const existingTagNames = existingTags.map((tag) => tag.name);
    
            const tagsToAdd = tagNames.filter(
                (tagName) => !existingTagNames.includes(tagName)
            );
            const tagsToRemove = existingTags.filter(
                (tag) => !tagNames.includes(tag.name)
            );
    
            if (tagsToRemove.length === existingTags.length) {
                logger.warn("No data to update");
                return res.status(404).json({ error: "No data to update" });
            }
    
            await Tag.destroy({
                where: {
                    todoId: updatedTodo.id,
                    name: tagsToRemove.map((tag) => tag.name),
                },
                individualHooks: true,
            });
    
            const newTags = tagsToAdd.map((tagName) => ({
                name: tagName,
                todoId: updatedTodo.id,
            }));
    
            const createdTags = await Tag.bulkCreate(newTags, { individualHooks: true });
        }
    
        const updatedTodoWithTags = await Todo.findByPk(updatedTodo.id, { include: "tags" });
    
        res.status(200).json(updatedTodoWithTags);
    } catch (error) {
        logger.error(`Failed to update todo: ${error.message}`);
        res.status(500).json({ error: "Failed to update todo" });
    }
};
  

const getTodos = async (req, res) => {
    try {
        let { sortBy, filterByTitle, filterByTags } = req.query;
  
        if (!sortBy) {
            sortBy = 'DESC';
        } else if (sortBy !== 'ASC' && sortBy !== 'DESC') {
            return res.status(400).json({ error: 'Invalid sortBy value' });
        }
  
        const whereClause = {};
        if (filterByTitle) {
            whereClause.title = filterByTitle;
        }
    
        const todos = await Todo.findAll({
            where: whereClause,
            order: [['createdAt', sortBy]],
            include: 'tags',
        });
    
        if (filterByTags) {
            const tags = filterByTags.split(',');
            const filteredTodos = todos.filter((todo) => tags.every((tag) =>
            todo.tags.some((todoTag) => todoTag.name === tag)));
            return res.status(200).json(filteredTodos);
        }
    
        res.status(200).json(todos);
    } catch (error) {
        logger.error(`Failed to get todos: ${error.message}`);
        res.status(500).json({ error: 'Failed to get todos' });
    }
};
  

const getTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByPk(
            id,
            { include: 'tags' },
        );

        if (!todo) {
            logger.warn(`Todo with ID${id} not found`);
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json(todo);
    } catch (error) {
        logger.error(`Failed to get todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to get todo' });
    }
};

const updateCompleted = async (req, res) => {
    try {
        const { id } = req.params;
  
        const [updatedRowsCount, [updatedRow]] = await Todo.update(
            { completed: Sequelize.literal('NOT completed') },
            { where: { id }, individualHooks: true, returning: true }
        );
    
        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
    
        logger.info(`Updated completed field of todo with ID:${id}`);
        res.status(200).json({ completed: updatedRow.completed });
    } catch (error) {
        logger.error(`Failed to update completed field of todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to update completed field of todo' });
    }
};

const addTags = async (req, res) => {
    try {
        const { id } = req.params;
        const { tags } = req.body;

        const todo = await Todo.findByPk(id);

        if (!todo) {
            logger.warn(`Todo with ID:${id} not found`);
            return res.status(404).json({ error: 'Todo not found' });
        }

        const tagNames = tags.split(",");

        const existingTags = await Tag.findAll({
            where: { todoId: todo.id },
        });
        const existingTagNames = existingTags.map((tag) => tag.name);

        const tagsToAdd = tagNames.filter(
            (tagName) => !existingTagNames.includes(tagName)
        );

        if (tagsToAdd.length === 0) {
            logger.warn('No data to update');
            return res.status(404).json({ error: 'No data to update' });
        }

        const newTags = tagsToAdd.map((tagName) => ({
            name: tagName,
            todoId: todo.id,
        }));

        const createdTags = await Tag.bulkCreate(newTags, { individualHooks: true });
        
        logger.info(`Added tags "${tags}" to todo with ID:${id}`);
        res.status(201).json(createdTags);
    } catch (error) {
        logger.error(`Failed to add tag to todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to add tag to todo' })
    }
};

const removeTag = async (req, res) => {
    try {
        const { id, tag } = req.params;

        const todo = await Todo.findByPk(id);

        if (!todo) {
            logger.warn(`Todo with ID:${id} not found`);
            return res.status(404).json({ error: 'Todo not found' });
        }

        const existingTag = await Tag.findOne({ where: { todoId: id, name: tag } });

        if (!existingTag) {
            logger.warn(`Tag "${tag}" does not exist for the specified todo`);
            return res.status(404).json({ error: 'Tag does not exist for the specified todo' });
        }

        await existingTag.destroy();

        logger.info(`Removed tag "${tag}" from todo with ID:${id}`);
        res.status(204).end();
    } catch (error) {
        logger.error(`Failed to remove tag from todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to remove tag from todo' });
    }
};


const handleRouteNotFoundError = (req, res) => {
    res.status(404).json({ error: 'Requested resource not found' });
};

const handleIncorrectPath = async (req, res) => {
    res.redirect('/error');
};

module.exports = {
    getStatus,
    getServerInfo,
    createTodo,
    deleteTodos,
    deleteTodo,
    editTodo,
    getTodos,
    getTodo,
    updateCompleted,
    addTags,
    removeTag,
    handleRouteNotFoundError,
    handleIncorrectPath,
};
  
  
  