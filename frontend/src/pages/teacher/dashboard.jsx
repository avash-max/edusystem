import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Clock, Plus, 
  Edit3, Trash2, GraduationCap,
  X, Loader2
} from 'lucide-react';
import toast   from 'react-hot-toast';
import { 
  addAssignment, 
  getAllAssignments, 
  updateAssignment, 
  removeAssignment 
} from '../../services/api';

export default function TeacherDashboard() {
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: '', course: '', dueDate: '' });
  const [editForm, setEditForm] = useState({ title: '', course: '', dueDate: '', status: '' });

  const courses = [
    { id: 1, name: 'Advanced Mathematics' },
    { id: 2, name: 'Chemistry Laboratory' },
    { id: 3, name: 'Web Development' }
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const { data } = await getAllAssignments();
      setAssignments(data.assignments);
    } catch (err) {
      toast.error('Failed to load assignments.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await addAssignment({
        title: newAssignment.title,
        course: newAssignment.course,
        due_date: newAssignment.dueDate
      });
      setAssignments(prev => [data.assignment, ...prev]);
      setShowModal(false);
      setNewAssignment({ title: '', course: '', dueDate: '' });
      toast.success('Assignment added successfully!');
    } catch (err) {
      toast.error('Failed to add assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (assignment) => {
    setSelectedAssignment(assignment);
    setEditForm({
      title: assignment.title,
      course: assignment.course,
      dueDate: assignment.due_date,
      status: assignment.status
    });
    setEditModal(true);
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await updateAssignment(selectedAssignment.assignment_id, {
        title: editForm.title,
        course: editForm.course,
        due_date: editForm.dueDate,
        status: editForm.status
      });
      setAssignments(prev =>
        prev.map(a => a.assignment_id === selectedAssignment.assignment_id ? data.assignment : a)
      );
      setEditModal(false);
      setSelectedAssignment(null);
      toast.success('Assignment updated successfully!');
    } catch (err) {
      toast.error('Failed to update assignment.');
    } finally {
      setSubmitting(false);
    }
  };

const handleDeleteAssignment = async (id) => {
  if (window.confirm("Are you sure you want to delete this assignment?")) {
    try {
      await removeAssignment(id);
      setAssignments(prev => prev.filter(a => a.assignment_id !== id));
      toast.success('Assignment deleted.');
    } catch (err) {
      toast.error('Failed to delete assignment.');
    }
  }
};

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-600',
      completed: 'bg-emerald-50 text-emerald-600',
      overdue: 'bg-red-50 text-red-600'
    };
    return (
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
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

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">{greeting}, Prof.</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your classroom and track student progress.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Assignment
          </button>
        </header>

        {/* Stats — driven from assignments array */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<BookOpen className="text-purple-600" />} label="Total Assignments" value={assignments.length.toString()} />
          <StatCard icon={<GraduationCap className="text-emerald-600" />} label="Completed" value={assignments.filter(a => a.status === 'completed').length.toString()} />
          <StatCard icon={<Clock className="text-orange-600" />} label="Pending" value={assignments.filter(a => a.status === 'pending').length.toString()} urgent />
          <StatCard icon={<Users className="text-red-500" />} label="Overdue" value={assignments.filter(a => a.status === 'overdue').length.toString()} />
        </div>

        {/* Assignments Table */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Assignments</h2>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium">
                        No assignments yet. Click "New Assignment" to get started.
                      </td>
                    </tr>
                  ) : (
                    assignments.map(a => (
                      <tr key={a.assignment_id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-900">{a.title}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">{a.course}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">{a.due_date}</td>
                        <td className="px-6 py-4">{statusBadge(a.status)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(a)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteAssignment(a.assignment_id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Add Modal */}
        {showModal && (
          <Modal title="Add Assignment" onClose={() => setShowModal(false)}>
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <FormField label="Title">
                <input
                  required type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                  placeholder="e.g. Final Project"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                />
              </FormField>
              <FormField label="Course">
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                  value={newAssignment.course}
                  onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                >
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </FormField>
              <FormField label="Due Date">
                <input
                  required type="date"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </FormField>
              <SubmitButton loading={submitting} label="Post Assignment" />
            </form>
          </Modal>
        )}

        {/* Edit Modal */}
        {editModal && (
          <Modal title="Edit Assignment" onClose={() => setEditModal(false)}>
            <form onSubmit={handleUpdateAssignment} className="space-y-4">
              <FormField label="Title">
                <input
                  required type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </FormField>
              <FormField label="Course">
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                  value={editForm.course}
                  onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                >
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </FormField>
              <FormField label="Due Date">
                <input
                  required type="date"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                />
              </FormField>
              <FormField label="Status">
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </FormField>
              <SubmitButton loading={submitting} label="Save Changes" />
            </form>
          </Modal>
        )}

      </main>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
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
      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{label}</label>
      {children}
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold mt-4 hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? 'Please wait...' : label}
    </button>
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