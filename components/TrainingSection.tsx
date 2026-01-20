
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { TrainingDoc } from '../types';

const TrainingSection: React.FC = () => {
  const { trainingDocs, previewMode } = useData();
  const [selectedDoc, setSelectedDoc] = useState<TrainingDoc | null>(null);

  const filteredDocs = previewMode 
    ? trainingDocs 
    : trainingDocs.filter(d => d.status === 'published');

  if (selectedDoc) {
    return (
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 min-h-screen animate-in fade-in slide-in-from-right duration-500">
        <button 
          onClick={() => { setSelectedDoc(null); window.scrollTo(0, 0); }}
          className="mb-8 text-sm font-bold text-gray-500 hover:text-hive-blue dark:hover:text-white flex items-center transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Documentation
        </button>

        <div className="mb-10">
          <span className="bg-hive-gold/10 text-hive-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
            {selectedDoc.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-hive-blue dark:text-white mb-4 leading-tight font-heading">
            {selectedDoc.title}
          </h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
            <i className="fa-solid fa-clock-rotate-left mr-1"></i> Last Updated: {new Date(selectedDoc.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-sm prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
           {selectedDoc.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 min-h-screen">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl font-bold text-hive-blue dark:text-white mb-4 font-heading">Training & Governance</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Official committee training materials and documentation for BEE-IT HIVE operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(['onboarding', 'technical', 'governance'] as const).map(cat => (
          <div key={cat} className="space-y-6">
            <h2 className="text-xl font-bold text-hive-blue dark:text-white capitalize border-l-4 border-hive-gold pl-4 ml-4">
              {cat}
            </h2>
            <div className="space-y-4">
              {filteredDocs.filter(d => d.category === cat).map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => { setSelectedDoc(doc); window.scrollTo(0, 0); }}
                  className="bg-white dark:bg-white/5 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 hover:border-hive-gold transition-all cursor-pointer group"
                >
                  <h3 className="font-bold text-hive-blue dark:text-white group-hover:text-hive-gold transition-colors">{doc.title}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Updated {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                    <i className="fa-solid fa-arrow-right text-hive-gold opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingSection;
