
import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  "Upcoming Events",
  "How to Join?",
  "Who is the President?",
  "Where is the office?",
  "Show me photos"
];

interface AssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const Assistant: React.FC<AssistantProps> = ({ isOpen, onClose }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: "Namaste! I'm the Hive Assistant. I can help you find events, learn about our team, or guide you through the portal. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Intelligent Response Logic (Rule-based)
  const getBotResponse = (text: string): string => {
    const lower = text.toLowerCase().trim();

    // 1. Complex Pattern Matching
    if (lower.includes('register') && lower.includes('event')) return "To register, visit the 'Events' page, click on any 'Upcoming' event card, and fill out the registration form. It's fully automated!";
    if (lower.includes('download') && lower.includes('photo')) return "You can download photos from the 'Gallery'. Select the 'Photos' tab, switch to 'Selection Mode', pick your images, and click Download.";

    // 2. Keyword Scoring System
    const knowledgeBase = [
      {
        keys: ['hi', 'hello', 'hey', 'greetings', 'namaste', 'hola', 'start'],
        resp: "Namaste! Welcome to BEE-IT HIVE. Feel free to ask about our events, team, or mission."
      },
      {
        keys: ['bye', 'goodbye', 'see you', 'end', 'close'],
        resp: "Goodbye! Tech Minds, Future Finds. See you soon!"
      },
      {
        keys: ['president', 'nirajan', 'dhakal', 'leader', 'head'],
        resp: "Nirajan Dhakal is the President of BEE-IT HIVE. He leads the executive committee and oversees all club operations."
      },
      {
        keys: ['coordinator', 'amrit', 'poudel'],
        resp: "Amrit Poudel is our Coordinator. He manages internal affairs and ensures smooth execution of our programs."
      },
      {
        keys: ['saroj', 'giri', 'faculty', 'advisor', 'teacher', 'sir'],
        resp: "Er. Saroj Giri is our Faculty Advisor. He provides academic guidance and connects us with industry standards."
      },
      {
        keys: ['team', 'committee', 'members', 'board', 'executive'],
        resp: "Our team consists of passionate BIT students. You can see the full hierarchy, from the President to General Members, in the 'Team' section."
      },
      {
        keys: ['event', 'hackathon', 'workshop', 'summit', 'program', 'schedule', 'calendar'],
        resp: "We host Hackathons, Workshops, and Socials! Check the 'Events' page for the 'Global Innovation Summit 2025' and 'BIT Hackathon 3.0'."
      },
      {
        keys: ['join', 'membership', 'member', 'sign up', 'register', 'application'],
        resp: "Membership is open to all BIT students at Gandaki University! Go to the 'Contact' page and select 'Membership' in the inquiry form to apply."
      },
      {
        keys: ['location', 'where', 'address', 'map', 'place', 'office'],
        resp: "We are located at Gandaki University, Gyankunja, Pokhara-32. There's a map in the footer if you need directions!"
      },
      {
        keys: ['contact', 'email', 'phone', 'message', 'reach', 'call'],
        resp: "You can email us at bee-it.hive@gandakiuniversity.edu.np. For quick inquiries, use the Assistant or the Contact form."
      },
      {
        keys: ['gallery', 'photo', 'picture', 'video', 'cinematic', 'memory', 'images'],
        resp: "Our 'Gallery' features high-res photos and event cinematics. You can even batch download images for your collection."
      },
      {
        keys: ['about', 'mission', 'vision', 'goal', 'objective'],
        resp: "BEE-IT HIVE is the student-led IT ecosystem of Gandaki University. Our mission is to promote technical education through hands-on collaboration."
      },
      {
        keys: ['website', 'developer', 'created', 'made', 'tech stack'],
        resp: "This portal is built with React, Tailwind CSS, and TypeScript. It was developed by the BEE-IT Technical Committee."
      }
    ];

    let bestMatch = null;
    let maxScore = 0;

    knowledgeBase.forEach(entry => {
      let score = 0;
      entry.keys.forEach(k => {
        if (lower.includes(k)) score++;
      });
      // Boost exact matches
      if (entry.keys.includes(lower)) score += 2;
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = entry;
      }
    });

    if (bestMatch && maxScore > 0) return bestMatch.resp;

    // 3. Fallback
    return "I'm not sure about that specific detail yet. Try asking about 'Events', 'Team', 'Gallery', or 'Contact info'. I'm here to help!";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: text }]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay based on query complexity
    const delay = Math.min(1000, 500 + text.length * 20);

    setTimeout(() => {
      const response = getBotResponse(text);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
      setIsTyping(false);
    }, delay);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  // Only render if isOpen is true
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-28 right-6 md:right-8 z-[100] font-sans">
      <div className="mb-4 bg-white dark:bg-[#0b1129] w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right">
        {/* Header */}
        <div className="bg-hive-blue p-4 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-hive-gold/10"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-hive-blue shadow-lg border-2 border-hive-gold">
              <i className="fa-solid fa-robot text-lg"></i>
            </div>
            <div>
              <span className="font-bold block text-sm">Hive Assistant</span>
              <span className="text-[10px] text-gray-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
              </span>
            </div>
          </div>
          <button onClick={onClose} className="hover:text-hive-gold transition-colors relative z-10 p-2">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        
        {/* Chat Area */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-white/5 scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-hive-gold/20 flex items-center justify-center text-[10px] mr-2 text-hive-gold mt-1 shrink-0">
                  <i className="fa-solid fa-robot"></i>
                </div>
              )}
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-hive-blue text-white rounded-br-none' 
                  : 'bg-white dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-white/5'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start items-center">
               <div className="w-6 h-6 rounded-full bg-hive-gold/20 flex items-center justify-center text-[10px] mr-2 text-hive-gold">
                  <i className="fa-solid fa-robot"></i>
                </div>
              <div className="bg-white dark:bg-white/10 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-white/5">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {!isTyping && messages.length < 4 && (
           <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 dark:border-white/5">
              {SUGGESTIONS.map(s => (
                 <button 
                   key={s} 
                   onClick={() => handleSend(s)}
                   className="whitespace-nowrap px-3 py-1 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full text-[10px] font-bold text-hive-blue dark:text-gray-300 hover:bg-hive-gold hover:text-hive-blue hover:border-hive-gold transition-colors"
                 >
                    {s}
                 </button>
              ))}
           </div>
        )}

        {/* Input Area */}
        <form onSubmit={onSubmit} className="p-3 bg-white dark:bg-[#0b1129] border-t border-gray-100 dark:border-white/10 flex gap-2">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-gray-100 dark:bg-white/10 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-hive-gold dark:text-white placeholder-gray-400"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-hive-gold text-hive-blue rounded-xl flex items-center justify-center hover:bg-hive-light-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
