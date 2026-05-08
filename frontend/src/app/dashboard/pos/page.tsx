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
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userQrCode, setUserQrCode] = useState<string | null>(null);
  const [userShopName, setUserShopName] = useState<string>('KYROZ POS');
  const [userGstRate, setUserGstRate] = useState<number>(5);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Customer & Payment State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState<string>(''); // Changed to string for better decimal handling
  const [applyGst, setApplyGst] = useState(true); // GST Toggle
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Cash');

  // Management Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', price: '', ingredientPrice: '', category: 'Main Course', imageUrl: '' });
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDishes();
    fetchUser();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('pos_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('pos_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data);
      setUserRole(data.role);
      if (data.paymentQrCode) setUserQrCode(data.paymentQrCode);
      if (data.shopName) setUserShopName(data.shopName);
      if (data.gstPercentage !== undefined) setUserGstRate(data.gstPercentage);
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
    setCheckoutSuccess(false); // Reset success if new items added
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.dish._id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
    setCheckoutSuccess(false); // Reset success if quantity changed
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

    if (paymentMethod === 'Online' && userQrCode && !showQrModal) {
      setShowQrModal(true);
      return;
    }

    setIsProcessingCheckout(true);
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
          })),
          customerName,
          customerPhone,
          discount: parseFloat(discount) || 0,
          paymentMethod
        })
      });
      
      if (res.ok) {
        setShowQrModal(false);
        // Trigger printing
        setTimeout(() => {
          window.print();
          setIsProcessingCheckout(false);
          setCheckoutSuccess(true);
        }, 300);
      } else {
        alert('Failed to process order.');
        setIsProcessingCheckout(false);
      }
    } catch (err) {
      console.error('Checkout error', err);
      setIsProcessingCheckout(false);
    }
  };

  const shareOrderOnWhatsApp = () => {
    if (cart.length === 0) return;
    const itemsList = cart.map(item => `• ${item.dish.name} (x${item.quantity}) - ₹${item.dish.price * item.quantity}`).join('\n');
    const parsedDiscount = parseFloat(discount) || 0;
    const discountedTotal = total * (1 - parsedDiscount / 100);
    const gstAmount = applyGst ? discountedTotal * (userGstRate / 100) : 0;
    const grandTotal = Math.round(discountedTotal + gstAmount);
    
    const message = `Hello Admin, 👨‍🍳\n\nI would like to place/confirm this order:\n\n*ORDER DETAILS:*\n${itemsList}\n\n*Subtotal: ₹${total}*\n${parsedDiscount > 0 ? `*Discount: ${parsedDiscount}%*\n` : ''}${applyGst ? `*GST (${userGstRate}%): ₹${gstAmount.toFixed(2)}*\n` : ''}*Grand Total: ₹${grandTotal}*\n\nPlease process this order. Thank you!\n\n_Sent via Kyyroz-Plus_`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/917307255940?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="h-full relative">
      <style jsx global>{`
        @media print {
          /* Hide EVERYTHING in the body using visibility */
          body {
            visibility: hidden !important;
            background: white !important;
          }
          
          /* Show ONLY the receipt container and its children */
          .receipt-container {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: block !important;
            background: white !important;
            color: black !important;
          }
          
          .receipt-container * {
            visibility: visible !important;
            color: black !important;
            background: transparent !important;
          }
          
          /* Force hide specific heavy UI elements that might cause spacing issues */
          .no-print, header, footer, nav, aside, button, .glass-card {
            display: none !important;
          }

          /* Table fixes for thermal printers */
          .receipt-container table {
            display: table !important;
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .receipt-container tr { display: table-row !important; }
          .receipt-container td, .receipt-container th { 
            display: table-cell !important;
            padding: 4px !important;
          }
        }
      `}</style>
      
      {/* PRINT RECEIPT - MOVED TO TOP FOR BETTER SELECTIVITY */}
      <div className="receipt-container hidden print:block">
        <div className="max-w-[80mm] mx-auto font-mono text-xs text-black p-6 bg-white">
          {/* Header section - All Centered like screenshot */}
          <div className="text-center mb-6 space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight">{userShopName}</h1>
            <p className="text-[10px] font-bold">Receipt / Bill</p>
            <p className="text-[10px]">{new Date().toLocaleString()}</p>
            
            {/* Customer Details - Centered as well for clean look */}
            {(customerName || customerPhone) && (
              <div className="pt-2 border-t border-black/10 mt-2">
                {customerName && <p className="font-black uppercase tracking-tighter text-[11px]">{customerName}</p>}
                {customerPhone && <p className="text-[10px]">{customerPhone}</p>}
              </div>
            )}
          </div>

          <div className="border-t-2 border-b-2 border-black py-2 mb-4">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-left border-b border-black">
                  <th className="pb-1 font-black">Item</th>
                  <th className="pb-1 text-center font-black">Qty</th>
                  <th className="pb-1 text-right font-black">Amt</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} className="border-b border-black/5 last:border-0">
                    <td className="py-2 pr-2 leading-tight">{item.dish.name}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right font-bold">₹{item.dish.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5 mb-6">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold uppercase tracking-widest">Subtotal:</span>
              <span className="font-bold">₹{total}</span>
            </div>
            {applyGst && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold uppercase tracking-widest">Taxes ({userGstRate}%):</span>
                <span className="font-bold">₹{Math.round(total * (userGstRate / 100))}</span>
              </div>
            )}
            {parseFloat(discount) > 0 && (
              <div className="flex justify-between items-center text-[11px] text-red-600">
                <span className="font-bold uppercase tracking-widest">Discount ({discount}%):</span>
                <span className="font-bold">-₹{Math.round(total * (parseFloat(discount) / 100))}</span>
              </div>
            )}
            <div className="border-t border-black pt-2 mt-2">
              <div className="flex justify-between items-center text-lg font-black tracking-tight">
                <span>TOTAL:</span>
                <span>₹{Math.round((total * (1 - (parseFloat(discount) || 0) / 100)) * (applyGst ? (1 + userGstRate / 100) : 1))}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-black pt-4 mb-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Payment Method: {paymentMethod}</p>
          </div>

          {userQrCode && (
            <div className="flex flex-col items-center mb-8">
              <p className="text-[8px] uppercase tracking-widest mb-3 font-bold opacity-60">Scan to Pay Online</p>
              <div className="border-4 border-black p-2 rounded-2xl">
                <img src={userQrCode} alt="QR Code" className="w-32 h-32" />
              </div>
            </div>
          )}

          <div className="text-center text-[10px] space-y-1 opacity-60 font-bold">
            <p className="uppercase tracking-widest">Thank you for visiting!</p>
            <p className="uppercase tracking-[0.3em] text-[8px]">Powered by KYROZ</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 no-print">
        {/* Floating Cart Button (All Devices) */}
        <div className="fixed bottom-6 right-6 z-[60]">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] text-black relative hover:scale-110 active:scale-95 transition-all group"
          >
          <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col min-h-0">
        <div className="bg-card glass-card p-4 md:p-6 rounded-[2rem] border border-white/5 space-y-4 md:space-y-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-black flex items-center gap-3">
              <Utensils className="text-gold" /> {isManagementMode ? 'SHOP MANAGER' : 'DISH MENU'}
            </h2>
            <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-gold/50"
                />
              </div>
              {isManager && (
                <button 
                  onClick={() => setIsManagementMode(!isManagementMode)}
                  className={`p-2.5 md:p-3 rounded-xl border transition-all flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest shrink-0 ${
                    isManagementMode ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                  }`}
                >
                  <Settings size={16} /> {isManagementMode ? 'Exit' : 'Manage'}
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
    </div>

      {/* CART OVERLAY - Slide from Right for all devices */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full max-w-md bg-card glass-card h-full border-l border-white/10 flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 shrink-0 flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-3">
                  <ShoppingCart className="text-gold" /> ORDER SUMMARY
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
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
          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">Customer Name</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">Phone No.</label>
              <input 
                type="tel" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="9999999999"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40 uppercase font-black tracking-widest">Subtotal</span>
              <span className="font-bold text-white">₹{total}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Discount (%)</span>
              <input 
                type="text" 
                value={discount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    setDiscount(val);
                  }
                }}
                placeholder="0"
                className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-right text-gold font-bold focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Apply GST ({userGstRate}%)</span>
              <button 
                onClick={() => setApplyGst(!applyGst)}
                className={`w-12 h-6 rounded-full transition-all relative ${applyGst ? 'bg-gold' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${applyGst ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPaymentMethod('Cash')}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  paymentMethod === 'Cash' ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                }`}
              >
                Cash
              </button>
              <button 
                onClick={() => setPaymentMethod('Online')}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  paymentMethod === 'Online' ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                }`}
              >
                Online
              </button>
            </div>

            <div className="flex justify-between items-end pt-2 border-t border-white/5">
              <span className="text-sm font-black uppercase tracking-widest">Grand Total</span>
              <div className="text-right">
                {parseFloat(discount) > 0 && (
                  <p className="text-[10px] text-red-500 font-bold line-through mb-1">₹{Math.round(total * (applyGst ? (1 + userGstRate / 100) : 1))}</p>
                )}
                <span className="text-3xl font-black text-gold">
                  ₹{Math.round((total * (1 - (parseFloat(discount) || 0) / 100)) * (applyGst ? (1 + userGstRate / 100) : 1))}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setCart([]);
                  setCustomerName('');
                  setCustomerPhone('');
                  setDiscount('');
                  setApplyGst(true);
                  setPaymentMethod('Cash');
                  setCheckoutSuccess(false);
                }}
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
            {userQrCode && (
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">Shop Payment QR</p>
                <img src={userQrCode} alt="Payment QR" className="w-24 h-24 object-contain rounded-lg" />
              </div>
            )}

            {checkoutSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center gap-3 mb-4"
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Order Processed Successfully</p>
                  <p className="text-[9px] text-green-500/60 font-bold">Receipt printed & data saved.</p>
                </div>
              </motion.div>
            )}

            <button 
              onClick={checkoutSuccess ? () => {
                setCart([]);
                setCustomerName('');
                setCustomerPhone('');
                setDiscount('');
                setApplyGst(true);
                setPaymentMethod('Cash');
                setCheckoutSuccess(false);
                setIsCartOpen(false);
              } : handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 ${
                checkoutSuccess 
                ? 'bg-white/10 text-white border border-white/10 hover:bg-white/20 mb-3' 
                : 'bg-gold text-black hover:scale-[1.02] active:scale-95'
              }`}
            >
              {checkoutSuccess ? 'Start New Order' : 'Confirm Checkout'}
            </button>

            {checkoutSuccess && (
              <button 
                onClick={() => setCheckoutSuccess(false)}
                className="w-full py-3 rounded-xl border border-white/5 text-white/40 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
              >
                Add More Items / Edit
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

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

      {/* QR PAYMENT MODAL */}
      <AnimatePresence>
        {showQrModal && userQrCode && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm flex flex-col items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Scan to Pay</h3>
              <p className="text-sm text-white/60 mb-6 text-center">Amount Due: <span className="text-gold font-black text-xl">₹{Math.round((total * (1 - (parseFloat(discount) || 0) / 100)) * (applyGst ? (1 + userGstRate / 100) : 1))}</span></p>
              
              <div className="bg-white p-4 rounded-3xl mb-8 w-64 h-64 flex items-center justify-center">
                <img src={userQrCode} alt="Payment QR" className="w-full h-full object-contain" />
              </div>

              <div className="flex w-full gap-4">
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 py-4 bg-white/5 text-white font-black uppercase rounded-xl border border-white/10 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout}
                  className="flex-[2] py-4 bg-green-500 text-white font-black uppercase rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingCheckout ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                  Payment Received
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
