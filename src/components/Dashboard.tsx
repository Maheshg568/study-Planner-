import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle2, Clock, BookOpen, Quote } from 'lucide-react';

export default function Dashboard() {
  const { tasks, setTasks } = useAppContext();
  const [quote, setQuote] = useState({ text: "The secret of getting ahead is getting started.", author: "Mark Twain" });

  useEffect(() => {
    const quotes = [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
      { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
      { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
      { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
      { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
      { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
      { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.date === today);
  const completedToday = todaysTasks.filter(t => t.status === 'Completed').length;
  const pendingToday = todaysTasks.length - completedToday;
  
  const totalCompleted = tasks.filter(t => t.status === 'Completed').length;
  const totalTasks = tasks.length;
  const overallProgress = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);

  const loadDemoData = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const demoTasks = [
      {
        id: 'demo-1',
        title: 'Calculus Assignment 3',
        description: 'Complete problems 1-15 on page 42. Focus on integration by parts.',
        subjectId: '1',
        date: todayStr,
        time: '14:00',
        priority: 'High' as const,
        status: 'Pending' as const
      },
      {
        id: 'demo-2',
        title: 'Physics Lab Report',
        description: 'Write up the results from the pendulum experiment. Include error analysis.',
        subjectId: '2',
        date: todayStr,
        time: '16:30',
        priority: 'Medium' as const,
        status: 'Pending' as const
      },
      {
        id: 'demo-3',
        title: 'Read Chapter 5: The Industrial Revolution',
        description: 'Take notes on key figures and technological advancements.',
        subjectId: '3',
        date: tomorrowStr,
        time: '10:00',
        priority: 'Low' as const,
        status: 'Pending' as const
      },
      {
        id: 'demo-4',
        title: 'Study for Midterm',
        description: 'Review chapters 1-4. Create flashcards for important formulas.',
        subjectId: '1',
        date: tomorrowStr,
        time: '13:00',
        priority: 'High' as const,
        status: 'Pending' as const
      }
    ];

    setTasks([...tasks, ...demoTasks]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <Quote className="w-8 h-8 text-white/50 mb-4" />
          <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4">"{quote.text}"</p>
          <p className="text-blue-100">— {quote.author}</p>
        </div>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-white/10">
          <BookOpen className="w-64 h-64" />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Today's Overview</h2>
        {tasks.length === 0 && (
          <button
            onClick={loadDemoData}
            className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
          >
            Load Demo Data
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg mr-4">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Tasks Today</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{todaysTasks.length}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg mr-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{completedToday}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-lg mr-4">
            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pending</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingToday}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Overall Progress</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">All time completion rate</p>
          </div>
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
          {totalCompleted} of {totalTasks} tasks completed
        </p>
      </div>
    </div>
  );
}
