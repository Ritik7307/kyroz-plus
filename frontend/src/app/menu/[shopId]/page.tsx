'use client';

import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Search, Image as ImageIcon, CheckCircle, ChevronRight, User, Phone } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Dish {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export default function DigitalMenu({ params }: { params: Promise<{ shopId: string }> }) {
  const resolvedParams = use(params);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [shopName, setShopName] = useState('Digital Menu');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Gatekeeper state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [authError, setAuthError] = useState('');

  // Form submission
  const handleAccessMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim().length < 2) {
      setAuthError('Please enter a valid name.');
      return;
    }
    if (customerPhone.trim().length < 10) {
      setAuthError('Please enter a valid contact number.');
      return;
    }
    
    // Save to session storage so they don't have to fill it out again if they refresh
    sessionStorage.setItem('kyroz_menu_visitor_name', customerName);
    sessionStorage.setItem('kyroz_menu_visitor_phone', customerPhone);
    setIsAuthorized(true);
    fetchDishes();
  };

  useEffect(() => {
    // Check if they already entered details
    const savedName = sessionStorage.getItem('kyroz_menu_visitor_name');
    const savedPhone = sessionStorage.getItem('kyroz_menu_visitor_phone');
    if (savedName && savedPhone) {
      setCustomerName(savedName);
      setCustomerPhone(savedPhone);
      setIsAuthorized(true);
      fetchDishes();
    }
  }, []);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/dishes/public/${resolvedParams.shopId}`);
      if (res.ok) {
        const data = await res.json();
        // Handle new API response structure { shopName, dishes } or fallback to legacy array
        if (data && data.dishes && Array.isArray(data.dishes)) {
          setDishes(data.dishes);
          if (data.shopName) setShopName(data.shopName);
        } else if (Array.isArray(data)) {
          setDishes(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card glass-card border border-white/10 p-8 rounded-3xl relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Utensils size={32} className="text-black" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">{shopName}</h1>
            <p className="text-white/40 text-sm font-bold">Please enter your details to view the menu</p>
          </div>

          <form onSubmit={handleAccessMenu} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-gold/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Contact Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="tel" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-gold/50"
                  required
                />
              </div>
            </div>

            {authError && (
              <p className="text-red-500 text-xs font-bold text-center mt-2">{authError}</p>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-gold text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all mt-6 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
            >
              View Menu <ChevronRight size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(dishes.map(d => d.category)))];
  
  const filteredDishes = dishes.filter(d => 
    (activeCategory === 'All' || d.category === activeCategory) &&
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 pb-4 pt-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-black">
                <Utensils size={18} />
              </div>
              {shopName}
            </h1>
            <div className="text-right">
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Welcome</p>
              <p className="text-xs font-black truncate max-w-[120px]">{customerName}</p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-gold/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeCategory === cat ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gold gap-4">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black uppercase tracking-widest text-sm text-white/60">Loading Menu...</p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20 gap-4">
            <Utensils size={48} />
            <p className="font-black uppercase tracking-widest text-sm">No dishes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDishes.map((dish) => (
                <motion.div
                  key={dish._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col group hover:border-gold/30 transition-all duration-300"
                >
                  <div className="h-48 relative overflow-hidden bg-white/5">
                    {dish.imageUrl ? (
                      <img 
                        src={dish.imageUrl} 
                        alt={dish.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-black text-lg leading-tight mb-2">{dish.name}</h3>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                      <span className="text-xl font-black text-gold">₹{dish.price}</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold border border-white/10 px-2 py-1 rounded-md bg-white/5">
                        {dish.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <footer className="py-8 text-center border-t border-white/5 mt-8 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Powered By Kyrozplus</p>
        <p className="text-[8px] font-bold uppercase tracking-widest">Digital Menu System</p>
      </footer>
    </div>
  );
}
