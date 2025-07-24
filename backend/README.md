# Todo App Backend

This is a complete backend for a Todo application built using Node.js, Express, and MongoDB. The application includes user authentication, authorization, and todo management features.

## Features

- **Authentication & Authorization**:
  - User registration and login with hashed passwords.
  - Role-based access control (user and admin).
  - Secure JWT-based authentication.
  - Middleware for route protection and role-checking.

- **Todo Management**:
  - Users can create, read, update, and delete their own todos.
  - Admins can view all todos and delete any.

- **Security**:
  - Uses `cors`, `helmet`, and `morgan` for enhanced security.
  - Input validation with `express-validator`.

## Project Structure

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
└── package.json
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Create a `.env` file** in the root directory and add the following environment variables:
   ```
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   ```

4. **Start the server**:
   ```
   npm start
   ```

## Usage

- **User Registration**: POST `/api/auth/register`
- **User Login**: POST `/api/auth/login`
- **Todo Operations**:
  - Create Todo: POST `/api/todos`
  - Get Todos: GET `/api/todos`
  - Update Todo: PUT `/api/todos/:id`
  - Delete Todo: DELETE `/api/todos/:id`

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.