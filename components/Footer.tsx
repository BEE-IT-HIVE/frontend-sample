
import React from 'react';
import { motion } from 'framer-motion';
import { Page } from '../types';
import { LOGO_URL } from '../constants';

interface FooterProps {
  onPageChange: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    window.alert('Transmission Successful: You are now synced with Hive notifications.');
  };

  return (
    <footer className="bg-white dark:bg-[#030A37] border-t border-gray-100 dark:border-white/10 pt-24 pb-12 relative overflow-hidden transition-colors duration-500">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-hive-gold/30 rounded-full blur-[120px] hidden dark:block"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] hidden dark:block"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-24">
          {/* Column 1: Connect */}
          <div>
            <h3 className="text-hive-blue dark:text-white text-lg font-bold mb-8 pl-4 border-l-4 border-hive-gold">
              Connect With Us:
            </h3>
            <div className="flex flex-col gap-5">
              {[
                { label: 'Facebook', url: 'https://facebook.com/beeit.hive', icon: 'fa-facebook' },
                { label: 'Instagram', url: 'https://instagram.com/beeit.hive', icon: 'fa-instagram' },
                { label: 'GitHub', url: 'https://github.com/beeit-hive', icon: 'fa-github' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest font-bold hover:text-hive-gold transition-colors"
                >
                  <span className="w-0 h-px bg-hive-gold transition-all duration-300 group-hover:w-4"></span>
                  <i className={`fa-brands ${item.icon}`}></i>
                  {item.label}
                </a>
              ))}
              
              <a
                href="mailto:bee-it.hive@gandakiuniversity.edu.np"
                className="group flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest font-bold hover:text-hive-gold transition-colors"
              >
                <span className="w-0 h-px bg-hive-gold transition-all duration-300 group-hover:w-4"></span>
                <i className="fa-solid fa-envelope"></i>
                Email Secretariat
              </a>
            </div>
          </div>

          {/* Column 2: Ecosystem */}
          <div>
            <h3 className="text-hive-blue dark:text-white text-lg font-bold mb-8 pl-4 border-l-4 border-hive-gold">
              Ecosystem:
            </h3>
            <div className="flex flex-col gap-5 items-start">
              {[
                { label: 'Events Calendar', id: Page.Events },
                { label: 'Member Directory', id: Page.Team },
                { label: 'Hive Insights (Blog)', id: Page.Articles },
                { label: 'Media Gallery', id: Page.Gallery },
                { label: 'Meeting Minutes', id: Page.Minutes },
                { label: 'Training & Documentation', id: Page.Training },
                { label: 'Frequently Asked Questions', id: Page.FAQ },
                { label: 'Brand Assets', id: Page.Branding },
                { label: 'Admin Access', id: Page.Admin },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest font-bold hover:text-hive-gold transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="text-hive-blue dark:text-white text-lg font-bold mb-8 pl-4 border-l-4 border-hive-gold uppercase tracking-widest">
              Stay Sync'd
            </h3>
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden dark:bg-white/20">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div>
                  <p className="text-hive-blue dark:text-white text-xl font-bold uppercase tracking-tight leading-none">BEE-IT HIVE</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs uppercase font-bold tracking-wide font-brand-uni">Gandaki University</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm">
                Get the latest tech news, hackathon alerts, and workshop invitations delivered straight to your sync portal.
              </p>

              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  placeholder="university-email@gandaki.edu.np"
                  className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 py-3 pr-20 text-sm placeholder-gray-400 focus:outline-none focus:border-hive-gold dark:text-white transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-3 text-hive-blue dark:text-white text-sm font-bold uppercase tracking-tight hover:text-hive-gold transition-colors"
                >
                  Sync
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 dark:border-white/10 mt-12 pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-6">
            <div>
              {/* Logo Group with Glow - Updated Hover Effect to Blue */}
              <div className="relative inline-flex items-center gap-4 mb-4 p-4 rounded-2xl border border-hive-gold/30 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-transparent shadow-[0_0_25px_rgba(255,170,13,0.2)] backdrop-blur-md select-none group hover:border-hive-blue transition-colors">
                {/* Glow Element */}
                <div className="absolute inset-0 bg-hive-blue/10 blur-xl rounded-2xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <img src={LOGO_URL} alt="BEE-IT HIVE" className="h-10 w-auto" />
                <div className="h-8 w-px bg-gray-300 dark:bg-white/20"></div>
                {/* Adaptive Logo Handling */}
                <img 
                  src="https://www.gandakiuniversity.edu.np/wp-content/uploads/2023/01/logo-gu-new.png" 
                  alt="Gandaki University" 
                  className="h-10 w-auto mix-blend-multiply" 
                />
              </div>
              
              <div className="max-w-md pl-2 border-l-2 border-gray-200 dark:border-white/10">
                <p className="text-hive-blue dark:text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-70">
                  Affiliation & Accreditation
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  BEE-IT HIVE is officially accredited by the{' '}
                  <span className="font-bold text-hive-blue dark:text-gray-300">Office of the Dean, Faculty of Science & Technology</span>{' '}
                  at <span className="font-brand-uni">Gandaki University</span>, Nepal.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              {[
                { label: 'Privacy Protocol', id: Page.Privacy },
                { label: 'Terms of Engagement', id: Page.Terms },
                { label: 'Sitemap', id: Page.Sitemap },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest hover:text-hive-gold transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-left md:text-right">
            <p className="text-hive-blue dark:text-white text-xs font-bold mb-4 tracking-tight">
              &copy; 2023 - {currentYear} BEE-IT HIVE <span className="font-brand-uni">Gandaki University</span>. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 italic max-w-lg">
              The "Tech Minds, Future Finds" slogan and all digital assets associated with this hub are protected under <span className="font-brand-uni">Gandaki University</span> Laws, Nepal's Electronic Transaction Act and international IP laws. BEE-IT HIVE is a non-profit student organization focused on technical empowerment. Any unauthorized scraping or commercial use of student data from this portal will be subject to disciplinary and legal action by university governance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
