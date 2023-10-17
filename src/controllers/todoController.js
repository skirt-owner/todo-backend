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

        const todo = await Todo.create({ title, description });

        if (tags && tags.length > 0) {
            const tagNames = tags.split(',');
            const tagPromises = tagNames.map(tagName =>
                Tag.findOrCreate({ where: { name: tagName } })
            );
            const createdTags = await Promise.all(tagPromises);
            const tagInstances = createdTags.map(([tag]) => tag);
            await todo.addTags(tagInstances);
        }

        logger.info(`Created new todo with ID:${todo.id}`);

        const createdTodo = await Todo.findByPk(todo.id, {
            include: [
                {
                    model: Tag,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                }
            ]
        });

        res.status(201).json(createdTodo);
    } catch (error) {
        logger.error(`Failed to create a new todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to create a new todo' });
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
        
        if (!title && !description && !(tags && tags.length > 0)) {
            logger.warn('No data provided for update');
            return res.status(400).json({ error: 'No data provided for update' });
        }
        
        const todo = await Todo.findByPk(id);

        if (!todo) {
            logger.warn('Todo not found');
            return res.status(404).json({ error: 'Todo not found' });
        }

        if (title) {
            todo.title = title;
        }
        if (description) {
            todo.description = description;
        }
        
        if (tags && tags.length > 0) {
            await todo.setTags([]);

            const tagNames = tags.split(',');
            const tagPromises = tagNames.map(tagName =>
                Tag.findOrCreate({ where: { name: tagName } })
            );
            const createdTags = await Promise.all(tagPromises);
            const tagInstances = createdTags.map(([tag]) => tag);
            await todo.addTags(tagInstances);
        }
        
        await todo.save();
        
        logger.info(`Updated todo with ID:${id}`);

        const editedTodo = await Todo.findByPk(id, {
            include: [
                {
                    model: Tag,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ],
        });

        res.status(200).json(editedTodo);
    } catch (error) {
        logger.error(`Failed to update todo: ${error.message}`);
        res.status(500).json({ error: 'Failed to update todo' });
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
                    through: { attributes: [] },
                },
            ],
        });

        if (filterByTags) {
            const tags = filterByTags.split(',');
            const filteredTodos = todos.filter((todo) => {
                return tags.every((tag) =>
                    todo.Tags.some((todoTag) => todoTag.name === tag)
                );
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
            { include: [{ 
                model: Tag, 
                attributes: ['id', 'name'] ,
                through: { attributes: [] },
            }] }
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

        const todo = await Todo.findByPk(
            id,
            { include: [{ 
                model: Tag, 
                attributes: ['id', 'name'] ,
                through: { attributes: [] },
            }] }
        );

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todo.completed = !todo.completed;

        await todo.save();

        logger.info(`Updated completed field of todo with ID:${id}`);
        res.status(200).json(todo);
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

        const tagNames = tags.split(',');
        const tagPromises = tagNames.map(tagName =>
            Tag.findOrCreate({ where: { name: tagName } })
        );
        const createdTags = await Promise.all(tagPromises);
        const tagInstances = createdTags.map(([tag]) => tag);
        await todo.addTags(tagInstances);
        
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
  
  
  