'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { IndianRupee, Save, ArrowLeft } from 'lucide-react';

export default function AdminPricingPage() {
  const router = useRouter();
  const [pricing, setPricing] = useState({
    starter: { price: 999, discount: 0 },
    growth: { price: 2999, discount: 0 },
    scale: { price: 9999, discount: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch(`${API_URL}/api/admin/settings/pricing`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPricing(data);
          }
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
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
        alert('Failed to update pricing');
      }
    } catch (error) {
      console.error('Error saving pricing:', error);
      alert('Error saving pricing');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (plan: 'starter' | 'growth' | 'scale', field: 'price' | 'discount', value: number) => {
    setPricing(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan as keyof typeof prev],
        [field]: value
      }
    }));
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading pricing settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/admin/dashboard')} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <IndianRupee className="text-gold" /> Pricing Settings
        </h1>
      </div>

      <div className="bg-card glass-card p-8 rounded-3xl border border-white/5 space-y-8">
        <p className="text-white/40 text-sm">Update the subscription prices. Changes will instantly reflect on the public Home page and the user Membership upgrade page.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['starter', 'growth', 'scale'] as const).map(plan => (
            <div key={plan} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-xl font-bold text-gold uppercase tracking-widest">{plan === 'growth' ? 'Premium' : plan} Plan</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Base Price (₹/mo)</label>
                <input
                  type="number"
                  value={pricing[plan].price}
                  onChange={e => handleChange(plan, 'price', Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Discount (%)</label>
                <input
                  type="number"
                  value={pricing[plan].discount}
                  onChange={e => handleChange(plan, 'discount', Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 mt-4">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Final Price</p>
                <p className="text-2xl font-black text-green-400">
                  ₹{Math.round(pricing[plan].price * (1 - pricing[plan].discount / 100))}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-black px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-gold/80 transition-colors disabled:opacity-50"
          >
            <Save size={20} /> {saving ? 'Saving...' : 'Save Pricing'}
          </button>
        </div>
      </div>
    </div>
  );
}
