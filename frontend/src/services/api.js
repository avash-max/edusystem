// API Service Layer - Configure API calls

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Utility function to get token
const getToken = () => localStorage.getItem('token');

// Utility function for making API calls
async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - Token expired
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Handle error responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ===================== AUTH ENDPOINTS =====================
export const authAPI = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password, role) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => apiCall('/auth/me'),
};

// ===================== COURSES ENDPOINTS =====================
export const coursesAPI = {
  getAll: () => apiCall('/courses'),

  getById: (id) => apiCall(`/courses/${id}`),

  create: (courseData) =>
    apiCall('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),

  update: (id, courseData) =>
    apiCall(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),

  delete: (id) =>
    apiCall(`/courses/${id}`, {
      method: 'DELETE',
    }),

  enroll: (courseId) =>
    apiCall(`/courses/${courseId}/enroll`, {
      method: 'POST',
    }),
};

// ===================== ASSIGNMENTS ENDPOINTS =====================
export const assignmentsAPI = {
  getAll: () => apiCall('/assignments'),

  getById: (id) => apiCall(`/assignments/${id}`),

  getByCourse: (courseId) => apiCall(`/assignments?courseId=${courseId}`),

  create: (assignmentData) =>
    apiCall('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    }),

  update: (id, assignmentData) =>
    apiCall(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    }),

  delete: (id) =>
    apiCall(`/assignments/${id}`, {
      method: 'DELETE',
    }),

  submitAssignment: (assignmentId, submissionData) =>
    apiCall(`/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData),
    }),

  gradeSubmission: (submissionId, gradeData) =>
    apiCall(`/assignments/submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify(gradeData),
    }),
};

// ===================== GRADES ENDPOINTS =====================
export const gradesAPI = {
  getStudentGrades: (studentId) => apiCall(`/grades?studentId=${studentId}`),

  getCourseGrades: (courseId) => apiCall(`/grades?courseId=${courseId}`),

  updateGrade: (gradeId, gradeData) =>
    apiCall(`/grades/${gradeId}`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    }),
};

// ===================== USERS ENDPOINTS =====================
export const usersAPI = {
  getProfile: () => apiCall('/users/profile'),

  updateProfile: (userData) =>
    apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  getStudents: () => apiCall('/users/students'),

  getTeachers: () => apiCall('/users/teachers'),
};

// ===================== CALENDAR ENDPOINTS =====================
export const calendarAPI = {
  getEvents: () => apiCall('/calendar/events'),

  createEvent: (eventData) =>
    apiCall('/calendar/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  updateEvent: (eventId, eventData) =>
    apiCall(`/calendar/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),

  deleteEvent: (eventId) =>
    apiCall(`/calendar/events/${eventId}`, {
      method: 'DELETE',
    }),
};

// ===================== RESOURCES ENDPOINTS =====================
export const resourcesAPI = {
  getAll: () => apiCall('/resources'),

  getByCourse: (courseId) => apiCall(`/resources?courseId=${courseId}`),

  create: (formData) =>
    apiCall('/resources', {
      method: 'POST',
      body: formData,
    }),

  delete: (resourceId) =>
    apiCall(`/resources/${resourceId}`, {
      method: 'DELETE',
    }),

  download: (resourceId) => {
    const token = getToken();
    window.location.href = `${API_BASE_URL}/resources/${resourceId}/download?token=${token}`;
  },
};

export default {
  authAPI,
  coursesAPI,
  assignmentsAPI,
  gradesAPI,
  usersAPI,
  calendarAPI,
  resourcesAPI,
};
