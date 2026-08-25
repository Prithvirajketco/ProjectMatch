import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';

const successData = [
  { month: 'Jan', rate: 65 },
  { month: 'Feb', rate: 68 },
  { month: 'Mar', rate: 74 },
  { month: 'Apr', rate: 82 },
  { month: 'May', rate: 85 },
  { month: 'Jun', rate: 92 },
];

const skillData = [
  { name: 'Engineering', value: 400, color: '#2563EB' },
  { name: 'Design', value: 300, color: '#3B82F6' },
  { name: 'Product', value: 200, color: '#60A5FA' },
  { name: 'Data', value: 150, color: '#93C5FD' },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Platform metrics and AI matching performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Matching Success', value: '92%', trend: '+5%', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Time to Form Team', value: '1.2 days', trend: '-2 days', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Total Placements', value: '438', trend: '+12%', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'AI Automation Rate', value: '88%', trend: '+3%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className="text-gray-500 text-sm font-medium">{stat.title}</div>
            <div className="flex items-end gap-2 mt-1">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs font-semibold text-green-500 mb-1">{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">AI Match Success Rate Over Time</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={successData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="rate" stroke="#2563EB" strokeWidth={3} dot={{r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Talent Pool Distribution</h3>
          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={skillData} innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value">
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900">1,050</span>
              <span className="text-xs font-medium text-gray-500 uppercase">Total Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
