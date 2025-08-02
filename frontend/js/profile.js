// profile.js

import API_BASE_URL from './config.js';

const API = `${API_BASE_URL}/api`;
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const rawUser = localStorage.getItem('user');
const content = document.getElementById('profileContent');

window.addEventListener('DOMContentLoaded', async () => {
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // Parse stored user
  let user = {};
  try {
    user = JSON.parse(rawUser) || {};
  } catch {
    user = {};
  }

  // First name & join date
  const firstName = (user.name || user.username || 'User').split(' ')[0];
  const joinedOn = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    : '';

  // Greeting block
  const headerHTML = `
    <div class="flex flex-col items-center space-y-4 mb-8 px-4 sm:px-0">
      <div class="h-20 w-20 sm:h-24 sm:w-24 bg-purple-200 dark:bg-purple-700
                  rounded-full flex items-center justify-center
                  text-2xl sm:text-4xl font-bold text-purple-600 dark:text-purple-300
                  animate-pulse">
        ${firstName.charAt(0).toUpperCase()}
      </div>
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-center">
        ${role === 'admin' ? 'Admin ' : ''}Hi, ${firstName}!
      </h2>
      ${joinedOn
      ? `<p class="text-xs sm:text-sm italic text-gray-500 dark:text-gray-400">
               Joined on ${joinedOn}
             </p>`
      : ''
    }
    </div>`;

  try {
    let statsHTML = '';

    if (role === 'admin') {
      const stats = await fetchJSON('/todos/admin/users');
      const { totalUsers, totalTodos, users } = stats;

      // Cards
      const cards = cardsLayout([
        { label: 'Total Users', value: totalUsers, color: 'bg-indigo-50', text: 'text-indigo-600' },
        { label: 'Total Todos', value: totalTodos, color: 'bg-green-50', text: 'text-green-600' },
      ]);

      // Table rows
      const rows = (Array.isArray(users) ? users : []).map(
        u => `
          <tr class="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-4 py-2">${u.name || u.username || '—'}</td>
            <td class="px-4 py-2">${u.email || u.user?.email || '—'}</td>
            <td class="px-4 py-2 text-center">${u.totalTodos ?? 0}</td>
            <td class="px-4 py-2 text-green-600 text-center">${u.completed ?? 0}</td>
            <td class="px-4 py-2 text-yellow-600 text-center">${u.pending ?? 0}</td>
          </tr>
        `
      ).join('');

      // Table
      const table = `
        <div class="overflow-x-auto mt-6 px-4 sm:px-0">
          <table class="min-w-full table-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-700">
                <th class="px-4 py-2 text-left text-sm sm:text-base">User</th>
                <th class="px-4 py-2 text-left text-sm sm:text-base">Email</th>
                <th class="px-4 py-2 text-center text-sm sm:text-base">Todos</th>
                <th class="px-4 py-2 text-center text-sm sm:text-base">Done</th>
                <th class="px-4 py-2 text-center text-sm sm:text-base">Pending</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>`;

      content.innerHTML = `
        ${headerHTML}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          ${cards}
        </div>
        ${table}
      `;
      return;
    }

    // Non-admin stats
    const todos = await fetchJSON('/todos');
    const list = Array.isArray(todos) ? todos : todos.todos || [];
    const total = list.length;
    const done = list.filter(t => t.completed).length;
    const pend = total - done;

    statsHTML = cardsLayout([
      { label: 'Total Todos', value: total, color: 'bg-purple-50', text: 'text-purple-600' },
      { label: 'Completed', value: done, color: 'bg-green-50', text: 'text-green-600' },
      { label: 'Pending', value: pend, color: 'bg-yellow-50', text: 'text-yellow-600' },
    ]);

    content.innerHTML = `
      ${headerHTML}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        ${statsHTML}
      </div>
    `;
  } catch (err) {
    content.innerHTML = `
      <div class="text-center text-red-500">
        Error loading profile data.
      </div>`;
    console.error(err);
  }
});

// fetch JSON with Bearer header
async function fetchJSON(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

// build responsive stats cards
function cardsLayout(items) {
  return items
    .map(i => `
      <div class="p-4 ${i.color} dark:bg-opacity-20
                  rounded-lg shadow hover:shadow-md
                  transition-transform transform hover:-translate-y-1
                  text-sm sm:text-base">
        <p class="font-medium mb-2">${i.label}</p>
        <p class="text-xl sm:text-2xl font-bold text-center ${i.text}">
          ${i.value}
        </p>
      </div>
    `)
    .join('');
}

// Logout clears everything
function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}