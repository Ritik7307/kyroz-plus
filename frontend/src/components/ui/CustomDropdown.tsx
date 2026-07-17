'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string;
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
      {label && <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-black/40 border ${isOpen ? 'border-gold' : 'border-white/10'} rounded-xl px-5 py-3 text-sm font-bold flex items-center justify-between transition-all hover:bg-white/5 group`}
      >
        <span className={selectedOption ? 'text-white' : 'text-white/30'}>
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
            className="absolute z-50 w-full bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {searchable && (
              <div className="p-2 border-b border-white/10">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-5 py-3 text-left text-sm font-bold flex items-center justify-between transition-colors ${
                    value === option.value ? 'bg-gold/10 text-gold' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check size={16} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
