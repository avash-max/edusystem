import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Clock, FileText, 
  ChevronDown, Paperclip, Loader2, AlertCircle 
} from 'lucide-react';

export default function AssignmentsDashboard() {
  // --- State ---
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // --- Simulated API Fetch ---
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(res => setTimeout(res, 800));
        
        const mockData = [
          { id: 1, title: 'Cloud computing', course: 'Computer architecture', dueDate: '2026-02-08', status: 'pending', priority: 'high', description: 'Complete problems 1-15 from Chapter 8.', attachments: ['problem_set_5.pdf'], icon: '📝' },
          { id: 2, title: 'React and node js', course: 'Web Development', dueDate: '2026-02-10', status: 'in-progress', priority: 'medium', description: 'Write a comprehensive lab report on chemical reactions.', attachments: ['guidelines.pdf'], icon: '🧪' },
          { id: 5, title: 'OOP', course: 'Java', dueDate: '2026-02-06', status: 'overdue', priority: 'high', description: 'Submit detailed thesis outline.', attachments: [], icon: '📝' },
          { id: 7, title: 'Dynamic Programming', course: 'Programming for developers', dueDate: '2026-02-20', status: 'completed', priority: 'low', description: 'Develop a digital campaign proposal.', attachments: ['template.pptx'], icon: '📢' }
        ];
        setAssignments(mockData);
      } catch (err) {
        setError('Could not load assignments.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // --- Logic ---
  const filteredData = useMemo(() => {
    return assignments.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           a.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = selectedTab === 'all' || a.status === selectedTab;
      return matchesSearch && matchesTab;
    });
  }, [assignments, searchQuery, selectedTab]);

  const handleSubmit = (id) => {
    alert(`Submission flow started for assignment #${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
            <p className="text-slate-500 font-medium">Manage your upcoming deadlines</p>
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
            {['all', 'pending', 'in-progress', 'completed', 'overdue'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                  selectedTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading/Error State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin w-8 h-8 mr-3" />
            <span className="font-bold">Fetching deadlines...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Assignment List */}
        {!isLoading && !error && (
          <div className="space-y-3">
            {filteredData.length > 0 ? filteredData.map(task => (
              <div 
                key={task.id} 
                className={`bg-white rounded-2xl border border-slate-100 transition-all ${
                  expandedId === task.id ? 'ring-2 ring-slate-900/5 shadow-md' : 'hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Compact Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl">
                      {task.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{task.title}</h3>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{task.course}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Due</p>
                      <p className="text-xs font-bold">{new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                      task.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {task.status}
                    </span>

                    <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${expandedId === task.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === task.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Description</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex flex-wrap gap-2">
                        {task.attachments.map((file, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500">
                            <Paperclip className="w-3 h-3" /> {file}
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => handleSubmit(task.id)}
                        className="w-full md:w-auto px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-black hover:bg-slate-800 transition-all active:scale-95"
                      >
                        SUBMIT WORK
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-10">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 font-bold">No assignments found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}