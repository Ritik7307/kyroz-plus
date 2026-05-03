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
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [adminName, setAdminName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      try {
        // Verify Admin Status
        const meRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const meData = await meRes.json();
        if (meData.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        setAdminName(meData.name);

        // Fetch Admin Data
        const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStats(await statsRes.json());

        const usersRes = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUsers(await usersRes.json());
      } catch (err) {
        console.error('Admin fetch error:', err);
      }
    };
    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* HEADER */}
      <header className="border-b border-border h-20 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-gradient rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <ShieldCheck size={24} className="text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            KYROZ <span className="text-gold font-light uppercase text-sm ml-2 tracking-[0.3em]">Admin Central</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-white/60">Welcome, {adminName} (SuperAdmin)</span>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-bold">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-8 space-y-8">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Members', value: stats?.memberCount || 0, icon: Users, color: 'text-blue-400' },
            { label: 'Platform Revenue', value: `₹${stats?.revenue?.toLocaleString() || 0}`, icon: IndianRupee, color: 'text-green-400' },
            { label: 'Global SOPs', value: '42', icon: FileText, color: 'text-gold' },
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
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Real-time</span>
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
                  <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <th className="p-4 pl-6 font-bold">User</th>
                    <th className="p-4 font-bold">Shop Name</th>
                    <th className="p-4 font-bold">Plan</th>
                    <th className="p-4 font-bold">Joined</th>
                    <th className="p-4 pr-6 text-right font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.map((u: any, idx) => (
                    <tr key={idx} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="font-bold">{u.name}</div>
                        <div className="text-xs text-white/30">{u.email}</div>
                      </td>
                      <td className="p-4 text-white/60">{u.shopName || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
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
          </div>

          {/* ADMIN ACTIONS SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Upload size={20} className="text-gold" /> Global Controls
              </h3>
              
              <div className="space-y-4">
                <button className="w-full bg-gold-gradient p-6 rounded-2xl text-black font-bold flex flex-col items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl group">
                  <Upload size={32} />
                  <div className="text-center">
                    <span className="block text-sm uppercase tracking-widest">Upload Global SOP</span>
                    <span className="text-[10px] opacity-60">PDF/DOCX support</span>
                  </div>
                </button>

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
      </main>
    </div>
  );
}
