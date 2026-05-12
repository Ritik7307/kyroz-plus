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
import { API_URL } from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  rate: number; // Price per unit
}

// Custom CSS to hide number spinners
const noSpinnerStyle = `
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

export default function CostingMaster() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [yieldPlates, setYieldPlates] = useState(1);
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [dishName, setDishName] = useState('New Recipe');
  const [category, setCategory] = useState('Indian Gravy');
  const [positioning, setPositioning] = useState('Standard');

  const [newIng, setNewIng] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    rate: 0
  });

  const categories: Record<string, number> = {
    'Burger / Fast Food': 3.0,
    'Chinese': 3.5,
    'Cafe Beverage': 5.0,
    'South Indian': 3.0,
    'Indian Gravy': 3.5,
    'Biryani': 3.0,
    'Mandi': 3.0,
    'Tandoori Paneer / Soya Chaap': 3.5,
    'Tandoori Chicken': 3.0,
    'Seek Kabab': 3.2,
    'Al Faham': 3.5
  };

  const positions: Record<string, number> = {
    'Budget': 0.9,
    'Standard': 1.0,
    'Premium': 1.2
  };

  const totalCost = ingredients.reduce((sum, ing) => {
    let itemCost = 0;
    if (ing.unit === 'gm' || ing.unit === 'ml') {
      itemCost = (ing.quantity / 1000) * ing.rate;
    } else {
      itemCost = ing.quantity * ing.rate;
    }
    return sum + itemCost;
  }, 0);

  const costPerPlate = yieldPlates > 0 ? totalCost / yieldPlates : 0;
  
  // Intelligent Calculation
  const multiplier = categories[category] || 3.5;
  const modifier = positions[positioning] || 1.0;
  const rawSuggested = costPerPlate * multiplier * modifier;

  // Psychological Rounding Logic
  const getPsychologicalPrice = (price: number) => {
    if (price <= 0) return 0;
    const endings = [49, 59, 69, 79, 89, 99, 119, 149, 179, 199, 249, 299, 349, 399, 499, 599, 699, 799, 999];
    const closest = endings.reduce((prev, curr) => Math.abs(curr - price) < Math.abs(prev - price) ? curr : prev);
    return closest;
  };

  const suggestedPrice = getPsychologicalPrice(rawSuggested);
  const numericSellingPrice = Number(sellingPrice) || 0;
  const foodCostPercentage = numericSellingPrice > 0 ? (costPerPlate / numericSellingPrice) * 100 : 0;
  const profitMargin = numericSellingPrice - costPerPlate;

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
      <style>{noSpinnerStyle}</style>
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-card/30 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold/5 rounded-full -mr-32 md:-mr-64 -mt-32 md:-mt-64 blur-[80px] md:blur-[120px]"></div>
        
        <div className="space-y-4 relative z-10 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
            <span className="w-6 md:w-10 h-[2px] bg-gold"></span>
            Financial Intelligence
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none text-white">
            COSTING <span className="text-gold">MASTER</span>
          </h1>
          <p className="text-white/40 text-sm md:text-lg max-w-xl font-medium leading-relaxed italic mx-auto lg:mx-0">
            "Optimize your margins. Protect your profits."
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-2 relative z-10">
          <input 
            type="text" 
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className="bg-transparent border-b-2 border-gold/30 text-xl md:text-3xl font-black text-center lg:text-right text-gold focus:border-gold outline-none uppercase tracking-tighter px-2 w-full lg:w-auto"
            placeholder="DISH NAME"
          />
          <p className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Recipe Financial Audit</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Ingredient Builder */}
          <div className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-50"></div>
            
            <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white mb-10 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                <Plus className="text-gold" size={16} />
              </div>
              Ingredient Costing
            </h3>
            
            <div className="flex flex-col lg:flex-row items-end gap-4 mb-12">
              <div className="flex-1 space-y-3 w-full">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 block truncate">Ingredient Name</label>
                <input 
                  type="text" 
                  value={newIng.name}
                  onChange={(e) => setNewIng({...newIng, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-gold/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                  placeholder="e.g. Fresh Paneer"
                />
              </div>

              <div className="flex-1 space-y-3 w-full">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 block truncate">Quantity</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={newIng.quantity === 0 ? '' : newIng.quantity}
                    onChange={(e) => setNewIng({...newIng, quantity: Number(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-gold/50 transition-all"
                    placeholder="0.00"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <select 
                      value={newIng.unit}
                      onChange={(e) => setNewIng({...newIng, unit: e.target.value})}
                      className="bg-black border border-white/10 rounded-lg px-2 py-1.5 text-[9px] font-black text-gold uppercase outline-none cursor-pointer hover:border-gold/50 transition-all"
                    >
                      <option value="kg">KG</option>
                      <option value="gm">GM</option>
                      <option value="ltr">LTR</option>
                      <option value="ml">ML</option>
                      <option value="pkt">PKT</option>
                      <option value="unit">UNIT</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 block truncate">Rate / Unit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 font-bold">₹</span>
                  <input 
                    type="number" 
                    value={newIng.rate === 0 ? '' : newIng.rate}
                    onChange={(e) => setNewIng({...newIng, rate: Number(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-8 text-gold font-black outline-none focus:border-gold/50 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="w-full lg:w-auto shrink-0">
                <button 
                  onClick={addIngredient}
                  className="w-full lg:w-[120px] h-[58px] bg-gold text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gold/10 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {ingredients.map((ing) => (
                  <motion.div 
                    key={ing.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-6 bg-white/[0.02] rounded-2xl border border-white/5 group hover:bg-white/[0.05] hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/5 group-hover:border-gold/20 transition-all">
                        <span className="text-[14px] font-black text-white">{ing.quantity}</span>
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{ing.unit}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white uppercase tracking-tight text-lg">{ing.name}</h4>
                        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Rate: ₹{ing.rate} / {ing.unit === 'gm' || ing.unit === 'kg' ? 'KG' : ing.unit === 'ml' || ing.unit === 'ltr' ? 'LTR' : 'UNIT'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Calculated Cost</p>
                        <span className="text-2xl font-black text-gold">
                          ₹{ing.unit === 'gm' || ing.unit === 'ml' 
                            ? ((ing.quantity / 1000) * ing.rate).toFixed(2) 
                            : (ing.quantity * ing.rate).toFixed(2)}
                        </span>
                      </div>
                      <button onClick={() => removeIngredient(ing.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {ingredients.length === 0 && (
                <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/10 group-hover:text-gold/20 transition-all">
                    <Calculator size={32} />
                  </div>
                  <p className="text-white/10 font-black uppercase tracking-[0.4em] text-[10px]">Your Ingredient Ledger is Empty</p>
                </div>
              )}
            </div>
          </div>

          {/* Recipe Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <p className="text-xs font-black text-white/60 uppercase">Batch Yield</p>
                  <span className="text-2xl font-black text-white">{yieldPlates} PLATES</span>
                </div>
              </div>
            </div>

            <div className="bg-card glass-card rounded-[2rem] border border-white/5 p-8 space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <PieChart size={14} className="text-gold" /> Category
              </h4>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-black text-white outline-none focus:border-gold appearance-none"
              >
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat} className="bg-black">{cat}</option>
                ))}
              </select>
            </div>

            <div className="bg-card glass-card rounded-[2rem] border border-white/5 p-8 space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <DollarSign size={14} className="text-gold" /> Positioning
              </h4>
              <select 
                value={positioning}
                onChange={(e) => setPositioning(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-black text-white outline-none focus:border-gold appearance-none"
              >
                {Object.keys(positions).map(pos => (
                  <option key={pos} value={pos} className="bg-black">{pos}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Insights */}
        <div className="lg:col-span-4 space-y-8 sticky top-32">
          
          <div className="bg-gold-gradient p-1 rounded-[2.5rem] shadow-[0_30px_100px_rgba(212,175,55,0.15)]">
            <div className="bg-[#111] rounded-[2.4rem] p-10 space-y-10 border border-gold/20">
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Cost Per Plate</p>
                  <span className="text-2xl font-black text-white">₹{costPerPlate.toFixed(2)}</span>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2 text-center">Suggested Price (Psychological)</p>
                  <h2 className="text-7xl font-black tracking-tighter text-white text-center">
                    ₹{suggestedPrice}
                  </h2>
                </div>

                <div className="space-y-4 pt-6">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Actual Selling Price</p>
                  <input 
                    type="number" 
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-white/5 border-2 border-gold/30 rounded-2xl p-5 text-4xl font-black text-gold focus:outline-none focus:border-gold text-center"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Food Cost %</span>
                  <span className={`text-xl font-black ${foodCostPercentage > 35 ? 'text-red-500' : 'text-green-500'}`}>
                    {foodCostPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Gross Profit</span>
                  <span className="text-xl font-black text-white">₹{profitMargin.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-gold text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] transition-all">
                Save & Export
              </button>

            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4">
            <h5 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
              <Calculator size={14} /> Pricing Rule
            </h5>
            <p className="text-[11px] text-white/60 font-medium leading-relaxed">
              Based on <span className="text-white font-bold">{category}</span> and <span className="text-white font-bold">{positioning}</span> strategy, your base multiplier is <span className="text-gold font-black">{(categories[category] * positions[positioning]).toFixed(1)}x</span>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
