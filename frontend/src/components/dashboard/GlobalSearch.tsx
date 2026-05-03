'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, FileText, Utensils, DollarSign, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function GlobalSearch({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (o: boolean) => void }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  const results = [
    { name: 'SOP: Veg Jalfrezi', category: 'SOP', path: '/dashboard/sop', icon: FileText },
    { name: 'Recipe: Paneer Tikka', category: 'Recipe', path: '/dashboard/sop', icon: Utensils },
    { name: 'Monthly Costs', category: 'Finance', path: '/dashboard/costing', icon: DollarSign },
    { name: 'Inventory Stock', category: 'Inventory', path: '/dashboard/inventory', icon: Package },
  ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="bg-card w-full max-w-2xl rounded-3xl border border-white/10 shadow-3xl overflow-hidden relative z-10"
          >
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <Search className="text-gold" size={24} />
              <input 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything... (Recipes, Costs, Inventory)"
                className="bg-transparent border-none outline-none text-xl w-full text-white placeholder:text-white/20 font-medium"
              />
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] text-white/40 font-bold uppercase">
                <Command size={10} /> K
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {results.length > 0 ? results.map((res, i) => (
                <button 
                  key={i}
                  onClick={() => { router.push(res.path); setIsOpen(false); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                      <res.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">{res.name}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{res.category}</p>
                    </div>
                  </div>
                  <X size={16} className="text-white/10 group-hover:text-white/40" />
                </button>
              )) : (
                <div className="py-20 text-center text-white/20 italic text-sm">
                  No matches found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`pointer-events-auto p-5 rounded-2xl border min-w-[300px] shadow-2xl flex items-center justify-between gap-4 ${
              toast.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' :
              'bg-blue-500/10 border-blue-500/50 text-blue-400'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                toast.type === 'success' ? 'bg-green-500/20' : 
                toast.type === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'
              }`}>
                {toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}
              </div>
              <p className="text-sm font-bold uppercase tracking-widest">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-white/20 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
