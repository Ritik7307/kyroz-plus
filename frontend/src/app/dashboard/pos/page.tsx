'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  CheckCircle,
  Search,
  ChevronRight,
  Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

interface Dish {
  id: string;
  name: string;
  price: number;
  category: string;
}

const MOCK_DISHES: Dish[] = [
  { id: '1', name: 'Shahi Paneer', price: 320, category: 'Main Course' },
  { id: '2', name: 'Dal Makhani', price: 280, category: 'Main Course' },
  { id: '3', name: 'Butter Naan', price: 60, category: 'Breads' },
  { id: '4', name: 'Veg Pulao', price: 210, category: 'Rice' },
  { id: '5', name: 'Paneer Tikka', price: 290, category: 'Starters' },
  { id: '6', name: 'Cold Coffee', price: 150, category: 'Beverages' },
  { id: '7', name: 'Kadhai Chicken', price: 450, category: 'Main Course' },
  { id: '8', name: 'Garlic Naan', price: 80, category: 'Breads' },
];

export default function POSTerminal() {
  const [cart, setCart] = useState<{ dish: Dish, quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) {
        return prev.map(item => item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.dish.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
  const categories = ['All', ...Array.from(new Set(MOCK_DISHES.map(d => d.category)))];

  const filteredDishes = MOCK_DISHES.filter(d => 
    (activeCategory === 'All' || d.category === activeCategory) &&
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-120px)] overflow-hidden">
      
      {/* MENU SECTION */}
      <div className="lg:col-span-8 flex flex-col space-y-6 overflow-hidden">
        <div className="bg-card glass-card p-6 rounded-[2rem] border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Utensils className="text-gold" /> DISH MENU
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold/50 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'bg-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 gap-4 scrollbar-hide">
          {filteredDishes.map(dish => (
            <motion.div
              layout
              key={dish.id}
              onClick={() => addToCart(dish)}
              className="bg-card glass-card p-5 rounded-3xl border border-white/5 hover:border-gold/30 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-bold text-gold uppercase tracking-widest">{dish.category}</span>
                <h3 className="font-bold text-lg mt-1 group-hover:text-gold transition-colors">{dish.name}</h3>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xl font-black">₹{dish.price}</span>
                <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <Plus size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CART / BILLING SECTION */}
      <div className="lg:col-span-4 bg-card glass-card rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-black flex items-center gap-3">
            <ShoppingCart className="text-gold" /> CURRENT ORDER
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div
                key={item.dish.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.dish.name}</h4>
                  <p className="text-[10px] text-white/40">₹{item.dish.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3 bg-black/40 rounded-xl p-1 px-2 border border-white/5">
                  <button onClick={() => updateQuantity(item.dish.id, -1)} className="text-white/40 hover:text-white transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.dish.id, 1)} className="text-gold hover:text-gold/80 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="ml-4 font-black text-sm w-16 text-right">
                  ₹{item.dish.price * item.quantity}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-4 py-20">
              <Utensils size={64} />
              <p className="font-black uppercase tracking-[0.2em] text-sm text-center">Cart is empty<br/><span className="text-[10px] font-bold">Select dishes to begin</span></p>
            </div>
          )}
        </div>

        <div className="p-8 bg-black/40 border-t border-white/5 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Subtotal</span>
              <span className="font-bold text-white">₹{total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Tax (GST 5%)</span>
              <span className="font-bold text-white">₹{Math.round(total * 0.05)}</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-lg font-black uppercase tracking-tighter">Grand Total</span>
              <span className="text-4xl font-black text-gold">₹{Math.round(total * 1.05)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setCart([])}
              className="py-4 rounded-2xl border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Clear
            </button>
            <button 
              disabled={cart.length === 0}
              className="py-4 rounded-2xl bg-gold text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
            >
              <CheckCircle size={16} /> Checkout
            </button>
          </div>
          
          <button 
            disabled={cart.length === 0}
            className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Printer size={16} /> Print KOT & Bill
          </button>
        </div>
      </div>

    </div>
  );
}
