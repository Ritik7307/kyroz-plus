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
  Upload,
  MessageCircle,
  Share2
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
          price: Number(newDish.price) || 0, 
          ingredientPrice: Number(newDish.ingredientPrice) || 0 
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
          price: Number(editingDish.price) || 0,
          ingredientPrice: Number(editingDish.ingredientPrice) || 0
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

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/orders/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            dishId: item.dish._id,
            quantity: item.quantity
          }))
        })
      });
      
      if (res.ok) {
        alert('Order processed successfully! Inventory updated.');
        setCart([]);
      } else {
        alert('Failed to process order.');
      }
    } catch (err) {
      console.error('Checkout error', err);
    }
  };

  const shareOrderOnWhatsApp = () => {
    if (cart.length === 0) return;
    const itemsList = cart.map(item => `• ${item.dish.name} (x${item.quantity}) - ₹${item.dish.price * item.quantity}`).join('\n');
    const grandTotal = Math.round(total * 1.05);
    const message = `Hello Admin, 👨‍🍳\n\nI would like to place/confirm this order:\n\n*ORDER DETAILS:*\n${itemsList}\n\n*Grand Total (inc. Tax): ₹${grandTotal}*\n\nPlease process this order. Thank you!\n\n_Sent via Kyyroz-Plus_`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/917307255940?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] overflow-hidden">
      
      {/* MENU SECTION */}
      <div className="lg:col-span-8 flex flex-col min-h-0">
        <div className="bg-card glass-card p-6 rounded-[2rem] border border-white/5 space-y-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Utensils className="text-gold" /> {isManagementMode ? 'SHOP MANAGER' : 'DISH MENU'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-48 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold/50"
                />
              </div>
              {isManager && (
                <button 
                  onClick={() => setIsManagementMode(!isManagementMode)}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                    isManagementMode ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                  }`}
                >
                  <Settings size={18} /> {isManagementMode ? 'Exit' : 'Manage'}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 overflow-hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    activeCategory === cat ? 'bg-gold text-black border-gold' : 'bg-white/10 text-white/70 border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {isManagementMode && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={16} /> Add
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 gap-4 custom-scrollbar">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/20 gap-4">
              <Loader2 className="animate-spin" size={48} />
              <p className="font-black uppercase tracking-widest text-sm">Loading Menu...</p>
            </div>
          ) : filteredDishes.map(dish => {
            const quantity = getItemQuantity(dish._id);
            return (
              <motion.div
                key={dish._id}
                className={`bg-card glass-card rounded-3xl border transition-all flex flex-col overflow-hidden h-[280px] ${
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
                  {isManagementMode && (
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button onClick={() => setEditingDish(dish)} className="p-2 bg-black/60 rounded-lg text-white hover:text-gold border border-white/10"><Edit size={12}/></button>
                      <button onClick={() => handleDeleteDish(dish._id)} className="p-2 bg-black/60 rounded-lg text-white hover:text-red-500 border border-white/10"><Trash2 size={12}/></button>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col justify-between flex-1">
                  <h3 className="font-bold text-sm leading-tight line-clamp-2">{dish.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">₹{dish.price}</span>
                    {!isManagementMode && (
                      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        {quantity > 0 ? (
                          <>
                            <button onClick={() => updateQuantity(dish._id, -1)} className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-white/60"><Minus size={12} /></button>
                            <span className="text-xs font-black min-w-[16px] text-center">{quantity}</span>
                            <button onClick={() => addToCart(dish)} className="w-6 h-6 bg-gold/10 rounded-lg flex items-center justify-center text-gold"><Plus size={12} /></button>
                          </>
                        ) : (
                          <button onClick={() => addToCart(dish)} className="px-3 py-1 bg-gold/10 text-gold rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black">Add</button>
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

      {/* CART SECTION - FIXED & SCROLLABLE */}
      <div className="lg:col-span-4 bg-card glass-card rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden max-h-full">
        <div className="p-6 border-b border-white/5 shrink-0">
          <h2 className="text-xl font-black flex items-center gap-3">
            <ShoppingCart className="text-gold" /> ORDER SUMMARY
          </h2>
        </div>

        {/* This is the part that now scrolls correctly */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 custom-scrollbar">
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
                  <h4 className="font-bold text-xs">{item.dish.name}</h4>
                  <p className="text-[10px] text-white/40">₹{item.dish.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2 bg-black/40 rounded-xl p-1 border border-white/5">
                  <button onClick={() => updateQuantity(item.dish._id, -1)} className="text-white/40 hover:text-white"><Minus size={12} /></button>
                  <span className="text-xs font-bold min-w-[16px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.dish._id, 1)} className="text-gold hover:text-gold/80"><Plus size={12} /></button>
                </div>
                <div className="ml-3 font-black text-xs w-14 text-right">₹{item.dish.price * item.quantity}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white/5 space-y-4 py-10">
              <Utensils size={48} />
              <p className="font-black uppercase tracking-widest text-[10px]">Select items to begin bill</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-black/40 border-t border-white/5 space-y-6 shrink-0">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/40 uppercase font-black tracking-widest">Subtotal</span>
              <span className="font-bold text-white">₹{total}</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-sm font-black uppercase tracking-widest">Total Amount</span>
              <span className="text-3xl font-black text-gold">₹{Math.round(total * 1.05)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setCart([])}
                className="py-3.5 rounded-xl border border-red-500/20 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/5 transition-all"
              >
                Clear
              </button>
              <button 
                onClick={shareOrderOnWhatsApp}
                disabled={cart.length === 0}
                className="py-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-[10px] uppercase tracking-widest hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} /> WhatsApp
              </button>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-4 rounded-xl bg-gold text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              Confirm Checkout
            </button>
          </div>
        </div>
      </div>

      {/* MODALS (Simplified for clarity) */}
      <AnimatePresence>
        {(showAddModal || editingDish) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase tracking-tighter">{editingDish ? 'Edit Item' : 'New Item'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingDish(null); }}><X /></button>
              </div>
              <div className="space-y-4">
                <input type="text" value={editingDish ? editingDish.name : newDish.name} onChange={(e) => editingDish ? setEditingDish({...editingDish, name: e.target.value}) : setNewDish({...newDish, name: e.target.value})} placeholder="Item Name" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" value={editingDish ? editingDish.price : newDish.price} onChange={(e) => editingDish ? setEditingDish({...editingDish, price: Number(e.target.value)}) : setNewDish({...newDish, price: e.target.value})} placeholder="Price" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" />
                  <input type="number" value={editingDish ? editingDish.ingredientPrice : newDish.ingredientPrice} onChange={(e) => editingDish ? setEditingDish({...editingDish, ingredientPrice: Number(e.target.value)}) : setNewDish({...newDish, ingredientPrice: e.target.value})} placeholder="Cost" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" />
                </div>
                <button onClick={editingDish ? handleUpdateDish : handleAddDish} className="w-full py-4 bg-gold text-black font-black uppercase rounded-xl">{editingDish ? 'Save Changes' : 'Add Item'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
