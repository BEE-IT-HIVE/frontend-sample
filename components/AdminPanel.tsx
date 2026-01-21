
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { EventType, HiveEvent, Article, Member, TrainingDoc, MeetingMinute, ContentStatus, FormField, FieldType } from '../types';
import { DotBackground } from './ui/DotBackground';
import { DateTimePicker } from './DateTimePicker';
import { sanitize } from '../utils';
import { BentoGrid, BentoCard } from './ui/BentoGrid';

const MotionDiv = motion.div as any;

// --- Helper Components ---

const ListItem: React.FC<{ title: string, subtitle?: string, status?: string, onDelete: () => void, onEdit?: () => void }> = ({ title, subtitle, status, onDelete, onEdit }) => (
  <div className="bg-white dark:bg-white/5 p-4 rounded-xl flex justify-between items-center border border-gray-100 dark:border-white/10 mb-3 hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0 mr-4">
          <h4 className="font-bold text-hive-blue dark:text-white truncate">{title}</h4>
          <div className="flex gap-2 items-center mt-1">
             {status && (
                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider ${
                    status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                    status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                    'bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                }`}>
                    {status}
                </span>
             )}
             {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
          </div>
      </div>
      <div className="flex gap-2 shrink-0">
          {onEdit && <button onClick={onEdit} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/10 text-gray-400 hover:text-hive-blue hover:bg-hive-gold transition-all flex items-center justify-center"><i className="fa-solid fa-pen text-xs"></i></button>}
          <button onClick={onDelete} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/10 text-gray-400 hover:text-red-600 hover:bg-red-100 transition-all flex items-center justify-center"><i className="fa-solid fa-trash text-xs"></i></button>
      </div>
  </div>
);

const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{scale:0.95, opacity:0, y: 20}} animate={{scale:1, opacity:1, y: 0}} exit={{scale:0.95, opacity:0, y: 20}} className="bg-white dark:bg-[#0b1129] p-8 rounded-[2.5rem] shadow-2xl w-full max-w-3xl relative z-10 border border-gray-100 dark:border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
           <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
               <h2 className="text-3xl font-bold font-heading text-hive-blue dark:text-white">{title}</h2>
               <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-all"><i className="fa-solid fa-xmark"></i></button>
           </div>
           {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const TextEditorToolbar = ({ onInsert }: { onInsert: (text: string) => void }) => (
  <div className="flex gap-2 mb-2 p-1 bg-gray-100 dark:bg-white/10 rounded-lg w-fit">
    <button type="button" onClick={() => onInsert('**bold**')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-xs font-bold font-body" title="Bold">B</button>
    <button type="button" onClick={() => onInsert('*italic*')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-xs italic font-body" title="Italic">I</button>
    <button type="button" onClick={() => onInsert('\n- List item')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-xs font-body" title="List"><i className="fa-solid fa-list-ul"></i></button>
    <button type="button" onClick={() => onInsert('\n# Heading')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-xs font-heading font-bold" title="Heading">H1</button>
  </div>
);

const PipelineControl = ({ status, onChange }: { status: string, onChange: (s: any) => void }) => {
  const stages = ['draft', 'verification', 'approval', 'published'];
  const currentIndex = stages.indexOf(status);
  
  if (['completed', 'cancelled'].includes(status)) {
      return (
          <div className="mb-6 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Current Status</label>
              <select value={status} onChange={(e) => onChange(e.target.value)} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
              </select>
          </div>
      );
  }

  return (
    <div className="mb-8 relative bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
      <div className="flex justify-between items-center mb-6">
          <label className="text-xs font-black uppercase text-hive-blue dark:text-white tracking-[0.2em]">Publication Pipeline</label>
      </div>
      
      <div className="flex justify-between items-center gap-2 relative mb-6">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-white/10 -z-10 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-hive-gold to-yellow-300 -z-10 rounded-full transition-all duration-500 ease-out" style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}></div>

        {stages.map((stage, idx) => {
          const isAccessible = idx <= currentIndex + 1;
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;

          return (
            <button
              key={stage}
              type="button"
              disabled={!isAccessible}
              onClick={() => onChange(stage)}
              className={`relative flex flex-col items-center group transition-all duration-300 ${!isAccessible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-all z-10 ${
                  isActive ? 'bg-hive-gold border-white dark:border-[#0b1129] text-hive-blue scale-110 shadow-lg' :
                  isCompleted ? 'bg-hive-blue border-hive-blue text-white' :
                  'bg-white dark:bg-[#0b1129] border-gray-200 dark:border-white/20 text-gray-400'
              }`}>
                  {isCompleted && !isActive ? <i className="fa-solid fa-check"></i> : idx + 1}
              </div>
              <span className={`absolute top-full mt-3 text-[9px] font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-hive-gold' : 'text-gray-400 dark:text-gray-500'
              }`}>
                  {stage}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="pt-4 border-t border-gray-200 dark:border-white/5 flex gap-3">
          <button type="button" onClick={() => onChange('completed')} className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 px-4 py-2 rounded-lg transition-colors">Mark Completed</button>
          <button type="button" onClick={() => onChange('cancelled')} className="text-[10px] uppercase font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 px-4 py-2 rounded-lg transition-colors">Mark Cancelled</button>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <div className="mb-4">
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">{label}</label>
        <input {...props} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold focus:border-transparent outline-none transition-all font-body text-sm text-hive-blue dark:text-white" />
    </div>
);

const TextAreaField = ({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
    <div className="mb-4">
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">{label}</label>
        <textarea {...props} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold focus:border-transparent outline-none transition-all font-body text-sm resize-none text-hive-blue dark:text-white" />
    </div>
);

const EventFormContent = ({ event, PipelineControl }: { event: HiveEvent | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(event?.status || 'draft');
  const [startDate, setStartDate] = useState<Date | undefined>(event ? new Date(event.datetime.start) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(event ? new Date(event.datetime.end) : undefined);
  const [regDate, setRegDate] = useState<Date | undefined>(event?.registrationDeadline ? new Date(event.registrationDeadline) : undefined);
  const [description, setDescription] = useState(event?.description || '');

  const insertText = (text: string) => setDescription(prev => prev + text);

  return (
    <>
      <PipelineControl status={status} onChange={setStatus} />
      <input type="hidden" name="status" value={status} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <InputField label="Event Title" name="title" defaultValue={event?.title} required />
         <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">Event Type</label>
            <select name="type" defaultValue={event?.type || EventType.Workshop} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold outline-none text-sm font-body text-hive-blue dark:text-white">
               {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
         <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">Start Time</label>
            <DateTimePicker date={startDate} setDate={setStartDate} name="start" />
         </div>
         <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">End Time</label>
            <DateTimePicker date={endDate} setDate={setEndDate} name="end" />
         </div>
         <div>
            <label className="block text-[10px] font-bold uppercase text-red-500 mb-1 tracking-wider">Reg. Deadline</label>
            <DateTimePicker date={regDate} setDate={setRegDate} name="registrationDeadline" />
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <InputField label="Location Name" name="locationName" defaultValue={event?.location.name} required />
         <InputField label="Coordinates (Lat, Lng)" name="locationCoords" defaultValue={event?.location.coordinates} placeholder="28.16, 84.02" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <InputField label="Capacity" type="number" name="capacity" defaultValue={event?.capacity || 50} required />
         <InputField label="Tags (comma separated)" name="tags" defaultValue={event?.tags.join(', ')} placeholder="AI, Workshop" />
      </div>
      <InputField label="Organizers (comma separated)" name="organizers" defaultValue={event?.organizers?.join(', ')} />
      
      <div>
         <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider">Description</label>
            <TextEditorToolbar onInsert={insertText} />
         </div>
         <textarea 
            name="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 h-40 focus:ring-2 focus:ring-hive-gold outline-none font-body text-sm custom-scrollbar text-hive-blue dark:text-white" 
            required 
         />
      </div>
    </>
  );
};

const MemberFormContent = ({ member, PipelineControl }: { member: Member | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(member?.status || 'draft');
  return (
    <>
      <PipelineControl status={status} onChange={setStatus} />
      <input type="hidden" name="status" value={status} />
      <div className="grid grid-cols-2 gap-6">
        <InputField label="Full Name" name="name" defaultValue={member?.name} required />
        <InputField label="Tenure Year" type="number" name="year" defaultValue={member?.year || new Date().getFullYear()} required />
      </div>
      <InputField label="Role / Position" name="role" defaultValue={member?.role} required />
      <InputField label="Profile Image URL" name="image" defaultValue={member?.image} />
      <TextAreaField label="Bio / Message" name="message" defaultValue={member?.message} rows={3} required />
      <InputField label="Journey Steps (comma sep)" name="journey" defaultValue={member?.journey.join(', ')} placeholder="Member, VP, President" />
    </>
  );
};

const ArticleFormContent = ({ article, PipelineControl }: { article: Article | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(article?.status || 'draft');
  const [content, setContent] = useState(article?.content || '');
  return (
    <>
      <PipelineControl status={status} onChange={setStatus} />
      <input type="hidden" name="status" value={status} />
      <InputField label="Article Title" name="title" defaultValue={article?.title} required />
      <div className="grid grid-cols-2 gap-6">
         <InputField label="Author" name="author" defaultValue={article?.author} required />
         <InputField label="Read Time" name="readTime" defaultValue={article?.readTime} placeholder="5 min read" />
      </div>
      <InputField label="Cover Image URL" name="image" defaultValue={article?.image} />
      <InputField label="Tags (comma sep)" name="tags" defaultValue={article?.tags.join(', ')} />
      <TextAreaField label="Excerpt" name="excerpt" defaultValue={article?.excerpt} rows={2} required />
      <div>
         <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Content</label>
         <TextEditorToolbar onInsert={(txt) => setContent(prev => prev + txt)} />
         <textarea name="content" rows={12} value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold outline-none font-body text-sm whitespace-pre-wrap text-hive-blue dark:text-white" required />
      </div>
    </>
  );
};

const MinuteFormContent = ({ minute, PipelineControl }: { minute: MeetingMinute | null, PipelineControl: any }) => {
  const [status, setStatus] = useState(minute?.status || 'draft');
  return (
    <>
      <PipelineControl status={status} onChange={setStatus} />
      <input type="hidden" name="status" value={status} />
      <InputField label="Meeting Title" name="title" defaultValue={minute?.title} required />
      <InputField label="Date" name="date" type="date" defaultValue={minute?.date} required />
      <InputField label="Attendees (comma sep)" name="attendees" defaultValue={minute?.attendees.join(', ')} required />
      <TextAreaField label="Agenda Items (one per line)" name="agenda" defaultValue={minute?.agenda.join('\n')} rows={4} />
      <TextAreaField label="Decisions (one per line)" name="decisions" defaultValue={minute?.decisions.join('\n')} rows={4} />
      <TextAreaField label="Action Items (one per line)" name="actionItems" defaultValue={minute?.actionItems.join('\n')} rows={4} />
    </>
  );
};

const BannerForm = ({ config, updateConfig, events }: { config: any, updateConfig: any, events: HiveEvent[] }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [useManualDate, setUseManualDate] = useState(!events.find(e => new Date(e.datetime.start).toISOString() === localConfig.targetDate));
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [manualDate, setManualDate] = useState<Date | undefined>(localConfig.targetDate ? new Date(localConfig.targetDate) : undefined);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(localConfig);
    alert("Banner updated successfully!");
  };

  const handleEventSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const evtId = e.target.value;
    setSelectedEventId(evtId);
    const evt = events.find(ev => ev.id === evtId);
    if (evt) {
      setLocalConfig({ 
        ...localConfig, 
        targetDate: evt.datetime.start,
        message: evt.title 
      });
      setManualDate(new Date(evt.datetime.start));
    }
  };

  const handleManualDateChange = (date: Date | undefined) => {
    setManualDate(date);
    setLocalConfig({ ...localConfig, targetDate: date ? date.toISOString() : undefined });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <div>
            <h3 className="font-bold text-xl text-hive-blue dark:text-white">Active Banner</h3>
            <p className="text-xs text-gray-500">Global site notification bar</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={localConfig.isVisible} onChange={(e) => setLocalConfig({...localConfig, isVisible: e.target.checked})} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-hive-gold"></div>
            </label>
        </div>
        <InputField label="Message Text" value={localConfig.message} onChange={(e) => setLocalConfig({...localConfig, message: sanitize(e.target.value)})} disabled={!useManualDate && !localConfig.isVisible} />
      </div>

      <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-lg text-hive-blue dark:text-white">Countdown Timer</h4>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={localConfig.showCountdown} onChange={(e) => setLocalConfig({...localConfig, showCountdown: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
         </div>
         
         {localConfig.showCountdown && (
             <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                 <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                    <button type="button" onClick={() => setUseManualDate(false)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${!useManualDate ? 'bg-white dark:bg-white/10 shadow-sm text-hive-blue dark:text-white' : 'text-gray-500'}`}>Linked Event</button>
                    <button type="button" onClick={() => setUseManualDate(true)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${useManualDate ? 'bg-white dark:bg-white/10 shadow-sm text-hive-blue dark:text-white' : 'text-gray-500'}`}>Custom Date</button>
                 </div>
                 
                 {!useManualDate ? (
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Select Event</label>
                        <select value={selectedEventId} onChange={handleEventSelection} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none text-sm font-body text-hive-blue dark:text-white">
                            <option value="">-- Choose Upcoming Event --</option>
                            {events.filter(e => new Date(e.datetime.start) > new Date()).map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                        </select>
                    </div>
                 ) : (
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Target Date</label>
                        <DateTimePicker date={manualDate} setDate={handleManualDateChange} />
                    </div>
                 )}
             </div>
         )}
      </div>

      <button type="submit" className="w-full bg-hive-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-hive-gold hover:text-hive-blue transition-all shadow-lg text-sm">
        Save Configuration
      </button>
    </form>
  );
};

// --- Full Form Builder Component ---
const FormBuilder = ({ events, saveForm, getForm, selectedEventIdProp }: { events: HiveEvent[], saveForm: (eventId: string, fields: FormField[]) => void, getForm: (eventId: string) => FormField[], selectedEventIdProp?: string }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(selectedEventIdProp || '');
  const [fields, setFields] = useState<FormField[]>([]);

  useEffect(() => {
    if(selectedEventIdProp) setSelectedEventId(selectedEventIdProp);
  }, [selectedEventIdProp]);

  useEffect(() => {
    if (selectedEventId) {
      setFields(getForm(selectedEventId));
    } else {
      setFields([]);
    }
  }, [selectedEventId, getForm]);

  // Filter out past/completed events from dropdown as per requirement
  const availableEvents = events.filter(e => 
    e.status !== 'completed' && 
    e.status !== 'cancelled' && 
    new Date(e.datetime.end) > new Date()
  );

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: type === 'description' || type === 'static_image' ? undefined : `New ${type} question`,
      content: type === 'description' ? 'Enter instructions...' : type === 'static_image' ? 'https://picsum.photos/800/200' : undefined,
      required: false,
      options: ['Option 1', 'Option 2'],
      placeholder: ''
    };
    setFields([...fields, newField]);
  };

  const addTemplate = (templateName: string) => {
    const timestamp = Date.now();
    let newFields: FormField[] = [];

    switch(templateName) {
      case 'name':
        newFields = [
          { id: `field_${timestamp}_1`, type: 'text', label: 'First Name', required: true, placeholder: 'John' },
          { id: `field_${timestamp}_2`, type: 'text', label: 'Last Name', required: true, placeholder: 'Doe' }
        ];
        break;
      case 'contact':
        newFields = [
          { id: `field_${timestamp}_1`, type: 'email', label: 'Email Address', required: true, placeholder: 'name@example.com' },
          { id: `field_${timestamp}_2`, type: 'phone', label: 'Phone Number', required: true, placeholder: '+977 9800000000' }
        ];
        break;
      case 'gender':
        newFields = [
          { id: `field_${timestamp}`, type: 'radio', label: 'Gender', required: true, options: ['Male', 'Female', 'Other', 'Prefer not to say'] }
        ];
        break;
      case 'program':
        newFields = [
          { id: `field_${timestamp}`, type: 'select', label: 'Academic Program', required: true, options: ['BIT', 'BCA', 'BSc. CSIT', 'BIM', 'BCIS'] }
        ];
        break;
      case 'college':
        newFields = [
          { id: `field_${timestamp}`, type: 'text', label: 'College / Institution', required: true, placeholder: 'Gandaki University' }
        ];
        break;
      case 'socials':
        newFields = [
          { id: `field_${timestamp}_1`, type: 'url', label: 'LinkedIn Profile', required: false, placeholder: 'https://linkedin.com/in/...' },
          { id: `field_${timestamp}_2`, type: 'url', label: 'Portfolio URL', required: false, placeholder: 'https://github.com/...' }
        ];
        break;
      case 'tshirt':
        newFields = [
          { id: `field_${timestamp}`, type: 'select', label: 'T-Shirt Size', required: true, options: ['S', 'M', 'L', 'XL', 'XXL'] }
        ];
        break;
      case 'agreements':
        newFields = [
          { id: `field_${timestamp}_1`, type: 'checkbox', label: 'I agree to the Terms & Conditions', required: true, options: ['Agreed'] },
          { id: `field_${timestamp}_2`, type: 'checkbox', label: 'I agree to the Code of Conduct', required: true, options: ['Agreed'] }
        ];
        break;
    }
    setFields([...fields, ...newFields]);
  };

  const updateField = (id: string, key: keyof FormField, value: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const addOption = (id: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, options: [...(f.options || []), `Option ${(f.options?.length || 0) + 1}`] } : f));
  };

  const updateOption = (id: string, idx: number, val: string) => {
    setFields(fields.map(f => {
      if (f.id !== id) return f;
      const newOpts = [...(f.options || [])];
      newOpts[idx] = val;
      return { ...f, options: newOpts };
    }));
  };

  const removeOption = (id: string, idx: number) => {
    setFields(fields.map(f => {
      if (f.id !== id) return f;
      const newOpts = [...(f.options || [])];
      newOpts.splice(idx, 1);
      return { ...f, options: newOpts };
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) return;
    const newFields = [...fields];
    const temp = newFields[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    setFields(newFields);
  };

  const handleFileUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField(id, 'content', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!selectedEventId) return;
    saveForm(selectedEventId, fields);
    alert('Form configuration saved!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
      {/* Event Selection */}
      <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Select Event to Build Form For</label>
          <select 
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-hive-gold outline-none font-body text-sm text-hive-blue dark:text-white"
          >
            <option value="">-- Select Active Event --</option>
            {availableEvents.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <button 
          onClick={handleSave}
          disabled={!selectedEventId}
          className="bg-hive-blue text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-hive-gold hover:text-hive-blue transition-colors text-xs"
        >
          Save Form
        </button>
      </div>

      {selectedEventId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Preview */}
          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm h-fit sticky top-32">
            <h3 className="text-xl font-bold text-hive-blue dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4 font-heading">Live Preview</h3>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {fields.length === 0 && <p className="text-gray-400 text-sm italic text-center py-8">Form is empty. Add fields from the right.</p>}
              {fields.map(field => (
                <div key={field.id} className="space-y-2">
                  {field.type !== 'description' && field.type !== 'static_image' && field.label && (
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 font-body">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                  )}
                  
                  {field.type === 'description' ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400 prose dark:prose-invert whitespace-pre-wrap font-body">
                      {field.content || 'Description text...'}
                    </div>
                  ) : field.type === 'static_image' ? (
                    <div className="rounded-xl overflow-hidden my-4 border border-gray-100 dark:border-white/10">
                        <img src={field.content || 'https://picsum.photos/800/200'} alt="Form Banner" className="w-full h-auto object-cover max-h-48" />
                    </div>
                  ) : field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date' || field.type === 'phone' || field.type === 'url' ? (
                    <input type={field.type === 'phone' ? 'tel' : field.type} placeholder={field.placeholder} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-body outline-none" disabled />
                  ) : field.type === 'textarea' ? (
                    <textarea placeholder={field.placeholder} rows={3} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-body outline-none" disabled />
                  ) : field.type === 'select' ? (
                    <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-body outline-none" disabled>
                      {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
                    </select>
                  ) : (field.type === 'radio' || field.type === 'checkbox') ? (
                    <div className="space-y-2">
                      {field.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type={field.type} disabled className="text-hive-gold" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-body">{opt}</span>
                        </div>
                      ))}
                    </div>
                  ) : (field.type === 'file' || field.type === 'image') ? (
                    <div className="w-full bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 text-center text-gray-400 text-sm flex flex-col items-center gap-2 font-body">
                      <i className={`fa-solid ${field.type === 'image' ? 'fa-image' : 'fa-cloud-arrow-up'} text-2xl mb-1`}></i>
                      <span>Click to upload {field.label || (field.type === 'image' ? 'Image' : 'File')}</span>
                      {field.type === 'image' && <span className="text-[10px] uppercase font-bold text-gray-300">Supports JPG, PNG, WEBP</span>}
                    </div>
                  ) : null}
                </div>
              ))}
              {fields.length > 0 && (
                <button className="w-full bg-hive-blue text-white py-3 rounded-xl font-bold mt-4 opacity-50 cursor-not-allowed uppercase tracking-widest text-xs">Submit Registration</button>
              )}
            </form>
          </div>

          {/* Right: Builder Tools */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/10">
               <h4 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-widest">Quick Templates</h4>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['name', 'contact', 'gender', 'program', 'college', 'socials', 'tshirt', 'agreements'].map(tmpl => (
                      <button key={tmpl} onClick={() => addTemplate(tmpl)} className="bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-hive-blue dark:text-white text-[10px] font-bold py-2.5 rounded-xl border border-gray-200 dark:border-white/10 uppercase tracking-wide transition-colors">
                          {tmpl}
                      </button>
                  ))}
               </div>
            </div>

            {/* Input Types Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['text', 'textarea', 'email', 'phone', 'url', 'number', 'select', 'radio', 'checkbox', 'date', 'file'].map((type) => (
                <button 
                  key={type}
                  onClick={() => addField(type as FieldType)}
                  className="bg-hive-gold/10 hover:bg-hive-gold hover:text-hive-blue text-hive-gold text-[10px] font-bold uppercase py-2.5 rounded-xl transition-colors border border-hive-gold/20 tracking-wide"
                >
                  + {type}
                </button>
              ))}
              {/* Special Fields */}
              <button onClick={() => addField('image')} className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-colors border border-blue-200 dark:border-blue-800 tracking-wide">+ User Image</button>
              <button onClick={() => addField('static_image')} className="bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-600 dark:text-pink-300 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-colors border border-pink-200 dark:border-pink-800 tracking-wide">+ Banner</button>
              <button onClick={() => addField('description')} className="bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-colors border border-purple-200 dark:border-purple-800 tracking-wide">+ Text Block</button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative group hover:border-hive-gold/50 transition-colors">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveField(index, 'up')} disabled={index === 0} className="p-1.5 bg-gray-100 dark:bg-white/10 rounded text-gray-500 hover:text-hive-blue disabled:opacity-30"><i className="fa-solid fa-arrow-up text-xs"></i></button>
                    <button onClick={() => moveField(index, 'down')} disabled={index === fields.length - 1} className="p-1.5 bg-gray-100 dark:bg-white/10 rounded text-gray-500 hover:text-hive-blue disabled:opacity-30"><i className="fa-solid fa-arrow-down text-xs"></i></button>
                    <button onClick={() => removeField(field.id)} className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded text-red-500 hover:bg-red-100"><i className="fa-solid fa-trash text-xs"></i></button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center pr-24">
                      <span className="text-[9px] font-black uppercase bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-500 tracking-widest">{field.type.replace('_', ' ')}</span>
                      {field.type !== 'description' && field.type !== 'static_image' && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, 'required', e.target.checked)} className="rounded text-hive-gold focus:ring-hive-gold" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Required</span>
                        </label>
                      )}
                    </div>

                    {field.type === 'description' ? (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold uppercase text-gray-400 tracking-wide">Instruction Text</label>
                            <TextEditorToolbar onInsert={(text) => updateField(field.id, 'content', (field.content || '') + text)} />
                        </div>
                        <textarea value={field.content || ''} onChange={(e) => updateField(field.id, 'content', e.target.value)} rows={3} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-body whitespace-pre-wrap outline-none focus:border-hive-gold" placeholder="Enter description here..." />
                      </div>
                    ) : field.type === 'static_image' ? (
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1 tracking-wide">Banner Image Source</label>
                        <div className="flex gap-2 mb-2">
                            <div className="flex-1">
                                <input value={field.content || ''} onChange={(e) => updateField(field.id, 'content', e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-body outline-none focus:border-hive-gold" placeholder="https://..." />
                            </div>
                            <div className="relative">
                                <input type="file" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(field.id, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <button className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-white/10 uppercase tracking-wide">Upload</button>
                            </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-400 mb-1 tracking-wide">Label</label>
                          <input value={field.label || ''} onChange={(e) => updateField(field.id, 'label', e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-body outline-none focus:border-hive-gold" placeholder="Question Title" />
                        </div>
                        {!['select', 'radio', 'checkbox', 'file', 'date', 'image'].includes(field.type) && (
                          <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 tracking-wide">Placeholder</label>
                            <input value={field.placeholder || ''} onChange={(e) => updateField(field.id, 'placeholder', e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-body outline-none focus:border-hive-gold" />
                          </div>
                        )}
                      </div>
                    )}

                    {['select', 'radio', 'checkbox'].includes(field.type) && (
                      <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wide">Options</label>
                        <div className="space-y-2">
                          {field.options?.map((opt, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input value={opt} onChange={(e) => updateOption(field.id, idx, e.target.value)} className="flex-1 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs font-body outline-none focus:border-hive-gold" />
                              <button onClick={() => removeOption(field.id, idx)} className="text-red-400 hover:text-red-500 w-6 flex justify-center"><i className="fa-solid fa-times"></i></button>
                            </div>
                          ))}
                          <button onClick={() => addOption(field.id)} className="text-xs font-bold text-hive-gold hover:underline uppercase tracking-wide">+ Add Option</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Form Strategy Modal ---
const FormStrategyModal = ({ isOpen, onClose, eventTitle, onChoice, existingEvents }: { isOpen: boolean, onClose: () => void, eventTitle: string, onChoice: (strategy: 'scratch' | 'clone', sourceId?: string) => void, existingEvents: HiveEvent[] }) => {
    const [selectedSourceId, setSelectedSourceId] = useState<string>("");

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configure Registration Form">
            <div className="space-y-8">
                <p className="text-gray-600 dark:text-gray-300 text-sm font-body">
                    You've successfully created <strong>{eventTitle}</strong>. How would you like to build its registration form?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Option 1: Scratch */}
                    <button 
                        onClick={() => onChoice('scratch')}
                        className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] hover:border-hive-gold transition-all group text-left flex flex-col items-center text-center shadow-sm hover:shadow-xl"
                    >
                        <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-hive-blue dark:text-white text-2xl shadow-md group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-pencil"></i>
                        </div>
                        <h4 className="font-bold text-hive-blue dark:text-white mb-2 text-lg font-heading">Build from Scratch</h4>
                        <p className="text-xs text-gray-500 font-body">Start with a blank canvas and add fields manually.</p>
                    </button>

                    {/* Option 2: Clone */}
                    <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center text-center shadow-sm">
                        <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-hive-blue dark:text-white text-2xl shadow-md">
                            <i className="fa-solid fa-copy"></i>
                        </div>
                        <h4 className="font-bold text-hive-blue dark:text-white mb-4 text-lg font-heading">Use Existing Template</h4>
                        <div className="space-y-3 w-full">
                            <select 
                                className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none font-body text-hive-blue dark:text-white"
                                value={selectedSourceId}
                                onChange={(e) => setSelectedSourceId(e.target.value)}
                            >
                                <option value="">-- Select Template --</option>
                                {existingEvents.map(e => (
                                    <option key={e.id} value={e.id}>{e.title}</option>
                                ))}
                            </select>
                            <button 
                                disabled={!selectedSourceId}
                                onClick={() => onChoice('clone', selectedSourceId)}
                                className="w-full bg-hive-blue text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-hive-gold hover:text-hive-blue transition-colors shadow-lg"
                            >
                                Clone & Edit
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="text-center pt-2">
                    <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white underline uppercase tracking-widest">Skip Form Configuration</button>
                </div>
            </div>
        </Modal>
    );
};

const AdminPanel: React.FC = () => {
  const { 
    events, addEvent, updateEvent, deleteEvent, 
    team, addMember, updateMember, deleteMember,
    articles, addArticle, updateArticle, deleteArticle,
    meetingMinutes, addMinute, updateMinute, deleteMinute,
    bannerConfig, updateBannerConfig,
    saveFormConfig, getFormConfig, cloneFormConfig
  } = useData();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'articles' | 'team' | 'minutes' | 'banner' | 'forms'>('dashboard');

  // --- Modal States ---
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<HiveEvent | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isMinuteModalOpen, setIsMinuteModalOpen] = useState(false);
  const [editingMinute, setEditingMinute] = useState<MeetingMinute | null>(null);
  
  // Form Strategy State
  const [showFormStrategy, setShowFormStrategy] = useState(false);
  const [recentEventId, setRecentEventId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Invalid credentials');
  };

  const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      const newEvent: HiveEvent = {
          id: editingEvent?.id || `evt_${Date.now()}`,
          title: formData.get('title') as string,
          type: formData.get('type') as EventType,
          status: formData.get('status') as any,
          datetime: {
              start: formData.get('start') as string || new Date().toISOString(),
              end: formData.get('end') as string || new Date().toISOString()
          },
          registrationDeadline: formData.get('registrationDeadline') as string,
          location: {
              name: formData.get('locationName') as string,
              coordinates: formData.get('locationCoords') as string
          },
          capacity: parseInt(formData.get('capacity') as string) || 0,
          registeredCount: editingEvent?.registeredCount || 0,
          tags: (formData.get('tags') as string).split(',').map(s => s.trim()).filter(Boolean),
          image: 'https://picsum.photos/seed/event_new/800/400', // Mock image
          description: formData.get('description') as string,
          organizers: (formData.get('organizers') as string).split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingEvent) {
          updateEvent(newEvent);
          setIsEventModalOpen(false);
      } else {
          addEvent(newEvent);
          setRecentEventId(newEvent.id);
          setIsEventModalOpen(false);
          // Trigger the strategy modal for new events
          setShowFormStrategy(true);
      }
      setEditingEvent(null);
  };

  const handleFormStrategyChoice = (strategy: 'scratch' | 'clone', sourceId?: string) => {
      if (!recentEventId) return;

      if (strategy === 'clone' && sourceId) {
          cloneFormConfig(sourceId, recentEventId);
      }
      
      setActiveTab('forms');
      setShowFormStrategy(false);
  };

  const handleMemberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      const newMember: Member = {
          id: editingMember?.id || `m_${Date.now()}`,
          name: formData.get('name') as string,
          role: formData.get('role') as string,
          image: formData.get('image') as string || `https://picsum.photos/seed/${Date.now()}/200/200`,
          message: formData.get('message') as string,
          year: parseInt(formData.get('year') as string) || new Date().getFullYear(),
          journey: (formData.get('journey') as string).split(',').map(s => s.trim()).filter(Boolean),
          status: formData.get('status') as ContentStatus
      };

      if (editingMember) updateMember(newMember);
      else addMember(newMember);

      setIsMemberModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20">
        <DotBackground className="h-[90vh]">
          <div className="flex flex-col items-center justify-center p-8 bg-white/80 dark:bg-[#0b1129]/90 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/20">
             <div className="w-20 h-20 bg-hive-gold rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg text-white">
                <i className="fa-solid fa-lock"></i>
             </div>
             <h1 className="text-2xl font-bold text-hive-blue dark:text-white mb-2 font-heading">Restricted Access</h1>
             <p className="text-gray-500 text-sm mb-8">Admin authentication required.</p>
             <form onSubmit={handleLogin} className="w-full max-w-xs">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-center text-2xl tracking-[0.5em] font-bold py-3 bg-transparent border-b-2 border-gray-200 focus:border-hive-gold outline-none transition-colors mb-8" placeholder="••••" autoFocus />
                <button type="submit" className="w-full bg-hive-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-hive-gold transition-colors text-xs">Unlock Console</button>
             </form>
          </div>
        </DotBackground>
      </div>
    );
  }

  // New Dashboard Stats Component
  const DashboardStats = () => (
     <BentoGrid className="mb-10">
        <BentoCard 
           title="Total Events" 
           description="Active and past ecosystem events" 
           header={<div className="text-5xl font-black text-hive-blue dark:text-white">{events.length}</div>}
           icon={<i className="fa-solid fa-calendar-day text-hive-gold text-2xl"></i>}
           className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800"
        />
        <BentoCard 
           title="Team Members" 
           description="Committee hierarchy count" 
           header={<div className="text-5xl font-black text-hive-blue dark:text-white">{team.length}</div>}
           icon={<i className="fa-solid fa-users text-green-500 text-2xl"></i>}
           className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800"
        />
        <BentoCard 
           title="Articles Published" 
           description="Knowledge base entries" 
           header={<div className="text-5xl font-black text-hive-blue dark:text-white">{articles.length}</div>}
           icon={<i className="fa-solid fa-newspaper text-purple-500 text-2xl"></i>}
           className="bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800 md:col-span-1"
        />
     </BentoGrid>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#01041a] pt-24 pb-12 px-4 md:px-8 font-sans transition-colors duration-500">
       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
             <div className="bg-white dark:bg-[#0b1129] rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-white/5 sticky top-28">
                <div className="flex items-center gap-3 mb-8 px-2">
                   <div className="w-10 h-10 bg-hive-gold rounded-full flex items-center justify-center text-hive-blue font-bold text-xl"><i className="fa-solid fa-cube"></i></div>
                   <div>
                      <h2 className="font-bold text-hive-blue dark:text-white leading-none">Admin OS</h2>
                      <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">● Online</span>
                   </div>
                </div>
                
                <nav className="space-y-2">
                   {[
                      { id: 'dashboard', label: 'Overview', icon: 'fa-chart-pie' },
                      { id: 'banner', label: 'Banner & Alerts', icon: 'fa-bullhorn' },
                      { id: 'events', label: 'Event Manager', icon: 'fa-calendar-check' },
                      { id: 'team', label: 'Team Hierarchy', icon: 'fa-users-gear' },
                      { id: 'articles', label: 'Insights Blog', icon: 'fa-pen-nib' },
                      { id: 'minutes', label: 'Meeting Logs', icon: 'fa-clipboard-list' },
                      { id: 'forms', label: 'Form Builder', icon: 'fa-shapes' },
                   ].map((item) => (
                      <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                           activeTab === item.id 
                           ? 'bg-hive-blue text-white shadow-lg shadow-hive-blue/20' 
                           : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                      >
                         <i className={`fa-solid ${item.icon} w-5`}></i> {item.label}
                      </button>
                   ))}
                   <div className="h-px bg-gray-100 dark:bg-white/10 my-4"></div>
                   <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      <i className="fa-solid fa-arrow-right-from-bracket w-5"></i> Logout
                   </button>
                </nav>
             </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
             <div className="bg-white/80 dark:bg-[#0b1129]/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-white/5 shadow-sm min-h-[80vh]">
                
                {activeTab === 'dashboard' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h1 className="text-3xl font-black text-hive-blue dark:text-white mb-2 font-heading">System Overview</h1>
                      <p className="text-gray-500 mb-8">Real-time metrics of the Hive ecosystem.</p>
                      <DashboardStats />
                   </div>
                )}

                {/* Generic List Views for CRUD Modules */}
                {['events', 'team', 'articles', 'minutes'].includes(activeTab) && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex justify-between items-end mb-8">
                         <div>
                            <h1 className="text-3xl font-black text-hive-blue dark:text-white capitalize font-heading">{activeTab === 'team' ? 'Hierarchy' : activeTab} Management</h1>
                            <p className="text-gray-500">Manage your {activeTab} content.</p>
                         </div>
                         <button 
                            onClick={() => {
                               if(activeTab === 'events') { setEditingEvent(null); setIsEventModalOpen(true); }
                               if(activeTab === 'team') { setEditingMember(null); setIsMemberModalOpen(true); }
                               if(activeTab === 'articles') { setEditingArticle(null); setIsArticleModalOpen(true); }
                               if(activeTab === 'minutes') { setEditingMinute(null); setIsMinuteModalOpen(true); }
                            }}
                            className="bg-hive-blue text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-hive-gold hover:text-hive-blue transition-all shadow-lg flex items-center gap-2"
                         >
                            <i className="fa-solid fa-plus"></i> Create New
                         </button>
                      </div>

                      <div className="space-y-2">
                         {activeTab === 'events' && events.map(e => <ListItem key={e.id} title={e.title} subtitle={new Date(e.datetime.start).toLocaleDateString()} status={e.status} onDelete={() => deleteEvent(e.id)} onEdit={() => { setEditingEvent(e); setIsEventModalOpen(true); }} />)}
                         {activeTab === 'team' && team.map(m => <ListItem key={m.id} title={m.name} subtitle={`${m.role} (${m.year})`} status={m.status} onDelete={() => deleteMember(m.id)} onEdit={() => { setEditingMember(m); setIsMemberModalOpen(true); }} />)}
                         {activeTab === 'articles' && articles.map(a => <ListItem key={a.id} title={a.title} subtitle={a.author} status={a.status} onDelete={() => deleteArticle(a.id)} onEdit={() => { setEditingArticle(a); setIsArticleModalOpen(true); }} />)}
                         {activeTab === 'minutes' && meetingMinutes.map(m => <ListItem key={m.id} title={m.title} subtitle={new Date(m.date).toLocaleDateString()} status={m.status} onDelete={() => deleteMinute(m.id)} onEdit={() => { setEditingMinute(m); setIsMinuteModalOpen(true); }} />)}
                      </div>
                   </div>
                )}

                {activeTab === 'banner' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h1 className="text-3xl font-black text-hive-blue dark:text-white mb-8 font-heading">Banner Configuration</h1>
                      <BannerForm config={bannerConfig} updateConfig={updateBannerConfig} events={events} />
                   </div>
                )}

                {activeTab === 'forms' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h1 className="text-3xl font-black text-hive-blue dark:text-white mb-2 font-heading">Form Builder</h1>
                      <p className="text-gray-500 mb-8">Design dynamic registration forms for events.</p>
                      <FormBuilder 
                        events={events} 
                        saveForm={saveFormConfig} 
                        getForm={getFormConfig} 
                        selectedEventIdProp={recentEventId || undefined} 
                      />
                   </div>
                )}
             </div>
          </main>
       </div>

       {/* --- Modals --- */}
       <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title={editingEvent ? 'Edit Event' : 'New Event'}>
          <form onSubmit={handleEventSubmit}>
             <EventFormContent event={editingEvent} PipelineControl={PipelineControl} />
             <div className="pt-6 border-t border-gray-100 dark:border-white/5 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 rounded-xl font-bold bg-hive-blue text-white hover:bg-hive-gold hover:text-hive-blue transition-colors shadow-lg">Save Event</button>
             </div>
          </form>
       </Modal>

       <FormStrategyModal 
          isOpen={showFormStrategy} 
          onClose={() => setShowFormStrategy(false)}
          eventTitle={events.find(e => e.id === recentEventId)?.title || "New Event"}
          onChoice={handleFormStrategyChoice}
          existingEvents={events.filter(e => e.id !== recentEventId && getFormConfig(e.id).length > 0)}
       />

       <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title={editingMember ? 'Edit Member' : 'Add Member'}>
          <form onSubmit={handleMemberSubmit}>
             <MemberFormContent member={editingMember} PipelineControl={PipelineControl} />
             <div className="pt-6 border-t border-gray-100 dark:border-white/5 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 rounded-xl font-bold bg-hive-blue text-white hover:bg-hive-gold hover:text-hive-blue transition-colors shadow-lg">Save Member</button>
             </div>
          </form>
       </Modal>
       
       <Modal isOpen={isArticleModalOpen} onClose={() => setIsArticleModalOpen(false)} title={editingArticle ? 'Edit Article' : 'New Article'}>
         <form onSubmit={(e) => { e.preventDefault(); /* Mock submit logic */ setIsArticleModalOpen(false); }}>
            <ArticleFormContent article={editingArticle} PipelineControl={PipelineControl} />
            <div className="pt-6 border-t border-gray-100 dark:border-white/5 mt-6 flex justify-end gap-3">
               <button type="button" onClick={() => setIsArticleModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">Cancel</button>
               <button type="submit" className="px-8 py-3 rounded-xl font-bold bg-hive-blue text-white hover:bg-hive-gold hover:text-hive-blue transition-colors shadow-lg">Save Article</button>
            </div>
         </form>
      </Modal>

      <Modal isOpen={isMinuteModalOpen} onClose={() => setIsMinuteModalOpen(false)} title={editingMinute ? 'Edit Minutes' : 'Log Minutes'}>
         <form onSubmit={(e) => { e.preventDefault(); /* Mock submit logic */ setIsMinuteModalOpen(false); }}>
            <MinuteFormContent minute={editingMinute} PipelineControl={PipelineControl} />
            <div className="pt-6 border-t border-gray-100 dark:border-white/5 mt-6 flex justify-end gap-3">
               <button type="button" onClick={() => setIsMinuteModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">Cancel</button>
               <button type="submit" className="px-8 py-3 rounded-xl font-bold bg-hive-blue text-white hover:bg-hive-gold hover:text-hive-blue transition-colors shadow-lg">Save Log</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default AdminPanel;
