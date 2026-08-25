'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  TrendingDown, 
  AlertTriangle, 
  Calendar,
  BarChart3,
  RefreshCw,
  LayoutGrid,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

interface WastageLog {
  _id: string;
  itemModel: 'RawMaterial' | 'SemiFinishedGood' | 'Packaging';
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  reason: 'Expired' | 'Spilled' | 'Burnt' | 'Quality' | 'Other';
  costLost: number;
  createdAt: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  unit: string;
}

export default function WastageMaster() {
  const [logs, setLogs] = useState<WastageLog[]>([]);
  
  const [rawMaterials, setRawMaterials] = useState<InventoryItem[]>([]);
  const [semiFinishedGoods, setSemiFinishedGoods] = useState<InventoryItem[]>([]);
  const [packaging, setPackaging] = useState<InventoryItem[]>([]);
  
  const [loadingLogs, setLoadingLogs] = useState<boolean>(true);
  const [loadingInventory, setLoadingInventory] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formData, setFormData] = useState({
    itemModel: 'RawMaterial' as 'RawMaterial' | 'SemiFinishedGood' | 'Packaging',
    itemId: '',
    quantity: '' as number | '',
    reason: 'Expired' as 'Expired' | 'Spilled' | 'Burnt' | 'Quality' | 'Other'
  });

  const fetchLogs = async () => {
    setLoadingLogs(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/wastage`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch wastage history');
      const data = await res.json();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load wastage history');
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/inventory`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch inventory');
      const data = await res.json();
      
      // Map RawMaterial to standard format (name + consumptionUnit)
      const mappedRM = (data.rawMaterials || []).map((rm: any) => ({
        _id: rm._id,
        name: rm.name,
        unit: rm.consumptionUnit
      }));

      // Map SFG (name + yieldUnit)
      const mappedSFG = (data.semiFinishedGoods || []).map((sfg: any) => ({
        _id: sfg._id,
        name: sfg.name,
        unit: sfg.yieldUnit
      }));

      // Map Packaging (name + unit)
      const mappedPKG = (data.packaging || []).map((pkg: any) => ({
        _id: pkg._id,
        name: pkg.name,
        unit: pkg.unit
      }));

      setRawMaterials(mappedRM);
      setSemiFinishedGoods(mappedSFG);
      setPackaging(mappedPKG);
    } catch (err: any) {
      console.error('Failed to load inventory categories', err);
    } finally {
      setLoadingInventory(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchInventory();
  }, []);

  const getFilteredItems = () => {
    if (formData.itemModel === 'RawMaterial') return rawMaterials;
    if (formData.itemModel === 'SemiFinishedGood') return semiFinishedGoods;
    return packaging;
  };

  const getSelectedUnit = () => {
    const items = getFilteredItems();
    const item = items.find(i => i._id === formData.itemId);
    return item ? item.unit : '';
  };

  // Automatically select first item when model changes
  useEffect(() => {
    const items = getFilteredItems();
    if (items.length > 0) {
      setFormData(prev => ({ ...prev, itemId: items[0]._id }));
    } else {
      setFormData(prev => ({ ...prev, itemId: '' }));
    }
  }, [formData.itemModel, rawMaterials, semiFinishedGoods, packaging]);

  const addLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId || !formData.quantity || Number(formData.quantity) <= 0) return;
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/wastage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemModel: formData.itemModel,
          itemId: formData.itemId,
          quantity: Number(formData.quantity),
          reason: formData.reason
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit wastage log');
      }

      setSuccess('Wastage logged and stock updated successfully!');
      setShowAddModal(false);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        quantity: ''
      }));

      // Refresh data
      await fetchLogs();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to log wastage entry');
    } finally {
      setSubmitting(false);
    }
  };

  // Financial Statistics
  const totalLoss = logs.reduce((sum, log) => sum + log.costLost, 0);
  
  const getTopReason = () => {
    if (logs.length === 0) return 'None';
    const reasonsMap = logs.reduce((acc: Record<string, number>, log) => {
      acc[log.reason] = (acc[log.reason] || 0) + log.costLost;
      return acc;
    }, {});
    const sorted = Object.entries(reasonsMap).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'None';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 text-foreground">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-card/35 p-10 rounded-[3rem] border border-border relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-[0.4em]">
            <span className="w-10 h-[2px] bg-red-500"></span>
            Operational Efficiency
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none text-foreground">
            WASTAGE <span className="text-red-500">MASTER</span>
          </h1>
          <p className="text-foreground/40 text-lg max-w-xl font-medium leading-relaxed italic">
            "Every gram wasted is a rupee lost. Control the leakage."
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="relative z-10 bg-red-500 text-foreground px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-3 shadow-[0_20px_50px_rgba(239,68,68,0.2)]"
        >
          <Plus size={20} /> Log Wastage Entry
        </button>
      </header>

      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold"
          >
            <AlertTriangle size={18} />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-green-950/40 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-400 text-sm font-bold"
          >
            <CheckCircle size={18} />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card glass-card p-8 rounded-[2rem] border border-border shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          <p className="text-xs font-black text-foreground/30 uppercase tracking-widest mb-4">Total Financial Loss</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-black text-red-500">₹{totalLoss.toFixed(2)}</h2>
            <TrendingDown size={20} className="text-red-500/40" />
          </div>
        </div>
        
        <div className="bg-card glass-card p-8 rounded-[2rem] border border-border shadow-xl relative overflow-hidden">
          <p className="text-xs font-black text-foreground/30 uppercase tracking-widest mb-4">Primary Leakage Reason</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-black text-foreground uppercase">{getTopReason()}</h2>
            <AlertTriangle size={20} className="text-yellow-500/40" />
          </div>
        </div>

        <div className="bg-card glass-card p-8 rounded-[2rem] border border-border shadow-xl relative overflow-hidden">
          <p className="text-xs font-black text-foreground/30 uppercase tracking-widest mb-4">Logs Recorded</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-black text-foreground">{logs.length}</h2>
            <BarChart3 size={20} className="text-blue-500/40" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-card glass-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl">
        <div className="px-10 py-8 border-b border-border flex items-center justify-between bg-card shadow-sm">
          <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
            <LayoutGrid size={18} className="text-red-500" /> Recent Waste Logs
          </h3>
          <button onClick={fetchLogs} className="h-8 w-8 rounded-lg hover:bg-card shadow-sm flex items-center justify-center text-foreground/40 hover:text-foreground transition-all">
            <RefreshCw size={16} />
          </button>
        </div>
        
        <div className="divide-y divide-white/5">
          {loadingLogs ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-red-500" size={32} />
              <p className="text-foreground/30 font-bold uppercase tracking-widest text-xs">Loading history...</p>
            </div>
          ) : logs.length > 0 ? (
            <AnimatePresence>
              {logs.map((log) => (
                <div 
                  key={log._id}
                  className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-card shadow-sm transition-all group gap-6"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-xs uppercase border ${
                      log.reason === 'Expired' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                      log.reason === 'Burnt' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                      log.reason === 'Spilled' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                      log.reason.startsWith('Inventory') ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                      'bg-card shadow-sm border-border text-foreground/40'
                    }`}>
                      <span>{log.reason.startsWith('Inventory') ? 'VAR' : log.reason.substring(0, 3)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-foreground uppercase tracking-tight text-lg">{log.itemName}</h4>
                        <span className="text-[10px] font-black uppercase text-foreground/20">({log.itemModel})</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-foreground/40">
                        <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={10} /> {new Date(log.createdAt).toLocaleDateString()} at {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground/10"></span>
                        <span className="text-xs font-black text-red-500/60 uppercase tracking-widest">
                          {log.quantity} {log.unit} Wasted
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-12 border-t md:border-t-0 pt-4 md:pt-0 border-border">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-1">Loss Value</p>
                      <p className="text-2xl font-black text-foreground">₹{log.costLost.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-32 flex flex-col items-center gap-4 text-foreground/10">
              <Trash2 size={64} />
              <p className="font-black uppercase tracking-[0.4em] text-xs">No wastage logged today</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Wastage Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-[3.5rem] p-12 w-full max-w-2xl relative shadow-3xl text-foreground"
            >
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                <AlertTriangle className="text-red-500" size={32} /> Report Wastage
              </h3>
              
              <form onSubmit={addLog} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 block">Item Category</label>
                    <select 
                      value={formData.itemModel}
                      onChange={(e: any) => setFormData({ ...formData, itemModel: e.target.value })}
                      className="w-full bg-card shadow-sm border border-border rounded-2xl p-5 text-foreground font-bold outline-none focus:border-red-500 transition-all cursor-pointer"
                    >
                      <option value="RawMaterial" className="bg-[#111]">Raw Material</option>
                      <option value="SemiFinishedGood" className="bg-[#111]">Semi-Finished Good</option>
                      <option value="Packaging" className="bg-[#111]">Packaging Item</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 block">Item Name</label>
                    {loadingInventory ? (
                      <div className="w-full h-[62px] bg-card shadow-sm border border-border rounded-2xl flex items-center justify-center">
                        <Loader2 className="animate-spin text-red-500" size={18} />
                      </div>
                    ) : (
                      <select 
                        value={formData.itemId}
                        required
                        onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                        className="w-full bg-card shadow-sm border border-border rounded-2xl p-5 text-foreground font-bold outline-none focus:border-red-500 transition-all cursor-pointer"
                      >
                        {getFilteredItems().map(item => (
                          <option key={item._id} value={item._id} className="bg-[#111]">{item.name}</option>
                        ))}
                        {getFilteredItems().length === 0 && (
                          <option value="" className="bg-[#111]" disabled>No items available</option>
                        )}
                      </select>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 block">
                      Wasted Quantity {getSelectedUnit() ? `(in ${getSelectedUnit()})` : ''}
                    </label>
                    <input 
                      type="number" 
                      required
                      min="0.01"
                      step="any"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value === '' ? '' : Number(e.target.value) })}
                      placeholder="0.00"
                      className="w-full bg-card shadow-sm border border-border rounded-2xl p-5 text-foreground font-bold outline-none focus:border-red-500 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 block">Reason</label>
                    <select 
                      value={formData.reason}
                      onChange={(e: any) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full bg-card shadow-sm border border-border rounded-2xl p-5 text-foreground font-bold outline-none focus:border-red-500 transition-all cursor-pointer"
                    >
                      <option value="Expired" className="bg-[#111]">Expired Stock</option>
                      <option value="Spilled" className="bg-[#111]">Spilled / Dropped</option>
                      <option value="Burnt" className="bg-[#111]">Burnt / Cooking Error</option>
                      <option value="Quality" className="bg-[#111]">Quality Rejection</option>
                      <option value="Other" className="bg-[#111]">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit" 
                    disabled={submitting || !formData.itemId || !formData.quantity}
                    className="flex-1 py-6 rounded-2xl bg-red-500 text-foreground font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Logging wastage...
                      </>
                    ) : (
                      'Confirm Log Entry'
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)} 
                    className="px-10 py-6 rounded-2xl bg-card shadow-sm text-foreground/40 font-black uppercase text-[11px] tracking-widest hover:bg-foreground/10 transition-colors"
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
