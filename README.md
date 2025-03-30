# Node.js Authentication System

A comprehensive, production-ready authentication system built with Node.js, Express, MongoDB, and JWT providing secure user management, session tracking, and role-based authorization.

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
- [Implemented Functionality Checklist](#-implemented-functionality-checklist)
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

  - Secure registration with email verification
  - Login with JWT tokens (access and refresh tokens)
  - Hashed passwords with bcrypt
  - Centralized environment configuration with validation
  - Token rotation for enhanced security

- **Multi-Device Session Management**

  - Device tracking and limiting (configurable max devices)
  - Active sessions viewing and management
  - Single device logout
  - Logout from all devices except current
  - Device and IP tracking for enhanced security

- **Authorization**

  - Role-based access control (admin/user)
  - Protected routes with middleware
  - Token blacklisting for secure logout

- **Password Management**

  - Forgot password functionality
  - Secure password reset with expiring tokens
  - Strong password validation with express-validator

- **Security Measures**
  - Rate limiting to prevent brute force attacks
  - Input validation to prevent injection attacks
  - HTTP-only, secure, SameSite cookies
  - Security headers with Helmet
  - Token blacklisting system
  - CORS protection with cors
  - Environment variable validation at startup

## ✅ Implemented Functionality Checklist

- <input disabled="" type="checkbox" checked> User registration with strong validation
- <input disabled="" type="checkbox" checked> Email verification with secure tokens
- <input disabled="" type="checkbox" checked> User login with JWT (access and refresh tokens)
- <input disabled="" type="checkbox" checked> Password hashing with bcrypt (10 salt rounds)
- <input disabled="" type="checkbox" checked> HTTP-only, secure cookies for token storage
- <input disabled="" type="checkbox" checked> Session tracking and management
- <input disabled="" type="checkbox" checked> Multi-device support with device limiting
- <input disabled="" type="checkbox" checked> Role-based authorization (user/admin)
- <input disabled="" type="checkbox" checked> Protected routes with middleware
- <input disabled="" type="checkbox" checked> Refresh token rotation for enhanced security
- <input disabled="" type="checkbox" checked> Token blacklisting for secure logout
- <input disabled="" type="checkbox" checked> Centralized configuration with validation
- <input disabled="" type="checkbox" checked> Environment variable validation at startup
- <input disabled="" type="checkbox" checked> Time string parsing for token expiration
- <input disabled="" type="checkbox" checked> Input validation with express-validator
- <input disabled="" type="checkbox" checked> Rate limiting for API and login endpoints
- <input disabled="" type="checkbox" checked> Forgot password functionality
- <input disabled="" type="checkbox" checked> Password reset with expiring tokens
- <input disabled="" type="checkbox" checked> Multi-device logout options
- <input disabled="" type="checkbox" checked> Individual session termination
- <input disabled="" type="checkbox" checked> Health check endpoint
- <input disabled="" type="checkbox" checked> Security headers with Helmet
- <input disabled="" type="checkbox" checked> User-Agent and IP tracking
- <input disabled="" type="checkbox" checked> MongoDB TTL indexes for auto-cleanup
- <input disabled="" type="checkbox" checked> Structured API responses with utils

## 🛠 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=for-the-badge&logo=lock&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-0C63A6?style=for-the-badge&logo=security&logoColor=white)
![cors](https://img.shields.io/badge/cors-FF3E00?style=for-the-badge&logo=cors&logoColor=white)
![nodemailer](https://img.shields.io/badge/nodemailer-339933?style=for-the-badge&logo=nodemailer&logoColor=white)
![Mailtrap](https://img.shields.io/badge/Mailtrap-FF3300?style=for-the-badge&logo=mailtrap&logoColor=white)

- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB with (Mongoose ODM)
- **Authentication**: JWT with access and refresh tokens
- **Password Hashing**: bcrypt with 10 salt rounds
- **Input Validation**: express-validator
- **Rate Limiting**: express-rate-limit
- **Security Headers**: Helmet
- **Cookie Handling**: cookie-parser
- **CORS Protection**: cors
- **Email Services**: nodemailer with Mailtrap
- **Environment Variables**: dotenv
- **Configuration Management**: Centralized config with validation

## 🔒 Security Implementation

This authentication system is designed with security in mind. Here are some of the security measures implemented:

- **Advanced Token System**

  - Short-lived access tokens (5 minutes) for API requests.
  - Long-lived refresh tokens (7 days) for session management.
  - Token rotation on refresh for enhanced security.
  - Token blacklisting system to invalidate tokens on logout.
  - Automatic token cleanup with MongoDB TTL index.

- **Secure Cookie Management**

  - HTTP-only cookies for tokens to prevent XSS attacks.
  - Secure and SameSite flags for added security.
  - Cookie expiration set to token expiry time.
  - Cookie clearing on logout for added security.

- **Session Security**

  - Device limiting (default: 2 devices per user)
  - Last used tracking
  - Device and IP tracking
  - Single device logout
  - Force logout from all devices except current
  - Individual session termination

- **Password Security**

  - Passwords are hashed using bcrypt
  - Passowrd requirements enforced via express-validator:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character

- **Request Protection**

  - Rate limiting:
    - General API: 100 requests per 15 minutes
    - Login endpoints: 5 attempts per 15 minutes
  - Input validation for all routes
  - CORS configuration to prevent cross-origin attacks
  - Security headers with Helmet for added protection

- **Environment Security**

  - Required variable validation at startup
  - Default values for optional variables
  - Structured configuration object
  - Time string parsing for JWT expiry

- **Email Security**

  - Email verification system with crypto tokens
  - Forgot password system with expiring tokens
  - Mailtrap for email testing and development
  - Email templates for user communication using HTML

## 📂 Project Structure

The project follows the MVC (Model-View-Controller) pattern:

```
├── config/
│   └── env.config.js         # Centralized configuration
├── controllers/
│   └── user.controller.js    # User-related operations
├── middleware/
│   ├── auth.middleware.js    # Authentication & authorization
│   ├── rateLimiter.middleware.js # Request rate limiting
│   └── validation.middleware.js  # Input validation
├── models/
│   ├── blacklistedTokens.model.js # Revoked tokens
│   ├── refreshToken.model.js # Session management
│   └── user.model.js         # User data & authentication
├── routes/
│   └── user.routes.js        # API endpoints
├── utils/
│   ├── apiResponse.utils.js  # Response formatting
│   ├── auth.utils.js         # Authentication helpers
│   ├── cookie.utils.js       # Cookie management
│   ├── db.utils.js           # Database connection
│   ├── mailer.utils.js       # Email functionality
│   ├── session.utils.js      # Session management
│   └── token.utils.js        # Token generation & handling
├── .env                      # Environment variables
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── index.js                  # Application entry point
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## 🔌 API Endpoints

### Health & System Endpoints

| Method | Endpoint       | Description             | Authentication | Rate Limiting |
| ------ | -------------- | ----------------------- | -------------- | ------------- |
| GET    | `/healthcheck` | Check API health status | None           | None          |

### Authentication Endpoints (Public)

| Method | Endpoint                              | Description                  | Authentication | Rate Limiting    |
| ------ | ------------------------------------- | ---------------------------- | -------------- | ---------------- |
| POST   | `/api/v1/users/register`              | Register a new user          | None           | General API rate |
| POST   | `/api/v1/users/login`                 | Login a user                 | None           | Login rate limit |
| GET    | `/api/v1/users/verify/:token`         | Verify email address         | None           | None             |
| POST   | `/api/v1/users/forgot-password`       | Request password reset email | None           | General API rate |
| PUT    | `/api/v1/users/reset-password/:token` | Reset password with token    | None           | General API rate |
| POST   | `/api/v1/users/refresh-token`         | Refresh access token         | Refresh token  | None             |

### User Profile & Management (Protected)

| Method | Endpoint                | Description         | Authentication | Rate Limiting    |
| ------ | ----------------------- | ------------------- | -------------- | ---------------- |
| GET    | `/api/v1/users/profile` | Get user profile    | Access token   | General API rate |
| POST   | `/api/v1/users/logout`  | Logout current user | Access token   | General API rate |

### Session Management (Protected)

| Method | Endpoint                                 | Description                            | Authentication | Rate Limiting    |
| ------ | ---------------------------------------- | -------------------------------------- | -------------- | ---------------- |
| GET    | `/api/v1/users/sessions`                 | List all active sessions               | Access token   | General API rate |
| POST   | `/api/v1/users/logout-all-other-devices` | Logout from all devices except current | Access token   | General API rate |
| DELETE | `/api/v1/users/sessions/:sessionId`      | Terminate specific session             | Access token   | General API rate |

### Role-Based Access (Protected)

| Method | Endpoint              | Description          | Authentication            | Rate Limiting    |
| ------ | --------------------- | -------------------- | ------------------------- | ---------------- |
| GET    | `/api/v1/users/admin` | Access admin content | Access token + Admin role | General API rate |

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
# Development mode with auto-restart on file changes
npm run dev

# Production mode
npm start
```

6. **Access the API**

```sh
# The API base URL: http://localhost:5000

```

## 📝 Usage Examples

Here are some example requests to get you started with the API using Postman:

### Health Check

Check if the API is up and running:

```http
GET /healthcheck
```

Response:

```json
{
  "status": "Ok",
  "message": "Server is running",
  "environment": "development",
  "uptime": 1234,
  "timestamp": "2023-09-15T12:34:56.789Z"
}
```

### User Registration

Register a new user account:

```http
POST /api/v1/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Email Verification

Verify user email with the token sent via email:

```http
GET /api/v1/users/verify/:token
```

### User Login

Login with verified user credentials:

```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

Note: The login request will return the access and refresh tokens in the HTTP-only cookies.

### Forgot Password

Request a password reset email:

```http
POST /api/v1/users/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Reset Password

Reset the user password with the token sent via email:

```http
PUT /api/v1/users/reset-password/:token
Content-Type: application/json

{
  "password": "NewPassword123!"
}
```

### Refresh Access Token

Get a new access token using the refresh token (automatically uses the refresh token cookie):

```http
POST /api/v1/users/refresh-token
```

Note: The refresh tokens must be sent in the HTTP-only cookie.

### Get User Profile

Retrieve the user profile with the access token:

```http
GET /api/v1/users/profile
Cookie: accessToken=<your_access_token>
```

### View Active Sessions

List all active sessions for the user:

```http
GET /api/v1/users/sessions
Cookie: accessToken=<your_access_token>
```

### Terminate Specific Session

End a specific session by its ID:

```http
DELETE /api/v1/users/sessions/:sessionId
Cookie: accessToken=<your_access_token>
```

### Logout from All Other Devices

Logout from all devices except the current one:

```http
POST /api/v1/users/logout-all-other-devices
Cookie: accessToken=<your_access_token>
```

### Access Admin Route

Access an admin-only route with the access token:

```http
GET /api/v1/users/admin
Cookie: accessToken=<your_access_token>
```

### Logout Current User

Logout the current user and clear the session:

```http
POST /api/v1/users/logout
Cookie: accessToken=<your_access_token>
```

Note: The logout request will clear the access and refresh tokens from the cookies.

## ⚙️ Environment Variables

The environment variables are stored in a `.env.example` file. Create a new file named `.env` and copy the contents of `.env.example` into it. Update the values of the environment variables with your own values.

```sh
# Server configuration
PORT=5000  # API server port
NODE_ENV=development
FRONTEND_URL=http://localhost:3000 # Frontend URL
BASE_URL=http://localhost:5000 # API base URL

# Database configuration (Option 1: Components)
MONGODB_URI=mongodb+srv://your_username:your_password@your_host/your_database_name


# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your_very_long_access_token_secret_here
ACCESS_TOKEN_EXPIRESIN=5m
JWT_REFRESH_TOKEN_SECRET=your_very_long_refresh_token_secret_here
REFRESH_TOKEN_EXPIRESIN=2d

# Email Configuration (Mailtrap)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
MAILTRAP_SENDEREMAIL=your_email
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password

# Security Configuration
MAX_DEVICES_PER_USER=2
```

## 📦 Data Models

The application uses three data models: `User`, `BlacklistedToken` and `RefreshToken`. Here's a brief overview of the schema and models:

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

  },
  createdAt: Date,
  updatedAt: Date
}

blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-cleanup
```

### RefreshToken Model

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
    required: true
  },
  deviceInfo: {
    type: String,
    required: true
  },
  ipAddress: String
  issuedAt: Date,
  lastUsed: Date,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔮 Future Enhancements

- <input disabled="" type="checkbox"> Add social authentication (Google, GitHub, etc.)
- <input disabled="" type="checkbox"> Implement two-factor authentication (2FA)
- <input disabled="" type="checkbox"> Add user profile management endpoints
- <input disabled="" type="checkbox"> Add account lockout after failed login attempts
- <input disabled="" type="checkbox"> Create comprehensive test suite
- <input disabled="" type="checkbox"> Implement geo-location tracking for sessions
- <input disabled="" type="checkbox"> Add suspicious activity detection

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

- [SagarMaheshwari](https://x.com/SagarTheDev)

[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/SagarTheDev)
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
