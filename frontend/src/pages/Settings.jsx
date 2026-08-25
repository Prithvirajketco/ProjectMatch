import React, { useState } from 'react';
import { User, Bell, Lock, Key, Globe, Shield } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { icon: User, label: 'Profile' },
    { icon: Bell, label: 'Notifications' },
    { icon: Lock, label: 'Security' },
    { icon: Key, label: 'API Keys' },
    { icon: Globe, label: 'Integrations' },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and platform preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex min-h-[500px]">
        <div className="w-64 border-r border-gray-100 p-4 space-y-1 bg-gray-50/50">
          {tabs.map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === item.label ? 'bg-white border border-gray-200 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100/50'}`}
            >
              <item.icon size={18} className={activeTab === item.label ? 'text-blue-600' : 'text-gray-400'} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-8">
          {activeTab === 'Profile' && (
            <>
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <img src="https://i.pravatar.cc/150?img=11" className="w-20 h-20 rounded-full border border-gray-200" alt="Avatar" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Prithviraj. K</h2>
                  <p className="text-sm text-gray-500 mb-3">ananda@fastsrm.edu</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">Change Avatar</button>
                    <button className="px-4 py-1.5 bg-white border border-gray-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50">Remove</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input type="text" defaultValue="Ananda" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input type="text" defaultValue="Faris" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input type="email" defaultValue="ananda@fastsrm.edu" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role / Title</label>
                  <input type="text" defaultValue="Platform Admin" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button onClick={() => alert("Profile updated successfully")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'Profile' && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Shield size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">{activeTab} Settings</h3>
              <p>Configure your {activeTab.toLowerCase()} preferences here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
