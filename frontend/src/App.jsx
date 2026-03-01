import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import { Toaster } from 'react-hot-toast';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student
import EduLearnDashboard from './pages/dashboard';
import CoursesDashboard from './pages/courses';
import GradesDashboard from './pages/grades';
import AssignmentsDashboard from './pages/assignment';
import CalenderDashboard from './pages/calender';
import ResourcesDashboard from './pages/resources';

// Teacher
import TeacherDashboard from './pages/teacher/dashboard';
import TeacherCourse from './pages/teacher/courses';

export default function App() {
  // Simple toggle for demo purposes
  const isLoggedIn = true; 
  const userRole = 'student'; // or 'teacher'

  return (
      <>
      <Toaster
        position="top-right"
      />
      <Router>
        <div className="flex min-h-screen bg-slate-50">
          {/* Only show Sidebar if logged in */}
          {isLoggedIn && <Sidebar role={userRole} />}

          <main className={isLoggedIn ? "flex-1 ml-20 md:ml-72 p-4" : "flex-1"}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes */}
              <Route path="/" element={<EduLearnDashboard />} />
              <Route path="/courses" element={<CoursesDashboard />} />
              <Route path="/grades" element={<GradesDashboard />} />
              <Route path="/assignments" element={<AssignmentsDashboard />} />
              <Route path="/calendar" element={<CalenderDashboard />} />
              <Route path="/resources" element={<ResourcesDashboard />} />

              {/* Teacher Routes */}
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/courses" element={<TeacherCourse />} />

              {/* Redirect any unknown page to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}