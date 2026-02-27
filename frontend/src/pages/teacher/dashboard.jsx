import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Clock, Plus, 
  MoreVertical, Edit3, Trash2, GraduationCap,
  Calendar, ArrowUpRight, X
} from 'lucide-react';

export default function TeacherDashboard() {
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // --- Mock Backend Data ---
  const [courses, setCourses] = useState([
    { id: 1, name: 'Advanced Mathematics', code: 'MTH_401', students: 45, assignments: 12, trend: '+2' },
    { id: 2, name: 'Chemistry Laboratory', code: 'CHM_302', students: 32, assignments: 10, trend: '0' },
    { id: 3, name: 'Web Development', code: 'CS_205', students: 38, assignments: 8, trend: '+5' }
  ]);

  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Calculus Problem Set 5', course: 'Advanced Mathematics', dueDate: '2026-02-08', submissions: 38 },
    { id: 2, title: 'Lab Report: Chemical Reactions', course: 'Chemistry Lab', dueDate: '2026-02-10', submissions: 12 }
  ]);

  // Form State
  const [newAssignment, setNewAssignment] = useState({ title: '', course: '', dueDate: '' });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- CRUD Operations ---
  const handleAddAssignment = (e) => {
    e.preventDefault();
    const id = assignments.length + 1;
    setAssignments([{ ...newAssignment, id, submissions: 0 }, ...assignments]);
    setShowModal(false);
    setNewAssignment({ title: '', course: '', dueDate: '' });
  };

  const deleteAssignment = (id) => {
    if(window.confirm("Are you sure you want to remove this assignment?")) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  const editAssignment = (id) => {
    const newTitle = prompt("Enter new assignment title:");
    if (newTitle) {
      setAssignments(prev => prev.map(a => a.id === id ? { ...a, title: newTitle } : a));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <main className="max-w-[1600px] mx-auto p-6 lg:p-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">{greeting}, Prof.</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your classroom and track student progress.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> New Assignment
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Users className="text-blue-600" />} label="Total Students" value="115" trend="+12%" />
          <StatCard icon={<BookOpen className="text-purple-600" />} label="Active Courses" value="3" />
          <StatCard icon={<GraduationCap className="text-emerald-600" />} label="Average Grade" value="88%" trend="+2.4%" />
          <StatCard icon={<Clock className="text-orange-600" />} label="Pending Reviews" value="24" urgent />
        </div>

        {/* Courses Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Active Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-wider text-slate-500">
                    {course.code}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{course.name}</h3>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-50 text-sm">
                  <span className="font-bold">{course.students} Students</span>
                  <span className="font-bold">{course.assignments} Tasks</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Assignments Table */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Assignments</h2>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {assignments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-900">{a.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{a.course}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">{a.dueDate}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => editAssignment(a.id)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteAssignment(a.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Simple Add Assignment Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Add Assignment</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddAssignment} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Title</label>
                  <input 
                    required type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                    placeholder="e.g. Final Project"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Course</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                    value={newAssignment.course}
                    onChange={(e) => setNewAssignment({...newAssignment, course: e.target.value})}
                  >
                    <option value="">Select a course</option>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Due Date</label>
                  <input 
                    required type="date" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold mt-4 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Post Assignment
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, trend, urgent }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        {trend && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-slate-900">{value}</h4>
        {urgent && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
      </div>
    </div>
  );
}