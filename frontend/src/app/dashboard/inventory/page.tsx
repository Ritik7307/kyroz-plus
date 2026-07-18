'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Plus, 
  Minus, 
  AlertTriangle, 
  Loader2,
  Trash2,
  ChevronRight,
  Database,
  RefreshCw,
  Edit2,
  Save,
  MessageCircle,
  ExternalLink,
  ShoppingCart,
  FileUp,
  Check,
  X,
  Eye,
  Settings,
  ChefHat
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface InventoryItem {
  _id: string;
  dishId: {
    _id: string;
    name: string;
    category: string;
  };
  platesPerPacket: number;
  totalPlates: number;
  lowStockThreshold: number;
  baseUnitName?: string;
  subUnitName?: string;
}

interface Dish {
  _id: string;
  name: string;
}

interface RawMaterial {
  _id: string;
  code: string;
  name: string;
  purchaseUnit: string;
  consumptionUnit: string;
  conversionFactor?: number;
  category: string;
  currentStock: number;
  costPerPurchaseUnit: number;
}

interface SemiFinishedGood {
  _id: string;
  code: string;
  name: string;
  batchYield: number;
  yieldUnit: string;
  currentStock: number;
  costPerUnit?: number;
}

interface Premix {
  _id: string;
  code: string;
  name: string;
  consumptionType: string;
  currentStock: number;
}

interface Packaging {
  _id: string;
  code: string;
  name: string;
  unit: string;
  currentStock: number;
  costPerUnit?: number;
}

interface RecipeIngredient {
  itemModel: 'RawMaterial' | 'SemiFinishedGood' | 'Premix' | 'SopPacket' | 'Packaging';
  itemId: string;
  quantity: number;
  _id: string;
}

