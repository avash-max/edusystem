import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Folder, Download, Plus, 
  FileText, Filter, Loader2, AlertCircle, 
  MoreVertical 
} from 'lucide-react';

export default function ResourcesDashboard() {
  // --- State ---
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // --- Simulated API Fetch ---
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(res => setTimeout(res, 600));
        
        const mockData = [
          { id: 1, title: 'Calculus Lecture Notes', course: 'Advanced Mathematics', uploadedBy: 'Dr. Sarah Chen', date: '2026-02-01', type: 'Notes', size: '2.4 MB' },
          { id: 2, title: 'Chemistry Lab Manual', course: 'Chemistry Laboratory', uploadedBy: 'Prof. Michael Rodriguez', date: '2026-01-28', type: 'Manual', size: '5.1 MB' },
          { id: 3, title: 'React Hooks Cheat Sheet', course: 'Web Development', uploadedBy: 'Dr. Emily Johnson', date: '2026-02-05', type: 'Notes', size: '1.2 MB' },
          { id: 4, title: 'Data Set: Global Warming', course: 'Data Analytics', uploadedBy: 'Prof. David Lee', date: '2026-02-10', type: 'Dataset', size: '12.8 MB' },
        ];
        setResources(mockData);
      } catch (err) {
        setError('Unable to load course materials.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  // --- Logic ---
  const categories = ['All', 'Notes', 'Manual', 'Dataset'];

  const filtered = useMemo(() => {
    return resources.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || r.type === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, activeCategory]);

  const handleDownload = (title) => {
    alert(`Starting download: ${title}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
            <p className="text-slate-500 font-medium">Access study materials and course files</p>
          </div>
        </header>

        {/* Search & Categories */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input
              type="text"
              placeholder="Search by filename, course, or professor..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="animate-spin w-10 h-10 mb-4" />
              <p className="font-bold tracking-wide">Fetching your library...</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center text-red-500 flex flex-col items-center">
              <AlertCircle className="w-10 h-10 mb-2" />
              <p className="font-bold">{error}</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {filtered.map(r => (
                <div key={r.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{r.title}</h3>
                      <p className="text-xs font-medium text-slate-500">
                        {r.course} • {r.uploadedBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Added</p>
                      <p className="text-xs font-bold text-slate-900">{r.date}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</p>
                      <p className="text-xs font-bold text-slate-900">{r.size}</p>
                    </div>
                    <button 
                      onClick={() => handleDownload(r.title)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" /> DOWNLOAD
                    </button>
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <Folder className="w-16 h-16 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold text-lg">No materials found.</p>
              <p className="text-slate-400 text-sm">Try broadening your search or changing categories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}