
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext'; 
import { HiveEvent, EventType } from '../types';
import EventRegistration from './EventRegistration';
import EventFeedback from './EventFeedback';
import EventCalendar from './EventCalendar';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ShineBorder } from './ui/ShineBorder';
import { Meteors } from './ui/Meteors';
import { Avatar } from './ui/Avatar';
import { LazyImage } from './ui/LazyImage';

interface EventSectionProps {
  onBreadcrumbUpdate?: (detail: string | null) => void;
}

type ViewMode = 'LIST' | 'DETAIL';
type DisplayFormat = 'CARDS' | 'CALENDAR';
type TimeFilter = 'UPCOMING' | 'PAST';

const EventSection: React.FC<EventSectionProps> = ({ onBreadcrumbUpdate }) => {
  const { events, team } = useData(); 
  const [filter, setFilter] = useState<EventType | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('UPCOMING');
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('CARDS');
  const [selectedEvent, setSelectedEvent] = useState<HiveEvent | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Filter logic
  const filteredEvents = useMemo(() => {
    let result = events;
    if (timeFilter === 'PAST') {
      result = result.filter(e => e.status === 'completed' || e.status === 'cancelled');
    } else {
      result = result.filter(e => e.status === 'published');
    }
    if (filter !== 'all') {
      result = result.filter(e => e.type === filter);
    }
    return result.sort((a, b) => {
      const dateA = new Date(a.datetime.start).getTime();
      const dateB = new Date(b.datetime.start).getTime();
      return timeFilter === 'UPCOMING' ? dateA - dateB : dateB - dateA;
    });
  }, [events, timeFilter, filter]);

  const nextEvents = useMemo(() => {
    if (!selectedEvent) return [];
    return events
      .filter(e => e.id !== selectedEvent.id && e.status === 'published' && new Date(e.datetime.start) > new Date())
      .sort((a, b) => new Date(a.datetime.start).getTime() - new Date(b.datetime.start).getTime())
      .slice(0, 3);
  }, [events, selectedEvent]);

  // Derive Organizers from Team Data
  const eventOrganizers = useMemo(() => {
    if (!selectedEvent || !selectedEvent.organizers) return [];
    return selectedEvent.organizers.map(name => {
      const member = team.find(m => m.name === name);
      return member || { name, role: 'Event Coordinator', image: '' }; // Fallback if member not found in team
    });
  }, [selectedEvent, team]);

  useEffect(() => {
    if (onBreadcrumbUpdate) {
      if (viewMode === 'LIST') {
        const timeLabel = timeFilter === 'PAST' ? 'Past Archive' : 'Upcoming';
        const typeLabel = filter === 'all' ? '' : `: ${(filter || "").charAt(0).toUpperCase() + (filter || "").slice(1)}`;
        onBreadcrumbUpdate(displayFormat === 'CALENDAR' ? 'Calendar' : `${timeLabel}${typeLabel}`);
      } else if (viewMode === 'DETAIL' && selectedEvent) {
        onBreadcrumbUpdate(selectedEvent.title);
      }
    }
  }, [filter, onBreadcrumbUpdate, viewMode, selectedEvent, displayFormat, timeFilter]);

  const handleEventClick = (event: HiveEvent) => {
    setSelectedEvent(event);
    setViewMode('DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
    setViewMode('LIST');
    setShowRegistration(false);
    setShowFeedback(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'DETAIL' && selectedEvent) {
    const isPast = selectedEvent.status === 'completed';
    const isCancelled = selectedEvent.status === 'cancelled';

    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 min-h-screen animate-in fade-in duration-500 relative">
        <button 
          onClick={handleBackToList}
          className="mb-10 text-sm font-bold text-gray-400 hover:text-hive-blue dark:hover:text-white flex items-center transition-all group"
        >
          <i className="fa-solid fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1"></i> Back to Events
        </button>

        {/* Featured Shine Border for Event Banner */}
        <ShineBorder 
          className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl mb-12 border-0 p-0" 
          color={["#FFAA0D", "#DB3069", "#030A37"]}
          borderWidth={2}
        >
          <div className="relative w-full h-[400px] md:h-[560px]">
            <LazyImage 
              src={selectedEvent.image} 
              alt={selectedEvent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute top-8 right-8 bg-white/90 dark:bg-hive-blue/90 backdrop-blur-md px-8 py-3 rounded-3xl text-sm font-black uppercase tracking-[0.3em] text-hive-blue dark:text-white shadow-2xl border border-white/20">
              {selectedEvent.type}
            </div>
          </div>
        </ShineBorder>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-8">
            <h1 className="text-4xl md:text-6xl font-bold text-hive-blue dark:text-white mb-8 leading-tight font-heading">
              {selectedEvent.title}
            </h1>
            <div className="flex flex-wrap gap-3 mb-12">
              {selectedEvent.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="px-6 py-2 text-[10px] uppercase tracking-[0.15em]">
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              <p className="text-lg">{selectedEvent.description}</p>
            </div>

            {/* Organizers Section */}
            {eventOrganizers.length > 0 && (
              <div className="mt-12 pt-12 border-t border-gray-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-hive-blue dark:text-white mb-6 uppercase tracking-widest font-heading">Lead Organizers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventOrganizers.map((org, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                      <Avatar src={org.image} fallback={org.name.charAt(0)} className="w-12 h-12 border-2 border-white dark:border-white/20" />
                      <div>
                        <p className="font-bold text-hive-blue dark:text-white text-sm">{org.name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{org.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 sticky top-28">
            <Card className="bg-white/90 dark:bg-[#0b1129]/80 backdrop-blur-3xl rounded-[3rem] border-gray-100 dark:border-white/10 shadow-xl overflow-hidden">
              {/* Meteors Effect for Sidebar Card */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <Meteors number={10} />
              </div>
              
              <div className="p-10 space-y-12 relative z-10">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-hive-gold/10 flex items-center justify-center text-hive-gold mr-5 shrink-0 text-xl shadow-inner">
                     <i className="fa-solid fa-calendar-days"></i>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-2">Date & Time</p>
                     <p className="font-bold text-hive-blue dark:text-white text-lg leading-tight">
                       {new Date(selectedEvent.datetime.start).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                     </p>
                  </div>
                </div>
                {/* ... other details ... */}
              </div>

              <div className="p-4 pt-0 relative z-10">
                {isCancelled ? (
                  <div className="w-full py-6 bg-red-50 text-red-600 rounded-[2rem] text-center font-bold border border-red-100 text-xs uppercase tracking-widest">
                    Event Cancelled
                  </div>
                ) : isPast ? (
                  <Button 
                    variant="outline"
                    onClick={() => setShowFeedback(true)}
                    className="w-full h-16 rounded-[2rem] text-xs uppercase tracking-widest"
                  >
                    <i className="fa-solid fa-comment-dots mr-3 text-lg"></i> Leave Feedback
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowRegistration(true)}
                    className="w-full h-16 rounded-[2.5rem] bg-[#03071e] text-white hover:bg-hive-gold hover:text-hive-blue shadow-[0_20px_40px_rgba(3,7,30,0.3)] group"
                  >
                    <i className="fa-solid fa-ticket mr-4 text-xl transform group-hover:rotate-12 transition-transform"></i> 
                    <span className="text-sm uppercase tracking-[0.25em]">Register Now</span>
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Next Events */}
        {nextEvents.length > 0 && (
          <div className="border-t border-gray-200 dark:border-white/10 pt-16">
            <h3 className="text-3xl font-bold text-hive-blue dark:text-white mb-10 font-heading">Upcoming Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {nextEvents.map(evt => (
                <div 
                  key={evt.id} 
                  onClick={() => handleEventClick(evt)}
                  className="relative overflow-hidden bg-white dark:bg-white/5 rounded-[2rem] p-4 border border-gray-100 dark:border-white/10 hover:border-hive-gold transition-all cursor-pointer group hover:shadow-xl"
                >
                  <Meteors number={5} />
                  <div className="h-40 rounded-[1.5rem] overflow-hidden mb-4 relative z-10">
                    <LazyImage src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="px-2 pb-2 relative z-10">
                    <h4 className="font-bold text-hive-blue dark:text-white text-lg mb-2 line-clamp-1 group-hover:text-hive-gold transition-colors">{evt.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showRegistration && selectedEvent && (
          <EventRegistration event={selectedEvent} onClose={() => setShowRegistration(false)} onSuccess={() => { setShowRegistration(false); handleBackToList(); }} />
        )}
        {showFeedback && selectedEvent && (
          <EventFeedback event={selectedEvent} onClose={() => setShowFeedback(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      {/* ... Filter Header ... */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-hive-blue dark:text-white mb-2">Hive Events</h1>
          <p className="text-gray-500 dark:text-gray-400">Join our community through workshops, hackathons, and social meetups.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
           <div className="bg-gray-100 dark:bg-white/10 p-1 rounded-2xl flex w-full sm:w-auto">
             <button onClick={() => setTimeFilter('UPCOMING')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === 'UPCOMING' ? 'bg-white dark:bg-hive-blue text-hive-blue dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Upcoming</button>
             <button onClick={() => setTimeFilter('PAST')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === 'PAST' ? 'bg-white dark:bg-hive-blue text-hive-blue dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Past Events</button>
           </div>
           <div className="bg-white dark:bg-white/5 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex">
             <button onClick={() => setDisplayFormat('CARDS')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${displayFormat === 'CARDS' ? 'bg-hive-gold text-hive-blue' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}><i className="fa-solid fa-table-cells-large"></i></button>
             <button onClick={() => setDisplayFormat('CALENDAR')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${displayFormat === 'CALENDAR' ? 'bg-hive-gold text-hive-blue' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}><i className="fa-solid fa-calendar-days"></i></button>
           </div>
        </div>
      </div>

      {displayFormat === 'CARDS' && (
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <Button size="sm" variant={filter === 'all' ? 'default' : 'secondary'} onClick={() => setFilter('all')} className="rounded-xl text-xs">All Types</Button>
          {Object.values(EventType).map((t) => (
            <Button key={t} size="sm" variant={filter === t ? 'default' : 'secondary'} onClick={() => setFilter(t)} className="rounded-xl text-xs">{t}</Button>
          ))}
        </div>
      )}

      {displayFormat === 'CALENDAR' ? (
        <EventCalendar onEventClick={handleEventClick} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} onClick={() => handleEventClick(event)} className="overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col h-full rounded-[2rem]">
              <div className="h-48 relative overflow-hidden shrink-0">
                <LazyImage src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <Badge className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-white/90 text-hive-blue backdrop-blur-md">{event.type}</Badge>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-400 font-bold uppercase mb-4 space-x-4">
                  <span><i className="fa-solid fa-calendar mr-2 text-hive-gold"></i> {new Date(event.datetime.start).toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-bold text-hive-blue dark:text-white mb-4 leading-tight group-hover:text-hive-gold transition-colors line-clamp-2">{event.title}</h3>
                <div className="mt-auto">
                  <Button className="w-full rounded-2xl text-xs">{timeFilter === 'PAST' ? 'View Recap' : 'View Details'}</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventSection;
