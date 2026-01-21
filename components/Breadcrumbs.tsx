
import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { useData } from '../context/DataContext';

interface BreadcrumbsProps {
  currentPage: Page;
  detail?: string | null;
  onNavigate: (page: Page) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPage, detail, onNavigate }) => {
  const { bannerConfig } = useData();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 40);
    };
    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (currentPage === Page.Home) return null;

  // Calculate dynamic top position to sit exactly below the navbar
  let topClass = 'top-16'; // Default for Admin Panel (Fixed h-16 / 64px)
  
  if (currentPage !== Page.Admin) {
      if (isScrolled) {
          // Scrolled Visitor Nav: py-2 + h-16 = 80px (5rem) -> top-20
          topClass = 'top-20';
      } else {
          // Unscrolled Visitor Nav: py-6 + h-16 = 112px (7rem)
          // If banner visible: add banner height (approx 40px / 2.5rem / top-10)
          if (bannerConfig.isVisible) {
              topClass = 'top-[9.5rem]'; // 7rem + 2.5rem
          } else {
              topClass = 'top-28'; // 7rem
          }
      }
  }

  return (
    <div className={`fixed left-0 right-0 z-40 bg-gray-50/90 dark:bg-hive-blue/90 backdrop-blur-sm border-b border-gray-100 dark:border-white/5 shadow-sm transition-all duration-500 ease-in-out ${topClass}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400 animate-in fade-in slide-in-from-top-2 duration-300">
        <button 
          onClick={() => onNavigate(Page.Home)} 
          className="hover:text-hive-gold transition-colors font-bold flex items-center"
        >
          <i className="fa-solid fa-house mr-2"></i>Home
        </button>
        
        <span className="mx-3 text-gray-300 dark:text-gray-600">/</span>
        
        <button
          onClick={() => detail ? onNavigate(currentPage) : undefined}
          className={`font-bold capitalize flex items-center ${
            !detail 
              ? 'text-hive-blue dark:text-white cursor-default' 
              : 'hover:text-hive-gold cursor-pointer transition-colors'
          }`}
        >
          {currentPage === Page.Admin ? 'Admin Console' : (currentPage === Page.Team ? 'Our Team' : currentPage)}
        </button>
        
        {detail && (
          <>
            <span className="mx-3 text-gray-300 dark:text-gray-600">/</span>
            <span className="text-hive-blue dark:text-white font-bold truncate max-w-[150px] md:max-w-xs animate-in fade-in">
              {detail}
            </span>
          </>
        )}
      </nav>
    </div>
  );
};

export default Breadcrumbs;
