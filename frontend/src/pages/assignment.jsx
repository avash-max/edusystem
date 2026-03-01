import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Clock, FileText, ChevronDown, 
  Loader2, AlertCircle, Paperclip, Upload,
  CheckCircle, X, Download, RefreshCw,
  Image, Film, FileType, File
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getAllAssignments, 
  downloadAssignment, 
  downloadSubmission,
  submitAssignment, 
  resubmitAssignment,
  getSubmissionsByAssignment
} from '../services/api';
import { getUserId } from '../protected/authRole';

// ── Status computed from due date only ──
const getAssignmentStatus = (due_date) => {
  const now = new Date(); const due = new Date(due_date);
  now.setHours(0,0,0,0);  due.setHours(0,0,0,0);
  return due < now ? 'overdue' : 'ongoing';
};

const STATUS_STYLES     = { ongoing: 'bg-blue-50 text-blue-600', overdue: 'bg-red-50 text-red-500' };
const SUBMISSION_STYLES = { submitted: 'bg-emerald-50 text-emerald-600', reviewed: 'bg-purple-50 text-purple-600', graded: 'bg-indigo-50 text-indigo-600' };
const ICONS = ['📝','🧪','📢','💻','📐','🔬','📊','🎨'];

const FILE_TYPE_LABELS = {
  'application/pdf': 'PDF Document',
  'application/msword': 'Word Document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  'application/vnd.ms-powerpoint': 'PowerPoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  'image/jpeg': 'JPEG Image', 'image/png': 'PNG Image', 'text/plain': 'Text File',
};

const getFileIcon = (fileType) => {
  if (!fileType)                      return <File     className="w-10 h-10 text-slate-400" />;
  if (fileType.startsWith('image/'))  return <Image    className="w-10 h-10 text-blue-400" />;
  if (fileType.startsWith('video/'))  return <Film     className="w-10 h-10 text-purple-400" />;
  if (fileType === 'application/pdf') return <FileType className="w-10 h-10 text-red-400" />;
  return <FileText className="w-10 h-10 text-slate-400" />;
};

