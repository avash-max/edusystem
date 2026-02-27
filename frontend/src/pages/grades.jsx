import React, { useState } from 'react';
import { Award, Target, BookOpen, Star, Calendar, Download, ChevronDown, ChevronRight } from 'lucide-react';

export default function GradesDashboard() {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('current');

  const courses = [
    {
      id: 1,
      name: 'Advanced Mathematics',
      code: 'MTH_401',
      professor: 'Dr. Sarah Chen',
      credits: 4,
      currentGrade: 91,
      letterGrade: 'A-',
      assignments: [
        { name: 'Problem Set 1', grade: 95, status: 'graded' },
        { name: 'Problem Set 2', grade: 88, status: 'graded' },
        { name: 'Problem Set 4', grade: null, status: 'pending' }
      ]
    },
    {
      id: 2,
      name: 'Chemistry Lab',
      code: 'CHM_302',
      professor: 'Prof. Michael Rodriguez',
      credits: 4,
      currentGrade: 87,
      letterGrade: 'B+',
      assignments: [
        { name: 'Lab Report 1', grade: 85, status: 'graded' },
        { name: 'Lab Report 4', grade: null, status: 'pending' }
      ]
    }
  ];

  const calculateOverallGPA = () => {
    const gradePoints = { 'A':4.0,'A-':3.7,'B+':3.3,'B':3.0,'B-':2.7,'C+':2.3,'C':2.0,'C-':1.7,'D':1.0,'F':0.0 };
    const total = courses.reduce((sum, c) => sum + (gradePoints[c.letterGrade] || 0) * c.credits, 0);
    const credits = courses.reduce((sum, c) => sum + c.credits, 0);
    return credits ? (total / credits).toFixed(2) : '0.00';
  };

  const stats = {
    gpa: calculateOverallGPA(),
    averageGrade: Math.round(courses.reduce((sum, c) => sum + c.currentGrade, 0) / courses.length),
    totalCredits: courses.reduce((sum, c) => sum + c.credits, 0),
    coursesAbove90: courses.filter(c => c.currentGrade >= 90).length,
    totalCourses: courses.length
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] font-sans text-slate-800">
      <main className="px-8 pb-8 pt-6 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Grades</h1>
            <p className="text-slate-500 text-base">Review your academic performance</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all shadow-lg">
            <Download className="w-5 h-5" />
            <span className="text-sm">Download Transcript</span>
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Award} label="GPA" value={stats.gpa} />
          <StatCard icon={Target} label="Avg Grade" value={`${stats.averageGrade}%`} />
          <StatCard icon={BookOpen} label="Credits" value={stats.totalCredits} />
          <StatCard icon={Star} label="A's" value={stats.coursesAbove90} />
          <StatCard icon={BookOpen} label="Courses" value={stats.totalCourses} />
        </div>

        {/* Semester selector */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-600" />
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="bg-white border text-slate-900 text-sm rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-all outline-none border-slate-200 focus:border-slate-300"
            >
              <option value="current">Spring 2026</option>
              <option value="fall2025">Fall 2025</option>
              <option value="spring2025">Spring 2025</option>
              <option value="fall2024">Fall 2024</option>
            </select>
          </div>
        </div>

        {/* Courses list */}
        <div className="space-y-4">
          {courses.map((course, idx) => (
            <CourseGradeCard
              key={course.id}
              course={course}
              expanded={expandedCourse === course.id}
              onToggle={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
      <Icon className="w-6 h-6 mx-auto text-slate-600 mb-1" />
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function CourseGradeCard({ course, expanded, onToggle }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{course.name}</h3>
          <div className="text-sm text-slate-600">{course.code} • {course.professor}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">{course.currentGrade}%</div>
          <div className="text-sm text-slate-500">{course.letterGrade}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-sm text-slate-700 flex items-center justify-center gap-2"
      >
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {expanded ? 'Hide details' : `Show assignments (${course.assignments.length})`}
      </button>
      {expanded && (
        <div className="p-4 border-t border-slate-100">
          {course.assignments.map((a,i) => (
            <div key={i} className="flex justify-between text-sm text-slate-700 py-1">
              <span>{a.name}</span>
              <span>{a.grade != null ? `${a.grade}` : a.status === 'pending' ? 'Pending' : '-'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
