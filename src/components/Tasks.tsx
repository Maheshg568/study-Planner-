import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Task, Priority, Status } from '../types';
import { Plus, Search, Filter, Calendar, Clock, Edit2, Trash2, CheckCircle, Circle, List, CalendarDays, Sparkles } from 'lucide-react';

export default function Tasks() {
  const { tasks, setTasks, subjects } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'weekly'>('list');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    subjectId: subjects[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    priority: 'Medium',
    status: 'Pending'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subjectId) return;

    if (editingId) {
      setTasks(tasks.map(t => t.id === editingId ? { ...t, ...formData } as Task : t));
      setEditingId(null);
    } else {
      setTasks([...tasks, { ...formData, id: Date.now().toString() } as Task]);
    }
    
    setIsAdding(false);
    setFormData({
      title: '',
      description: '',
      subjectId: subjects[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      priority: 'Medium',
      status: 'Pending'
    });
  };

  const handleEdit = (task: Task) => {
    setFormData(task);
    setEditingId(task.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || task.subjectId === filterSubject;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
  }).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const loadDemoData = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const demoTasks: Task[] = [
      {
        id: 'demo-1',
        title: 'Calculus Assignment 3',
        description: 'Complete problems 1-15 on page 42. Focus on integration by parts.',
        subjectId: subjects.find(s => s.name === 'Math')?.id || '1',
        date: todayStr,
        time: '14:00',
        priority: 'High',
        status: 'Pending'
      },
      {
        id: 'demo-2',
        title: 'Physics Lab Report',
        description: 'Write up the results from the pendulum experiment. Include error analysis.',
        subjectId: subjects.find(s => s.name === 'Science')?.id || '2',
        date: todayStr,
        time: '16:30',
        priority: 'Medium',
        status: 'Pending'
      },
      {
        id: 'demo-3',
        title: 'Read Chapter 5: The Industrial Revolution',
        description: 'Take notes on key figures and technological advancements.',
        subjectId: subjects.find(s => s.name === 'History')?.id || '3',
        date: tomorrowStr,
        time: '10:00',
        priority: 'Low',
        status: 'Pending'
      },
      {
        id: 'demo-4',
        title: 'Study for Midterm',
        description: 'Review chapters 1-4. Create flashcards for important formulas.',
        subjectId: subjects.find(s => s.name === 'Math')?.id || '1',
        date: tomorrowStr,
        time: '13:00',
        priority: 'High',
        status: 'Pending'
      }
    ];

    setTasks([...tasks, ...demoTasks]);
  };

  const renderTaskCard = (task: Task) => {
    const subject = subjects.find(s => s.id === task.subjectId);
    const isCompleted = task.status === 'Completed';

    return (
      <div 
        key={task.id} 
        className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 border-y border-r border-y-gray-100 border-r-gray-100 dark:border-y-gray-700 dark:border-r-gray-700 transition-all ${isCompleted ? 'opacity-60' : ''}`}
        style={{ borderLeftColor: subject?.color || '#ccc' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <button 
              onClick={() => toggleStatus(task.id)}
              className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {isCompleted ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
            </button>
            <div>
              <h4 className={`text-lg font-bold ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{task.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                <span className="flex items-center text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: subject?.color }}></div>
                  {subject?.name || 'Unknown'}
                </span>
                <span className="flex items-center text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {task.date}
                </span>
                <span className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {task.time}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const grouped = filteredTasks.reduce((acc, task) => {
      if (!acc[task.date]) acc[task.date] = [];
      acc[task.date].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    const sortedDates = Object.keys(grouped).sort();

    if (sortedDates.length === 0) {
      return (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks found. Add a new task to get started!</p>
          {tasks.length === 0 && (
            <button
              onClick={loadDemoData}
              className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors inline-flex items-center"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Load Demo Data
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {sortedDates.map(date => {
          const dateObj = new Date(date);
          const isToday = date === new Date().toISOString().split('T')[0];
          const dateString = dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
          
          return (
            <div key={date} className="bg-transparent">
              <h3 className={`text-lg font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                {isToday ? 'Today' : dateString}
              </h3>
              <div className="space-y-4">
                {grouped[date].map(task => renderTaskCard(task))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tasks</h2>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'weekly' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              title="Weekly View"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            {editingId ? 'Edit Task' : 'New Task'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <select
                  required
                  value={formData.subjectId}
                  onChange={e => setFormData({...formData, subjectId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update Task' : 'Save Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <select
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks found. Add a new task to get started!</p>
              {tasks.length === 0 && (
                <button
                  onClick={loadDemoData}
                  className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors inline-flex items-center"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Load Demo Data
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map(task => renderTaskCard(task))
          )}
        </div>
      ) : (
        renderWeeklyView()
      )}
    </div>
  );
}
