import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Plus, ChevronRight, MoreVertical } from 'lucide-react';

export default function SimpleEduDashboard() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Simplified Data
  const courses = [
    { id: 1, name: 'Advanced Mathematics', progress: 75, icon: '∑', color: 'text-blue-600 bg-blue-50' },
    { id: 2, name: 'Chemistry Lab', progress: 60, icon: '⚗', color: 'text-orange-600 bg-orange-50' },
    { id: 3, name: 'Web Development', progress: 85, icon: '</>', color: 'text-purple-600 bg-purple-50' },
    { id: 4, name: 'Data Analytics', progress: 45, icon: '📊', color: 'text-emerald-600 bg-emerald-50' },
  ];

  const schedule = [
    { time: '10:00 AM', course: 'Advanced Mathematics', room: 'Room 204', type: 'Lecture' },
    { time: '01:00 PM', course: 'Chemistry Lab', room: 'Lab 3', type: 'Lab' },
  ];

  const tasks = [
    { id: 1, title: 'Calculus Problem Set 5', course: 'Math', timeLeft: '1 day', priority: 'High' },
    { id: 2, title: 'Lab Report', course: 'Chemistry', timeLeft: '3 days', priority: 'Med' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold">{greeting}, John 👋</h1>
          <p className="text-slate-500">You have {tasks.length} tasks due soon.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Simple Stats Row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {courses.map(course => (
                <div key={course.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className={`w-10 h-10 ${course.color} rounded-xl flex items-center justify-center font-bold mb-3`}>
                    {course.icon}
                  </div>
                  <p className="text-xs font-medium text-slate-500 truncate">{course.name}</p>
                  <p className="text-lg font-bold">{course.progress}%</p>
                </div>
              ))}
            </section>

            {/* Schedule Section */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Today's Schedule</h2>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                {schedule.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                    <div className="flex gap-4 items-center">
                      <div className="text-sm font-bold w-16">{item.time}</div>
                      <div>
                        <h4 className="font-semibold text-sm">{item.course}</h4>
                        <p className="text-xs text-slate-500">{item.room} • {item.type}</p>
                      </div>
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-8">
            <section className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-xl font-bold">Tasks</h2>
                  <p className="text-slate-400 text-sm">Action items</p>
                </div>
                <button className="bg-white/10 p-2 rounded-full hover:bg-white/20">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white/10 p-4 rounded-2xl hover:bg-white/15 cursor-pointer transition-all">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{task.priority}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.timeLeft}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm">{task.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{task.course}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm flex items-center justify-center gap-2">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </section>
          </aside>

        </div>
      </div>
    </div>
  );
}