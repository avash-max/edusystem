import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [filterType, setFilterType] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      type: 'class',
      course: 'MTH_401',
      date: '2026-02-07',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Chemistry Lab',
      type: 'class',
      course: 'CHM_302',
      date: '2026-02-07',
      startTime: '01:00 PM',
      endTime: '04:00 PM',
      color: 'orange'
    },
    {
      id: 3,
      title: 'Calculus Problem Set 5',
      type: 'assignment',
      course: 'MTH_401',
      date: '2026-02-08',
      startTime: '11:59 PM',
      endTime: '11:59 PM',
      color: 'blue'
    },
    {
      id: 4,
      title: 'Quiz 4: Organic Chemistry',
      type: 'exam',
      course: 'CHM_302',
      date: '2026-02-09',
      startTime: '02:00 PM',
      endTime: '02:30 PM',
      color: 'orange'
    }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const filterEvents = (events) => {
    if (filterType === 'all') return events;
    return events.filter(event => event.type === filterType);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="min-h-screen bg-[#F2F6FA] font-sans text-slate-800">
      <main className="px-8 pb-8 pt-6 max-w-[1800px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Calendar</h1>
          <p className="text-slate-500 text-base">Track classes, assignments, and exams</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex bg-white p-1 rounded-full shadow-sm border border-slate-100">
            {['month', 'week'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all ${viewMode === mode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-white border text-slate-900 text-sm rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-all outline-none border-slate-200 focus:border-slate-300"
            >
              <option value="all">All</option>
              <option value="class">Classes</option>
              <option value="assignment">Assignments</option>
              <option value="exam">Exams</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={previousMonth} className="p-2 rounded-full hover:bg-slate-50">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <span className="font-semibold text-slate-900">{monthNames[month]} {year}</span>
            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-50">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs text-slate-500 mb-2">
            {dayNames.map(d => <div key={d} className="text-center">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array(startingDayOfWeek).fill(null).map((_, i) => <div key={'blank-' + i} className="h-20"></div>)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const dayEvents = filterEvents(getEventsForDate(date));
              return (
                <div key={day} className="h-20 p-1 border border-slate-100 rounded-sm relative">
                  <span className="text-slate-800">{day}</span>
                  {dayEvents.map(ev => (
                    <div key={ev.id} className="mt-1 text-xs text-slate-700 truncate">
                      {ev.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