interface Recipe {
  _id: string;
  targetModel: 'Dish' | 'SemiFinishedGood' | 'Premix';
  targetId: string;
  targetYield: number;
  operationalYield: number;
  ingredients: RecipeIngredient[];
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'dishes' | 'rawMaterials' | 'semiFinishedGoods' | 'premixes' | 'packaging'>('overview');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [semiFinishedGoods, setSemiFinishedGoods] = useState<SemiFinishedGood[]>([]);
  const [premixes, setPremixes] = useState<Premix[]>([]);
  const [packaging, setPackaging] = useState<Packaging[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [purchaseForm, setPurchaseForm] = useState({
    itemId: '',
    quantity: '',
    cost: ''
  });

  const [productionForm, setProductionForm] = useState({
    dishId: '',
    batches: ''
  });

  // Inline edit state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);
  
  // Modal Recipe View state
  const [viewingRecipe, setViewingRecipe] = useState<{ name: string; recipe: Recipe } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    dishId: '',
    platesPerPacket: 10,
    totalPackets: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseForm.itemId || !purchaseForm.quantity || !purchaseForm.cost) {
      alert('Please fill in all fields.');
      return;
    }
    const [itemId, itemModel] = purchaseForm.itemId.split('|');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/inventory/purchase`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId,
          itemModel,
          quantity: Number(purchaseForm.quantity),
          cost: Number(purchaseForm.cost)
        })
      });
      if (res.ok) {
        setShowPurchaseModal(false);
        setPurchaseForm({ itemId: '', quantity: '', cost: '' });
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to process purchase entry');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleProductionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productionForm.dishId || !productionForm.batches) {
      alert('Please fill in all fields.');
      return;
    }
    const [itemId, itemModel] = productionForm.dishId.split('|');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/inventory/produce`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId,
          itemModel,
          batches: Number(productionForm.batches)
        })
      });
      if (res.ok) {
        setShowProductionModal(false);
        setProductionForm({ dishId: '', batches: '' });
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to process production entry');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [invRes, dishRes] = await Promise.all([
        fetch(`${API_URL}/api/inventory`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/dishes`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (invRes.ok && dishRes.ok) {
        const invData = await invRes.json();
        const dishData = await dishRes.json();
        
        if (Array.isArray(invData)) {
          setInventory(invData);
        } else {
          setInventory(invData.dishes || []);
          setRawMaterials(invData.rawMaterials || []);
          setSemiFinishedGoods(invData.semiFinishedGoods || []);
          setPremixes(invData.premixes || []);
          setPackaging(invData.packaging || []);
          setRecipes(invData.recipes || []);
        }
        setDishes(dishData);
      }
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/inventory`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update inventory', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/inventory/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        const result = await res.json();
        alert(`Inventory configured successfully! 🎉\n\nExtracted:\n- ${result.stats.rm} Raw Materials\n- ${result.stats.sfg} Semi-Finished Goods\n- ${result.stats.premix} Premixes\n- ${result.stats.dishes} Dishes\n- ${result.stats.recipes} Recipes`);
        fetchData();
      } else {
        const err = await res.json();
        alert(`Upload failed: ${err.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed due to a network error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleNotify = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/inventory/notify/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Polite WhatsApp notification sent to Admin! ✅');
      }
    } catch (err) {
      console.error('Notify error', err);
    }
  };

  const openWhatsAppOrder = (item: InventoryItem) => {
    const packets = Math.floor(item.totalPlates / item.platesPerPacket);
    const message = `Hello Admin, 👨‍🍳\n\nI would like to place an order for restock:\nItem: *${item.dishId.name}*\nCurrent Stock: ${packets} packets.\n\nPlease arrange for more stock as soon as possible.\n\nThank you!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=917887009800&text=${encoded}`, '_blank');
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Remove this item?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/inventory/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };
  const startEditingStock = (id: string, currentStock: number) => {
    setEditingItemId(id);
    setEditingStockVal(currentStock);
  };

  const handleSaveStock = async (model: string, id: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/inventory/update-stock`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ model, id, currentStock: editingStockVal })
      });
      if (res.ok) {
        setEditingItemId(null);
        fetchData();
      } else {
        alert('Failed to update stock');
      }
    } catch (err) {
      console.error('Failed to update stock', err);
    }
  };

  const getIngredientName = (model: string, id: string) => {
    if (model === 'RawMaterial') {
      const found = rawMaterials.find(r => r._id === id);
      return found ? found.name : 'Unknown RM';
    }
    if (model === 'SemiFinishedGood') {
      const found = semiFinishedGoods.find(s => s._id === id);
      return found ? found.name : 'Unknown SFG';
    }
    if (model === 'Premix') {
      const found = premixes.find(p => p._id === id);
      return found ? found.name : 'Unknown Premix';
    }
    if (model === 'Packaging') {
      const found = packaging.find(pkg => pkg._id === id);
      return found ? found.name : 'Unknown Packaging';
    }
    return 'Unknown';
  };

  const handleViewRecipe = (targetModel: 'Dish' | 'SemiFinishedGood' | 'Premix', targetId: string, name: string) => {
    const found = recipes.find(r => r.targetModel === targetModel && r.targetId === targetId);
    if (found) {
      setViewingRecipe({ name, recipe: found });
    } else {
      alert('No recipe found for this item.');
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card glass-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Inventory <span className="text-gold">&</span> Stock</h2>
          <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] mt-2">Manage your kitchen supplies, raw materials and portion recipes.</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 relative z-10 w-full lg:w-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload} 
            accept=".pdf,.docx,.txt,.csv" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 w-full sm:w-auto"
          >
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
            Upload Recipes / SOP
          </button>
          <button 
            onClick={() => setShowPurchaseModal(true)}
            className="bg-gold text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.05] transition-all flex items-center justify-center gap-3 shadow-xl w-full sm:w-auto"
          >
            <Plus size={18} /> Purchase Entry
          </button>
          <button 
            onClick={() => setShowProductionModal(true)}
            className="bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl w-full sm:w-auto"
          >
            <Plus size={18} /> Production Entry
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-2 border-b border-white/5 scrollbar-thin">
        {[
          { key: 'overview', label: 'Overview & Valuation' },
          { key: 'dishes', label: 'Dishes / Portions' },
          { key: 'rawMaterials', label: 'Raw Materials' },
          { key: 'semiFinishedGoods', label: 'Semi-Finished' },
          { key: 'premixes', label: 'Premixes & Packets' },
          { key: 'packaging', label: 'Packaging' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as any); setEditingItemId(null); }}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.key 
                ? 'bg-gold text-black shadow-lg font-black' 
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-white/20 gap-6">
          <Loader2 className="animate-spin" size={64} />
          <p className="font-black uppercase tracking-[0.3em] text-sm">Syncing Inventory...</p>
        </div>
      ) : (
        <div className="pt-4">
          {/* 0. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {(() => {
                const totalRMValue = rawMaterials.reduce((acc, rm) => {
                  const factor = rm.conversionFactor || 1;
                  const unitCost = (rm.costPerPurchaseUnit || 0) / factor;
                  return acc + (rm.currentStock * unitCost);
                }, 0);
                
                const totalSFGValue = semiFinishedGoods.reduce((acc, sfg) => acc + (sfg.currentStock * (sfg.costPerUnit || 0)), 0);
                const totalPkgValue = packaging.reduce((acc, pkg) => acc + (pkg.currentStock * (pkg.costPerUnit || 0)), 0);
                const totalValuation = totalRMValue + totalSFGValue + totalPkgValue;

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-gold/30 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-all group-hover:bg-gold/20"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 relative z-10">Total Inventory Valuation</p>
                        <h3 className="text-4xl font-black text-white tracking-tighter relative z-10">₹{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                      </div>
                      <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 relative z-10">Raw Materials Value</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter relative z-10">₹{totalRMValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                      </div>
                      <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-green-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-all group-hover:bg-green-500/20"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 relative z-10">SFG Value</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter relative z-10">₹{totalSFGValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                      </div>
                      <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 relative z-10">Packaging Value</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter relative z-10">₹{totalPkgValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* 1. DISHES TAB */}
          {activeTab === 'dishes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {inventory.map((item) => {
                const packets = Math.floor(item.totalPlates / item.platesPerPacket);
                const isLow = packets <= item.lowStockThreshold;
                const hasRecipe = recipes.some(r => r.targetModel === 'Dish' && r.targetId === item.dishId?._id);

                return (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-card glass-card p-8 rounded-[2rem] border transition-all relative overflow-hidden flex flex-col justify-between h-[360px] ${
                      isLow ? 'border-red-500/30 bg-red-500/5 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : 'border-white/5 hover:border-gold/30'
                    }`}
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                          {item.dishId?.category || 'General'}
                        </span>
                        <h3 className="text-xl font-black mt-3 leading-tight uppercase tracking-tight">{item.dishId?.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        {hasRecipe && (
                          <button
                            onClick={() => handleViewRecipe('Dish', item.dishId?._id, item.dishId?.name)}
                            title="View Recipe Ingredients"
                            className="text-white/40 hover:text-gold transition-colors p-2"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleNotify(item._id)} 
                          title="Send Automatic Alert"
                          className="text-gold hover:bg-gold/10 transition-colors p-2 rounded-lg border border-gold/20"
                        >
                          <MessageCircle size={18} />
                        </button>
                        <button onClick={() => deleteItem(item._id)} className="text-white/10 hover:text-red-500 transition-colors p-2">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
                      <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{item.baseUnitName || 'Packets'}</p>
                        <p className={`text-3xl font-black ${isLow ? 'text-red-500' : 'text-gold'}`}>{packets}</p>
                      </div>
                      <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{item.subUnitName || 'Plates'}</p>
                        <p className="text-3xl font-black text-white">{item.totalPlates}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-3 relative z-10">
                      <button 
                        onClick={() => openWhatsAppOrder(item)}
                        className="w-full py-4 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-green-500/20"
                      >
                        <ShoppingCart size={14} /> Place Restock Order
                      </button>
                      <div className="flex items-center justify-between px-2">
                        <div className={`flex items-center gap-2 ${isLow ? 'text-red-500' : 'text-green-500'} text-[9px] font-black uppercase tracking-widest`}>
                          {isLow ? <AlertTriangle size={12} /> : <RefreshCw size={12} />}
                          {isLow ? 'Low Stock' : 'Stock OK'}
                        </div>
                        <span className="text-[9px] text-white/20 uppercase font-black">{item.platesPerPacket} {item.subUnitName || 'plates'}/{item.baseUnitName || 'pkt'}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 2. RAW MATERIALS TAB */}
          {activeTab === 'rawMaterials' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rawMaterials.map((item) => {
                const isEditing = editingItemId === item._id;

                return (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all flex flex-col justify-between h-[280px]"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-gold border border-gold/10">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-black mt-3 uppercase tracking-tight text-white">{item.name}</h3>
                      <p className="text-[10px] text-white/40 mt-1 uppercase font-bold">Cost: ₹{item.costPerPurchaseUnit} per {item.purchaseUnit}</p>
                    </div>

                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Current Stock</p>
                        {isEditing ? (
                          <input 
                            type="number"
                            value={editingStockVal}
                            onChange={(e) => setEditingStockVal(Number(e.target.value))}
                            className="bg-white/10 text-white font-black text-xl rounded px-2 w-28 border border-gold/40 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="text-2xl font-black text-white">{item.currentStock} <span className="text-xs text-white/40 font-normal">{item.consumptionUnit}</span></p>
                        )}
                      </div>
                      <div>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSaveStock('RawMaterial', item._id)}
                              className="p-3 bg-gold text-black rounded-xl hover:scale-105 transition-all"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingItemId(null)}
                              className="p-3 bg-white/5 text-white/40 rounded-xl hover:bg-white/10"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startEditingStock(item._id, item.currentStock)}
                            className="p-3 bg-white/5 hover:bg-gold hover:text-black rounded-xl border border-white/10 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {rawMaterials.length === 0 && (
                <div className="col-span-full text-center py-20 text-white/20 font-black uppercase tracking-widest text-sm">No raw materials loaded. Upload an SOP config file.</div>
              )}
            </div>
          )}

          {/* 3. SEMI-FINISHED GOODS TAB */}
          {activeTab === 'semiFinishedGoods' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {semiFinishedGoods.map((item) => {
                const isEditing = editingItemId === item._id;
                const hasRecipe = recipes.some(r => r.targetModel === 'SemiFinishedGood' && r.targetId === item._id);

                return (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all flex flex-col justify-between h-[280px]"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                          Yield: {item.batchYield} {item.yieldUnit}
                        </span>
                        <div className="flex gap-2 items-center">
                          {hasRecipe && (
                            <button
                              onClick={() => handleViewRecipe('SemiFinishedGood', item._id, item.name)}
                              title="View Recipe Ingredients"
                              className="text-white/40 hover:text-gold transition-colors p-1"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-black mt-3 uppercase tracking-tight text-white">{item.name}</h3>
                    </div>

                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Current Stock</p>
                        {isEditing ? (
                          <input 
                            type="number"
                            value={editingStockVal}
                            onChange={(e) => setEditingStockVal(Number(e.target.value))}
                            className="bg-white/10 text-white font-black text-xl rounded px-2 w-28 border border-gold/40 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="text-2xl font-black text-white">{item.currentStock} <span className="text-xs text-white/40 font-normal">{item.yieldUnit}</span></p>
                        )}
                      </div>
                      <div>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSaveStock('SemiFinishedGood', item._id)}
                              className="p-3 bg-gold text-black rounded-xl hover:scale-105 transition-all"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingItemId(null)}
                              className="p-3 bg-white/5 text-white/40 rounded-xl hover:bg-white/10"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startEditingStock(item._id, item.currentStock)}
                            className="p-3 bg-white/5 hover:bg-gold hover:text-black rounded-xl border border-white/10 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {semiFinishedGoods.length === 0 && (
                <div className="col-span-full text-center py-20 text-white/20 font-black uppercase tracking-widest text-sm">No semi-finished goods loaded.</div>
              )}
            </div>
          )}

          {/* 4. PREMIXES TAB */}
          {activeTab === 'premixes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premixes.map((item) => {
                const isEditing = editingItemId === item._id;

                return (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all flex flex-col justify-between h-[280px]"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                          {item.consumptionType}
                        </span>
                      </div>
                      <h3 className="text-xl font-black mt-3 uppercase tracking-tight text-white">{item.name}</h3>
                    </div>

                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Current Stock</p>
                        {isEditing ? (
                          <input 
                            type="number"
                            value={editingStockVal}
                            onChange={(e) => setEditingStockVal(Number(e.target.value))}
                            className="bg-white/10 text-white font-black text-xl rounded px-2 w-28 border border-gold/40 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="text-2xl font-black text-white">{item.currentStock} <span className="text-xs text-white/40 font-normal">Packets</span></p>
                        )}
                      </div>
                      <div>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSaveStock('Premix', item._id)}
                              className="p-3 bg-gold text-black rounded-xl hover:scale-105 transition-all"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingItemId(null)}
                              className="p-3 bg-white/5 text-white/40 rounded-xl hover:bg-white/10"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startEditingStock(item._id, item.currentStock)}
                            className="p-3 bg-white/5 hover:bg-gold hover:text-black rounded-xl border border-white/10 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {premixes.length === 0 && (
                <div className="col-span-full text-center py-20 text-white/20 font-black uppercase tracking-widest text-sm">No premixes loaded.</div>
              )}
            </div>
          )}

          {/* 5. PACKAGING TAB */}
          {activeTab === 'packaging' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packaging.map((item) => {
                const isEditing = editingItemId === item._id;

                return (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all flex flex-col justify-between h-[280px]"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                          Unit: {item.unit}
                        </span>
                      </div>
                      <h3 className="text-xl font-black mt-3 uppercase tracking-tight text-white">{item.name}</h3>
                    </div>

                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Current Stock</p>
                        {isEditing ? (
                          <input 
                            type="number"
                            value={editingStockVal}
                            onChange={(e) => setEditingStockVal(Number(e.target.value))}
                            className="bg-white/10 text-white font-black text-xl rounded px-2 w-28 border border-gold/40 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="text-2xl font-black text-white">{item.currentStock} <span className="text-xs text-white/40 font-normal">{item.unit}</span></p>
                        )}
                      </div>
                      <div>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSaveStock('Packaging', item._id)}
                              className="p-3 bg-gold text-black rounded-xl hover:scale-105 transition-all"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingItemId(null)}
                              className="p-3 bg-white/5 text-white/40 rounded-xl hover:bg-white/10"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startEditingStock(item._id, item.currentStock)}
                            className="p-3 bg-white/5 hover:bg-gold hover:text-black rounded-xl border border-white/10 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {packaging.length === 0 && (
                <div className="col-span-full text-center py-20 text-white/20 font-black uppercase tracking-widest text-sm">No packaging items loaded.</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DISH INVENTORY UPDATE MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-white/10 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 w-full max-w-lg relative z-10"
            >
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4 text-white">
                <Package className="text-gold" size={32} /> Update Stock
              </h3>
              
              <form onSubmit={handleUpdate} className="space-y-8">
                <div>
                  <CustomDropdown 
                    label="Food Item"
                    options={dishes.map(d => ({ label: d.name, value: d._id }))}
                    value={formData.dishId}
                    onChange={(val) => setFormData({...formData, dishId: val})}
                    placeholder="Choose item..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Packets</label>
                    <input 
                      type="number" 
                      required
                      value={formData.totalPackets === 0 ? '' : formData.totalPackets}
                      onChange={(e) => setFormData({...formData, totalPackets: Number(e.target.value)})}
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Yield (Plates/Pkt)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.platesPerPacket === 0 ? '' : formData.platesPerPacket}
                      onChange={(e) => setFormData({...formData, platesPerPacket: Number(e.target.value)})}
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 py-5 rounded-2xl bg-gold text-black font-black uppercase text-[11px] tracking-widest shadow-xl">
                    Update Inventory
                  </button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 rounded-2xl bg-white/5 text-white font-black uppercase text-[11px] tracking-widest">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECIPE VIEW MODAL */}
      <AnimatePresence>
        {viewingRecipe && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-white/10 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 w-full max-w-2xl relative z-10"
            >
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                Recipe Structure
              </h3>
              <p className="text-gold text-sm font-black uppercase tracking-wider mb-6">{viewingRecipe.name}</p>

              <div className="bg-black/40 rounded-2xl p-6 border border-white/5 max-h-[300px] overflow-y-auto space-y-4">
                {viewingRecipe.recipe.ingredients.map((ing) => (
                  <div key={ing._id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <div>
                      <span className="text-[10px] font-bold text-white/30 uppercase mr-3 tracking-widest">[{ing.itemModel}]</span>
                      <span className="text-white font-black text-sm uppercase">{getIngredientName(ing.itemModel, ing.itemId)}</span>
                    </div>
                    <span className="text-gold font-black text-base">
                      {ing.quantity} {ing.itemModel === 'RawMaterial' ? (rawMaterials.find(r => r._id === ing.itemId)?.consumptionUnit || 'gm') : ing.itemModel === 'Premix' ? 'Packets' : 'Units'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-8">
                <button 
                  onClick={() => setViewingRecipe(null)}
                  className="px-8 py-4 bg-gold text-black font-black uppercase text-[11px] tracking-widest rounded-2xl"
                >
                  Close Recipe
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PURCHASE ENTRY MODAL */}
      <AnimatePresence>
        {showPurchaseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-white/10 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 w-full max-w-lg relative z-10"
            >
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4 text-white">
                <ShoppingCart className="text-gold" size={32} /> Purchase Entry
              </h3>
              
              <form onSubmit={handlePurchaseSubmit} className="space-y-8">
                <div>
                  <CustomDropdown 
                    label="Select Material / Item"
                    options={[
                      ...rawMaterials.map(rm => ({ label: rm.name, value: `${rm._id}|RawMaterial` })),
                      ...packaging.map(pkg => ({ label: pkg.name, value: `${pkg._id}|Packaging` }))
                    ]}
                    value={purchaseForm.itemId}
                    onChange={(val) => setPurchaseForm({...purchaseForm, itemId: val})}
                    placeholder="Choose raw material or packaging..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Quantity Purchased</label>
                    <input 
                      type="number" 
                      step="any"
                      required
                      value={purchaseForm.quantity}
                      onChange={(e) => setPurchaseForm({...purchaseForm, quantity: e.target.value})}
                      placeholder="e.g. 10"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Total Cost (₹)</label>
                    <input 
                      type="number" 
                      step="any"
                      required
                      value={purchaseForm.cost}
                      onChange={(e) => setPurchaseForm({...purchaseForm, cost: e.target.value})}
                      placeholder="e.g. 2500"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 py-5 rounded-2xl bg-gold text-black font-black uppercase text-[11px] tracking-widest shadow-xl">
                    Save Purchase
                  </button>
                  <button type="button" onClick={() => setShowPurchaseModal(false)} className="flex-1 py-5 rounded-2xl bg-white/5 text-white font-black uppercase text-[11px] tracking-widest">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRODUCTION ENTRY MODAL */}
      <AnimatePresence>
        {showProductionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-white/10 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 w-full max-w-lg relative z-10"
            >
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4 text-white">
                <ChefHat className="text-gold" size={32} /> Production Entry
              </h3>
              
              <form onSubmit={handleProductionSubmit} className="space-y-8">
                <div>
                  <CustomDropdown 
                    label="Select Item to Produce"
                    options={[
                      ...inventory.map(item => ({ label: item.dishId?.name || 'Unnamed Dish', value: `${item.dishId?._id}|Dish` })),
                      ...semiFinishedGoods.map(sfg => ({ label: sfg.name, value: `${sfg._id}|SemiFinishedGood` }))
                    ]}
                    value={productionForm.dishId}
                    onChange={(val) => setProductionForm({...productionForm, dishId: val})}
                    placeholder="Choose dish or semi-finished good..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 block">Batches Produced</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={productionForm.batches}
                    onChange={(e) => setProductionForm({...productionForm, batches: e.target.value})}
                    placeholder="e.g. 1"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold"
                  />
                </div>

                {productionForm.dishId && productionForm.batches && (() => {
                  const [itemId, itemModel] = productionForm.dishId.split('|');
                  let yieldText = '';
                  if (itemModel === 'Dish') {
                    const invItem = inventory.find(i => i.dishId?._id === itemId);
                    const dishName = invItem?.dishId?.name || '';
                    if (dishName.includes('Biryani')) {
                      yieldText = `${Number(productionForm.batches) * 9} Portions (1 Batch = 9 Portions)`;
                    } else if (dishName.includes('Mandi')) {
                      yieldText = `${Number(productionForm.batches) * 6} Portions (1 Batch = 6 Portions)`;
                    } else {
                      yieldText = `${Number(productionForm.batches)} Portion(s)`;
                    }
                  } else if (itemModel === 'SemiFinishedGood') {
                    const sfg = semiFinishedGoods.find(s => s._id === itemId);
                    if (sfg) {
                      yieldText = `${Number(productionForm.batches) * sfg.batchYield} ${sfg.yieldUnit} (1 Batch = ${sfg.batchYield} ${sfg.yieldUnit})`;
                    }
                  }

                  return (
                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-xs text-white/60 space-y-2">
                      <p className="font-bold text-white uppercase tracking-wider">Production Output Estimation:</p>
                      <p>• Yields: <span className="text-gold font-black">{yieldText}</span></p>
                      <p className="italic text-[10px] text-white/40">Note: Ingredients will be automatically deducted from your raw materials stock.</p>
                    </div>
                  );
                })()}
                
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 py-5 rounded-2xl bg-gold text-black font-black uppercase text-[11px] tracking-widest shadow-xl">
                    Log Production
                  </button>
                  <button type="button" onClick={() => setShowProductionModal(false)} className="flex-1 py-5 rounded-2xl bg-white/5 text-white font-black uppercase text-[11px] tracking-widest">
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
