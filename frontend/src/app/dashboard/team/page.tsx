'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Trash2, 
  Mail, 
  Lock, 
  CheckCircle2, 
  XCircle,
  ChefHat,
  Monitor,
  Calculator,
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  Megaphone,
  Utensils
} from 'lucide-react';
import { API_URL } from '@/lib/api';

type StaffMember = {
  _id: string;
  name: string;
  email: string;
  role: 'manager' | 'cook' | 'billing';
  permissions: string[];
};

const MODULES = [
  { id: 'dashboard', name: 'Main Dashboard', icon: LayoutDashboard },
  { id: 'pos', name: 'POS Terminal', icon: Monitor },
  { id: 'kot', name: 'KOT Display', icon: ClipboardList },
  { id: 'customers', name: 'Customers', icon: Users },
  { id: 'packets', name: 'SOP Packets', icon: Utensils },
  { id: 'marketing', name: 'Marketing CRM', icon: Megaphone },
  { id: 'history', name: 'Sales History', icon: TrendingUp },
  { id: 'ai', name: 'Chef Assistant', icon: MessageSquare },
  { id: 'sop', name: 'SOP Library', icon: ChefHat },
  { id: 'inventory', name: 'Inventory Management', icon: Calculator },
  { id: 'costing', name: 'Costing Master', icon: Settings },
  { id: 'wastage', name: 'Wastage Master', icon: Trash2 },
];

export default function TeamManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager' as any,
    permissions: [] as string[]
  });

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
      setStaff(data);
    } catch (err) {
      console.error('Failed to fetch staff');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePermission = (modId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(modId)
        ? prev.permissions.filter(p => p !== modId)
        : [...prev.permissions, modId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingStaff 
        ? `${API_URL}/api/user/staff/${editingStaff._id}`
        : `${API_URL}/api/user/staff`;
      
      const method = editingStaff ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingStaff(null);
        setFormData({ name: '', email: '', password: '', role: 'manager', permissions: [] });
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save staff');
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/user/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchStaff();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const openEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setFormData({
      name: s.name,
      email: s.email,
      password: '', // Don't show password
      role: s.role,
      permissions: s.permissions || []
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Team Management</h1>
          <p className="text-gold/60 font-bold text-xs uppercase tracking-[0.3em]">
            Manage your 3 Enterprise Slots (Manager, Cook, Biller)
          </p>
        </div>
        
        {staff.length < 3 && (
          <button 
            onClick={() => {
              setEditingStaff(null);
              setFormData({ name: '', email: '', password: '', role: 'manager', permissions: [] });
              setIsModalOpen(true);
            }}
            className="px-8 py-4 bg-gold-gradient text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-gold/20"
          >
            <UserPlus size={18} />
            Add New Member
          </button>
        )}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[0, 1, 2].map((idx) => {
          const member = staff[idx];
          return (
            <div key={idx} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative h-[400px] bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col transition-all group-hover:border-gold/20">
                {member ? (
                  <>
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center text-black font-black text-2xl shadow-xl">
                        {member.name[0]}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-black uppercase tracking-widest rounded-full border border-gold/20">
                          {member.role}
                        </span>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => openEdit(member)} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"><Settings size={16}/></button>
                          <button onClick={() => handleDelete(member._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-white/40 text-xs font-medium">{member.email}</p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                      <p className="text-xs font-black uppercase tracking-widest text-gold/40 mb-4">Module Access</p>
                      <div className="flex flex-wrap gap-2">
                        {member.permissions?.map(p => {
                          const mod = MODULES.find(m => m.id === p);
                          return mod ? (
                            <div key={p} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                              <mod.icon size={10} className="text-gold" />
                              <span className="text-[10px] font-bold text-white/60 uppercase">{mod.name}</span>
                            </div>
                          ) : null;
                        })}
                        {(!member.permissions || member.permissions.length === 0) && (
                          <p className="text-xs text-white/20 italic">No modules assigned</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl group-hover:border-gold/10 transition-all">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                      <Users size={24} />
                    </div>
                    <p className="text-xs font-black text-white/20 uppercase tracking-widest">Available Slot</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Slots', val: '3', color: 'gold' },
          { label: 'Active Staff', val: staff.length, color: 'white' },
          { label: 'Unused Slots', val: 3 - staff.length, color: 'white/40' },
          { label: 'Status', val: 'Active', color: 'green-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{s.label}</p>
            <p className={`text-2xl font-black text-${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                      {editingStaff ? 'Edit Staff Member' : 'Add New Member'}
                    </h2>
                    <p className="text-gold/40 text-xs font-black uppercase tracking-widest mt-1">Configure Enterprise Access</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white transition-all"><XCircle size={24}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold/50 outline-none transition-all"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold/50 outline-none transition-all"
                          placeholder="rahul@restaurant.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Login Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input 
                          type="password" 
                          required={!editingStaff}
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold/50 outline-none transition-all"
                          placeholder={editingStaff ? "Leave blank to keep same" : "••••••••"}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Enterprise Role</label>
                      <select 
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value as any})}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-gold/50 outline-none transition-all appearance-none"
                      >
                        <option value="manager">Kitchen Manager</option>
                        <option value="cook">Professional Cook</option>
                        <option value="billing">Biller / POS Operator</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Module Access Permissions</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {MODULES.map(mod => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => handleTogglePermission(mod.id)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                            formData.permissions.includes(mod.id)
                            ? 'bg-gold/10 border-gold/50 text-gold shadow-lg shadow-gold/5'
                            : 'bg-black/20 border-white/5 text-white hover:border-white/10'
                          }`}
                        >
                          <mod.icon size={16} />
                          <span className="text-xs font-black uppercase tracking-tight">{mod.name}</span>
                          {formData.permissions.includes(mod.id) && <CheckCircle2 size={12} className="ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-5 bg-gold-gradient text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-gold/20"
                    >
                      {editingStaff ? 'Save Changes' : 'Create Access Slot'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
