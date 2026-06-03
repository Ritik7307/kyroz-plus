'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, Calendar, Phone, IndianRupee, Search, MessageSquare, Megaphone } from 'lucide-react';
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
type FilterType = 'all' | 'less_than_5' | '5_to_10' | 'greater_than_10';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [userPlan, setUserPlan] = useState<string>('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          let plan = user.plan || user.subscriptionPlan || 'Starter';
          if (plan === 'Basic') plan = 'Starter';
          if (plan === 'Pro') plan = 'Growth';
          if (plan === 'Elite') plan = 'Scale';
          if (user.role === 'admin') plan = 'Scale'; // Admin gets scale features
          setUserPlan(plan);
        }

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

    if (filterBy === 'less_than_5') {
      result = result.filter(c => c.totalVisits < 5);
    } else if (filterBy === '5_to_10') {
      result = result.filter(c => c.totalVisits >= 5 && c.totalVisits <= 10);
    } else if (filterBy === 'greater_than_10') {
      result = result.filter(c => c.totalVisits > 10);
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
  }, [customers, searchQuery, sortBy, filterBy]);

  // Reset selections when filters change
  useEffect(() => {
    setSelectedCustomers([]);
  }, [searchQuery, filterBy]);

  const canUseWhatsapp = userPlan === 'Scale';

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCustomers(filteredAndSortedCustomers.map(c => c.phone));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (phone: string) => {
    setSelectedCustomers(prev => 
      prev.includes(phone) ? prev.filter(p => p !== phone) : [...prev, phone]
    );
  };

  const handleSendMessage = async () => {
    if (selectedCustomers.length === 0 || !whatsappMessage.trim()) return;
    
    setSendingMessage(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/marketing/send-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phones: selectedCustomers, message: whatsappMessage })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Messages queued successfully!');
        setShowMessageModal(false);
        setWhatsappMessage('');
        setSelectedCustomers([]);
      } else {
        alert(data.error || 'Failed to send messages');
      }
    } catch (err) {
      alert('Error sending messages');
    } finally {
      setSendingMessage(false);
    }
  };

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
        <button 
          onClick={() => router.push('/dashboard/marketing')}
          className="bg-gold text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gold/80 transition-colors shadow-lg shadow-gold/20"
        >
          <Megaphone size={18} /> Marketing Engine
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-card glass-card p-6 rounded-3xl border border-white/5">
        
        {/* Search & Segments */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-all font-bold tracking-widest uppercase"
            />
          </div>

          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 overflow-x-auto scrollbar-hide">
            {(['all', 'less_than_5', '5_to_10', 'greater_than_10'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterBy(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterBy === f ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {f === 'less_than_5' ? '<5 visits' : f === '5_to_10' ? '5-10 visits' : f === 'greater_than_10' ? '>10 visits' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              sortBy === 'recent' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 text-white/40 hover:text-white border border-transparent hover:border-white/10'
            }`}
          >
            <Clock size={14} /> Recent
          </button>
          <button
            onClick={() => setSortBy('frequent')}
            className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              sortBy === 'frequent' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 text-white/40 hover:text-white border border-transparent hover:border-white/10'
            }`}
          >
            <Users size={14} /> Freq. Sort
          </button>
          <button
            onClick={() => setSortBy('spending')}
            className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              sortBy === 'spending' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 text-white/40 hover:text-white border border-transparent hover:border-white/10'
            }`}
          >
            <TrendingUp size={14} /> Highest Spend
          </button>
        </div>
      </div>

      {canUseWhatsapp && (
        <div className="flex justify-between items-center bg-card glass-card p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white/60 hover:text-white uppercase tracking-widest">
              <input 
                type="checkbox" 
                checked={filteredAndSortedCustomers.length > 0 && selectedCustomers.length === filteredAndSortedCustomers.length}
                onChange={handleSelectAll}
                className="accent-gold w-4 h-4 rounded"
              />
              Select All Filtered
            </label>
            <span className="text-[10px] text-gold font-black uppercase tracking-widest bg-gold/10 px-2 py-1 rounded">
              {selectedCustomers.length} Selected
            </span>
          </div>
          <button 
            onClick={() => setShowMessageModal(true)}
            disabled={selectedCustomers.length === 0}
            className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              selectedCustomers.length > 0 
                ? 'bg-green-500 hover:bg-green-400 text-black' 
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
            }`}
          >
            <MessageSquare size={16} /> Send WhatsApp
          </button>
        </div>
      )}

      {/* WhatsApp Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-lg w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <MessageSquare className="text-green-500" /> Send WhatsApp Campaign
              </h2>
              <button onClick={() => setShowMessageModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="mb-4 text-sm text-white/60">
              Sending to <strong className="text-white">{selectedCustomers.length}</strong> selected customers.
            </div>
            <textarea
              value={whatsappMessage}
              onChange={e => setWhatsappMessage(e.target.value)}
              placeholder="Type your promotional message here..."
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white h-32 resize-none mb-6 focus:outline-none focus:border-green-500 transition-colors"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-white/40 hover:text-white font-bold">Cancel</button>
              <button 
                onClick={handleSendMessage}
                disabled={sendingMessage || !whatsappMessage.trim()}
                className="bg-green-500 text-black px-6 py-2 rounded-xl font-bold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

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
                    {canUseWhatsapp && (
                      <input 
                        type="checkbox" 
                        checked={selectedCustomers.includes(customer.phone)}
                        onChange={() => handleSelectCustomer(customer.phone)}
                        className="accent-gold w-5 h-5 rounded cursor-pointer self-center mr-2"
                      />
                    )}
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
