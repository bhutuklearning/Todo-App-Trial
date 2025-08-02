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

export const adminGetUsersWithTodos = async (req, res) => {
  try {
    // 1. Fetch all users and todos
    const users = await User.find().lean();
    const todos = await Todo.find().lean();

    // 2. Compute totals
    const totalUsers = users.length;
    const totalTodos = todos.length;

    // 3. Build per-user stats
    const usersWithStats = users.map(u => {
      const userTodos = todos.filter(t => t.user.toString() === u._id.toString());
      const doneCount = userTodos.filter(t => t.completed).length;
      const pendingCount = userTodos.length - doneCount;

      return {
        id: u._id,
        username: u.username,
        email: u.email,
        name: u.name,
        totalTodos: userTodos.length,
        completed: doneCount,
        pending: pendingCount,
        // optional: include list of titles
        todos: userTodos.map(t => ({ title: t.title, completed: t.completed }))
      };
    });

    // 4. Return full payload
    return res.json({
      totalUsers,
      totalTodos,
      users: usersWithStats
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
