# EduSystem Project Documentation

## 📌 Overview

EduSystem is an educational platform designed to connect students and teachers.
The repository contains a **Node.js/Express backend** and a **React/Vite frontend**.
Users can register as students or teachers, manage courses, assignments, and resources.

---

## 🗂️ Repository Structure

```
README.md
backend/
  index.js            # Entry point for Express server
  controllers/        # Request handlers grouped by feature
  db/                 # Database connection logic
  helpers/            # Reusable middleware and utilities
  models/             # Mongoose schemas for MongoDB
  routes/             # Express route definitions
  uploads/            # File storage for resource uploads
utils/
  emailTemplates/     # HTML templates for password reset and verification
frontend/
  src/
    components/       # Reusable UI components
    pages/            # Route pages (authentication, dashboard, etc.)
    services/         # API call wrappers
    protected/        # Authorization helpers
    assets/           # Static images or icons
    App.jsx           # Top-level React component
    main.jsx          # Frontend entry point
  public/             # Public assets and index.html
  package.json        # Frontend dependencies and scripts

```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>=14)
- npm or yarn
- MongoDB instance (local or cloud)

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```
2. **Environment variables**
   Create a `.env` file with:
   ```ini
   PORT=5000
   MONGO_URI=<your mongodb connection string>
   JWT_SECRET=<your secret>
   EMAIL_SERVICE_API_KEY=<if using email verification>
   ```
3. **Run server**
   ```bash
   npm run dev    # uses nodemon
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
2. **Configure API base URL**
   In `src/services/api.js` set the backend endpoint (e.g., `http://localhost:5000/api`)
3. **Start development server**
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` (or port shown) in browser.

---

## 🔧 Features

- **User registration & authentication** (students & teachers)
- **Role-based UI** with different dashboards
- **Course creation and enrollment**
- **Assignment creation, submission, and grading**
- **Resource uploads/downloads**
- **Email verification and password reset workflows**

---

## 🧩 Backend Highlights

- **Express.js** server with modular route/controller design
- **Mongoose models** for `User`, `Course`, `Assignment`, `Resource`, etc.
- **JWT-based authentication** and middleware (`authMiddleware.js`, `roleMiddleware.js`)
- **File uploads** handled by `multer.js` (stored in `uploads/`)
- **Email utilities** for verification/reset (see `utils/emailTemplates`)

---

## 🎨 Frontend Highlights

- Built with **React** and **Vite** for fast development
- Uses **Tailwind CSS** classes for styling and theming
- **Multi-step registration flow** with role switcher (`Register.jsx`)
- Protected routes and role guards (`ProtectedRoute.jsx`, `authRole.js`)
- Components like `InputField`, theme handling, and dynamic icons
- API service wrapper (`src/services/api.js`) for axios calls

---

## 📁 Useful Scripts

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon |
| `npm start` | Start production server |
| `npm test` | Run backend tests (if any) |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |

---

## 📄 Generating PDF Documentation

1. Make sure you have [Pandoc](https://pandoc.org/installing.html) installed.
2. Run:
   ```bash
   pandoc DOCUMENTATION.md -o EduSystem-docs.pdf
   ```
3. Alternatively, use VS Code extension **Markdown PDF** or an online converter.

> You can modify `DOCUMENTATION.md` as needed and re-run conversion.

---

## 📝 Notes & Future Work

- Implement tests for backend and frontend
- Add real-time features (notifications, chat)
- Deploy to cloud platforms (Heroku, Vercel, etc.)
- Enhance accessibility and mobile responsiveness

---

## 📬 Contact

For questions or contributions, please open an issue or pull request on the repository.

---

*Last Updated: March 4, 2026*
