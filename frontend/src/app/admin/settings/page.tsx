'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  Lock, 
  Cpu,
  Save,
  RefreshCw,
  Server,
  Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';

import { API_URL } from '@/lib/api';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('Pricing');
  const [loading, setLoading] = useState(false);
  
  const [pricing, setPricing] = useState({
    basic: { price: 999, discount: 0 },
    pro: { price: 2999, discount: 0 },
    elite: { price: 4999, discount: 0 }
  });

  React.useEffect(() => {
    fetch(`${API_URL}/api/admin/settings/pricing`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) return null; // Setting not saved yet
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (data && data.basic) {
          setPricing(data);
        }
      })
      .catch(err => console.error('Failed to load pricing:', err));
  }, []);

  const handleSavePricing = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/settings/pricing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value: pricing })
      });
      if (res.ok) {
        alert('Pricing updated successfully!');
      } else {
        const errText = await res.text();
        alert(`Failed to update pricing. Status: ${res.status}. Error: ${errText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating pricing');
    } finally {
      setLoading(false);
    }
  };

  const settingsTabs = [
    { name: 'Pricing', icon: Database },
    { name: 'General', icon: Settings },
    { name: 'Security', icon: Shield },
    { name: 'Infrastructure', icon: Server },
    { name: 'AI Engine', icon: Cpu },
    { name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-10 pb-20">
      <header>
        <div className="flex items-center gap-3 text-gold text-xs font-black uppercase tracking-[0.3em] mb-3">
          <span className="w-8 h-[1px] bg-gold"></span>
          System Config
        </div>
        <h1 className="text-4xl font-black tracking-tighter">GLOBAL <span className="text-gold">SETTINGS</span></h1>
        <p className="text-white/40 text-sm mt-2 font-medium">Fine-tune the KYROZ neural network and platform-wide configurations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SIDEBAR TABS */}
        <div className="lg:col-span-3 space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === tab.name 
                ? 'bg-gold/10 text-gold font-bold border border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.05)]' 
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-9">
          <div className="bg-card glass-card rounded-[2.5rem] border border-white/5 p-12 shadow-2xl relative overflow-hidden min-h-[600px]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
            
            <div className="relative z-10 space-y-12">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{activeTab.toUpperCase()} CONTROLS</h3>
                  <p className="text-white/40 text-xs mt-1 font-bold uppercase tracking-widest">Update global parameters for {activeTab.toLowerCase()}</p>
                </div>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gold transition-all border border-white/10 group">
                  <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                </button>
              </div>

              {activeTab === 'Pricing' && (
                <div className="space-y-8">
                  {['basic', 'pro', 'elite'].map((planKey) => {
                    const plan = pricing[planKey as keyof typeof pricing];
                    return (
                      <div key={planKey} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-lg font-black text-white uppercase tracking-widest mb-4">{planKey} Plan</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Base Price (₹)</label>
                            <input 
                              type="number"
                              value={plan.price === 0 && !String(plan.price).includes('0') ? '' : plan.price}
                              onChange={(e) => setPricing(prev => ({
                                ...prev,
                                [planKey]: { ...prev[planKey as keyof typeof pricing], price: e.target.value === '' ? '' as any : Number(e.target.value) }
                              }))}
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-bold text-white focus:outline-none focus:border-gold transition-all"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Discount (%)</label>
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={plan.discount === 0 && !String(plan.discount).includes('0') ? '' : plan.discount}
                              onChange={(e) => setPricing(prev => ({
                                ...prev,
                                [planKey]: { ...prev[planKey as keyof typeof pricing], discount: e.target.value === '' ? '' as any : Number(e.target.value) }
                              }))}
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-bold text-white focus:outline-none focus:border-gold transition-all"
                            />
                          </div>
                        </div>
                        {plan.discount > 0 && (
                          <div className="mt-4 text-xs font-bold text-green-500 uppercase tracking-widest">
                            Final Price: ₹{Math.round(plan.price * (1 - plan.discount / 100))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="pt-6 border-t border-white/5 flex justify-end">
                    <button 
                      onClick={handleSavePricing}
                      disabled={loading}
                      className="px-12 py-4 bg-gold-gradient text-black rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-gold/20 flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                    >
                      <Save size={18} /> {loading ? 'Saving...' : 'Update Pricing'}
                    </button>
                  </div>
                </div>
              )}

              {/* MOCK SETTINGS FOR DEMO */}
              {activeTab !== 'Pricing' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Platform Mode</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-gold transition-all text-white">
                        <option>Production (Stable)</option>
                        <option>Maintenance Mode</option>
                        <option>Development (Sandbox)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Global API Cache</label>
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex-1 text-sm font-bold">Enabled (Redis 7.0)</div>
                        <div className="w-12 h-6 bg-gold rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Master Security Level</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Standard', 'High', 'Maximum'].map((level) => (
                        <button 
                          key={level}
                          className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            level === 'High' 
                            ? 'bg-gold/10 border-gold text-gold' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/5 flex justify-end gap-6">
                    <button className="px-10 py-4 text-white/20 font-black uppercase text-[11px] tracking-widest hover:text-white transition-all">
                      Reset Changes
                    </button>
                    <button className="px-16 py-4 bg-gold-gradient text-black rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-gold/20 flex items-center gap-3 hover:scale-105 transition-all">
                      <Save size={18} /> Update Core
                    </button>
                  </div>
                </div>
              )}

              {/* Status Footer */}
              <div className="pt-12 flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Database: Connected
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  AI Cluster: Optimized
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={12} /> Edge Nodes: 12 Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
