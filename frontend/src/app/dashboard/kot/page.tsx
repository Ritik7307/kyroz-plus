'use client';

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  ChefHat, 
  Clock, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  History, 
  Play, 
  Check, 
  XCircle,
  Square,
  CheckSquare,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

interface KotItem {
  dishId: {
    _id: string;
    name: string;
    category: string;
  } | null;
  quantity: number;
  note?: string;
  _id: string;
}

interface Kot {
  _id: string;
  kotNumber: number;
  tableNumber: string;
  orderType: 'DineIn' | 'Takeaway' | 'Delivery';
  customerName?: string;
  customerPhone?: string;
  items: KotItem[];
  status: 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Cancelled';
  packaging: { name: string; quantity: number; _id: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function KitchenOrderQueue() {
  const [kots, setKots] = useState<Kot[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewHistory, setViewHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'DineIn' | 'Takeaway' | 'Delivery'>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Package checkmarks state per KOT
  const [checkedPackages, setCheckedPackages] = useState<Record<string, boolean>>({});
  const [printingKot, setPrintingKot] = useState<Kot | null>(null);

  const handlePrintKot = (kot: Kot) => {
    setPrintingKot(kot);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  useEffect(() => {
    fetchKots();

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update relative time counters every second

    // Setup WebSocket listener
    const socket = require('socket.io-client')(API_URL);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.userId) {
          socket.emit('joinRestaurant', user.userId);
        }
      } catch (e) {}
    }

    socket.on('KOT_CREATED', (newKot: Kot) => {
      if (!viewHistory) {
        setKots(prev => {
          if (!prev.find(k => k._id === newKot._id)) {
            return [...prev, newKot];
          }
          return prev;
        });
      }
    });

    socket.on('KOT_UPDATED', (updatedKot: Kot) => {
      setKots(prev => prev.map(k => k._id === updatedKot._id ? updatedKot : k));
    });

    return () => {
      clearInterval(clockInterval);
      socket.disconnect();
    };
  }, [viewHistory]);

  const fetchKots = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const endpoint = viewHistory ? `${API_URL}/api/kots/history` : `${API_URL}/api/kots`;
      const res = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setKots(data);
      }
    } catch (err) {
      console.error('Failed to fetch KOTs', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const updateStatus = async (kotId: string, newStatus: 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Cancelled') => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/kots/${kotId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Optimistically update status
        setKots(prev => prev.map(k => k._id === kotId ? { ...k, status: newStatus } : k));
        // Refresh to fetch any backend mutations
        fetchKots(false);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  // Helper: calculate time elapsed in minutes
  const getElapsedMinutes = (createdAtString: string) => {
    const created = new Date(createdAtString);
    const diff = currentTime.getTime() - created.getTime();
    return Math.max(0, Math.floor(diff / 60000));
  };

  const togglePackageCheck = (kotId: string, pkgName: string) => {
    const key = `${kotId}-${pkgName}`;
    setCheckedPackages(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      case 'Preparing': return 'border-orange-500/30 bg-orange-500/10 text-orange-400';
      case 'Ready': return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'Served': return 'border-white/10 bg-white/5 text-white/40';
      case 'Cancelled': return 'border-red-500/30 bg-red-500/10 text-red-400';
      default: return 'border-white/10 bg-white/5 text-white';
    }
  };

  const getOrderTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'DineIn': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Takeaway': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Delivery': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      default: return 'bg-white/5 text-white/50 border border-white/10';
    }
  };

  // Filter logic
  const filteredKots = kots.filter(kot => {
    const matchTab = activeTab === 'all' || kot.orderType === activeTab;
    return matchTab;
  });

  // Calculate Metrics
  const activeCount = kots.filter(k => ['Pending', 'Preparing', 'Ready'].includes(k.status)).length;
  const pendingCount = kots.filter(k => k.status === 'Pending').length;
  const preparingCount = kots.filter(k => k.status === 'Preparing').length;
  const readyCount = kots.filter(k => k.status === 'Ready').length;

  return (
    <div className="space-y-8 min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          .kot-print-area, .kot-print-area * {
            visibility: visible !important;
          }
          .kot-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: block !important;
            background: white !important;
            color: black !important;
          }
        }
      `}} />

      {/* HIDDEN PRINT CONTAINER */}
      {printingKot && (
        <div className="kot-print-area hidden print:block bg-white text-black p-6 font-mono text-xs max-w-[80mm] mx-auto">
          <div className="text-center border-b-2 border-black pb-2 mb-3">
            <h1 className="text-xl font-black uppercase tracking-tight">KITCHEN ORDER TICKET</h1>
            <p className="text-sm font-bold uppercase tracking-widest text-black mt-1">KOT #{printingKot.kotNumber}</p>
            <p className="text-xs mt-0.5">{new Date(printingKot.createdAt).toLocaleString()}</p>
          </div>

          <div className="border-b border-black pb-2 mb-3 space-y-1">
            <div className="flex justify-between text-xs font-black">
              <span>SOURCE:</span>
              <span>{printingKot.tableNumber}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>ORDER TYPE:</span>
              <span className="font-bold uppercase">{printingKot.orderType}</span>
            </div>
            {(printingKot.customerName || printingKot.customerPhone) && (
              <div className="pt-1 border-t border-black/10 mt-1">
                {printingKot.customerName && <div className="flex justify-between text-xs"><span>CUSTOMER:</span><span className="font-bold uppercase">{printingKot.customerName}</span></div>}
                {printingKot.customerPhone && <div className="flex justify-between text-xs"><span>PHONE:</span><span className="font-bold uppercase">{printingKot.customerPhone}</span></div>}
              </div>
            )}
          </div>

          <table className="w-full text-xs mb-4">
            <thead>
              <tr className="border-b border-black text-left font-black">
                <th className="pb-1">Item Name</th>
                <th className="pb-1 text-right">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
               {printingKot.items.map((item, idx) => (
                 <tr key={idx}>
                   <td className="py-2 pr-2 leading-tight">
                     <span className="font-bold">{item.dishId?.name || 'Unknown Dish'}</span>
                     {item.note && (
                       <div className="text-xs italic mt-0.5 font-bold">
                         * Note: {item.note}
                       </div>
                     )}
                   </td>
                   <td className="py-2 text-right font-black text-sm">x{item.quantity}</td>
                 </tr>
               ))}
            </tbody>
          </table>

          {printingKot.packaging && printingKot.packaging.length > 0 && (
            <div className="border-t border-black pt-2 mt-2">
              <p className="text-xs font-black uppercase tracking-widest mb-1.5">Packaging Items Needed:</p>
              <div className="space-y-1 text-xs font-bold">
                {printingKot.packaging.map((pkg, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>[ ] {pkg.name}</span>
                    <span>x{pkg.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-dashed border-black pt-3 mt-6 text-center text-[10px] opacity-60">
            <p className="uppercase tracking-[0.2em]">SOP & Prep Checklist Printed</p>
            <p className="uppercase tracking-[0.3em] font-black mt-0.5 text-[8px]">Powered by KYROZ</p>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3 text-white">
            <ChefHat className="text-gold animate-bounce" size={32} /> KITCHEN ORDER DISPLAY (KDS)
          </h2>
          <p className="text-xs text-white/40 font-bold uppercase tracking-wider mt-1.5">
            Real-time preparation pipeline & packaging tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewHistory(!viewHistory)}
            className={`px-5 py-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest ${
              viewHistory 
                ? 'bg-gold text-black border-gold' 
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
            }`}
          >
            {viewHistory ? <ClipboardList size={16} /> : <History size={16} />}
            {viewHistory ? 'View Queue' : 'View History'}
          </button>
          <button
            onClick={() => fetchKots(true)}
            className="p-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-all border border-white/10"
            title="Refresh Queue"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      {!viewHistory && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40 font-black uppercase tracking-widest">Active Tickets</p>
              <h3 className="text-3xl font-black text-white mt-1">{activeCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
              <ClipboardList size={20} />
            </div>
          </div>
          <div className="bg-card glass-card p-5 rounded-2xl border border-blue-500/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-500/60 font-black uppercase tracking-widest">Pending</p>
              <h3 className="text-3xl font-black text-blue-400 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Clock size={20} />
            </div>
          </div>
          <div className="bg-card glass-card p-5 rounded-2xl border border-orange-500/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-500/60 font-black uppercase tracking-widest">Preparing</p>
              <h3 className="text-3xl font-black text-orange-400 mt-1">{preparingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <ChefHat size={20} />
            </div>
          </div>
          <div className="bg-card glass-card p-5 rounded-2xl border border-green-500/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-green-500/60 font-black uppercase tracking-widest">Ready</p>
              <h3 className="text-3xl font-black text-green-400 mt-1">{readyCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide border-b border-white/5">
        {(['all', 'DineIn', 'Takeaway', 'Delivery'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-gold text-black border-gold' 
                : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
            }`}
          >
            {tab === 'all' ? 'All Orders' : tab === 'DineIn' ? 'Dine In' : tab}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-white/20">
          <RefreshCw className="animate-spin text-gold" size={48} />
          <p className="font-black uppercase tracking-widest text-sm">Synchronizing Kitchen Queue...</p>
        </div>
      ) : filteredKots.length === 0 ? (
        <div className="bg-card glass-card border border-white/5 rounded-3xl p-16 text-center flex flex-col items-center justify-center text-white/25">
          <ChefHat size={64} className="mb-4 text-white/10" />
          <h4 className="font-black uppercase tracking-widest text-base">No tickets in the kitchen</h4>
          <p className="text-xs text-white/40 mt-2">All caught up! Orders sent from POS will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredKots.map(kot => {
              const elapsedMins = getElapsedMinutes(kot.createdAt);
              const isUrgent = elapsedMins >= 15 && ['Pending', 'Preparing'].includes(kot.status);

              return (
                <motion.div
                  key={kot._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`bg-card glass-card rounded-[2rem] border overflow-hidden flex flex-col justify-between shadow-xl transition-all ${
                    isUrgent ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-white/5 space-y-3 bg-white/[0.01]">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-xs font-black text-gold uppercase tracking-widest">KOT #{kot.kotNumber}</span>
                        <h4 className="text-lg font-black text-white">{kot.tableNumber}</h4>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusColor(kot.status)}`}>
                          {kot.status}
                        </span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${getOrderTypeBadgeColor(kot.orderType)}`}>
                          {kot.orderType === 'DineIn' ? 'Dine In' : kot.orderType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/40 font-bold uppercase tracking-wider pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {new Date(kot.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {['Pending', 'Preparing'].includes(kot.status) && (
                        <span className={`flex items-center gap-1 font-black ${isUrgent ? 'text-red-500 animate-pulse' : ''}`}>
                          {isUrgent && <AlertTriangle size={12} />}
                          {elapsedMins === 0 ? 'Just now' : `${elapsedMins}m elapsed`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body - Dish Items List */}
                  <div className="p-6 flex-1 space-y-4">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Items ({kot.items.length})</p>
                      <div className="divide-y divide-white/5">
                        {kot.items.map(item => (
                          <div key={item._id} className="py-2.5 flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="font-bold text-sm text-white">
                                {item.dishId?.name || 'Unknown Dish'}
                              </p>
                              {item.note && (
                                <p className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                                  📝 {item.note}
                                </p>
                              )}
                            </div>
                            <span className="text-sm font-black text-gold bg-gold/10 px-2 py-1 rounded-xl border border-gold/15">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Packaging Section */}
                    {kot.packaging && kot.packaging.length > 0 && (
                      <div className="pt-4 border-t border-white/5 space-y-2">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1">
                          <Package size={11} className="text-gold" /> Packaging Checklist
                        </p>
                        <div className="grid grid-cols-1 gap-2.5">
                          {kot.packaging.map(pkg => {
                            const isChecked = !!checkedPackages[`${kot._id}-${pkg.name}`];
                            return (
                              <button
                                key={pkg._id}
                                onClick={() => togglePackageCheck(kot._id, pkg.name)}
                                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                                  isChecked 
                                    ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isChecked ? (
                                    <CheckSquare size={14} className="text-green-400 shrink-0" />
                                  ) : (
                                    <Square size={14} className="text-white/40 shrink-0" />
                                  )}
                                  <span className={`text-[11px] font-bold ${isChecked ? 'line-through opacity-60' : ''}`}>
                                    {pkg.name}
                                  </span>
                                </div>
                                <span className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
                                  isChecked ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/80'
                                }`}>
                                  x{pkg.quantity}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="p-6 border-t border-white/5 bg-white/[0.01] flex gap-2 shrink-0">
                    {kot.status === 'Pending' && (
                      <button
                        onClick={() => updateStatus(kot._id, 'Preparing')}
                        className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2"
                      >
                        <Play size={14} /> Start Preparing
                      </button>
                    )}
                    {kot.status === 'Preparing' && (
                      <button
                        onClick={() => updateStatus(kot._id, 'Ready')}
                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2"
                      >
                        <Check size={14} /> Mark Ready
                      </button>
                    )}
                    {kot.status === 'Ready' && (
                      <button
                        onClick={() => updateStatus(kot._id, 'Served')}
                        className="flex-1 py-3 bg-gold hover:scale-[1.01] active:scale-95 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-gold/10 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={14} /> Mark Served
                      </button>
                    )}
                    {['Served', 'Cancelled'].includes(kot.status) && (
                      <div className="w-full text-center py-2 text-xs font-black uppercase text-white/20 tracking-wider">
                        Archived / Completed
                      </div>
                    )}
                    <button
                      onClick={() => handlePrintKot(kot)}
                      className="p-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-gold rounded-xl transition-all border border-white/10"
                      title="Print KOT"
                    >
                      <Printer size={14} />
                    </button>
                    {['Pending', 'Preparing'].includes(kot.status) && (
                      <button
                        onClick={() => {
                          if (confirm('Cancel this kitchen order ticket?')) {
                            updateStatus(kot._id, 'Cancelled');
                          }
                        }}
                        className="p-3 border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                        title="Cancel Ticket"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
