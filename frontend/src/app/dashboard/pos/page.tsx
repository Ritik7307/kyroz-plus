'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  CheckCircle,
  Search,
  ChevronRight,
  Utensils,
  Settings,
  X,
  Edit,
  Save,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

interface Dish {
  _id: string;
  name: string;
  price: number;
  ingredientPrice: number;
  category: string;
  imageUrl?: string;
}

export default function POSTerminal() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<{ dish: Dish, quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Management Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', price: '', ingredientPrice: '', category: 'Main Course', imageUrl: '' });
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDishes();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUserRole(data.role);
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };

  const fetchDishes = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/dishes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDishes(data);
    } catch (err) {
      console.error('Failed to fetch dishes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        if (editingDish) {
          setEditingDish({ ...editingDish, imageUrl: data.url });
        } else {
          setNewDish({ ...newDish, imageUrl: data.url });
        }
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddDish = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/dishes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          ...newDish, 
          price: Number(newDish.price), 
          ingredientPrice: Number(newDish.ingredientPrice) 
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewDish({ name: '', price: '', ingredientPrice: '', category: 'Main Course', imageUrl: '' });
        fetchDishes();
      }
    } catch (err) {
      console.error('Failed to add dish', err);
    }
  };

  const handleUpdateDish = async () => {
    if (!editingDish) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/dishes/${editingDish._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...editingDish,
          price: Number(editingDish.price),
          ingredientPrice: Number(editingDish.ingredientPrice)
        })
      });
      if (res.ok) {
        setEditingDish(null);
        fetchDishes();
      }
    } catch (err) {
      console.error('Failed to update dish', err);
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/dishes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchDishes();
    } catch (err) {
      console.error('Failed to delete dish', err);
    }
  };

  const addToCart = (dish: Dish) => {
    if (isManagementMode) return;
    setCart(prev => {
      const existing = prev.find(item => item.dish._id === dish._id);
      if (existing) {
        return prev.map(item => item.dish._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.dish._id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getItemQuantity = (id: string) => {
    const item = cart.find(i => i.dish._id === id);
    return item ? item.quantity : 0;
  };

  const total = cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
  const categories = ['All', ...Array.from(new Set(dishes.map(d => d.category)))];

  const filteredDishes = dishes.filter(d => 
    (activeCategory === 'All' || d.category === activeCategory) &&
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isManager = ['admin', 'manager', 'user'].includes(userRole);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-120px)] overflow-hidden relative">
      
      {/* MENU SECTION */}
      <div className="lg:col-span-8 flex flex-col space-y-6 overflow-hidden">
        <div className="bg-card glass-card p-6 rounded-[2rem] border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Utensils className="text-gold" /> {isManagementMode ? 'MANAGE SHOP ITEMS' : 'DISH MENU'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-48 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input 
                  type="text" 
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                />
              </div>
              {isManager && (
                <button 
                  onClick={() => setIsManagementMode(!isManagementMode)}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                    isManagementMode 
                      ? 'bg-gold text-black border-gold' 
                      : 'bg-white/5 text-white/40 border-white/10 hover:border-gold/50'
                  }`}
                >
                  <Settings size={18} /> {isManagementMode ? 'Exit Management' : 'Manage Shop'}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    activeCategory === cat 
                      ? 'bg-gold text-black border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                      : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {isManagementMode && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="ml-4 px-6 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              >
                <Plus size={16} /> Add Item
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 gap-4 scrollbar-hide">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/20 gap-4">
              <Loader2 className="animate-spin" size={48} />
              <p className="font-black uppercase tracking-widest text-sm">Loading Menu...</p>
            </div>
          ) : filteredDishes.map(dish => {
            const quantity = getItemQuantity(dish._id);
            return (
              <motion.div
                layout
                key={dish._id}
                className={`bg-card glass-card rounded-3xl border transition-all flex flex-col overflow-hidden h-[300px] ${
                  isManagementMode ? 'border-white/10' : 'border-white/5 hover:border-gold/30'
                }`}
              >
                <div className="h-32 relative overflow-hidden bg-white/5">
                  {dish.imageUrl ? (
                    <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    {isManagementMode && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setEditingDish(dish); }} className="p-2 bg-black/60 rounded-lg text-white hover:text-gold transition-colors backdrop-blur-md border border-white/10"><Edit size={12}/></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteDish(dish._id); }} className="p-2 bg-black/60 rounded-lg text-white hover:text-red-500 transition-colors backdrop-blur-md border border-white/10"><Trash2 size={12}/></button>
                      </>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black text-gold uppercase tracking-widest">
                    {dish.category}
                  </div>
                </div>
                
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-base leading-tight line-clamp-2">{dish.name}</h3>
                    {isManagementMode && (
                      <p className="text-[9px] text-white/40 mt-1 uppercase tracking-wider font-bold">Cost: ₹{dish.ingredientPrice}</p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-black">₹{dish.price}</span>
                    
                    {!isManagementMode && (
                      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        {quantity > 0 ? (
                          <>
                            <button 
                              onClick={() => updateQuantity(dish._id, -1)}
                              className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-black min-w-[20px] text-center">{quantity}</span>
                            <button 
                              onClick={() => addToCart(dish)}
                              className="w-7 h-7 bg-gold/10 rounded-lg flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => addToCart(dish)}
                            className="px-4 py-1.5 bg-gold/10 text-gold rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CART / BILLING SECTION */}
      <div className="lg:col-span-4 bg-card glass-card rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-black flex items-center gap-3">
            <ShoppingCart className="text-gold" /> CURRENT ORDER
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div
                key={item.dish._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.dish.name}</h4>
                  <p className="text-[10px] text-white/40">₹{item.dish.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3 bg-black/40 rounded-xl p-1 px-2 border border-white/5">
                  <button onClick={() => updateQuantity(item.dish._id, -1)} className="text-white/40 hover:text-white transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.dish._id, 1)} className="text-gold hover:text-gold/80 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="ml-4 font-black text-sm w-16 text-right">
                  ₹{item.dish.price * item.quantity}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-4 py-20">
              <Utensils size={64} />
              <p className="font-black uppercase tracking-[0.2em] text-sm text-center">Cart is empty<br/><span className="text-[10px] font-bold">Select items to begin</span></p>
            </div>
          )}
        </div>

        <div className="p-8 bg-black/40 border-t border-white/5 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Subtotal</span>
              <span className="font-bold text-white">₹{total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Tax (GST 5%)</span>
              <span className="font-bold text-white">₹{Math.round(total * 0.05)}</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-lg font-black uppercase tracking-tighter">Grand Total</span>
              <span className="text-4xl font-black text-gold">₹{Math.round(total * 1.05)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setCart([])}
              className="py-4 rounded-2xl border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Clear
            </button>
            <button 
              disabled={cart.length === 0}
              className="py-4 rounded-2xl bg-gold text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
            >
              <CheckCircle size={16} /> Checkout
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {(showAddModal || editingDish) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddModal(false); setEditingDish(null); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                {editingDish ? <Edit className="text-gold" /> : <Plus className="text-gold" />}
                {editingDish ? 'Update Shop Item' : 'Add New Shop Item'}
              </h3>
              
              <div className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 bg-black/40 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-gold/30 hover:bg-gold/5 transition-all group relative overflow-hidden"
                >
                  {(editingDish?.imageUrl || newDish.imageUrl) ? (
                    <>
                      <img src={editingDish ? editingDish.imageUrl : newDish.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Upload size={32} />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-2">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-gold transition-colors">
                        {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black text-white uppercase tracking-widest">Click to upload image</p>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                      </div>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden" 
                  accept="image/*"
                />

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Item Name</label>
                  <input 
                    type="text" 
                    value={editingDish ? editingDish.name : newDish.name}
                    onChange={(e) => editingDish ? setEditingDish({...editingDish, name: e.target.value}) : setNewDish({...newDish, name: e.target.value})}
                    placeholder="e.g. Premium Shahi Paneer"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Ingredient Price (Cost)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="number" 
                        value={editingDish ? editingDish.ingredientPrice : newDish.ingredientPrice}
                        onChange={(e) => editingDish ? setEditingDish({...editingDish, ingredientPrice: Number(e.target.value)}) : setNewDish({...newDish, ingredientPrice: e.target.value})}
                        placeholder="0"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-10 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Selling Price (Total)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={16} />
                      <input 
                        type="number" 
                        value={editingDish ? editingDish.price : newDish.price}
                        onChange={(e) => editingDish ? setEditingDish({...editingDish, price: Number(e.target.value)}) : setNewDish({...newDish, price: e.target.value})}
                        placeholder="0"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-10 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/50 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Category</label>
                  <select 
                    value={editingDish ? editingDish.category : newDish.category}
                    onChange={(e) => editingDish ? setEditingDish({...editingDish, category: e.target.value}) : setNewDish({...newDish, category: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold/50 appearance-none"
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Starters">Starters</option>
                    <option value="Breads">Breads</option>
                    <option value="Rice">Rice</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => { setShowAddModal(false); setEditingDish(null); }}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={editingDish ? handleUpdateDish : handleAddDish}
                    className="flex-1 py-4 rounded-2xl bg-gold text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> {editingDish ? 'Save Changes' : 'Add to Shop'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
