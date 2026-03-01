import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { StudentSidebar } from './components/StudentSidebar';
import  {TeacherSidebar} from './components/TeacherSidebar';

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
import TeacherAssignment from './pages/teacher/Assignments';
import TeacherResources from './pages/teacher/Resources';
import TeacherSubmission from './pages/teacher/Submission';
import { getUserRole } from './protected/authRole';


// --- Read from localStorage so it survives refresh ---
const userRole = getUserRole();

console.log('User Role:', userRole);

function AppLayout() {
  if (!userRole) {
    return (
      <main className="flex-1">
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*"         element={<Navigate to="/login" />} />
        </Routes>
      </main>
    );
  }

  if (userRole === 'teacher') {
    return (
      <>
        <TeacherSidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/"             element={<TeacherDashboard />} />
            <Route path="/courses"     element={<TeacherCourse />} />
            <Route path="/assignments" element={<TeacherAssignment />} />
            <Route path="/assignments/:id" element={<TeacherSubmission />} />
            <Route path="/resources" element={<TeacherResources />} />
            {/* <Route path="*"                    element={<Navigate to="/teacher" replace />} /> */}
          </Routes>
        </main>
      </>
    );
  }

  // Student
  return (
    <>
      <StudentSidebar />
      <main className="flex-1">
        <Routes>
          <Route path="/"            element={<EduLearnDashboard />} />
          <Route path="/courses"     element={<CoursesDashboard />} />
          <Route path="/assignments" element={<AssignmentsDashboard />} />
          <Route path="/resources"   element={<ResourcesDashboard />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <div className="flex min-h-screen bg-slate-50">
          <AppLayout />
        </div>
      </Router>
    </>
  );
}