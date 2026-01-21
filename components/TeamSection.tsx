
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Member, Yearbook } from '../types';
import { PixelImage } from './ui/PixelImage';

const TeamSection: React.FC = () => {
  const { team, yearbooks } = useData();
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [activeYearbook, setActiveYearbook] = useState<Yearbook | null>(null);

  // Derive available years from team data
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(team.map(m => m.year)));
    return years.sort((a, b) => b - a);
  }, [team]);

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0] || new Date().getFullYear());

  const filteredTeam = useMemo(() => {
    return team.filter(m => m.year === selectedYear);
  }, [team, selectedYear]);

  // Reusable SVG Component for Journey Visualization
  const JourneyPath = ({ journey }: { journey: string[] }) => {
    const count = journey.length;
    const width = Math.max(600, count * 150); 
    const height = 200;
    const spacing = width / (count + 1);
    
    let d = `M ${spacing} 100`;
    for(let i = 1; i < count; i++) {
        const x = spacing * (i + 1);
        const cp1x = spacing * i + spacing / 2;
        const cp2x = spacing * (i + 1) - spacing / 2;
        const yOffset = i % 2 === 0 ? -40 : 40;
        d += ` C ${cp1x} ${100 + yOffset}, ${cp2x} ${100 - yOffset}, ${x} 100`;
    }

    return (
      <div className="relative w-full overflow-hidden py-10 bg-hive-blue/5 dark:bg-white/5 rounded-3xl">
        <div className="overflow-x-auto no-scrollbar">
           <svg viewBox={`0 0 ${width} ${height}`} style={{ width: `${width}px`, height: `${height}px` }} className="min-w-full">
             <defs>
               <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#FFAA0D" />
                 <stop offset="100%" stopColor="#DB3069" />
               </linearGradient>
               <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                  </feMerge>
               </filter>
             </defs>
             <path d={d} fill="none" stroke="url(#journeyGradient)" strokeWidth="4" strokeLinecap="round" filter="url(#glow)" className="animate-pulse" />
             {journey.map((step, idx) => {
               const x = spacing * (idx + 1);
               return (
                 <g key={idx} className="group/node cursor-pointer">
                   <circle cx={x} cy={100} r="14" fill="#030A37" stroke="#FFAA0D" strokeWidth="2" className="group-hover/node:fill-hive-gold transition-colors duration-300" />
                   <circle cx={x} cy={100} r="6" fill="#FFAA0D" className="group-hover/node:scale-150 transition-transform duration-300 origin-center" />
                   <text x={x} y={idx % 2 === 0 ? 140 : 60} textAnchor="middle" className="fill-hive-blue dark:fill-white font-bold text-xs uppercase tracking-wider" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{step}</text>
                 </g>
               );
             })}
           </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-6xl font-bold text-hive-blue dark:text-white mb-6 font-heading">Committee Hierarchy</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">The organizational backbone driving innovation at Gandaki University.</p>
        
        {/* Year Filter */}
        <div className="mt-12 flex flex-col items-center gap-6">
           <div className="bg-white dark:bg-white/5 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex overflow-x-auto max-w-full no-scrollbar">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-8 py-3 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    selectedYear === year 
                      ? 'bg-hive-blue text-white shadow-lg' 
                      : 'text-gray-500 hover:text-hive-blue dark:hover:text-white'
                  }`}
                >
                  Tenure {year}
                </button>
              ))}
           </div>

           {yearbooks.length > 0 && (
             <div className="flex flex-wrap justify-center gap-4">
                {yearbooks.map(yb => (
                  <button 
                    key={yb.id}
                    onClick={() => setActiveYearbook(yb)}
                    className="inline-flex items-center gap-2 bg-hive-gold text-hive-blue px-6 py-3 rounded-2xl font-bold hover:bg-white hover:text-hive-blue transition-all shadow-xl shadow-hive-gold/10 border-2 border-transparent hover:border-hive-blue text-sm"
                  >
                     <i className="fa-solid fa-book-open"></i> {yb.year} Yearbook
                  </button>
                ))}
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {filteredTeam.length > 0 ? (
          filteredTeam.map((member, idx) => (
            <div 
              key={member.id} 
              className="group bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => setActiveMember(member)}
            >
              {/* Card background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-hive-blue/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative mb-6 flex justify-center">
                 <div className="w-40 h-40 rounded-full border-4 border-white dark:border-[#0b1129] shadow-xl relative z-10 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                   <PixelImage 
                     src={member.image} 
                     alt={member.name}
                     className="w-full h-full"
                     pixelSize={4}
                   />
                 </div>
                 {/* Role Icon/Badge */}
                 <div className="absolute -bottom-2 bg-hive-gold text-hive-blue text-xs font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-lg z-20">
                    {member.role.split(' ')[0]}
                 </div>
              </div>
              
              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold text-hive-blue dark:text-white mb-2 group-hover:text-hive-gold transition-colors font-heading">{member.name}</h3>
                <p className="text-gray-500 text-sm italic mb-6 line-clamp-2 px-2">"{member.message}"</p>
                <button className="text-xs font-bold text-hive-blue dark:text-white uppercase tracking-widest border-b-2 border-hive-gold/30 hover:border-hive-gold transition-all pb-1">View Progression</button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem]">
             <p className="text-gray-400 font-bold uppercase tracking-widest">No members found for {selectedYear}</p>
          </div>
        )}
      </div>

      {/* Member Modal (Journey) */}
      {activeMember && (
        <div className="fixed inset-0 z-[200] bg-hive-blue/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0b1129] max-w-4xl w-full rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/10 max-h-[90vh]">
             <div className="lg:w-2/5 bg-gray-50 dark:bg-black/20 p-12 flex flex-col justify-center items-center text-center relative shrink-0 border-r border-gray-100 dark:border-white/5">
                <img src={activeMember.image} className="w-40 h-40 rounded-full border-4 border-white shadow-xl mb-6" alt={activeMember.name} />
                <h2 className="text-3xl font-bold text-hive-blue dark:text-white">{activeMember.name}</h2>
                <p className="text-hive-gold font-bold uppercase tracking-widest text-xs mt-2">{activeMember.role}</p>
                <p className="text-gray-500 text-xs mt-1">Tenure: {activeMember.year}</p>
             </div>
             
             <div className="lg:w-3/5 p-12 bg-white dark:bg-[#0b1129] overflow-y-auto relative">
                <button onClick={() => setActiveMember(null)} className="absolute top-8 right-8 text-gray-400 hover:text-hive-blue text-xl"><i className="fa-solid fa-xmark"></i></button>
                <h3 className="text-2xl font-bold text-hive-blue dark:text-white mb-2">Career Path</h3>
                <p className="text-sm text-gray-500 mb-8">Evolution within the organization.</p>
                <JourneyPath journey={activeMember.journey} />
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                   <p className="italic text-gray-600 dark:text-gray-300 text-center text-lg font-heading">"{activeMember.message}"</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Yearbook Modal (Same logic, slightly refined styling) */}
      {activeYearbook && (
         <div className="fixed inset-0 z-[250] bg-white dark:bg-[#020515] overflow-y-auto animate-in slide-in-from-bottom-20 duration-500">
            <div className="max-w-7xl mx-auto px-4 py-20 relative">
               <button 
                  onClick={() => setActiveYearbook(null)}
                  className="fixed top-8 right-8 z-50 w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center hover:bg-hive-gold hover:text-white transition-colors"
               >
                  <i className="fa-solid fa-xmark text-lg"></i>
               </button>
               {/* Content ... (Use existing logic) */}
               <div className="text-center mb-16">
                  <h1 className="text-6xl font-black text-hive-blue dark:text-white mb-4">Yearbook {activeYearbook.year}</h1>
                  <span className="bg-hive-gold text-hive-blue px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest">{activeYearbook.theme}</span>
               </div>
               {/* ... */}
            </div>
         </div>
      )}
    </div>
  );
};

export default TeamSection;
