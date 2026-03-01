import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, BookOpen, Users, 
  Trash2, Edit, X, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  addCourse, 
  getAllCourses, 
  updateCourse, 
  removeCourse 
} from '../../services/api';

const COLOR_OPTIONS = ['blue', 'orange', 'purple', 'green', 'red', 'pink'];

const colorMap = {
  blue:   'bg-blue-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  green:  'bg-emerald-500',
  red:    'bg-red-500',
  pink:   'bg-pink-500',
};

const colorRingMap = {
  blue:   'ring-blue-400',
  orange: 'ring-orange-400',
  purple: 'ring-purple-400',
  green:  'ring-emerald-400',
  red:    'ring-red-400',
  pink:   'ring-pink-400',
};

export default function TeacherCourses() {
  const [courses, setCourses]       = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editModal, setEditModal]   = useState(false);
  const [selected, setSelected]     = useState(null);

  const [newCourse, setNewCourse] = useState({ title: '', code: '', students: '', color: 'blue' });
  const [editForm, setEditForm]   = useState({ title: '', code: '', students: '', color: 'blue' });

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const { data } = await getAllCourses();
      setCourses(data.courses);
    } catch {
      toast.error('Failed to load courses.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await addCourse({
        title:    newCourse.title,
        code:     newCourse.code,
        students: Number(newCourse.students),
        color:    newCourse.color
      });
      setCourses(prev => [data.course, ...prev]);
      setShowModal(false);
      setNewCourse({ title: '', code: '', students: '', color: 'blue' });
      toast.success('Course created!');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create course.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (course) => {
    setSelected(course);
    setEditForm({
      title:    course.title,
      code:     course.code,
      students: course.students,
      color:    course.color
    });
    setEditModal(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await updateCourse(selected.course_id, {
        title:    editForm.title,
        code:     editForm.code,
        students: Number(editForm.students),
        color:    editForm.color
      });
      setCourses(prev => prev.map(c => c.course_id === selected.course_id ? data.course : c));
      setEditModal(false);
      setSelected(null);
      toast.success('Course updated!');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update course.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-slate-800 text-sm">Delete this course?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await removeCourse(id);
                setCourses(prev => prev.filter(c => c.course_id !== id));
                toast.success('Course deleted.');
              } catch {
                toast.error('Failed to delete course.');
              }
            }}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Course Management</h1>
            <p className="text-slate-500 font-medium mt-1">
              {courses.length} course{courses.length !== 1 ? 's' : ''} · Create and organize your curriculum
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create New Course
          </button>
        </header>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or code..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grid */}
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <BookOpen className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-bold text-lg">No courses found</p>
            <p className="text-sm mt-1">Try a different search or create a new course</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.course_id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group relative">
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl ${colorMap[course.color] || 'bg-blue-500'} shadow-lg`}>
                    {course.title.charAt(0)}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditClick(course)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.course_id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{course.code}</p>

                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-50">
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
        )}

        {/* Add Modal */}
        {showModal && (
          <Modal title="New Course" onClose={() => setShowModal(false)}>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <FormField label="Course Name">
                <input
                  required type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all"
                  placeholder="e.g. Organic Chemistry"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
              </FormField>
              <FormField label="Course Code">
                <input
                  required type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all"
                  placeholder="e.g. CHM_101"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
                />
              </FormField>
              <FormField label="Initial Student Count">
                <input
                  required type="number" min="0"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all"
                  placeholder="0"
                  value={newCourse.students}
                  onChange={(e) => setNewCourse({ ...newCourse, students: e.target.value })}
                />
              </FormField>
              <FormField label="Color">
                <ColorPicker value={newCourse.color} onChange={(c) => setNewCourse({ ...newCourse, color: c })} />
              </FormField>
              <SubmitButton loading={submitting} label="Create Course" />
            </form>
          </Modal>
        )}

        {/* Edit Modal */}
        {editModal && (
          <Modal title="Edit Course" onClose={() => setEditModal(false)}>
            <form onSubmit={handleUpdateCourse} className="space-y-4">
              <FormField label="Course Name">
                <input
                  required type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </FormField>
              <FormField label="Course Code">
                <input
                  required type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all"
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                />
              </FormField>
              <FormField label="Student Count">
                <input
                  required type="number" min="0"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 transition-all"
                  value={editForm.students}
                  onChange={(e) => setEditForm({ ...editForm, students: e.target.value })}
                />
              </FormField>
              <FormField label="Color">
                <ColorPicker value={editForm.color} onChange={(c) => setEditForm({ ...editForm, color: c })} />
              </FormField>
              <SubmitButton loading={submitting} label="Save Changes" />
            </form>
          </Modal>
        )}

      </div>
    </div>
  );
}

// --- Sub-components ---

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-black text-slate-400 uppercase mb-2">{label}</label>
      {children}
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {COLOR_OPTIONS.map(c => (
        <button
          key={c} type="button"
          onClick={() => onChange(c)}
          className={`w-8 h-8 rounded-full ${colorMap[c]} transition-all
            ${value === c ? `ring-2 ring-offset-2 ${colorRingMap[c]} scale-110` : 'hover:scale-105'}`}
        />
      ))}
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold mt-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? 'Please wait...' : label}
    </button>
  );
}