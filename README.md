# Planifio - Project Management System

## Overview
Planifio is a comprehensive project management and team collaboration platform that enables organizations to manage projects, assignments, team communication, and scheduling in one unified system.

## Features
- 🔐 **User Authentication & Authorization**
  - Secure signup and login system
  - JWT-based authentication
  - Organization-based user management
  - User invitation system with email notifications

- 👥 **Team Management**
  - Organization-based team structure
  - User profiles with customizable images
  - Team member directory
  - Role-based access control

- 📋 **Project Management**
  - Create and manage multiple projects
  - Assign team members to projects
  - Track project progress
  - Team collaboration features

- ✅ **Task Management**
  - Create and assign tasks
  - Track task completion status
  - Task details and descriptions
  - User-specific task views

- 💬 **Communication**
  - Real-time messaging system
  - One-on-one conversations
  - Message read receipts
  - Conversation history

- 🔔 **Notifications**
  - Real-time notification system
  - Custom notification types
  - Click tracking for notifications
  - Notification prioritization (severity levels)

- 📅 **Calendar & Events**
  - Event scheduling and management
  - Monthly/yearly calendar views
  - User-specific event tracking
  - Date-based event filtering

## Technical Stack

### Backend
- **Framework**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Custom email service for notifications
- **Security**: bcrypt for password hashing
- **Middleware**: CORS enabled

### API Structure
```
/api
├── /auth
│   ├── /signup      # User registration
│   ├── /login       # User authentication
│   ├── /verify      # Token verification
│   └── /invite      # Team member invitation
├── /users
│   └── /           # User management
├── /projects
│   ├── /           # Project CRUD
│   └── /:id        # Project operations
├── /assignments
│   ├── /           # Assignment creation
│   ├── /:userId    # User assignments
│   └── /:id        # Assignment updates
├── /conversations
│   ├── /           # Conversation management
│   ├── /:id/messages    # Message operations
│   └── /:id/seen       # Read receipts
├── /notifications
│   ├── /           # Notification management
│   └── /:id/click  # Notification interactions
└── /events
    ├── /           # Event creation
    ├── /:userId    # User events
    └── /:id        # Event operations
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Setting Up the Database
The application will automatically create the necessary collections in MongoDB when it first runs. Make sure your MongoDB instance is running and accessible.

## API Security
- All sensitive routes are protected with JWT authentication
- Passwords are hashed using bcrypt
- CORS is configured for secure cross-origin requests
- Request rate limiting is implemented
- Input validation on all routes

## Best Practices
- Keep environment variables secure and never commit them
- Regularly update dependencies for security patches
- Follow the established code structure for new features
- Write clear commit messages
- Test new features thoroughly before deployment

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.