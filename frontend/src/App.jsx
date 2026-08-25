import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  GitMerge, 
  Sparkles, 
  BarChart2, 
  Settings as SettingsIcon, 
  HelpCircle, 
  Headset,
  Search,
  Bell,
  Mail,
  ChevronDown,
  Hexagon,
  LogOut
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Candidates from './pages/Candidates';
import Matching from './pages/Matching';
import Pipeline from './pages/Pipeline';
import AIFeatures from './pages/AIFeatures';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import Support from './pages/Support';

const Sidebar = () => {
  const location = useLocation();
  const [orgOpen, setOrgOpen] = useState(false);
  
  const generalLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/candidates', label: 'Candidates', icon: Users },
    { path: '/pipeline', label: 'Pipeline', icon: GitMerge },
    { path: '/ai-features', label: 'AI Features', icon: Sparkles },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const helpLinks = [
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
    { path: '/help', label: 'Help Center', icon: HelpCircle },
    { path: '/support', label: 'Support', icon: Headset },
  ];

  const renderLinks = (links) => (
    <ul className="space-y-1">
      {links.map((item) => {
        const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        const Icon = item.icon;
        return (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                active 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} className={active ? 'text-blue-600' : 'text-gray-400'} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Hexagon size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-gray-900">ProjectMatch</span>
        </div>
        
        <div className="relative">
          <div 
            onClick={() => setOrgOpen(!orgOpen)}
            className="border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-sm mb-6 cursor-pointer hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <GitMerge size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 leading-tight">FAST SRM</div>
                <div className="text-xs text-gray-500">3 active projects</div>
              </div>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${orgOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {orgOpen && (
            <div className="absolute top-[68px] left-0 w-full bg-white border border-gray-200 shadow-lg rounded-xl z-50 p-2">
              <div className="text-xs font-semibold text-gray-400 px-3 py-1">Switch Organization</div>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Acme Corp</button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Stark Industries</button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium">+ Create New</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">General</div>
          {renderLinks(generalLinks)}
        </div>
        
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Help Center</div>
          {renderLinks(helpLinks)}
        </div>
      </div>
    </aside>
  );
};

function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-gray-800">
        <Sidebar />
        
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-[76px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            
            <div className="flex items-center gap-6 relative">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-80 pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
                <div className="absolute right-3 border border-gray-200 bg-white px-1.5 py-0.5 rounded text-xs text-gray-400 font-medium shadow-sm">
                  ⌘K
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-50">
                      <h4 className="font-bold text-sm mb-3">Notifications</h4>
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mb-2">Alex Chen applied to AI Dashboard</div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">New AI match for Healthcare App</div>
                    </div>
                  )}
                </div>
                
                <button onClick={() => alert("Opening messages...")} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                  <Mail size={20} />
                </button>
              </div>
              
              <div className="h-8 w-px bg-gray-200"></div>
              
              <div className="relative">
                <div onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded-xl transition-colors">
                  <img 
                    src="https://i.pravatar.cc/150?img=11" 
                    alt="User" 
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">Ananda Faris</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </div>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 shadow-xl rounded-xl p-2 z-50">
                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      <SettingsIcon size={16}/> Settings
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      <LogOut size={16}/> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-[1400px] mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/match/:projectId" element={<Matching />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/ai-features" element={<AIFeatures />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/support" element={<Support />} />
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-6 text-gray-400">
                      <Sparkles size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
                    <p className="text-gray-500 max-w-md">This URL doesn't match any route.</p>
                  </div>
                } />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
