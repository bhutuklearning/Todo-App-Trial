# 📝 Todo App Backend

A robust, secure, and scalable backend for a Todo application built with **Node.js**, **Express**, and **MongoDB**.  
This project features user authentication, role-based authorization, and full CRUD operations for todos.

---

## 🚀 Features

- **Authentication & Authorization**
  - User registration and login with hashed passwords (`bcryptjs`)
  - JWT-based authentication with token expiration
  - Role-based access control (`user`, `admin`)
  - Middleware for route protection and role checking

- **Todo Management**
  - Users can create, read, update, and delete their own todos
  - Admins can view all todos and delete any
  - Admins can view all users and their todos

- **Security & Best Practices**
  - Secure HTTP headers (`helmet`)
  - CORS support (`cors`)
  - Request logging (`morgan`)
  - Input validation (`express-validator`)
  - Environment variables via `.env`
  - Centralized error handling

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── todoController.js
├── middlewares/
│   ├── auth.js
│   ├── role.js
│   ├── errorHandler.js
│   └── logger.js
├── models/
│   ├── Todo.js
│   └── User.js
├── routes/
│   ├── auth.js
│   └── todos.js
├── utils/
│   └── generateToken.js
├── .env
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory:
     ```
     MONGODB_URI=<your_mongodb_uri>
     JWT_SECRET=<your_jwt_secret>
     TOKEN_EXPIRATION=7d
     PORT=12000
     NODE_ENV=development
     ```
   - Example for MongoDB Atlas:
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todoapp
     ```

4. **Start the server**
   ```bash
   npm run dev   # For development (with nodemon)
   npm start     # For production
   ```

---

## 🔑 API Endpoints

### **Auth**
- `POST /api/auth/register`  
  Register a new user  
  **Body:**  
  ```json
  { "username": "yourname", "email": "your@email.com", "password": "yourpassword" }
  ```

- `POST /api/auth/login`  
  Login and receive JWT  
  **Body:**  
  ```json
  { "username": "yourname", "password": "yourpassword" }
  ```

- `POST /api/auth/logout`  
  Logout (client should delete JWT)

---

### **Todos (require JWT in Authorization header)**

- `POST /api/todos`  
  Create a new todo  
  **Body:**  
  ```json
  { "title": "Todo title", "description": "Todo description" }
  ```

- `GET /api/todos`  
  Get all todos for the authenticated user

- `GET /api/todos/:id`  
  Get a specific todo by ID

- `PUT /api/todos/:id`  
  Update a todo  
  **Body:**  
  ```json
  { "title": "Updated title", "description": "Updated description", "completed": true }
  ```

- `DELETE /api/todos/:id`  
  Delete a todo

---

### **Admin Endpoints (require admin role)**

- `GET /api/todos/admin`  
  Get all todos (all users)

- `DELETE /api/todos/admin/:id`  
  Delete any todo by ID

- `GET /api/todos/admin/users`  
  Get all users and their todos

---

## 🛡️ Security

- Passwords are hashed before storage
- JWT tokens are used for authentication
- Role-based access for admin routes
- Sensitive data (like `.env` and `node_modules`) is excluded from git via `.gitignore`

---

## 🧪 Testing

- Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test endpoints
- A sample Postman collection is included: `Todo Testing.postman_collection.json`

---

## 📝 Contributing

Pull requests and issues are welcome!  
Feel free to suggest improvements or report bugs.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Need Help?

If you have questions or need help, open an issue or contact the maintainer.