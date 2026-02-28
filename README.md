# EduLearn - Learning Management System (LMS)

A modern, beautiful, and feature-rich Learning Management System built with React, Node.js, and MongoDB.

## Screenshots

- **Student Dashboard**: Track courses, assignments, grades, and calendar
- **Teacher Dashboard**: Manage courses, students, assignments, and grading
- **Modern UI**: Beautiful gradient design with Tailwind CSS
- **Responsive**: Works perfectly on desktop, tablet, and mobile

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git**

### Installation

#### 1. Clone Repository

```bash
git clone <repository-url>
cd edusystem
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install express cors dotenv bcryptjs jsonwebtoken mongoose

# Create .env file
cp .env.example .env

# Configure your .env file:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/edulearn
# - JWT_SECRET=your_secret_key_here
# - NODE_ENV=development

# Start backend server
npm start
# OR for development with auto-reload:
npm run dev
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install axios

# Create .env file
cp .env.example .env

# Configure your .env file:
# - VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
# Opens at http://localhost:5173
```

---

## 📋 Default Credentials

### Student Login
- **Email**: student@example.com
- **Password**: password

### Teacher Login
- **Email**: teacher@example.com
- **Password**: password

---

## 🏗️ Project Structure

```
edusystem/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx              ✨ Role-aware navigation
│   │   │   ├── ProtectedRoute.jsx       🔒 Auth protection
│   │   │   └── ErrorBoundary.jsx        ⚠️ Error handling
│   │   ├── context/
│   │   │   └── AuthContext.jsx          👤 Auth state management
│   │   ├── services/
│   │   │   └── api.js                   🔌 API layer
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── Login.jsx            🔐 Login page
│   │   │   ├── dashboard.jsx            📊 Student dashboard
│   │   │   ├── courses.jsx              📚 Courses management
│   │   │   ├── assignments.jsx          ✏️ Assignments tracker
│   │   │   ├── calendar.jsx             📅 Calendar view
│   │   │   ├── grades.jsx               📈 Grades tracking
│   │   │   ├── resources.jsx            📁 Resources library
│   │   │   └── teacher/
│   │   │       └── dashboard.jsx        👨‍🏫 Teacher dashboard
│   │   ├── App.jsx                      🎯 Routes & layout
│   │   └── main.jsx                     ⚡ Entry point
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js                        🗄️ Database config
│   ├── controllers/
│   │   ├── authController.js            🔐 Auth logic
│   │   ├── courseController.js          📚 Course logic
│   │   ├── assignmentController.js      ✏️ Assignment logic
│   │   ├── gradeController.js           📊 Grading logic
│   │   └── userController.js            👤 User management
│   ├── middlewares/
│   │   ├── auth.js                      🔒 JWT verification
│   │   └── errorHandler.js              ⚠️ Error handling
│   ├── models/
│   │   ├── User.js                      👤 User schema
│   │   ├── Course.js                    📚 Course schema
│   │   ├── Assignment.js                ✏️ Assignment schema
│   │   └── Grade.js                     📊 Grade schema
│   ├── routes/
│   │   ├── auth.js                      🔐 Auth routes
│   │   ├── courses.js                   📚 Course routes
│   │   ├── assignments.js               ✏️ Assignment routes
│   │   └── users.js                     👤 User routes
│   ├── server.js                        🚀 Express server
│   ├── .env.example
│   └── package.json
│
└── README.md                            📖 This file
```

---

## 🔄 Implementation Roadmap

### ✅ Completed
- [x] Frontend UI Design
- [x] Authentication Context
- [x] Login Page
- [x] Protected Routes
- [x] Role-Based Navigation
- [x] API Service Layer
- [x] Student Dashboard
- [x] Teacher Dashboard

### 🚧 In Progress
- [ ] Backend API Setup
- [ ] Database Models
- [ ] Authentication Endpoints
- [ ] Course API
- [ ] Assignment API

### 📋 TODO (Next)

#### Phase 1: Backend Core (Week 1)
```
[ ] Setup Express.js server
[ ] Configure MongoDB connection
[ ] Create User model (Student, Teacher, Admin)
[ ] Create JWT authentication middleware
[ ] Implement register endpoint
[ ] Implement login endpoint
[ ] Test with Postman
```

