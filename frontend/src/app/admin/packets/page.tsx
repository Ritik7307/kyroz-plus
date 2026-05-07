'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Image as ImageIcon,
  IndianRupee,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

export default function SopPacketsPage() {
  const [packets, setPackets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPacket, setEditingPacket] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'General',
    images: [] as string[]
  });
  const router = useRouter();

  useEffect(() => {
    fetchPackets();
  }, []);

  const fetchPackets = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/sop-packets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPackets(data);
    } catch (err) {
      console.error('Failed to fetch sop packets', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const token = localStorage.getItem('token');
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setIsUploading(true);
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, data.url]
        }));
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingPacket ? 'PUT' : 'POST';
    const url = editingPacket 
      ? `${API_URL}/api/sop-packets/${editingPacket._id}` 
      : `${API_URL}/api/sop-packets`;

    const payload = {
      ...formData,
      price: Number(formData.price) || 0
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingPacket(null);
        setFormData({ name: '', price: '', description: '', category: 'General', images: [] });
        fetchPackets();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || 'Failed to save packet'}`);
      }
    } catch (err) {
      console.error('Failed to save sop packet:', err);
      alert('Network error while saving packet.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SOP Packet?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/sop-packets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPackets();
    } catch (err) {
      console.error('Failed to delete sop packet', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <Package className="text-gold" size={32} /> SOP PACKETS
            </h1>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Commercial SOP Collections</p>
          </div>
          <button 
            onClick={() => {
              setEditingPacket(null);
              setFormData({ name: '', price: '', description: '', category: 'General', images: [] });
              setIsModalOpen(true);
            }}
            className="bg-gold text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <Plus size={20} /> CREATE NEW PACKET
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packets.map((packet: any) => (
            <motion.div 
              key={packet._id}
              layout
              className="bg-card glass-card rounded-2xl border border-white/5 group hover:border-gold/30 transition-all overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-white/5 relative group-hover:scale-105 transition-transform duration-500">
                {packet.images && packet.images.length > 0 ? (
                  <img src={packet.images[0]} alt={packet.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPacket(packet);
                      setFormData({ 
                        name: packet.name, 
                        price: packet.price.toString(), 
                        description: packet.description, 
                        category: packet.category,
                        images: packet.images || []
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-black/50 backdrop-blur-md text-white/50 hover:text-gold rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(packet._id);
                    }}
                    className="p-2 bg-black/50 backdrop-blur-md text-white/50 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-gold text-black px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {packet.category}
                </div>
              </div>
              
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">{packet.name}</h3>
                  <p className="text-white/40 text-xs line-clamp-2">{packet.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1 text-gold font-black">
                    <IndianRupee size={14} />
                    <span className="text-xl">{packet.price}</span>
                  </div>
                  <div className="text-[10px] text-white/20 font-bold uppercase">
                    {packet.images?.length || 0} Images
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {packets.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <Package size={48} className="mx-auto text-white/5 mb-4" />
              <p className="text-white/20 font-bold uppercase tracking-widest">No packets found. Create your first one!</p>
            </div>
          )}
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
              className="bg-card glass-card w-full max-w-2xl rounded-[2.5rem] border border-white/10 p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-black tracking-tight mb-8">
                {editingPacket ? 'EDIT SOP PACKET' : 'CREATE NEW PACKET'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Packet Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. North Indian Gravy Masterclass"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Price (INR)</label>
                    <div className="relative">
                      <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="999"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-gold/50 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <CustomDropdown 
                    label="Category"
                    options={[
                      { label: 'Bakery & Pastry', value: 'Bakery & Pastry' },
                      { label: 'Beverages', value: 'Beverages' },
                      { label: 'Continental', value: 'Continental' },
                      { label: 'Fast Food', value: 'Fast Food' },
                      { label: 'Indian Cuisine', value: 'Indian Cuisine' }
                    ]}
                    value={formData.category}
                    onChange={(val) => setFormData({...formData, category: val})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Description (Optional)</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 outline-none transition-all resize-none text-sm"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Images</label>
                  <div className="grid grid-cols-4 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl bg-white/5 relative group overflow-hidden">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-gold/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-white/5 group">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Upload size={20} className="text-white/20 group-hover:text-gold" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-gold">Upload</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gold text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 mt-4"
                >
                  <Save size={20} /> SAVE PACKET
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
