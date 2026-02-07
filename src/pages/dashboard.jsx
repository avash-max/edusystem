import React, { useState } from 'react';
import { Menu, Bell, Search, Home, BarChart2, Users, FolderOpen, Settings, LogOut, Plus, TrendingUp, DollarSign, ShoppingCart, Activity } from 'lucide-react';

export default function BasementDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({
    show: false,
    message: ''
  });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const stats = [
    { title: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: DollarSign, color: 'bg-blue-500' },
    { title: 'Total Orders', value: '1,245', change: '+15.3%', icon: ShoppingCart, color: 'bg-green-500' },
    { title: 'Total Customers', value: '3,462', change: '+8.2%', icon: Users, color: 'bg-purple-500' },
    { title: 'Growth Rate', value: '21.35%', change: '+2.5%', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  const recentActivities = [
    { id: 1, user: 'Sarah Johnson', action: 'Created new project', time: '2 mins ago', avatar: 'bg-pink-500' },
    { id: 2, user: 'Mike Chen', action: 'Updated dashboard layout', time: '15 mins ago', avatar: 'bg-blue-500' },
    { id: 3, user: 'Emma Davis', action: 'Added new team member', time: '1 hour ago', avatar: 'bg-green-500' },
    { id: 4, user: 'David Miller', action: 'Completed sales report', time: '2 hours ago', avatar: 'bg-orange-500' }
  ];

  const projects = [
    { name: 'Website Redesign', progress: 75, status: 'In Progress', team: 5 },
    { name: 'Mobile App Launch', progress: 45, status: 'In Progress', team: 8 },
    { name: 'Marketing Campaign', progress: 90, status: 'Review', team: 4 },
    { name: 'Product Development', progress: 30, status: 'Planning', team: 6 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <p>{toast.message}</p>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center'}`}>
            <div className="bg-black rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            {sidebarOpen && <span className="text-xl font-bold">Basement</span>}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
              <Home size={20} />
              {sidebarOpen && <span className="font-medium">Dashboard</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart2 size={20} />
              {sidebarOpen && <span>Analytics</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              <Users size={20} />
              {sidebarOpen && <span>Customers</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              <FolderOpen size={20} />
              {sidebarOpen && <span>Projects</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings size={20} />
              {sidebarOpen && <span>Settings</span>}
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => showToast('Logged out successfully')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-80"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">John Doe</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-gray-600">Here's what's happening with your business today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Active Projects</h2>
                <button 
                  onClick={() => showToast('Create new project feature coming soon!')}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus size={20} />
                  <span>New Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{project.name}</h3>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                        {project.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>{project.team} team members</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className={`w-10 h-10 ${activity.avatar} rounded-full flex-shrink-0`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}