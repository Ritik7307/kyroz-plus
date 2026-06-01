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
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [itemFilter, setItemFilter] = useState<'quantity' | 'revenue' | 'margin'>('quantity');

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [historyRes, summaryRes] = await Promise.all([
          fetch(`${API_URL}/api/orders/history`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/orders/summary`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (historyRes.ok) {
          const data = await historyRes.json();
          setOrders(data);
        }

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          setSummary(summaryData);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
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
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Sales Analysis</h1>
          <p className="text-gold font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Daily, Monthly & Annual Growth Ledger</p>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && summary && (
        <div className="space-y-8">
          <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit">
            {(['daily', 'monthly', 'yearly'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/40 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 space-y-4">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Total Revenue</p>
              <h3 className="text-3xl font-black text-white">{formatCurrency(summary[activeTab].revenue)}</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                <TrendingUp size={14} /> Tracking Growth
              </div>
            </div>
            <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 space-y-4">
              <p className="text-[10px] font-black text-gold/60 uppercase tracking-[0.2em]">Gross Profit</p>
              <h3 className="text-3xl font-black text-gold">{formatCurrency(summary[activeTab].profit)}</h3>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Margin: {summary[activeTab].revenue > 0 ? ((summary[activeTab].profit / summary[activeTab].revenue) * 100).toFixed(1) : 0}%</p>
            </div>
            <div className="bg-card glass-card p-8 rounded-[2rem] border border-white/5 space-y-4">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Order Count</p>
              <h3 className="text-3xl font-black text-white">{summary[activeTab].count}</h3>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Processed Transactions</p>
            </div>
          </div>

          {/* Top Selling Items & Item Analytics */}
          <div className="bg-card glass-card p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-gold" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Item Analytics</h3>
              </div>
              <div className="flex bg-white/5 rounded-xl overflow-hidden p-1 gap-1">
                <button 
                  onClick={() => setItemFilter('quantity')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${itemFilter === 'quantity' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Most Sold
                </button>
                <button 
                  onClick={() => setItemFilter('revenue')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${itemFilter === 'revenue' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
                >
                  High Revenue
                </button>
                <button 
                  onClick={() => setItemFilter('margin')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${itemFilter === 'margin' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
                >
                  High Margin
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {(() => {
                const items = summary.itemAnalytics || summary.topItems || []; // Support fallback if backend hasn't restarted
                const sortedItems = [...items].sort((a, b) => {
                  if (itemFilter === 'quantity') return (b.totalQuantity || 0) - (a.totalQuantity || 0);
                  if (itemFilter === 'revenue') return (b.totalRevenue || 0) - (a.totalRevenue || 0);
                  if (itemFilter === 'margin') return (b.profitMargin || 0) - (a.profitMargin || 0);
                  return 0;
                }).slice(0, 5);

                if (sortedItems.length === 0) {
                  return <p className="col-span-full text-center text-white/20 font-bold uppercase tracking-widest py-4">No data yet</p>;
                }

                return sortedItems.map((item: any, idx: number) => (
                  <div key={idx} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold font-black text-lg">
                      {idx + 1}
                    </div>
                    <div className="w-full">
                      <p className="font-bold text-xs text-white uppercase tracking-wider line-clamp-1" title={item.name}>{item.name}</p>
                      {itemFilter === 'quantity' && <p className="text-[10px] font-black text-gold/60 uppercase tracking-widest mt-1">{item.totalQuantity} Sold</p>}
                      {itemFilter === 'revenue' && <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mt-1">{formatCurrency(item.totalRevenue)}</p>}
                      {itemFilter === 'margin' && <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">{item.profitMargin?.toFixed(1) || 0}% Margin</p>}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="pt-12 border-t border-white/5">
        <h3 className="text-white/40 text-[11px] font-black tracking-[0.4em] uppercase mb-8 flex items-center gap-3">
           <Receipt size={18} className="text-gold" /> Detailed Sales Ledger
        </h3>
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
                      <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Daily Gross Profit</p>
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
                              <p className="text-[9px] text-gold/60 uppercase tracking-widest">Gross Profit</p>
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
                              <div className="p-6 space-y-4">
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Itemized Bill</h4>
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
                                          +{formatCurrency((item.price - item.ingredientPrice) * item.quantity)} Gross Profit
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Order Metadata Summary */}
                                <div className="pt-4 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-3 text-[10px] text-white/60 font-bold uppercase tracking-wider">
                                  {order.tableNumber && (
                                    <div>
                                      <span className="text-white/30">Table:</span> <span className="text-gold">{order.tableNumber}</span>
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-white/30">Type:</span> <span className="text-white">{order.orderType || 'DineIn'}</span>
                                  </div>
                                  <div>
                                    <span className="text-white/30">Payment:</span> <span className="text-white">{order.paymentMethod || 'Cash'}</span>
                                  </div>
                                  {order.additionalCharge > 0 && (
                                    <div>
                                      <span className="text-white/30">Add. Charge:</span> <span className="text-white">₹{order.additionalCharge}</span>
                                    </div>
                                  )}
                                  {(order.discountValue > 0 || order.discount > 0) && (
                                    <div>
                                      <span className="text-white/30">Discount:</span> <span className="text-red-400">
                                        {order.discountType === 'flat' ? '₹' : ''}
                                        {order.discountValue || order.discount}
                                        {(!order.discountType || order.discountType === 'percentage') ? '%' : ''}
                                      </span>
                                    </div>
                                  )}
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
