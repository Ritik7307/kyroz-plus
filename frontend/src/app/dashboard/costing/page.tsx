'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Save,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Lock,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface DishOption {
  label: string;
  value: string;
  price: number;
}

interface IngredientCostDetail {
  itemModel: 'RawMaterial' | 'SemiFinishedGood' | 'Packaging';
  itemId: string;
  name: string;
  quantity: number;
  unit: string;
  rateUnit: string;
  purchasePrice: number;
  unitCost: number;
  totalCost: number;
  isSubIngredient?: boolean;
  parentSfgName?: string;
}

interface CostingData {
  dishId: string;
  dishName: string;
  totalFoodCost: number;
  ingredientsCostDetails: IngredientCostDetail[];
  suggestedPricing: {
    minimumSellingPrice: number;
    maximumSellingPrice: number;
  };
  currentPrice: number;
  packagingLogic?: {
    dineIn: any[];
    takeaway: any[];
    delivery: any[];
  };
}

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
  const [dishes, setDishes] = useState<DishOption[]>([]);
  const [selectedDishId, setSelectedDishId] = useState<string>('');
  const [costingData, setCostingData] = useState<CostingData | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDishes, setLoadingDishes] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [editingPrices, setEditingPrices] = useState<Record<string, number>>({});
  const [savingIngredientId, setSavingIngredientId] = useState<string>('');
  const [sellingPriceInput, setSellingPriceInput] = useState<number | ''>('');
  const [savingSellingPrice, setSavingSellingPrice] = useState<boolean>(false);

  // Fetch Dishes on load
  useEffect(() => {
    const fetchDishes = async () => {
      setLoadingDishes(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/dishes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch dishes');
        const data = await res.json();
        const formatted = data.map((d: any) => ({
          label: d.name,
          value: d._id,
          price: d.price
        }));
        setDishes(formatted);
        if (formatted.length > 0) {
          setSelectedDishId(formatted[0].value);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dishes');
      } finally {
        setLoadingDishes(false);
      }
    };
    fetchDishes();
  }, []);

  // Fetch costing for selected dish
  const fetchCosting = async (dishId: string) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/costing/dish/${dishId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to calculate dish costing');
      const data = await res.json();
      setCostingData(data);
      setSellingPriceInput(data.currentPrice || '');
      
      // Initialize local input values for editing ingredient prices
      const initialPrices: Record<string, number> = {};
      data.ingredientsCostDetails.forEach((ing: IngredientCostDetail) => {
        initialPrices[ing.itemId] = ing.purchasePrice;
      });
      setEditingPrices(initialPrices);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch costing details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDishId) {
      fetchCosting(selectedDishId);
    }
  }, [selectedDishId]);

  const handlePriceChange = (itemId: string, val: string) => {
    const numeric = parseFloat(val);
    setEditingPrices(prev => ({
      ...prev,
      [itemId]: isNaN(numeric) ? 0 : numeric
    }));
  };

  const handleSaveIngredientPrice = async (itemId: string, itemModel: string) => {
    setSavingIngredientId(itemId);
    setError('');
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('token');
      const newPrice = editingPrices[itemId];
      const res = await fetch(`${API_URL}/api/costing/ingredient`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemModel,
          itemId,
          price: Number(newPrice)
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update ingredient price');
      }
      
      // Re-fetch costing to update values
      if (selectedDishId) {
        await fetchCosting(selectedDishId);
      }
      setSuccessMessage('Ingredient price updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update price');
    } finally {
      setSavingIngredientId('');
    }
  };

  const handleSaveSellingPrice = async () => {
    if (!selectedDishId) return;
    setSavingSellingPrice(true);
    setError('');
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('token');
      
      // We look up the selected dish details from our list
      const currentDishOpt = dishes.find(d => d.value === selectedDishId);
      if (!currentDishOpt) throw new Error('Selected dish not found');

      const res = await fetch(`${API_URL}/api/dishes/${selectedDishId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: currentDishOpt.label,
          price: Number(sellingPriceInput)
        })
      });
      if (!res.ok) throw new Error('Failed to update selling price');
      
      // Update local dishes list
      setDishes(prev => prev.map(d => d.value === selectedDishId ? { ...d, price: Number(sellingPriceInput) } : d));
      
      // Re-fetch costing to synchronize
      await fetchCosting(selectedDishId);
      
      setSuccessMessage('Dish selling price updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update dish selling price');
    } finally {
      setSavingSellingPrice(false);
    }
  };

  // Cost calculations
  const costPerPlate = costingData?.totalFoodCost || 0;
  
  // Psychological Rounding Logic
  const getPsychologicalPrice = (price: number) => {
    if (price <= 0) return 0;
    const endings = [49, 59, 69, 79, 89, 99, 119, 149, 179, 199, 249, 299, 349, 399, 499, 599, 699, 799, 999];
    const closest = endings.reduce((prev, curr) => Math.abs(curr - price) < Math.abs(prev - price) ? curr : prev);
    return closest;
  };

  const multiplier = 3.0; // Standard base multiplier
  const rawSuggested = costPerPlate * multiplier;
  const suggestedPrice = getPsychologicalPrice(rawSuggested);
  const numericSellingPrice = Number(sellingPriceInput) || 0;
  const foodCostPercentage = numericSellingPrice > 0 ? (costPerPlate / numericSellingPrice) * 100 : 0;
  const profitMargin = numericSellingPrice - costPerPlate;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 text-white">
      <style>{noSpinnerStyle}</style>

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-card/35 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 relative z-30">
        <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold/5 rounded-full -mr-32 md:-mr-64 -mt-32 md:-mt-64 blur-[80px] md:blur-[120px]"></div>
        </div>
        
        <div className="space-y-4 relative z-10 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
            <span className="w-6 md:w-10 h-[2px] bg-gold"></span>
            Financial Intelligence
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
            COSTING <span className="text-gold">MASTER</span>
          </h1>
          <p className="text-white/40 text-sm md:text-lg max-w-xl font-medium leading-relaxed italic mx-auto lg:mx-0">
            "Optimize your margins. Protect your profits."
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-3 relative z-10 w-full lg:w-[350px]">
          {loadingDishes ? (
            <div className="flex items-center gap-2 text-white/40">
              <Loader2 className="animate-spin text-gold" size={16} />
              <span>Loading dishes...</span>
            </div>
          ) : (
            <div className="w-full">
              <CustomDropdown
                options={dishes}
                value={selectedDishId}
                onChange={setSelectedDishId}
                label="Selected Restaurant Dish"
                placeholder="Choose a dish to analyze"
              />
            </div>
          )}
        </div>
      </header>

      {/* Status Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold"
          >
            <AlertTriangle size={18} className="shrink-0" />
            {error}
          </motion.div>
        )}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-green-950/40 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-400 text-sm font-bold"
          >
            <CheckCircle size={18} className="shrink-0" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-gold" size={48} />
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Recalculating plate costing...</p>
        </div>
      ) : costingData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
          
          {/* Left Column: Standard Recipe Ledger */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-50"></div>
              
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Lock className="text-gold" size={14} />
                  </div>
                  Standard Recipe Ledger
                </h3>
                <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full font-black text-white/50 uppercase tracking-widest">
                  Quantities Locked
                </span>
              </div>

              {/* Ingredient List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {costingData.ingredientsCostDetails.length > 0 ? (
                  costingData.ingredientsCostDetails.map((ing, idx) => (
                    <div 
                      key={`${ing.itemId}-${idx}`}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border transition-all gap-6 ${
                        ing.isSubIngredient 
                          ? 'ml-8 md:ml-12 bg-white/[0.005] border-white/5 opacity-80 border-dashed' 
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/5">
                          <span className="text-[14px] font-black text-white">{ing.quantity}</span>
                          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{ing.unit}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {ing.isSubIngredient && <span className="text-gold text-xs font-bold mr-1">↳</span>}
                            <h4 className="font-bold text-white uppercase tracking-tight text-lg">{ing.name}</h4>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                              ing.itemModel === 'RawMaterial' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              ing.itemModel === 'SemiFinishedGood' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                              'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}>
                              {ing.itemModel === 'RawMaterial' ? 'RAW' : ing.itemModel === 'SemiFinishedGood' ? 'SFG' : 'PKG'}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1">
                            {ing.isSubIngredient ? `Used in ${ing.parentSfgName} • ` : ''}Calculated contribution: ₹{ing.totalCost.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Ingredient Cost Editing Input */}
                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                        <div className="space-y-1 text-left md:text-right">
                          <label className="text-[9px] font-black text-white/20 uppercase tracking-widest block">
                            Purchase Rate / {ing.rateUnit}
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="relative w-28">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs font-bold">₹</span>
                              <input 
                                type="number" 
                                value={editingPrices[ing.itemId] !== undefined ? editingPrices[ing.itemId] : ing.purchasePrice}
                                onChange={(e) => handlePriceChange(ing.itemId, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-6 pr-2 text-xs font-bold outline-none focus:border-gold/50 text-gold"
                                placeholder="0.00"
                              />
                            </div>
                            <button
                              disabled={savingIngredientId === ing.itemId}
                              onClick={() => handleSaveIngredientPrice(ing.itemId, ing.itemModel)}
                              className="h-8 w-8 rounded-lg bg-gold hover:bg-gold/80 disabled:opacity-50 text-black flex items-center justify-center transition-all"
                              title="Update Ingredient Price"
                            >
                              {savingIngredientId === ing.itemId ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <Save size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-24 text-center border border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                      <Lock size={32} />
                    </div>
                    <p className="text-white/10 font-black uppercase tracking-[0.4em] text-[10px]">No ingredients mapped to this recipe</p>
                  </div>
                )}
              </div>
            </div>

            {/* Inherent Rules Informational Widget */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4">
              <h5 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
                <Sparkles size={14} /> KYROZ Standard Costing Policy
              </h5>
              <p className="text-[11px] text-white/60 font-medium leading-relaxed">
                Standard recipes are locked at the operational level. To safeguard margins, kitchen staff are prohibited from modifying quantities. Only the restaurant owner can define ingredient pricing matrices which directly impact active costs.
              </p>
            </div>
          </div>

          {/* Right Column: Financial Insights & Actual Pricing */}
          <div className="lg:col-span-4 space-y-8 sticky top-32">
            <div className="bg-gold-gradient p-0.5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(212,175,55,0.15)]">
              <div className="bg-[#111] rounded-[2.4rem] p-8 space-y-10 border border-gold/20">
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Cost Per Plate (Raw)</p>
                    <span className="text-2xl font-black text-white">₹{costPerPlate.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2 text-center">Suggested Selling Price (Rounded)</p>
                    <h2 className="text-6xl font-black tracking-tighter text-white text-center">
                      ₹{suggestedPrice}
                    </h2>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between gap-4">
                    <div className="text-center flex-1">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Min Price (2.5x)</p>
                      <span className="text-lg font-black text-green-500">₹{(costPerPlate * 2.5).toFixed(0)}</span>
                    </div>
                    <div className="text-center flex-1 border-l border-white/5">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Max Price (5x)</p>
                      <span className="text-lg font-black text-red-500">₹{(costPerPlate * 5.0).toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Actual Dish Selling Price</p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 text-2xl font-black">₹</span>
                      <input 
                        type="number" 
                        value={sellingPriceInput}
                        onChange={(e) => setSellingPriceInput(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-full bg-white/5 border-2 border-gold/30 rounded-2xl py-4 pl-10 pr-4 text-3xl font-black text-gold focus:outline-none focus:border-gold text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Food Cost %</span>
                    <span className={`text-xl font-black ${
                      foodCostPercentage <= 30 ? 'text-green-500' :
                      foodCostPercentage <= 35 ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {foodCostPercentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  {foodCostPercentage > 35 && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl flex gap-2 text-[10px] text-red-400 font-bold leading-normal">
                      <AlertTriangle className="shrink-0 text-red-400" size={14} />
                      <span>Warning: High food cost! Target less than 35% for maximum profitability.</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Gross Profit</span>
                    <span className="text-xl font-black text-white">₹{profitMargin.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleSaveSellingPrice}
                  disabled={savingSellingPrice || sellingPriceInput === ''}
                  className="w-full bg-gold text-black py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {savingSellingPrice ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Apply Selling Price
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4 text-white/30">
          <Calculator size={48} />
          <p className="font-bold uppercase tracking-widest text-sm">Please select a dish to see its costing calculations</p>
        </div>
      )}
    </div>
  );
}
