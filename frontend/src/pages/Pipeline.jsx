import React from 'react';
import { MoreHorizontal, Plus, GripVertical } from 'lucide-react';

const columns = [
  { id: 'sourced', title: 'Sourced Candidates', count: 12, color: 'border-gray-200 bg-gray-50' },
  { id: 'ai-matched', title: 'AI Recommended', count: 8, color: 'border-blue-200 bg-blue-50' },
  { id: 'interviewing', title: 'Interviewing', count: 5, color: 'border-amber-200 bg-amber-50' },
  { id: 'hired', title: 'Team Formed', count: 3, color: 'border-green-200 bg-green-50' }
];

const mockCards = [
  { id: 1, colId: 'sourced', name: 'James Wilson', role: 'Backend Dev', project: 'AI Dashboard', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 2, colId: 'sourced', name: 'Emma Davis', role: 'UI Designer', project: 'Healthcare App', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 3, colId: 'ai-matched', name: 'Sarah Williams', role: 'Frontend Lead', project: 'AI Dashboard', avatar: 'https://i.pravatar.cc/150?img=5', score: '98%' },
  { id: 4, colId: 'ai-matched', name: 'David Kim', role: 'Data Engineer', project: 'AI Dashboard', avatar: 'https://i.pravatar.cc/150?img=8', score: '95%' },
  { id: 5, colId: 'interviewing', name: 'Marcus Johnson', role: 'Product Manager', project: 'Finance Pipeline', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 6, colId: 'hired', name: 'Aria Tan', role: 'UX Designer', project: 'Healthcare App', avatar: 'https://i.pravatar.cc/150?img=1' },
];

export default function Pipeline() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">Track candidate progress across all active projects.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={18} /> Add Candidate
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map(col => (
            <div key={col.id} className={`w-80 flex flex-col rounded-2xl border ${col.color}`}>
              <div className="p-4 flex justify-between items-center border-b border-inherit shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{col.title}</h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-600 shadow-sm">{col.count}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {mockCards.filter(c => c.colId === col.id).map(card => (
                  <div key={card.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-grab hover:border-gray-300 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3">
                        <img src={card.avatar} className="w-10 h-10 rounded-full" alt="" />
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{card.name}</div>
                          <div className="text-xs text-gray-500">{card.role}</div>
                        </div>
                      </div>
                      <GripVertical size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                        {card.project}
                      </div>
                      {card.score && (
                        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                          {card.score} Match
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
