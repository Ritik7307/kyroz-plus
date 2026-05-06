'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  TrendingDown, 
  AlertTriangle, 
  Calendar,
  ChevronRight,
  BarChart3,
  ArrowUpRight,
  RefreshCw,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WastageLog {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  reason: 'Expired' | 'Spilled' | 'Burnt' | 'Quality' | 'Other';
  cost: number;
  date: string;
}

export default function WastageMaster() {
  const [logs, setLogs] = useState<WastageLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    quantity: 0,
    unit: 'kg',
    reason: 'Expired' as const,
    costPerUnit: 0
  });

  const totalLoss = logs.reduce((sum, log) => sum + log.cost, 0);
  const topReason = logs.length > 0 
    ? Object.entries(logs.reduce((acc: any, log) => {
        acc[log.reason] = (acc[log.reason] || 0) + log.cost;
        return acc;
      }, {})).sort((a: any, b: any) => b[1] - a[1])[0][0]
    : 'None';

  const addLog = (e: React.FormEvent) => {
    e.preventDefault();
    const log: WastageLog = {
      id: Math.random().toString(36).substr(2, 9),
      item: formData.item,
      quantity: formData.quantity,
      unit: formData.unit,
      reason: formData.reason,
      cost: formData.quantity * formData.costPerUnit,
      date: new Date().toLocaleDateString()
    };
    setLogs([log, ...logs]);
    setShowAddModal(false);
    setFormData({ item: '', quantity: 0, unit: 'kg', reason: 'Expired', costPerUnit: 0 });
  };

  const removeLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-card/30 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-[0.4em]">
            <span className="w-10 h-[2px] bg-red-500"></span>
            Operational Efficiency
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none text-white">
            WASTAGE <span className="text-red-500">MASTER</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl font-medium leading-relaxed italic">
            "Every gram wasted is a rupee lost. Control the leakage."
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="relative z-10 bg-red-500 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.05] transition-all flex items-center gap-3 shadow-[0_20px_50px_rgba(239,68,68,0.2)]"
        >
          <Plus size={20} /> Log Wastage Entry
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Total Financial Loss</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-black text-red-500">₹{totalLoss.toFixed(2)}</h2>
            <TrendingDown size={20} className="text-red-500/40" />
          </div>
        </div>
        
        <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Primary Leakage Reason</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-black text-white uppercase">{topReason}</h2>
            <AlertTriangle size={20} className="text-yellow-500/40" />
          </div>
        </div>

        <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Logs Recorded</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-black text-white">{logs.length}</h2>
            <BarChart3 size={20} className="text-blue-500/40" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-card glass-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
            <LayoutGrid size={18} className="text-red-500" /> Recent Waste Logs
          </h3>
          <button onClick={() => setLogs([])} className="text-[9px] font-black uppercase text-white/20 hover:text-red-500 transition-colors">Clear All History</button>
        </div>
        
        <div className="divide-y divide-white/5">
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="p-8 flex items-center justify-between hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase border ${
                    log.reason === 'Expired' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                    log.reason === 'Burnt' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                    'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    {log.reason.substring(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase tracking-tight text-lg">{log.item}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1">
                        <Calendar size={10} /> {log.date}
                      </span>
                      <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">
                        {log.quantity} {log.unit} Wasted
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Loss Value</p>
                    <p className="text-2xl font-black text-white">₹{log.cost.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeLog(log.id)} className="text-white/5 group-hover:text-red-500/40 hover:text-red-500 transition-all p-2">
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="py-32 flex flex-col items-center gap-4 text-white/10">
              <Trash2 size={64} />
              <p className="font-black uppercase tracking-[0.4em] text-xs">No wastage logged today</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-white/10 rounded-[3.5rem] p-12 w-full max-w-2xl relative shadow-3xl"
            >
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                <AlertTriangle className="text-red-500" size={32} /> Report Wastage
              </h3>
              
              <form onSubmit={addLog} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Item Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.item}
                      onChange={(e) => setFormData({...formData, item: e.target.value})}
                      placeholder="e.g. Tomato Gravy"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Reason</label>
                    <select 
                      value={formData.reason}
                      onChange={(e: any) => setFormData({...formData, reason: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-red-500 transition-all"
                    >
                      <option value="Expired">Expired Stock</option>
                      <option value="Spilled">Spilled / Dropped</option>
                      <option value="Burnt">Burnt / Cooking Error</option>
                      <option value="Quality">Quality Rejection</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Quantity</label>
                    <input 
                      type="number" 
                      required
                      value={formData.quantity === 0 ? '' : formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Unit</label>
                    <select 
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold"
                    >
                      <option value="kg">KG</option>
                      <option value="ltr">LTR</option>
                      <option value="pkt">PKT</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 block">Cost/Unit</label>
                    <input 
                      type="number" 
                      required
                      value={formData.costPerUnit === 0 ? '' : formData.costPerUnit}
                      onChange={(e) => setFormData({...formData, costPerUnit: Number(e.target.value)})}
                      placeholder="₹ 0"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-gold font-bold"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 py-6 rounded-2xl bg-red-500 text-white font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] transition-all">
                    Confirm Log Entry
                  </button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-10 py-6 rounded-2xl bg-white/5 text-white/40 font-black uppercase text-[11px] tracking-widest">
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
