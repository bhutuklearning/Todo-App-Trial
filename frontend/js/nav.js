// // js/nav.js
// document.getElementById('navbar').innerHTML = `
//   <nav>
//     <h2>Basic Todo</h2>
//     <ul>
//       <li><a href="home.html">Home</a></li>
//       <li><a href="create.html">Create Todos</a></li>
//       <li><a href="profile.html">Profile</a></li>
//       <li><button id="themeToggle">🌓</button></li>
//       <li><button onclick="logout()">Logout</button></li>
//     </ul>
//   </nav>
// `;

// function logout() {
//     localStorage.clear();
//     window.location.href = 'index.html';
// }

// js/nav.js
document.getElementById('navbar').innerHTML = `
  <nav>
    <div class="nav-brand">
      <h2>Basic Todo</h2>
      <button id="menuToggle" class="hamburger">&#9776;</button>
    </div>
    <ul id="navLinks">
      <li><a href="home.html">Home</a></li>
      <li><a href="create.html">Create Todos</a></li>
      <li><a href="profile.html">Profile</a></li>
      <li><button id="themeToggle">🌓</button></li>
      <li><button onclick="logout()">Logout</button></li>
    </ul>
  </nav>
`;

document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}
