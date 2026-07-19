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
  itemModel: 'RawMaterial' | 'SemiFinishedGood' | 'Packaging' | 'PortionMaster' | 'PreparationMaster';
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
  const [businessType, setBusinessType] = useState<string>('Casual Dining');

  // New states for Recipe Builder
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([]);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [newRawMaterial, setNewRawMaterial] = useState({
    name: '',
    consumptionUnit: '',
    purchaseUnit: '',
    costPerPurchaseUnit: '',
    conversionFactor: 1
  });
  const [savingRawMaterial, setSavingRawMaterial] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);

  
  // Fetch Inventory
  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/inventory`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        const mappedRM = (data.rawMaterials || []).map((rm: any) => ({ ...rm, model: 'RawMaterial' }));
        const mappedSFG = (data.semiFinishedGoods || []).map((sfg: any) => ({ ...sfg, model: 'SemiFinishedGood' }));
        const mappedPkg = (data.packaging || []).map((pkg: any) => ({ ...pkg, model: 'Packaging' }));
        setAvailableIngredients([...mappedRM, ...mappedSFG, ...mappedPkg]);
      }
    } catch (err) {
      console.error('Failed to load inventory', err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

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

  const [localIngredients, setLocalIngredients] = useState<any[]>([]);

  // Fetch costing for selected dish
  const fetchCosting = async (dishId: string) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/costing/dish/${dishId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Failed to calculate dish costing');
      const data = await res.json();
      setCostingData(data);
      setSellingPriceInput(data.currentPrice || '');
      setLocalIngredients(data.ingredientsCostDetails);
      
      // Initialize local input values for editing ingredient prices
      const initialPrices: Record<string, number> = {};
      data.ingredientsCostDetails.forEach((ing: any) => {
        let displayPrice = ing.purchasePrice;
        if (ing.rateUnit === 'gm' || ing.rateUnit === 'ml') {
          displayPrice = ing.purchasePrice * 1000;
        }
        initialPrices[ing.itemId] = displayPrice;
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
      let newPrice = Number(editingPrices[itemId]);
      const ing = localIngredients.find(i => i.itemId === itemId);
      if (ing && (ing.rateUnit === 'gm' || ing.rateUnit === 'ml')) {
        newPrice = newPrice / 1000;
      }

      const res = await fetch(`${API_URL}/api/costing/ingredient`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemModel,
          itemId,
          price: newPrice
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

  // Compute cost per plate locally based on editingPrices and quantities
  const costPerPlate = localIngredients ? localIngredients.reduce((total, ing) => {
    // Top level ingredients only (sub-ingredients are bundled into their parent SFG cost)
    if (ing.isSubIngredient) return total;
    
    // Get the current editing price for the purchase unit
    let currentPurchasePrice = editingPrices[ing.itemId] !== undefined ? editingPrices[ing.itemId] : ing.purchasePrice;
    
    // Convert currentPurchasePrice to unit cost
    if (ing.rateUnit === 'gm' || ing.rateUnit === 'ml') {
        currentPurchasePrice = currentPurchasePrice / 1000;
    }
    
    const qty = Number(ing.quantity) || 0;
    return total + (qty * currentPurchasePrice);
  }, 0) : (costingData?.totalFoodCost || 0);
  
  // Psychological Rounding Logic
  const getPsychologicalPrice = (price: number) => {
    if (price <= 0) return 0;
    const endings = [49, 59, 69, 79, 89, 99, 119, 149, 179, 199, 249, 299, 349, 399, 499, 599, 699, 799, 999];
    const closest = endings.reduce((prev, curr) => Math.abs(curr - price) < Math.abs(prev - price) ? curr : prev);
    return closest;
  };

  const multiplier = businessType === 'Street Food / Kiosk' ? 2.5 : businessType === 'Fine Dining' ? 4.0 : 3.0;
  const rawSuggested = costPerPlate * multiplier;
  const suggestedPrice = getPsychologicalPrice(rawSuggested);
  const numericSellingPrice = Number(sellingPriceInput) || 0;
  const foodCostPercentage = numericSellingPrice > 0 ? (costPerPlate / numericSellingPrice) * 100 : 0;
  const profitMargin = numericSellingPrice - costPerPlate;

  const handleUpdateRecipe = async () => {
    if (!selectedDishId) return;
    setSavingRecipe(true);
    try {
      const token = localStorage.getItem('token');
      
      // Group ingredients by their parent recipe
      const grouped: Record<string, any> = {};
      
      localIngredients.forEach(ing => {
        const pId = ing.parentId || selectedDishId;
        const pModel = ing.parentModel || 'Dish';
        const key = `${pModel}_${pId}`;
        
        if (!grouped[key]) {
          grouped[key] = {
            targetModel: pModel,
            targetId: pId,
            ingredients: []
          };
        }
        
        grouped[key].ingredients.push({
          itemModel: ing.itemModel,
          itemId: ing.itemId,
          quantity: Number(ing.quantity) || 1,
          unit: ing.unit
        });
      });
      
      const bulkUpdates = Object.values(grouped);
      
      const res = await fetch(`${API_URL}/api/costing/recipe/bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ bulkUpdates })
      });
      
      if (!res.ok) throw new Error('Failed to save recipe');
      await fetchCosting(selectedDishId);
      setSuccessMessage('Recipe saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save recipe');
    } finally {
      setSavingRecipe(false);
    }
  };

  const handleAddExistingIngredient = (item: any) => {
    if (!localIngredients) return;
    if (localIngredients.some(i => i.itemId === item._id && !i.isSubIngredient)) {
      alert('Ingredient already in recipe');
      return;
    }
    
    const newIngredient = {
      itemModel: item.model,
      itemId: item._id,
      name: item.name,
      quantity: 1,
      unit: item.consumptionUnit || item.yieldUnit || item.unit,
      rateUnit: item.purchaseUnit || item.yieldUnit || item.unit,
      purchasePrice: item.costPerPurchaseUnit || item.costPerUnit || 0,
      unitCost: item.costPerPurchaseUnit || item.costPerUnit || 0,
      totalCost: item.costPerPurchaseUnit || item.costPerUnit || 0,
      isSubIngredient: false
    };
    setLocalIngredients(prev => [...prev, newIngredient]);
  };

  const handleRemoveIngredient = (itemId: string) => {
    setLocalIngredients(prev => prev.filter(i => i.isSubIngredient || i.itemId !== itemId));
  };

  const handleUpdateIngredientQuantity = (index: number, newQty: string) => {
    setLocalIngredients(prev => prev.map((i, idx) => idx === index ? { ...i, quantity: newQty } : i));
  };

  const handleCreateNewRawMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRawMaterial(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/inventory/raw-materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: newRawMaterial.name,
          consumptionUnit: newRawMaterial.consumptionUnit,
          purchaseUnit: newRawMaterial.purchaseUnit,
          costPerPurchaseUnit: Number(newRawMaterial.costPerPurchaseUnit),
          conversionFactor: Number(newRawMaterial.conversionFactor)
        })
      });
      if (!res.ok) throw new Error('Failed to create ingredient');
      const savedItem = await res.json();
      
      // Close modal and refresh inventory
      setShowAddIngredientModal(false);
      setNewRawMaterial({ name: '', consumptionUnit: '', purchaseUnit: '', costPerPurchaseUnit: '', conversionFactor: 1 });
      await fetchInventory();
      
      // Auto-add to recipe
      handleAddExistingIngredient({ ...savedItem, model: 'RawMaterial' });
      
    } catch (err: any) {
      alert(err.message || 'Failed to create ingredient');
    } finally {
      setSavingRawMaterial(false);
    }
  };

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
                placeholder="Search or choose a dish to analyze"
                searchable={true}
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
                    <Edit2 className="text-gold" size={14} />
                  </div>
                  Standard Recipe Ledger
                </h3>
                <span className="text-[10px] bg-gold/20 border border-gold/30 px-3 py-1.5 rounded-full font-black text-gold uppercase tracking-widest flex items-center gap-2">
                  {savingRecipe ? <Loader2 className="animate-spin" size={10} /> : <CheckCircle size={10} />} Recipe Active
                </span>
              </div>

              {/* Ingredient List */}
              <div className="space-y-4">
                {localIngredients && localIngredients.length > 0 ? (
                  localIngredients.map((ing: any, index: number) => (
                    <div 
                      key={`${ing.itemId}-${index}`}
                      className={`group relative p-4 rounded-3xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 ${
                        ing.isSubIngredient 
                          ? 'ml-8 md:ml-12 border-dashed opacity-80' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="min-w-[4.5rem] px-2 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/5 shrink-0">
                          <input
                            type="number"
                            value={ing.quantity}
                            onChange={(e) => handleUpdateIngredientQuantity(index, e.target.value)}
                            className="w-16 bg-transparent text-center text-[14px] font-black text-white outline-none focus:text-gold"
                          />
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
                            Purchase / {ing.rateUnit === 'gm' ? 'kg' : ing.rateUnit === 'ml' ? 'L' : ing.rateUnit}
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
                            {!ing.isSubIngredient && (
                              <button
                                onClick={() => handleRemoveIngredient(ing.itemId)}
                                className="h-8 w-8 ml-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-all"
                                title="Remove Ingredient"
                              >
                                ✕
                              </button>
                            )}
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
                
                {/* Save Recipe Button */}
                {localIngredients.length > 0 && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleUpdateRecipe}
                      disabled={savingRecipe}
                      className="bg-gold text-black px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      {savingRecipe ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Save size={16} />
                      )}
                      Save Recipe Configuration
                    </button>
                  </div>
                )}

                {/* Add Ingredient Dropdown */}
                {selectedDishId && (
                  <div className="mt-4 pt-4 border-t border-dashed border-white/10">
                    <select
                      onChange={(e) => {
                        if (e.target.value === 'CREATE_NEW') {
                          setShowAddIngredientModal(true);
                        } else {
                          const item = availableIngredients.find(i => i._id === e.target.value);
                          if (item) handleAddExistingIngredient(item);
                        }
                        e.target.value = '';
                      }}
                      className="w-full bg-black/40 p-4 rounded-xl border border-white/10 text-sm font-bold text-white/70 outline-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>+ Add Ingredient...</option>
                      {availableIngredients.map(item => (
                        <option key={item._id} value={item._id} className="bg-[#111]">{item.name} ({item.model})</option>
                      ))}
                      <option value="CREATE_NEW" className="bg-gold text-black font-black">+ Create New Ingredient</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Business Type Selector for Pricing */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
              <h5 className="text-sm md:text-base font-black text-gold uppercase tracking-[0.2em]">
                Pricing Strategy Simulator
              </h5>
              <p className="text-[11px] text-white/60 font-medium leading-relaxed">
                Select your business type to see suggested pricing based on industry standard margins.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Street Food / Kiosk', 'Casual Dining', 'Fine Dining'].map(type => (
                  <button
                    key={type}
                    onClick={() => setBusinessType(type)}
                    className={`p-4 rounded-xl border text-xs font-bold transition-all text-left ${
                      businessType === type 
                        ? 'bg-gold/10 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                        : 'bg-black/20 border-white/10 text-white/50 hover:border-white/30'
                    }`}
                  >
                    {type}
                    <div className="text-[9px] font-medium opacity-60 mt-1 uppercase tracking-widest">
                      {type === 'Street Food / Kiosk' ? '2.5x Multiplier' : type === 'Casual Dining' ? '3.0x Multiplier' : '4.0x Multiplier'}
                    </div>
                  </button>
                ))}
              </div>
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

      {/* Create New Ingredient Modal */}
      <AnimatePresence>
        {showAddIngredientModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-white/10 rounded-[3.5rem] p-12 w-full max-w-2xl relative shadow-3xl text-white"
            >
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-10 text-gold">Create New Raw Material</h3>
              
              <form onSubmit={handleCreateNewRawMaterial} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Item Name</label>
                    <input 
                      type="text" 
                      required
                      value={newRawMaterial.name}
                      onChange={(e) => setNewRawMaterial({ ...newRawMaterial, name: e.target.value })}
                      placeholder="e.g. Tomatoes"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-gold transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Cost Per Purchase Unit (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={newRawMaterial.costPerPurchaseUnit}
                      onChange={(e) => setNewRawMaterial({ ...newRawMaterial, costPerPurchaseUnit: e.target.value })}
                      placeholder="e.g. 50"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-gold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Purchase Unit</label>
                    <input 
                      type="text" 
                      required
                      value={newRawMaterial.purchaseUnit}
                      onChange={(e) => setNewRawMaterial({ ...newRawMaterial, purchaseUnit: e.target.value })}
                      placeholder="e.g. kg"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-gold transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Consumption Unit</label>
                    <input 
                      type="text" 
                      required
                      value={newRawMaterial.consumptionUnit}
                      onChange={(e) => setNewRawMaterial({ ...newRawMaterial, consumptionUnit: e.target.value })}
                      placeholder="e.g. g"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-gold transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Conversion Factor</label>
                    <input 
                      type="number" 
                      required
                      value={newRawMaterial.conversionFactor}
                      onChange={(e) => setNewRawMaterial({ ...newRawMaterial, conversionFactor: Number(e.target.value) })}
                      placeholder="e.g. 1000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-gold transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit" 
                    disabled={savingRawMaterial}
                    className="flex-1 py-6 rounded-2xl bg-gold text-black font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {savingRawMaterial ? <Loader2 className="animate-spin" size={16} /> : 'Create & Add to Recipe'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddIngredientModal(false)} 
                    className="px-10 py-6 rounded-2xl bg-white/5 text-white/40 font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
