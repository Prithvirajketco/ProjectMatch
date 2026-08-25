import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, Users, Sparkles, MoreHorizontal, Filter, BarChart2 } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const matchData = [
  { name: 'Python Dev', viewed: 1000, matched: 320 },
  { name: 'UI/UX Designer', viewed: 300, matched: 120 },
  { name: 'Frontend Eng', viewed: 500, matched: 480 },
  { name: 'Data Engineer', viewed: 1100, matched: 600 },
  { name: 'Product Mgr', viewed: 600, matched: 250 },
  { name: 'QA Engineer', viewed: 450, matched: 200 },
  { name: 'Marketing', viewed: 1000, matched: 500 },
  { name: 'Sales', viewed: 550, matched: 220 },
  { name: 'HR', viewed: 400, matched: 150 },
];

const candidatesDb = [
  { name: 'Aria Tan', role: 'UX Designer', score: '92%', scoreText: 'Excellent Match', scoreColor: 'text-blue-700 bg-blue-50', location: 'Singapore', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Diego Santos', role: 'Product Designer', score: '87%', scoreText: 'Strong Match', scoreColor: 'text-blue-700 bg-blue-50', location: 'Brazil', avatar: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Sarah Mitchell', role: 'UI Designer', score: '78%', scoreText: 'Good Match', scoreColor: 'text-blue-700 bg-blue-50', location: 'United States', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const schedule = [
  { title: 'Product Designer Interview', person: 'Sarah Tan', time: '10am', color: 'bg-red-50 border-red-100' },
  { title: 'Frontend Engineer Assessment', person: 'Michael Chen', time: '11am', color: 'bg-blue-50 border-blue-100' },
  { title: 'Marketing Manager Screening', person: 'Anisa Wirawan', time: '12pm', color: 'bg-amber-50 border-amber-100' },
];

const StatCard = ({ icon: Icon, title, value, subtext }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
        <Icon size={20} />
      </div>
    </div>
    <div>
      <div className="text-gray-500 text-sm font-medium mb-1">{title}</div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-sm font-medium text-green-500">{subtext}</div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Briefcase} title="Active Projects" value="12" subtext="+2 new this week" />
        <StatCard icon={Users} title="Total Candidates" value="1,293" subtext="+289 new this week" />
        <StatCard icon={Sparkles} title="AI-Qualified Matches" value="983" subtext="+89 new this week" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Chart Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 font-bold text-lg text-gray-800">
                <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><BarChart2 size={18} /></div>
                Matches by Role
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><MoreHorizontal size={20}/></button>
            </div>
            
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matchData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={-28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  {/* Background bar (Views) */}
                  <Bar dataKey="viewed" fill="#EFF6FF" radius={[4, 4, 0, 0]} barSize={28} />
                  {/* Foreground bar (Applicants) */}
                  <Bar dataKey="matched" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 font-bold text-lg text-gray-800">
                <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><Users size={18} /></div>
                Candidates Database
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                <Filter size={14} /> Filters
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="pb-3 font-medium">Candidate</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Match Score</th>
                    <th className="pb-3 font-medium">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {candidatesDb.map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={c.avatar} className="w-8 h-8 rounded-full" alt={c.name} />
                          <span className="font-semibold text-gray-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-500">{c.role}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${c.scoreColor}`}>
                          <Sparkles size={12} /> {c.score} {c.scoreText}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500">{c.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar content) */}
        <div className="space-y-6">
          
          {/* Upcoming Schedule */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="font-bold text-gray-800">Upcoming Interview Schedule</div>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><MoreHorizontal size={18}/></button>
            </div>
            
            <div className="relative border-l-2 border-gray-100 ml-4 space-y-6 pb-2">
              {schedule.map((item, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 bg-gray-300 rounded-full border-2 border-white ring-4 ring-white"></div>
                  <div className="absolute -left-12 top-0.5 text-xs font-medium text-gray-400">{item.time}</div>
                  <div className={`p-3.5 rounded-xl border ${item.color} flex justify-between items-center`}>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 mb-1">{item.title}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <img src={`https://i.pravatar.cc/150?img=${i+10}`} className="w-4 h-4 rounded-full" />
                        {item.person}
                      </div>
                    </div>
                    <button className="bg-white border border-gray-200 px-3 py-1 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="font-bold text-gray-800">Applicant Sources Breakdown</div>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><MoreHorizontal size={18}/></button>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Talently', percent: 60, width: '60%' },
                { label: 'LinkedIn', percent: 23, width: '23%' },
                { label: 'Indeed', percent: 10, width: '10%' },
                { label: 'Instagram Ads', percent: 4, width: '4%' },
                { label: 'Company Careers Page', percent: 3, width: '3%' },
              ].map((src, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-medium text-gray-600 mb-1.5">
                    <span>{src.label}</span>
                    <span>{src.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: src.width }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demographic Insights */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 pb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-gray-800">Demographic Insights</div>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><MoreHorizontal size={18}/></button>
            </div>
            {/* Interactive Map */}
            <div className="w-full h-48 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 80, center: [0, 20] }}
                style={{ width: "100%", height: "100%" }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#E2E8F0"
                        stroke="#CBD5E1"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#93C5FD", outline: "none" },
                          pressed: { fill: "#3B82F6", outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {/* Optional: Add markers based on candidateDb locations (Singapore, Brazil, US) */}
                <Marker coordinates={[103.8198, 1.3521]}>
                  <circle r={4} fill="#2563EB" stroke="#fff" strokeWidth={1} />
                </Marker>
                <Marker coordinates={[-51.9253, -14.2350]}>
                  <circle r={4} fill="#2563EB" stroke="#fff" strokeWidth={1} />
                </Marker>
                <Marker coordinates={[-95.7129, 37.0902]}>
                  <circle r={4} fill="#2563EB" stroke="#fff" strokeWidth={1} />
                </Marker>
              </ComposableMap>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
