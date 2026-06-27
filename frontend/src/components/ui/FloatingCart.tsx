'use client';

import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function FloatingCart() {
  const { cart, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const itemsList = cart.map(item => `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
    const message = `Hello Admin, 👨‍🍳\n\nI would like to purchase the following SOP Packets:\n\n*ORDER DETAILS:*\n${itemsList}\n\n*Total Amount: ₹${totalPrice}*\n\nPlease process this request. Thank you!\n\n_Sent via Kyyroz-Plus_`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=917887009800&text=${encodedMessage}`, '_blank');
    
    clearCart();
    setIsOpen(false);
  };

  if (totalItems === 0) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 z-[80] w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-2xl text-black"
      >
        <ShoppingCart size={24} />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">
          {totalItems}
        </span>
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full max-w-md bg-[#111] h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-3">
                  <ShoppingCart className="text-gold" /> YOUR CART
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.category}</p>
                      <p className="text-gold font-bold mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/10">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-white/40 hover:text-white"><Minus size={12} /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-gold hover:text-gold/80"><Plus size={12} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-red-500/60 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-black/40 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black uppercase tracking-widest text-white/40">Total Amount</span>
                  <span className="text-3xl font-black text-gold">₹{totalPrice}</span>
                </div>
                <button onClick={handleCheckout} className="w-full py-4 bg-gold-gradient text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                  CHECKOUT NOW <ArrowRight size={18} />
                </button>
                <p className="text-[9px] text-white/20 text-center uppercase tracking-widest font-black">Secure Payment via KYROZ Pay</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
