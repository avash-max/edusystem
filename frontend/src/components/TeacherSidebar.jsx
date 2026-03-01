import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, Target, CheckCircle, 
  ChevronLeft, Menu, Settings, LogOut,
  GraduationCap, LayoutDashboard
} from 'lucide-react';

export function TeacherSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard",   path: "/",             icon: <LayoutDashboard size={20} /> },
    { label: "My Courses",  path: "/courses",     icon: <BookOpen size={20} /> },
    { label: "Assignments", path: "/assignments", icon: <CheckCircle size={20} /> },
    { label: "Resources",   path: "/resources",   icon: <Target size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside 
      className={`sticky top-0 h-screen flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 z-50 
      ${collapsed ? 'w-20' : 'w-64'} border-r border-slate-800 flex-shrink-0`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-white tracking-tight">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span>EduLearn</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors mx-auto"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
              ${isActive(item.path)
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'hover:bg-slate-800 hover:text-slate-100'
              }`}
          >
            <span className={`${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`}>
              {item.icon}
            </span>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer Profile Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        {!collapsed && (
          <div className="mb-4 px-3 py-3 bg-slate-800/40 rounded-2xl flex items-center gap-3 border border-slate-700/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-slate-800">
              TR
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Prof. Richards</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Teacher Account</p>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <button 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium text-left"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            <LogOut size={18}/>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}