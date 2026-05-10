'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Package, CreditCard, ShieldAlert, Info, CheckCircle2, Trash2 } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'inventory' | 'subscription' | 'admin' | 'system';
  isRead: boolean;
  createdAt: string;
}

export default function NotificationPanel({ isOpen, setIsOpen, onRefresh }: { isOpen: boolean, setIsOpen: (o: boolean) => void, onRefresh?: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const clearAll = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/notifications/clear-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to clear all', err);
    }
  };

  const getIcon = (category: string, type: string) => {
    switch (category) {
      case 'inventory': return <Package className="text-orange-400" size={18} />;
      case 'subscription': return <CreditCard className="text-blue-400" size={18} />;
      case 'admin': return <ShieldAlert className="text-gold" size={18} />;
      default:
        if (type === 'success') return <CheckCircle2 className="text-green-400" size={18} />;
        return <Info className="text-white/40" size={18} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l border-white/10 z-[160] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <Bell size={20} />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest">Notifications</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                <X size={20} className="text-white/40" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {isLoading ? (
                <div className="h-40 flex items-center justify-center text-white/20 text-xs uppercase tracking-widest animate-pulse">
                  Syncing Alerts...
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n._id}
                    onClick={() => !n.isRead && markAsRead(n._id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      n.isRead ? 'bg-white/2 border-white/5 opacity-60' : 'bg-white/5 border-white/10 hover:border-gold/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center bg-white/5`}>
                        {getIcon(n.category, n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-bold truncate ${n.isRead ? 'text-white/60' : 'text-white'}`}>{n.title}</p>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-gold shrink-0" />}
                        </div>
                        <p className="text-xs text-white/40 mt-1 leading-relaxed">{n.message}</p>
                        <p className="text-[9px] text-white/20 mt-3 font-bold uppercase tracking-tighter">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-20">
                  <Bell size={48} />
                  <p className="text-sm font-bold uppercase tracking-widest">Inbox is Clean</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20">
              <button 
                onClick={clearAll}
                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-gold transition-all"
              >
                Clear All Notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
