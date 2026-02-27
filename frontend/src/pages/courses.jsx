import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Grid, List, Plus, ArrowUpRight, 
  MoreHorizontal, Loader2, AlertCircle
} from 'lucide-react';

export default function CoursesDashboard() {
  // --- State Management ---
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Simulated API Fetch ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, use: const response = await fetch('https://api.example.com/courses');
        const mockData = [
          { id: 1, name: 'Advanced Mathematics', code: 'MTH_401', professor: 'Dr. Sarah Chen', progress: 75, grade: 'A-', color: 'text-blue-600 bg-blue-50' },
          { id: 2, name: 'Chemistry Laboratory', code: 'CHM_302', professor: 'Prof. Michael Rodriguez', progress: 60, grade: 'B+', color: 'text-orange-600 bg-orange-50' },
          { id: 3, name: 'Web Development', code: 'CS_205', professor: 'Dr. Emily Johnson', progress: 85, grade: 'A', color: 'text-purple-600 bg-purple-50' },
          { id: 4, name: 'Data Analytics', code: 'DAT_310', professor: 'Prof. David Lee', progress: 45, grade: 'B', color: 'text-emerald-600 bg-emerald-50' },
          { id: 5, name: 'Digital Ethics', code: 'PHI_102', professor: 'Dr. Alistair Cook', progress: 100, grade: 'A', color: 'text-rose-600 bg-rose-50' },
        ];
        
        setCourses(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // --- Logic: Filtering & Searching ---
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filterBy === 'all' || 
        (filterBy === 'active' && course.progress < 100) ||
        (filterBy === 'completed' && course.progress === 100);

      return matchesSearch && matchesFilter;
    });
  }, [courses, searchQuery, filterBy]);

  // --- Actions ---
  const handleContinue = (id) => {
    console.log(`Navigating to course: ${id}`);
    // Router.push(`/courses/${id}`)
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-slate-500 font-medium">
              {isLoading ? 'Loading your curriculum...' : `You have ${courses.length} active programs`}
            </p>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterBy(f)}
                className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  filterBy === f ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
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

        {/* Loading & Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-medium">Syncing with campus servers...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Course List / Grid */}
        {!isLoading && !error && (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex flex-col gap-4"
          }>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className={`bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-6 flex flex-col'
                  }`}
                >
                  {/* Icon/Avatar */}
                  <div className={`rounded-2xl flex items-center justify-center font-bold flex-shrink-0 ${
                    viewMode === 'list' ? 'w-12 h-12 text-lg mr-4' : 'w-14 h-14 text-xl mb-6'
                  } ${course.color}`}>
                    {course.name.charAt(0)}
                  </div>

                  {/* Body */}
                  <div className={`flex-1 ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                    <div className={viewMode === 'list' ? 'flex flex-col' : 'mb-6'}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{course.code}</span>
                      <h3 className="text-lg font-bold mt-0.5 group-hover:text-slate-600 transition-colors">{course.name}</h3>
                      {viewMode === 'grid' && <p className="text-sm text-slate-500">{course.professor}</p>}
                    </div>

                    {/* Stats */}
                    <div className={viewMode === 'list' ? 'flex gap-12 mx-8 text-right' : 'grid grid-cols-2 gap-4 pt-6 border-t border-slate-50'}>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Grade</p>
                        <p className="text-sm font-bold text-slate-900">{course.grade}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Status</p>
                        <p className="text-sm font-bold text-slate-900">{course.progress}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => handleContinue(course.id)}
                    className={`${
                      viewMode === 'list' ? 'w-12 h-12' : 'w-full mt-6 py-3 px-4'
                    } flex items-center justify-center gap-2 rounded-2xl bg-slate-50 text-slate-600 font-bold text-xs group-hover:bg-slate-900 group-hover:text-white transition-all`}
                  >
                    {viewMode === 'grid' && 'Continue'}
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 font-medium">No courses match your search or filter.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setFilterBy('all');}}
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