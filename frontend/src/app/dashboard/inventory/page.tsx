'use client';

import React, { useState, useEffect } from 'react';
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
  ShoppingCart
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
}

interface Dish {
  _id: string;
  name: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    dishId: '',
    platesPerPacket: 10,
    totalPackets: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

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
        setInventory(invData);
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
    window.open(`https://wa.me/917307255940?text=${encoded}`, '_blank');
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

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card glass-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter uppercase">Inventory <span className="text-gold">&</span> Stock</h2>
          <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] mt-2">Manage your kitchen supplies and track portions.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="relative z-10 bg-gold text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.05] transition-all flex items-center gap-3 shadow-xl"
        >
          <Plus size={18} /> Update Stock
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-white/20 gap-6">
          <Loader2 className="animate-spin" size={64} />
          <p className="font-black uppercase tracking-[0.3em] text-sm">Syncing Inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inventory.map((item) => {
            const packets = Math.floor(item.totalPlates / item.platesPerPacket);
            const isLow = packets <= item.lowStockThreshold;

            return (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-card glass-card p-8 rounded-[2rem] border transition-all relative overflow-hidden flex flex-col justify-between h-[340px] ${
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

                <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Packets</p>
                    <p className={`text-3xl font-black ${isLow ? 'text-red-500' : 'text-gold'}`}>{packets}</p>
                  </div>
                  <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Plates</p>
                    <p className="text-3xl font-black text-white">{item.totalPlates}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3 relative z-10">
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
                    <span className="text-[9px] text-white/20 uppercase font-black">{item.platesPerPacket} plates/pkt</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MODAL (unchanged but included for completeness) */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-white/10 rounded-[3rem] p-10 w-full max-w-lg relative z-10"
            >
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
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
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
