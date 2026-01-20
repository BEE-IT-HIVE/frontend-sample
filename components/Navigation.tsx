
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, AppSettings, BannerConfig } from '../types';
import NotificationCenter from './NotificationCenter';
import { useData } from '../context/DataContext';
import { LOGO_URL } from '../constants';
import { Avatar } from './ui/Avatar';
import { ThemeToggle } from './ui/ThemeToggle';
import { Button } from './ui/Button';
import { LayoutDashboard, LogOut, Bell, X, Accessibility, Clock } from 'lucide-react';

const MotionNav = motion.nav as any;

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const Banner = ({ config, onClose }: { config: BannerConfig, onClose: () => void }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    if (!config.showCountdown || !config.targetDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const difference = +new Date(config.targetDate!) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null); // Time's up
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [config.targetDate, config.showCountdown]);

  return (
    <AnimatePresence>
      {config.isVisible && (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full z-[110] overflow-hidden fixed top-0 left-0 right-0"
        >
          {/* Magic UI / Aceternity Inspired Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-rainbow opacity-30 blur-sm"></div>
          
          <div className="relative bg-gradient-to-r from-hive-blue via-[#142B73] to-hive-blue text-white text-[10px] md:text-xs font-bold uppercase tracking-widest py-3 text-center border-b border-white/10 shadow-lg">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             
             {/* Shimmer Overlay */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer pointer-events-none"></div>

             <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hive-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-hive-gold"></span>
                  </span>
                  <span>{config.message}</span>
                  {config.link && <i className="fa-solid fa-arrow-right text-hive-gold hidden sm:inline-block"></i>}
                </span>

                {timeLeft && (
                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                    <Clock className="w-3 h-3 text-hive-gold" />
                    <div className="flex gap-1 font-mono text-hive-gold">
                      <span>{timeLeft.days}d</span>
                      <span>:</span>
                      <span>{timeLeft.hours.toString().padStart(2,'0')}h</span>
                      <span>:</span>
                      <span>{timeLeft.minutes.toString().padStart(2,'0')}m</span>
                      <span>:</span>
                      <span>{timeLeft.seconds.toString().padStart(2,'0')}s</span>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={onClose} 
                  className="absolute right-4 hover:bg-white/10 p-1 rounded-full transition-colors flex items-center justify-center"
                  aria-label="Dismiss banner"
                >
                  <X className="w-3 h-3 text-white/70 hover:text-white" />
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange, settings, updateSettings }) => {
  const { notifications, bannerConfig, updateBannerConfig } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'notifications' | 'accessibility' | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
           setActiveDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: 'Home', id: Page.Home },
    { name: 'About', id: Page.About },
    { name: 'Events', id: Page.Events },
    { name: 'Team', id: Page.Team },
    { name: 'Gallery', id: Page.Gallery },
    { name: 'Insights', id: Page.Articles },
    { name: 'Contact', id: Page.Contact },
  ];

  const toggleDropdown = (name: 'notifications' | 'accessibility') => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const handleCloseBanner = () => {
    updateBannerConfig({ ...bannerConfig, isVisible: false });
  };

  // Shared Accessibility Menu Component
  const AccessibilityMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="dropdown-container absolute top-14 right-0 w-72 bg-white dark:bg-[#0b1129] border border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl p-5 z-[150] overflow-hidden origin-top-right"
    >
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-white/5 pb-2">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Accessibility className="w-3 h-3" /> Accessibility
        </h4>
        <button onClick={() => setActiveDropdown(null)} className="text-gray-400 hover:text-hive-blue dark:hover:text-white transition-colors">
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-5">
        {/* Font Size Selector */}
        <div>
          <div className="flex justify-between items-center mb-2">
             <span className="text-sm font-bold text-hive-blue dark:text-white">Text Size</span>
             <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-500 font-mono">{settings.fontSize}</span>
          </div>
          <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 gap-1">
            {(['default', 'large', 'xl'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  settings.fontSize === size
                    ? 'bg-white dark:bg-hive-blue text-hive-blue dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10'
                }`}
              >
                <span className={size === 'default' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-base'}>Aa</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            { key: 'highContrast', label: 'High Contrast', icon: 'fa-circle-half-stroke' },
            { key: 'reduceMotion', label: 'Reduce Motion', icon: 'fa-person-running' },
            { key: 'dyslexicFont', label: 'Dyslexic Font', icon: 'fa-font' }
          ].map((toggle) => (
            <label key={toggle.key} className="flex items-center justify-between cursor-pointer group bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-transparent hover:border-hive-gold/30 transition-all">
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${settings[toggle.key as keyof AppSettings] ? 'bg-hive-gold text-hive-blue' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                    <i className={`fa-solid ${toggle.icon} text-xs`}></i>
                 </div>
                 <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-hive-blue dark:group-hover:text-white transition-colors">{toggle.label}</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${settings[toggle.key as keyof AppSettings] ? 'bg-hive-gold' : 'bg-gray-300 dark:bg-white/20'}`}>
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${settings[toggle.key as keyof AppSettings] ? 'left-6' : 'left-1'}`} />
                 <input
                  type="checkbox"
                  checked={!!settings[toggle.key as keyof AppSettings]}
                  onChange={(e) => updateSettings({ [toggle.key]: e.target.checked })}
                  className="sr-only"
                />
              </div>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // --- Admin Dashboard Navigation ---
  if (currentPage === Page.Admin) {
    return (
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[#0b1129] border-b border-gray-200 dark:border-white/10 h-16 transition-colors duration-500">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPageChange(Page.Home)}>
              <Avatar src={LOGO_URL} fallback="BH" className="h-8 w-8 border border-hive-gold" />
              <span className="font-heading font-bold text-lg text-hive-blue dark:text-white">BEE-IT HIVE</span>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-white/20 mx-2 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">
              <LayoutDashboard className="w-3 h-3 text-hive-gold" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Admin Console</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4" ref={navRef as any}>
            <ThemeToggle theme={settings.theme} toggleTheme={toggleTheme} />
            
            {/* Accessibility Dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleDropdown('accessibility')}
                className={`relative rounded-full w-10 h-10 ${activeDropdown === 'accessibility' ? 'bg-hive-gold text-hive-blue' : ''}`}
              >
                <Accessibility className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </Button>
              <AnimatePresence>
                {activeDropdown === 'accessibility' && <AccessibilityMenu />}
              </AnimatePresence>
            </div>

            {/* Notification Dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleDropdown('notifications')}
                className={`relative rounded-full w-10 h-10 ${activeDropdown === 'notifications' ? 'bg-hive-gold text-hive-blue' : ''}`}
              >
                <Bell className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#0b1129] rounded-full"></span>
                )}
              </Button>
              <AnimatePresence>
                {activeDropdown === 'notifications' && (
                  <NotificationCenter 
                    isOpen={true} 
                    onClose={() => setActiveDropdown(null)} 
                    onPageChange={(p) => { onPageChange(p); setActiveDropdown(null); }} 
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-gray-300 dark:bg-white/20 hidden sm:block"></div>

            <Button 
              variant="default"
              size="sm"
              onClick={() => onPageChange(Page.Home)}
              className="hidden sm:flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/40 rounded-xl"
            >
              <LogOut className="w-3 h-3" />
              <span className="text-xs font-bold uppercase tracking-wider">Exit</span>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  // --- Visitor Advanced Navigation ---
  return (
    <>
      <Banner config={bannerConfig} onClose={handleCloseBanner} />
      <MotionNav
        ref={navRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled 
            ? 'top-0 py-2' 
            : `${bannerConfig.isVisible ? 'top-10' : 'top-0'} py-6`
        }`}
      >
        <div className={`mx-auto transition-all duration-500 ${isScrolled ? 'max-w-full px-6 bg-white/80 dark:bg-[#030A37]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10' : 'max-w-7xl px-4'}`}>
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              onClick={() => onPageChange(Page.Home)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Avatar src={LOGO_URL} fallback="BH" className="h-10 w-10 border-2 border-hive-gold group-hover:scale-110 transition-transform" />
              <div className="hidden sm:block">
                <h1 className="text-hive-blue dark:text-white font-black text-lg leading-none tracking-tight">BEE-IT HIVE</h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest font-brand-uni">Gandaki University</p>
              </div>
            </div>

            {/* Desktop Navigation Menu (Advanced Pill) */}
            <div className="hidden lg:flex items-center bg-gray-100/50 dark:bg-white/5 backdrop-blur-md rounded-full p-1 border border-gray-200 dark:border-white/10 shadow-inner">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 relative ${
                    currentPage === item.id 
                      ? 'text-white' 
                      : 'text-gray-500 dark:text-gray-300 hover:text-hive-blue dark:hover:text-white'
                  }`}
                >
                  {currentPage === item.id && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-hive-blue rounded-full shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle theme={settings.theme} toggleTheme={toggleTheme} />

              {/* Accessibility Dropdown */}
              <div className="relative">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={() => toggleDropdown('accessibility')}
                  className={`rounded-full w-10 h-10 ${activeDropdown === 'accessibility' ? 'bg-hive-gold text-hive-blue' : ''}`}
                >
                  <Accessibility className="w-4 h-4" />
                </Button>
                <AnimatePresence>
                  {activeDropdown === 'accessibility' && <AccessibilityMenu />}
                </AnimatePresence>
              </div>

              {/* Notification Dropdown */}
              <div className="relative">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => toggleDropdown('notifications')}
                  className={`rounded-full w-10 h-10 ${activeDropdown === 'notifications' ? 'bg-hive-gold text-hive-blue' : ''}`}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border border-white rounded-full"></span>}
                </Button>
                <AnimatePresence>
                  {activeDropdown === 'notifications' && (
                    <NotificationCenter 
                      isOpen={true} 
                      onClose={() => setActiveDropdown(null)} 
                      onPageChange={(p) => { onPageChange(p); setActiveDropdown(null); }} 
                    />
                  )}
                </AnimatePresence>
              </div>

              <Button
                size="icon"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden rounded-full w-10 h-10 bg-hive-blue text-white"
              >
                <i className="fa-solid fa-bars"></i>
              </Button>
            </div>
          </div>
        </div>
      </MotionNav>

      {/* Mobile Drawer (ShadCN Drawer Style) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[160] bg-white dark:bg-[#0b1129] rounded-t-[2rem] border-t border-gray-200 dark:border-white/10 max-h-[85vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mt-4 mb-6" />
              
              <div className="px-6 pb-6 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-2xl font-black text-hive-blue dark:text-white font-heading">Menu</h2>
                <p className="text-gray-500 text-xs">Navigate the Hive ecosystem.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { onPageChange(item.id); setDrawerOpen(false); }}
                    className={`w-full text-left px-6 py-4 rounded-2xl text-lg font-bold flex items-center justify-between group transition-all ${
                      currentPage === item.id 
                        ? 'bg-hive-gold text-hive-blue shadow-lg' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                    <i className={`fa-solid ${currentPage === item.id ? 'fa-chevron-right' : 'fa-arrow-right'} opacity-50`}></i>
                  </button>
                ))}
              </div>

              <div className="p-6 bg-gray-50 dark:bg-black/20 pb-10">
                 <button 
                   onClick={() => { onPageChange(Page.Contact); setDrawerOpen(false); }}
                   className="w-full bg-hive-blue text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl"
                 >
                   Join The Hive
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
