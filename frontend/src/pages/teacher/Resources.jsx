import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, X, Loader2, 
  Search, FileText, Link as LinkIcon, 
  Video, File, BookOpen, Download 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  addResource, 
  getAllResources, 
  updateResource, 
  removeResource 
} from '../../services/api';

const RESOURCE_TYPES = ['document', 'video', 'link', 'file'];

const TYPE_CONFIG = {
  document: { icon: <FileText className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
  video:    { icon: <Video className="w-5 h-5" />,    color: 'bg-red-50 text-red-500' },
  link:     { icon: <LinkIcon className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
  file:     { icon: <File className="w-5 h-5" />,     color: 'bg-orange-50 text-orange-500' },
};

const courses = [
  { id: 1, name: 'Advanced Mathematics' },
  { id: 2, name: 'Chemistry Laboratory' },
  { id: 3, name: 'Web Development' },
];

const EMPTY_FORM = { title: '', description: '', type: 'document', course: '', url: '' };

export default function TeacherResources() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [newResource, setNewResource] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  useEffect(() => { fetchResources(); }, []);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const { data } = await getAllResources();
      setResources(data.resources || []);
    } catch (err) {
      toast.error('Failed to load resources.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await addResource(newResource);
      setResources(prev => [data.resource, ...prev]);
      setShowModal(false);
      setNewResource(EMPTY_FORM);
      toast.success('Resource posted!');
    } catch (err) {
      toast.error('Failed to post resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (resource) => {
    setSelected(resource);
    setEditForm({ ...resource });
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await updateResource(selected.resource_id, editForm);
      setResources(prev => 
        prev.map(r => r.resource_id === selected.resource_id ? data.resource : r)
      );
      setEditModal(false);
      setSelected(null);
      toast.success('Resource updated!');
    } catch (err) {
      toast.error('Failed to update resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await removeResource(id);
      setResources(prev => prev.filter(r => r.resource_id !== id));
      toast.success('Resource deleted.');
    } catch (err) {
      toast.error('Failed to delete resource.');
    }
  };

  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       r.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'all' || r.type === filterType;
    return matchSearch && matchType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin h-10 w-10 text-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resources</h1>
            <p className="text-slate-500 font-medium mt-1">Manage study materials for your students.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" /> Post Resource
          </button>
        </header>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {RESOURCE_TYPES.map(type => (
            <div key={type} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
              <div className={`p-2 rounded-xl ${TYPE_CONFIG[type].color}`}>{TYPE_CONFIG[type].icon}</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type}s</p>
                <p className="text-2xl font-black text-slate-900">{resources.filter(r => r.type === type).length}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
          <div className="flex gap-2 flex-wrap">
            {['all', ...RESOURCE_TYPES].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all 
                  ${filterType === t ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <BookOpen className="mx-auto w-12 h-12 text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">No resources found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(r => {
              const cfg = TYPE_CONFIG[r.type] || TYPE_CONFIG.file;
              return (
                <div key={r.resource_id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${cfg.color}`}>{cfg.icon}</div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditClick(r)} className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(r.resource_id)} className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">{r.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{r.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.course}</span>
                    {r.url && (
                      <a 
                        href={r.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <Download size={14} /> Open
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Modal */}
        {showModal && (
          <Modal title="Post Resource" onClose={() => setShowModal(false)}>
            <form onSubmit={handleAdd} className="space-y-4">
              <FormField label="Title">
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" placeholder="e.g. Chapter 5 Notes" value={newResource.title} onChange={(e) => setNewResource({...newResource, title: e.target.value})} />
              </FormField>
              <FormField label="Description">
                <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 resize-none" value={newResource.description} onChange={(e) => setNewResource({...newResource, description: e.target.value})} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Type">
                  <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" value={newResource.type} onChange={(e) => setNewResource({...newResource, type: e.target.value})}>
                    {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>
                <FormField label="Course">
                  <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" value={newResource.course} onChange={(e) => setNewResource({...newResource, course: e.target.value})}>
                    <option value="">Select</option>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="URL / Link">
                <input type="url" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" value={newResource.url} onChange={(e) => setNewResource({...newResource, url: e.target.value})} />
              </FormField>
              <SubmitButton loading={submitting} label="Post Resource" />
            </form>
          </Modal>
        )}

      </div>
    </div>
  );
}

// Reusable Components
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold mt-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
      {loading ? <Loader2 className="animate-spin w-4 h-4" /> : label}
    </button>
  );
}