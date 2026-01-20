
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimation } from 'framer-motion';
import { Page, AppSettings } from '../types';
import { useData } from '../context/DataContext';
import { Send, X, Calendar, Users, Terminal, Gamepad2, Heart, Zap, Sparkles, Settings, Search, Image as ImageIcon } from 'lucide-react';

// --- Types & Constants ---

type Emotion = 'neutral' | 'happy' | 'sad' | 'excited' | 'alert' | 'denied' | 'confused' | 'love' | 'sassy' | 'thinking' | 'winking' | 'sleeping' | 'dizzy' | 'suspicious' | 'matrix';
type Mode = 'chat' | 'trivia' | 'rps' | 'number_guess' | 'scramble';

interface FloatingBeeProps {
  onPageChange: (page: Page) => void;
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const SUGGESTIONS = [
  { label: "Play Games", icon: Gamepad2 },
  { label: "/help", icon: Terminal },
  { label: "Search", icon: Search },
  { label: "Gallery", icon: ImageIcon },
  { label: "Events", icon: Calendar },
];

const TRIVIA_QUESTIONS = [
  { q: "What does HTML stand for?", a: ["Hyper Text Markup Language", "High Tech Multi Language"], correct: 0 },
  { q: "Which symbol is used for comments in Python?", a: ["//", "#"], correct: 1 },
  { q: "What is the complexity of Binary Search?", a: ["O(n)", "O(log n)"], correct: 1 },
  { q: "Who created Linux?", a: ["Steve Jobs", "Linus Torvalds"], correct: 1 },
  { q: "Is Java short for JavaScript?", a: ["Yes", "No! Absolutely not."], correct: 1 },
];

const SCRAMBLE_WORDS = [
  "ALGORITHM", "COMPILER", "DATABASE", "ENCRYPTION", "FRAMEWORK", 
  "GIGABYTE", "HEURISTIC", "INTERFACE", "JAVASCRIPT", "KERNEL", 
  "LINUX", "MALWARE", "NETWORK", "OPERATING", "PROTOCOL"
];

const TECH_JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "I would tell you a UDP joke, but you might not get it.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem."
];

const TECH_QUOTES = [
  "Talk is cheap. Show me the code. – Linus Torvalds",
  "Programs must be written for people to read, and only incidentally for machines to execute. – Harold Abelson",
  "Truth can only be found in one place: the code. – Robert C. Martin",
  "Code is like humor. When you have to explain it, it’s bad. – Cory House",
  "Simplicity is the soul of efficiency. – Austin Freeman"
];

const COMMAND_DOCS: Record<string, { desc: string, usage: string, example: string }> = {
  ls: { desc: "Lists all available pages and directories in the Hive Portal.", usage: "ls", example: "ls" },
  cd: { desc: "Navigates to a specific page. Use '..' to go home.", usage: "cd [page_name]", example: "cd events" },
  search: { desc: "Performs a global search across events, team members, and articles.", usage: "search [query]", example: "search hackathon" },
  events: { desc: "Lists the next 3 upcoming events sorted by date.", usage: "events", example: "events" },
  team: { desc: "Displays core executive committee members.", usage: "team", example: "team" },
  blog: { desc: "Shows the latest published article/insight.", usage: "blog", example: "blog" },
  gallery: { desc: "Fetches a random image from the media gallery.", usage: "gallery", example: "gallery" },
  calc: { desc: "Evaluates a mathematical expression.", usage: "calc [expression]", example: "calc 2 + 2 * 4" },
  weather: { desc: "Displays current mock weather conditions in Pokhara.", usage: "weather", example: "weather" },
  quote: { desc: "Returns a random tech-related wisdom quote.", usage: "quote", example: "quote" },
  play: { desc: "Starts a mini-game (rps, number, scramble, trivia).", usage: "play [game_name]", example: "play trivia" },
  matrix: { desc: "Toggles the immersive Matrix digital rain simulation.", usage: "matrix", example: "matrix" },
  toggle: { desc: "Switches between Light and Dark themes.", usage: "toggle theme", example: "toggle theme" },
  sys: { desc: "Displays system diagnostics and status.", usage: "sys", example: "sys" },
  clear: { desc: "Clears the terminal chat history.", usage: "clear", example: "clear" },
  roll: { desc: "Rolls a 6-sided die.", usage: "roll", example: "roll" },
  flip: { desc: "Flips a coin (Heads/Tails).", usage: "flip", example: "flip" },
  whoami: { desc: "Displays current user session info.", usage: "whoami", example: "whoami" },
};

// --- Audio Engine (Granular Synthesis) ---

