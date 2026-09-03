'use client';

import React, { useEffect, useState } from 'react';
import { ChefHat, TrendingUp, TrendingDown, DollarSign, Activity, Settings2 } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function MenuEngineeringDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassification = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/menu-engineering/classification?days=30`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Sort by highest revenue
          data.sort((a: any, b: any) => b.totalRevenue - a.totalRevenue);
          setItems(data);
        }
      } catch (error) {
        console.error('Failed to load Menu Engineering data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassification();
  }, []);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Star': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Cash Cow': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Puzzle': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Low Margin': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Dead Item': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'Star': return <TrendingUp size={16} />;
      case 'Cash Cow': return <DollarSign size={16} />;
      case 'Low Margin': return <Activity size={16} />;
      case 'Puzzle': return <Settings2 size={16} />;
      case 'Dead Item': return <TrendingDown size={16} />;
      default: return <ChefHat size={16} />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/60">Analyzing your menu performance...</div>;
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Menu <span className="text-[#d4af37]">Engineering</span></h1>
        <p className="text-foreground/60">Profitability vs Popularity Matrix based on your last 30 days of sales.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="p-6 bg-card border border-border rounded-xl shadow-sm hover:border-[#d4af37]/30 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 w-max ${getClassificationColor(item.classification)}`}>
                  {getClassificationIcon(item.classification)} {item.classification}
                </span>
              </div>
              <p className="text-sm text-foreground/60">{item.category}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 flex-1">
              <div>
                <p className="text-xs text-foreground/50 uppercase font-bold mb-1">Selling Price</p>
                <p className="font-medium text-lg">₹{item.price}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 uppercase font-bold mb-1">Cost</p>
                <p className="font-medium text-lg">₹{item.ingredientPrice}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 uppercase font-bold mb-1">Margin</p>
                <p className={`font-medium text-lg ${item.contributionMargin > 30 ? 'text-green-400' : 'text-orange-400'}`}>
                  {item.contributionMargin?.toFixed(1) || 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 uppercase font-bold mb-1">Qty Sold</p>
                <p className="font-medium text-lg">{item.quantitySold}</p>
              </div>
            </div>

            <div className="w-full md:w-64 bg-background/50 border border-border p-4 rounded-xl text-sm">
              <strong className="block text-[#d4af37] mb-1">Recommended Action:</strong>
              <span className="text-foreground/80 leading-snug">{item.action}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="p-12 text-center text-foreground/50 bg-card rounded-2xl border border-border">
            No sales data available for the last 30 days to engineer your menu.
          </div>
        )}
      </div>
    </div>
  );
}
