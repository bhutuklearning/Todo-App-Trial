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

const API = 'http://localhost:12000/api'
const token = localStorage.getItem('token')
const role = localStorage.getItem('role')
const rawUser = localStorage.getItem('user')
const content = document.getElementById('profileContent')

window.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        return window.location.href = 'index.html'
    }

    // 1) Parse user from storage
    let user = null
    try {
        user = JSON.parse(rawUser)
    } catch (e) {
        console.warn('No stored user object:', e.message)
    }

    // 2) Derive greeting name & join date
    const firstName = user?.name
        ? user.name.trim().split(' ')[0]
        : (user?.username || 'User')

    const joinedOn = user?.createdAt
        ? new Date(user.createdAt)
            .toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        : ''

    // 3) Render admin vs. regular
    if (role === 'admin') {
        try {
            const stats = await fetchJSON('/todos/admin/users')
            content.innerHTML = `
        <h3>Hi Admin ${firstName}!</h3>
        ${joinedOn && `<p>Joined on ${joinedOn}</p>`}
        <p>Total users: <strong>${stats.totalUsers}</strong></p>
        <p>Total todos: <strong>${stats.totalTodos}</strong></p>
      `
        } catch {
            content.innerHTML = `<p>Unable to load admin stats.</p>`
        }

    } else {
        try {
            const todos = await fetchJSON('/todos')
            const list = Array.isArray(todos) ? todos : (todos.todos || [])
            const total = list.length
            const done = list.filter(t => t.completed).length
            const pending = total - done

            content.innerHTML = `
        <h3>Hi ${firstName}!</h3>
        ${joinedOn && `<p>Joined on ${joinedOn}</p>`}
        <p>Total todos:  <strong>${total}</strong></p>
        <p>Completed:    <strong>${done}</strong></p>
        <p>Pending:      <strong>${pending}</strong></p>
      `
        } catch {
            content.innerHTML = `<p>Unable to load your todos.</p>`
        }
    }
})

// Helper to do a GET and parse JSON with Bearer header
async function fetchJSON(path) {
    const res = await fetch(`${API}${path}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
}

// Logout clears everything
function logout() {
    localStorage.clear()
    window.location.href = 'index.html'
}