const useDroidVoice = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isSpeakingRef = useRef(false);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const generateTone = useCallback((freq: number, type: OscillatorType, duration: number, vol = 0.05) => {
    if (!audioCtxRef.current) initAudio();
    const ctx = audioCtxRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [initAudio]);

  const speak = useCallback(async (durationMs: number) => {
      isSpeakingRef.current = true;
      const startTime = Date.now();
      
      const speakLoop = () => {
          if (!isSpeakingRef.current || Date.now() - startTime > durationMs) {
              isSpeakingRef.current = false;
              return;
          }
          
          const freq = 400 + Math.random() * 400;
          const type = Math.random() > 0.5 ? 'square' : 'sawtooth';
          generateTone(freq, type, 0.08, 0.03);

          setTimeout(speakLoop, 80 + Math.random() * 50);
      };
      
      speakLoop();
  }, [generateTone]);

  const stopSpeaking = useCallback(() => {
      isSpeakingRef.current = false;
  }, []);

  const playHappy = () => {
      generateTone(880, 'sine', 0.1);
      setTimeout(() => generateTone(1100, 'square', 0.1), 100);
      setTimeout(() => generateTone(1320, 'sine', 0.2), 200);
  };

  const playSad = () => {
      generateTone(600, 'triangle', 0.4);
      setTimeout(() => generateTone(400, 'triangle', 0.6), 300);
  };

  const playAlert = () => {
      generateTone(1500, 'sawtooth', 0.1, 0.05);
      setTimeout(() => generateTone(1500, 'sawtooth', 0.1, 0.05), 150);
  };

  const playProcessing = () => {
      generateTone(2000, 'sine', 0.05, 0.02);
  };

  return { speak, stopSpeaking, playHappy, playSad, playAlert, playProcessing, initAudio, isSpeakingRef };
};

// --- Main Component ---

