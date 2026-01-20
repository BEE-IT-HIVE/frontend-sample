
import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundLines } from './ui/BackgroundLines';
import { LOGO_URL } from '../constants';
import { BentoGrid, BentoCard } from './ui/BentoGrid';

const BrandingSection: React.FC = () => {
  const colors = [
    { name: 'Hive Blue', hex: '#030A37', desc: 'Primary Brand Color', text: 'text-white' },
    { name: 'Hive Gold', hex: '#FFAA0D', desc: 'Accent & Highlight', text: 'text-hive-blue' },
    { name: 'Hive Light Gold', hex: '#E8B723', desc: 'Secondary Accent', text: 'text-hive-blue' },
    { name: 'Hive Glow', hex: '#DB3069', desc: 'Gradient & Energy', text: 'text-white' },
    { name: 'Neutral Gray', hex: '#C5D3D9', desc: 'Structure & Borders', text: 'text-hive-blue' },
  ];

  const typography = [
    { name: 'Sanvito Pro / Podkova', role: 'Headings', sample: 'Tech Minds, Future Finds.', className: 'font-heading' },
    { name: 'Space Grotesk', role: 'Body Text', sample: 'The quick brown fox jumps over the lazy dog.', className: 'font-body' },
    { name: 'Roboto', role: 'University Brand', sample: 'Gandaki University', className: 'font-brand-uni' },
    { name: 'Source Code Pro', role: 'Code / Technical', sample: 'console.log("Hello Hive");', className: 'font-code' },
  ];

  const guidelines = {
    dos: [
      "Use the provided vector formats (SVG) for print and large displays.",
      "Maintain strict clear space equal to the height of the 'H' around the logo.",
      "Use the monochrome version on backgrounds where contrast is below 4.5:1.",
      "Scale the logo proportionally (hold Shift when resizing)."
    ],
    donts: [
      "Do not stretch, squeeze, or skew the logo dimensions.",
      "Do not alter the brand colors (Hive Blue & Gold) or opacity.",
      "Do not add drop shadows, strokes, or glows not defined in the kit.",
      "Do not place the full-color logo on busy or clashing backgrounds."
    ]
  };

  return (
    <div className="pt-20 pb-20 relative min-h-screen">
      <BackgroundLines>
        <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="bg-hive-gold/10 text-hive-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
              Official Assets
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-hive-blue dark:text-white mb-6 font-heading">
              Brand Guidelines
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The visual identity system of BEE-IT HIVE. These standards ensure consistency across all digital and physical touchpoints of the organization.
            </p>
          </div>

          {/* Logo Section */}
          <section className="mb-24">
            <h2 className="text-2xl font-bold text-hive-blue dark:text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-hive-gold rounded-full"></span> Logo Marks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Logo */}
              <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center border border-gray-100 dark:border-white/10 group hover:border-hive-gold transition-all">
                <div className="w-32 h-32 mb-6 relative">
                   <img src={LOGO_URL} alt="Primary Logo" className="w-full h-full object-contain" />
                </div>
                <p className="font-bold text-hive-blue dark:text-white">Primary Mark</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Full Color</p>
                <button className="mt-6 text-xs font-bold text-hive-gold hover:underline">Download SVG</button>
              </div>

              {/* Monochrome Light */}
              <div className="bg-hive-blue rounded-[2rem] p-10 flex flex-col items-center justify-center border border-transparent group hover:border-white/20 transition-all">
                <div className="w-32 h-32 mb-6 relative filter grayscale brightness-200 contrast-200">
                   <img src={LOGO_URL} alt="Monochrome Logo" className="w-full h-full object-contain" />
                </div>
                <p className="font-bold text-white">Monochrome Light</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">On Dark Backgrounds</p>
                <button className="mt-6 text-xs font-bold text-white hover:underline">Download SVG</button>
              </div>

              {/* University Lockup */}
              <div className="bg-white dark:bg-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center border border-gray-100 dark:border-white/10 group hover:border-hive-blue transition-all">
                <div className="h-16 mb-6 flex items-center justify-center gap-4 w-full">
                   <img src={LOGO_URL} alt="Hive" className="h-full w-auto max-w-[40%] object-contain" />
                   <div className="h-8 w-px bg-gray-300 dark:bg-white/20 shrink-0"></div>
                   <img src="https://www.gandakiuniversity.edu.np/wp-content/uploads/2023/01/logo-gu-new.png" alt="GU" className="h-full w-auto max-w-[45%] object-contain" />
                </div>
                <p className="font-bold text-hive-blue dark:text-white">University Lockup</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Official Documents</p>
                <button className="mt-6 text-xs font-bold text-hive-blue dark:text-white hover:underline">Download PNG</button>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="mb-24">
            <h2 className="text-2xl font-bold text-hive-blue dark:text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-hive-gold rounded-full"></span> Color System
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {colors.map((color) => (
                <div key={color.hex} className="group cursor-pointer">
                  <div 
                    className="h-32 rounded-2xl shadow-lg mb-3 flex items-end p-4 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className={`text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity ${color.text}`}>Copy</span>
                  </div>
                  <div className="px-1">
                    <p className="font-bold text-hive-blue dark:text-white text-sm">{color.name}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{color.hex}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{color.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="mb-24">
            <h2 className="text-2xl font-bold text-hive-blue dark:text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-hive-gold rounded-full"></span> Typography
            </h2>
            <div className="space-y-4">
              {typography.map((font) => (
                <div key={font.name} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-shadow">
                  <div className="md:w-1/4">
                    <h3 className="text-2xl font-bold text-hive-blue dark:text-white">{font.name}</h3>
                    <p className="text-xs text-hive-gold font-bold uppercase tracking-widest mt-1">{font.role}</p>
                  </div>
                  <div className="md:w-3/4">
                    <p className={`text-2xl md:text-4xl text-gray-700 dark:text-gray-300 truncate ${font.className}`}>
                      {font.sample}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Usage Instructions (Dos and Donts) */}
          <section className="mb-24">
            <h2 className="text-2xl font-bold text-hive-blue dark:text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-hive-gold rounded-full"></span> Usage Instructions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Correct Usage */}
              <div className="bg-green-50/50 dark:bg-green-900/10 rounded-[2rem] p-8 border border-green-100 dark:border-green-900/30">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  Correct Usage (Do's)
                </h3>
                <ul className="space-y-4">
                  {guidelines.dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <i className="fa-solid fa-circle-check text-green-500 mt-1 shrink-0"></i>
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Incorrect Usage */}
              <div className="bg-red-50/50 dark:bg-red-900/10 rounded-[2rem] p-8 border border-red-100 dark:border-red-900/30">
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </div>
                  Incorrect Usage (Don'ts)
                </h3>
                <ul className="space-y-4">
                  {guidelines.donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <i className="fa-solid fa-circle-xmark text-red-500 mt-1 shrink-0"></i>
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Legal Terms */}
          <section className="border-t-2 border-gray-100 dark:border-white/10 pt-12">
             <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl text-center md:text-left flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center shrink-0">
                   <i className="fa-solid fa-scale-balanced text-2xl text-gray-500"></i>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-hive-blue dark:text-white mb-2">Asset License & Terms of Use</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl">
                      All brand assets provided on this page are the exclusive intellectual property of <strong>BEE-IT HIVE</strong> and <strong>Gandaki University</strong>. These materials are intended solely for official club business, authorized partnerships, and journalistic coverage. Any unauthorized commercial use, modification, distortion, or use that misrepresents the organization is strictly prohibited under our Governance Protocol and Code of Conduct. By downloading these assets, you agree to adhere to these guidelines.
                   </p>
                </div>
             </div>
          </section>

        </div>
      </BackgroundLines>
    </div>
  );
};

export default BrandingSection;
