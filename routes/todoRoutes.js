const express = require('express');
const router = express.Router();

const todoController = require('../controller/todoController');
const isAuthenticated = require('../middleware/middleware');

router.post('/create',isAuthenticated,  todoController.createTodo);
router.post('/list',isAuthenticated,  todoController.todoList);
router.delete('/delete/:id',isAuthenticated,  todoController.deleteTodo);
router.put('/update/:id',isAuthenticated,  todoController.updateTodo);

module.exports = router;