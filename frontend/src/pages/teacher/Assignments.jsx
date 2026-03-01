import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, X, Loader2, Search, 
  CheckCircle, Clock, AlertCircle, BookOpen, 
  Paperclip, Download, Users, ArrowRight
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  addAssignment, getAllAssignments,
  updateAssignment, removeAssignment, downloadAssignment
} from '../../services/api';

const courses = [
  { id: 1, name: 'Advanced Mathematics' },
  { id: 2, name: 'Chemistry Laboratory' },
  { id: 3, name: 'Web Development' }
];

const EMPTY_FORM = { title: '', course: '', dueDate: '', file: null };

const STATUS_CONFIG = {
  pending:   { color: 'bg-yellow-50 text-yellow-600 border-yellow-100',  dot: 'bg-yellow-400' },
  completed: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-400' },
  overdue:   { color: 'bg-red-50 text-red-500 border-red-100',           dot: 'bg-red-400'    },
};

export default function TeacherAssignments() {
  const [assignments, setAssignments]   = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [editModal, setEditModal]       = useState(false);
  const [selected, setSelected]         = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newForm, setNewForm]           = useState(EMPTY_FORM);
  const [editForm, setEditForm]         = useState({ title: '', course: '', dueDate: '', status: '', file: null });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowModal(true);
      setSearchParams({});
    }
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const { data } = await getAllAssignments();
      setAssignments(data.assignments);
    } catch {
      toast.error('Failed to load assignments.');
    } finally {
      setIsLoading(false);
    }
  };

  const buildFormData = (form) => {
    const fd = new FormData();
    fd.append('title',    form.title);
    fd.append('course',   form.course);
    fd.append('due_date', form.dueDate || form.due_date);
    if (form.status) fd.append('status', form.status);
    if (form.file)   fd.append('file',   form.file);
    return fd;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await addAssignment(buildFormData(newForm));
      setAssignments(prev => [data.assignment, ...prev]);
      setShowModal(false);
      setNewForm(EMPTY_FORM);
      toast.success('Assignment posted!');
    } catch {
      toast.error('Failed to add assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (a) => {
    setSelected(a);
    setEditForm({ title: a.title, course: a.course, dueDate: a.due_date, status: a.status, file: null });
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await updateAssignment(selected.assignment_id, buildFormData(editForm));
      setAssignments(prev => prev.map(a => a.assignment_id === selected.assignment_id ? data.assignment : a));
      setEditModal(false);
      toast.success('Assignment updated!');
    } catch {
      toast.error('Failed to update assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-slate-800 text-sm">Delete this assignment?</p>
        <div className="flex gap-2">
          <button onClick={async () => {
            toast.dismiss(t.id);
            try {
              await removeAssignment(id);
              setAssignments(prev => prev.filter(a => a.assignment_id !== id));
              toast.success('Deleted.');
            } catch { toast.error('Failed to delete.'); }
          }} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-bold">Delete</button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">Cancel</button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  const handleDownload = async (a) => {
    try {
      const { data } = await downloadAssignment(a.assignment_id);
      const url  = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', a.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download file.');
    }
  };

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Group by course
  const grouped = filtered.reduce((acc, a) => {
    if (!acc[a.course]) acc[a.course] = [];
    acc[a.course].push(a);
    return acc;
  }, {});

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
        <p className="text-slate-400 font-semibold text-sm">Loading assignments...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assignments</h1>
            <p className="text-slate-500 font-medium mt-1">
              {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} · {Object.keys(grouped).length} course{Object.keys(grouped).length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/submissions')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-slate-400 transition-all shadow-sm"
            >
              <Users className="w-4 h-4" /> View Submissions
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" /> New Assignment
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Completed', status: 'completed', icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' },
            { label: 'Pending',   status: 'pending',   icon: <Clock       className="w-5 h-5 text-yellow-500"  />, bg: 'bg-yellow-50' },
            { label: 'Overdue',   status: 'overdue',   icon: <AlertCircle className="w-5 h-5 text-red-500"     />, bg: 'bg-red-50'    },
          ].map(s => (
            <button
              key={s.status}
              onClick={() => setFilterStatus(prev => prev === s.status ? 'all' : s.status)}
              className={`bg-white rounded-2xl border p-4 flex items-center gap-3 shadow-sm transition-all text-left
                ${filterStatus === s.status ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-100 hover:shadow-md'}`}
            >
              <div className={`p-2 ${s.bg} rounded-xl`}>{s.icon}</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-black text-slate-900">{assignments.filter(a => a.status === s.status).length}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or course..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'completed', 'overdue'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all
                  ${filterStatus === s ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grouped by course */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-lg">No assignments found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search or create a new assignment</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([course, items]) => (
              <div key={course}>
                {/* Course header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-slate-900 rounded-full" />
                  <h2 className="font-black text-slate-700 uppercase tracking-widest text-xs">{course}</h2>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-black text-slate-400">{items.length} task{items.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Assignment cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(a => {
                    const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={a.assignment_id} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
                        
                        {/* Colored top bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${cfg.dot}`} />

                        {/* Top row */}
                        <div className="flex items-start justify-between mb-4 mt-1">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider border ${cfg.color}`}>
                            {a.status}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(a)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(a.assignment_id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-black text-slate-900 text-lg leading-tight mb-1">{a.title}</h3>

                        {/* Due date */}
                        <div className="flex items-center gap-1.5 text-slate-400 mb-4">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">
                            Due {new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          {/* File */}
                          {a.file_name ? (
                            <button
                              onClick={() => handleDownload(a)}
                              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span className="max-w-[100px] truncate">{a.file_name}</span>
                              <Download className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-xs text-slate-300 font-bold">No attachment</span>
                          )}

                          {/* View submissions */}
                          <button
                            onClick={() => navigate(`/assignments/${a.assignment_id}`)}
                            className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all"
                          >
                            <Users className="w-3.5 h-3.5" />
                            Submissions
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showModal && (
          <Modal title="New Assignment" onClose={() => { setShowModal(false); setNewForm(EMPTY_FORM); }}>
            <form onSubmit={handleAdd} className="space-y-4">
              <FormField label="Title">
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" placeholder="e.g. Final Project" value={newForm.title} onChange={(e) => setNewForm({ ...newForm, title: e.target.value })} />
              </FormField>
              <FormField label="Course">
                <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" value={newForm.course} onChange={(e) => setNewForm({ ...newForm, course: e.target.value })}>
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </FormField>
              <FormField label="Due Date">
                <input required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" value={newForm.dueDate} onChange={(e) => setNewForm({ ...newForm, dueDate: e.target.value })} />
              </FormField>
              <FormField label="Attachment (optional)">
                <FileUploadBox file={newForm.file} onChange={(file) => setNewForm({ ...newForm, file })} />
              </FormField>
              <SubmitButton loading={submitting} label="Post Assignment" />
            </form>
          </Modal>
        )}

        {/* Edit Modal */}
        {editModal && (
          <Modal title="Edit Assignment" onClose={() => setEditModal(false)}>
            <form onSubmit={handleUpdate} className="space-y-4">
              <FormField label="Title">
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </FormField>
              <FormField label="Course">
                <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" value={editForm.course} onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}>
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </FormField>
              <FormField label="Due Date">
                <input required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" value={editForm.dueDate} onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })} />
              </FormField>
              <FormField label="Status">
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </FormField>
              <FormField label="Replace File (optional)">
                <FileUploadBox file={editForm.file} onChange={(file) => setEditForm({ ...editForm, file })} existingFile={selected?.file_name} />
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

function FileUploadBox({ file, onChange, existingFile }) {
  const inputRef = React.useRef();
  return (
    <div>
      <div
        onClick={() => inputRef.current.click()}
        className={`w-full border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all
          ${file ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-400 bg-slate-50'}`}
      >
        <Paperclip className={`w-6 h-6 mx-auto mb-2 ${file ? 'text-indigo-500' : 'text-slate-300'}`} />
        {file ? (
          <p className="text-sm font-bold text-indigo-600 truncate">{file.name}</p>
        ) : existingFile ? (
          <div>
            <p className="text-xs text-slate-400 font-bold">Current: <span className="text-slate-600">{existingFile}</span></p>
            <p className="text-xs text-slate-400 mt-1">Click to replace</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold text-slate-400">Click to upload file</p>
            <p className="text-xs text-slate-300 mt-1">PDF, DOC, DOCX, PPT, JPG, PNG — max 10MB</p>
          </div>
        )}
        <input ref={inputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt" onChange={(e) => e.target.files[0] && onChange(e.target.files[0])} />
      </div>
      {file && <button type="button" onClick={() => onChange(null)} className="mt-2 text-xs text-red-500 font-bold hover:underline">Remove file</button>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{label}</label>
      {children}
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold mt-4 hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? 'Please wait...' : label}
    </button>
  );
}