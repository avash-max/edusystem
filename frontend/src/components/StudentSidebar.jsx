import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, Target, CheckCircle, Coffee,
  ChevronLeft, Menu, Settings, LogOut,
  GraduationCap, LayoutDashboard
} from 'lucide-react';

export function StudentSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard",   path: "/",             icon: <LayoutDashboard size={20} />, badge: null },
    { label: "My Courses",  path: "/courses",     icon: <BookOpen size={20} />,        badge: "5" },
    { label: "Assignments", path: "/assignments", icon: <CheckCircle size={20} />,     badge: "8" },
    { label: "Resources",   path: "/resources",   icon: <Coffee size={20} />,          badge: null },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside 
      className={`sticky top-0 h-screen flex flex-col bg-[#0f172a] text-slate-300 transition-all duration-300 z-50 
      ${collapsed ? 'w-20' : 'w-64'} border-r border-slate-800 flex-shrink-0`}
    >
      
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-white tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span>EduLearn</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors mx-auto text-slate-400"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group
                ${active 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' 
                  : 'hover:bg-slate-800/50 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}>
                  {item.icon}
                </span>
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full 
                  ${active ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Profile & System */}
      <div className="p-4 mt-auto border-t border-slate-800/50 bg-[#0f172a]/50">
        
        {!collapsed && (
          <div className="mb-4 px-3 py-3 bg-slate-800/30 rounded-2xl flex items-center gap-3 border border-slate-700/30">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-slate-900">
              JD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">John Doe</p>
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-black">Level 12 Student</p>
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