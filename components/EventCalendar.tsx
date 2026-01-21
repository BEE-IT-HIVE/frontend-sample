
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { HiveEvent, EventType } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { cn, stripHtml } from '../utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

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

  const getTypeColor = (type: EventType) => {
    switch (type) {
        case EventType.Hackathon: return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]';
        case EventType.Workshop: return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
        case EventType.Social: return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]';
        case EventType.Competition: return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
        case EventType.Collaboration: return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
        default: return 'bg-gray-400';
    }
  };

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view !== 'month') return null;
    const dayEvents = getEventsForDate(date);
    const dayHolidays = getHolidaysForDate(date);
    
    if (dayEvents.length === 0 && dayHolidays.length === 0) return null;

    return (
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 items-center max-w-full px-1">
        {dayEvents.slice(0, 3).map((e, i) => (
          <div 
            key={`dot-${e.id}`} 
            className={cn("w-1.5 h-1.5 rounded-full transition-transform hover:scale-150", getTypeColor(e.type))} 
            title={stripHtml(e.title)}
          />
        ))}
        {dayEvents.length > 3 && (
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
        )}
        {dayHolidays.length > 0 && dayEvents.length < 3 && (
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" title={dayHolidays[0].localName} />
        )}
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
      <Card className="overflow-hidden border-none shadow-2xl bg-white/90 dark:bg-[#0b1129]/90 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 h-full flex flex-col md:flex-row">
          {/* Calendar Side */}
          <div className="flex-1 p-4 lg:p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5 relative">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-hive-blue/5 to-transparent pointer-events-none -z-10" />
             <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black font-heading text-hive-blue dark:text-white tracking-tight">Calendar</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">Select a date to view details</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleJumpToToday} className="text-xs h-9 rounded-xl border-dashed">
                        Today
                    </Button>
                    <Badge variant="secondary" className="text-xs h-9 px-3 rounded-xl font-mono">
                        {value instanceof Date ? value.getFullYear() : ''}
                    </Badge>
                </div>
             </div>
             
             <div className="calendar-container h-full pb-4">
                 <Calendar 
                    onChange={setValue} 
                    value={value} 
                    activeStartDate={activeStartDate}
                    onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate || undefined)}
                    className="w-full h-full text-sm border-none bg-transparent font-sans"
                    tileContent={tileContent}
                    onClickDay={handleDateClick}
                    locale="en-US"
                    prevLabel={<div className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><ChevronLeft className="w-4 h-4" /></div>}
                    nextLabel={<div className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><ChevronRight className="w-4 h-4" /></div>}
                    navigationLabel={({ label }) => <span className="text-lg font-bold text-hive-blue dark:text-white capitalize">{label}</span>}
                    prev2Label={null}
                    next2Label={null}
                    tileClassName={({ date, view }) => 
                        `relative h-14 md:h-20 lg:h-24 rounded-xl border border-transparent transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10 flex flex-col justify-start items-center pt-2 ${
                            isSameDate(date, value as Date) ? '!bg-hive-gold/10 !border-hive-gold dark:!border-hive-gold/50 !text-hive-blue dark:!text-hive-gold shadow-sm' : ''
                        } ${
                            isSameDate(date, new Date()) ? 'font-black text-hive-blue dark:text-white bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`
                    }
                 />
             </div>
          </div>

          {/* Details Side (Desktop) */}
          <div className="hidden md:flex w-[350px] xl:w-[400px] bg-gray-50/50 dark:bg-black/20 flex-col shrink-0 border-l border-gray-100 dark:border-white/5">
             <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-16 h-16 rounded-2xl bg-hive-gold text-hive-blue flex flex-col items-center justify-center shadow-lg shadow-hive-gold/20">
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {value instanceof Date ? value.toLocaleDateString('en-US', { month: 'short' }) : ''}
                        </span>
                        <span className="text-3xl font-black leading-none">
                            {value instanceof Date ? value.getDate() : ''}
                        </span>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-hive-blue dark:text-white leading-tight">
                            {isToday ? 'Today' : (value instanceof Date ? value.toLocaleDateString('en-US', { weekday: 'long' }) : '')}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {selectedDateEvents.length} Events • {selectedDateHolidays.length} Holidays
                        </p>
                    </div>
                </div>
             </div>
             
             <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {selectedDateEvents.length === 0 && selectedDateHolidays.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-40 p-8">
                      <div className="w-20 h-20 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                         <CalendarIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-bold uppercase tracking-wider text-gray-500">No events scheduled</p>
                      <p className="text-xs text-gray-400 mt-2">Enjoy your free time!</p>
                   </div>
                ) : (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3 }}
                     className="space-y-4"
                   >
                      {/* Holidays List */}
                      {selectedDateHolidays.map((h, i) => (
                         <div key={`hol-${i}`} className="flex gap-4 items-start group p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/20">
                            <div className="mt-1 w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                                <span className="text-xs">🎉</span>
                            </div>
                            <div>
                               <p className="text-sm font-bold text-cyan-900 dark:text-cyan-100 leading-tight mb-1">{stripHtml(h.localName)}</p>
                               <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded">Holiday</span>
                            </div>
                         </div>
                      ))}
                      
                      {/* Events List */}
                      {selectedDateEvents.map((evt, idx) => (
                         <div 
                            key={evt.id} 
                            onClick={() => onEventClick(evt)}
                            className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-hive-gold dark:hover:border-hive-gold transition-all cursor-pointer group hover:shadow-md relative overflow-hidden"
                         >
                            <div className={`absolute top-0 left-0 w-1 h-full ${getTypeColor(evt.type).split(' ')[0]}`} />
                            <div className="flex justify-between items-start mb-3 pl-3">
                               <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest border-transparent bg-gray-100 dark:bg-white/10 ${evt.type === EventType.Hackathon ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-300'}`}>
                                  {evt.type}
                               </Badge>
                               <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(evt.datetime.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </span>
                            </div>
                            <h5 className="font-bold text-lg text-hive-blue dark:text-white mb-2 group-hover:text-hive-gold transition-colors leading-tight pl-3">
                                {stripHtml(evt.title)}
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 pl-3">
                                <MapPin className="w-3 h-3 text-hive-gold" /> 
                                <span className="truncate">{evt.location.name}</span>
                            </p>
                         </div>
                      ))}
                   </motion.div>
                )}
             </div>
          </div>
      </Card>

      {/* Mobile Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-[#0b1129] border border-gray-200 dark:border-white/10">
            <DialogHeader className="p-6 pb-2 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
               <DialogTitle className="font-heading text-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-hive-gold text-hive-blue flex items-center justify-center text-sm font-black shadow-md">
                      {value instanceof Date ? value.getDate() : ''}
                  </div>
                  <span>{value instanceof Date ? value.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : ''}</span>
               </DialogTitle>
               <DialogDescription className="pt-2 pl-1">
                  {selectedDateEvents.length} Events • {selectedDateHolidays.length} Holidays
               </DialogDescription>
            </DialogHeader>
            
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
               {selectedDateEvents.length === 0 && selectedDateHolidays.length === 0 && (
                   <div className="text-center py-8">
                       <p className="text-gray-400 text-sm italic">Nothing scheduled for this day.</p>
                   </div>
               )}

               {selectedDateHolidays.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/20">
                     <span className="text-xl">🎉</span>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-cyan-900 dark:text-cyan-100">{stripHtml(h.localName)}</p>
                        <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase">Public Holiday</p>
                     </div>
                  </div>
               ))}

               {selectedDateEvents.map(evt => (
                  <div 
                     key={evt.id} 
                     onClick={() => { onEventClick(evt); setIsModalOpen(false); }}
                     className="p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm relative overflow-hidden"
                  >
                     <div className={`absolute left-0 top-0 bottom-0 w-1 ${getTypeColor(evt.type).split(' ')[0]}`} />
                     <div className="flex justify-between mb-2 pl-2">
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">{evt.type}</span>
                        <span className="text-[10px] font-bold text-gray-400">{new Date(evt.datetime.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                     <h4 className="font-bold text-hive-blue dark:text-white leading-tight mb-1 pl-2">{stripHtml(evt.title)}</h4>
                     <p className="text-xs text-gray-500 line-clamp-1 pl-2">{evt.location.name}</p>
                  </div>
               ))}
            </div>
            
            <DialogFooter className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
               <Button onClick={() => setIsModalOpen(false)} variant="outline" className="w-full rounded-xl">Close</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;