#### Phase 2: Core Features (Week 2)
```
[ ] Create Course model & CRUD
[ ] Create Assignment model & CRUD
[ ] Create Grade model & CRUD
[ ] Create submission system
[ ] Implement grading functionality
[ ] File upload system (Multer)
```

#### Phase 3: Frontend Integration (Week 2-3)
```
[ ] Connect login to backend API
[ ] Connect courses to backend
[ ] Connect assignments to backend
[ ] Connect grades to backend
[ ] Real-time data loading
[ ] Error handling & validation
```

#### Phase 4: Advanced Features (Week 4+)
```
[ ] Real-time notifications
[ ] Discussion forum/chat
[ ] Email notifications
[ ] File download/preview
[ ] Analytics & reports
[ ] Search & filtering
```

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend
- **Node.js & Express** - Server
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests

---

## 📱 Features

### For Students
✅ Dashboard with course overview
✅ View all enrolled courses
✅ Track assignments and due dates
✅ Submit assignments and view feedback
✅ Check grades and progress
✅ Calendar with events
✅ Access course resources
✅ Real-time notifications

### For Teachers
✅ Dashboard with class overview
✅ Create and manage courses
✅ Create and manage assignments
✅ View student submissions
✅ Grade assignments
✅ Track student progress
✅ Send announcements
✅ Manage class roster

### For Admin (Planned)
✅ User management
✅ Course management
✅ System analytics
✅ Reports

---

## 🔐 Authentication Flow

1. **Login Page** → User enters credentials
2. **Backend Validation** → Checks email/password, generates JWT
3. **Token Storage** → JWT stored in localStorage
4. **Protected Routes** → Routes check for token & user role
5. **API Authorization** → JWT sent with all requests
6. **Logout** → Token removed, redirected to login

---

## 🔗 API Endpoints (To Be Implemented)

### Auth
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - User login
GET    /api/auth/me            - Get current user
POST   /api/auth/logout        - User logout
```

### Courses
```
GET    /api/courses            - Get all courses
GET    /api/courses/:id        - Get course details
POST   /api/courses            - Create course (Teacher)
PUT    /api/courses/:id        - Update course (Teacher)
DELETE /api/courses/:id        - Delete course (Teacher)
POST   /api/courses/:id/enroll - Enroll in course (Student)
```

### Assignments
```
GET    /api/assignments              - Get all assignments
GET    /api/assignments/:id          - Get assignment details
POST   /api/assignments              - Create assignment (Teacher)
PUT    /api/assignments/:id          - Update assignment (Teacher)
DELETE /api/assignments/:id          - Delete assignment (Teacher)
POST   /api/assignments/:id/submit   - Submit assignment (Student)
GET    /api/assignments/:id/submissions - Get submissions (Teacher)
POST   /api/assignments/submissions/:id/grade - Grade submission (Teacher)
```

### Grades
```
GET    /api/grades?studentId=:id    - Get student grades
GET    /api/grades?courseId=:id     - Get course grades
PUT    /api/grades/:id              - Update grade
```

### Users
```
GET    /api/users/profile           - Get user profile
PUT    /api/users/profile           - Update profile
GET    /api/users/students          - Get all students (Teacher)
GET    /api/users/teachers          - Get all teachers (Admin)
```

---

## 🧪 Testing

### Login as Student
1. Navigate to `http://localhost:5173/login`
2. Click "Student" button
3. Enter: `student@example.com` / `password`
4. Access student dashboard at `/`

### Login as Teacher
1. Navigate to `http://localhost:5173/login`
2. Click "Teacher" button
3. Enter: `teacher@example.com` / `password`
4. Access teacher dashboard at `/teacher`

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Change port in backend .env or frontend vite.config.js
# Backend: PORT=5001
# Frontend: --port 5174 (vite automatically increments)
```

### MongoDB connection error
```bash
# Check MongoDB is running
# Update MONGODB_URI in .env
# If using local: mongodb://localhost:27017/edulearn
# If using Atlas: mongodb+srv://username:password@cluster.mongodb.net/edulearn
```

### CORS errors
```
# Make sure backend allows frontend origin
# In backend, CORS should allow: http://localhost:5173
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the PROJECT_STRUCTURE.md file
3. Check browser console for errors
4. Review backend server logs

---

## 📜 License

This project is licensed under the MIT License.

---

## 🎉 Happy Learning!

Built with ❤️ for educators and students worldwide.
