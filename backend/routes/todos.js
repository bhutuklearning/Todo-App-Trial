import express from 'express';
import {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo,
    adminGetAllTodos,
    adminDeleteTodo,
    getTodosById,
    adminGetUsersWithTodos
} from '../controllers/todoController.js';
import auth from '../middlewares/auth.js';
import roleCheck from '../middlewares/role.js';

const router = express.Router();

// Create a new todo
router.post('/', auth, createTodo);

// Get all todos for the authenticated user
router.get('/', auth, getTodos);

// Admin route to get all todos
router.get('/admin', auth, roleCheck(['admin']), adminGetAllTodos);

// Admin route to get all users and their todos
router.get('/admin/users', auth, roleCheck(['admin']), adminGetUsersWithTodos);

// Admin route to delete a todo by ID
router.delete('/admin/:id', auth, roleCheck(['admin']), adminDeleteTodo);

// Get a specific todo by ID
router.get('/:id', auth, getTodosById);

// Update a specific todo by ID
router.put('/:id', auth, updateTodo);

// Delete a specific todo by ID
router.delete('/:id', auth, deleteTodo);

export default router;