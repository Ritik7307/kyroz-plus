'use client';

import React, { useEffect, useState } from 'react';
import { Network, TrendingUp, DollarSign, ShoppingBag, Store } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function MultiOutletDashboard() {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-foreground/60">Gathering multi-outlet metrics...</div>;
  }

  // Calculate totals
  const totalRevenue = outlets.reduce((sum, o) => sum + o.revenue, 0);
  const totalOrders = outlets.reduce((sum, o) => sum + o.orders, 0);

  return (
    <div className="space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Multi-Outlet <span className="text-[#d4af37]">HQ</span></h1>
        <p className="text-foreground/60">Unified view of all your branches and franchise locations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-[#d4af37]/30 transition-all">
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

        <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-[#d4af37]/30 transition-all">
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

        <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-[#d4af37]/30 transition-all">
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
          <div key={idx} className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Store size={18} className="text-[#d4af37]" />
                {outlet.shopName}
              </h3>
              <p className="text-sm text-foreground/60">{outlet.shopAddress || 'No address provided'}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 flex-1">
              <div>
                <p className="text-xs text-foreground/50 uppercase font-bold mb-1">Revenue</p>
                <p className="font-medium text-lg">₹{outlet.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 uppercase font-bold mb-1">Orders</p>
                <p className="font-medium text-lg">{outlet.orders.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 uppercase font-bold mb-1">Food Cost</p>
                <p className="font-medium text-lg text-orange-400">{outlet.foodCostPercentage}%</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 uppercase font-bold mb-1">Gross Margin</p>
                <p className="font-medium text-lg text-green-400">{outlet.grossMargin}%</p>
              </div>
            </div>
          </div>
        ))}
        {outlets.length === 0 && (
          <div className="p-12 text-center text-foreground/50 bg-card border border-border rounded-xl">
            You do not have any sub-outlets linked to your account yet.
          </div>
        )}
      </div>
    </div>
  );
}
