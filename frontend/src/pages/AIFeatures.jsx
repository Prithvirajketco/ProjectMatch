import React, { useState } from 'react';
import { Bot, Sparkles, ShieldAlert, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AIFeatures() {
  const [extractText, setExtractText] = useState('I have been a UI/UX designer for 5 years, mainly using Figma and Adobe XD. I know a bit of HTML/CSS but not enough to code a full app. Available on weekends.');
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(null);

  const handleExtract = () => {
    setExtracting(true);
    setTimeout(() => {
      setExtracted({
        skills: [
          { name: 'UI/UX Design', conf: 'high' },
          { name: 'Figma', conf: 'high' },
          { name: 'Adobe XD', conf: 'high' },
          { name: 'HTML/CSS', conf: 'low' },
        ],
        availability: 'Weekends only'
      });
      setExtracting(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Features Playground</h1>
        <p className="text-gray-500 text-sm mt-1">Test and configure the 3-Layer Prompt Pipeline powering ProjectMatch.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Cpu size={64}/></div>
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <span className="font-bold text-xl">L1</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Profile Extraction</h3>
          <p className="text-sm text-gray-500 mb-4">Converts messy, unstructured human text into standardized, normalized JSON profiles with confidence scoring.</p>
          <div className="flex items-center text-blue-600 text-sm font-semibold">Active <CheckCircle2 size={16} className="ml-1"/></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Bot size={64}/></div>
          <div className="bg-gray-100 text-gray-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            <span className="font-bold text-xl">L2</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Constraint-Aware Match</h3>
          <p className="text-sm text-gray-500 mb-4">Evaluates candidate pool against project requirements using explicit Chain-of-Thought reasoning to build teams.</p>
          <div className="flex items-center text-blue-600 text-sm font-semibold">Active <CheckCircle2 size={16} className="ml-1"/></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldAlert size={64}/></div>
          <div className="bg-gray-100 text-gray-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            <span className="font-bold text-xl">L3</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Automated Critique</h3>
          <p className="text-sm text-gray-500 mb-4">An independent LLM pass that acts as a red-teamer, checking the proposed team for single points of failure.</p>
          <div className="flex items-center text-blue-600 text-sm font-semibold">Active <CheckCircle2 size={16} className="ml-1"/></div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Sparkles className="text-blue-600"/> Test Layer 1 Extractor</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Raw Human Input (Messy Text)</label>
            <textarea 
              className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              value={extractText}
              onChange={(e) => setExtractText(e.target.value)}
            ></textarea>
            <button 
              onClick={handleExtract}
              disabled={extracting}
              className="mt-4 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
            >
              {extracting ? 'Processing...' : 'Run Extraction'} <ArrowRight size={18}/>
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col h-full min-h-[250px]">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Structured Output (JSON-like)</label>
            {extracted ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Extracted Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {extracted.skills.map(s => (
                      <div key={s.name} className={`px-2 py-1 rounded border text-xs font-medium flex gap-2 ${s.conf === 'high' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                        <span>{s.name}</span>
                        <span className="opacity-60 uppercase text-[10px]">{s.conf}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Availability</div>
                  <div className="text-sm font-medium text-gray-800">{extracted.availability}</div>
                </div>
              </div>
            ) : (
              <div className="m-auto text-gray-400 text-sm flex flex-col items-center gap-2">
                <Bot size={32} className="opacity-50"/>
                <span>Waiting for input...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Layer 2 Tester */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Bot className="text-blue-600"/> Test Layer 2 Matcher</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Requirements</label>
            <textarea 
              className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              defaultValue={`Need 3 developers to build a healthcare React web app. Required skills: React, TypeScript, Node.js.\nCandidates Pool: [5 available]`}
            ></textarea>
            <button 
              onClick={() => {
                // Mock L2 execution
                const btn = document.getElementById('l2-btn');
                btn.innerText = 'Processing...';
                btn.disabled = true;
                setTimeout(() => {
                  document.getElementById('l2-output').classList.remove('hidden');
                  document.getElementById('l2-placeholder').classList.add('hidden');
                  btn.innerText = 'Run Layer 2 Match';
                  btn.disabled = false;
                }, 1500);
              }}
              id="l2-btn"
              className="mt-4 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
            >
              Run Layer 2 Match <ArrowRight size={18}/>
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col h-full min-h-[250px]">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Proposed Team Output</label>
            
            <div id="l2-output" className="hidden space-y-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                 <div className="font-bold text-sm">Dev A (Frontend)</div>
                 <div className="text-xs text-gray-600 mt-1">Reason: Best React expertise in the pool (high confidence).</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                 <div className="font-bold text-sm">Dev B (Backend)</div>
                 <div className="text-xs text-gray-600 mt-1">Reason: Covers Node.js dependency with 30hrs availability.</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                 <div className="font-bold text-sm">Dev C (Domain)</div>
                 <div className="text-xs text-gray-600 mt-1">Reason: Only candidate with Healthcare Domain interest.</div>
              </div>
              <div className="text-xs text-red-500 font-semibold mt-2">Coverage Gap: TypeScript</div>
            </div>

            <div id="l2-placeholder" className="m-auto text-gray-400 text-sm flex flex-col items-center gap-2">
              <Bot size={32} className="opacity-50"/>
              <span>Waiting for input...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3 Tester */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ShieldAlert className="text-red-600"/> Test Layer 3 Critique</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Proposed Team (From L2)</label>
            <div className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm overflow-auto">
              <pre className="text-xs text-gray-600 font-mono">
{JSON.stringify({
  team: [
    { name: "Dev A", role: "Frontend" },
    { name: "Dev B", role: "Backend" },
    { name: "Dev C", role: "Domain" }
  ],
  coverage_gap: ["TypeScript"]
}, null, 2)}
              </pre>
            </div>
            <button 
              onClick={() => {
                // Mock L3 execution
                const btn = document.getElementById('l3-btn');
                btn.innerText = 'Critiquing...';
                btn.disabled = true;
                setTimeout(() => {
                  document.getElementById('l3-output').classList.remove('hidden');
                  document.getElementById('l3-placeholder').classList.add('hidden');
                  btn.innerText = 'Run Layer 3 Critique';
                  btn.disabled = false;
                }, 1200);
              }}
              id="l3-btn"
              className="mt-4 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
            >
              Run Layer 3 Critique <ArrowRight size={18}/>
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col h-full min-h-[250px]">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Independent Validation Output</label>
            
            <div id="l3-output" className="hidden space-y-4">
               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-bold">
                  Status: REVISE
               </div>
               <div className="text-sm">
                 <span className="font-bold">Flagged Issue: </span> Missing Critical Skill Coverage
               </div>
               <div className="text-sm">
                 <span className="font-bold">Feedback provided back to L2: </span> 
                 "The proposed team is missing coverage for 'TypeScript'. Please revise the team composition by replacing a member to satisfy this requirement without dropping React or Node.js."
               </div>
            </div>

            <div id="l3-placeholder" className="m-auto text-gray-400 text-sm flex flex-col items-center gap-2">
              <ShieldAlert size={32} className="opacity-50"/>
              <span>Waiting for proposed team...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
