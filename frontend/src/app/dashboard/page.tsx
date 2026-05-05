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
  DollarSign,
  MessageCircle,
  Phone
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
        const userRes = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userRes.json();
        
        if (userData.role === 'admin') {
          router.push('/admin/dashboard');
          return;
        }
        setUser(userData);

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

  const openWhatsAppSupport = () => {
    const phoneNumber = "917307255940";
    const userName = user?.name || "Kyyroz Member";
    const message = `Namaste Admin, 👨‍🍳\n\nI am ${userName} from Kyyroz-Plus. I need some assistance regarding the dashboard/operations.\n\nPlease guide me. Dhanyawad! 🙏`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-12 pb-24 max-w-[1400px] mx-auto relative">
        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* POS Terminal Button */}
          {(user?.role === 'manager' || user?.role === 'billing' || user?.role === 'user') && (
            <div className="lg:col-span-4 h-full">
              <button 
                onClick={() => router.push('/dashboard/pos')}
                className="w-full h-full min-h-[180px] bg-card glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 group hover:scale-[1.02] transition-all duration-500 animate-gold-glow border-gold/30 border-2 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="w-20 h-20 rounded-[1.5rem] bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform shadow-inner border border-gold/20">
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
                <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">WELCOME BACK, <span className="text-gold">{user?.name || 'CHEF'}!</span></h2>
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
              
              <div className="flex gap-4 relative z-10 w-full lg:w-auto">
                <button 
                  onClick={openWhatsAppSupport}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <MessageCircle size={18} /> Support
                </button>
                {(user?.role === 'manager' || user?.role === 'user') && (
                  <div className="bg-black/40 p-4 px-6 rounded-2xl border border-white/10 hidden sm:block">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Daily Profit</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-white">₹18.5k</span>
                      <TrendingUp size={14} className="text-green-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role Specific Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {(user?.role === 'manager' || user?.role === 'user' || user?.role === 'cook') && (
                <div onClick={() => router.push('/dashboard/inventory')} className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 group hover:bg-red-500/10 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500"><AlertCircle size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">Wastage Alert</p>
                    <p className="text-xs font-black text-white uppercase">Milk Expiring Today</p>
                  </div>
                </div>
              )}
              {(user?.role === 'manager' || user?.role === 'user' || user?.role === 'cook') && (
                <div onClick={() => router.push('/dashboard/inventory')} className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-3xl flex items-center gap-4 group hover:bg-yellow-500/10 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-500"><ShoppingCart size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-yellow-500/60 uppercase tracking-widest">Low Stock</p>
                    <p className="text-xs font-black text-white uppercase">Premix Packet A (2 Left)</p>
                  </div>
                </div>
              )}
              {(user?.role === 'manager' || user?.role === 'user' || user?.role === 'billing') && (
                <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-3xl flex items-center gap-4 group hover:bg-orange-500/10 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500"><DollarSign size={24} /></div>
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
              <h3 className="text-white/40 text-[11px] font-black tracking-[0.4em] uppercase flex items-center gap-2">
                <FileText size={16} className="text-gold" /> My Recent Uploads
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sops.slice(0, 3).map((sop, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => router.push(`/dashboard/sop?id=${sop._id}`)}
                    className="bg-card glass-card p-6 rounded-2xl border border-white/5 hover:border-gold/30 cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold"><FileText size={24} /></div>
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{sop.title}</h4>
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
            <h3 className="text-white/40 text-[11px] font-black tracking-[0.4em] uppercase">Operational Standards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Cooking SOPs", sub: "(Shahi Paneer, Kadhai Chicken...)", icon: ChefHat, roles: ['manager', 'user', 'cook'] },
                { title: "Gravy Master", sub: "(Batch size, storage, reheating...)", icon: UtensilsCrossed, roles: ['manager', 'user', 'cook'] },
                { title: "Costing Master", sub: "(Menu Pricing, Margin %...)", icon: Calculator, roles: ['manager', 'user', 'billing'] },
                { title: "Wastage Master", sub: "(FIFO, inventory Rules...)", icon: Trash2, roles: ['manager', 'user', 'cook'] },
              ].filter(item => item.roles.includes(user?.role || 'user')).map((item, idx) => (
                <div key={idx} onClick={() => router.push(`/dashboard/sop?category=${item.title.split(' ')[0]}`)} className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 hover:border-gold/30 cursor-pointer group flex flex-col items-center text-center gap-6 shadow-xl">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-gold group-hover:bg-gold/10 transition-all border border-white/5">
                    <item.icon size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase tracking-tight text-white">{item.title}</h4>
                    <p className="text-white/30 text-[10px] mt-1 font-bold uppercase tracking-widest">{item.sub}</p>
                  </div>
                  <div className="text-gold text-[10px] font-black flex items-center gap-2 uppercase tracking-widest mt-2 group-hover:gap-3 transition-all">
                    OPEN <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- BOTTOM SECTION (RESTORED) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Quick Actions */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-white/40 text-[11px] font-black tracking-[0.4em] uppercase">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: "Check Food Cost %", icon: TrendingUp },
                { label: "Report Daily Wastage", icon: AlertCircle },
                { label: "Staff Discipline Checklist", icon: CheckCircle2 },
              ].map((action, idx) => (
                <button key={idx} className="w-full bg-card/50 hover:bg-card glass-card p-4 rounded-2xl flex items-center gap-4 group transition-all text-left border border-white/5">
                  <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center text-black shadow-lg">
                    <action.icon size={20} />
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-widest text-white/60 group-hover:text-gold transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Premix Store */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-white/40 text-[11px] font-black tracking-[0.4em] uppercase">My Premix Store</h3>
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Stock Alert: LOW</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Makhni Premix Packet A", price: "999", color: "Red Logo", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=200" },
                { name: "Royal White Premix Packet B", price: "889", color: "Green Logo", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200" },
                { name: "Royal White Premix Packet C", price: "1200", color: "Yellow Logo", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=200" },
              ].map((product, idx) => (
                <div key={idx} className="bg-card glass-card rounded-[2rem] overflow-hidden group border border-white/5 hover:border-gold/30 transition-all shadow-xl">
                  <div className="h-40 overflow-hidden relative bg-black">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-50" />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-gold uppercase tracking-widest border border-white/10">{product.color}</div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h5 className="font-black text-xs h-8 flex items-center leading-tight text-white uppercase tracking-tight">{product.name}</h5>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-white">₹{product.price}</span>
                      <button className="bg-white/5 hover:bg-gold hover:text-black transition-all px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                        Order
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
      
      {/* Floating WhatsApp FAB - Higher position */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={openWhatsAppSupport}
        className="fixed bottom-[140px] right-8 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(34,197,94,0.4)] z-[110] hover:bg-green-600 transition-all border-2 border-white/10"
        title="Contact Support"
      >
        <MessageCircle size={32} />
      </motion.button>

    </div>
  );
}
