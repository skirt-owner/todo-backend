const express = require('express');
const {
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
    removeTag
} = require('../controllers/todoController');

const router = express.Router();

router.get('/status', getStatus);

router.get('/server', getServerInfo);

router.post('/todos', createTodo);

router.delete('/todos', deleteTodos);

router.delete('/todos/:id', deleteTodo);

router.put('/todos/:id', editTodo);

router.get('/todos', getTodos);

router.get('/todos/:id', getTodo);

router.patch('/todos/:id/completed', updateCompleted);

router.post('/todos/:id/tags', addTags);

router.delete('/todos/:id/tags/:tag', removeTag);

module.exports = router;
