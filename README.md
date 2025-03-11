# Node.js Authentication System

A comprehensive, production-ready authentication system built with Node.js, Express, MongoDB, and JWT providing secure user management and role-based authorization.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/sagar-1m/node-auth-system/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.17+-green.svg)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-standard-green.svg)](https://jwt.io/)
[![bcrypt](https://img.shields.io/badge/bcrypt-5.0+-green.svg)](https://www.npmjs.com/package/bcrypt)

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Security Implementation](#-security-implementation)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Installation & Setup](#-installation--setup)
- [Usage Examples](#-usage-examples)
- [Environment Variables](#-environment-variables)
- [Data Models](#-data-models)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)
- [Support](#-support)
- [Authors](#-authors)

## ✨ Features

- **User Authentication**

  - Secure registration and login system
  - Hashed passwords with bcrypt
  - JWT token-based authentication
  - Email verification ready (commented for testing)

- **Authorization**

  - Role-based access control (admin/user)
  - Protected routes with middleware
  - Token blacklisting for secure logout

- **Password Management**

  - Forgot password functionality
  - Secure password reset with expiring tokens
  - Strong password validation

- **Security Measures**
  - Rate limiting to prevent brute force attacks
  - Input validation to prevent injection attacks
  - HTTP-only, secure, SameSite cookies
  - Security headers with Helmet
  - Token blacklisting system
  - Separation of database credentials

## 🛠 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=for-the-badge&logo=lock&logoColor=white)

- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB with (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Input Validation**: express-validator
- **Rate Limiting**: express-rate-limit
- **Security Headers**: Helmet
- **Cookie Handling**: cookie-parser
- **CORS Protection**: cors
- **Email Services**: nodemailer with Mailtrap (commented but ready for use)

## 🔒 Security Implementation

This authentication system is designed with security in mind. Here are some of the security measures implemented:

- **Password Hashing**

  - Passwords are hashed using bcrypt with 10 salt rounds.
  - Passowrd requirements enforced via express-validator:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character

- **Token Management**

  - JWT tokens are used for authentication.
  - Tokens are stored in HTTP-only cookies with secure flags to prevent XSS attacks.
  - Token verification on protected routes.
  - Token blacklisting system to invalidate tokens on logout.
  - MongoDB TTL index for automatic blacklisting cleanup.

- **Request Protection**

  - Rate limiting:
    - General API: 100 requests per 15 minutes
    - Login endpoints: 5 attempts per 15 minutes
  - Input validation for all routes
  - CORS configuration to prevent cross-origin attacks
  - Security headers with Helmet for added protection

- **Database Security**

  - Credentials separated into components for added security.
  - Environment variables validation at startup.
  - Connection string sharding
  - Proper error handling for database operations

- **Email Security**

  - Email verification system ready (commented for testing)
  - Password reset system with expiring tokens
  - Email templates with secure links and tokens for verification

## 📂 Project Structure

The project follows the MVC (Model-View-Controller) pattern:

```
├── controllers/          # Route controllers
│   └── user.controller.js
├── middleware/           # Custom middleware
│   ├── auth.middleware.js
│   ├── rateLimiter.middleware.js
│   └── validation.middleware.js
├── models/               # Database models
│   ├── blacklistedTokens.model.js
│   └── user.model.js
├── routes/               # API routes
│   └── user.routes.js
├── utils/                # Utility functions
│   ├── apiResponse.utils.js
│   ├── db.utils.js
│   ├── mailer.utils.js
│   └── token.utils.js
├── .env                  # Environment variables (not in repo)
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── index.js              # Application entry point
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔌 API Endpoints

The API endpoints are designed to be RESTful and follow best practices. Here's a brief overview of the routes available:

### Authentication Routes (Public)

| Method | Endpoint                                   | Description            | Validation                   |
| ------ | ------------------------------------------ | ---------------------- | ---------------------------- |
| GET    | `/healthcheck `                            | Check the server is up | health                       |
| POST   | `/api/v1/users/register`                   | Register a new user    | Name, email, strong password |
| POST   | `/api/v1/users/login`                      | Login a user           | Email, password              |
| POST   | `/api/v1/users/forgot-password`            | Request password reset | Email                        |
| PUT    | `/api/v1/users/reset-password/:resetToken` | Reset password         | Strong password              |
| GET    | `/api/v1/users/verify/:token`              | Verify email           | Token                        |

### Protected Routes

| Method | Endpoint                | Description        | Access                 |
| ------ | ----------------------- | ------------------ | ---------------------- |
| GET    | `/api/v1/users/profile` | Get user profile   | Any authenticated user |
| GET    | `/api/v1/users/admin`   | Access admin route | Admin role only        |
| POST   | `/api/v1/users/logout`  | Logout user        | Any authenticated user |

### System Routes

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| GET    | `/healthcheck` | Check API health status |

## 🚀 Installation & Setup

1. **Clone the repository**

```sh
git clone https://github.com/sagar-1m/01_NodeJS-Authentication-System.git
```

2. **Navigate to project directory**

```sh
cd 01_NodeJS-Authentication-System
```

3. **Install dependencies**

```sh
npm install
```

4. **Set up environment variables**

```sh
cp .env.example .env
# Update the .env file with your own values
```

5. **Start the server**

```sh
# Start the server in development mode
npm run dev

# Start the server in production mode
npm start
```

6. **Open the API in your browser**

```sh
# The API should now be running at http://localhost:5000

```

## 📝 Usage Examples

Here are some example requests to get you started with the API using Postman:

### Register a new user

- **POST** `/api/v1/users/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Login a user

- **POST** `/api/v1/users/login`

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Get user profile

- **GET** `/api/v1/users/profile`

```json
# Headers

{"Authorization": "Bearer <token>"}
```

### Access admin route

- **GET** `/api/v1/users/admin`

```json
# Headers

{"Authorization": "Bearer <token>"}
```

### Logout user

- **POST** `/api/v1/users/logout`

```json
# Headers

{"Authorization": "Bearer <token>"}
```

### Forgot password

- **POST** `/api/v1/users/forgot-password`

```json
{
  "email": "john@example.com"
}
```

### Reset password

- **PUT** `/api/v1/users/reset-password/:resetToken`

```json
{
  "password": "NewPassword123!"
}
```

### Verify email

- **GET** `/api/v1/users/verify/:token`

```json
# No request body required
```

## ⚙️ Environment Variables

The environment variables are stored in a `.env.example` file. Create a new file named `.env` and copy the contents of `.env.example` into it. Update the values of the environment variables with your own values.

```sh
# Server configuration
PORT=5000  # API server port
NODE_ENV=development
FRONTEND_URL=http://localhost:3000 # Frontend URL
BASE_URL=http://localhost:5000 # API base URL

# Database configuration (Option 1: Components)
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_HOST=your_host
DB_NAME=your_database

# Database configuration (Option 2: Connection String)
DB_CONNECTION_STRING=mongodb://your_username:your_password@your_host/your_database

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=60m     # Format: number with time unit (s, m, h, d)
JWT_COOKIE_EXPIRE=7   # Format: integer number of days

# Email Configuration (Mailtrap)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
MAILTRAP_SENDEREMAIL=your_email
MAILTRAP_SENDEREMAIL_PASS=your_password
```

## 📦 Data Models

The application uses two data models: `User` and `BlacklistedToken`. Here's a brief overview of the schema and models:

### User Model

```js
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false // Hidden from queries
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Password reset fields
  passwordResetToken: String,
  passwordResetTokenTime: Date,
  // Email verification fields
  verificationToken: String,
  verificationTokenTime: Date,
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### BlacklistedToken Model

```js
{
  token: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔮 Future Enhancements

- [ ] Complete email verification flow
- [ ] Implement refresh tokens for improved session management
- [ ] Add account lockout after failed login attempts
- [ ] Add social authentication (Google, GitHub, etc.)
- [ ] Implement two-factor authentication (2FA)
- [ ] Add user profile management endpoints
- [ ] Create comprehensive test suite

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 🙌

- **Fork the repository**
- **Create your feature branch**: (`git checkout -b feature/amazing-feature`)
- **Commit your changes**: (`git commit -am 'Add some amazing feature'`)
- **Push to the branch**: (`git push origin feature/amazing-feature`)
- **Open a pull request**

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Hitesh Choudhary](https://x.com/Hiteshdotcom) for their amazing concepts stories
- [Piyush Garg](https://x.com/piyushgarg_dev) for their awesome analogies
- [Node.js](https://nodejs.org/) for the awesome runtime

## 📞 Support

- Please ⭐️ this repository if this project helped you!

<div align="center">

## ✍️ Authors

- [SagarMaheshwari](https://x.com/maheshwarisaga4)

[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/maheshwarisaga4)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sagar-maheshwari-1m/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sagar-1m)
[![Hashnode](https://img.shields.io/badge/Hashnode-2962FF?style=for-the-badge&logo=hashnode&logoColor=white)](https://hashnode.com/@sagar-1m)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:maheshwarisagar65@gmail.com)

</div>

<div align="center">

---

Thanks for reading! 🙏

[⬆️ Back to Top](#nodejs-authentication-system)

</div>
