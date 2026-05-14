'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, Calendar, Phone, IndianRupee, Search } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
}

type SortType = 'recent' | 'frequent' | 'spending';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('recent');

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/customers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error('Failed to fetch customers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [router]);

  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name?.toLowerCase().includes(q) || 
        c.phone?.includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      } else if (sortBy === 'frequent') {
        return b.totalVisits - a.totalVisits;
      } else if (sortBy === 'spending') {
        return b.totalSpent - a.totalSpent;
      }
      return 0;
    });

    return result;
  }, [customers, searchQuery, sortBy]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(0)}`;
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-12 pb-24 max-w-[1200px] mx-auto relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Customer Directory</h1>
          <p className="text-gold font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Manage Relationships & Track Footfall</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-card glass-card p-6 rounded-3xl border border-white/5">
        
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-all font-bold tracking-widest uppercase"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              sortBy === 'recent' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            <Clock size={14} /> Recent Visitors
          </button>
          <button
            onClick={() => setSortBy('frequent')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              sortBy === 'frequent' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users size={14} /> Frequently Visited
          </button>
          <button
            onClick={() => setSortBy('spending')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              sortBy === 'spending' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            <TrendingUp size={14} /> Highest Spending
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredAndSortedCustomers.length === 0 ? (
        <div className="bg-card glass-card rounded-[2rem] p-16 text-center border border-white/5">
          <Users size={48} className="mx-auto text-white/20 mb-6" />
          <h3 className="text-white/40 font-black text-lg uppercase tracking-widest">No Customers Found</h3>
          <p className="text-white/20 text-xs mt-3 font-bold uppercase tracking-widest">Process orders in the POS to build your directory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCustomers.map((customer, idx) => {
            const { date, time } = formatDateTime(customer.lastVisit);
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={customer._id}
                className="bg-card glass-card rounded-3xl p-6 border border-white/5 hover:border-gold/30 transition-all group relative overflow-hidden"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-gold/10 transition-colors"></div>

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gold font-black text-xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                      {customer.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-sm uppercase tracking-wider">{customer.name || 'Unknown'}</h3>
                      <p className="text-[10px] text-white/40 font-bold tracking-widest flex items-center gap-1 mt-1">
                        <Phone size={10} /> {customer.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10 border-t border-white/5 pt-6">
                  <div>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Total Visits</p>
                    <p className="text-white font-bold text-lg">{customer.totalVisits}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gold/40 uppercase tracking-widest mb-1">Total Spent</p>
                    <p className="text-gold font-black text-lg flex items-center">
                      {formatCurrency(customer.totalSpent)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors relative z-10">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-gold/60" /> {date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-gold/60" /> {time}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
