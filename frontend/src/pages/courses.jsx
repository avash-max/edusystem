import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Grid, List,
  ArrowUpRight, Loader2, AlertCircle, BookOpen
} from 'lucide-react';
import { getAllCourses } from '../services/api';

const COLOR_MAP = [
  'text-blue-600 bg-blue-50',
  'text-orange-600 bg-orange-50',
  'text-purple-600 bg-purple-50',
  'text-emerald-600 bg-emerald-50',
  'text-rose-600 bg-rose-50',
  'text-cyan-600 bg-cyan-50',
  'text-indigo-600 bg-indigo-50',
];

export default function CoursesDashboard() {
  const [courses, setCourses]         = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState(null);
  const [viewMode, setViewMode]       = useState('grid');
  const [filterBy, setFilterBy]       = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const { data } = await getAllCourses();
        setCourses(data.courses);
        setError(null);
      } catch {
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterBy === 'all' ||
        (filterBy === 'active'    && course.students > 0) ||
        (filterBy === 'completed' && course.students === 0);

      return matchesSearch && matchesFilter;
    });
  }, [courses, searchQuery, filterBy]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-slate-500 font-medium">
              {isLoading
                ? 'Loading your curriculum...'
                : `You have ${courses.length} active program${courses.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilterBy(f)}
                className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all
                  ${filterBy === f ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or code..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-medium">Syncing with campus servers...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Course Grid / List */}
        {!isLoading && !error && (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, i) => {
                const colorClass = COLOR_MAP[i % COLOR_MAP.length];
                return (
                  <div
                    key={course.course_id}
                    className={`bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group
                      ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6 flex flex-col'}`}
                  >
                    {/* Avatar */}
                    <div className={`rounded-2xl flex items-center justify-center font-bold flex-shrink-0
                      ${viewMode === 'list' ? 'w-12 h-12 text-lg mr-4' : 'w-14 h-14 text-xl mb-6'}
                      ${colorClass}`}
                    >
                      {course.title.charAt(0)}
                    </div>

                    {/* Body */}
                    <div className={`flex-1 ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                      <div className={viewMode === 'list' ? 'flex flex-col' : 'mb-6'}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{course.code}</span>
                        <h3 className="text-lg font-bold mt-0.5 group-hover:text-slate-600 transition-colors">{course.title}</h3>
                      </div>

                      {/* Stats */}
                      <div className={viewMode === 'list'
                        ? 'flex gap-12 mx-8'
                        : 'grid grid-cols-2 gap-4 pt-6 border-t border-slate-50'
                      }>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Students</p>
                          <p className="text-sm font-bold text-slate-900">{course.students}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Tasks</p>
                          <p className="text-sm font-bold text-slate-900">{course.assignments}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      className={`${viewMode === 'list' ? 'w-12 h-12' : 'w-full mt-6 py-3 px-4'}
                        flex items-center justify-center gap-2 rounded-2xl bg-slate-50 text-slate-600 font-bold text-xs
                        group-hover:bg-slate-900 group-hover:text-white transition-all`}
                    >
                      {viewMode === 'grid' && 'Continue'}
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No courses match your search or filter.</p>
                <button
                  onClick={() => { setSearchQuery(''); setFilterBy('all'); }}
                  className="mt-2 text-slate-900 font-bold text-sm underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}