const FloatingBee: React.FC<FloatingBeeProps> = ({ onPageChange, settings, updateSettings }) => {
  const { events, team, articles, albums } = useData(); 
  const [isOpen, setIsOpen] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const [isHovered, setIsHovered] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Game States
  const [mode, setMode] = useState<Mode>('chat');
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [scrambleData, setScrambleData] = useState<{word: string, scrambled: string} | null>(null);
  
  const { speak, stopSpeaking, playHappy, playSad, playAlert, playProcessing, initAudio } = useDroidVoice();

  const [messages, setMessages] = useState<{
    role: 'user' | 'assistant', 
    text: string, 
    type?: 'cmd' | 'text' | 'matrix', 
    action?: { label: string, page: Page },
    image?: string,
    links?: { label: string, url: string, icon: string, isBrand?: boolean }[]
  }[]>([
    { role: 'assistant', text: "HIVE DROID v3.2 Online. 🤖 \nI have deep access to the Hive database.\nTry '/help' to see my expanded capabilities." }
  ]);
  const [input, setInput] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation(); 
  const chassisControls = useAnimation(); 

  // Eye Tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Physics Vars
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Advanced Antenna Physics
  const antennaSpringConfig = { damping: 12, stiffness: 150, mass: 0.8 };
  const antennaX = useSpring(x, antennaSpringConfig);
  const antennaY = useSpring(y, antennaSpringConfig);
  
  const antennaBendX_L = useTransform(antennaX, (latest) => (latest - x.get()) * 0.5);
  const antennaBendY_L = useTransform(antennaY, (latest) => (latest - y.get()) * 0.5);
  const antennaBendX_R = useTransform(antennaX, (latest) => (latest - x.get()) * 0.6); // Asymmetry
  const antennaBendY_R = useTransform(antennaY, (latest) => (latest - y.get()) * 0.6);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Eye Tracking Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const beeCenterX = rect.left + rect.width / 2;
            const beeCenterY = rect.top + rect.height / 2;
            const dx = Math.max(-1, Math.min(1, (e.clientX - beeCenterX) / (window.innerWidth / 2)));
            const dy = Math.max(-1, Math.min(1, (e.clientY - beeCenterY) / (window.innerHeight / 2)));
            setMousePos({ x: dx * 6, y: dy * 6 });
        }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Zoomies
  useEffect(() => {
    const zoomiesInterval = setInterval(() => {
       if (!isOpen && !isZooming && Math.random() > 0.85) {
          triggerZoomies();
       }
    }, 45000); 
    return () => clearInterval(zoomiesInterval);
  }, [isOpen, isZooming]);

  // --- Animation Routines ---

  const triggerZoomies = async () => {
      if (isOpen) return;
      setIsZooming(true);
      setCurrentEmotion('excited');
      playHappy();

      await controls.start({
          x: [0, -300, 200, -100, 0],
          y: [0, -200, 100, -50, 0],
          rotate: [0, -20, 20, -10, 0],
          scale: [1, 1.1, 0.9, 1],
          transition: { duration: 2.5, ease: "easeInOut" }
      });

      setCurrentEmotion('neutral');
      setIsZooming(false);
  };

  const emote = (emo: Emotion) => {
      setCurrentEmotion(emo);
      if (emo === 'happy' || emo === 'excited') playHappy();
      else if (emo === 'sad' || emo === 'denied') playSad();
      else if (emo === 'alert' || emo === 'suspicious') playAlert();
      else playProcessing();

      if (emo === 'happy') {
          chassisControls.start({ y: [0, -15, 0, -10, 0], transition: { duration: 0.5 } });
      } else if (emo === 'sad') {
          chassisControls.start({ rotate: [0, -5, 5, 0], transition: { duration: 1 } });
      } else if (emo === 'dizzy') {
          chassisControls.start({ rotate: 360, transition: { duration: 1 } });
      }
  };

  const triggerAccessDenied = () => {
      emote('denied');
      chassisControls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
      addMessage("🚫 ACCESS DENIED: Admin privileges required.", 'cmd');
      setTimeout(() => setCurrentEmotion('neutral'), 3000);
  };

  // --- Logic Engine (Terminal v3.2) ---

  const addMessage = (text: string, type: 'text' | 'cmd' | 'matrix' = 'text', role: 'assistant' | 'user' = 'assistant', extra?: any) => {
      setMessages(prev => [...prev, { role, text, type, ...extra }]);
      if (role === 'assistant') {
          const duration = Math.min(2000, 500 + text.length * 30);
          setIsSpeaking(true);
          speak(duration);
          setTimeout(() => setIsSpeaking(false), duration);
      }
  };

  const handleRedirect = (page: Page) => {
    if (page === Page.Admin) { triggerAccessDenied(); return; }
    playProcessing();
    onPageChange(page);
  };

  const handleCommand = async (cmd: string, args: string[]) => {
      const command = cmd.toLowerCase();
      
      switch(command) {
          case 'help':
              if (args[0]) {
                  const cmdKey = args[0].toLowerCase().replace('/', '');
                  const doc = COMMAND_DOCS[cmdKey];
                  if (doc) {
                      return `> MAN PAGE: ${cmdKey.toUpperCase()}
---------------------------
${doc.desc}

Usage:   ${doc.usage}
Example: ${doc.example}`;
                  }
                  return `Error: No manual entry for '${cmdKey}'. Available commands listed in '/help'.`;
              }

              return `TERMINAL v3.2 COMMANDS
========================
Type '/help [command]' for details (e.g., '/help search')

[/] SYSTEM
  toggle theme   : Light/Dark
  sys            : Diagnostics
  clear          : Clear Chat
  matrix         : Toggle Simulation

[/] DATA & NAV
  ls, cd [page]  : Navigate
  search [query] : Deep Search
  events         : List Events
  team           : Show Execs
  blog           : Latest Articles
  gallery        : Random Photo

[/] TOOLS & FUN
  calc [expr]    : Calculator
  weather        : Local Weather
  quote          : Tech Wisdom
  play [game]    : rps, trivia...`;
          
          case 'ls':
              const pages = Object.values(Page);
              return pages.map(p => {
                  const perm = p === Page.Admin ? 'drwx------ (ROOT)' : 'drwxr-xr-x';
                  return `${perm}  visitor  ${p}`;
              }).join('\n');
          
          case 'cd':
          case 'open':
              if (!args[0]) return "usage: cd [directory]";
              const target = args[0].toLowerCase();
              if (target === '..') { handleRedirect(Page.Home); return "Directory changed: /home"; }
              const found = Object.values(Page).find(p => p.toLowerCase().includes(target));
              if (found === Page.Admin) { triggerAccessDenied(); return null; }
              if (found) { handleRedirect(found); return `Opening ${found}...`; }
              return `cd: ${target}: Directory not found`;

          case 'search':
              if (!args[0]) return "usage: search [query]";
              const q = args.join(' ').toLowerCase();
              const hits = [
                  ...events.filter(e => e.title.toLowerCase().includes(q) || e.tags.some(t => t.includes(q)) || e.description?.toLowerCase().includes(q)).map(e => `Event: ${e.title}`),
                  ...team.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)).map(m => `Member: ${m.name}`),
                  ...articles.filter(a => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)).map(a => `Article: ${a.title}`)
              ];
              if (hits.length === 0) return `No matches found for '${q}'`;
              return `Search Results:\n${hits.slice(0, 5).join('\n')}${hits.length > 5 ? `\n...and ${hits.length - 5} more.` : ''}`;

          case 'events':
              const nextEvts = events.filter(e => e.status === 'published' && new Date(e.datetime.start) > new Date()).slice(0, 3);
              if (nextEvts.length === 0) return "No upcoming events scheduled.";
              return `UPCOMING EVENTS:\n` + nextEvts.map(e => `• ${e.title} (${new Date(e.datetime.start).toLocaleDateString()})`).join('\n');

          case 'team':
              const execs = team.filter(t => t.role.includes('President') || t.role.includes('Secretary') || t.role.includes('Coordinator')).slice(0, 4);
              return `CORE TEAM:\n` + execs.map(t => `• ${t.name} - ${t.role}`).join('\n') + `\n(Type 'cd team' for full list)`;

          case 'blog':
              const latest = articles.filter(a => a.status === 'published')[0];
              if (!latest) return "No articles published.";
              return `LATEST INSIGHT:\n"${latest.title}" by ${latest.author}\nUse 'cd articles' to read.`;

          case 'gallery':
              const allImages = albums.flatMap(a => a.assets);
              if (allImages.length === 0) return "Gallery is empty.";
              const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
              addMessage("Here's a snapshot from our gallery:", 'text', 'assistant', { image: randomImage.url });
              return null;

          case 'weather':
              emote('happy');
              return "Pokhara, Nepal:\nTemp: 24°C ☀️\nHumidity: 65%\nCondition: Perfect for coding!";

          case 'quote':
              const quote = TECH_QUOTES[Math.floor(Math.random() * TECH_QUOTES.length)];
              emote('thinking');
              return `"${quote}"`;

          case 'calc':
              try {
                  // eslint-disable-next-line no-eval
                  const res = eval(args.join('')); 
                  emote('thinking');
                  return `Result: ${res}`;
              } catch {
                  emote('confused');
                  return "Error: Invalid Expression";
              }

          case 'sys':
          case 'status':
              emote('processing' as Emotion);
              return `SYSTEM DIAGNOSTICS
------------------
CPU: HiveMind QZ-9
RAM: 64TB Holographic
DB_CONNECTION: Active
EVENTS_INDEXED: ${events.length}
MEMBERS_ACTIVE: ${team.length}
WING_STATUS: Deployed`;

          case 'matrix':
              const newMode = !settings.matrixMode;
              updateSettings({ matrixMode: newMode });
              emote('matrix');
              return newMode 
                ? "Wake up, Neo...\nThe Matrix has you.\n(Type 'matrix' again to exit)" 
                : "Disconnecting from the Matrix... Welcome back to reality.";

          case 'toggle':
              if (args[0] === 'theme') {
                  const newTheme = settings.theme === 'light' ? 'dark' : 'light';
                  updateSettings({ theme: newTheme });
                  emote('happy');
                  return `Theme: ${newTheme.toUpperCase()}`;
              }
              return "Usage: toggle theme";

          case 'play':
              const game = args[0]?.toLowerCase();
              if (game === 'rps') startGame('rps');
              else if (game === 'number') startGame('number_guess');
              else if (game === 'scramble') startGame('scramble');
              else if (game === 'trivia') startGame('trivia');
              else return "Available games: rps, number, scramble, trivia";
              return null; 

          case 'clear': setMessages([]); return null;
          case 'date': return new Date().toString();
          case 'whoami': return "visitor@gandaki-hive\nLevel: 1 (Guest)";
          case 'sudo': triggerAccessDenied(); return "This incident will be reported.";
          
          case 'roll':
              const roll = Math.floor(Math.random() * 6) + 1;
              emote('excited');
              return `Rolled: [ ${roll} ]`;

          case 'flip':
              const side = Math.random() > 0.5 ? 'Heads' : 'Tails';
              emote('thinking');
              return `Coin: **${side}**`;

          default: return `Command not found: ${command}`;
      }
  };

  const startGame = (gameMode: Mode) => {
      setMode(gameMode);
      setScore(0);
      emote('excited');

      if (gameMode === 'rps') {
          addMessage("Rock, Paper, Scissors! Type your move.");
      } else if (gameMode === 'number_guess') {
          setTargetNumber(Math.floor(Math.random() * 100) + 1);
          addMessage("I'm thinking of a number (1-100). Guess it!");
      } else if (gameMode === 'scramble') {
          const word = SCRAMBLE_WORDS[Math.floor(Math.random() * SCRAMBLE_WORDS.length)];
          setScrambleData({ word, scrambled: word.split('').sort(() => 0.5 - Math.random()).join('') });
          addMessage(`Unscramble: ${word.split('').sort(() => 0.5 - Math.random()).join('')}`);
      } else if (gameMode === 'trivia') {
          setTriviaIndex(0);
          addMessage(`Trivia Q1: ${TRIVIA_QUESTIONS[0].q}\n1) ${TRIVIA_QUESTIONS[0].a[0]}\n2) ${TRIVIA_QUESTIONS[0].a[1]}`);
      }
  };

  const handleGameLogic = (input: string) => {
      const lower = input.toLowerCase().trim();
      
      if (mode === 'rps') {
          const valid = ['rock', 'paper', 'scissors'];
          if (!valid.includes(lower)) { addMessage("Invalid move."); return; }
          const beeMove = valid[Math.floor(Math.random() * 3)];
          
          if (lower === beeMove) { addMessage(`I picked ${beeMove}. Tie!`); emote('confused'); }
          else if (
              (lower === 'rock' && beeMove === 'scissors') ||
              (lower === 'paper' && beeMove === 'rock') ||
              (lower === 'scissors' && beeMove === 'paper')
          ) {
              addMessage(`I picked ${beeMove}. You Win! 🎉`);
              emote('happy');
          } else {
              addMessage(`I picked ${beeMove}. I Win! 😈`);
              emote('sassy');
          }
      }
      else if (mode === 'number_guess') {
          const g = parseInt(lower);
          if (isNaN(g)) return;
          if (g === targetNumber) { addMessage("Correct! You won."); emote('happy'); setMode('chat'); }
          else { addMessage(g < targetNumber ? "Higher..." : "Lower..."); emote('thinking'); }
      }
      else if (mode === 'scramble' && scrambleData) {
          if (lower === scrambleData.word.toLowerCase()) { addMessage("Correct!"); emote('happy'); setMode('chat'); }
          else { addMessage("Nope, try again."); emote('confused'); }
      }
      else if (mode === 'trivia') {
          const q = TRIVIA_QUESTIONS[triviaIndex];
          const isCorrect = lower.includes(q.a[q.correct].toLowerCase()) || (lower === "1" && q.correct === 0) || (lower === "2" && q.correct === 1);
          if (isCorrect) { setScore(s => s + 1); addMessage("Correct!"); emote('happy'); }
          else { addMessage("Wrong!"); emote('sad'); }

          if (triviaIndex < TRIVIA_QUESTIONS.length - 1) {
              setTriviaIndex(i => i + 1);
              setTimeout(() => {
                  const nq = TRIVIA_QUESTIONS[triviaIndex + 1];
                  addMessage(`Next: ${nq.q}\n1) ${nq.a[0]}\n2) ${nq.a[1]}`);
              }, 1000);
          } else {
              setTimeout(() => {
                  addMessage(`Game Over. Score: ${score + (isCorrect ? 1 : 0)}/${TRIVIA_QUESTIONS.length}`);
                  setMode('chat');
              }, 1000);
          }
      }
  };

  const processQuery = async (text: string) => {
    const lower = text.toLowerCase().trim();

    // Commands
    if (text.startsWith('/') || ['ls', 'cd', 'clear', 'pwd', 'calc', 'sys', 'matrix', 'whoami', 'sudo', 'date', 'roll', 'flip', 'toggle', 'search', 'events', 'team', 'blog', 'gallery', 'weather', 'quote', 'help'].includes(lower.split(' ')[0])) {
        const clean = text.startsWith('/') ? text.slice(1) : text;
        const [cmd, ...args] = clean.split(' ');
        const output = await handleCommand(cmd, args);
        if (output) addMessage(output, cmd === 'matrix' ? 'matrix' : 'cmd');
        return;
    }

    // Intelligent Context Matching
    // 1. Team Lookup
    const foundMember = team.find(m => lower.includes(m.name.toLowerCase()) || (lower.includes(m.role.toLowerCase()) && m.role.toLowerCase() !== 'active member'));
    if (foundMember) {
        addMessage(`Found record for ${foundMember.name} (${foundMember.role}):\n"${foundMember.message}"`, 'text', 'assistant', {
             action: { label: "View Profile", page: Page.Team },
             image: foundMember.image
        });
        emote('happy');
        return;
    }

    // 2. Event Lookup
    const foundEvent = events.find(e => lower.includes(e.title.toLowerCase()) || (e.tags && e.tags.some(t => lower.includes(t.toLowerCase()))));
    if (foundEvent) {
         addMessage(`Event Found: ${foundEvent.title}\nDate: ${new Date(foundEvent.datetime.start).toLocaleDateString()}\nStatus: ${foundEvent.status}`, 'text', 'assistant', {
             action: { label: "View Event", page: Page.Events },
             image: foundEvent.image
         });
         emote('excited');
         return;
    }

    // Emotions
    if (lower.match(/\b(hi|hello|hey)\b/)) emote('happy');
    if (lower.match(/\b(sad|bad|cry)\b/)) emote('sad');
    if (lower.match(/\b(love|cute|good)\b/)) emote('love');
    if (lower.match(/\b(angry|hate|stupid)\b/)) emote('alert');
    if (lower.match(/\b(sus|suspicious)\b/)) emote('suspicious');
    if (lower.match(/\b(joke)\b/)) { addMessage(TECH_JOKES[Math.floor(Math.random()*TECH_JOKES.length)]); emote('happy'); return; }

    // Game Logic
    if (mode !== 'chat') {
        if (['quit', 'exit'].includes(lower)) { setMode('chat'); addMessage("Game exited."); return; }
        handleGameLogic(lower);
        return;
    }

    if (lower.includes('play')) {
        if (lower.includes('rps')) startGame('rps');
        else if (lower.includes('number')) startGame('number_guess');
        else if (lower.includes('scramble')) startGame('scramble');
        else if (lower.includes('trivia')) startGame('trivia');
        else addMessage("I can play: RPS, Number Guess, Scramble, Trivia.");
        return;
    }

    // Default
    let responseText = "Processing input... I work best with commands like '/help' or specific queries about Events/Team.";
    let action = undefined;
    let links = undefined;

    if (lower.includes('event')) { responseText = "Checking database... found active events schedule."; action = { label: "View Events", page: Page.Events }; }
    else if (lower.includes('team')) { responseText = "Loading personnel dossier..."; action = { label: "Meet Team", page: Page.Team }; }
    else if (lower.includes('contact')) { responseText = "Opening secure channels."; action = { label: "Contact Us", page: Page.Contact }; }
    else if (lower.includes('photo') || lower.includes('gallery')) { 
        handleCommand('gallery', []); 
        return; 
    }

    addMessage(responseText, 'text', 'assistant', { action, links });
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: text }]);
    setInput('');
    processQuery(text);
  };

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSend(input); };
  const toggleOpen = () => { initAudio(); if(!isOpen) playProcessing(); setIsOpen(!isOpen); };

  // --- Droid Visual Logic ---
  const getEyeStyles = (side: 'left' | 'right') => {
      const base = { height: 18, width: 14, borderRadius: '50%', backgroundColor: '#00f2ff', rotate: 0, scaleY: 1 };
      
      if (currentEmotion === 'happy') return { ...base, height: 10, borderRadius: '20px 20px 0 0' }; 
      if (currentEmotion === 'sad') return { ...base, height: 12, borderRadius: '0 0 20px 20px', rotate: side === 'left' ? -20 : 20 };
      if (currentEmotion === 'alert' || currentEmotion === 'denied') return { ...base, height: 22, width: 18, backgroundColor: '#ef4444' };
      if (currentEmotion === 'love') return { ...base, height: 16, borderRadius: '50%', backgroundColor: '#ec4899' };
      if (currentEmotion === 'suspicious') return { ...base, height: 4, width: 16, borderRadius: 2 };
      if (currentEmotion === 'matrix') return { ...base, backgroundColor: '#22c55e', height: 4, width: 20 };
      if (currentEmotion === 'dizzy') return { ...base, borderRadius: '20%', rotate: 45 };
      if (isSpeaking) return { ...base, height: 16 }; // Slight widen when talking

      return base;
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[10000] flex flex-col items-end pointer-events-none">
      
      {/* Messenger Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mb-6 pointer-events-auto bg-white/95 dark:bg-[#0b1129]/95 backdrop-blur-xl w-[90vw] md:w-[360px] h-[550px] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col relative"
          >
            {/* Header */}
            <div className={`p-5 flex justify-between items-center text-white shrink-0 shadow-md z-10 transition-colors duration-500 ${currentEmotion === 'matrix' ? 'bg-black border-b border-green-500' : 'bg-gradient-to-r from-hive-blue to-[#1a1f3d]'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${mode !== 'chat' ? 'bg-purple-400 animate-ping' : 'bg-green-400 animate-pulse'} shadow-[0_0_8px_currentColor]`}></div>
                <div>
                    <span className={`font-heading font-bold tracking-wider text-sm block ${currentEmotion === 'matrix' ? 'text-green-500 font-code' : ''}`}>HIVE TERMINAL v3.2</span>
                    <span className="text-[10px] font-mono text-gray-300 block opacity-80">{mode === 'chat' ? 'System Ready' : `GAME: ${mode.toUpperCase()}`}</span>
                </div>
              </div>
              <button onClick={toggleOpen} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            
            {/* Chat Area */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth relative z-0 custom-scrollbar ${currentEmotion === 'matrix' ? 'bg-black' : 'bg-gray-50 dark:bg-transparent'}`}>
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 text-sm font-medium shadow-sm leading-relaxed ${
                        m.role === 'user' 
                        ? 'bg-hive-blue text-white rounded-[1.25rem] rounded-tr-sm' 
                        : m.type === 'cmd' 
                            ? 'bg-black text-green-400 font-code rounded-xl border border-green-900 w-full text-xs shadow-inner' 
                            : m.type === 'matrix'
                                ? 'bg-black text-green-500 font-code border border-green-500 w-full shadow-[0_0_10px_#22c55e]'
                                : 'bg-white dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-[1.25rem] rounded-tl-sm border border-gray-100 dark:border-white/5'
                    }`}>
                        <span className="whitespace-pre-wrap">{m.text}</span>
                        {m.image && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                                <img src={m.image} alt="Context" className="w-full h-auto object-cover max-h-40" />
                            </div>
                        )}
                        {m.links && (
                            <div className="mt-3 grid gap-2">
                                {m.links.map((link, idx) => (
                                    <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg hover:bg-hive-gold/10 transition-colors text-xs font-bold">
                                        <i className={`${link.isBrand ? 'fa-brands' : 'fa-solid'} ${link.icon}`}></i> {link.label}
                                    </a>
                                ))}
                            </div>
                        )}
                        {m.action && (
                            <button onClick={() => handleRedirect(m.action!.page)} className="mt-2 block w-full text-center bg-hive-gold text-hive-blue text-xs font-bold py-2 rounded-lg hover:brightness-110 transition-all">
                                {m.action.label}
                            </button>
                        )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {mode === 'chat' && (
               <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0b1129]">
                  {SUGGESTIONS.map((s, idx) => (
                     <button 
                       key={idx} 
                       onClick={() => handleSend(s.label.includes('Search') ? 'search' : s.label.includes('help') ? '/help' : s.label.includes('Game') ? 'play game' : s.label.includes('Events') ? 'events' : s.label.includes('Gallery') ? 'gallery' : s.label)}
                       className="whitespace-nowrap px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:bg-hive-gold hover:text-hive-blue transition-colors flex items-center gap-1.5 border border-transparent hover:border-hive-gold/50"
                     >
                        <s.icon className="w-3 h-3" /> {s.label}
                     </button>
                  ))}
               </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#0b1129] border-t border-gray-100 dark:border-white/10">
               <form onSubmit={onSubmit} className="relative flex items-center gap-2">
                  <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={mode === 'chat' ? "Type command..." : `Enter ${mode}...`}
                    className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-full pl-5 pr-12 py-3 text-sm text-hive-blue dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-hive-gold outline-none transition-all font-code"
                  />
                  <button 
                    type="submit" 
                    disabled={!input.trim()}
                    className="absolute right-1.5 p-2 bg-hive-blue text-white rounded-full hover:bg-hive-gold hover:text-hive-blue disabled:opacity-50 disabled:bg-gray-300 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HIVE DROID AVATAR --- */}
      <motion.div
        ref={containerRef}
        animate={controls}
        drag
        dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
        dragElastic={0.2}
        dragMomentum={true}
        onDragEnd={() => {
            chassisControls.start({ rotate: [0, -10, 10, 0], transition: { duration: 0.5 }});
        }}
        style={{ x, y, touchAction: 'none' }}
        onHoverStart={() => { setIsHovered(true); if(!isZooming) playProcessing(); }}
        onHoverEnd={() => setIsHovered(false)}
        onClick={toggleOpen}
        className="pointer-events-auto cursor-grab active:cursor-grabbing relative z-50 group"
      >
         {/* Emotion Particles */}
         <AnimatePresence>
            {currentEmotion === 'love' && (
                <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: -60, opacity: 1 }} exit={{ opacity: 0 }} className="absolute -top-10 left-1/2 -translate-x-1/2 text-pink-500">
                    <Heart className="fill-current w-6 h-6" />
                </motion.div>
            )}
            {(currentEmotion === 'alert' || currentEmotion === 'denied') && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }} className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500">
                    <Zap className="fill-current w-8 h-8" />
                </motion.div>
            )}
            {currentEmotion === 'excited' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -top-5 -right-5 text-hive-gold">
                    <Sparkles className="w-6 h-6 animate-spin" />
                </motion.div>
            )}
            {currentEmotion === 'thinking' && (
                <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -20 }} exit={{ opacity: 0 }} className="absolute -top-10 right-0 text-gray-400 font-black text-xl">
                    ???
                </motion.div>
            )}
         </AnimatePresence>

         {/* DROID CONSTRUCTION */}
         <motion.div
            animate={chassisControls}
            style={{
                y: useTransform(useSpring(useMotionValue(0), { stiffness: 40, damping: 8 }), v => Math.sin(Date.now() / 800) * 10),
            }}
            className="relative z-10"
         >
            {/* Holographic Wings (Enhanced Visibility) */}
            <motion.div 
               className="absolute -left-12 top-0 w-20 h-24 bg-gradient-to-br from-blue-300/30 to-white/10 border border-gray-400 dark:border-white/40 rounded-[100%_0_60%_20%] origin-right blur-[0.5px] shadow-[0_0_15px_rgba(255,255,255,0.2)]"
               animate={{ rotateY: [0, 60, 0], opacity: [0.7, 1, 0.7] }} 
               transition={{ duration: 0.15, repeat: Infinity }} 
            />
            <motion.div 
               className="absolute -right-12 top-0 w-20 h-24 bg-gradient-to-bl from-blue-300/30 to-white/10 border border-gray-400 dark:border-white/40 rounded-[0_100%_20%_60%] origin-left blur-[0.5px] shadow-[0_0_15px_rgba(255,255,255,0.2)]"
               animate={{ rotateY: [0, 60, 0], opacity: [0.7, 1, 0.7] }} 
               transition={{ duration: 0.15, repeat: Infinity }} 
            />

            {/* Physics Antennae */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-20 flex justify-between z-0 pointer-events-none px-1">
               <div className="h-full flex flex-col items-center justify-end origin-bottom -rotate-12">
                  <motion.div style={{ x: antennaBendX_L, y: antennaBendY_L }} className="w-full flex flex-col items-center">
                      <div className="w-3 h-3 bg-hive-gold border-2 border-white rounded-full shadow-[0_0_8px_#FFAA0D] animate-pulse mb-0.5"></div>
                      <div className="w-1 h-14 bg-gray-600 rounded-full"></div>
                  </motion.div>
               </div>
               <div className="h-full flex flex-col items-center justify-end origin-bottom rotate-12">
                  <motion.div style={{ x: antennaBendX_R, y: antennaBendY_R }} className="w-full flex flex-col items-center">
                      <div className="w-3 h-3 bg-hive-gold border-2 border-white rounded-full shadow-[0_0_8px_#FFAA0D] animate-pulse mb-0.5" style={{ animationDelay: '0.3s' }}></div>
                      <div className="w-1 h-14 bg-gray-600 rounded-full"></div>
                  </motion.div>
               </div>
            </div>

            {/* Main Body Chassis */}
            <div className={`relative w-28 h-28 bg-gradient-to-br from-hive-gold via-[#e69c0b] to-[#b37400] rounded-full shadow-[inset_0_-8px_10px_rgba(0,0,0,0.3),0_15px_30px_rgba(0,0,0,0.4)] border-4 border-[#fff3bf] flex items-center justify-center overflow-hidden z-10 transition-colors duration-500 ${currentEmotion === 'matrix' ? 'grayscale brightness-50' : ''}`}>
               
               {/* Reflection */}
               <div className="absolute top-3 left-5 w-10 h-5 bg-white/40 rounded-full blur-[2px] rotate-[-20deg]"></div>
               
               {/* Stripes */}
               <div className="absolute w-full h-[3px] bg-black/20 top-1/3 blur-[0.5px]"></div>
               <div className="absolute w-full h-[3px] bg-black/20 bottom-1/3 blur-[0.5px]"></div>

               {/* Face Plate */}
               <div className="absolute top-[28%] w-[75%] h-[40%] bg-[#151515] rounded-[24px] flex items-center justify-center gap-3 shadow-[inset_0_0_15px_black] border-2 border-gray-700">
                  
                  {/* Left Eye */}
                  <motion.div 
                     className="relative overflow-hidden shadow-[0_0_8px_currentColor]"
                     initial={{ height: 18, width: 14 }}
                     animate={getEyeStyles('left') as any}
                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                     <motion.div 
                        className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_white]"
                        style={{ x: mousePos.x, y: mousePos.y, top: '30%', left: '30%' }}
                     />
                  </motion.div>

                  {/* Digital Mouth (Visualizer) */}
                  {isSpeaking && (
                      <motion.div 
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 flex justify-center items-center gap-0.5"
                      >
                          {[1,2,3,4].map(i => (
                              <motion.div 
                                key={i}
                                animate={{ height: [2, Math.random() * 8 + 2, 2] }}
                                transition={{ duration: 0.1, repeat: Infinity, repeatType: 'reverse' }}
                                className="w-1 bg-green-400 rounded-full shadow-[0_0_5px_#4ade80]"
                              />
                          ))}
                      </motion.div>
                  )}

                  {/* Right Eye */}
                  <motion.div 
                     className="relative overflow-hidden shadow-[0_0_8px_currentColor]"
                     initial={{ height: 18, width: 14 }}
                     animate={getEyeStyles('right') as any}
                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                     <motion.div 
                        className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_white]"
                        style={{ x: mousePos.x, y: mousePos.y, top: '30%', left: '30%' }}
                     />
                  </motion.div>
               </div>
            </div>

         </motion.div>

         {/* Call to Action Tooltip */}
         <AnimatePresence>
            {!isOpen && !isHovered && currentEmotion === 'neutral' && !isZooming && (
               <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="absolute right-full mr-8 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white dark:bg-[#0b1129] px-4 py-2 rounded-xl shadow-lg border border-hive-gold/30 text-xs font-bold text-hive-blue dark:text-white flex items-center gap-2"
               >
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  Start Here
                  <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-[#0b1129] border-r border-b border-hive-gold/30 rotate-[-45deg]"></span>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FloatingBee;
