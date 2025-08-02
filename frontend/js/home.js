// js/home.js
import API_BASE_URL from './config.js'

const TODO_API = `${API_BASE_URL}/api/todos`

window.onload = async function () {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = 'index.html'
    return
  }

  const res = await fetch(TODO_API, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const todos = await res.json()

  const container = document.getElementById('todoList')
  container.innerHTML = ''

  todos.forEach(todo => {
    const statusBadge = todo.completed
      ? `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
           Completed
         </span>`
      : `<span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
           Pending
         </span>`

    const createdDate = new Date(todo.createdAt)
      .toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })

    const completeBtn = todo.completed
      ? `<button disabled class="px-3 py-1 bg-gray-200 text-gray-500 rounded cursor-not-allowed">
           Completed
         </button>`
      : `<button onclick="markDone('${todo._id}')"
                 class="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
           Completed
         </button>`

    const updateBtn = todo.completed
      ? `<button disabled class="px-3 py-1 bg-gray-200 text-gray-500 rounded cursor-not-allowed">
           Update
         </button>`
      : `<button onclick="editTodo('${todo._id}')"
                 class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
           Update
         </button>`

    const deleteBtn = `<button onclick="deleteTodo('${todo._id}')"
                             class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                         Delete
                       </button>`

    const card = document.createElement('div')
    card.className = `
      bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg
      border border-gray-200 dark:border-gray-700 p-6 mb-6 transition
    `

    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-2xl font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}">
          ${todo.title}
        </h3>
        ${statusBadge}
      </div>

      <p class="text-base text-gray-600 dark:text-gray-400 mb-6 ${todo.completed ? 'line-through' : ''}">
        ${todo.description}
      </p>

      <div class="flex gap-3 mb-4">
        ${completeBtn}
        ${updateBtn}
        ${deleteBtn}
      </div>

      <div class="border-t pt-4">
        <time class="block text-right text-xs text-gray-500 dark:text-gray-400">
          Created on ${createdDate}
        </time>
      </div>
    `

    container.appendChild(card)
  })
}

// Expose handlers globally for inline onclicks
window.editTodo = function (id) {
  localStorage.setItem('editTodoId', id)
  window.location.href = 'create.html'
}

window.deleteTodo = async function (id) {
  const token = localStorage.getItem('token')
  await fetch(`${TODO_API}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  window.location.reload()
}

window.markDone = async function (id) {
  const token = localStorage.getItem('token')
  await fetch(`${TODO_API}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed: true })
  })
  window.location.reload()
}


// // js/home.js

// import API_BASE_URL from './config.js';
// window.onload = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) return window.location.href = 'index.html';

//   // fetch todos from your API
//   const res = await fetch(`${API_BASE_URL}/api/todos`, {
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   const todos = await res.json();

//   const container = document.getElementById('todoList');
//   container.innerHTML = '';  // clear any placeholders

//   todos.forEach(todo => {
//     // status badge
//     const statusBadge = todo.completed
//       ? `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>`
//       : `<span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>`;

//     // formatted creation date
//     const createdDate = new Date(todo.createdAt)
//       .toLocaleDateString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//       });

//     // buttons
//     const completeBtn = todo.completed
//       ? `<button disabled class="px-3 py-1 bg-gray-200 text-gray-500 rounded cursor-not-allowed">Completed</button>`
//       : `<button onclick="markDone('${todo._id}')" class="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">Completed</button>`;

//     const updateBtn = `<button onclick="editTodo('${todo._id}')" class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">Update</button>`;
//     const deleteBtn = `<button onclick="deleteTodo('${todo._id}')" class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">Delete</button>`;

//     // card container
//     const card = document.createElement('div');
//     card.className = `
//     bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg
//     border border-gray-200 dark:border-gray-700 p-6 mb-6 transition
//   `;

//     card.innerHTML = `
//     <div class="flex justify-between items-start mb-4">
//       <h3 class="text-2xl font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}">
//         ${todo.title}
//       </h3>
//       ${statusBadge}
//     </div>

//     <p class="text-base text-gray-600 dark:text-gray-400 mb-6 ${todo.completed ? 'line-through' : ''}">
//       ${todo.description}
//     </p>

//     <div class="flex gap-3 mb-4">
//       ${completeBtn}
//       ${updateBtn}
//       ${deleteBtn}
//     </div>

//     <div class="border-t pt-4">
//       <time class="block text-right text-xs text-gray-500 dark:text-gray-400">
//         Created on ${createdDate}
//       </time>
//     </div>
//   `;

//     container.appendChild(card);
//   });
// };

// // navigate to edit form
// function editTodo(id) {
//   localStorage.setItem('editTodoId', id);
//   window.location.href = 'create.html';
// }

// // delete API call
// async function deleteTodo(id) {
//   const token = localStorage.getItem('token');
//   await fetch(`${API_BASE_URL}/api/todos/${id}`, {
//     method: 'DELETE',
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   window.location.reload();
// }

// // mark done API call
// async function markDone(id) {
//   const token = localStorage.getItem('token');
//   await fetch(`${API_BASE_URL}/api/todos/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ completed: true })
//   });
//   window.location.reload();
// }




// // js/home.js
// window.onload = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return window.location.href = 'index.html';

//     // fetch todos from your API
//     const res = await fetch('http://localhost:12000/api/todos', {
//         headers: { 'Authorization': `Bearer ${token}` }
//     });
//     const todos = await res.json();

//     const container = document.getElementById('todoList');
//     container.innerHTML = '';  // clear any placeholders

//     todos.forEach(todo => {
//         // build status badge
//         const statusBadge = todo.status === 'completed'
//             ? `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>`
//             : `<span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>`;

//         // create card
//         const card = document.createElement('div');
//         card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition';

//         card.innerHTML = `
//       <div class="flex justify-between items-center mb-2">
//         <h3 class="text-lg font-bold">${todo.title}</h3>
//         ${statusBadge}
//       </div>
//       <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${todo.description}</p>
//       <div class="flex justify-end gap-3 text-sm">
//         <button onclick="markDone('${todo._id}')"
//                 class="text-green-600 hover:underline">
//           Completed
//         </button>
//         <button onclick="editTodo('${todo._id}')"
//                 class="text-blue-500 hover:underline">
//           Update
//         </button>
//         <button onclick="deleteTodo('${todo._id}')"
//                 class="text-red-500 hover:underline">
//           Delete
//         </button>
//       </div>
//     `;

//         container.appendChild(card);
//     });
// };

// // navigate to edit form
// function editTodo(id) {
//     localStorage.setItem('editTodoId', id);
//     window.location.href = 'create.html';
// }

// // delete API call
// async function deleteTodo(id) {
//     const token = localStorage.getItem('token');
//     await fetch(`http://localhost:12000/api/todos/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//     });
//     window.location.reload();
// }

// // mark done API call
// async function markDone(id) {
//     const token = localStorage.getItem('token');
//     await fetch(`http://localhost:12000/api/todos/${id}`, {
//         method: 'PUT',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: 'completed' })
//     });
//     window.location.reload();
// }