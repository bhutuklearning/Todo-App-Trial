// // js/profile.js
// const token = localStorage.getItem('token');
// const role = localStorage.getItem('role');
// const content = document.getElementById('profileContent');

// window.onload = async () => {
//     if (!token) return window.location.href = 'index.html';

//     if (role === 'admin') {
//         const res = await fetch('http://localhost:12000/api/todos/admin/users', {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const data = await res.json();
//         content.innerHTML = `<h3>Hi Admin</h3><p>Total users: ${data.totalUsers}</p><p>Total Todos: ${data.totalTodos}</p>`;
//     } else {
//         const res = await fetch('http://localhost:12000/api/todos', {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const todos = await res.json();


//         const done = todos.filter(t => t["completed"] == true).length;
//         const undone = todos.length - done;
//         content.innerHTML = `<h3>Hi ${todos.user}</h3><p>Total Todos: ${todos.length}</p><p>Done: ${done}</p><p>Pending: ${undone}</p>`;
//     }
// };


// js/profile.js
import API_BASE_URL from './config.js';

const API = `${API_BASE_URL}/api`;
const token = localStorage.getItem('token')
const role = localStorage.getItem('role')
const rawUser = localStorage.getItem('user')
const content = document.getElementById('profileContent')

window.addEventListener('DOMContentLoaded', async () => {
    if (!token) return window.location.href = 'index.html'

    // Parse stored user
    let user = {}
    try {
        user = JSON.parse(rawUser) || {}
    } catch { }

    // First name & join date
    const firstName = (user.name || user.username || 'User').split(' ')[0]
    const joinedOn = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        })
        : ''

    // Build greeting & join-date block
    let headerHTML = `
    <div class="flex flex-col items-center space-y-4 mb-8">
      <div class="h-24 w-24 bg-purple-200 dark:bg-purple-700
                  rounded-full flex items-center justify-center
                  text-4xl font-bold text-purple-600 dark:text-purple-300
                  animate-pulse">
        ${firstName.charAt(0).toUpperCase()}
      </div>
      <h2 class="text-3xl font-semibold">${role === 'admin' ? 'Admin ' : ''}Hi, ${firstName}!</h2>
      ${joinedOn
            ? `<p class="text-sm italic text-gray-500 dark:text-gray-400">
             Joined on ${joinedOn}
           </p>`
            : ''
        }
    </div>`

    // Fetch and render stats
    try {
        let statsHTML = ''

        if (role === 'admin') {
            const stats = await fetchJSON('/todos/admin/users')
            statsHTML = cardsLayout([
                { label: 'Total Users', value: stats.totalUsers, color: 'bg-indigo-50', text: 'text-indigo-600' },
                { label: 'Total Todos', value: stats.totalTodos, color: 'bg-green-50', text: 'text-green-600' },
            ])
        } else {
            const todos = await fetchJSON('/todos')
            const list = Array.isArray(todos) ? todos : (todos.todos || [])
            const total = list.length
            const done = list.filter(t => t.completed).length
            const pend = total - done

            statsHTML = cardsLayout([
                { label: 'Total Todos', value: total, color: 'bg-purple-50', text: 'text-purple-600' },
                { label: 'Completed', value: done, color: 'bg-green-50', text: 'text-green-600' },
                { label: 'Pending', value: pend, color: 'bg-yellow-50', text: 'text-yellow-600' },
            ])
        }

        content.innerHTML = `
      ${headerHTML}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${statsHTML}
      </div>`

    } catch (err) {
        content.innerHTML = `
      <div class="text-center text-red-500">
        Error loading profile data.
      </div>`
        console.error(err)
    }
})

// Helper: fetch JSON with Bearer header
async function fetchJSON(path) {
    const res = await fetch(`${API}${path}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
}

// Helper: build stats cards HTML
function cardsLayout(items) {
    return items.map(i => `
    <div class="p-4 ${i.color} dark:bg-opacity-20
                rounded-lg shadow hover:shadow-md
                transition-transform transform hover:-translate-y-1">
      <p class="text-sm font-medium mb-2">${i.label}</p>
      <p class="text-2xl font-bold text-center ${i.text}">${i.value}</p>
    </div>
  `).join('')
}

// Logout clears everything
function logout() {
    localStorage.clear()
    window.location.href = 'index.html'
}