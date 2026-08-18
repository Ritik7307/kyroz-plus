'use client';

import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Clock, 
  Thermometer, 
  Droplets,
  Scale,
  RotateCcw,
  ChefHat,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface GravyBatch {
  id: string;
  name: string;
  baseIngredient: string;
  qtyPerBatch: number;
  yieldLtr: number;
  shelfLife: string;
  storageTemp: string;
}

export default function GravyMaster() {
  const [activeGravy, setActiveGravy] = useState<string>('Red Makhni');
  const [baseQty, setBaseQty] = useState(10); // e.g. 10kg tomatoes

  const gravies: GravyBatch[] = [
    { id: '1', name: 'Red Makhni', baseIngredient: 'Tomatoes', qtyPerBatch: 10, yieldLtr: 12, shelfLife: '48 Hours', storageTemp: '0°C - 4°C' },
    { id: '2', name: 'White Base', baseIngredient: 'Cashews', qtyPerBatch: 2, yieldLtr: 5, shelfLife: '24 Hours', storageTemp: '0°C - 2°C' },
    { id: '3', name: 'Yellow Base', baseIngredient: 'Onions', qtyPerBatch: 15, yieldLtr: 10, shelfLife: '72 Hours', storageTemp: '0°C - 4°C' },
    { id: '4', name: 'Chop Masala', baseIngredient: 'Onions', qtyPerBatch: 20, yieldLtr: 8, shelfLife: '96 Hours', storageTemp: '2°C - 5°C' },
  ];

  const currentGravy = gravies.find(g => g.name === activeGravy) || gravies[0];
  const calculatedYield = (baseQty / currentGravy.qtyPerBatch) * currentGravy.yieldLtr;
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-card/30 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-gold text-xs font-bold uppercase tracking-[0.4em]">
            <span className="w-10 h-[2px] bg-gold"></span>
            Production Consistency
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none text-white">
            GRAVY <span className="text-gold">MASTER</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl font-medium leading-relaxed italic">
            "The soul of the dish. Standardized every single time."
          </p>
        </div>

        <div className="flex gap-4 relative z-10">
           <div className="bg-black/40 p-6 rounded-3xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold"><Clock size={24} /></div>
              <div>
                <p className="text-xs font-black text-white/30 uppercase tracking-widest">Active Prep</p>
                <p className="text-xl font-black text-white uppercase tracking-tight">Morning Shift</p>
              </div>
           </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Gravy Selection */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-white/40 text-[11px] font-black tracking-[0.3em] uppercase px-2">Select Base Gravy</h3>
          <div className="space-y-3">
            {gravies.map((g) => (
              <button
                key={g.id}
                onClick={() => { setActiveGravy(g.name); setBaseQty(g.qtyPerBatch); }}
                className={`w-full p-6 rounded-[1.5rem] border transition-all text-left flex items-center justify-between group ${
                  activeGravy === g.name 
                  ? 'bg-gold/10 border-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]' 
                  : 'bg-card border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    activeGravy === g.name ? 'bg-gold text-black shadow-lg' : 'bg-white/5 text-white/20 group-hover:text-gold'
                  }`}>
                    <ChefHat size={24} />
                  </div>
                  <div>
                    <h4 className={`font-black text-lg transition-colors ${activeGravy === g.name ? 'text-white' : 'text-white/40'}`}>{g.name}</h4>
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Standard Batch: {g.qtyPerBatch}kg</p>
                  </div>
                </div>
                <ChevronRight size={20} className={activeGravy === g.name ? 'text-gold' : 'text-white/5'} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Prep Calculator & Standards */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-card glass-card rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
              <div className="space-y-6 flex-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Scale className="text-gold" size={28} /> Production Calculator
                </h3>
                <div className="space-y-4">
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">How many KG of <span className="text-gold">{currentGravy.baseIngredient}</span> are you using?</p>
                  <input 
                    type="number" 
                    value={baseQty}
                    onChange={(e) => setBaseQty(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-5xl font-black text-gold outline-none focus:border-gold transition-all"
                  />
                </div>
              </div>

              <div className="bg-gold-gradient p-1 rounded-[2rem] min-w-[280px]">
                <div className="bg-[#111] rounded-[1.9rem] p-8 flex flex-col items-center text-center">
                   <p className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-2">Total Expected Yield</p>
                   <h2 className="text-6xl font-black text-gold tracking-tighter">{calculatedYield.toFixed(1)}</h2>
                   <p className="text-xl font-black text-white mt-1 uppercase tracking-widest">LITERS</p>
                   <div className="w-full h-[1px] bg-white/5 my-6"></div>
                   <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                     Ensures consistent thickness and seasoning for {currentGravy.name}
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card glass-card rounded-[2rem] border border-white/5 p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <Thermometer size={32} />
              </div>
              <div>
                <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">Storage Temperature</p>
                <p className="text-2xl font-black text-white">{currentGravy.storageTemp}</p>
              </div>
            </div>

            <div className="bg-card glass-card rounded-[2rem] border border-white/5 p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <Droplets size={32} />
              </div>
              <div>
                <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">Shelf Life (Max)</p>
                <p className="text-2xl font-black text-white">{currentGravy.shelfLife}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 rounded-full border-4 border-gold/20 border-t-gold animate-spin-slow flex items-center justify-center">
               <RotateCcw className="text-gold" size={24} />
            </div>
            <div className="space-y-3 flex-1">
              <h4 className="text-lg font-black text-white uppercase tracking-tight">Reheating Protocol</h4>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Never mix old gravy with new batch. Always reheat only the required portion in a clean copper/steel handi to maintain base color and avoid charring.
              </p>
            </div>
            <button 
              onClick={() => router.push(`/dashboard/sop?search=${encodeURIComponent(currentGravy.name)}`)}
              className="px-8 py-4 bg-white/10 hover:bg-gold hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              View Full SOP
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
