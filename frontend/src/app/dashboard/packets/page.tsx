'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  IndianRupee, 
  Search, 
  Filter, 
  ShoppingCart,
  ArrowRight,
  Star,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useCart } from '@/context/CartContext';

export default function UserSopPacketsPage() {
  const [packets, setPackets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchPackets();
  }, []);

  const fetchPackets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sop-packets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPackets(data);
    } catch (err) {
      console.error('Failed to fetch packets', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Bakery & Pastry', 'Beverages', 'Continental', 'Fast Food', 'Indian Cuisine'];

  const filteredPackets = packets.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen space-y-12 pb-20">
      {/* --- HERO HEADER --- */}
      <div className="relative rounded-[3rem] overflow-hidden bg-card glass-card border border-white/5 p-12 md:p-20 text-center space-y-6">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] -z-10 animate-pulse"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <Zap size={12} className="fill-gold" /> Exclusive Collections
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
          PREMIUM <span className="text-gold">SOP PACKETS</span>
        </h1>
        <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Elevate your kitchen standards with our professionally curated commercial SOP collections. Proven recipes, optimized processes, and elite standards.
        </p>
      </div>

      {/* --- SEARCH & FILTER --- */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-28 z-40 bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            type="text" 
            placeholder="Search for premium packets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-bold focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>
        <div className="w-full md:w-64">
          <CustomDropdown 
            options={categories.map(c => ({ label: c, value: c }))}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* --- PACKETS GRID --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-96 bg-white/5 rounded-[2.5rem] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackets.map((packet: any, idx) => (
            <motion.div 
              key={packet._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card glass-card rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-gold/30 transition-all flex flex-col shadow-2xl"
            >
              <div className="aspect-[4/3] bg-black relative overflow-hidden">
                {packet.images?.[0] ? (
                  <img src={packet.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5">
                    <Package size={64} />
                  </div>
                )}
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-full text-[10px] font-black text-gold uppercase tracking-widest border border-gold/20 shadow-xl">
                  {packet.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>

              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-gold mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-gold" />)}
                    <span className="text-[10px] font-black ml-2 uppercase opacity-60 tracking-widest">Premium Grade</span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-gold transition-colors">{packet.name}</h3>
                  <p className="text-white/40 text-sm mt-3 leading-relaxed line-clamp-3 font-medium">
                    {packet.description || 'No description provided for this collection.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Packet Price</span>
                    <div className="flex items-center gap-1 text-2xl font-black text-white">
                      <IndianRupee size={18} className="text-gold" />
                      {packet.price}
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(packet)}
                    className="bg-gold-gradient text-black font-black px-8 py-3.5 rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                  >
                    <ShoppingCart size={18} /> ADD TO CART
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredPackets.length === 0 && !loading && (
        <div className="py-24 text-center space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
            <Package size={40} />
          </div>
          <h2 className="text-2xl font-black text-white/40 uppercase tracking-widest">No matching packets found</h2>
          <button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} className="text-gold text-sm font-bold uppercase tracking-widest hover:underline">Clear all filters</button>
        </div>
      )}

      {/* --- TRUST BADGE --- */}
      <div className="bg-gold/5 border border-gold/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-gold" size={32} />
          <div>
            <h4 className="text-white font-black text-sm uppercase">Verified Standards</h4>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">100% Industry Standard SOPs</p>
          </div>
        </div>
        <div className="w-px h-12 bg-white/10 hidden md:block"></div>
        <div className="flex items-center gap-4">
          <Zap className="text-gold" size={32} />
          <div>
            <h4 className="text-white font-black text-sm uppercase">Instant Access</h4>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Digital Download available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
