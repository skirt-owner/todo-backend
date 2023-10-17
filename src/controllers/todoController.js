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
        const todo = await Todo.create({ title, description, });

        if (tags && tags.length > 0) {
            const tagNames = tags.split(',');

            for (const tagName of tagNames) {
                let [tag, created] = await Tag.findOrCreate({ where: { name: tagName } });
                await todo.addTag(tag);
            }
        }

        logger.info(`Created new todo with ID:${todo.id}`);
        res.status(201).json(todo);
    } catch (error) {
        logger.error(`Failed to create a new note: ${error.message}`);
        res.status(500).json({ error: 'Failed to create a new note' });
    }
};

const deleteTodos = async (req, res) => {
    try {
        await Todo.destroy({ where: {}, individualHooks: true });
        logger.info('Deleted all todos');
        res.status(204).end();
    } catch (error) {
        logger.error(`Failed to delete all todos: ${error.message}`);
        res.status(500).json({ error: 'Failed to delete all todos' });
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
        const { title, description, tags } = req.body;
        
        const [updatedCount, updatedTodo] = await Todo.update(
        { title, description },
        { where: { id }, returning: true, individualHooks: true }
        );

        console.log(updatedTodo);

        if (updatedCount === 0) {
            logger.warn(`Todo with ID:${id} not found or the same`);
            return res.status(404).json({ error: 'Todo not found' });
        }

        await updatedTodo[0].setTags([]);

        if (tags && tags.length > 0) {
            const tagNames = tags.split(',');

            for (const tagName of tagNames) {
                let [tag, created] = await Tag.findOrCreate({ where: { name: tagName } });
                await updatedTodo[0].addTag(tag);
            }
        }

        logger.info(`Updated todo with ID:${id}`);
        res.status(200).json(updatedTodo[0]);
    } catch (error) {
        logger.error(`Failed to update todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

const getTodos = async (req, res) => {
    try {
        const { sortBy, filterByTitle, filterByTags } = req.query;
        
        let whereClause = {};
        if (filterByTitle) {
            whereClause.title = filterByTitle;
        }
        
        const todos = await Todo.findAll({
            where: whereClause, 
            order: [['createdAt', sortBy]], 
            include: [
                {
                    model: Tag,
                    attributes: ['id', 'name'],
                },
            ],
        });
        
        if (filterByTags) {
            const filteredTodos = todos.filter((todo) => {
                return todo.Tags.some((tag) => tag.name === filterByTags);
            });
            res.status(200).json(filteredTodos);
        } else {
            res.status(200).json(todos);
        }
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
            { include: [{ model: Tag, attributes: ['id', 'name'] }] }
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
        const { completed } = req.body;
        
        const [updatedCount, updatedTodo] = await Todo.update(
            { completed },
            { where: { id }, returning: true, individualHooks: true }
        );

        if (updatedCount === 0) {
            logger.warn(`Todo with ID:${id} not found`);
            return res.status(404).json({ error: 'Todo not found' });
        }

        logger.info(`Updated completed field of todo with ID:${id}`);
        res.status(200).json(updatedTodo[0]);
    } catch (error) {
        logger.error(`Failed to update completed field of todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to update completed field of todo' });
    }
};

const addTags = async (req, res) => {
    try {
        const { id } = req.params;
        const { tags } = req.body;

        const tagNames = tags.split(',');

        const todo = await Todo.findByPk(id);

        if (!todo) {
            logger.warn(`Todo with ID:${id} not found`);
            return res.status(404).json({ error: 'Todo not found' });
        }

        for (let tagName of tagNames) {
            let [tag, created] = await Tag.findOrCreate({ where: {name: tagName} });
            await todo.addTag(tag);
        }
        
        logger.info(`Added tags "${tags}" to todo with ID:${id}`);
        res.status(204).end();
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

        const existingTag = await Tag.findOne({ where: { name: tag } });

        if (!existingTag) {
            logger.warn(`Tag "${tag}" does not exist`);
            return res.status(404).json({ error: 'Tag does not exist' });
        }

        await todo.removeTag(existingTag);
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
  
  
  