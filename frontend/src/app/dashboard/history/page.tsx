'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Receipt,
  Utensils
} from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function HistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/orders/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [router]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(0)}`;
  };

  // Group orders by Date (Midnight rollover)
  const groupedOrders = orders.reduce((groups: any, order: any) => {
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(order);
    return groups;
  }, {});

  const toggleExpand = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  return (
    <div className="space-y-12 pb-24 max-w-[1200px] mx-auto relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Sales History</h1>
          <p className="text-gold font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Daily Revenue & Profit Ledger</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-card glass-card rounded-[2rem] p-12 text-center border border-white/5">
          <Receipt size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-white/40 font-black uppercase tracking-widest">No Sales History Yet</h3>
          <p className="text-white/20 text-xs mt-2">Orders processed in the POS Terminal will appear here.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedOrders).map(([date, dayOrders]: [string, any], groupIdx) => {
            const dailyRevenue = dayOrders.reduce((sum: number, o: any) => sum + o.totalRevenue, 0);
            const dailyProfit = dayOrders.reduce((sum: number, o: any) => sum + o.totalProfit, 0);

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIdx * 0.1 }}
                key={date} 
                className="space-y-6"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-white text-lg font-black tracking-widest uppercase">{date}</h2>
                  <div className="flex gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Revenue</p>
                      <p className="text-white font-bold">{formatCurrency(dailyRevenue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Daily Profit</p>
                      <p className="text-gold font-black flex items-center gap-1">
                        {formatCurrency(dailyProfit)} <TrendingUp size={14} />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Orders List */}
                <div className="grid grid-cols-1 gap-4">
                  {dayOrders.map((order: any, idx: number) => {
                    const time = new Date(order.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit', minute: '2-digit'
                    });
                    const isExpanded = expandedOrderId === order._id;

                    return (
                      <div key={order._id} className="bg-card glass-card rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10">
                        {/* Order Summary Row */}
                        <div 
                          onClick={() => toggleExpand(order._id)}
                          className="p-6 flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                              <Receipt size={20} />
                            </div>
                            <div>
                              <p className="text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                                <Clock size={12} className="text-gold" /> {time}
                              </p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                                {order.items.length} Items Sold
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="text-right hidden sm:block">
                              <p className="text-[9px] text-white/40 uppercase tracking-widest">Amount</p>
                              <p className="text-white font-bold">{formatCurrency(order.totalRevenue)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-gold/60 uppercase tracking-widest">Profit</p>
                              <p className="text-gold font-black">{formatCurrency(order.totalProfit)}</p>
                            </div>
                            <div className="text-white/20 group-hover:text-white transition-colors">
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>
                        </div>

                        {/* Order Details Expansion */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-white/5 bg-black/40"
                            >
                              <div className="p-6">
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Itemized Bill</h4>
                                <div className="space-y-3">
                                  {order.items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                                      <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-gold/10 text-gold rounded-lg flex items-center justify-center">
                                          <Utensils size={14} />
                                        </div>
                                        <div>
                                          <p className="text-white text-xs font-bold uppercase tracking-wider">
                                            {item.dishId?.name || 'Unknown Item'}
                                          </p>
                                          <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
                                            Qty: {item.quantity} × {formatCurrency(item.price)}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-white text-xs font-bold">
                                          {formatCurrency(item.price * item.quantity)}
                                        </p>
                                        <p className="text-[9px] text-green-500/80 uppercase tracking-widest mt-0.5">
                                          +{formatCurrency((item.price - item.ingredientPrice) * item.quantity)} Profit
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
