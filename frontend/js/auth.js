// // js/auth.js
// const loginForm = document.getElementById('loginForm');
// const registerForm = document.getElementById('registerForm');

// if (loginForm) {
//     loginForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const username = loginForm.username.value;
//         const password = loginForm.password.value;

//         const res = await fetch('http://localhost:12000/api/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, password })
//         });

//         const data = await res.json();
//         if (res.ok) {
//             localStorage.setItem('token', data.token);
//             localStorage.setItem('role', data.role);
//             window.location.href = 'home.html';
//         } else {
//             alert(data.message || 'Login failed');
//         }
//     });
// }

// if (registerForm) {
//     registerForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const username = registerForm.username.value;
//         const email = registerForm.email.value;
//         const password = registerForm.password.value;

//         const res = await fetch('http://localhost:12000/api/auth/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, email, password })
//         });

//         const data = await res.json();
//         if (res.ok) {
//             alert('Registration successful!');
//             window.location.href = 'index.html';
//         } else {
//             alert(data.message || 'Registration failed');
//         }
//     });
// }


// js/auth.js

const loginForm = document.getElementById('loginForm')
const registerForm = document.getElementById('registerForm')

///////////////////////////////////////////////////////////////////////////////
// LOGIN
///////////////////////////////////////////////////////////////////////////////
if (loginForm) {
    loginForm.addEventListener('submit', async e => {
        e.preventDefault()

        const username = loginForm.username.value.trim()
        const password = loginForm.password.value

        try {
            // 1) Authenticate
            const res = await fetch('http://localhost:12000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()

            if (!res.ok) {
                return alert(data.message || 'Login failed')
            }

            // 2) Store token + role
            localStorage.setItem('token', data.token)
            localStorage.setItem('role', data.role)

            // 3) Store full user object (needs to be returned by your API!)
            //    { username, name, createdAt, ... }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user))
            } else {
                console.warn('No `user` in login response—profile page will miss name/join date')
            }

            // 4) Redirect to home/profile
            window.location.href = 'home.html'

        } catch (err) {
            console.error(err)
            alert('Network error—please try again')
        }
    })
}

///////////////////////////////////////////////////////////////////////////////
// REGISTER
///////////////////////////////////////////////////////////////////////////////
if (registerForm) {
    registerForm.addEventListener('submit', async e => {
        e.preventDefault()

        const username = registerForm.username.value.trim()
        const email = registerForm.email.value.trim()
        const password = registerForm.password.value

        try {
            const res = await fetch('http://localhost:12000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            })
            const data = await res.json()

            if (!res.ok) {
                return alert(data.message || 'Registration failed')
            }

            alert('Registration successful! Please log in.')
            window.location.href = 'index.html'

        } catch (err) {
            console.error(err)
            alert('Network error—please try again')
        }
    })
}