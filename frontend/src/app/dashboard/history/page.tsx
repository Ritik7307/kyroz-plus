'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Receipt,
  Utensils,
  Plus,
  X,
  Printer
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
  const [expenses, setExpenses] = useState<{name: string, amount: number}[]>([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 7;

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

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  
  const todayOrders = groupedOrders[todayStr] || [];
  
  const todayBreakdown = useMemo(() => {
    let cash = 0;
    let online = 0;
    let dineIn = 0;
    let takeaway = 0;
    let delivery = 0;
    let totalItems = 0;
    const itemCounts: Record<string, { quantity: number; revenue: number }> = {};
    const categoryCounts: Record<string, { quantity: number; revenue: number }> = {};

    todayOrders.forEach((o: any) => {
      // Payment Method
      if (o.paymentMethod?.toLowerCase() === 'cash') {
        cash += o.totalRevenue;
      } else {
        online += o.totalRevenue;
      }

      // Order Type
      if (o.orderType?.toLowerCase() === 'takeaway') {
        takeaway += o.totalRevenue;
      } else if (o.orderType?.toLowerCase() === 'delivery') {
        delivery += o.totalRevenue;
      } else {
        dineIn += o.totalRevenue;
      }

      o.items.forEach((item: any) => {
        totalItems += item.quantity;
        const name = item.dishId?.name || 'Unknown Item';
        const categoryName = item.dishId?.category || 'Uncategorized';
        
        if (!itemCounts[name]) {
          itemCounts[name] = { quantity: 0, revenue: 0 };
        }
        itemCounts[name].quantity += item.quantity;
        itemCounts[name].revenue += item.quantity * item.price;
        
        if (!categoryCounts[categoryName]) {
          categoryCounts[categoryName] = { quantity: 0, revenue: 0 };
        }
        categoryCounts[categoryName].quantity += item.quantity;
        categoryCounts[categoryName].revenue += item.quantity * item.price;
      });
    });

    const sortedItems = Object.entries(itemCounts).sort((a, b) => b[1].quantity - a[1].quantity);
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1].revenue - a[1].revenue);

    return { cash, online, dineIn, takeaway, delivery, totalItems, items: sortedItems, categories: sortedCategories };
  }, [todayOrders]);

  const sortedGroupedOrders = useMemo(() => {
    return Object.entries(groupedOrders).sort((a: any, b: any) => {
      return new Date(b[1][0].createdAt).getTime() - new Date(a[1][0].createdAt).getTime();
    });
  }, [groupedOrders]);

  const totalPages = Math.ceil(sortedGroupedOrders.length / ITEMS_PER_PAGE);
  const currentGroupedOrders = sortedGroupedOrders.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-12 pb-24 max-w-[1200px] mx-auto relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Sales Analysis</h1>
          <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mt-2">Daily, Monthly & Annual Growth Ledger</p>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && summary && (
        <div className="space-y-8">
          <div className="flex gap-4 p-1 bg-card shadow-sm rounded-2xl w-fit">
            {(['daily', 'monthly', 'yearly'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-foreground/40 hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card glass-card p-8 rounded-[2rem] border border-border space-y-4">
              <p className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">Total Revenue</p>
              <h3 className="text-3xl font-black text-foreground">{formatCurrency(summary[activeTab].revenue)}</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest">
                <TrendingUp size={14} /> Tracking Growth
              </div>
            </div>
            <div className="bg-card glass-card p-8 rounded-[2rem] border border-border space-y-4">
              <p className="text-xs font-black text-gold/60 uppercase tracking-[0.2em]">Gross Profit</p>
              <h3 className="text-3xl font-black text-gold">{formatCurrency(summary[activeTab].profit)}</h3>
              <p className="text-xs font-bold text-foreground/20 uppercase tracking-widest">Margin: {summary[activeTab].revenue > 0 ? ((summary[activeTab].profit / summary[activeTab].revenue) * 100).toFixed(1) : 0}%</p>
            </div>
            <div className="bg-card glass-card p-8 rounded-[2rem] border border-border space-y-4">
              <p className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">Order Count</p>
              <h3 className="text-3xl font-black text-foreground">{summary[activeTab].count}</h3>
              <p className="text-xs font-bold text-foreground/20 uppercase tracking-widest">Processed Transactions</p>
            </div>
          </div>

          {/* Net Profit Calculator */}
          <div className="bg-card glass-card p-6 rounded-[2rem] border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-32 h-32 bg-gold/5 rounded-full -ml-16 -mt-16 blur-3xl"></div>
             
             <div className="flex-1 space-y-4 relative z-10 w-full max-w-md">
               <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-card shadow-sm rounded-xl flex items-center justify-center text-foreground/40">
                    <Calculator size={20} />
                  </div>
                  <div>
                     <h4 className="text-foreground font-black uppercase tracking-widest text-sm">Net Profit Calculator</h4>
                     <p className="text-foreground/40 text-xs font-bold">Subtract operational spends (Rent, Staff, etc.)</p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-3">
                 <input 
                    type="text" 
                    value={expenseName} 
                    onChange={(e) => setExpenseName(e.target.value)}
                    placeholder="Expense Name (e.g. Rent)" 
                    className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold w-full sm:flex-1 placeholder:text-foreground/20"
                 />
                 <div className="flex gap-3">
                   <input 
                      type="number" 
                      value={expenseAmount} 
                      onChange={(e) => setExpenseAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Amount (₹)" 
                      className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold w-full sm:w-32 placeholder:text-foreground/20"
                   />
                   <button 
                      onClick={() => {
                        if (expenseName && expenseAmount) {
                          setExpenses([...expenses, { name: expenseName, amount: Number(expenseAmount) }]);
                          setExpenseName('');
                          setExpenseAmount('');
                        }
                      }}
                      className="bg-gold/10 hover:bg-gold text-gold hover:text-black transition-all border border-gold/20 hover:border-gold rounded-xl px-4 flex items-center justify-center shrink-0"
                   >
                     <Plus size={18} />
                   </button>
                 </div>
               </div>

               {expenses.length > 0 && (
                 <div className="space-y-2 mt-4 max-h-32 overflow-y-auto pr-2 scrollbar-hide">
                   {expenses.map((exp, idx) => (
                     <div key={idx} className="flex items-center justify-between bg-card shadow-sm px-4 py-2 rounded-lg text-xs font-bold">
                       <span className="text-foreground uppercase tracking-wider">{exp.name}</span>
                       <div className="flex items-center gap-3">
                         <span className="text-red-400">-₹{exp.amount}</span>
                         <button onClick={() => setExpenses(expenses.filter((_, i) => i !== idx))} className="text-foreground/40 hover:text-red-500">
                           <X size={14} />
                         </button>
                       </div>
                     </div>
                   ))}
                   <div className="flex justify-between border-t border-border pt-2 mt-2 text-xs font-black uppercase tracking-widest text-foreground/40 px-2">
                     <span>Total Spends</span>
                     <span className="text-red-500">-₹{expenses.reduce((sum, e) => sum + e.amount, 0)}</span>
                   </div>
                 </div>
               )}
             </div>

             <div className="bg-green-500/10 border border-green-500/20 px-8 py-6 rounded-3xl min-w-[200px] text-center w-full md:w-auto shadow-inner shadow-green-500/5 relative z-10 shrink-0">
                <p className="text-xs font-black text-green-500/60 uppercase tracking-[0.2em] mb-2">Net Profit</p>
                <p className="text-4xl font-black text-green-500 tracking-tighter">
                  {formatCurrency(summary[activeTab].profit - expenses.reduce((sum, e) => sum + e.amount, 0))}
                </p>
             </div>
          </div>

          {/* Top Selling Items & Item Analytics */}
          <div className="bg-card glass-card p-8 rounded-[2.5rem] border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-gold" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Item Analytics</h3>
              </div>
              <div className="flex bg-card shadow-sm rounded-xl overflow-hidden p-1 gap-1">
                <button 
                  onClick={() => setItemFilter('quantity')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${itemFilter === 'quantity' ? 'bg-gold text-black' : 'text-foreground/40 hover:text-foreground'}`}
                >
                  Most Sold
                </button>
                <button 
                  onClick={() => setItemFilter('revenue')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${itemFilter === 'revenue' ? 'bg-gold text-black' : 'text-foreground/40 hover:text-foreground'}`}
                >
                  High Revenue
                </button>
                <button 
                  onClick={() => setItemFilter('margin')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${itemFilter === 'margin' ? 'bg-gold text-black' : 'text-foreground/40 hover:text-foreground'}`}
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
                  return <p className="col-span-full text-center text-foreground/20 font-bold uppercase tracking-widest py-4">No data yet</p>;
                }

                return sortedItems.map((item: any, idx: number) => (
                  <div key={idx} className="bg-background p-6 rounded-2xl border border-border flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold font-black text-lg">
                      {idx + 1}
                    </div>
                    <div className="w-full">
                      <p className="font-bold text-xs text-foreground uppercase tracking-wider line-clamp-1" title={item.name}>{item.name}</p>
                      {itemFilter === 'quantity' && <p className="text-xs font-black text-gold/60 uppercase tracking-widest mt-1">{item.totalQuantity} Sold</p>}
                      {itemFilter === 'revenue' && <p className="text-xs font-black text-green-500 uppercase tracking-widest mt-1">{formatCurrency(item.totalRevenue)}</p>}
                      {itemFilter === 'margin' && <p className="text-xs font-black text-blue-400 uppercase tracking-widest mt-1">{item.profitMargin?.toFixed(1) || 0}% Margin</p>}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="pt-12 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h3 className="text-foreground/40 text-[11px] font-black tracking-[0.4em] uppercase flex items-center gap-3">
             <Receipt size={18} className="text-gold" /> Detailed Sales Ledger
          </h3>
          <button 
             onClick={() => window.print()}
             className="bg-gold text-black px-6 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold/80 transition-colors shadow-lg shadow-gold/20 print:hidden"
          >
             <Printer size={18} /> Print Daily Report
          </button>
        </div>

        {/* DAILY REPORT PRINT VIEW */}
        <div className="bg-card glass-card p-8 rounded-[2rem] border border-border mb-8 print:fixed print:inset-0 print:bg-white print:text-black print:z-[9999] print:block print:rounded-none print:overflow-visible">
          <div className="max-w-[80mm] mx-auto font-mono text-[10px] leading-tight hidden print:block">
             <div className="text-center border-b border-black/20 pb-2 mb-2">
               <h2 className="text-xl font-bold uppercase tracking-tighter print:text-black m-0 p-0 leading-none">Daily Operations Report</h2>
               <p className="font-bold print:text-black/80 mt-1 m-0 p-0 leading-tight">{todayStr}</p>
             </div>
             
             <div className="space-y-2 mb-2 border-b border-black/20 pb-2">
                 <h4 className="font-bold uppercase tracking-widest text-[11px] mb-1">Payment Methods</h4>
                 <div className="space-y-0.5">
                    <div className="flex justify-between"><span>Cash</span><span>{formatCurrency(todayBreakdown.cash)}</span></div>
                    <div className="flex justify-between"><span>Online / Card</span><span>{formatCurrency(todayBreakdown.online)}</span></div>
                    <div className="border-t border-black/20 pt-0.5 mt-0.5 flex justify-between font-bold"><span>Total</span><span>{formatCurrency(todayBreakdown.cash + todayBreakdown.online)}</span></div>
                 </div>
             </div>
             <div className="space-y-2 mb-2 border-b border-black/20 pb-2">
                 <h4 className="font-bold uppercase tracking-widest text-[11px] mb-1">Order Types</h4>
                 <div className="space-y-0.5">
                    <div className="flex justify-between"><span>Dine-in</span><span>{formatCurrency(todayBreakdown.dineIn)}</span></div>
                    <div className="flex justify-between"><span>Takeaway (Pickup)</span><span>{formatCurrency(todayBreakdown.takeaway)}</span></div>
                    <div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(todayBreakdown.delivery)}</span></div>
                 </div>
             </div>
             
             <div className="mb-2 border-b border-black/20 pb-2">
               <h4 className="font-bold uppercase tracking-widest text-[11px] mb-1">Category Wise</h4>
               <div className="space-y-0.5">
                 {todayBreakdown.categories.length === 0 && (
                   <p className="italic text-[9px]">No categories sold today yet.</p>
                 )}
                 {todayBreakdown.categories.map(([name, data]) => (
                   <div key={name} className="flex justify-between">
                     <span>{name}</span>
                     <span>{formatCurrency(data.revenue)}</span>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="mb-2 border-b border-black/20 pb-2">
               <h4 className="font-bold uppercase tracking-widest text-[11px] mb-1">Items Sold Today</h4>
               <div className="space-y-0.5">
                 {todayBreakdown.items.length === 0 && (
                   <p className="italic text-[9px]">No items sold today yet.</p>
                 )}
                 {todayBreakdown.items.map(([name, data]) => (
                   <div key={name} className="flex justify-between border-b border-black/5 pb-0.5 mb-0.5 last:border-0 last:mb-0 last:pb-0">
                     <span>{name} <span className="opacity-60 ml-1">x{data.quantity}</span></span>
                     <span>{formatCurrency(data.revenue)}</span>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="mt-2 text-center space-y-1">
                <div className="flex justify-between border-b border-black/10 pb-0.5">
                   <span className="uppercase">Total Orders</span>
                   <span className="font-bold">{todayOrders.length}</span>
                </div>
                <div className="flex justify-between border-b border-black/10 pb-0.5">
                   <span className="uppercase">Items Sold</span>
                   <span className="font-bold">{todayBreakdown.totalItems}</span>
                </div>
                <div className="flex justify-between border-black/10 font-bold text-[12px] pt-1">
                   <span className="uppercase">Net Revenue</span>
                   <span>{formatCurrency(todayBreakdown.cash + todayBreakdown.online)}</span>
                </div>
             </div>
          </div>
          
          <div className="print:hidden">
             <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 text-foreground">Daily Operations Report</h2>
             <p className="text-xs font-bold text-foreground/40 mb-8">{todayStr}</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div>
                   <h4 className="font-bold text-sm text-gold uppercase tracking-widest mb-4">Payment Methods</h4>
                   <div className="space-y-2 text-sm font-bold text-foreground">
                      <div className="flex justify-between"><span className="text-foreground/60">Cash</span><span>{formatCurrency(todayBreakdown.cash)}</span></div>
                      <div className="flex justify-between"><span className="text-foreground/60">Online / Card</span><span>{formatCurrency(todayBreakdown.online)}</span></div>
                      <div className="border-t border-border pt-2 mt-2 flex justify-between font-black"><span className="text-foreground/60">Total</span><span>{formatCurrency(todayBreakdown.cash + todayBreakdown.online)}</span></div>
                   </div>
                </div>
                <div>
                   <h4 className="font-bold text-sm text-blue-400 uppercase tracking-widest mb-4">Order Types</h4>
                   <div className="space-y-2 text-sm font-bold text-foreground">
                      <div className="flex justify-between"><span className="text-foreground/60">Dine-in</span><span>{formatCurrency(todayBreakdown.dineIn)}</span></div>
                      <div className="flex justify-between"><span className="text-foreground/60">Takeaway (Pickup)</span><span>{formatCurrency(todayBreakdown.takeaway)}</span></div>
                      <div className="flex justify-between"><span className="text-foreground/60">Delivery</span><span>{formatCurrency(todayBreakdown.delivery)}</span></div>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 border-t border-border pt-8">
               <div>
                 <h4 className="font-bold text-sm text-purple-400 uppercase tracking-widest mb-4">Category Wise</h4>
                 <div className="space-y-2 text-sm font-bold text-foreground">
                   {todayBreakdown.categories.length === 0 && (
                     <p className="text-foreground/40 italic text-xs">No categories sold today yet.</p>
                   )}
                   {todayBreakdown.categories.map(([name, data]) => (
                     <div key={name} className="flex justify-between border-b border-border pb-2">
                       <span className="text-foreground/80">{name}</span>
                       <span>{formatCurrency(data.revenue)}</span>
                     </div>
                   ))}
                 </div>
               </div>
               
               <div>
                 <h4 className="font-bold text-sm text-green-500 uppercase tracking-widest mb-4">Items Sold Today</h4>
                 <div className="space-y-2 text-sm font-bold text-foreground">
                   {todayBreakdown.items.length === 0 && (
                     <p className="text-foreground/40 italic text-xs">No items sold today yet.</p>
                   )}
                   {todayBreakdown.items.map(([name, data]) => (
                     <div key={name} className="flex justify-between border-b border-border pb-2">
                       <span className="text-foreground/80">{name} <span className="text-foreground/40 text-xs ml-2">x{data.quantity}</span></span>
                       <span>{formatCurrency(data.revenue)}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
             
             <div className="mt-8 pt-8 border-t border-border flex justify-between">
                <div className="text-center">
                   <p className="text-xs text-foreground/40 font-black uppercase tracking-widest mb-1">Total Orders</p>
                   <p className="text-xl font-black text-foreground">{todayOrders.length}</p>
                </div>
                <div className="text-center">
                   <p className="text-xs text-foreground/40 font-black uppercase tracking-widest mb-1">Items Sold</p>
                   <p className="text-xl font-black text-foreground">{todayBreakdown.totalItems}</p>
                </div>
                <div className="text-center">
                   <p className="text-xs text-green-500/80 font-black uppercase tracking-widest mb-1">Net Revenue</p>
                   <p className="text-2xl font-black text-green-500">{formatCurrency(todayBreakdown.cash + todayBreakdown.online)}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-card glass-card rounded-[2rem] p-12 text-center border border-border">
          <Receipt size={48} className="mx-auto text-foreground/20 mb-4" />
          <h3 className="text-foreground/40 font-black uppercase tracking-widest">No Sales History Yet</h3>
          <p className="text-foreground/20 text-xs mt-2">Orders processed in the POS Terminal will appear here.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {currentGroupedOrders.map(([date, dayOrders]: [string, any], groupIdx) => {
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
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="text-foreground text-lg font-black tracking-widest uppercase">{date}</h2>
                  <div className="flex gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Revenue</p>
                      <p className="text-foreground font-bold">{formatCurrency(dailyRevenue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gold/60 uppercase tracking-widest">Daily Gross Profit</p>
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
                      <div key={order._id} className="bg-card glass-card rounded-2xl border border-border overflow-hidden transition-all hover:border-border">
                        {/* Order Summary Row */}
                        <div 
                          onClick={() => toggleExpand(order._id)}
                          className="p-6 flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-card shadow-sm rounded-xl flex items-center justify-center text-foreground/40 group-hover:text-foreground transition-colors">
                              <Receipt size={20} />
                            </div>
                            <div>
                              <p className="text-foreground font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                                <Clock size={12} className="text-gold" /> {time}
                              </p>
                              <p className="text-xs text-foreground/40 uppercase tracking-widest mt-1">
                                {order.items.length} Items Sold
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="text-right hidden sm:block">
                              <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Amount</p>
                              <p className="text-foreground font-bold">{formatCurrency(order.totalRevenue)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-gold/60 uppercase tracking-widest">Gross Profit</p>
                              <p className="text-gold font-black">{formatCurrency(order.totalProfit)}</p>
                            </div>
                            <div className="text-foreground/20 group-hover:text-foreground transition-colors">
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
                              className="border-t border-border bg-background"
                            >
                              <div className="p-6 space-y-4">
                                <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest">Itemized Bill</h4>
                                <div className="space-y-3">
                                  {order.items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between bg-card shadow-sm rounded-xl p-4">
                                      <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-gold/10 text-gold rounded-lg flex items-center justify-center">
                                          <Utensils size={14} />
                                        </div>
                                        <div>
                                          <p className="text-foreground text-xs font-bold uppercase tracking-wider">
                                            {item.dishId?.name || 'Unknown Item'}
                                          </p>
                                          <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-0.5">
                                            Qty: {item.quantity} × {formatCurrency(item.price)}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-foreground text-xs font-bold">
                                          {formatCurrency(item.price * item.quantity)}
                                        </p>
                                        <p className="text-[10px] text-green-500/80 uppercase tracking-widest mt-0.5">
                                          +{formatCurrency((item.price - item.ingredientPrice) * item.quantity)} Gross Profit
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Order Metadata Summary */}
                                <div className="pt-4 border-t border-border flex flex-wrap gap-x-8 gap-y-3 text-xs text-foreground/60 font-bold uppercase tracking-wider">
                                  {order.tableNumber && (
                                    <div>
                                      <span className="text-foreground/30">Table:</span> <span className="text-gold">{order.tableNumber}</span>
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-foreground/30">Type:</span> <span className="text-foreground">{order.orderType || 'DineIn'}</span>
                                  </div>
                                  <div>
                                    <span className="text-foreground/30">Payment:</span> <span className="text-foreground">{order.paymentMethod || 'Cash'}</span>
                                  </div>
                                  {order.additionalCharge > 0 && (
                                    <div>
                                      <span className="text-foreground/30">Add. Charge:</span> <span className="text-foreground">₹{order.additionalCharge}</span>
                                    </div>
                                  )}
                                  {(order.discountValue > 0 || order.discount > 0) && (
                                    <div>
                                      <span className="text-foreground/30">Discount:</span> <span className="text-red-400">
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

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8 pb-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-card border border-border hover:border-gold disabled:opacity-50 disabled:hover:border-border text-foreground"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-foreground/60 uppercase tracking-widest">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-card border border-border hover:border-gold disabled:opacity-50 disabled:hover:border-border text-foreground"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
