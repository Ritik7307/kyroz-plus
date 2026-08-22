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
  IndianRupee,
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
  Phone,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function DashboardPage() {
  const [user, setUser] = React.useState<any>(null);
  const [sops, setSops] = React.useState<any[]>([]);
  const [packets, setPackets] = React.useState<any[]>([]);
  const [testimonials, setTestimonials] = React.useState<any[]>([]);
  const [dailyProfit, setDailyProfit] = React.useState<number>(0);
  const [dailyRevenue, setDailyRevenue] = React.useState<number>(0);
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
        setSops(Array.isArray(sopData) ? sopData : []);

        const packetsRes = await fetch(`${API_URL}/api/sop-packets`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const packetsData = await packetsRes.json();
        setPackets(Array.isArray(packetsData) ? packetsData : []);

        const testimonialsRes = await fetch(`${API_URL}/api/testimonials`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (testimonialsRes.ok) {
          const testimonialsData = await testimonialsRes.json();
          setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
        }

        // Fetch daily profit
        try {
          const profitRes = await fetch(`${API_URL}/api/orders/daily-profit`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profitRes.ok) {
            const profitData = await profitRes.json();
            setDailyProfit(profitData.dailyProfit || 0);
            setDailyRevenue(profitData.dailyRevenue || 0);
          }
        } catch (e) {
          console.error("Failed to fetch daily profit", e);
        }
      } catch (err) {
        router.push('/login');
      }
    };
    fetchData();
  }, [router]);

  const openWhatsAppSupport = () => {
    const phoneNumber = "917887009800";
    const userName = user?.name || "Kyyroz Member";
    const message = `Namaste Admin, 👨‍🍳\n\nI am ${userName} from Kyyroz-Plus. I need some assistance regarding the dashboard/operations.\n\nPlease guide me. Dhanyawad! 🙏`;
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encoded}`, '_blank');
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  return (
    <div className="space-y-12 pb-24 max-w-[1400px] mx-auto relative">
        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* POS Terminal Button */}
          {(user?.role === 'manager' || user?.role === 'billing' || user?.role === 'user') && (
            <div className="lg:col-span-6 h-full">
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
                  <p className="text-white/40 text-xs mt-2 font-black tracking-[0.2em]">OPEN BILLING INTERFACE</p>
                </div>
              </button>
            </div>
          )}

          {/* Welcome & Status */}
          <div className={user?.role === 'cook' ? 'lg:col-span-12 h-full' : 'lg:col-span-6 h-full'}>
            <div className="h-full bg-card glass-card rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full -ml-32 -mt-32 blur-[100px]"></div>
              <div className="space-y-3 relative z-10 text-center lg:text-left">
                <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">WELCOME BACK, <span className="text-gold">{user?.shopName || user?.name || 'CHEF'}!</span></h2>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <span className="px-4 py-1 bg-gold/10 text-gold text-xs font-black uppercase tracking-widest rounded-full border border-gold/20">
                    {user?.role?.toUpperCase()} ACCOUNT
                  </span>
                  <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-widest">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    System Online
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 relative z-10 w-full lg:w-auto">
                {(user?.role === 'manager' || user?.role === 'user') && (
                  <div className="flex gap-4">
                    <div className="bg-black/40 p-4 px-6 rounded-2xl border border-white/10 hidden sm:block">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Today's Sale</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-white">{formatCurrency(dailyRevenue)}</span>
                        <Activity size={14} className="text-blue-500" />
                      </div>
                    </div>
                    <div className="bg-black/40 p-4 px-6 rounded-2xl border border-white/10 hidden sm:block">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Daily Gross Profit</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-white">{formatCurrency(dailyProfit)}</span>
                        <TrendingUp size={14} className="text-green-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                        <p className="text-xs text-white/40 uppercase tracking-widest mt-0.5">Uploaded {new Date(sop.createdAt).toLocaleDateString()}</p>
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
                { title: "Cooking SOPs", category: "Dish", path: "/dashboard/sop?category=Dish", sub: "(Shahi Paneer, Kadhai Chicken...)", icon: ChefHat, roles: ['manager', 'user', 'cook'] },
                { title: "Gravy Master", category: "Gravy", path: "/dashboard/gravy", sub: "(Batch size, storage, reheating...)", icon: UtensilsCrossed, roles: ['manager', 'user', 'cook'] },
                { title: "Costing Master", category: "Costing", path: "/dashboard/costing", sub: "(Menu Pricing, Margin %...)", icon: Calculator, roles: ['manager', 'user', 'billing'] },
                { title: "Wastage Master", category: "Wastage", path: "/dashboard/wastage", sub: "(FIFO, inventory Rules...)", icon: Trash2, roles: ['manager', 'user', 'cook'] },
              ].filter(item => item.roles.includes(user?.role || 'user')).map((item, idx) => (
                <div key={idx} onClick={() => router.push(item.path)} className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 hover:border-gold/30 cursor-pointer group flex flex-col items-center text-center gap-6 shadow-xl">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-gold group-hover:bg-gold/10 transition-all border border-white/5">
                    <item.icon size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase tracking-tight text-white">{item.title}</h4>
                    <p className="text-white/30 text-xs mt-1 font-bold uppercase tracking-widest">{item.sub}</p>
                  </div>
                  <div className="text-gold text-xs font-black flex items-center gap-2 uppercase tracking-widest mt-2 group-hover:gap-3 transition-all">
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
                { label: "Check Food Cost %", icon: TrendingUp, category: "Costing", path: "/dashboard/costing" },
                { label: "Top Profit Dishes", icon: Activity, category: "History", path: "/dashboard/history" },
                { label: "Report Daily Wastage", icon: AlertCircle, category: "Wastage", path: "/dashboard/wastage" },
              ].map((action, idx) => (
                <button key={idx} onClick={() => router.push(action.path)} className="w-full bg-card/50 hover:bg-card glass-card p-4 rounded-2xl flex items-center gap-4 group transition-all text-left border border-white/5">
                  <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center text-black shadow-lg">
                    <action.icon size={20} />
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-widest text-white/60 group-hover:text-gold transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SOP Packets Store */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-white/40 text-[11px] font-black tracking-[0.4em] uppercase flex items-center gap-2">
                <Package size={16} className="text-gold" /> Premium SOP Packets
              </h3>
              <button 
                onClick={() => router.push('/dashboard/packets')}
                className="text-gold text-xs font-black uppercase tracking-widest flex items-center gap-2 group hover:underline"
              >
                VIEW FULL STORE <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packets.slice(0, 3).map((packet: any, idx) => (
                <div key={idx} className="bg-card glass-card rounded-[2rem] overflow-hidden group border border-white/5 hover:border-gold/30 transition-all shadow-xl flex flex-col">
                  <div className="h-40 overflow-hidden relative bg-black">
                    {packet.images?.[0] ? (
                      <img src={packet.images[0]} alt={packet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/5">
                        <Package size={32} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-gold uppercase tracking-widest border border-white/10">{packet.category}</div>
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-black text-xs leading-tight text-white uppercase tracking-tight line-clamp-2">{packet.name}</h5>
                      <p className="text-xs text-white/30 mt-2 line-clamp-2 font-medium">{packet.description || 'Professional commercial collection.'}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-xl font-black text-white flex items-center gap-1">
                        <IndianRupee size={16} className="text-gold" />{packet.price}
                      </span>
                      <button 
                        onClick={() => router.push('/dashboard/packets')}
                        className="bg-white/5 hover:bg-gold hover:text-black transition-all px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {packets.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                   <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No Premium Packets available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- TESTIMONIALS SECTION --- */}
        <section className="space-y-6 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-white/40 text-[11px] font-black tracking-[0.4em] uppercase flex items-center gap-2">
              <MessageSquare size={16} className="text-gold" /> Member Stories
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t: any) => (
              <motion.div 
                key={t._id}
                className="bg-card glass-card p-6 rounded-[2rem] border border-white/5 relative group hover:border-gold/30 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                      {t.avatarUrl ? (
                        <img src={t.avatarUrl} alt={t.userName} className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-white/20" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{t.userName}</h4>
                      <p className="text-xs font-black uppercase tracking-widest text-gold">{t.userRole}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 italic leading-relaxed line-clamp-4">"{t.content}"</p>
                </div>
                <div className="mt-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < t.rating ? 'text-gold' : 'text-white/10'}`}>★</span>
                  ))}
                </div>
              </motion.div>
            ))}
            {testimonials.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No Member Stories available yet.</p>
              </div>
            )}
          </div>
        </section>

      {/* --- KOSA FLOATING AI HANDLED IN LAYOUT --- */}
    </div>
  );
}
