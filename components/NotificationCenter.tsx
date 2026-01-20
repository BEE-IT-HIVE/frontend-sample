
import React from 'react';
import { useData } from '../context/DataContext';
import { Page, Notification } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onPageChange: (page: Page) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, onPageChange }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification, 
    archiveNotification,
    clearAllNotifications
  } = useData();

  const activeNotifications = notifications.filter(n => !n.isArchived);

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-500';
      case 'important': return 'bg-orange-500';
      case 'general': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getTimeLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-0 w-80 md:w-96 bg-white dark:bg-[#0b1129] border border-gray-100 dark:border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.3)] rounded-[2rem] overflow-hidden z-[150] animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
        <div>
          <h3 className="font-bold text-hive-blue dark:text-white flex items-center gap-2">
            Notifications
            {activeNotifications.filter(n => !n.isRead).length > 0 && (
              <span className="bg-hive-gold text-hive-blue text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                {activeNotifications.filter(n => !n.isRead).length} NEW
              </span>
            )}
          </h3>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={markAllNotificationsAsRead}
             title="Mark all as read"
             className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-hive-blue dark:hover:text-white transition-all flex items-center justify-center text-sm"
           >
             <i className="fa-solid fa-check-double"></i>
           </button>
           <button 
             onClick={onClose} 
             className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center text-sm"
           >
             <i className="fa-solid fa-xmark"></i>
           </button>
        </div>
      </div>

      {/* List Area */}
      <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
        {activeNotifications.length > 0 ? (
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {activeNotifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-6 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group relative ${!n.isRead ? 'bg-hive-gold/[0.03] border-l-4 border-hive-gold' : 'border-l-4 border-transparent'}`}
                onClick={() => markNotificationAsRead(n.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${getPriorityColor(n.type)} ${!n.isRead ? 'animate-ping' : ''}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className={`font-bold text-sm leading-tight truncate ${!n.isRead ? 'text-hive-blue dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
                        {n.category}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed mb-3 ${!n.isRead ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                      {n.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-bold">
                        <i className="fa-regular fa-clock mr-1"></i> {getTimeLabel(n.timestamp)}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); archiveNotification(n.id); }}
                          className="text-[10px] text-blue-500 hover:underline font-bold"
                        >
                          Archive
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                          className="text-[10px] text-red-500 hover:underline font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200 dark:text-white/10 text-2xl">
              <i className="fa-solid fa-bell-slash"></i>
            </div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">The Hive is Silent</p>
            <p className="text-xs text-gray-500 mt-2">Check back later for community updates.</p>
          </div>
        )}
      </div>

      {/* Footer Bulk Actions */}
      <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex gap-2">
        <button 
          onClick={clearAllNotifications}
          className="flex-1 bg-white dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 transition-all"
        >
          Clear All
        </button>
        <button 
          onClick={() => onPageChange(Page.Events)}
          className="flex-1 bg-hive-blue dark:bg-hive-gold text-white dark:text-hive-blue py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          Portal Updates
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
