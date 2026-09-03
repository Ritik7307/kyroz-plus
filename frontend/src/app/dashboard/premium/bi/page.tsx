'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, DollarSign, ShoppingBag, Percent } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function BIDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [sumRes, trendRes, anomalyRes] = await Promise.all([
          fetch(`${API_URL}/api/bi/business-summary`, { headers }),
          fetch(`${API_URL}/api/bi/sales-trend`, { headers }),
          fetch(`${API_URL}/api/bi/anomalies`, { headers })
        ]);

        if (sumRes.ok) setSummary(await sumRes.json());
        if (trendRes.ok) setTrends(await trendRes.json());
        if (anomalyRes.ok) {
          const data = await anomalyRes.json();
          setAnomalies(data.anomalies || []);
        }
      } catch (error) {
        console.error('Failed to load BI data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-foreground/60">Loading Business Intelligence Data...</div>;
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Business Health <span className="text-[#d4af37]">Dashboard</span></h1>
        <p className="text-foreground/60">Advanced Business Intelligence insights for your restaurant.</p>
      </div>

      {anomalies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><AlertCircle className="text-red-500" /> Detected Anomalies</h2>
          {anomalies.map((anomaly, idx) => (
            <div key={idx} className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex flex-col gap-2">
              <span className="text-red-400 font-bold uppercase text-xs tracking-wider">{anomaly.type}</span>
              <p className="text-foreground">{anomaly.message}</p>
              <div className="text-sm text-foreground/70 bg-background/50 p-3 rounded-lg mt-2">
                <strong>Action Required:</strong> {anomaly.action}
              </div>
            </div>
          ))}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-[#d4af37]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-foreground/60 uppercase tracking-wider font-bold mb-1">Total Revenue</p>
                <h3 className="text-3xl font-black">₹{summary.revenue?.toLocaleString() || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-[#d4af37]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-foreground/60 uppercase tracking-wider font-bold mb-1">Total Orders</p>
                <h3 className="text-3xl font-black">{summary.orders || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-[#d4af37]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-foreground/60 uppercase tracking-wider font-bold mb-1">Food Cost</p>
                <h3 className="text-3xl font-black">{summary.foodCostPercentage || 0}%</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Percent size={20} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-[#d4af37]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-foreground/60 uppercase tracking-wider font-bold mb-1">Gross Margin</p>
                <h3 className="text-3xl font-black">{summary.grossMargin || 0}%</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>
        </div>
      )}

      {trends.length > 0 && (
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm mt-8">
          <h2 className="text-xl font-bold mb-6">30-Day Revenue Trend</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="_id" stroke="#ffffff50" fontSize={12} />
                <YAxis stroke="#ffffff50" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#d4af37' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={3} dot={{ r: 4, fill: '#d4af37' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
