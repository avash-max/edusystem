import React, { useState, useEffect } from 'react';
import {
  Users, FileText, Download, CheckCircle,
  Clock, ChevronDown, ChevronUp, Search,
  Loader2, Star, MessageSquare, X, Paperclip
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllSubmissions, reviewSubmission, downloadSubmission } from '../../services/api';

const STATUS_STYLES = {
  submitted: 'bg-blue-50 text-blue-600',
  reviewed:  'bg-yellow-50 text-yellow-600',
  graded:    'bg-emerald-50 text-emerald-600',
};

export default function TeacherSubmissions() {
  const [submissions, setSubmissions]   = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId]     = useState(null);
  const [reviewModal, setReviewModal]   = useState(false);
  const [selected, setSelected]         = useState(null);
  const [reviewForm, setReviewForm]     = useState({ grade: '', feedback: '' });
  const [submitting, setSubmitting]     = useState(false);

  useEffect(() => { fetchSubmissions(); }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data } = await getAllSubmissions();
      setSubmissions(data.submissions);
    } catch {
      toast.error('Failed to load submissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (sub) => {
    try {
      const data = await downloadSubmission(sub.submission_id);
      const url  = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', sub.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch(err) {
      toast.error('Failed to download file.');
      console.error("this is error:", err);
    }
  };

  const openReview = (sub) => {
    setSelected(sub);
    setReviewForm({ grade: sub.grade || '', feedback: sub.feedback || '' });
    setReviewModal(true);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await reviewSubmission(selected.submission_id, reviewForm);
      setSubmissions(prev =>
        prev.map(s => s.submission_id === selected.submission_id ? data.submission : s)
      );
      setReviewModal(false);
      toast.success('Submission graded!');
    } catch {
      toast.error('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = submissions.filter(s => {
    const matchSearch =
      s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignment?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignment?.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Group by assignment
  const grouped = filtered.reduce((acc, s) => {
    const key   = s.assignment_id;
    const title = s.assignment?.title || `Assignment #${key}`;
    if (!acc[key]) acc[key] = { title, course: s.assignment?.course, items: [] };
    acc[key].items.push(s);
    return acc;
  }, {});

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Submissions</h1>
          <p className="text-slate-500 font-medium mt-1">
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''} received
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Submitted', status: 'submitted', icon: <FileText  className="w-5 h-5 text-blue-600"    />, bg: 'bg-blue-50'    },
            { label: 'Reviewed',  status: 'reviewed',  icon: <Clock     className="w-5 h-5 text-yellow-600"  />, bg: 'bg-yellow-50'  },
            { label: 'Graded',    status: 'graded',    icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' },
          ].map(s => (
            <div key={s.status} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
              <div className={`p-2 ${s.bg} rounded-xl`}>{s.icon}</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-black text-slate-900">{submissions.filter(s2 => s2.status === s.status).length}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, assignment or course..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'submitted', 'reviewed', 'graded'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all
                  ${filterStatus === s ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Submissions */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No submissions yet</p>
            <p className="text-slate-400 text-sm mt-1">Students haven't submitted any assignments</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([aid, group]) => (
              <div key={aid} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">

                {/* Group Header */}
                <button
                  onClick={() => setExpandedId(expandedId === aid ? null : aid)}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-black text-slate-900">{group.title}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{group.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {group.items.length} submission{group.items.length !== 1 ? 's' : ''}
                    </span>
                    {expandedId === aid
                      ? <ChevronUp className="w-5 h-5 text-slate-400" />
                      : <ChevronDown className="w-5 h-5 text-slate-400" />
                    }
                  </div>
                </button>

                {/* Submissions List */}
                {expandedId === aid && (
                  <div className="border-t border-slate-50 divide-y divide-slate-50">
                    {group.items.map(sub => (
                      <div key={sub.submission_id} className="p-5 hover:bg-slate-50/40 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                          {/* Student info */}
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                              {sub.student_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{sub.student_name}</p>
                              <p className="text-xs text-slate-400 font-medium">
                                Submitted {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>

                          {/* Middle — file + note */}
                          <div className="flex flex-col gap-1 flex-1 mx-4">
                            <button
                              onClick={() => handleDownload(sub)}
                              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors w-fit"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span className="max-w-[180px] truncate">{sub.file_name}</span>
                              <Download className="w-3 h-3" />
                            </button>
                            {sub.note && (
                              <p className="text-xs text-slate-500 italic line-clamp-1">"{sub.note}"</p>
                            )}
                          </div>

                          {/* Right — status + grade + action */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${STATUS_STYLES[sub.status]}`}>
                              {sub.status}
                            </span>
                            {sub.grade && (
                              <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                                {sub.grade}
                              </span>
                            )}
                            <button
                              onClick={() => openReview(sub)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all active:scale-95"
                            >
                              <Star className="w-3.5 h-3.5" />
                              {sub.grade ? 'Edit Grade' : 'Grade'}
                            </button>
                          </div>
                        </div>

                        {/* Show existing feedback */}
                        {sub.feedback && (
                          <div className="mt-3 ml-12 p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Your Feedback</p>
                            <p className="text-sm text-slate-600">{sub.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {reviewModal && selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Grade Submission</h2>
                  <p className="text-sm text-slate-400 font-medium mt-0.5">{selected.student_name}</p>
                </div>
                <button onClick={() => setReviewModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* File preview link */}
              <button
                onClick={() => handleDownload(selected)}
                className="w-full flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl mb-6 hover:bg-indigo-100 transition-colors"
              >
                <Paperclip className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-sm font-bold text-indigo-600 truncate flex-1 text-left">{selected.file_name}</span>
                <Download className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              </button>

              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Grade</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                    placeholder="e.g. A, B+, 92/100"
                    value={reviewForm.grade}
                    onChange={(e) => setReviewForm({ ...reviewForm, grade: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    Feedback
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 resize-none"
                    placeholder="Write feedback for the student..."
                    value={reviewForm.feedback}
                    onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : 'Save Grade & Feedback'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}