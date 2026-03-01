import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, Target, CheckCircle,
  ChevronLeft, Menu, Settings, Zap
} from 'lucide-react';

export default function TeacherSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/teacher", icon: <Target className="w-5 h-5" /> },
    { label: "Courses", path: "/teacher/courses", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Assignments", path: "/teacher/assignments", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out shadow-2xl
        ${sidebarOpen ? 'w-72' : 'w-20'}`}
    >
      <div className="flex flex-col h-full">

        {/* Logo */}
        <div className="p-6 mb-6 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 animate-in fade-in duration-500">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight">
                  EDU<span className="text-orange-400">LEARN</span>
                </span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Teacher</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <Zap className="w-6 h-6 fill-white" />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              expanded={sidebarOpen}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 bg-slate-800/50 mt-auto border-t border-slate-800 space-y-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {sidebarOpen && (
            <button className="w-full flex items-center space-x-3 p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white font-bold">
              <Settings className="w-5 h-5" />
              <span className="text-sm">Settings</span>
            </button>
          )}
        </div>

      </div>
    </aside>
  );
}

function NavItem({ icon, label, path, active, expanded }) {
  return (
    <Link
      to={path}
      className={`group relative flex items-center rounded-xl transition-all duration-200
        ${expanded ? 'px-4 py-3' : 'p-3 justify-center'}
        ${active
          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-600/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>
        {icon}
      </div>

      {expanded && (
        <div className="ml-3 flex flex-1 items-center animate-in fade-in slide-in-from-left-2 duration-300">
          <span className="font-bold text-sm tracking-wide">{label}</span>
        </div>
      )}

      {!expanded && (
        <div className="absolute left-14 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-slate-800 whitespace-nowrap z-[100]">
          {label}
        </div>
      )}
    </Link>
  );
}