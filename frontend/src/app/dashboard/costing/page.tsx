'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  ChevronRight,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  rate: number; // Price per unit
}

export default function CostingMaster() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [yieldPlates, setYieldPlates] = useState(10);
  const [sellingPrice, setSellingPrice] = useState(250);
  const [dishName, setDishName] = useState('New Recipe');

  const [newIng, setNewIng] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    rate: 0
  });

  const totalCost = ingredients.reduce((sum, ing) => sum + (ing.quantity * ing.rate), 0);
  const costPerPlate = yieldPlates > 0 ? totalCost / yieldPlates : 0;
  const foodCostPercentage = sellingPrice > 0 ? (costPerPlate / sellingPrice) * 100 : 0;
  const profitMargin = sellingPrice - costPerPlate;
  const profitPercentage = sellingPrice > 0 ? (profitMargin / sellingPrice) * 100 : 0;

  const addIngredient = () => {
    if (!newIng.name || newIng.quantity <= 0) return;
    const item: Ingredient = {
      id: Math.random().toString(36).substr(2, 9),
      ...newIng
    };
    setIngredients([...ingredients, item]);
    setNewIng({ name: '', quantity: 0, unit: 'kg', rate: 0 });
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-card/30 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-gold text-xs font-bold uppercase tracking-[0.4em]">
            <span className="w-10 h-[2px] bg-gold"></span>
            Financial Intelligence
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none text-white">
            COSTING <span className="text-gold">MASTER</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl font-medium leading-relaxed italic">
            "Optimize your margins. Protect your profits."
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 relative z-10">
          <input 
            type="text" 
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className="bg-transparent border-b-2 border-gold/30 text-3xl font-black text-right text-gold focus:border-gold outline-none uppercase tracking-tighter px-2"
            placeholder="DISH NAME"
          />
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Recipe Financial Audit</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Ingredient Builder */}
          <div className="bg-card glass-card rounded-[2.5rem] border border-white/5 p-10 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8 flex items-center gap-3">
              <Plus className="text-gold" size={24} /> Ingredient Costing
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Ingredient Name</label>
                <input 
                  type="text" 
                  value={newIng.name}
                  onChange={(e) => setNewIng({...newIng, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-gold transition-all"
                  placeholder="e.g. Paneer"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Qty Used</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={newIng.quantity === 0 ? '' : newIng.quantity}
                    onChange={(e) => setNewIng({...newIng, quantity: Number(e.target.value)})}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-gold transition-all"
                    placeholder="0"
                  />
                  <select 
                    value={newIng.unit}
                    onChange={(e) => setNewIng({...newIng, unit: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-2xl px-4 text-xs font-bold text-white/60"
                  >
                    <option value="kg">KG</option>
                    <option value="gm">GM</option>
                    <option value="ltr">LTR</option>
                    <option value="pkt">PKT</option>
                    <option value="unit">UNIT</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Market Rate (Per Unit)</label>
                <input 
                  type="number" 
                  value={newIng.rate === 0 ? '' : newIng.rate}
                  onChange={(e) => setNewIng({...newIng, rate: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-gold font-bold outline-none focus:border-gold transition-all"
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={addIngredient}
                  className="w-full bg-gold text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.05] transition-all"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              <AnimatePresence>
                {ingredients.map((ing) => (
                  <motion.div 
                    key={ing.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 font-bold uppercase text-[10px] border border-white/5">
                        {ing.unit}
                      </div>
                      <div>
                        <h4 className="font-black text-white uppercase tracking-tight">{ing.name}</h4>
                        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">{ing.quantity} {ing.unit} @ ₹{ing.rate}/unit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <span className="text-xl font-black text-gold">₹{(ing.quantity * ing.rate).toFixed(2)}</span>
                      <button onClick={() => removeIngredient(ing.id)} className="text-white/10 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {ingredients.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] text-white/10 font-black uppercase tracking-[0.3em] text-xs">
                  No ingredients added yet
                </div>
              )}
            </div>
          </div>

          {/* Recipe Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card glass-card rounded-[2rem] border border-white/5 p-8 space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <TrendingUp size={14} className="text-gold" /> Production Yield
              </h4>
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={yieldPlates}
                  onChange={(e) => setYieldPlates(Number(e.target.value))}
                  className="w-full accent-gold bg-white/5 h-2 rounded-full cursor-pointer"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-white/60 uppercase">Expected Plates per Batch</p>
                  <span className="text-2xl font-black text-white">{yieldPlates} PLATES</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card glass-card rounded-[2rem] border border-white/5 p-8 space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <DollarSign size={14} className="text-gold" /> Market Strategy
              </h4>
              <div className="space-y-4">
                <input 
                  type="number" 
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-3xl font-black text-gold focus:outline-none focus:border-gold"
                />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Selling Price Per Plate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Insights */}
        <div className="lg:col-span-4 space-y-8 sticky top-32">
          <div className="bg-gold-gradient p-1 rounded-[2.5rem] shadow-[0_30px_100px_rgba(212,175,55,0.15)]">
            <div className="bg-[#111] rounded-[2.4rem] p-10 space-y-10 border border-gold/20">
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Estimated Food Cost %</p>
                <div className="flex items-baseline gap-4">
                  <h2 className={`text-6xl font-black tracking-tighter ${foodCostPercentage > 35 ? 'text-red-500' : 'text-gold'}`}>
                    {foodCostPercentage.toFixed(1)}%
                  </h2>
                  {foodCostPercentage > 35 ? (
                    <ArrowUpRight className="text-red-500" size={32} />
                  ) : (
                    <ArrowDownRight className="text-green-500" size={32} />
                  )}
                </div>
                <div className={`mt-4 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                  foodCostPercentage > 35 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
                }`}>
                  {foodCostPercentage > 35 ? 'Critical Alert: Margin Too Low' : 'Strategic Range: Healthy Margin'}
                </div>
              </div>

              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Total Batch Cost</span>
                  <span className="text-xl font-black text-white">₹{totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Cost Per Plate</span>
                  <span className="text-xl font-black text-white">₹{costPerPlate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Gross Profit/Plate</span>
                  <span className="text-xl font-black text-green-500">₹{profitMargin.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-10">
                <button className="w-full bg-gold text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] transition-all">
                  Sync to Master SOPs
                </button>
              </div>

            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4">
            <h5 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
              <PieChart size={14} /> Efficiency Tip
            </h5>
            <p className="text-[11px] text-white/60 font-medium leading-relaxed">
              Target a food cost between <span className="text-white font-bold">28% - 32%</span> for maximum profitability without sacrificing ingredient quality.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
