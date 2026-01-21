
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { HiveEvent } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';

interface EventCalendarProps {
  onEventClick: (event: HiveEvent) => void;
}

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  types: string[];
}

const EventCalendar: React.FC<EventCalendarProps> = ({ onEventClick }) => {
  const { events } = useData();
  const [value, setValue] = useState<any>(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<HiveEvent[]>([]);
  const [selectedDateHolidays, setSelectedDateHolidays] = useState<Holiday[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStartDate, setActiveStartDate] = useState<Date | undefined>(undefined);

  // Fetch Holidays
  useEffect(() => {
    const fetchHolidays = async () => {
      const year = new Date().getFullYear();
      try {
        // Fetch Nepal holidays as primary
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/NP`);
        if (response.ok) {
            const data = await response.json();
            setHolidays(data);
        }
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      }
    };
    fetchHolidays();
  }, []);

  const isSameDate = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(e => e.status === 'published' && isSameDate(new Date(e.datetime.start), date));
  };

  const getHolidaysForDate = (date: Date) => {
    return holidays.filter(h => isSameDate(new Date(h.date), date));
  };

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view !== 'month') return null;
    const dayEvents = getEventsForDate(date);
    const dayHolidays = getHolidaysForDate(date);
    
    if (dayEvents.length === 0 && dayHolidays.length === 0) return null;

    return (
      <div className="flex flex-col gap-1 mt-1 w-full overflow-hidden">
        {/* Render Event Names */}
        {dayEvents.slice(0, 2).map(e => (
          <div key={`evt-${e.id}`} className="px-1 py-0.5 rounded-[2px] bg-hive-gold text-hive-blue text-[7px] font-bold truncate leading-tight">
            {e.title}
          </div>
        ))}
        {dayEvents.length > 2 && (
            <div className="text-[7px] text-hive-gold font-bold text-center leading-none">+{dayEvents.length - 2} more</div>
        )}

        {/* Render Holiday Names */}
        {dayHolidays.slice(0, 1).map((h, i) => (
          <div key={`hol-${i}`} className="px-1 py-0.5 rounded-[2px] bg-cyan-100 text-cyan-800 text-[7px] font-bold truncate leading-tight">
            {h.localName}
          </div>
        ))}
      </div>
    );
  };

  const handleDateClick = (date: Date) => {
    setValue(date);
    const evts = getEventsForDate(date);
    const hols = getHolidaysForDate(date);
    setSelectedDateEvents(evts);
    setSelectedDateHolidays(hols);
    
    // Auto-open modal on mobile/tablet or if explicitly clicking a date with items
    if (window.innerWidth < 1024 || evts.length > 0 || hols.length > 0) {
        setIsModalOpen(true);
    }
  };

  const handleJumpToToday = () => {
      const today = new Date();
      setValue(today);
      setActiveStartDate(today);
      handleDateClick(today);
  };

  // Set initial selection data
  useEffect(() => {
      const date = new Date();
      setSelectedDateEvents(getEventsForDate(date));
      setSelectedDateHolidays(getHolidaysForDate(date));
  }, [events, holidays]);

  const isToday = value instanceof Date && isSameDate(value, new Date());

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
      <Card className="overflow-hidden border-none shadow-2xl bg-white/90 dark:bg-[#0b1129]/90 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 h-full flex flex-col">
        <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
          {/* Calendar Side */}
          <div className="flex-1 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/5 relative">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-hive-blue/5 to-transparent pointer-events-none -z-10" />
             <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl lg:text-2xl font-bold font-heading text-hive-blue dark:text-white">Event Schedule</h3>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleJumpToToday} className="text-xs h-8">Today</Button>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-hive-gold text-hive-gold">
                        {value instanceof Date ? value.getFullYear() : ''}
                    </Badge>
                </div>
             </div>
             
             <div className="calendar-container h-full">
                 <Calendar 
                    onChange={setValue} 
                    value={value} 
                    activeStartDate={activeStartDate}
                    onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate || undefined)}
                    className="w-full h-full text-sm border-none bg-transparent"
                    tileContent={tileContent}
                    onClickDay={handleDateClick}
                    locale="en-US"
                    prevLabel={<div className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><i className="fa-solid fa-chevron-left text-xs" /></div>}
                    nextLabel={<div className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><i className="fa-solid fa-chevron-right text-xs" /></div>}
                    prev2Label={null}
                    next2Label={null}
                    tileClassName={({ date, view }) => 
                        `h-24 lg:h-28 border-t border-gray-100 dark:border-white/5 flex flex-col justify-start items-start p-1 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${isSameDate(date, new Date()) ? 'bg-hive-gold/5' : ''}`
                    }
                 />
             </div>
          </div>

          {/* Details Side (Desktop) */}
          <div className="hidden lg:flex w-[320px] bg-gray-50/50 dark:bg-black/20 flex-col shrink-0">
             <div className="p-8 border-b border-gray-100 dark:border-white/5">
                <h4 className="text-5xl font-black text-hive-blue dark:text-white mb-2 font-heading">
                   {value instanceof Date ? value.getDate() : ''}
                </h4>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                   {isToday ? 'Today' : (value instanceof Date ? value.toLocaleDateString('en-US', { weekday: 'long', month: 'long' }) : '')}
                </p>
             </div>
             
             <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {selectedDateEvents.length === 0 && selectedDateHolidays.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
                         <i className="fa-regular fa-calendar-xmark text-2xl"></i>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider">No events scheduled</p>
                   </div>
                ) : (
                   <>
                      {/* Holidays List */}
                      {selectedDateHolidays.map((h, i) => (
                         <div key={`hol-${i}`} className="flex gap-4 items-start group p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/20">
                            <div className="mt-1">
                                <i className="fa-solid fa-umbrella-beach text-cyan-500"></i>
                            </div>
                            <div>
                               <p className="text-sm font-bold text-cyan-700 dark:text-cyan-400 leading-tight">{h.localName}</p>
                               <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400/70">Public Holiday</span>
                            </div>
                         </div>
                      ))}
                      
                      {/* Events List */}
                      {selectedDateEvents.map(evt => (
                         <div 
                            key={evt.id} 
                            onClick={() => onEventClick(evt)}
                            className="bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-white/5 hover:border-hive-gold transition-all cursor-pointer group hover:shadow-md"
                         >
                            <div className="flex justify-between items-start mb-2">
                               <Badge variant={evt.type === 'hackathon' ? 'default' : 'secondary'} className="text-[9px] uppercase tracking-wider">
                                  {evt.type}
                               </Badge>
                               <span className="text-[10px] font-bold text-gray-400">
                                  {new Date(evt.datetime.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </span>
                            </div>
                            <h5 className="font-bold text-hive-blue dark:text-white mb-1 group-hover:text-hive-gold transition-colors leading-tight">{evt.title}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 flex items-center gap-1">
                                <i className="fa-solid fa-location-dot text-[10px]"></i> {evt.location.name}
                            </p>
                         </div>
                      ))}
                   </>
                )}
             </div>
          </div>
        </div>
      </Card>

      {/* Dialog for details on small screens or click */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="font-heading text-2xl">
                  {value instanceof Date ? value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
               </DialogTitle>
               <DialogDescription>
                  {selectedDateEvents.length} Events • {selectedDateHolidays.length} Holidays
               </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
               {selectedDateHolidays.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/20">
                     <i className="fa-solid fa-calendar-check text-cyan-500"></i>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-cyan-700 dark:text-cyan-400">{h.localName}</p>
                        <p className="text-xs text-cyan-600 dark:text-cyan-500">{h.name}</p>
                     </div>
                  </div>
               ))}
               {selectedDateEvents.map(evt => (
                  <div 
                     key={evt.id} 
                     onClick={() => { onEventClick(evt); setIsModalOpen(false); }}
                     className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 active:scale-95 transition-transform cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                     <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-hive-gold tracking-wider">{evt.type}</span>
                        <span className="text-[10px] font-bold text-gray-400">{new Date(evt.datetime.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                     <h4 className="font-bold text-hive-blue dark:text-white leading-tight mb-1">{evt.title}</h4>
                     <p className="text-xs text-gray-500 line-clamp-1">{evt.location.name}</p>
                  </div>
               ))}
               {selectedDateEvents.length === 0 && selectedDateHolidays.length === 0 && (
                   <p className="text-center text-sm text-gray-400 py-4 italic">Nothing scheduled for this day.</p>
               )}
            </div>
            <DialogFooter>
               <Button onClick={() => setIsModalOpen(false)} variant="outline" className="w-full rounded-xl">Close</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;
