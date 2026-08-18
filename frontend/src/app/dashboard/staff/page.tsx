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
  MoreVertical,
  X,
  Plus,
  Mail,
  Lock,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cook',
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: 'pos', label: 'POS System' },
    { id: 'inventory', label: 'Inventory Management' },
    { id: 'orders', label: 'Order History' },
    { id: 'menu', label: 'Menu Management' },
    { id: 'reports', label: 'Reports & Analytics' }
  ];

  const roleOptions = [
    { label: 'Cook (AI & Inventory)', value: 'cook' },
    { label: 'Bill Counter (POS Only)', value: 'billing' },
    { label: 'Manager (Full Access)', value: 'manager' },
    { label: 'User (View Only)', value: 'user' }
  ];

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setStaff(data);
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/staff`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newStaff)
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewStaff({ name: '', email: '', password: '', role: 'cook', permissions: [] });
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add staff');
      }
    } catch (err) {
      alert('Error adding staff');
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    setIsUpdating(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/staff/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        setStaff(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      alert('Failed to update role.');
    } finally {
      setIsUpdating(null);
    }
  };

  const removeStaff = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/staff/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setStaff(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      alert('Failed to remove staff.');
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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <Users className="text-gold" size={32} /> STAFF MANAGEMENT
          </h2>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Manage your team and their access levels</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-gold/50 transition-all"
            />
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all transform hover:scale-105"
          >
            <Plus size={18} /> Add Staff
          </button>
        </div>
      </div>

      <div className="bg-card glass-card rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-xs uppercase font-black tracking-[0.2em] text-white/40">
                <th className="px-8 py-6">Staff Member</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Access Level</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStaff.map((member) => (
                <tr key={member._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                        <UserIcon size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{member.name || 'Anonymous'}</div>
                        <div className="text-sm text-white/30">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 w-fit">
                      {getRoleIcon(member.role)}
                      <span className="text-xs font-black uppercase tracking-widest">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 min-w-[200px]">
                    <CustomDropdown 
                      options={roleOptions}
                      value={member.role}
                      onChange={(val) => updateRole(member._id, val)}
                    />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => removeStaff(member._id)}
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                        title="Remove Staff"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStaff.length === 0 && (
          <div className="p-20 text-center text-white/10 space-y-4">
            <Users size={64} className="mx-auto opacity-20" />
            <p className="font-black uppercase tracking-widest">No staff members found</p>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-2xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase">Add New Staff</h3>
                  <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Provide access to your team</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="email"
                      required
                      placeholder="cook@restaurant.com"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Assign Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <CustomDropdown 
                  label="Role"
                  options={roleOptions}
                  value={newStaff.role}
                  onChange={(val) => setNewStaff({...newStaff, role: val})}
                />

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Page Permissions</label>
                  <div className="bg-black border border-white/10 rounded-xl p-4 grid grid-cols-2 gap-4">
                    {availablePermissions.map(perm => (
                      <label key={perm.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          newStaff.permissions.includes(perm.id) 
                            ? 'bg-gold border-gold text-black' 
                            : 'border-white/20 group-hover:border-white/50'
                        }`}>
                          {newStaff.permissions.includes(perm.id) && <CheckCircle2 size={14} />}
                        </div>
                        <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{perm.label}</span>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={newStaff.permissions.includes(perm.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewStaff({...newStaff, permissions: [...newStaff.permissions, perm.id]});
                            } else {
                              setNewStaff({...newStaff, permissions: newStaff.permissions.filter(p => p !== perm.id)});
                            }
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all mt-4"
                >
                  Create Staff Account
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
