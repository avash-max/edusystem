import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, BookOpen, Users, 
  MoreVertical, Trash2, Edit, X,
  CheckCircle, Clock, LayoutGrid, List
} from 'lucide-react';

export default function TeacherCourses() {
  // --- State ---
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCourse, setNewCourse] = useState({ title: '', code: '', students: '', color: 'blue' });

  // --- Mock Data Load ---
  useEffect(() => {
    const mockCourses = [
      { id: 1, title: 'Advanced Mathematics', code: 'MTH_401', students: 42, assignments: 5, color: 'blue' },
      { id: 2, title: 'Chemistry Laboratory', code: 'CHM_302', students: 28, assignments: 8, color: 'orange' },
      { id: 3, title: 'Web Development', code: 'CS_205', students: 35, assignments: 12, color: 'purple' },
    ];
    setCourses(mockCourses);
  }, []);

  // --- Actions ---
  const handleAddCourse = (e) => {
    e.preventDefault();
    const id = courses.length + 1;
    setCourses([...courses, { ...newCourse, id, assignments: 0 }]);
    setShowModal(false);
    setNewCourse({ title: '', code: '', students: '', color: 'blue' });
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Course Management</h1>
            <p className="text-slate-500 font-medium">Create and organize your classroom curriculum</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create New Course
          </button>
        </header>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search your courses..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl bg-${course.color}-500 shadow-lg`}>
                  {course.title.charAt(0)}
                </div>
                <button 
                  onClick={() => deleteCourse(course.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{course.code}</p>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-bold">{course.students} Students</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-bold">{course.assignments} Tasks</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simple Add Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">New Course</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2">Course Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all"
                    placeholder="e.g. Organic Chemistry"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2">Course Code</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all"
                    placeholder="e.g. CHM_101"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2">Initial Student Count</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all"
                    placeholder="0"
                    value={newCourse.students}
                    onChange={(e) => setNewCourse({...newCourse, students: e.target.value})}
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold mt-4 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Create Course
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}