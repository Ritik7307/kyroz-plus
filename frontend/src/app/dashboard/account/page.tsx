'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Store, 
  ShieldCheck, 
  CreditCard, 
  Calendar,
  ChevronRight,
  Settings,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gold font-bold tracking-widest uppercase animate-pulse">
        Fetching Profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold">MY <span className="text-gold">ACCOUNT</span></h2>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Manage your professional profile and subscription</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* PROFILE CARD */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-card glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold/10 transition-all"></div>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gold-gradient flex items-center justify-center text-black font-bold text-3xl shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                {user?.name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{user?.name || 'User Name'}</h3>
                <p className="text-gold text-xs font-bold uppercase tracking-widest mt-1">{user?.role || 'Member'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Email Address</p>
                  <p className="text-sm font-medium">{user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                  <Store size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Restaurant / Shop Name</p>
                  <p className="text-sm font-medium">{user?.shopName || 'Not Set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Account Status</p>
                  <p className="text-sm font-bold text-green-500">Verified & Active</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border border-white/10">
              Edit Profile Details
            </button>
          </div>
        </div>

        {/* SUBSCRIPTION SIDEBAR */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-card glass-card p-6 rounded-3xl border-l-4 border-gold">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Subscription Plan</h4>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-2xl font-bold text-gold">{user?.plan || 'KYROZ PRO'}</p>
                <p className="text-[10px] text-white/30 uppercase mt-1">Billed Annually</p>
              </div>
              <div className="p-3 bg-gold/10 rounded-2xl text-gold">
                <CreditCard size={24} />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
                <ChevronRight size={14} className="text-gold" />
                Unlimited SOP Access
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
                <ChevronRight size={14} className="text-gold" />
                KOSA AI Support 24/7
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
                <ChevronRight size={14} className="text-gold" />
                Costing & Margin Tools
              </div>
            </div>

            <button className="w-full py-4 bg-gold-gradient rounded-2xl text-black font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-gold/10">
              Upgrade Your Plan
            </button>
          </div>

          <div className="bg-card glass-card p-6 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Security Settings</h4>
            <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all">
              <span className="text-xs font-medium">Change OTP Phone</span>
              <Settings size={14} className="text-white/20" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all">
              <span className="text-xs font-medium">Notification Preferences</span>
              <Bell size={14} className="text-white/20" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
