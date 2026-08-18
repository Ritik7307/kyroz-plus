'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  IndianRupee, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  Search,
  ArrowUpRight,
  Upload,
  UserCheck,
  ChefHat,
  Package,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [packets, setPackets] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      try {
        const meRes = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const meData = await meRes.json();
        if (meData.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        const statsRes = await fetch(`${API_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStats(await statsRes.json());

        const usersRes = await fetch(`${API_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);

        const packetsRes = await fetch(`${API_URL}/api/sop-packets`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const packetsData = await packetsRes.json();
        setPackets(Array.isArray(packetsData) ? packetsData : []);

        const testimonialsRes = await fetch(`${API_URL}/api/testimonials`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const testimonialsData = await testimonialsRes.json();
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
      } catch (err) {
        console.error('Admin fetch error:', err);
      }
    };
    fetchData();
  }, [router]);

  return (
    <div className="font-sans">
      <div className="space-y-8 pb-20">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Members', value: stats?.memberCount || 0, icon: Users, color: 'text-blue-400' },
            { label: 'Platform Revenue', value: `₹${(stats?.revenue || 0).toLocaleString()}`, icon: IndianRupee, color: 'text-green-400' },
            { label: 'Global SOPs', value: stats?.masterSopCount || 0, icon: FileText, color: 'text-gold' },
            { label: 'System Health', value: stats?.systemStatus || 'Online', icon: ShieldCheck, color: 'text-purple-400' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card glass-card p-6 rounded-2xl border-l-4 border-gold"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 rounded-xl text-gold">
                  <stat.icon size={24} />
                </div>
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Real-time</span>
              </div>
              <div className="mt-4">
                <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest">{stat.label}</h4>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* USER MANAGEMENT TABLE */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserCheck size={20} className="text-gold" /> Recent Members
              </h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-white/20" />
                <input type="text" placeholder="Search users..." className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold/50 transition-all w-64" />
              </div>
            </div>

            <div className="bg-card glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/40">
                    <th className="p-4 pl-6 font-bold">User</th>
                    <th className="p-4 font-bold">Shop Name</th>
                    <th className="p-4 font-bold">Plan</th>
                    <th className="p-4 font-bold">Joined</th>
                    <th className="p-4 pr-6 text-right font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.slice(0, 5).map((u: any, idx) => (
                    <tr key={idx} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="font-bold">{u.name}</div>
                        <div className="text-xs text-white/30">{u.email}</div>
                      </td>
                      <td className="p-4 text-white/60">{u.shopName || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          u.plan === 'Elite' ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {u.plan || 'Basic'}
                        </span>
                      </td>
                      <td className="p-4 text-white/40 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 pr-6 text-right">
                        <button className="text-gold/50 group-hover:text-gold transition-colors">
                          <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="p-12 text-center text-white/20 uppercase tracking-widest font-bold">No members found</div>
              )}
            </div>

            {/* SOP PACKETS PREVIEW SECTION */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Package size={20} className="text-gold" /> Commercial SOP Packets
                </h3>
                <button 
                  onClick={() => router.push('/admin/packets')}
                  className="text-gold text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
                >
                  View All Packets <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packets.slice(0, 4).map((packet: any) => (
                  <motion.div 
                    key={packet._id}
                    className="bg-card glass-card rounded-2xl border border-white/5 p-4 flex gap-4 hover:border-gold/30 transition-all"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden shrink-0">
                      {packet.images?.[0] ? (
                        <img src={packet.images[0]} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm">{packet.name}</h4>
                        <p className="text-xs text-white/40 line-clamp-1">{packet.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gold font-black text-xs">₹{packet.price}</span>
                        <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-white/40 uppercase font-black">{packet.category}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {packets.length === 0 && (
                  <div className="col-span-full p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-white/20 text-xs font-bold uppercase tracking-widest">
                    No packets created yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ADMIN ACTIONS SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Upload size={20} className="text-gold" /> Global Controls
              </h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => router.push('/admin/sops')}
                  className="w-full bg-gold-gradient p-6 rounded-2xl text-black font-bold flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl group"
                >
                  <ChefHat size={28} />
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-widest leading-none">Global SOPs</span>
                    <span className="text-[10px] opacity-60">Manage Recipes</span>
                  </div>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push('/admin/packets')}
                    className="bg-card glass-card p-4 rounded-2xl text-white font-bold flex flex-col items-center justify-center gap-2 hover:border-gold/50 border border-white/5 transition-all group"
                  >
                    <Package size={20} className="text-gold" />
                    <span className="text-[10px] uppercase tracking-widest">Packets</span>
                  </button>
                  <button 
                    onClick={() => router.push('/admin/testimonials')}
                    className="bg-card glass-card p-4 rounded-2xl text-white font-bold flex flex-col items-center justify-center gap-2 hover:border-gold/50 border border-white/5 transition-all group"
                  >
                    <MessageSquare size={20} className="text-gold" />
                    <span className="text-[10px] uppercase tracking-widest">Testimonials</span>
                  </button>
                  <button 
                    onClick={() => router.push('/admin/pricing')}
                    className="col-span-2 bg-card glass-card p-4 rounded-2xl text-white font-bold flex flex-col items-center justify-center gap-2 hover:border-gold/50 border border-white/5 transition-all group"
                  >
                    <IndianRupee size={20} className="text-gold" />
                    <span className="text-[10px] uppercase tracking-widest">Plan Pricing & Discounts</span>
                  </button>
                </div>

                <div className="bg-card glass-card p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Active Sessions</span>
                      <span className="font-bold text-green-400">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Pending Approvals</span>
                      <span className="font-bold text-gold">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* TESTIMONIALS SECTION AT BOTTOM */}
        <div className="space-y-6 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-3">
              <MessageSquare size={24} className="text-gold" /> User Testimonials
            </h3>
            <button 
              onClick={() => router.push('/admin/testimonials')}
              className="text-gold text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
            >
              Manage Testimonials <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t: any) => (
              <motion.div 
                key={t._id}
                className="bg-card glass-card p-6 rounded-2xl border border-white/5 relative group hover:border-gold/30 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 overflow-hidden shrink-0 border border-white/10">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.userName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MessageSquare size={20} className="text-white/20" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{t.userName}</h4>
                    <p className="text-xs font-black uppercase tracking-widest text-gold">{t.userRole}</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 italic leading-relaxed line-clamp-3">"{t.content}"</p>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < t.rating ? 'text-gold' : 'text-white/10'}`}>★</span>
                  ))}
                </div>
              </motion.div>
            ))}
            {testimonials.length === 0 && (
              <div className="col-span-full p-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-white/20 text-xs font-bold uppercase tracking-widest">
                No testimonials available
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
