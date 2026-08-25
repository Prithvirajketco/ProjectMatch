import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { runMatch } from '../api';
import { Loader2, CheckCircle2, AlertTriangle, PlayCircle, ArrowLeft, Bot, Zap, XCircle } from 'lucide-react';

export default function Matching() {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await runMatch(projectId);
      setResult(res.data);
    } catch (err) {
      console.error("API call failed:", err);
      const detail = err.response?.data?.detail || err.message || "Could not reach the backend. Is the server running?";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/projects" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Team Assembly</h1>
          <p className="text-gray-500 text-sm mt-0.5">Pipeline vs. Naive Baseline Comparison</p>
        </div>
        <div className="ml-auto">
          {!result && !loading && (
            <button 
              onClick={handleMatch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors"
            >
              <PlayCircle size={20} /> Run AI Pipeline
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="animate-spin text-blue-600 relative z-10" size={56} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-8">AI is Reasoning...</h2>
          <div className="flex items-center gap-4 mt-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"><Bot size={16}/> Layer 2: Matching</span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"><Zap size={16}/> Layer 3: Critiquing</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
          <div className="bg-red-50 p-4 rounded-full mb-6">
            <XCircle className="text-red-500" size={48} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Pipeline Error</h2>
          <p className="text-gray-500 max-w-md text-center mb-6">{error}</p>
          <button
            onClick={handleMatch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <PlayCircle size={20} /> Retry
          </button>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Naive Output */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Naive Baseline
                </h2>
                <p className="text-sm text-gray-500 mt-1">Keyword-overlap matcher — no AI reasoning</p>
              </div>
              <div className="text-xs font-mono bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-500">
                {result.layer_timings.naive}ms
              </div>
            </div>
            <div className="p-6 flex-1 space-y-4 bg-gray-50/50">
              {result.naive_team?.team?.map(member => (
                <div key={member.candidate_id} className="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={member.avatar || `https://i.pravatar.cc/150?u=${member.candidate_name}`} className="w-10 h-10 rounded-full" alt="" />
                    <div>
                      <h3 className="font-bold text-gray-900">{member.candidate_name}</h3>
                      <p className="text-sm font-medium text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                    "{member.reason || "No reasoning provided."}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Output */}
          <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-md overflow-hidden flex flex-col relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm z-10">
              WINNER
            </div>
            <div className="bg-blue-50/50 p-6 border-b border-blue-100 flex justify-between items-center relative">
              <div>
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" />
                  Layered AI Pipeline
                </h2>
                <p className="text-sm text-blue-700/70 mt-1">Structured matching + Layer 3 Critique</p>
              </div>
              <div className="text-xs font-mono bg-white border border-blue-200 px-2 py-1 rounded-md text-blue-600 mr-20">
                {result.layer_timings.pipeline}ms
              </div>
            </div>
            
            <div className="p-6 flex-1 bg-white space-y-6">
              {/* Critique History */}
              {result.critique_history.length > 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
                    <AlertTriangle size={18} />
                    Layer 3 Revision Triggered
                  </h4>
                  <div className="space-y-3">
                    {result.critique_history.slice(0, -1).map((critique, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-amber-100 text-sm">
                        <strong className="text-amber-900">Flagged:</strong> <span className="text-amber-800">{critique.flagged_issue}</span>
                        <p className="text-gray-600 mt-1">{critique.revision_note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Members */}
              <div className="space-y-4">
                {result.pipeline_team?.team?.map(member => (
                  <div key={member.candidate_id} className="bg-white p-5 border border-blue-100 rounded-2xl shadow-sm hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={member.avatar || `https://i.pravatar.cc/150?u=${member.candidate_name}`} className="w-10 h-10 rounded-full" alt="" />
                      <div>
                        <h3 className="font-bold text-gray-900">{member.candidate_name}</h3>
                        <p className="text-sm font-medium text-blue-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <strong className="text-blue-900">Reasoning:</strong> {member.reason}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coverage Check */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Coverage Verified</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(result.pipeline_team?.coverage_check || {}).map(([skill, status]) => (
                    <span key={skill} className={`px-3 py-1.5 text-xs rounded-lg font-bold border flex items-center gap-1.5
                      ${status === 'covered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {status === 'covered' && <CheckCircle2 size={12}/>}
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
