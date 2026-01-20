
import React, { useState } from 'react';
import { HiveEvent, FeedbackSubmission } from '../types';
import { sanitize } from '../utils';

interface EventFeedbackProps {
  event: HiveEvent;
  onClose: () => void;
}

const EventFeedback: React.FC<EventFeedbackProps> = ({ event, onClose }) => {
  const [view, setView] = useState<'form' | 'dashboard'>('form');
  const [formData, setFormData] = useState<FeedbackSubmission>({
    eventId: event.id,
    rating: 0,
    relevance: 0,
    comments: '',
    anonymous: true
  });
  const [submitted, setSubmitted] = useState(false);

  // Mock aggregated data for dashboard
  const stats = {
     avgRating: 4.2,
     avgRelevance: 4.5,
     totalResponses: 45,
     sentiment: 'Positive'
  };

  const StarRating = ({ value, onChange, label }: { value: number, onChange?: (n: number) => void, label: string }) => (
     <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
        <div className="flex gap-2">
           {[1,2,3,4,5].map(n => (
              <button 
                key={n}
                onClick={() => onChange && onChange(n)}
                disabled={!onChange}
                className={`text-2xl transition-transform ${onChange ? 'hover:scale-110' : ''} ${n <= value ? 'text-hive-gold' : 'text-gray-300 dark:text-gray-700'}`}
              >
                 <i className="fa-solid fa-star"></i>
              </button>
           ))}
        </div>
     </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setTimeout(() => setSubmitted(true), 1000);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData({...formData, comments: sanitize(e.target.value)});
  };

  if (view === 'dashboard') {
     return (
        <div className="fixed inset-0 z-[100] bg-hive-blue/95 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white dark:bg-[#0b1129] max-w-4xl w-full rounded-[2rem] p-8 shadow-2xl relative">
              <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-hive-blue"><i className="fa-solid fa-xmark text-xl"></i></button>
              
              <div className="flex justify-between items-end mb-8">
                 <div>
                    <h2 className="text-3xl font-bold text-hive-blue dark:text-white mb-1">Feedback Dashboard</h2>
                    <p className="text-gray-500">{event.title}</p>
                 </div>
                 <button onClick={() => setView('form')} className="text-sm font-bold text-hive-gold hover:underline">Switch to User View</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl text-center">
                    <p className="text-4xl font-bold text-hive-blue dark:text-white mb-2">{stats.avgRating}</p>
                    <StarRating value={Math.round(stats.avgRating)} label="Avg Satisfaction" />
                 </div>
                 <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl text-center flex flex-col justify-center">
                    <p className="text-4xl font-bold text-hive-blue dark:text-white mb-2">{stats.totalResponses}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Responses</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl text-center flex flex-col justify-center">
                    <p className="text-4xl font-bold text-green-500 mb-2">{stats.sentiment}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">AI Sentiment Analysis</p>
                 </div>
              </div>

              <div className="bg-hive-blue/5 dark:bg-white/5 p-6 rounded-2xl">
                 <h3 className="font-bold text-hive-blue dark:text-white mb-4">Recent Comments</h3>
                 <div className="space-y-4">
                    <div className="bg-white dark:bg-hive-blue p-4 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
                       <p className="text-sm text-gray-600 dark:text-gray-300">"The hands-on session was incredibly useful for my final year project. Would love more time on Azure functions next time."</p>
                       <p className="text-xs text-gray-400 mt-2 font-bold uppercase">- Anonymous Student</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-hive-blue/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0b1129] max-w-lg w-full rounded-[2rem] shadow-2xl overflow-hidden p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-hive-blue"><i className="fa-solid fa-xmark text-xl"></i></button>

        {submitted ? (
           <div className="text-center py-12 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <i className="fa-solid fa-check text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-hive-blue dark:text-white mb-2">Thank You!</h2>
              <p className="text-gray-500 mb-8">Your feedback helps us make the Hive better.</p>
              <button onClick={onClose} className="px-8 py-3 bg-hive-blue text-white rounded-xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-colors">Close</button>
              <div className="mt-8 pt-8 border-t border-gray-100">
                 <button onClick={() => setView('dashboard')} className="text-xs font-bold text-gray-400 hover:text-hive-blue uppercase tracking-widest">Admin: View Dashboard</button>
              </div>
           </div>
        ) : (
           <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-8 duration-300">
              <span className="text-hive-gold font-bold tracking-widest uppercase text-xs mb-2 block">Post-Event Survey</span>
              <h2 className="text-2xl font-bold text-hive-blue dark:text-white mb-6">How was {event.title}?</h2>
              
              <StarRating 
                 value={formData.rating} 
                 onChange={(n) => setFormData({...formData, rating: n})} 
                 label="Overall Experience" 
              />

              <StarRating 
                 value={formData.relevance} 
                 onChange={(n) => setFormData({...formData, relevance: n})} 
                 label="Relevance to Coursework" 
              />

              <div className="mb-6">
                 <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Comments & Suggestions</label>
                 <textarea 
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold"
                    placeholder="What did you learn? What can we improve?"
                    value={formData.comments}
                    onChange={handleCommentChange}
                 />
              </div>

              <div className="flex items-center justify-between mb-8">
                 <label className="flex items-center cursor-pointer">
                    <input 
                       type="checkbox" 
                       checked={formData.anonymous}
                       onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
                       className="w-4 h-4 text-hive-gold rounded focus:ring-hive-gold"
                    />
                    <span className="ml-2 text-sm text-gray-500 font-medium">Submit Anonymously</span>
                 </label>
              </div>

              <button 
                 type="submit" 
                 disabled={formData.rating === 0}
                 className="w-full py-4 bg-hive-blue text-white rounded-xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                 Submit Feedback
              </button>
           </form>
        )}
      </div>
    </div>
  );
};

export default EventFeedback;
