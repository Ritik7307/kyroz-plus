'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '@/lib/api';

type Message = {
  role: 'user' | 'kosa';
  content: string;
};

export default function AiDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'kosa', content: 'Namaste! I am KYROZ KOSA, your AI restaurant consultant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>('en');
  const [starters, setStarters] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetchStarters(selectedLang);
  }, [selectedLang]);

  const fetchStarters = async (lang: string = selectedLang) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/ai/starters?lang=${lang}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.starters) setStarters(data.starters);
    } catch (e) {
      // Silent catch for starters
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Setup Speech Recognition with dependency on language
  useEffect(() => {
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
        };

        recognition.onerror = (event: any) => {
          setIsRecording(false);
          // Only log as warning to prevent Next.js error popup
          if (event.error !== 'aborted') {
            console.warn("KOSA Speech Recognition Notice:", event.error);
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, [selectedLang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        setIsRecording(true);
      }
    } catch (err) {
      setIsRecording(false);
      console.warn("Speech start ignored - already active or blocked.");
    }
  };

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
            voices.find(v => v.name.includes('Samsung') && v.lang.startsWith('hi')) ||
            voices.find(v => v.name.includes('Rishi') || v.name.includes('Lekha')) ||
            voices.find(v => v.name.includes('Natural') && v.lang.startsWith('hi')) ||
            voices.find(v => v.name.includes('Hindi') || v.name.includes('हिन्दी')) ||
            voices.find(v => v.lang.startsWith('hi'));
        } else {
          // Comprehensive English India Voice Priority
          bestVoice = 
            voices.find(v => v.lang === 'en-IN' && v.name.includes('Google')) ||
            voices.find(v => v.name.includes('Microsoft Ravi') || v.name.includes('Microsoft Heera')) ||
            voices.find(v => v.name.includes('Isha') || v.name.includes('Veena')) ||
            voices.find(v => v.name.includes('Samsung') && v.lang.startsWith('en')) ||
            voices.find(v => v.name.includes('Natural') && v.lang.startsWith('en')) ||
            voices.find(v => v.lang === 'en-IN');
        }

        if (bestVoice) {
          utterance.voice = bestVoice;
          utterance.lang = bestVoice.lang;
        } else {
          utterance.lang = targetLang === 'hi' ? 'hi-IN' : 'en-IN';
        }

        // Proper Hindi Prosody: Hindi sounds better at a slightly lower pitch and moderate rate
        utterance.rate = targetLang === 'hi' ? 0.85 : 0.90; 
        utterance.pitch = targetLang === 'hi' ? 0.95 : 1.0; 
        utterance.volume = 1.0;
        
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      } else {
        setVoice();
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message: userQuery, 
          lang: /[\u0900-\u097F]/.test(userQuery) ? 'hi' : selectedLang, // Auto-detect input lang
          history: messages.slice(-10),
          context: window.location.pathname 
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'kosa', content: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'kosa', content: data.reply }]);
        if (data.suggestions && data.suggestions.length > 0) {
          setStarters(data.suggestions);
        }
        if (!isMuted) playVoice(data.reply);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'kosa', content: 'Sorry, I am having trouble connecting to my brain right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#111111] rounded-3xl border border-[#333333] overflow-hidden relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#333333] flex items-center justify-between bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-black font-bold text-xl">
            K
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">KYROZ KOSA</h2>
            <p className="text-gray-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Online & Connected to SOPs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#000000] rounded-lg p-1 border border-[#333333] mr-2">
            <button 
              onClick={() => setSelectedLang('en')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedLang === 'en' ? 'bg-[#d4af37] text-black' : 'text-gray-500'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setSelectedLang('hi')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedLang === 'hi' ? 'bg-[#d4af37] text-black' : 'text-gray-500'}`}
            >
              हिन्दी
            </button>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-lg transition-colors ${isMuted ? 'text-gray-500 bg-white/5' : 'text-[#d4af37] bg-[#d4af37]/10'}`}
            title={isMuted ? "Unmute AI" : "Mute AI"}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-xl ${
              msg.role === 'user' 
              ? 'bg-gold/10 text-white border border-gold/20' 
              : 'bg-white/5 text-gray-200 border border-white/10 backdrop-blur-md'
            }`}>
              {msg.role === 'kosa' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-[10px] text-black font-black">K</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold">KOSA Consultant</span>
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed tracking-wide">{msg.content}</div>
              
              {msg.role === 'kosa' && (
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <p className="text-[8px] text-white/20 font-bold uppercase tracking-tighter">AI Generated Consultation</p>
                  <button 
                    onClick={() => playVoice(msg.content)}
                    className="px-3 py-1 bg-gold/5 hover:bg-gold/10 rounded-full text-gold text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                  >
                    🔊 Listen to Voice
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 text-gold/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Consultant is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Suggested Questions */}
      <div className="px-6 py-4 bg-[#111111]/80 backdrop-blur-xl">
        {messages.length < 5 && starters.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2">
            {starters.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInput(s); setTimeout(handleSend, 100); }}
                className="px-4 py-2 bg-gold/5 border border-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold/10 hover:border-gold/30 transition-all shadow-lg"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-[#1a1a1a]">
        <div className="flex items-center gap-4 bg-black/40 rounded-2xl p-3 border border-white/10 shadow-inner group focus-within:border-gold/30 transition-all">
          
          <button 
            onClick={toggleRecording}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-lg ${
              isRecording 
              ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' 
              : 'bg-white/5 text-white/40 hover:text-gold hover:bg-white/10 border border-white/5'
            }`}
            title="Voice Command"
          >
            {isRecording ? <span className="text-xl">●</span> : <span className="text-xl">🎤</span>}
          </button>

          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? "I am listening to you..." : "Ask KOSA for recipes, costs, or scaling strategies..."}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/10 text-sm font-medium tracking-wide"
            disabled={isRecording}
          />

          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-8 py-3 bg-gold-gradient text-black font-black text-xs uppercase tracking-widest rounded-xl disabled:opacity-30 disabled:grayscale hover:scale-[1.02] transition-all shadow-xl shadow-gold/10"
          >
            {isLoading ? 'Wait...' : 'Consult'}
          </button>
        </div>
      </div>
    </div>
  );
}
