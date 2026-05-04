'use client';

import React, { useState } from 'react';
import { 
  ChefHat, 
  UtensilsCrossed, 
  Calculator, 
  Trash2, 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard,
  TrendingUp,
  Activity,
  CreditCard,
  MessageSquare,
  ArrowRight,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingKOSA from '@/components/dashboard/FloatingKOSA';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function DashboardPage() {
  const [user, setUser] = React.useState<any>(null);
  const [sops, setSops] = React.useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Fetch User
        const userRes = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userRes.json();
        
        if (userData.role === 'admin') {
          router.push('/admin/dashboard');
          return;
        }
        setUser(userData);

        // Fetch User's SOPs
        const sopRes = await fetch(`${API_URL}/api/sops`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const sopData = await sopRes.json();
        setSops(sopData);
      } catch (err) {
        router.push('/login');
      }
    };
    fetchData();
  }, [router]);

  return (
    <div className="space-y-12 pb-24 max-w-[1400px] mx-auto">
        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* POS Terminal Button - Only for Manager/Billing/User */}
          {(user?.role === 'manager' || user?.role === 'billing' || user?.role === 'user') && (
            <div className="lg:col-span-4 h-full">
              <button 
                onClick={() => router.push('/dashboard/pos')}
                className="w-full h-full min-h-[180px] bg-card glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 group hover:scale-[1.02] transition-all duration-500 animate-gold-glow border-gold/30 border-2 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="w-20 h-20 rounded-[1.5rem] bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform shadow-inner">
                  <CreditCard size={44} />
                </div>
                <div className="text-center">
                  <h3 className="text-gold font-black text-2xl uppercase tracking-widest">POS TERMINAL</h3>
                  <p className="text-white/40 text-[10px] mt-2 font-black tracking-[0.2em]">OPEN BILLING INTERFACE</p>
                </div>
              </button>
            </div>
          )}

          {/* Welcome & Status */}
          <div className={user?.role === 'cook' ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <div className="bg-card glass-card rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full -ml-32 -mt-32 blur-[100px]"></div>
              <div className="space-y-3 relative z-10 text-center lg:text-left">
                <h2 className="text-4xl font-black tracking-tighter">WELCOME BACK, <span className="text-gold">{user?.name?.toUpperCase() || 'CHEF'}!</span></h2>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <span className="px-4 py-1 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-gold/20">
                    {user?.role?.toUpperCase()} ACCOUNT
                  </span>
                  <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    System Online
                  </div>
                </div>
              </div>
              
              {(user?.role === 'manager' || user?.role === 'user') && (
                <div className="flex gap-4 relative z-10 w-full lg:w-auto">
                  <div 
                    onClick={() => router.push('/dashboard/costing')}
                    className="flex-1 bg-black/40 p-6 rounded-3xl border border-white/10 hover:border-gold/30 transition-all cursor-pointer group"
                  >
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Daily Profit</p>
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-2xl font-black">₹18.5k</span>
                      <span className="text-green-500 text-[10px] font-black flex items-center gap-1 mb-1">
                        <TrendingUp size={12} /> 12%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Specific Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {(user?.role === 'manager' || user?.role === 'user' || user?.role === 'cook') && (
                <div 
                  onClick={() => router.push('/dashboard/inventory')}
                  className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 group hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">Wastage Alert</p>
                    <p className="text-xs font-black text-white uppercase">Milk Expiring Today</p>
                  </div>
                </div>
              )}
              
              {(user?.role === 'manager' || user?.role === 'user' || user?.role === 'cook') && (
                <div 
                  onClick={() => router.push('/dashboard/inventory')}
                  className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-3xl flex items-center gap-4 group hover:bg-yellow-500/10 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-yellow-500/60 uppercase tracking-widest">Low Stock</p>
                    <p className="text-xs font-black text-white uppercase">Premix Packet A (2 Left)</p>
                  </div>
                </div>
              )}

              {(user?.role === 'manager' || user?.role === 'user' || user?.role === 'billing') && (
                <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-3xl flex items-center gap-4 group hover:bg-orange-500/10 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest">Low Margin</p>
                    <p className="text-xs font-black text-white uppercase">Veg Jalfrezi (12%)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- SOP LIBRARY GRID --- */}
        <section className="space-y-8">
          {(user?.role === 'manager' || user?.role === 'user') && sops.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-white/40 text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                <FileText size={16} className="text-gold" /> My Recent Uploads
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sops.slice(0, 3).map((sop, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card glass-card p-6 rounded-2xl gold-border-hover cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm line-clamp-1">{sop.title}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Uploaded {new Date(sop.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-white/20 group-hover:text-gold transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-white/40 text-sm font-bold tracking-[0.2em] uppercase">Global Library</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Cooking SOPs", sub: "(Shahi Paneer, Kadhai Chicken...)", icon: ChefHat, roles: ['manager', 'user', 'cook'] },
                { title: "Gravy Master", sub: "(Batch size, storage, reheating...)", icon: UtensilsCrossed, roles: ['manager', 'user', 'cook'] },
                { title: "Costing Master", sub: "(Menu Pricing, Margin %...)", icon: Calculator, roles: ['manager', 'user', 'billing'] },
                { title: "Wastage Master", sub: "(FIFO, inventory Rules...)", icon: Trash2, roles: ['manager', 'user', 'cook'] },
              ].filter(item => item.roles.includes(user?.role || 'user')).map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => router.push(`/dashboard/sop?category=${item.title.split(' ')[0]}`)}
                  className="bg-card glass-card p-6 rounded-2xl gold-border-hover cursor-pointer group flex flex-col items-center text-center gap-4 transition-all"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/80 group-hover:text-gold group-hover:bg-gold/10 transition-all">
                    <item.icon size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-white/40 text-xs mt-1 px-2">{item.sub}</p>
                  </div>
                  <div className="text-gold text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-2">
                    OPEN {item.title.toUpperCase()} <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- BOTTOM SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-white/40 text-sm font-bold tracking-[0.2em] uppercase">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: "Check Food Cost %", icon: TrendingUp },
                { label: "Report Daily Wastage", icon: AlertCircle },
                { label: "Staff Discipline Checklist", icon: CheckCircle2 },
              ].map((action, idx) => (
                <button key={idx} className="w-full bg-card/50 hover:bg-card glass-card p-4 rounded-xl flex items-center gap-4 group transition-all text-left">
                  <div className="w-10 h-10 bg-gold-gradient rounded-lg flex items-center justify-center text-black">
                    <action.icon size={20} />
                  </div>
                  <span className="font-semibold text-sm group-hover:text-gold transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Premix Store */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white/40 text-sm font-bold tracking-[0.2em] uppercase">My Premix Store</h3>
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-xs font-bold text-red-500">Stock level (Premix A): LOW</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Makhni Premix Packet A", price: "999", color: "Red Logo", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=200" },
                { name: "Royal White Premix Packet B", price: "889", color: "Green Logo", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200" },
                { name: "Royal White Premix Packet C", price: "1200", color: "Yellow Logo", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=200" },
              ].map((product, idx) => (
                <div key={idx} className="bg-card glass-card rounded-2xl overflow-hidden group">
                  <div className="h-40 overflow-hidden relative">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60" />
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded text-[10px] font-bold text-gold uppercase">{product.color}</div>
                  </div>
                  <div className="p-4 space-y-3">
                    <h5 className="font-bold text-sm h-10 flex items-center leading-tight">{product.name}</h5>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">₹{product.price}</span>
                      <button className="bg-white/10 hover:bg-gold hover:text-black transition-all px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                        Order Again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      {/* --- KOSA FLOATING AI --- */}
      <FloatingKOSA />
    </div>
  );
}
