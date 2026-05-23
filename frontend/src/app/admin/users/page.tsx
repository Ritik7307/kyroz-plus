'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ArrowUpRight, 
  MoreVertical,
  Shield,
  User,
  Mail,
  Store,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setError(`Failed to fetch users: ${res.status}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update role');
      }
    } catch (err) {
      console.error('Role update error:', err);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.shopName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-gold text-xs font-black uppercase tracking-[0.3em] mb-3">
            <span className="w-8 h-[1px] bg-gold"></span>
            Administration
          </div>
          <h1 className="text-4xl font-black tracking-tighter">MEMBER <span className="text-gold">MANAGEMENT</span></h1>
          <p className="text-white/40 text-sm mt-2 font-medium">Control platform access and manage user roles across the KYROZ ecosystem.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Users size={18} className="text-gold" />
            <span className="text-sm font-black tracking-widest">{users.length} TOTAL USERS</span>
          </div>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card glass-card p-6 rounded-3xl border border-white/5">
        <div className="relative w-full md:w-[400px]">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
          <input 
            type="text" 
            placeholder="Search name, email or shop..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-gold/50 transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
            <Filter size={14} /> Filter
          </button>
          <button 
            onClick={fetchUsers}
            className="px-6 py-3 bg-gold-gradient text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            Refresh List
          </button>
        </div>
      </div>

      {/* USERS TABLE */}
      {isLoading ? (
        <div className="py-40 text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold font-black uppercase text-[10px] tracking-widest">Accessing Vault...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center bg-red-500/5 rounded-3xl border border-red-500/20">
          <AlertCircle size={48} className="mx-auto text-red-500/40 mb-4" />
          <p className="text-red-400 font-bold">{error}</p>
        </div>
      ) : (
        <div className="bg-card glass-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="p-6 pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Member Details</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Establishment</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Access Level</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Account Plan</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Joining Date</th>
                  <th className="p-6 pr-10 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((u, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={u._id} 
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-6 pl-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-black">
                          {u.name?.[0].toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-gold transition-colors">{u.name}</div>
                          <div className="text-xs text-white/30 flex items-center gap-1.5 mt-0.5">
                            <Mail size={10} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-white/60 font-medium italic">
                        <Store size={14} className="text-white/20" /> {u.shopName || 'Not Specified'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <CustomDropdown 
                        options={[
                          { label: 'User (View Only)', value: 'user' },
                          { label: 'Cook (AI & Inventory)', value: 'cook' },
                          { label: 'Bill Counter (POS Only)', value: 'billing' },
                          { label: 'Manager (Full Access)', value: 'manager' },
                          { label: 'Admin (Master)', value: 'admin' }
                        ]}
                        value={u.role}
                        onChange={(val) => handleRoleChange(u._id, val)}
                      />
                    </td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                        u.subscriptionPlan === 'Elite' ? 'bg-gold/10 border-gold/30 text-gold' :
                        u.subscriptionPlan === 'Pro' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                        'bg-white/5 border-white/10 text-white/40'
                      }`}>
                        {u.subscriptionPlan || 'Basic'}
                      </span>
                    </td>
                    <td className="p-6 text-white/30 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} /> {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-6 pr-10 text-right">
                      <button className="p-2 text-white/20 hover:text-gold hover:bg-white/5 rounded-lg transition-all">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-20 text-center text-white/10 font-black uppercase tracking-[0.3em]">
                No matching members found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
