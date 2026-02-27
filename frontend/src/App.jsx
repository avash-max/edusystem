import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/sidebar';

// Auth Pages
import Login from './pages/auth/Login';

// Student Pages
import EduLearnDashboard from './pages/dashboard';
import CoursesDashboard from './pages/courses';
import GradesDashboard from './pages/grades';
import AssignmentsDashboard from './pages/assignment';
import CalenderDashboard from './pages/calender';
import ResourcesDashboard from './pages/resources';

// Teacher Pages
import TeacherDashboard from './pages/teacher/dashboard';
import TeacherCourse from './pages/teacher/courses';

function AppRoutes() {
  const { user } = useAuth();

  // If not logged in, only allow access to login page
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
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

        {/* Catch all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      {/* Note: If your sidebar is 'fixed', keep the ml-72. 
          If you want it simple, use 'relative' in Sidebar and remove ml-72 here.
      */}
      <main className="flex-1 ml-20 md:ml-72 transition-all duration-300 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;