const formatFileSize = (bytes) => {
  if (!bytes)            return '';
  if (bytes < 1024)      return `${bytes} B`;
  if (bytes < 1048576)   return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1048576).toFixed(1)} MB`;
};

const user = getUserId(); // returns user object { user_id, username, ... }

export default function AssignmentsDashboard() {
  const [assignments, setAssignments]   = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const [selectedTab, setSelectedTab]   = useState('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [expandedId, setExpandedId]     = useState(null);

  // Per-assignment: { file, note, submitting, submission, loadingSubmission }
  const [uploadState, setUploadState]   = useState({});
  // Per-assignment: whether reupload zone is open
  const [reuploadMode, setReuploadMode] = useState({});

  useEffect(() => { fetchAssignments(); }, []);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const { data } = await getAllAssignments();
      setAssignments(data.assignments);

      // Initialise uploadState — submission starts null, fetched lazily on expand
      const initial = {};
      data.assignments.forEach(a => {
        initial[a.assignment_id] = { file: null, note: '', submitting: false, submission: null, loadingSubmission: false };
      });
      setUploadState(initial);
      setError(null);
    } catch {
      setError('Could not load assignments.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch this student's submission for one assignment (called on expand)
  const fetchSubmission = async (assignment_id) => {
    if (uploadState[assignment_id]?.submission !== null && uploadState[assignment_id]?.submission !== undefined) return;
    // already fetched or being fetched
    updateUpload(assignment_id, { loadingSubmission: true });
    try {
      const { data } = await getSubmissionsByAssignment(assignment_id);
      // backend returns all submissions; filter to this student
      const mine = data.submissions?.find(s => s.student_id === user?.user_id) || null;
      updateUpload(assignment_id, { submission: mine, loadingSubmission: false });
    } catch {
      updateUpload(assignment_id, { submission: null, loadingSubmission: false });
    }
  };

  const handleExpand = (id) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);
    if (next) fetchSubmission(next); // lazy-load submission on open
  };

  const updateUpload = (id, patch) =>
    setUploadState(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const toggleReupload = (id) =>
    setReuploadMode(prev => ({ ...prev, [id]: !prev[id] }));

  // ── Fresh submit ──
  const handleSubmit = async (assignment) => {
    const state = uploadState[assignment.assignment_id];
    if (!state?.file) { toast.error('Please select a file first.'); return; }

    updateUpload(assignment.assignment_id, { submitting: true });

    const fd = new FormData();
    fd.append('assignment_id', assignment.assignment_id);
    fd.append('student_id',    user?.user_id);
    fd.append('student_name',  user?.username);
    fd.append('note',          state.note || '');
    fd.append('file',          state.file);

    try {
      const { data } = await submitAssignment(fd);
      updateUpload(assignment.assignment_id, { submitting: false, file: null, note: '', submission: data.submission });
      setReuploadMode(prev => ({ ...prev, [assignment.assignment_id]: false }));
      toast.success('Assignment submitted successfully!');
    } catch {
      toast.error('Submission failed.');
      updateUpload(assignment.assignment_id, { submitting: false });
    }
  };

  // ── Resubmit (already submitted → replace) ──
  const handleResubmit = async (assignment) => {
    const state = uploadState[assignment.assignment_id];
    if (!state?.file) { toast.error('Please select a replacement file.'); return; }

    const submissionId = state.submission?.submission_id;
    if (!submissionId) { toast.error('No existing submission found.'); return; }

    updateUpload(assignment.assignment_id, { submitting: true });

    const fd = new FormData();
    fd.append('note', state.note || '');
    fd.append('file', state.file);

    try {
      const { data } = await resubmitAssignment(submissionId, fd);
      updateUpload(assignment.assignment_id, { submitting: false, file: null, note: '', submission: data.submission });
      setReuploadMode(prev => ({ ...prev, [assignment.assignment_id]: false }));
      toast.success('Assignment reuploaded successfully!');
    } catch {
      toast.error('Reupload failed.');
      updateUpload(assignment.assignment_id, { submitting: false });
    }
  };

  // ── Download teacher's assignment brief ──
  const handleDownloadTeacherFile = async (a) => {
    try {
      const { data } = await downloadAssignment(a.assignment_id);
      triggerDownload(data, a.file_name);
    } catch { toast.error('Failed to download file.'); }
  };

  // ── Download student's own submitted file ──
  const handleDownloadMySubmission = async (submission) => {
    try {
      const { data } = await downloadSubmission(submission.submission_id);
      triggerDownload(data, submission.file_name);
    } catch { toast.error('Failed to download your submission.'); }
  };

  const triggerDownload = (blobData, filename) => {
    const url  = window.URL.createObjectURL(new Blob([blobData]));
    const link = document.createElement('a');
    link.href  = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // ── Tab counts ──
  const tabs = useMemo(() => {
    const counts = { all: assignments.length, ongoing: 0, overdue: 0, submitted: 0 };
    assignments.forEach(a => {
      counts[getAssignmentStatus(a.due_date)]++;
      if (uploadState[a.assignment_id]?.submission) counts.submitted++;
    });
    return counts;
  }, [assignments, uploadState]);

  const filteredData = useMemo(() => {
    return assignments.filter(a => {
      const status     = getAssignmentStatus(a.due_date);
      const submitted  = !!uploadState[a.assignment_id]?.submission;
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab =
        selectedTab === 'all'      ||
        (selectedTab === 'ongoing'   && status === 'ongoing')  ||
        (selectedTab === 'overdue'   && status === 'overdue')  ||
        (selectedTab === 'submitted' && submitted);
      return matchSearch && matchTab;
    });
  }, [assignments, uploadState, searchQuery, selectedTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-slate-500 font-medium">
            {isLoading ? 'Loading...' : `${assignments.length} assignment${assignments.length !== 1 ? 's' : ''} across all courses`}
          </p>
        </header>

        {/* Tabs + Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto">
            {['all','ongoing','overdue','submitted'].map(tab => (
              <button key={tab} onClick={() => setSelectedTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all
                  ${selectedTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {tab}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md
                  ${selectedTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {tabs[tab] ?? 0}
                </span>
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by title or course..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin w-8 h-8 mr-3" />
            <span className="font-bold">Fetching assignments...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-3">
            {filteredData.length > 0 ? filteredData.map((task, i) => {
              const upload         = uploadState[task.assignment_id] || {};
              const submission     = upload.submission;
              const hasSubmitted   = !!submission;
              const isReupload     = !!reuploadMode[task.assignment_id];
              const computedStatus = getAssignmentStatus(task.due_date);

              return (
                <div key={task.assignment_id}
                  className={`bg-white rounded-2xl border transition-all
                    ${expandedId === task.assignment_id
                      ? 'ring-2 ring-slate-900/5 shadow-md border-slate-200'
                      : 'hover:border-slate-300 shadow-sm border-slate-100'}`}
                >
                  {/* ── Row header ── */}
                  <div className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => handleExpand(task.assignment_id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl flex-shrink-0">
                        {ICONS[i % ICONS.length]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 leading-tight">{task.title}</h3>
                          {hasSubmitted && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${SUBMISSION_STYLES[submission.status]}`}>
                              ✓ {submission.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{task.course}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-5">
                      <div className="hidden md:flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">
                          {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[computedStatus]}`}>
                        {computedStatus}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform flex-shrink-0 ${expandedId === task.assignment_id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* ── Expanded panel ── */}
                  {expandedId === task.assignment_id && (
                    <div className="border-t border-slate-50 animate-in fade-in duration-200">

                      {/* Info row */}
                      <div className="px-4 pt-4 pb-3 flex flex-col md:flex-row gap-3">
                        <div className="bg-slate-50 rounded-xl p-3 flex-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Course</p>
                          <p className="text-sm font-bold text-slate-700">{task.course}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 flex-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Due Date</p>
                          <p className="text-sm font-bold text-slate-700">
                            {new Date(task.due_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 flex-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Deadline</p>
                          <span className={`text-xs font-black uppercase px-2 py-1 rounded-lg ${STATUS_STYLES[computedStatus]}`}>
                            {computedStatus}
                          </span>
                        </div>
                      </div>

                      {/* Teacher's file download */}
                      {task.file_name && (
                        <div className="px-4 pb-3">
                          <button onClick={() => handleDownloadTeacherFile(task)}
                            className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download assignment brief: {task.file_name}
                          </button>
                        </div>
                      )}

                      {/* ── Submission loading ── */}
                      {upload.loadingSubmission && (
                        <div className="mx-4 mb-4 p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs font-bold">Checking your submission...</span>
                        </div>
                      )}

                      {/* ── Your submission preview ── */}
                      {!upload.loadingSubmission && hasSubmitted && !isReupload && (
                        <div className="mx-4 mb-4 rounded-2xl border border-slate-100 overflow-hidden">

                          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <p className="text-sm font-black text-slate-800">Your Uploaded Assignment</p>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${SUBMISSION_STYLES[submission.status]}`}>
                              {submission.status}
                            </span>
                          </div>

                          <div className="p-4 space-y-3">
                            {/* File card with download */}
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-xl">
                              <div className="flex-shrink-0">
                                {getFileIcon(submission.file_type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 text-sm truncate">{submission.file_name}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                                    {FILE_TYPE_LABELS[submission.file_type] || 'File'}
                                  </span>
                                  {submission.file_size && (
                                    <span className="text-[10px] text-slate-400 font-bold">{formatFileSize(submission.file_size)}</span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  Uploaded {new Date(submission.created_at).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              {/* ── Download own submission ── */}
                              <button
                                onClick={() => handleDownloadMySubmission(submission)}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-xl text-xs font-black transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Download
                              </button>
                            </div>

                            {/* Note */}
                            {submission.note && (
                              <div className="px-3 py-2 bg-slate-50 rounded-xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Your Note</p>
                                <p className="text-sm text-slate-600 italic">"{submission.note}"</p>
                              </div>
                            )}

                            {/* Grade + Feedback */}
                            {submission.grade && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                  <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Grade</p>
                                  <p className="text-2xl font-black text-emerald-700">{submission.grade}</p>
                                </div>
                                {submission.feedback && (
                                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Teacher's Feedback</p>
                                    <p className="text-sm text-blue-700 leading-relaxed">{submission.feedback}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Reupload trigger */}
                            <button
                              onClick={() => toggleReupload(task.assignment_id)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-xs font-black text-slate-400 hover:text-indigo-500 transition-all"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Replace / Reupload Assignment
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── No submission yet + not in reupload ── */}
                      {!upload.loadingSubmission && !hasSubmitted && !isReupload && (
                        <div className="mx-4 mb-4 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          <p className="text-xs font-bold text-slate-400">No submission yet — upload your work below.</p>
                        </div>
                      )}

                      {/* ── Upload / Reupload zone ── */}
                      {!upload.loadingSubmission && (!hasSubmitted || isReupload) && (
                        <div className="px-4 pb-4">
                          <div className={`border border-dashed rounded-2xl p-4 transition-all
                            ${isReupload ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200 bg-slate-50/50'}`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <p className={`text-[10px] font-black uppercase tracking-widest
                                ${isReupload ? 'text-indigo-500' : 'text-slate-400'}`}>
                                {isReupload ? '↻  Replace Your Submission' : '↑  Submit Your Work'}
                              </p>
                              {isReupload && (
                                <button
                                  onClick={() => { toggleReupload(task.assignment_id); updateUpload(task.assignment_id, { file: null, note: '' }); }}
                                  className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="space-y-3">
                              <textarea rows={2}
                                placeholder="Add a note for your teacher (optional)..."
                                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 resize-none"
                                value={upload.note || ''}
                                onChange={(e) => updateUpload(task.assignment_id, { note: e.target.value })}
                              />
                              <div className="flex gap-2">
                                <FilePickerButton
                                  file={upload.file}
                                  onFile={(file) => updateUpload(task.assignment_id, { file })}
                                  onClear={() => updateUpload(task.assignment_id, { file: null })}
                                  isUpdate={isReupload}
                                />
                                <button
                                  onClick={() => isReupload ? handleResubmit(task) : handleSubmit(task)}
                                  disabled={!upload.file || upload.submitting}
                                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0
                                    ${isReupload ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                                >
                                  {upload.submitting
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : isReupload
                                      ? <><RefreshCw className="w-4 h-4" /> Reupload</>
                                      : <><Upload className="w-4 h-4" /> Submit</>
                                  }
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 font-bold">No assignments found.</p>
                <button onClick={() => { setSearchQuery(''); setSelectedTab('all'); }}
                  className="mt-2 text-slate-900 font-bold text-sm underline">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FilePickerButton({ file, onFile, onClear, isUpdate }) {
  const ref = useRef();
  return (
    <div className="flex-1 min-w-0">
      {file ? (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
          <Paperclip className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <span className="text-xs font-bold text-indigo-600 truncate flex-1">{file.name}</span>
          <button onClick={onClear} className="text-indigo-400 hover:text-red-500 flex-shrink-0 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current.click()}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors border
            ${isUpdate ? 'bg-white border-indigo-200 text-indigo-500 hover:border-indigo-400' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
        >
          <Paperclip className="w-4 h-4" />
          {isUpdate ? 'Choose replacement file...' : 'Choose file to submit...'}
        </button>
      )}
      <input ref={ref} type="file" className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
    </div>
  );
}