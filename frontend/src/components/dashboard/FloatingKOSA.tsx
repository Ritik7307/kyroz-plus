'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Minus, Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FloatingKOSA() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! I am KOSA, your KYROZ AI assistant. How can I help you in the kitchen today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: userMessage })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Maaf kijiye, connection error ho gaya. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-[400px] h-[600px] bg-card glass-card rounded-2xl shadow-2xl flex flex-col border border-gold/30 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gold-gradient flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-gold" />
                </div>
                <span className="font-bold text-black text-sm tracking-widest uppercase">KOSA AI Assistant</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/10 rounded transition-colors text-black">
                  <Minus size={20} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/10 rounded transition-colors text-black">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl flex gap-3 ${
                    msg.role === 'user' 
                    ? 'bg-gold text-black rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
                  }`}>
                    {msg.role === 'assistant' && <Sparkles size={16} className="text-gold shrink-0 mt-1" />}
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 size={16} className="text-gold animate-spin" />
                    <span className="text-xs text-white/60 font-medium">KOSA is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/40 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your kitchen query..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-gold/50 transition-all text-sm text-white placeholder:text-white/20"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-2 p-1.5 bg-gold-gradient rounded-lg text-black hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center text-white/30 mt-2 uppercase tracking-tighter">Powered by KYROZ Advanced RAG Engine</p>
            </div>
          </motion.div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] relative group"
          >
            <div className="absolute -top-12 right-0 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-2xl translate-y-2 group-hover:translate-y-0">
              Need help? Ask KOSA
              <div className="absolute -bottom-1 right-6 w-2 h-2 bg-white rotate-45"></div>
            </div>
            <MessageSquare size={30} className="text-black" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background animate-bounce">1</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
