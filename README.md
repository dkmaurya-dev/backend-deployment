# Backend API

A production-ready RESTful API built with Express.js and ES6 modules.

## Features

- ✅ **ES6 Modules** - Modern JavaScript syntax
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🛡️ **Authorization** - Role-based access control
- 🔒 **Password Hashing** - Bcrypt for secure password storage
- 📝 **Request Logging** - Morgan for HTTP request logging
- 🎨 **Custom Logger** - Color-coded console logging
- 🌐 **CORS** - Configurable cross-origin resource sharing
- ⚠️ **Error Handling** - Centralized error handling middleware
- 🏥 **Health Checks** - API monitoring endpoints
- 🔄 **Graceful Shutdown** - Proper process management

## Project Structure

```
backend-api/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # Server entry point
│   ├── routes/
│   │   ├── health.routes.js        # Health check routes
│   │   ├── auth.routes.js          # Authentication routes
│   │   └── user.routes.js          # User management routes
│   ├── controllers/
│   │   ├── health.controller.js    # Health check logic
│   │   ├── auth.controller.js      # Authentication logic
│   │   └── user.controller.js      # User management logic
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT authentication
│   │   └── error.middleware.js     # Error handling
│   ├── config/
│   │   └── env.js                  # Environment configuration
│   └── utils/
│       └── logger.js               # Custom logger
├── .env                            # Environment variables
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000
HOST=localhost

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

API_PREFIX=/api/v1
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Health Check

- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed system information

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (Protected)
- `POST /api/v1/auth/logout` - Logout user (Protected)

### User Management

- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (Protected)
- `PUT /api/v1/users/:id` - Update user (Protected)
- `DELETE /api/v1/users/:id` - Delete user (Protected)

## API Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **CORS Protection** - Configurable allowed origins
- **Input Validation** - Request validation middleware
- **Error Handling** - Secure error messages in production

## Production Considerations

1. **Environment Variables** - Always use strong JWT secrets in production
2. **Database** - Replace in-memory storage with a proper database (MongoDB, PostgreSQL, etc.)
3. **Rate Limiting** - Add rate limiting middleware to prevent abuse
4. **HTTPS** - Use HTTPS in production
5. **Logging** - Consider using a logging service (Winston, Pino, etc.)
6. **Monitoring** - Add application monitoring (PM2, New Relic, etc.)
7. **Testing** - Add unit and integration tests

## License

ISC
