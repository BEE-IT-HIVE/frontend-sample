
import React from 'react';
import { motion } from 'framer-motion';
import { Page } from '../types';

// Fix framer-motion type mismatch by using 'any' for motion components
const MotionDiv = motion.div as any;

interface SitemapSectionProps {
  onNavigate: (page: Page) => void;
}

const SitemapSection: React.FC<SitemapSectionProps> = ({ onNavigate }) => {
  const mapData = [
    {
      group: "Core Experience",
      items: [
        { label: "Home Base", id: Page.Home, icon: "fa-house" },
        { label: "About Hive", id: Page.About, icon: "fa-address-card" },
        { label: "Our Leadership", id: Page.Team, icon: "fa-users-gear" },
      ]
    },
    {
      group: "Activities & Data",
      items: [
        { label: "Events Hub", id: Page.Events, icon: "fa-calendar-star" },
        { label: "Media Gallery", id: Page.Gallery, icon: "fa-images" },
        { label: "Hive Blog", id: Page.Articles, icon: "fa-file-signature" },
        { label: "Meeting Minutes", id: Page.Minutes, icon: "fa-clipboard-list" },
      ]
    },
    {
      group: "Operations & Support",
      items: [
        { label: "Sync (Contact)", id: Page.Contact, icon: "fa-paper-plane" },
        { label: "Training Docs", id: Page.Training, icon: "fa-graduation-cap" },
        { label: "Admin Access", id: Page.Admin, icon: "fa-vault" },
      ]
    },
    {
      group: "Legal Protocols",
      items: [
        { label: "Privacy Protocol", id: Page.Privacy, icon: "fa-shield-halved" },
        { label: "Terms of Engagement", id: Page.Terms, icon: "fa-scale-balanced" },
        { label: "Sitemap", id: Page.Sitemap, icon: "fa-sitemap" },
      ]
    }
  ];

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 min-h-screen">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4">
        <h1 className="text-5xl font-bold text-hive-blue dark:text-white mb-4 font-heading tracking-tight">Portal Index</h1>
        <p className="text-gray-500 dark:text-gray-400">Navigational architecture of the BEE-IT HIVE digital ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {mapData.map((group, idx) => (
          <MotionDiv 
            key={group.group}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-hive-gold font-bold uppercase tracking-[0.2em] text-xs px-4 border-l-2 border-hive-gold ml-2">{group.group}</h2>
            <div className="space-y-3">
              {group.items.map(item => (
                <button 
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="w-full group bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 hover:border-hive-gold transition-all text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-hive-gold group-hover:text-hive-blue transition-colors">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <span className="font-bold text-hive-blue dark:text-white text-sm">{item.label}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 group-hover:text-hive-gold transition-colors"></i>
                </button>
              ))}
            </div>
          </MotionDiv>
        ))}
      </div>

      <div className="mt-20 p-12 bg-hive-blue rounded-[3rem] text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-hive-gold/10 blur-[80px] rounded-full"></div>
        <h3 className="text-2xl font-bold mb-4 relative z-10">Can't find what you're looking for?</h3>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">Use the Hive Assistant in the bottom left corner for real-time natural language navigation through the portal.</p>
        <button 
           onClick={() => onNavigate(Page.Contact)}
           className="bg-hive-gold text-hive-blue px-10 py-4 rounded-2xl font-bold hover:bg-white transition-all relative z-10"
        >
           Sync with Secretariat
        </button>
      </div>
    </div>
  );
};

export default SitemapSection;
