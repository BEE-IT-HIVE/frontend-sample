
import React, { useState, useEffect, useRef } from 'react';
import { HiveEvent, RegistrationForm } from '../types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/Accordion';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';
import { AlertCircle, CheckCircle2, QrCode, Ticket, Download } from 'lucide-react';

interface EventRegistrationProps {
  event: HiveEvent;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormState: RegistrationForm = {
  step: 1,
  firstName: '',
  lastName: '',
  email: '',
  studentId: '',
  semester: '1',
  dietary: '',
  agreedToTerms: false,
  agreedToConduct: false,
};

const sanitize = (val: string) => {
  if (typeof val !== 'string') return val;
  return val.replace(/[<>"'/]/g, (m) => ({
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#47;'
  }[m] || m));
};

const EventRegistration: React.FC<EventRegistrationProps> = ({ event, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<RegistrationForm>(() => {
    const saved = localStorage.getItem(`draft_reg_${event.id}`);
    return saved ? JSON.parse(saved) : initialFormState;
  });
  
  const [activeAccordion, setActiveAccordion] = useState<string>("item-1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [ticketData, setTicketData] = useState<{id: string, qrUrl: string} | null>(null);
  const [alert, setAlert] = useState<{ type: 'destructive' | 'warning', title: string, message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const lastSubmitRef = useRef<number>(0);
  const isWaitlist = event.registeredCount >= event.capacity;

  useEffect(() => {
    if (!isCompleted) {
        const timer = setInterval(() => {
        localStorage.setItem(`draft_reg_${event.id}`, JSON.stringify(formData));
        }, 15000);
        return () => clearInterval(timer);
    }
  }, [formData, event.id, isCompleted]);

  const updateField = (field: keyof RegistrationForm, value: any) => {
    const safeValue = typeof value === 'string' ? sanitize(value) : value;
    setFormData(prev => ({ ...prev, [field]: safeValue }));
    
    // Clear specific error when user types
    if (errors[field]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }
    if(alert) setAlert(null);
  };

  const validateStep = (step: string) => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      if (step === 'item-1') {
          if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
          if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
          if (!formData.email.trim()) {
              newErrors.email = "Email is required";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
              newErrors.email = "Invalid email format";
          }
      }

      if (step === 'item-2') {
          if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
          else if (formData.studentId.length < 5) newErrors.studentId = "Invalid Student ID format";
      }

      if (step === 'item-4') {
          if (!formData.agreedToTerms) newErrors.agreedToTerms = "Required";
          if (!formData.agreedToConduct) newErrors.agreedToConduct = "Required";
      }

      if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          isValid = false;
      }

      return isValid;
  }

  const isStepComplete = (step: string) => {
      // Basic check for visual indicators, distinct from strict validation
      switch(step) {
          case 'item-1': return !!(formData.firstName && formData.lastName && formData.email);
          case 'item-2': return !!(formData.studentId);
          case 'item-4': return !!(formData.agreedToTerms && formData.agreedToConduct);
          default: return true;
      }
  };

  const handleNext = (currentStep: string, nextStep: string) => {
      if(validateStep(currentStep)) {
          setActiveAccordion(nextStep);
          setAlert(null);
          try {
            const stepNum = parseInt(nextStep.split('-')[1]);
            setFormData(prev => ({ ...prev, step: isNaN(stepNum) ? prev.step : stepNum }));
          } catch(e) {
            console.error("Step parsing error", e);
          }
      } else {
          setAlert({
              type: 'destructive',
              title: 'Validation Error',
              message: 'Please correct the highlighted fields before proceeding.'
          });
      }
  }

  const handleSubmit = async () => {
    if (!validateStep('item-4')) {
        setAlert({ type: 'destructive', title: 'Action Required', message: 'You must agree to the Terms and Code of Conduct.' });
        return;
    }

    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) {
      setAlert({ type: 'warning', title: 'Rate Limit', message: 'Please wait a moment before submitting again.' });
      return;
    }
    lastSubmitRef.current = now;

    setIsSubmitting(true);
    
    try {
      // Simulate API Call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate Unique Ticket ID
      const uniqueId = `TKT-${event.id.split('_')[1]}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // QR Code Data (JSON stringified)
      const qrPayload = JSON.stringify({
          event: event.id,
          ticket: uniqueId,
          attendee: `${formData.firstName} ${formData.lastName}`,
          id: formData.studentId
      });
      
      // Generate QR URL (Using a standard reliable API for demo purposes)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}`;

      const finalTicket = { id: uniqueId, qrUrl };
      setTicketData(finalTicket);

      // Secure Store Simulation
      localStorage.setItem(`hive_ticket_${uniqueId}`, JSON.stringify({
          ...formData,
          ticketId: uniqueId,
          eventId: event.id,
          timestamp: new Date().toISOString()
      }));
      
      localStorage.removeItem(`draft_reg_${event.id}`);
      setIsSubmitting(false);
      setIsCompleted(true);
    } catch (err) {
      setIsSubmitting(false);
      setAlert({
          type: 'destructive',
          title: 'Submission Failed',
          message: 'Network error or server timeout. Your data is saved. Please try again.'
      });
    }
  };

  const getProgress = () => {
    if (isCompleted) return 100;
    if (!activeAccordion) return 20; 
    const parts = activeAccordion.split('-');
    if (parts.length < 2) return 20;
    const step = parseInt(parts[1]);
    return isNaN(step) ? 20 : (step / 5) * 100;
  };

  const StepHeader = ({ title, id }: { title: string, id: string }) => (
    <div className="flex items-center gap-2 w-full">
      <span className={errors[id] ? "text-red-500" : ""}>{title}</span>
      {isStepComplete(id) && id !== 'item-5' && !errors[id] && (
        <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto mr-4" />
      )}
      {Object.keys(errors).some(k => k && id === 'item-1' && ['firstName','lastName','email'].includes(k)) && (
         <AlertCircle className="w-4 h-4 text-red-500 ml-auto mr-4" />
      )}
    </div>
  );

  const InputError = ({ field }: { field: string }) => (
      errors[field] ? <span className="text-[10px] text-red-500 font-bold uppercase tracking-wide mt-1 block animate-in slide-in-from-left-1">{errors[field]}</span> : null
  );

  if (isCompleted && ticketData) {
    return (
      <div className="fixed inset-0 z-[120] bg-hive-blue/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#0b1129] max-w-md w-full rounded-[3rem] p-8 text-center shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col items-center">
           {/* Confetti / Celebration Decoration */}
           <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
           
           <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
           </div>
           
           <h2 className="text-2xl font-bold text-hive-blue dark:text-white mb-2 font-heading">You're In!</h2>
           <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
             Registration confirmed for <strong>{event.title}</strong>.
           </p>

           {/* Ticket Card */}
           <div className="bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-6 w-full mb-6 relative">
              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-white dark:bg-[#0b1129] rounded-full -translate-y-1/2 border-r border-gray-200 dark:border-white/10"></div>
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-white dark:bg-[#0b1129] rounded-full -translate-y-1/2 border-l border-gray-200 dark:border-white/10"></div>
              
              <div className="flex flex-col items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                      <img src={ticketData.qrUrl} alt="Event QR" className="w-32 h-32 object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Ticket ID</p>
                      <p className="font-mono text-lg font-bold text-hive-gold tracking-wider">{ticketData.id}</p>
                  </div>
              </div>
           </div>
           
           <div className="flex flex-col gap-3 w-full">
               <button className="w-full bg-gray-100 dark:bg-white/10 text-hive-blue dark:text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" /> Save Ticket
               </button>
               <button 
                 onClick={onSuccess} 
                 className="w-full bg-hive-blue text-white py-3 rounded-2xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-all shadow-xl uppercase tracking-widest text-xs"
               >
                  Done
               </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-hive-blue/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0b1129] max-w-xl w-full rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[95vh] border border-white/10">
        
        {/* Header */}
        <div className="p-8 bg-hive-blue text-white flex justify-between items-center relative overflow-hidden shrink-0">
           <div className="absolute inset-0 bg-hive-gold/5"></div>
           <div className="relative z-10">
              <h2 className="font-bold text-xl font-heading">{event.title}</h2>
              <p className="text-[10px] text-hive-gold font-bold uppercase tracking-widest mt-1">Secure Registration</p>
           </div>
           <button onClick={onClose} className="hover:text-hive-gold transition-colors text-2xl relative z-10"><i className="fa-solid fa-xmark"></i></button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 px-8 pt-8">
           <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
              <span>Step {formData.step} of 5</span>
              <span className="text-hive-gold">{isWaitlist ? 'Waitlist' : 'Available'}</span>
           </div>
           <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-hive-gold transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,170,13,0.5)]"
                style={{ width: `${getProgress()}%` }}
              ></div>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-8 pb-8 overflow-y-auto flex-grow bg-white dark:bg-transparent custom-scrollbar">
           
           {alert && (
               <Alert variant={alert.type} className="mb-4">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>{alert.title}</AlertTitle>
                   <AlertDescription>{alert.message}</AlertDescription>
               </Alert>
           )}

           <Accordion type="single" value={activeAccordion} onValueChange={(val) => {
               if (val) setActiveAccordion(val); 
           }} collapsible className="w-full">
              
              {/* Step 1: ID */}
              <AccordionItem value="item-1">
                <AccordionTrigger><StepHeader title="1. Personal Info" id="item-1" /></AccordionTrigger>
                <AccordionContent>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                          <input 
                            className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none`}
                            placeholder="First Name *"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                          />
                          <InputError field="firstName" />
                      </div>
                      <div>
                          <input 
                            className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none`}
                            placeholder="Last Name *"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                          />
                          <InputError field="lastName" />
                      </div>
                      <div className="sm:col-span-2">
                          <input 
                            className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none`}
                            placeholder="University Email *"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                          />
                          <InputError field="email" />
                      </div>
                   </div>
                   <button onClick={() => handleNext('item-1', 'item-2')} className="mt-4 w-full bg-gray-100 dark:bg-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Continue</button>
                </AccordionContent>
              </AccordionItem>

              {/* Step 2: Academic */}
              <AccordionItem value="item-2">
                <AccordionTrigger><StepHeader title="2. Academic Details" id="item-2" /></AccordionTrigger>
                <AccordionContent>
                   <div className="space-y-4 pt-2">
                      <div>
                          <input 
                            className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.studentId ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none`}
                            placeholder="Student ID (e.g. BIT-2023-01) *"
                            value={formData.studentId}
                            onChange={(e) => updateField('studentId', e.target.value)}
                          />
                          <InputError field="studentId" />
                      </div>
                      <select 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none"
                        value={formData.semester}
                        onChange={(e) => updateField('semester', e.target.value)}
                      >
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                   </div>
                   <button onClick={() => handleNext('item-2', 'item-3')} className="mt-4 w-full bg-gray-100 dark:bg-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Continue</button>
                </AccordionContent>
              </AccordionItem>

              {/* Step 3: Needs */}
              <AccordionItem value="item-3">
                <AccordionTrigger><StepHeader title="3. Specific Needs (Optional)" id="item-3" /></AccordionTrigger>
                <AccordionContent>
                   <textarea 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold resize-none outline-none"
                      rows={3}
                      placeholder="Dietary restrictions or physical access requirements..."
                      value={formData.dietary}
                      onChange={(e) => updateField('dietary', e.target.value)}
                   />
                   <button onClick={() => handleNext('item-3', 'item-4')} className="mt-4 w-full bg-gray-100 dark:bg-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Continue</button>
                </AccordionContent>
              </AccordionItem>

              {/* Step 4: Legal */}
              <AccordionItem value="item-4">
                <AccordionTrigger><StepHeader title="4. Legal & Conduct" id="item-4" /></AccordionTrigger>
                <AccordionContent>
                   <div className="space-y-4 pt-2">
                      <div className={`p-3 rounded-xl border transition-colors ${errors.agreedToTerms ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-white/5 hover:border-hive-gold'}`}>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={formData.agreedToTerms} onChange={(e) => updateField('agreedToTerms', e.target.checked)} className="mt-1 text-hive-gold focus:ring-hive-gold" />
                            <span className="text-xs text-gray-600 dark:text-gray-300">I consent to my data being processed for event logistics. *</span>
                          </label>
                      </div>
                      <div className={`p-3 rounded-xl border transition-colors ${errors.agreedToConduct ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-white/5 hover:border-hive-gold'}`}>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={formData.agreedToConduct} onChange={(e) => updateField('agreedToConduct', e.target.checked)} className="mt-1 text-hive-gold focus:ring-hive-gold" />
                            <span className="text-xs text-gray-600 dark:text-gray-300">I agree to the Code of Conduct. *</span>
                          </label>
                      </div>
                   </div>
                   <button onClick={() => handleNext('item-4', 'item-5')} className="mt-4 w-full bg-gray-100 dark:bg-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Review Application</button>
                </AccordionContent>
              </AccordionItem>

              {/* Step 5: Review */}
              <AccordionItem value="item-5">
                <AccordionTrigger><StepHeader title="5. Final Review" id="item-5" /></AccordionTrigger>
                <AccordionContent>
                   <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl space-y-2 mb-4 border border-gray-100 dark:border-white/5">
                      <p className="flex justify-between text-xs"><span className="text-gray-400 font-bold uppercase">Name:</span> <span className="font-medium text-hive-blue dark:text-white">{formData.firstName} {formData.lastName}</span></p>
                      <p className="flex justify-between text-xs"><span className="text-gray-400 font-bold uppercase">ID:</span> <span className="font-medium text-hive-blue dark:text-white">{formData.studentId}</span></p>
                      <p className="flex justify-between text-xs"><span className="text-gray-400 font-bold uppercase">Status:</span> <span className={isWaitlist ? 'text-orange-500 font-bold' : 'text-green-500 font-bold'}>{isWaitlist ? 'Waitlist' : 'Confirmed'}</span></p>
                   </div>
                   <button 
                     onClick={handleSubmit} 
                     disabled={isSubmitting}
                     className="w-full bg-hive-blue text-white py-4 rounded-2xl font-bold hover:bg-hive-gold hover:text-hive-blue transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                   >
                     {isSubmitting ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <Ticket className="w-4 h-4" />}
                     {isWaitlist ? 'Secure Waitlist Spot' : 'Generate Ticket'}
                   </button>
                </AccordionContent>
              </AccordionItem>

           </Accordion>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
