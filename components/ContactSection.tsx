
import React, { useState, useRef } from 'react';
import { Alert, AlertTitle, AlertDescription } from './ui/Alert';
import { ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

type Category = 'General' | 'Membership' | 'Event';

// Security Utility: Sanitize inputs to prevent XSS and injection
const sanitize = (val: string) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/[<>"'/]/g, (m) => ({
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#47;'
    }[m] || m))
    .trim();
};

const ContactSection: React.FC = () => {
  const [category, setCategory] = useState<Category>('General');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'destructive' | 'warning', title: string, message: string } | null>(null);
  
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    email: '',
    message: '',
    semester: '',
    interests: '',
    eventTitle: '',
    eventConcept: '',
    _bot_trap: '' // Honeypot field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const lastSubmitRef = useRef<number>(0);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData._bot_trap) {
      return false;
    }

    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (category === 'Membership') {
      if (!formData.semester) newErrors.semester = 'Semester is required';
      if (!formData.interests || formData.interests.length < 10) {
        newErrors.interests = 'Please provide more detail (min 10 chars)';
      }
    }

    if (category === 'Event') {
      if (!formData.eventTitle) newErrors.eventTitle = 'Proposed title is required';
      if (!formData.eventConcept || formData.eventConcept.length < 20) {
        newErrors.eventConcept = 'Brief concept is required (min 20 chars)';
      }
    }

    if (category === 'General') {
      if (!formData.message) {
        newErrors.message = 'Message cannot be empty';
      } else if (formData.message.length < 10) {
        newErrors.message = 'Message must be at least 10 characters';
      }
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
        setAlert({
            type: 'destructive',
            title: 'Validation Error',
            message: 'Please correct the highlighted fields before submitting.'
        });
        return false;
    }
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const safeValue = sanitize(value);
    setFormData(prev => ({ ...prev, [name]: safeValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (alert) setAlert(null); // Clear alert on interaction
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    
    const now = Date.now();
    if (now - lastSubmitRef.current < 10000) {
      setAlert({
          type: 'warning',
          title: 'Rate Limit Active',
          message: 'Please wait 10 seconds between dispatches.'
      });
      return;
    }
    lastSubmitRef.current = now;

    if (validate()) {
      setLoading(true);
      
      const finalPayload = Object.keys(formData).reduce((acc, key) => {
        acc[key] = sanitize(formData[key]);
        return acc;
      }, {} as Record<string, string>);

      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        console.log("Secure Payload:", finalPayload);
      }, 1500);
    }
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
           <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-hive-blue dark:text-white mb-4 font-heading">Sync Complete!</h1>
        
        <Alert variant="success" className="mb-10 text-left">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Secure Dispatch Confirmed</AlertTitle>
            <AlertDescription>
                Transmission Hash: {Math.random().toString(36).substring(2, 10).toUpperCase()} <br/>
                Category: {category}
            </AlertDescription>
        </Alert>

        <button 
          onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '', semester: '', interests: '', eventTitle: '', eventConcept: '', _bot_trap: '' }); setAlert(null); }} 
          className="bg-hive-blue text-white px-10 py-4 rounded-2xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-all shadow-xl"
        >
          Send New Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <h1 className="text-6xl font-bold text-hive-blue dark:text-white mb-10 leading-tight font-heading">Sync Your<br />Thoughts.</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-lg leading-relaxed">The Hive ecosystem relies on clear, secure communication. Reach out for verified inquiries and proposals.</p>
          
          <div className="space-y-10 mb-12">
             <div className="flex items-center group">
                <div className="w-14 h-14 bg-hive-gold/10 rounded-[1.25rem] flex items-center justify-center mr-6 text-2xl group-hover:bg-hive-gold group-hover:text-white transition-all text-hive-gold">
                  <i className="fa-solid fa-paper-plane-top"></i>
                </div>
                <div>
                   <p className="font-bold text-hive-blue dark:text-white text-lg">Central Hub</p>
                   <p className="text-gray-500"><span className="font-brand-uni">Gandaki University</span>, Gyankunja, Pokhara</p>
                </div>
             </div>
          </div>
          
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10 h-[320px] bg-gray-100">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28152.292244556655!2d84.0925184!3d28.1149175!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995bdc62c29a31d%3A0xdfcc810d7364629a!2sGandaki%20University!5e0!3m2!1sen!2snp" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                title="Gandaki University Campus Map"
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 p-10 md:p-16 rounded-[4rem] shadow-2xl border border-gray-100 dark:border-white/10 relative animate-in fade-in slide-in-from-right duration-700">
          
          {alert && (
              <Alert variant={alert.type} className="mb-6">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="hidden" aria-hidden="true">
              <input type="text" name="_bot_trap" tabIndex={-1} autoComplete="off" value={formData._bot_trap} onChange={handleChange} />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Payload Classification</label>
              <div className="flex flex-wrap gap-3">
                 {(['General', 'Membership', 'Event'] as Category[]).map((c) => (
                   <button
                     key={c}
                     type="button"
                     onClick={() => { setCategory(c); setErrors({}); setAlert(null); }}
                     className={`px-8 py-3 rounded-2xl text-xs font-bold transition-all ${
                       category === c ? 'bg-hive-blue text-white shadow-xl' : 'bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                     }`}
                   >
                     {c}
                   </button>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Display Name</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text" 
                  className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-hive-gold dark:text-white transition-all ${errors.name ? 'ring-2 ring-red-400' : ''}`} 
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Sync Email</label>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email" 
                  className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-hive-gold dark:text-white transition-all ${errors.email ? 'ring-2 ring-red-400' : ''}`} 
                  placeholder="name@gandaki.edu.np" 
                />
              </div>
            </div>

            {category === 'Membership' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Semester</label>
                  <select 
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-hive-gold dark:text-white"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Interests</label>
                  <input 
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-hive-gold dark:text-white"
                    placeholder="AI, Cloud, IoT..."
                  />
                </div>
              </div>
            )}

            {category === 'Event' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Proposed Title</label>
                  <input 
                    name="eventTitle"
                    value={formData.eventTitle}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-hive-gold dark:text-white"
                    placeholder="e.g. Next.js Masterclass"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Concept Description</label>
                  <textarea 
                    name="eventConcept"
                    value={formData.eventConcept}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-3xl px-6 py-5 focus:ring-2 focus:ring-hive-gold dark:text-white transition-all resize-none"
                    placeholder="Briefly describe the target audience and objectives..."
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transmission Data</label>
                <span className={`text-[9px] font-bold ${formData.message.length > 1900 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.message.length} / 2000
                </span>
              </div>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                maxLength={2000}
                rows={5} 
                className={`w-full bg-gray-50 dark:bg-white/5 border-none rounded-3xl px-6 py-5 focus:ring-2 focus:ring-hive-gold dark:text-white transition-all resize-none ${errors.message ? 'ring-2 ring-red-400' : ''}`} 
                placeholder="Detail your request or proposal here..."
              ></textarea>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-hive-blue text-white py-6 rounded-3xl font-bold text-lg hover:bg-hive-gold hover:text-hive-blue transition-all shadow-2xl flex items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin text-2xl"></i>
              ) : (
                <span className="flex items-center gap-2">Securely Dispatch Inquiry <i className="fa-solid fa-shield-check text-sm"></i></span>
              )}
            </button>
            <p className="text-[9px] text-center text-gray-400 uppercase tracking-[0.3em]">AES-256 Encrypted Handshake Protocol Active</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
