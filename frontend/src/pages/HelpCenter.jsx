import React, { useState } from 'react';
import { Search, BookOpen, Video, FileText, ChevronRight, ChevronDown } from 'lucide-react';

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How does the Layer 3 Critique work?', a: 'Layer 3 acts as an independent "red-teamer" LLM. It reviews the candidate team proposed by Layer 2 and specifically looks for missing constraints or single points of failure, sending feedback back if a revision is needed.' },
    { q: 'Can I manually override an AI-recommended team?', a: 'Yes! The AI pipeline provides recommendations, but you can always manually remove or add candidates to the final team from the Pipeline dashboard.' },
    { q: 'What happens if a candidate profile is completely empty?', a: 'Layer 1 will flag the profile with an "Empty Data" confidence score. You will see an alert in the Candidates table indicating missing data.' },
    { q: 'How do I integrate custom skills taxonomies?', a: 'You can map your own skill taxonomies in the Settings -> Integrations panel. ProjectMatch will instruct the Layer 1 extractor to conform to your taxonomy.' }
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-blue-600 rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <h1 className="text-3xl font-bold text-white relative z-10 mb-4">How can we help you?</h1>
        <div className="relative z-10 max-w-xl mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search articles, tutorials, FAQs..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-sm focus:outline-none shadow-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: BookOpen, title: 'Getting Started', desc: 'Learn the basics of ProjectMatch.' },
          { icon: Video, title: 'Video Tutorials', desc: 'Step-by-step video guides.' },
          { icon: FileText, title: 'API Documentation', desc: 'Integrate our AI matching engine.' }
        ].map((item, i) => (
          <div key={i} onClick={() => alert(`Opening ${item.title}...`)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 cursor-pointer transition-colors group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <item.icon size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors overflow-hidden"
            >
              <div className="flex items-center justify-between p-4">
                <span className="font-medium text-gray-800">{faq.q}</span>
                {openFaq === i ? <ChevronDown size={18} className="text-blue-500" /> : <ChevronRight size={18} className="text-gray-400" />}
              </div>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
