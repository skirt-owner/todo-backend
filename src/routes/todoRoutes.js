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
    addTag,
    removeTag,
    handleRouteNotFoundError,
    handleIncorrectPath,
} = require('./todoControllers');

const router = express.Router();

router.get('/status', getStatus);

router.get('/server', getServerInfo);

router.post('/notes', createTodo);

router.delete('/notes', deleteTodos);

router.delete('/notes/:id', deleteTodo);

router.put('/notes/:id', editTodo);

router.get('/notes', getTodos);

router.get('/notes/:id', getTodo);

router.patch('/notes/:id/completed', updateCompleted);

router.post('/notes/:id/tags', addTag);

router.delete('/notes/:id/tags/:tag', removeTag);

router.get('/error', handleRouteNotFoundError);

router.use('*', handleIncorrectPath);

module.exports = router;
