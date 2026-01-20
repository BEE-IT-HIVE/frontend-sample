
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Article } from '../types';

const ArticlesSection: React.FC = () => {
  const { articles, previewMode, addArticleComment } = useData();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({ name: '', text: '' });

  const filteredArticles = previewMode 
    ? articles 
    : articles.filter(a => a.status === 'published');

  const selectedArticle = selectedArticleId ? articles.find(a => a.id === selectedArticleId) : null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticleId || !commentForm.name || !commentForm.text) return;

    addArticleComment(selectedArticleId, {
      id: `c_${Date.now()}`,
      author: commentForm.name,
      date: new Date().toISOString(),
      content: commentForm.text
    });
    setCommentForm({ name: '', text: '' });
  };

  if (selectedArticle) {
    return (
      <div className="pt-24 md:pt-32 pb-20 max-w-3xl mx-auto px-6 md:px-8 min-h-screen animate-in fade-in slide-in-from-right duration-500">
        <button 
          onClick={() => { setSelectedArticleId(null); window.scrollTo(0, 0); }}
          className="mb-8 text-xs md:text-sm font-bold text-gray-500 hover:text-hive-blue dark:hover:text-white flex items-center transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Articles
        </button>

        <img 
          src={selectedArticle.image} 
          alt={selectedArticle.title} 
          className="w-full h-48 md:h-80 lg:h-96 object-cover rounded-[2rem] shadow-xl mb-8 md:mb-12" 
        />

        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
          {selectedArticle.tags.map(tag => (
            <span key={tag} className="bg-hive-gold/10 text-hive-gold px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">#{tag}</span>
          ))}
          {selectedArticle.status !== 'published' && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">PREVIEW: {selectedArticle.status}</span>
          )}
          <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center ml-auto">
             <i className="fa-regular fa-clock mr-1"></i> {selectedArticle.readTime}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-hive-blue dark:text-white mb-6 leading-tight font-heading break-words">
          {selectedArticle.title}
        </h1>

        <div className="flex items-center gap-4 mb-10 border-b border-gray-100 dark:border-white/10 pb-8">
           <div className="w-10 h-10 md:w-12 md:h-12 bg-hive-blue text-white rounded-full flex items-center justify-center font-bold text-lg md:text-xl">
              {(selectedArticle.author || "?").charAt(0)}
           </div>
           <div>
              <p className="font-bold text-hive-blue dark:text-white text-sm md:text-base">{selectedArticle.author || "Unknown Author"}</p>
              <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">{new Date(selectedArticle.date).toLocaleDateString()}</p>
           </div>
        </div>

        <div 
          className="prose prose-base md:prose-lg lg:prose-xl dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
        />

        {/* Comment Section */}
        <div className="mt-20 border-t border-gray-100 dark:border-white/10 pt-12">
          <h3 className="text-2xl font-bold text-hive-blue dark:text-white mb-8 flex items-center gap-3">
            <i className="fa-solid fa-comments text-hive-gold"></i> Community Discussion
          </h3>

          {/* Comment List */}
          <div className="space-y-8 mb-12">
            {selectedArticle.comments && selectedArticle.comments.length > 0 ? (
              selectedArticle.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold shrink-0">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl rounded-tl-none">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-hive-blue dark:text-white text-sm">{comment.author}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>

          {/* Comment Form */}
          <div className="bg-white dark:bg-[#0b1129] p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-lg">
            <h4 className="font-bold text-lg text-hive-blue dark:text-white mb-6">Join the conversation</h4>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold dark:text-white"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Comment</label>
                <textarea 
                  rows={4}
                  value={commentForm.text}
                  onChange={(e) => setCommentForm({...commentForm, text: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold dark:text-white resize-none"
                  placeholder="Share your insights..."
                  required
                />
              </div>
              <button 
                type="submit" 
                className="bg-hive-blue text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-hive-gold hover:text-hive-blue transition-all shadow-md"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-6 min-h-screen">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-bold text-hive-blue dark:text-white mb-4 font-heading">Hive Insights</h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto px-4">
          Stories, tutorials, and thoughts from the students of Gandaki University.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredArticles.map((article, idx) => (
          <div 
            key={article.id} 
            onClick={() => { setSelectedArticleId(article.id); window.scrollTo(0, 0); }}
            className="group cursor-pointer bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-8"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="h-48 md:h-56 overflow-hidden relative">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 right-4 flex gap-2">
                {article.status !== 'published' && (
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    {article.status}
                  </div>
                )}
                <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-hive-blue uppercase tracking-widest">
                  {article.readTime}
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8">
               <div className="flex gap-2 mb-4">
                  {article.tags.slice(0, 2).map(tag => (
                     <span key={tag} className="text-[10px] font-bold text-hive-gold uppercase tracking-wider">#{tag}</span>
                  ))}
               </div>
               <h3 className="text-xl md:text-2xl font-bold text-hive-blue dark:text-white mb-3 group-hover:text-hive-gold transition-colors leading-tight">
                  {article.title}
               </h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {article.excerpt}
               </p>
               <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-gray-400 uppercase">{new Date(article.date).toLocaleDateString()}</span>
                  <span className="text-hive-blue dark:text-white font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                     Read Article <i className="fa-solid fa-arrow-right ml-2 text-hive-gold"></i>
                  </span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesSection;
