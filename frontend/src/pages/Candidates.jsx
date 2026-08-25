import React, { useState, useEffect } from 'react';
import { getCandidates } from '../api';
import { Users, Search, Filter, MoreVertical, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidates()
      .then(res => {
        setCandidates(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API failed, using mock data.", err);
        setCandidates([
          {
            _id: 'c1',
            name: 'Alex Chen',
            role: 'Full Stack Dev',
            raw_text: 'I know some Python, kinda into design too, free most evenings.',
            skills: [
              { name: 'Python', confidence: 'medium' },
              { name: 'Design', confidence: 'low' },
              { name: 'React', confidence: 'medium' }
            ],
            uncertain_fields: ['Specific design tools', 'Exact availability hours'],
            location: 'Toronto, CA',
            avatar: 'https://i.pravatar.cc/150?img=11'
          },
          {
            _id: 'c2',
            name: 'Sarah Williams',
            role: 'Senior Frontend',
            raw_text: 'Senior React dev. Can do Node.js. Available 20hrs/week.',
            skills: [
              { name: 'React', confidence: 'high' },
              { name: 'Node.js', confidence: 'medium' },
              { name: 'TypeScript', confidence: 'high' }
            ],
            uncertain_fields: [],
            location: 'Remote',
            avatar: 'https://i.pravatar.cc/150?img=5'
          },
          {
            _id: 'c3',
            name: 'David Kim',
            role: 'Data Engineer',
            raw_text: 'Data engineer with 5 years exp in Kafka, Spark, and AWS.',
            skills: [
              { name: 'Kafka', confidence: 'high' },
              { name: 'Spark', confidence: 'high' },
              { name: 'AWS', confidence: 'medium' }
            ],
            uncertain_fields: ['Availability'],
            location: 'Seoul, KR',
            avatar: 'https://i.pravatar.cc/150?img=8'
          }
        ]);
        setLoading(false);
      });
  }, []);

  const getConfidenceBadge = (conf) => {
    if (conf === 'high') return <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold tracking-wide uppercase">High</span>;
    if (conf === 'medium') return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-bold tracking-wide uppercase">Med</span>;
    return <span className="px-2 py-0.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-[11px] font-bold tracking-wide uppercase">Low</span>;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Pool</h1>
          <p className="text-gray-500 text-sm mt-1">Review extracted profiles and AI confidence ratings.</p>
        </div>
        <button onClick={() => alert("Opening profile parser...")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
          <Sparkles size={18} /> Parse New Profile
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search candidates by name, skill..." 
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-80 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Candidate</th>
                <th className="px-6 py-4 font-semibold">Extracted Skills</th>
                <th className="px-6 py-4 font-semibold">AI Certainty</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidates.map(c => (
                <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={c.avatar || `https://i.pravatar.cc/150?u=${c._id}`} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt={c.name} />
                      <div>
                        <div className="font-semibold text-gray-900">{c.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{c.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2 max-w-xs">
                      {c.skills.map(s => (
                        <div key={s.name} className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-1 rounded-md shadow-sm">
                          <span className="text-gray-700 font-medium">{s.name}</span>
                          {getConfidenceBadge(s.confidence)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {c.uncertain_fields?.length > 0 ? (
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg w-fit text-xs font-medium">
                        <AlertCircle size={14} /> Missing data
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg w-fit text-xs font-medium">
                        <CheckCircle2 size={14} /> High Certainty
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {c.location || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
