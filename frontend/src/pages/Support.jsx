import React from 'react';
import { MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function Support() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your support requests.</p>
        </div>
        <button onClick={() => alert("Opening ticket creation modal...")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors">
          Create New Ticket
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">Ticket ID</th>
              <th className="px-6 py-4 font-semibold">Subject</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { id: 'TKT-1042', subject: 'API Rate Limits for Matching Endpoint', status: 'Open', date: '2 hours ago', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
              { id: 'TKT-1039', subject: 'Avatar images not loading', status: 'Closed', date: 'Yesterday', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200' },
              { id: 'TKT-1011', subject: 'Billing inquiry for Enterprise Tier', status: 'Closed', date: 'Last week', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200' },
            ].map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-mono text-gray-500">{t.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{t.subject}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${t.color}`}>
                    <t.icon size={12} /> {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
