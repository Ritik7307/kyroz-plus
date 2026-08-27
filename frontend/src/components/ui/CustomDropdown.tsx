'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string;
  category?: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  searchable?: boolean;
}

export default function CustomDropdown({ options, value, onChange, label, placeholder, searchable }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = searchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase())) 
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="block text-xs font-black uppercase tracking-[0.2em] text-foreground/40 mb-2 ml-1">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-card border ${isOpen ? 'border-gold' : 'border-border'} rounded-xl px-5 py-3 text-sm font-bold flex items-center justify-between transition-all hover:bg-accent hover:text-accent-foreground group shadow-sm`}
      >
        <span className={selectedOption ? 'text-foreground' : 'text-foreground/40'}>
          {selectedOption ? selectedOption.label : placeholder || 'Select option'}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 w-full bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {searchable && (
              <div className="p-2 border-b border-border">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
              {(() => {
                const hasCategories = filteredOptions.some(opt => opt.category);
                
                if (!hasCategories) {
                  return filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full px-5 py-3 text-left text-sm font-bold flex items-center justify-between transition-colors ${
                        value === option.value ? 'bg-gold/10 text-gold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {option.label}
                      {value === option.value && <Check size={16} />}
                    </button>
                  ));
                }

                const groups = filteredOptions.reduce((acc, opt) => {
                  const cat = opt.category || 'Uncategorized';
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(opt);
                  return acc;
                }, {} as Record<string, Option[]>);

                return Object.entries(groups).map(([cat, opts]) => (
                  <div key={cat} className="mb-2">
                    <div className="px-5 py-1 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted border-y border-border">
                      {cat}
                    </div>
                    {opts.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                        }}
                        className={`w-full px-5 pl-8 py-3 text-left text-sm font-bold flex items-center justify-between transition-colors ${
                          value === option.value ? 'bg-gold/10 text-gold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {option.label}
                        {value === option.value && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                ));
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
