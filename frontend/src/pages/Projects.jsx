import React, { useState, useEffect } from 'react';
import { getProjects } from '../api';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Users, Plus, MoreVertical, Search, Filter } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API failed, using mock data.", err);
        setProjects([
          {
            _id: 'mock-1',
            title: 'AI Climate Dashboard',
            description: 'A platform to visualize climate change data using ML predictions.',
            required_skills: ['Python', 'React', 'Data Science'],
            must_have_roles: ['Frontend Developer', 'Data Engineer'],
            team_size: 4,
            status: 'Active',
            location: 'Remote',
            posted: '2 days ago'
          },
          {
            _id: 'mock-2',
            title: 'Healthcare App Redesign',
            description: 'Redesigning a legacy healthcare portal for better accessibility.',
            required_skills: ['UI/UX Design', 'Figma', 'User Research'],
            must_have_roles: ['Product Designer', 'UX Researcher'],
            team_size: 3,
            status: 'Active',
            location: 'New York, NY',
            posted: '1 week ago'
          },
          {
            _id: 'mock-3',
            title: 'Financial Data Pipeline',
            description: 'Building a robust, real-time data pipeline for trading analytics.',
            required_skills: ['Kafka', 'Go', 'PostgreSQL', 'AWS'],
            must_have_roles: ['Backend Engineer', 'DevOps'],
            team_size: 5,
            status: 'Draft',
            location: 'London, UK',
            posted: 'Just now'
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Manage active projects and team formation requirements.</p>
        </div>
        <button onClick={() => alert("Opening New Project modal...")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between items-center">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-72 focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{p.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {p.location || 'Remote'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {p.posted || 'Recently'}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
            </div>
            
            <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-2">{p.description}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Required Skills</div>
                <div className="flex flex-wrap gap-2">
                  {p.required_skills.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-200">{s}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Must-Have Roles</div>
                <div className="flex flex-wrap gap-2">
                  {p.must_have_roles.map(r => (
                    <span key={r} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">{r}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={16} /> <span className="font-medium">{p.team_size} Members</span> Needed
              </div>
              <Link to={`/match/${p._id}`} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                Build Team
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
