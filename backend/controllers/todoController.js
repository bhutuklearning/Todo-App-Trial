import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Todo from '../models/Todo.js';

// Create a new todo
export const createTodo = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description } = req.body;
    const todo = new Todo({ title, description, user: req.user._id });
    await todo.save();
    res.status(201).json(todo);
};

// Get all todos for the authenticated user
export const getTodos = async (req, res) => {
    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
};

// Get a specific todo by ID for the authenticated user
export const getTodosById = async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
};

// Update a todo
export const updateTodo = async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findOneAndUpdate(
        { _id: id, user: req.user._id },
        req.body,
        { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
};

// Delete a todo
export const deleteTodo = async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
};

// Admin
export const adminGetAllTodos = async (req, res) => {
    const todos = await Todo.find().populate('user', 'username');
    res.json(todos);
};

export const adminDeleteTodo = async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted by admin' });
};

// Get all users and their todos (admin only)
export const adminGetUsersWithTodos = async (req, res) => {
    try {
        // Get all users (excluding their password)
        const users = await User.find().select('-password');

        // For each user, get their todos and build a result array
        const result = [];
        for (const user of users) {
            const todos = await Todo.find({ user: user._id });
            result.push({
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                todos
            });
        }

        // Send the result
        res.json(result);
    } catch (err) {
        console.error('Admin get users with todos error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};