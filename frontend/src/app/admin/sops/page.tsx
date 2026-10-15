'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  FileText,
  Tags,
  Check,
  FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

export default function GlobalSopsPage() {
  const [sops, setSops] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSop, setEditingSop] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([
    'South Indian',
    'Cafe',
    'Biryani',
    'Mandi',
    'Chinese',
    'Indian Veg Curry',
    'Indian Non-Veg Curry',
    'Tandoor',
    'Preparation',
    'Discipline'
  ]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [isSavingCategories, setIsSavingCategories] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Indian Veg Curry',
    contentEn: '',
    contentHi: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchSops();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/settings/sop_categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          if (!formData.category || formData.category === 'Dish') {
            setFormData(prev => ({ ...prev, category: data[0] }));
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const saveCategoriesToBackend = async (updatedList: string[]) => {
    setIsSavingCategories(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/admin/settings/sop_categories`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value: updatedList })
      });
      if (res.ok) {
        setCategories(updatedList);
      } else {
        alert('Failed to save categories to server');
      }
    } catch (err) {
      console.error('Failed to update categories', err);
      alert('Error updating categories');
    } finally {
      setIsSavingCategories(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      alert('This category already exists!');
      return;
    }
    const updated = [...categories, trimmed];
    await saveCategoriesToBackend(updated);
    setNewCategoryName('');
  };

  const handleEditCategory = async (index: number) => {
    const trimmed = editingCategoryName.trim();
    if (!trimmed) return;
    const oldName = categories[index];
    if (oldName === trimmed) {
      setEditingCategoryIndex(null);
      return;
    }
    const updated = [...categories];
    updated[index] = trimmed;
    await saveCategoriesToBackend(updated);

    // If current form has this category, update it
    if (formData.category === oldName) {
      setFormData(prev => ({ ...prev, category: trimmed }));
    }
    setEditingCategoryIndex(null);
    setEditingCategoryName('');
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    if (!confirm(`Are you sure you want to remove category "${catToDelete}"?`)) return;
    const updated = categories.filter(c => c !== catToDelete);
    await saveCategoriesToBackend(updated);
    if (formData.category === catToDelete && updated.length > 0) {
      setFormData(prev => ({ ...prev, category: updated[0] }));
    }
  };

  const fetchSops = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/master-sops`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSops(Array.isArray(data) ? data : []);
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
        setFormData({ title: '', category: categories[0] || 'Indian Veg Curry', contentEn: '', contentHi: '' });
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
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter flex items-center gap-3">
              <ChefHat className="text-gold" size={32} /> GLOBAL SOP LIBRARY
            </h1>
            <p className="text-foreground/40 text-xs sm:text-sm font-bold uppercase tracking-widest mt-1">Manage content for all members</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex-1 sm:flex-none border border-gold/40 text-gold hover:bg-gold/10 px-4 sm:px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs sm:text-sm uppercase tracking-wider"
            >
              <Tags size={18} /> Manage Categories
            </button>
            <button 
              onClick={() => {
                setEditingSop(null);
                setFormData({ title: '', category: categories[0] || 'Indian Veg Curry', contentEn: '', contentHi: '' });
                setIsModalOpen(true);
              }}
              className="flex-1 sm:flex-none bg-gold text-black px-5 sm:px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] text-xs sm:text-sm"
            >
              <Plus size={18} /> ADD NEW SOP
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sops.map((sop: any) => (
            <motion.div 
              key={sop._id}
              layout
              className="bg-card glass-card p-6 rounded-2xl border border-foreground/5 group hover:border-gold/30 transition-all"
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
                    className="p-2 text-foreground/20 hover:text-gold transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(sop._id)}
                    className="p-2 text-foreground/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{sop.title}</h3>
              <p className="text-xs font-black text-gold uppercase tracking-widest">{sop.category}</p>
              <div className="mt-4 pt-4 border-t border-foreground/5 flex justify-between items-center text-xs text-foreground/40 font-bold uppercase tracking-widest">
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
              className="absolute inset-0 bg-background/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card glass-card w-full max-w-2xl rounded-[2.5rem] border border-foreground/10 p-10 relative z-10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-foreground/20 hover:text-foreground">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-black tracking-tight mb-8">
                {editingSop ? 'EDIT GLOBAL SOP' : 'ADD NEW GLOBAL SOP'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40">SOP Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. SHAHI PANEER RECIPE"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <CustomDropdown 
                      label="Category"
                      options={categories.map(cat => ({ label: cat, value: cat }))}
                      value={formData.category}
                      onChange={(val) => setFormData({...formData, category: val})}
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-xs text-gold/80 hover:text-gold flex items-center gap-1.5 font-bold uppercase tracking-wider py-2"
                    >
                      <Plus size={14} /> Add or Edit Categories
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Content (English)</label>
                    <textarea 
                      value={formData.contentEn}
                      onChange={(e) => setFormData({...formData, contentEn: e.target.value})}
                      rows={6}
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all resize-none text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Content (Hindi)</label>
                    <textarea 
                      value={formData.contentHi}
                      onChange={(e) => setFormData({...formData, contentHi: e.target.value})}
                      rows={6}
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all resize-none text-sm font-hindi"
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

      {/* Category Management Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card glass-card w-full max-w-lg rounded-3xl border border-foreground/10 p-6 sm:p-8 relative z-10 shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                    <Tags size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Manage Categories</h3>
                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider">Add, rename or delete categories</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCategoryModalOpen(false)} 
                  className="p-1.5 text-foreground/40 hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Add New Category Input */}
              <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Continental, Bakery..."
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-2.5 text-sm focus:border-gold/50 outline-none transition-all"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSavingCategories || !newCategoryName.trim()}
                  className="bg-gold text-black font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Plus size={16} /> Add
                </button>
              </form>

              {/* Categories List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {categories.map((cat, idx) => (
                  <div 
                    key={cat}
                    className="flex items-center justify-between p-3 rounded-xl bg-foreground/5 border border-foreground/5 hover:border-gold/20 transition-all group"
                  >
                    {editingCategoryIndex === idx ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <input 
                          type="text" 
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-1 bg-background border border-gold/40 rounded-lg px-3 py-1.5 text-sm outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditCategory(idx);
                            if (e.key === 'Escape') setEditingCategoryIndex(null);
                          }}
                        />
                        <button 
                          onClick={() => handleEditCategory(idx)}
                          className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingCategoryIndex(null)}
                          className="p-1.5 text-foreground/40 hover:bg-foreground/10 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-sm text-foreground/90">{cat}</span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingCategoryIndex(idx);
                              setEditingCategoryName(cat);
                            }}
                            className="p-1.5 text-foreground/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1.5 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-foreground/10 flex justify-end">
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
