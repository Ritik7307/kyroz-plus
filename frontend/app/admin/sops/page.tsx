'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function GlobalSopsPage() {
  const [sops, setSops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSop, setEditingSop] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Dish',
    contentEn: '',
    contentHi: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchSops();
  }, []);

  const fetchSops = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/master-sops`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSops(data);
    } catch (err) {
      console.error('Failed to fetch master sops', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingSop ? 'PUT' : 'POST';
    const url = editingSop 
      ? `${API_URL}/api/master-sops/${editingSop._id}` 
      : `${API_URL}/api/master-sops`;

    try {
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
        setEditingSop(null);
        setFormData({ title: '', category: 'Dish', contentEn: '', contentHi: '' });
        fetchSops();
      }
    } catch (err) {
      console.error('Failed to save master sop', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Global SOP?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/master-sops/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSops();
    } catch (err) {
      console.error('Failed to delete master sop', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <ChefHat className="text-gold" size={32} /> GLOBAL SOP LIBRARY
            </h1>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Manage content for all members</p>
          </div>
          <button 
            onClick={() => {
              setEditingSop(null);
              setFormData({ title: '', category: 'Dish', contentEn: '', contentHi: '' });
              setIsModalOpen(true);
            }}
            className="bg-gold text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <Plus size={20} /> ADD NEW SOP
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sops.map((sop: any) => (
            <motion.div 
              key={sop._id}
              layout
              className="bg-card glass-card p-6 rounded-2xl border border-white/5 group hover:border-gold/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                  <FileText size={24} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingSop(sop);
                      setFormData({ 
                        title: sop.title, 
                        category: sop.category, 
                        contentEn: sop.contentEn, 
                        contentHi: sop.contentHi 
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-white/20 hover:text-gold transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(sop._id)}
                    className="p-2 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{sop.title}</h3>
              <p className="text-[10px] font-black text-gold uppercase tracking-widest">{sop.category}</p>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-widest">
                <span>Last Updated</span>
                <span>{new Date(sop.updatedAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card glass-card w-full max-w-2xl rounded-[2.5rem] border border-white/10 p-10 relative z-10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-black tracking-tight mb-8">
                {editingSop ? 'EDIT GLOBAL SOP' : 'ADD NEW GLOBAL SOP'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">SOP Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. SHAHI PANEER RECIPE"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all appearance-none"
                    >
                      <option value="Dish">Dish</option>
                      <option value="Gravy">Gravy</option>
                      <option value="Process">Process</option>
                      <option value="Rules">Rules</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Content (English)</label>
                    <textarea 
                      value={formData.contentEn}
                      onChange={(e) => setFormData({...formData, contentEn: e.target.value})}
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all resize-none text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Content (Hindi)</label>
                    <textarea 
                      value={formData.contentHi}
                      onChange={(e) => setFormData({...formData, contentHi: e.target.value})}
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all resize-none text-sm font-hindi"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gold text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 mt-4"
                >
                  <Save size={20} /> SAVE GLOBAL SOP
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
