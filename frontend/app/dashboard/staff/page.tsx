'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  ChefHat, 
  CreditCard, 
  Search,
  Save,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '@/lib/api';

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      // For now, Managers can see all users to manage their staff
      // In a real multi-tenant app, we would filter by shopId/companyId
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    setIsUpdating(userId);
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
        setStaff(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        alert('Role updated successfully!');
      }
    } catch (err) {
      alert('Failed to update role.');
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredStaff = staff.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'manager': return <Shield size={16} className="text-blue-400" />;
      case 'cook': return <ChefHat size={16} className="text-gold" />;
      case 'billing': return <CreditCard size={16} className="text-green-400" />;
      default: return <Users size={16} className="text-white/40" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <Users className="text-gold" size={32} /> STAFF MANAGEMENT
          </h2>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Assign roles and manage team access</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card glass-card border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>
      </div>

      <div className="bg-card glass-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase font-black tracking-[0.2em] text-white/40">
              <th className="px-8 py-6">Staff Member</th>
              <th className="px-8 py-6">Current Role</th>
              <th className="px-8 py-6">Change Permissions</th>
              <th className="px-8 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredStaff.map((member) => (
              <tr key={member._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="font-bold text-lg">{member.name || 'Anonymous'}</div>
                  <div className="text-sm text-white/30">{member.email}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 w-fit">
                    {getRoleIcon(member.role)}
                    <span className="text-xs font-black uppercase tracking-widest">{member.role}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <select 
                    value={member.role}
                    onChange={(e) => updateRole(member._id, e.target.value)}
                    disabled={isUpdating === member._id}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-gold/50 disabled:opacity-50"
                  >
                    <option value="user">User (View Only)</option>
                    <option value="cook">Cook (AI & Inventory)</option>
                    <option value="billing">Bill Counter (POS Only)</option>
                    <option value="manager">Manager (Full Access)</option>
                  </select>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-white/20 hover:text-white">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredStaff.length === 0 && (
          <div className="p-20 text-center text-white/10 space-y-4">
            <Users size={64} className="mx-auto" />
            <p className="font-black uppercase tracking-widest">No staff members found</p>
          </div>
        )}
      </div>
    </div>
  );
}
