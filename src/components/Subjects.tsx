import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function Subjects() {
  const { subjects, setSubjects, tasks } = useAppContext();
  const [newSubject, setNewSubject] = useState({ name: '', color: '#3b82f6' });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name.trim()) return;
    
    setSubjects([...subjects, { 
      id: Date.now().toString(), 
      name: newSubject.name, 
      color: newSubject.color 
    }]);
    setNewSubject({ name: '', color: '#3b82f6' });
  };

  const handleDelete = (id: string) => {
    // Check if subject is in use
    const inUse = tasks.some(t => t.subjectId === id);
    if (inUse) {
      alert('Cannot delete subject because it is assigned to one or more tasks.');
      return;
    }
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Manage Subjects</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Add New Subject</h3>
        <form onSubmit={handleAddSubject} className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Subject Name (e.g., Mathematics)"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <input
              type="color"
              value={newSubject.color}
              onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
              className="h-10 w-14 p-1 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => {
          const taskCount = tasks.filter(t => t.subjectId === subject.id).length;
          
          return (
            <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-12 rounded-full" 
                  style={{ backgroundColor: subject.color }}
                ></div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-gray-400" />
                    {subject.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{taskCount} tasks</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(subject.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete Subject"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
