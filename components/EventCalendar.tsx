
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { HiveEvent, EventType } from '../types';
import { Card, CardContent } from './ui/Card';
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
}

const EventCalendar: React.FC<EventCalendarProps> = ({ onEventClick }) => {
  const { events } = useData();
  const [value, setValue] = useState<any>(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<HiveEvent[]>([]);
  const [selectedDateHolidays, setSelectedDateHolidays] = useState<Holiday[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStartDate, setActiveStartDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchHolidays = async () => {
      const year = new Date().getFullYear();
      try {
        const [npRes, usRes] = await Promise.all([
            fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/NP`),
            fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/US`)
        ]);

        let allHolidays: Holiday[] = [];
        const processResponse = async (res: Response) => {
            if (!res.ok) return [];
            const text = await res.text();
            if (!text) return [];
            try { return JSON.parse(text); } catch { return []; }
        };

        const npHolidays = await processResponse(npRes);
        const usHolidays = await processResponse(usRes);
        allHolidays = [...npHolidays, ...usHolidays];
        setHolidays(allHolidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
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
    return events.filter(e => isSameDate(new Date(e.datetime.start), date));
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
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
        {dayEvents.map(e => (
          <div key={`dot-${e.id}`} className="w-1 h-1 rounded-full bg-hive-gold" />
        ))}
        {dayHolidays.length > 0 && <div className="w-1 h-1 rounded-full bg-cyan-400" />}
      </div>
    );
  };

  const handleDateClick = (date: Date) => {
    setValue(date);
    // On mobile, maybe open modal? For now, we update the side panel.
    const evts = getEventsForDate(date);
    const hols = getHolidaysForDate(date);
    setSelectedDateEvents(evts);
    setSelectedDateHolidays(hols);
    
    if (window.innerWidth < 1024 && (evts.length > 0 || hols.length > 0)) {
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="overflow-hidden border-none shadow-2xl bg-white/80 dark:bg-[#0b1129]/80 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
        <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
          {/* Calendar Side */}
          <div className="flex-1 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/5 relative">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-hive-blue/5 to-transparent pointer-events-none -z-10" />
             <div className="mb-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold font-heading text-hive-blue dark:text-white">Schedule</h3>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-hive-gold text-hive-gold">
                   {value instanceof Date ? value.getFullYear() : ''}
                </Badge>
             </div>
             <Calendar 
                onChange={setValue} 
                value={value} 
                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate || undefined)}
                className="w-full h-full"
                tileContent={tileContent}
                onClickDay={handleDateClick}
                locale="en-US"
                prevLabel={<i className="fa-solid fa-chevron-left text-sm" />}
                nextLabel={<i className="fa-solid fa-chevron-right text-sm" />}
                prev2Label={null}
                next2Label={null}
             />
          </div>

          {/* Details Side (Desktop) */}
          <div className="hidden lg:flex w-[350px] bg-gray-50/50 dark:bg-black/20 flex-col">
             <div className="p-8 border-b border-gray-100 dark:border-white/5">
                <h4 className="text-4xl font-bold text-hive-blue dark:text-white mb-1">
                   {value instanceof Date ? value.getDate() : ''}
                </h4>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                   {isToday ? 'Today' : (value instanceof Date ? value.toLocaleDateString('en-US', { weekday: 'long', month: 'long' }) : '')}
                </p>
             </div>
             
             <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
                {selectedDateEvents.length === 0 && selectedDateHolidays.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
                         <i className="fa-regular fa-calendar text-2xl"></i>
                      </div>
                      <p className="text-sm font-bold">No plans for this day</p>
                   </div>
                ) : (
                   <>
                      {selectedDateHolidays.map((h, i) => (
                         <div key={i} className="flex gap-4 items-start group">
                            <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20" />
                            <div>
                               <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{h.localName}</p>
                               <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                  {h.countryCode === 'NP' ? 'Nepal Holiday' : 'Intl Holiday'}
                               </span>
                            </div>
                         </div>
                      ))}
                      
                      {selectedDateEvents.map(evt => (
                         <div 
                            key={evt.id} 
                            onClick={() => onEventClick(evt)}
                            className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-hive-gold transition-all cursor-pointer group"
                         >
                            <div className="flex justify-between items-start mb-2">
                               <Badge variant={evt.type === 'hackathon' ? 'default' : 'secondary'} className="text-[9px] uppercase tracking-wider">
                                  {evt.type}
                               </Badge>
                               <span className="text-[10px] font-bold text-gray-400">
                                  {new Date(evt.datetime.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </span>
                            </div>
                            <h5 className="font-bold text-hive-blue dark:text-white mb-1 group-hover:text-hive-gold transition-colors">{evt.title}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{evt.location.name}</p>
                         </div>
                      ))}
                   </>
                )}
             </div>
             
             <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-md">
                <Button variant="outline" className="w-full text-xs" onClick={handleJumpToToday}>
                   Jump to Today
                </Button>
             </div>
          </div>
        </div>
      </Card>

      {/* Mobile Modal for Details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>
                  {value instanceof Date ? value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
               </DialogTitle>
               <DialogDescription>
                  {selectedDateEvents.length + selectedDateHolidays.length} entries found
               </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
               {selectedDateHolidays.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/20">
                     <i className="fa-solid fa-earth-americas text-cyan-500"></i>
                     <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400">{h.localName}</span>
                  </div>
               ))}
               {selectedDateEvents.map(evt => (
                  <div 
                     key={evt.id} 
                     onClick={() => { onEventClick(evt); setIsModalOpen(false); }}
                     className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 active:scale-95 transition-transform"
                  >
                     <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-black uppercase text-hive-gold">{evt.type}</span>
                        <span className="text-[10px] font-bold text-gray-400">{new Date(evt.datetime.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                     <h4 className="font-bold text-hive-blue dark:text-white">{evt.title}</h4>
                  </div>
               ))}
            </div>
            <DialogFooter>
               <Button onClick={() => setIsModalOpen(false)} className="w-full">Close</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;
