
import React from 'react';

interface AgreementOverlayProps {
  onAgree: () => void;
}

const AgreementOverlay: React.FC<AgreementOverlayProps> = ({ onAgree }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#01041a] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
       
       <div className="relative bg-gray-50 dark:bg-[#0b1129] border border-gray-200 dark:border-white/10 rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-[0_0_100px_rgba(255,170,13,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-hive-gold/5 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-hive-blue/5 dark:bg-hive-blue blur-[80px] rounded-full pointer-events-none"></div>

          <div className="text-center mb-8 shrink-0 relative z-10">
             <div className="w-20 h-20 bg-gradient-to-br from-hive-gold to-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white dark:text-hive-blue text-3xl shadow-[0_0_30px_rgba(255,170,13,0.3)]">
                <i className="fa-solid fa-handshake-simple"></i>
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-hive-blue dark:text-white font-heading mb-2 tracking-tight">Protocol Handshake</h1>
             <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-[0.3em]">Compliance & Data Governance</p>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-8 relative z-10 custom-scrollbar">
             <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-hive-gold transition-colors shadow-sm">
                <h3 className="text-hive-blue dark:text-white font-bold mb-2 flex items-center gap-3 text-lg">
                   <div className="w-8 h-8 rounded-lg bg-hive-gold/10 flex items-center justify-center text-hive-gold"><i className="fa-solid fa-cookie-bite"></i></div>
                   Digital Cookies
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                   We use local storage mechanisms to persist your session settings (theme preference, read notifications) and ensure a seamless experience. No third-party tracking cookies are deployed without explicit consent.
                </p>
             </div>

             <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-hive-gold transition-colors shadow-sm">
                <h3 className="text-hive-blue dark:text-white font-bold mb-2 flex items-center gap-3 text-lg">
                   <div className="w-8 h-8 rounded-lg bg-hive-gold/10 flex items-center justify-center text-hive-gold"><i className="fa-solid fa-user-shield"></i></div>
                   Privacy Standards
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                   Data submitted via forms (Registration, Contact) is encrypted and stored securely within our infrastructure. We adhere to strict data minimization principles and do not sell student data to third parties.
                </p>
             </div>

             <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-hive-gold transition-colors shadow-sm">
                <h3 className="text-hive-blue dark:text-white font-bold mb-2 flex items-center gap-3 text-lg">
                   <div className="w-8 h-8 rounded-lg bg-hive-gold/10 flex items-center justify-center text-hive-gold"><i className="fa-solid fa-scale-balanced"></i></div>
                   Terms of Engagement
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                   By entering the Hive Portal, you agree to abide by the BEE-IT HIVE Code of Conduct. Harassment, unauthorized data scraping, or misuse of portal resources will result in immediate access revocation.
                </p>
             </div>
          </div>

          <div className="shrink-0 relative z-10 pt-4 border-t border-gray-200 dark:border-white/5">
            <button 
               onClick={onAgree}
               className="w-full bg-hive-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.25em] hover:bg-hive-gold hover:text-hive-blue transition-all shadow-xl hover:shadow-hive-gold/20 flex items-center justify-center gap-3 group"
            >
               <i className="fa-solid fa-fingerprint text-xl"></i>
               <span>Acknowledge & Enter Hive</span>
               <i className="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1"></i>
            </button>
            <p className="text-center text-[10px] text-gray-500 dark:text-gray-600 mt-4 uppercase font-bold tracking-widest">
              By clicking above, you confirm you are a student or guest of <span className="font-brand-uni">Gandaki University</span>.
            </p>
          </div>
       </div>

       <style>{`
         .custom-scrollbar::-webkit-scrollbar {
           width: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
           background: transparent;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
           background: rgba(156, 163, 175, 0.5);
           border-radius: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
           background: rgba(156, 163, 175, 0.8);
         }
       `}</style>
    </div>
  );
};

export default AgreementOverlay;
