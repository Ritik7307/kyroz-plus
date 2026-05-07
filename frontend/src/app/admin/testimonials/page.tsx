'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Star,
  User as UserIcon,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [formData, setFormData] = useState({
    userName: '',
    userRole: '',
    content: '',
    rating: 5,
    avatarUrl: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/testimonials`);
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to fetch testimonials', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingTestimonial ? 'PUT' : 'POST';
    const url = editingTestimonial 
      ? `${API_URL}/api/testimonials/${editingTestimonial._id}` 
      : `${API_URL}/api/testimonials`;

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
        setEditingTestimonial(null);
        setFormData({ userName: '', userRole: '', content: '', rating: 5, avatarUrl: '' });
        fetchTestimonials();
      }
    } catch (err) {
      console.error('Failed to save testimonial', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to delete testimonial', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <MessageSquare className="text-gold" size={32} /> TESTIMONIALS
            </h1>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Manage platform social proof</p>
          </div>
          <button 
            onClick={() => {
              setEditingTestimonial(null);
              setFormData({ userName: '', userRole: '', content: '', rating: 5, avatarUrl: '' });
              setIsModalOpen(true);
            }}
            className="bg-gold text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <Plus size={20} /> ADD TESTIMONIAL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t: any) => (
            <motion.div 
              key={t._id}
              layout
              className="bg-card glass-card p-8 rounded-3xl border border-white/5 relative group"
            >
              <div className="absolute top-6 right-6 flex gap-2">
                <button 
                  onClick={() => {
                    setEditingTestimonial(t);
                    setFormData({ 
                      userName: t.userName, 
                      userRole: t.userRole, 
                      content: t.content, 
                      rating: t.rating,
                      avatarUrl: t.avatarUrl || ''
                    });
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-white/20 hover:text-gold transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(t._id)}
                  className="p-2 text-white/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <Quote className="text-gold/20 mb-4" size={40} />
              
              <p className="text-lg text-white/80 italic mb-8 leading-relaxed">"{t.content}"</p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.userName} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={24} className="text-white/20" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.userName}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gold">{t.userRole}</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < t.rating ? "text-gold fill-gold" : "text-white/10"} 
                    />
                  ))}
                </div>
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
              className="bg-card glass-card w-full max-w-xl rounded-[2.5rem] border border-white/10 p-10 relative z-10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-black tracking-tight mb-8">
                {editingTestimonial ? 'EDIT TESTIMONIAL' : 'ADD TESTIMONIAL'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">User Name</label>
                    <input 
                      type="text" 
                      value={formData.userName}
                      onChange={(e) => setFormData({...formData, userName: e.target.value})}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">User Role</label>
                    <input 
                      type="text" 
                      value={formData.userRole}
                      onChange={(e) => setFormData({...formData, userRole: e.target.value})}
                      placeholder="e.g. Restaurant Owner"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Testimonial Content</label>
                  <textarea 
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all resize-none text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Rating (1-5)</label>
                    <div className="flex gap-4 items-center h-[50px]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({...formData, rating: star})}
                          className={`transition-all ${formData.rating >= star ? 'text-gold' : 'text-white/10'}`}
                        >
                          <Star size={24} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Avatar URL (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gold text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 mt-4"
                >
                  <Save size={20} /> SAVE TESTIMONIAL
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
