'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Plus, TrendingUp, IndianRupee, MapPin, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function EliteDashboardPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', shopAddress: '', gstNumber: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const userRes = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userRes.json();
      
      const currentPlan = userData.plan || userData.subscriptionPlan;
      if (currentPlan !== 'Elite') {
        router.push('/dashboard');
        return;
      }

      const [locRes, analyticsRes] = await Promise.all([
        fetch(`${API_URL}/api/user/locations`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/orders/elite-analytics`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (locRes.ok) setLocations(await locRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/locations`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', shopAddress: '', gstNumber: '' });
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create location');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleImpersonate = async (locationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/impersonate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId })
      });
      
      if (res.ok) {
        const data = await res.json();
        // Save elite token to switch back later
        localStorage.setItem('eliteToken', token!);
        localStorage.setItem('token', data.token);
        localStorage.setItem('impersonatedLocation', data.location.name);
        // Force full reload to rebuild dashboard with new token context
        window.location.href = '/dashboard';
      } else {
        alert('Failed to switch location');
      }
    } catch (err) {
      alert('Error switching location');
    }
  };

  if (loading) return <div className="text-center py-20 text-gold font-black uppercase tracking-widest animate-pulse">Loading Elite Systems...</div>;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  return (
    <div className="space-y-12 pb-24 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Elite Master Dashboard</h1>
          <p className="text-gold text-xs font-black uppercase tracking-widest mt-1">Multi-Location Control Center</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          disabled={locations.length >= 4}
          className="bg-gold text-black font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Plus size={16} /> Add Location ({locations.length}/4)
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <h3 className="text-white/40 text-[10px] font-black tracking-widest uppercase flex items-center gap-2 mb-4">
            <Activity size={14} className="text-blue-500" /> Today's Total Network Sales
          </h3>
          <div className="text-4xl font-black text-white">{formatCurrency(analytics?.daily?.revenue || 0)}</div>
          <p className="text-green-500 text-xs font-bold mt-2">Profit: {formatCurrency(analytics?.daily?.profit || 0)}</p>
        </div>
        
        <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
          <h3 className="text-white/40 text-[10px] font-black tracking-widest uppercase flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-gold" /> Monthly Network Sales
          </h3>
          <div className="text-4xl font-black text-white">{formatCurrency(analytics?.monthly?.revenue || 0)}</div>
          <p className="text-green-500 text-xs font-bold mt-2">Profit: {formatCurrency(analytics?.monthly?.profit || 0)}</p>
        </div>
      </div>

      {/* Locations List */}
      <div className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
          <Store className="text-gold" /> Your Restaurants
        </h2>
        
        {locations.length === 0 ? (
          <div className="bg-card glass-card p-12 text-center rounded-[2rem] border border-white/5">
            <Store size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Locations Added</h3>
            <p className="text-white/40 text-sm mb-6">Create your first restaurant to start managing operations.</p>
            <button onClick={() => setShowAddModal(true)} className="bg-gold/10 text-gold border border-gold/20 px-6 py-2 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-gold hover:text-black transition-all">Add Restaurant</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc, idx) => {
              const stats = analytics?.locationBreakdown?.find((l: any) => l.name === loc.shopName) || { revenue: 0, profit: 0, count: 0 };
              
              return (
                <div key={idx} className="bg-card glass-card p-6 rounded-[2rem] border border-white/5 group hover:border-gold/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gold border border-white/5 group-hover:bg-gold/10 transition-colors">
                        <Store size={20} />
                      </div>
                      <span className="bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white leading-none mb-1">{loc.shopName}</h3>
                    <p className="text-white/40 text-xs font-medium flex items-center gap-1"><MapPin size={12} /> {loc.shopAddress || 'No Address'}</p>
                    
                    <div className="mt-6 p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Monthly Revenue:</span>
                        <span className="font-bold text-white">{formatCurrency(stats.revenue)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Monthly Profit:</span>
                        <span className="font-bold text-green-500">{formatCurrency(stats.profit)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Total Orders:</span>
                        <span className="font-bold text-gold">{stats.count}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleImpersonate(loc._id)}
                    className="mt-6 w-full py-3 bg-white/5 hover:bg-gold hover:text-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-white/10"
                  >
                    Manage Location
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-md relative">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Add New Location</h3>
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <form onSubmit={handleCreateLocation} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1 block">Restaurant Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1 block">Manager Email (For Login)</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1 block">Manager Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1 block">Address</label>
                <input required type="text" value={formData.shopAddress} onChange={e => setFormData({...formData, shopAddress: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gold text-black font-bold rounded-xl hover:bg-white">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
