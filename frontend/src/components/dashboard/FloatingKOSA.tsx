'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Minus, 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  Sparkles, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FloatingKOSA() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! I am your SOP Assistant. How can I help you in the kitchen today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [starters, setStarters] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetchStarters();
    setupSpeechRecognition();
  }, [selectedLang]);

  const setupSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);

        recognitionRef.current = recognition;
      }
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const fetchStarters = async (lang: string = selectedLang) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/ai/starters?lang=${lang}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.starters) setStarters(data.starters);
    } catch (e) {
      // Silent catch
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const playVoice = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const containsHindi = /[\u0900-\u097F]/.test(text);
      const targetLang = containsHindi ? 'hi' : 'en';

      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) return;

        let bestVoice = null;
        if (targetLang === 'hi') {
          // Comprehensive Hindi Voice Priority (Cross-Platform)
          bestVoice = 
            voices.find(v => v.name.includes('Google हिन्दी')) ||
            voices.find(v => v.name.includes('Microsoft Hemant') || v.name.includes('Microsoft Kalpana')) ||
            voices.find(v => v.name.includes('Rishi') || v.name.includes('Lekha')) ||
            voices.find(v => v.name.includes('Natural') && v.lang.startsWith('hi')) ||
            voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi')) ||
            voices.find(v => v.name.toLowerCase().includes('hindi'));
        } else {
          // Comprehensive English India Voice Priority
          bestVoice = 
            voices.find(v => v.lang === 'en-IN' && v.name.includes('Google')) ||
            voices.find(v => v.name.includes('Microsoft Ravi') || v.name.includes('Microsoft Heera')) ||
            voices.find(v => v.name.includes('Isha') || v.name.includes('Veena')) ||
            voices.find(v => v.name.includes('Natural') && v.lang.startsWith('en')) ||
            voices.find(v => v.lang === 'en-IN') ||
            voices.find(v => v.lang.startsWith('en'));
        }

        if (bestVoice) {
          utterance.voice = bestVoice;
          utterance.lang = bestVoice.lang;
        } else {
          utterance.lang = targetLang === 'hi' ? 'hi-IN' : 'en-IN';
        }

        utterance.rate = 0.90; // Clarity prosody
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      } else {
        setVoice();
      }
    }
  };

  const handleSend = async (textOverride?: string) => {
    const userMessage = textOverride || input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const isInputHindi = /[\u0900-\u097F]/.test(userMessage);

      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message: userMessage, 
          lang: isInputHindi ? 'hi' : selectedLang,
          history: messages.slice(-6),
          context: window.location.pathname 
        })
      });

      const data = await response.json();
      const reply = data.reply || "I am sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (data.suggestions && data.suggestions.length > 0) {
        setStarters(data.suggestions);
      }
      if (!isMuted) playVoice(reply);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "There was a connection issue. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] no-print">
      <AnimatePresence>
        {isOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="w-[380px] h-[580px] bg-[#111111] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Bot size={20} className="text-black" />
                </div>
                <div>
                  <span className="block font-black text-white text-[10px] tracking-[0.2em] uppercase">SOP Assistant</span>
                  <span className="flex items-center gap-1.5 text-green-500 text-[8px] font-bold uppercase tracking-widest mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Online & Ready
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className={`p-2 rounded-lg transition-all ${isMuted ? 'text-white/20 bg-white/5' : 'text-gold bg-gold/10'}`}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <div className="flex bg-black rounded-lg p-1 border border-white/5">
                  <button onClick={() => setSelectedLang('en')} className={`px-2 py-1 text-[8px] font-black rounded-md transition-all ${selectedLang === 'en' ? 'bg-gold text-black' : 'text-white/30'}`}>EN</button>
                  <button onClick={() => setSelectedLang('hi')} className={`px-2 py-1 text-[8px] font-black rounded-md transition-all ${selectedLang === 'hi' ? 'bg-gold text-black' : 'text-white/30'}`}>हि</button>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-black/40">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 ${
                    msg.role === 'user' 
                    ? 'bg-gold text-black rounded-tr-none font-bold' 
                    : 'bg-[#1a1a1a] border border-white/5 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.role === 'assistant' && <Sparkles size={16} className="text-gold shrink-0 mt-1" />}
                    <div className="text-xs whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <Loader2 size={16} className="text-gold animate-spin" />
                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">KOSA is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length < 3 && starters.length > 0 && (
              <div className="px-5 py-3 flex flex-wrap gap-2 bg-[#1a1a1a]/50 border-t border-white/5">
                {starters.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 bg-gold/5 border border-gold/20 text-gold text-[9px] font-bold rounded-full hover:bg-gold/10 transition-all flex items-center gap-1.5"
                  >
                    {s} <ChevronRight size={10} />
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-5 bg-[#1a1a1a] border-t border-white/5">
              <div className="flex items-center gap-3 bg-black rounded-2xl p-2 border border-white/5">
                <button 
                  onClick={toggleRecording}
                  className={`p-2.5 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/40 hover:text-gold'}`}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isRecording ? "Listening..." : "How do I make..."}
                  className="flex-1 bg-transparent border-none outline-none py-2 text-xs text-white placeholder:text-white/20"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 bg-gold rounded-xl text-black disabled:opacity-30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[8px] text-center text-white/20 mt-3 font-black uppercase tracking-[0.3em]">Advanced SOP Intelligence</p>
            </div>
          </motion.div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(212,175,55,0.3)] relative group border border-white/10"
          >
            <div className="absolute -top-14 right-0 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-2xl pointer-events-none translate-y-2 group-hover:translate-y-0">
              Need Help? Ask KOSA
              <div className="absolute -bottom-1 right-6 w-2 h-2 bg-white rotate-45"></div>
            </div>
            <Bot size={28} className="text-black" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#111111] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
