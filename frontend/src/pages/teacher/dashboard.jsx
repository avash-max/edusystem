import React, { useState, useEffect } from 'react';
import {
  BookOpen, FileText, CheckCircle,
  Clock, AlertCircle, TrendingUp, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllAssignments } from '../../services/api';
import { getAllCourses } from '../../services/api';
import { getAllResources } from '../../services/api';

export default function TeacherDashboard() {
  const [greeting, setGreeting]       = useState('');
  const [isLoading, setIsLoading]     = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses]         = useState([]);
  const [resources, setResources]     = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12)      setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else                setGreeting('Good Evening');

    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [a, c, r] = await Promise.all([
        getAllAssignments(),
        getAllCourses(),
        getAllResources()
      ]);
      setAssignments(a.data.assignments);
      setCourses(c.data.courses);
      setResources(r.data.resources);
    } catch {
      toast.error('Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  const pending   = assignments.filter(a => a.status === 'pending').length;
  const completed = assignments.filter(a => a.status === 'completed').length;
  const overdue   = assignments.filter(a => a.status === 'overdue').length;
  const recent    = assignments.slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
          <p className="text-slate-400 font-semibold text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">

        {/* ── Hero greeting ── */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12">
          {/* decorative blobs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Live</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {greeting},<br />Prof. 👋
              </h1>
              <p className="text-slate-400 mt-3 font-medium">
                You have <span className="text-white font-black">{pending}</span> pending and&nbsp;
                <span className="text-red-400 font-black">{overdue}</span> overdue assignments.
              </p>
            </div>

            {/* Quick numbers */}
            <div className="flex gap-4 flex-wrap">
              <Pill value={courses.length}     label="Courses"     color="bg-indigo-500/20 text-indigo-300" />
              <Pill value={assignments.length} label="Assignments" color="bg-purple-500/20 text-purple-300" />
              <Pill value={resources.length}   label="Resources"   color="bg-cyan-500/20 text-cyan-300"    />
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Completed"
            value={completed}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Pending"
            value={pending}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-500"
            pulse
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            label="Overdue"
            value={overdue}
            iconBg="bg-red-50"
            iconColor="text-red-500"
          />
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            label="Resources"
            value={resources.length}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
        </div>

        {/* ── Main content row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent assignments — takes 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-400" />
                <h2 className="font-black text-slate-900">Recent Assignments</h2>
              </div>
              <span className="text-xs text-slate-400 font-bold">Latest 5</span>
            </div>
            <div className="divide-y divide-slate-50">
              {recent.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="font-bold">No assignments yet</p>
                </div>
              ) : (
                recent.map(a => (
                  <div key={a.assignment_id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-8 rounded-full flex-shrink-0 ${
                        a.status === 'completed' ? 'bg-emerald-400' :
                        a.status === 'overdue'   ? 'bg-red-400'     : 'bg-yellow-400'
                      }`} />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{a.title}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{a.course}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <StatusBadge status={a.status} />
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{a.due_date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Courses panel — 1 col */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-50">
              <BookOpen className="w-5 h-5 text-slate-400" />
              <h2 className="font-black text-slate-900">Your Courses</h2>
            </div>
            <div className="p-4 space-y-3">
              {courses.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-bold">No courses yet</p>
                </div>
              ) : (
                courses.map((c, i) => {
                  const palette = [
                    'from-indigo-500 to-purple-500',
                    'from-orange-400 to-red-500',
                    'from-cyan-400 to-blue-500',
                    'from-emerald-400 to-teal-500',
                    'from-pink-400 to-rose-500',
                  ];
                  return (
                    <div key={c.course_id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${palette[i % palette.length]} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                        {c.title.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-900 text-sm truncate">{c.title}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{c.code}</p>
                      </div>
                      <div className="ml-auto text-right flex-shrink-0">
                        <p className="text-xs font-black text-slate-700">{c.students}</p>
                        <p className="text-[10px] text-slate-400">students</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Resources strip ── */}
        {resources.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-slate-400" />
              <h2 className="font-black text-slate-900">Latest Resources</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.slice(0, 4).map(r => (
                <div key={r.resource_id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                      {r.type}
                    </span>
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer"
                        className="text-slate-300 hover:text-indigo-500 transition-colors">
                        <FileText className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="font-bold text-slate-900 text-sm leading-snug">{r.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">{r.course}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Small components ──

function Pill({ value, label, color }) {
  return (
    <div className={`${color} rounded-2xl px-5 py-3 text-center backdrop-blur-sm`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</p>
    </div>
  );
}

function StatCard({ icon, label, value, iconBg, iconColor, pulse }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
      <div className={`w-12 h-12 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center relative`}>
        {icon}
        {pulse && <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:   'bg-yellow-50 text-yellow-600',
    completed: 'bg-emerald-50 text-emerald-600',
    overdue:   'bg-red-50 text-red-500',
  };
  return (
    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}