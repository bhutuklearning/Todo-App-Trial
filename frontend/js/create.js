// js/create.js
import API_BASE_URL from './config.js';

const form = document.getElementById('todoForm');
const token = localStorage.getItem('token');
const editId = localStorage.getItem('editTodoId');

if (editId) {
    fetch(`${API_BASE_URL}/api/todos/${editId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(todo => {
            document.getElementById('title').value = todo.title;
            document.getElementById('description').value = todo.description;
        });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = form.title.value;
    const description = form.description.value;

    const url = editId
        ? `${API_BASE_URL}/api/todos/${editId}`
        : `${API_BASE_URL}/api/todos`;

    const method = editId ? 'PUT' : 'POST';

    await fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
    });

    localStorage.removeItem('editTodoId');
    window.location.href = 'home.html';
});
