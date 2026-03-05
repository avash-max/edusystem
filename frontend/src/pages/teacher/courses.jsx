import React, { useState } from 'react';
import {
  Plus, Search, BookOpen, Users, Trash2, Edit, X,
  Loader2, Grid, List, Clock
} from 'lucide-react';

// ─── Mock data (replace with your API calls) ─────────────────────────────────
const MOCK_COURSES = [
  { course_id: 1, title: 'Organic Chemistry', code: 'CHM_101', students: 56, assignments: 8, color: '#6366f1', status: 'active', completion: 72, lastUpdated: '2 days ago' },
  { course_id: 2, title: 'Advanced Mathematics', code: 'MTH_301', students: 34, assignments: 12, color: '#0ea5e9', status: 'active', completion: 45, lastUpdated: '1 hour ago' },
  { course_id: 3, title: 'World Literature', code: 'ENG_202', students: 88, assignments: 5, color: '#f59e0b', status: 'draft', completion: 90, lastUpdated: '5 days ago' },
  { course_id: 4, title: 'Intro to Physics', code: 'PHY_101', students: 61, assignments: 9, color: '#10b981', status: 'active', completion: 33, lastUpdated: '3 days ago' },
  { course_id: 5, title: 'Data Structures', code: 'CS_301', students: 45, assignments: 15, color: '#8b5cf6', status: 'active', completion: 58, lastUpdated: '12 hours ago' },
];

const COLOR_PRESETS = ['#6366f1','#0ea5e9','#f59e0b','#10b981','#8b5cf6','#f43f5e','#64748b','#14b8a6'];

const statusConfig = {
  active:   { label: 'Active',   dot: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  draft:    { label: 'Draft',    dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50' },
  archived: { label: 'Archived', dot: 'bg-slate-300',   text: 'text-slate-500',   bg: 'bg-slate-100' },
};

const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 text-sm font-medium transition-all";

export default function TeacherCourses() {
  const [courses, setCourses]       = useState(MOCK_COURSES);
  const [search, setSearch]         = useState('');
  const [viewMode, setViewMode]     = useState('grid');
  const [filterStatus, setFilter]   = useState('all');
  const [showAdd, setShowAdd]       = useState(false);
  const [editData, setEditData]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState(null);

  const emptyForm = { title: '', code: '', students: '', color: '#6366f1', status: 'active' };
  const [form, setForm] = useState(emptyForm);

  const notify = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = courses
    .filter(c => filterStatus === 'all' || c.status === filterStatus)
    .filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    );

  const totalStudents = courses.reduce((s, c) => s + c.students, 0);
  const activeCourses = courses.filter(c => c.status === 'active').length;

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    setCourses(prev => [{
      ...form,
      course_id: Date.now(),
      students: Number(form.students),
      assignments: 0,
      completion: 0,
      lastUpdated: 'Just now',
    }, ...prev]);
    setShowAdd(false);
    setForm(emptyForm);
    setSubmitting(false);
    notify('Course created!');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setCourses(prev => prev.map(c =>
      c.course_id === editData.course_id
        ? { ...c, ...form, students: Number(form.students) }
        : c
    ));
    setEditData(null);
    setSubmitting(false);
    notify('Changes saved!');
  };

  const openEdit = (course) => {
    setForm({ title: course.title, code: course.code, students: course.students, color: course.color, status: course.status });
    setEditData(course);
  };

  const handleDelete = (id) => {
    setCourses(prev => prev.filter(c => c.course_id !== id));
    notify('Course removed.', 'err');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all
          ${toast.type === 'ok' ? 'bg-slate-900 text-white' : 'bg-red-500 text-white'}`}>
          <span className={`w-2 h-2 rounded-full ${toast.type === 'ok' ? 'bg-emerald-400' : 'bg-white'}`} />
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Courses</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              {activeCourses} active &middot; {totalStudents} students enrolled
            </p>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setShowAdd(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-7">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200 shadow-sm"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 outline-none shadow-sm cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <div className="flex bg-white border border-slate-200 rounded-2xl p-1 gap-1 shadow-sm">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Empty State ── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-slate-300">
            <BookOpen className="w-12 h-12 mb-3" />
            <p className="font-bold text-slate-400 text-lg">No courses found</p>
            <p className="text-sm mt-1">Try a different search or create a new course</p>
          </div>
        )}

        {/* ── Grid ── */}
        {viewMode === 'grid' && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(course => (
              <GridCard key={course.course_id} course={course} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* ── List ── */}
        {viewMode === 'list' && filtered.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {filtered.map(course => (
              <ListRow key={course.course_id} course={course} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {(showAdd || editData) && (
        <Modal
          title={editData ? 'Edit Course' : 'New Course'}
          onClose={() => { setShowAdd(false); setEditData(null); }}
        >
          <form onSubmit={editData ? handleUpdate : handleAdd} className="space-y-4">
            <Field label="Course Name">
              <input required type="text" className={inputCls} placeholder="e.g. Organic Chemistry"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Course Code">
                <input required type="text" className={inputCls} placeholder="CHM_101"
                  value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Students">
                <input required type="number" min="0" className={inputCls} placeholder="0"
                  value={form.students} onChange={e => setForm({ ...form, students: e.target.value })} />
              </Field>
            </div>

            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </Field>

            <Field label="Card Color">
              <div className="flex gap-2.5 flex-wrap mt-1">
                {COLOR_PRESETS.map(c => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                    className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${form.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </Field>

            <button type="submit" disabled={submitting}
              className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold mt-1 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Saving...' : editData ? 'Save Changes' : 'Create Course'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Grid Card ───────────────────────────────────────────────────────────────
function GridCard({ course, onEdit, onDelete }) {
  const sc = statusConfig[course.status] || statusConfig.active;

  return (
    <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
      <div className="h-1 w-full" style={{ background: course.color }} />

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
            style={{ background: course.color }}
          >
            {course.title.charAt(0)}
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-snug mb-0.5">{course.title}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{course.code}</p>

        {/* Completion bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1.5">
            <span>Progress</span>
            <span>{course.completion}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${course.completion}%`, background: course.color }} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Users className="w-3.5 h-3.5 text-slate-300" /> {course.students}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <BookOpen className="w-3.5 h-3.5 text-slate-300" /> {course.assignments} tasks
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium ml-auto">
            <Clock className="w-3 h-3" /> {course.lastUpdated}
          </span>
        </div>

        {/* Hover actions */}
        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all">
          <button
            onClick={() => onEdit(course)}
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-1"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => onDelete(course.course_id)}
            className="py-2 px-3.5 text-xs font-bold rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── List Row ────────────────────────────────────────────────────────────────
function ListRow({ course, onEdit, onDelete }) {
  const sc = statusConfig[course.status] || statusConfig.active;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 px-5 py-4 group">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0"
        style={{ background: course.color }}
      >
        {course.title.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-900 text-sm">{course.title}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{course.code}</span>
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Users className="w-3 h-3" />{course.students}</span>
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.assignments} tasks</span>
        </div>
      </div>

      {/* Progress mini */}
      <div className="hidden sm:flex flex-col items-end gap-1 w-20 shrink-0">
        <span className="text-xs font-bold text-slate-500">{course.completion}%</span>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${course.completion}%`, background: course.color }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
        <button onClick={() => onEdit(course)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(course.course_id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-7 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}