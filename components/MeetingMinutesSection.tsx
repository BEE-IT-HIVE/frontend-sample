import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { MeetingMinute } from '../types';

const MotionDiv = motion.div as any;

const MeetingMinutesSection: React.FC = () => {
  const { meetingMinutes, previewMode } = useData();
  const [selectedMinute, setSelectedMinute] = useState<MeetingMinute | null>(null);

  const filteredMinutes = previewMode 
    ? meetingMinutes 
    : meetingMinutes.filter(m => m.status === 'published');

  const sortedMinutes = [...filteredMinutes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h1 className="text-6xl md:text-7xl font-black text-hive-blue dark:text-white mb-6 font-heading tracking-tight">
          Meeting Minute Log
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
          Official records of committee decisions, strategic planning, and ecosystem governance.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-32 bg-hive-gold rounded-full shadow-lg shadow-hive-gold/30"></div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Timeline Sidebar */}
        <div className="lg:col-span-5">
          <div className="space-y-6">
            {sortedMinutes.map((minute, idx) => (
              <MotionDiv
                key={minute.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                onClick={() => {
                  setSelectedMinute(minute);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 group overflow-hidden ${
                  selectedMinute?.id === minute.id
                    ? 'bg-hive-blue text-white border-hive-gold shadow-2xl shadow-hive-gold/30 scale-105'
                    : 'bg-white/80 dark:bg-[#0b1129]/60 backdrop-blur-sm border-gray-200 dark:border-white/10 hover:border-hive-gold hover:shadow-2xl hover:shadow-hive-gold/20'
                }`}
              >
                {/* Glow effect on selected */}
                {selectedMinute?.id === minute.id && (
                  <div className="absolute inset-0 bg-hive-gold/20 blur-xl -z-10 animate-pulse"></div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-black uppercase tracking-widest ${
                    selectedMinute?.id === minute.id ? 'text-hive-gold' : 'text-gray-400'
                  }`}>
                    {new Date(minute.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {minute.status !== 'published' && (
                    <span className="bg-orange-500/20 text-orange-400 border border-orange-500/50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                </div>

                <h3 className={`text-2xl font-black font-heading leading-tight mb-6 ${
                  selectedMinute?.id === minute.id ? 'text-white' : 'text-hive-blue dark:text-white group-hover:text-hive-gold transition-colors'
                }`}>
                  {minute.title}
                </h3>

                <div className="flex flex-wrap gap-6 text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid fa-users text-lg ${selectedMinute?.id === minute.id ? 'text-hive-gold' : 'text-hive-gold/70'}`}></i>
                    <span>{minute.attendees.length} Attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid fa-gavel text-lg ${selectedMinute?.id === minute.id ? 'text-hive-gold' : 'text-hive-gold/70'}`}></i>
                    <span>{minute.decisions.length} Decisions</span>
                  </div>
                </div>

                {/* Hover arrow */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  className="absolute bottom-6 right-6 text-3xl"
                >
                  <i className="fa-solid fa-arrow-right text-hive-gold"></i>
                </motion.div>
              </MotionDiv>
            ))}

            {sortedMinutes.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 border-4 border-dashed border-gray-200 dark:border-white/10 rounded-3xl"
              >
                <i className="fa-solid fa-file-lines text-6xl text-gray-300 dark:text-gray-700 mb-6"></i>
                <p className="text-xl font-bold text-gray-400">No public records available yet.</p>
                <p className="text-sm text-gray-500 mt-2">Check back soon for updates.</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Detailed View Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedMinute ? (
              <MotionDiv
                key={selectedMinute.id}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/90 dark:bg-[#0b1129]/90 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden relative"
              >
                {/* Golden accent glow */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-hive-gold via-yellow-400 to-hive-gold"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-hive-gold/10 rounded-full blur-3xl -z-10"></div>

                <div className="p-10 md:p-16">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-green-200 dark:border-green-800 shadow-lg">
                        <i className="fa-solid fa-shield-check"></i> Verified Official Record
                      </span>
                      <h2 className="text-4xl md:text-5xl font-black text-hive-blue dark:text-white mt-8 mb-4 leading-tight font-heading">
                        {selectedMinute.title}
                      </h2>
                      <p className="text-lg text-gray-500 dark:text-gray-400 font-bold">
                        {new Date(selectedMinute.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedMinute(null)}
                      className="lg:hidden text-3xl text-gray-400 hover:text-hive-gold transition-colors"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>

                  <div className="space-y-16">
                    {/* Attendees */}
                    <div>
                      <h3 className="text-lg font-black text-hive-blue dark:text-hive-gold uppercase tracking-widest mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-users text-2xl"></i> Roll Call ({selectedMinute.attendees.length})
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedMinute.attendees.map((person, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-gradient-to-r from-hive-gold/20 to-yellow-400/20 px-5 py-3 rounded-2xl text-sm font-bold text-hive-blue dark:text-white border border-hive-gold/30 shadow-md"
                          >
                            {person}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Agenda */}
                    <div>
                      <h3 className="text-lg font-black text-hive-blue dark:text-hive-gold uppercase tracking-widest mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-list-ul text-2xl"></i> Agenda
                      </h3>
                      <div className="space-y-4">
                        {selectedMinute.agenda.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-5 p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10"
                          >
                            <span className="text-2xl font-black text-hive-gold w-10">{(i + 1).toString().padStart(2, '0')}.</span>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="bg-gradient-to-br from-hive-blue/5 to-hive-gold/5 p-10 rounded-3xl border-2 border-hive-gold/30 shadow-xl">
                      <h3 className="text-xl font-black text-hive-blue dark:text-hive-gold uppercase tracking-widest mb-8 flex items-center gap-4">
                        <i className="fa-solid fa-gavel text-3xl"></i> Key Decisions Taken
                      </h3>
                      <div className="space-y-5">
                        {selectedMinute.decisions.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-4"
                          >
                            <i className="fa-solid fa-circle-check text-2xl text-green-500 mt-1"></i>
                            <p className="text-lg font-bold text-hive-blue dark:text-white leading-relaxed">{item}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Items */}
                    {selectedMinute.actionItems.length > 0 && (
                      <div>
                        <h3 className="text-lg font-black text-hive-blue dark:text-hive-gold uppercase tracking-widest mb-6 flex items-center gap-3">
                          <i className="fa-solid fa-tasks text-2xl"></i> Action Items Assigned
                        </h3>
                        <div className="space-y-4">
                          {selectedMinute.actionItems.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="flex items-center gap-5 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg"
                            >
                              <div className="w-10 h-10 rounded-full bg-hive-gold/20 flex items-center justify-center text-hive-gold text-xl">
                                <i className="fa-solid fa-hourglass-half"></i>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 font-medium">{item}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </MotionDiv>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:flex flex-col items-center justify-center h-full min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 rounded-[3.5rem] border-2 border-dashed border-gray-300 dark:border-white/20"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <i className="fa-solid fa-file-contract text-8xl text-gray-300 dark:text-gray-700 mb-8"></i>
                </motion.div>
                <p className="text-2xl font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Select a Record to View Details
                </p>
                <p className="text-gray-400 mt-4 max-w-md text-center">
                  Click on any meeting entry from the timeline to explore the full official record.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MeetingMinutesSection;