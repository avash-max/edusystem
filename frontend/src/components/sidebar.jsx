import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, Award, Target, Calendar, LogOut,
  CheckCircle, Coffee, Zap, ChevronLeft, Menu, Users, BarChart3, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Don't show sidebar on login page
  if (!user) return null;

  const studentNavItems = [
    { label: "Dashboard", path: "/", icon: <Target className="w-5 h-5" />, badge: null },
    { label: "My Courses", path: "/courses", icon: <BookOpen className="w-5 h-5" />, badge: "5" },
    { label: "Assignments", path: "/assignments", icon: <CheckCircle className="w-5 h-5" />, badge: "8" },
    { label: "Calendar", path: "/calendar", icon: <Calendar className="w-5 h-5" />, badge: null },
    { label: "Grades", path: "/grades", icon: <Award className="w-5 h-5" />, badge: null },
    { label: "Resources", path: "/resources", icon: <Coffee className="w-5 h-5" />, badge: null },
  ];

  const teacherNavItems = [
    { label: "Dashboard", path: "/teacher", icon: <Target className="w-5 h-5" />, badge: null },
    { label: "My Courses", path: "/teacher/courses", icon: <BookOpen className="w-5 h-5" />, badge: "5" },
  ];

  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;
  const sidebarColor = user?.role === 'teacher' ? 'from-orange-600 to-red-600' : 'from-blue-600 to-indigo-600';

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out shadow-2xl
        ${sidebarOpen ? 'w-72' : 'w-20'}`}
    >
      <div className="flex flex-col h-full">
        
        {/* Logo Section */}
        <div className="p-6 mb-6 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 animate-in fade-in duration-500">
              <div className={`w-10 h-10 bg-gradient-to-br ${sidebarColor} rounded-xl flex items-center justify-center shadow-lg`}>
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight">
                  EDU<span className="text-blue-400">LEARN</span>
                </span>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{user?.role}</p>
              </div>
            </div>
          ) : (
            <div className={`w-10 h-10 bg-gradient-to-br ${sidebarColor} rounded-xl flex items-center justify-center mx-auto shadow-lg`}>
              <Zap className="w-6 h-6 fill-white" />
            </div>
          )}
        </div>

        {/* Nav Items */}
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

        {/* Bottom Section */}
        <div className="p-4 bg-slate-800/50 mt-auto border-t border-slate-800 space-y-3">
          
          {/* Collapse Button */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="p-3 bg-slate-700/50 rounded-lg animate-in slide-in-from-left-4 duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-full border-2 border-slate-600" />
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Quick Settings */}
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

function NavItem({ icon, label, path, active, badge, expanded }) {
  return (
    <Link
      to={path}
      className={`group relative flex items-center rounded-xl transition-all duration-200
        ${expanded ? 'px-4 py-3' : 'p-3 justify-center'}
        ${active 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>
        {icon}
      </div>

      {expanded && (
        <div className="ml-3 flex flex-1 items-center justify-between animate-in fade-in slide-in-from-left-2 duration-300">
          <span className="font-bold text-sm tracking-wide">{label}</span>
          {badge && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full 
              ${active ? 'bg-blue-400 text-white' : 'bg-slate-700 text-slate-300'}`}>
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Tooltip for collapsed mode */}
      {!expanded && (
        <div className="absolute left-14 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-slate-800 whitespace-nowrap z-[100]">
          {label}
        </div>
      )}
    </Link>
  );
}