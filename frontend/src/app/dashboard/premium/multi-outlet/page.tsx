'use client';

import React, { useEffect, useState } from 'react';
import { Network, TrendingUp, DollarSign, ShoppingBag, Store, Plus, ArrowRight, Utensils, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function MultiOutletDashboard() {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'manage'>('overview');
  
  // Add Outlet Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOutlet, setNewOutlet] = useState({ shopName: '', shopAddress: '', email: '', phone: '', password: '' });
  const [addingOutlet, setAddingOutlet] = useState(false);

  // Outlet Detail View State
  const [selectedOutlet, setSelectedOutlet] = useState<any | null>(null);
  const [outletMenu, setOutletMenu] = useState<any[]>([]);
  const [syncingMenu, setSyncingMenu] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOutlets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/bi/multi-outlet-summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOutlets(data.outlets || []);
      }
    } catch (error) {
      console.error('Failed to load multi-outlet data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  const handleCreateOutlet = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingOutlet(true);
    setError('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/multi-outlet/create`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOutlet)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Outlet created successfully!');
        setNewOutlet({ shopName: '', shopAddress: '', email: '', phone: '', password: '' });
        setIsAddModalOpen(false);
        fetchOutlets();
      } else {
        setError(data.error || 'Failed to create outlet');
      }
    } catch (error) {
      setError('An error occurred while creating the outlet.');
    } finally {
      setAddingOutlet(false);
    }
  };

  const loadOutletDetails = async (outletId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/multi-outlet/${outletId}/menu`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOutletMenu(data.dishes || []);
      }
    } catch (error) {
      console.error('Failed to load outlet details', error);
    }
  };

  const handleSyncMenu = async () => {
    if (!selectedOutlet) return;
    setSyncingMenu(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/multi-outlet/${selectedOutlet._id}/menu/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Menu synced successfully!');
        loadOutletDetails(selectedOutlet._id);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to sync menu');
      }
    } catch (error) {
      console.error('Failed to sync menu', error);
      alert('An error occurred while syncing.');
    } finally {
      setSyncingMenu(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gold font-bold">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Aggregate current logged in user (parent) to exclude from 'Manage' list if desired, 
  // but for now, we just list all returned by summary.
  const totalRevenue = outlets.reduce((sum, o) => sum + o.revenue, 0);
  const totalOrders = outlets.reduce((sum, o) => sum + o.orders, 0);

  // If viewing a specific outlet's details
  if (selectedOutlet) {
    return (
      <div className="space-y-6 p-6 animate-in fade-in slide-in-from-right-8 duration-500">
        <button 
          onClick={() => setSelectedOutlet(null)}
          className="text-foreground/50 hover:text-gold flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors"
        >
          ← Back to Network
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Store className="text-gold" size={28} />
              {selectedOutlet.shopName}
            </h1>
            <p className="text-foreground/60 mt-1">{selectedOutlet.shopAddress || 'No address provided'}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-card px-6 py-3 border border-border rounded-xl">
              <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-widest">Revenue (30d)</p>
              <p className="text-2xl font-black text-green-400">₹{selectedOutlet.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Utensils size={20} className="text-gold" /> Branch Menu
              </h2>
              <p className="text-sm text-foreground/50">Dishes available at this specific location.</p>
            </div>
            <button 
              onClick={handleSyncMenu}
              disabled={syncingMenu}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-bold text-sm rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={16} className={syncingMenu ? 'animate-spin' : ''} />
              {syncingMenu ? 'Syncing...' : 'Sync Menu from HQ'}
            </button>
          </div>
          
          {outletMenu.length === 0 ? (
            <div className="text-center py-12 text-foreground/50 bg-background/50 rounded-xl border border-dashed border-border">
              <Utensils size={48} className="mx-auto mb-4 text-border" />
              <p>This branch has no menu items yet.</p>
              <p className="text-sm mt-2">Click "Sync Menu from HQ" to push your main menu to this branch.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outletMenu.map((dish, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-background border border-border rounded-xl">
                  <div>
                    <p className="font-bold text-sm">{dish.name}</p>
                    <p className="text-xs text-foreground/50">{dish.category}</p>
                  </div>
                  <p className="font-black text-gold">₹{dish.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Multi-Outlet <span className="text-gold">HQ</span></h1>
          <p className="text-foreground/60">Manage your entire restaurant franchise from a single dashboard.</p>
        </div>
        <div className="flex bg-card p-1 border border-border rounded-xl">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-gold text-black shadow-lg' : 'text-foreground/60 hover:text-foreground'}`}
          >
            Network Overview
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'manage' ? 'bg-gold text-black shadow-lg' : 'text-foreground/60 hover:text-foreground'}`}
          >
            Manage Branches
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-gold/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-foreground/60 uppercase tracking-wider font-bold mb-1">Total Network Revenue</p>
                  <h3 className="text-3xl font-black">₹{totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-gold/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-foreground/60 uppercase tracking-wider font-bold mb-1">Total Network Orders</p>
                  <h3 className="text-3xl font-black">{totalOrders.toLocaleString()}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-gold/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-foreground/60 uppercase tracking-wider font-bold mb-1">Active Locations</p>
                  <h3 className="text-3xl font-black">{outlets.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Store size={20} />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4">Performance by Outlet</h2>
          <div className="grid grid-cols-1 gap-4">
            {outlets.map((outlet, idx) => (
              <div key={idx} className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-border/20 transition-colors">
                <div className="flex-1">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Store size={18} className="text-gold" />
                    {outlet.shopName}
                  </h3>
                  <p className="text-sm text-foreground/60">{outlet.shopAddress || 'No address provided'}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 flex-1">
                  <div>
                    <p className="text-[10px] text-foreground/50 uppercase font-bold mb-1 tracking-widest">Revenue</p>
                    <p className="font-black text-lg">₹{outlet.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground/50 uppercase font-bold mb-1 tracking-widest">Orders</p>
                    <p className="font-black text-lg">{outlet.orders.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground/50 uppercase font-bold mb-1 tracking-widest">Food Cost</p>
                    <p className="font-black text-lg text-orange-400">{outlet.foodCostPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground/50 uppercase font-bold mb-1 tracking-widest">Margin</p>
                    <p className="font-black text-lg text-green-400">{outlet.grossMargin}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Branches</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-bold rounded-lg hover:scale-105 transition-transform"
            >
              <Plus size={18} /> Add New Branch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outlets.map((outlet, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-lg group">
                <div className="p-6 flex-1">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                    <Store size={24} />
                  </div>
                  <h3 className="text-xl font-black mb-1">{outlet.shopName}</h3>
                  <p className="text-sm text-foreground/60 mb-6">{outlet.shopAddress || 'No address provided'}</p>
                </div>
                <div className="p-4 border-t border-border bg-background/50 flex justify-between items-center">
                  <div className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
                    {outlet.orders} Orders
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedOutlet(outlet);
                      loadOutletDetails(outlet._id);
                    }}
                    className="flex items-center gap-2 text-gold text-sm font-bold hover:gap-3 transition-all"
                  >
                    Manage <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Outlet Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-2xl font-black mb-2">Add New Branch</h2>
            <p className="text-foreground/60 text-sm mb-6">Create a login for your branch manager. They will use this to manage daily operations.</p>
            
            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-xl font-medium">{error}</div>}
            
            <form onSubmit={handleCreateOutlet} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-foreground/60 tracking-widest">Branch Name</label>
                  <input required type="text" value={newOutlet.shopName} onChange={e => setNewOutlet({...newOutlet, shopName: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-gold outline-none" placeholder="e.g. CP Branch" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-foreground/60 tracking-widest">Phone</label>
                  <input type="text" value={newOutlet.phone} onChange={e => setNewOutlet({...newOutlet, phone: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-gold outline-none" placeholder="Manager Phone" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-foreground/60 tracking-widest">Branch Address</label>
                <input required type="text" value={newOutlet.shopAddress} onChange={e => setNewOutlet({...newOutlet, shopAddress: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-gold outline-none" placeholder="Full Address" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-foreground/60 tracking-widest">Manager Login Email</label>
                <input required type="email" value={newOutlet.email} onChange={e => setNewOutlet({...newOutlet, email: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-gold outline-none" placeholder="branch@yourrestaurant.com" />
              </div>

              <div className="space-y-1 relative">
                <label className="text-xs font-bold uppercase text-foreground/60 tracking-widest">Password</label>
                <div className="relative">
                  <input required type={showPassword ? "text" : "password"} value={newOutlet.password} onChange={e => setNewOutlet({...newOutlet, password: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-gold outline-none pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 font-bold text-foreground/60 hover:text-foreground">Cancel</button>
                <button type="submit" disabled={addingOutlet} className="px-6 py-3 bg-gold text-black font-black uppercase text-sm rounded-xl hover:scale-105 transition-transform disabled:opacity-50">
                  {addingOutlet ? 'Creating...' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
