'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, Calendar, Phone, IndianRupee, Search, MessageSquare, Megaphone, ArrowRight, ImageIcon, X, Edit2, Trash2, Upload } from 'lucide-react';
import { API_URL } from '@/lib/api';
import readXlsxFile from 'read-excel-file/browser';
import Papa from 'papaparse';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  latestOrderId?: string;
  latestPaymentMethod?: string;
  latestSplitPayments?: { cash: number; online: number };
  createdAt?: string;
}

type SortType = 'recent' | 'frequent' | 'spending';
type FilterType = 'all' | 'less_than_5' | '5_to_10' | 'greater_than_10';
type TimeFilterType = 'all' | 'last_7_days' | 'this_month';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('all');
  const [userPlan, setUserPlan] = useState<string>('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [whatsappImage, setWhatsappImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 21; // 3 columns * 7 rows

  // Edit / Delete state
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // Edit Payment State
  const [editingPaymentCustomer, setEditingPaymentCustomer] = useState<Customer | null>(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState<'Cash' | 'Online' | 'Split'>('Cash');
  const [editSplitCash, setEditSplitCash] = useState<number>(0);
  const [editSplitOnline, setEditSplitOnline] = useState<number>(0);
  const [savingPayment, setSavingPayment] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);

  const isCreatedToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date();
    const date = new Date(dateStr);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

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

    if (timeFilter === 'last_7_days') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      result = result.filter(c => new Date(c.lastVisit) >= weekAgo);
    } else if (timeFilter === 'this_month') {
      const now = new Date();
      result = result.filter(c => {
        const d = new Date(c.lastVisit);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
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
  }, [customers, searchQuery, sortBy, filterBy, timeFilter]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCustomers.slice(start, start + itemsPerPage);
  }, [filteredAndSortedCustomers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);

  // Reset selections when filters change
  useEffect(() => {
    setSelectedCustomers([]);
    setCurrentPage(1);
  }, [searchQuery, filterBy, timeFilter]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setWhatsappImage(data.url);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
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
        body: JSON.stringify({ phones: selectedCustomers, message: whatsappMessage, imageUrl: whatsappImage })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Messages queued successfully!');
        setShowMessageModal(false);
        setWhatsappMessage('');
        setWhatsappImage('');
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

  const handleEditCustomer = async () => {
    if (!editingCustomer || !editName || !editPhone) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/customers/${editingCustomer._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, phone: editPhone })
      });
      if (res.ok) {
        setCustomers(customers.map(c => c._id === editingCustomer._id ? { ...c, name: editName, phone: editPhone } : c));
        setEditingCustomer(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update customer');
      }
    } catch (err) {
      alert('Error updating customer');
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/customers/${deletingCustomer._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCustomers(customers.filter(c => c._id !== deletingCustomer._id));
        setDeletingCustomer(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete customer');
      }
    } catch (err) {
      alert('Error deleting customer');
    }
  };

  const handleUpdatePayment = async () => {
    if (!editingPaymentCustomer || !editingPaymentCustomer.latestOrderId) return;
    setSavingPayment(true);
    const token = localStorage.getItem('token');
    
    let payload: any = { paymentMethod: editPaymentMethod };
    if (editPaymentMethod === 'Split') {
      payload.splitPayments = { cash: editSplitCash, online: editSplitOnline };
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/${editingPaymentCustomer.latestOrderId}/payment`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // Update local state
        setCustomers(customers.map(c => 
          c._id === editingPaymentCustomer._id 
            ? { ...c, latestPaymentMethod: editPaymentMethod, latestSplitPayments: payload.splitPayments } 
            : c
        ));
        setEditingPaymentCustomer(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update payment');
      }
    } catch (err) {
      alert('Error updating payment');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let data: any[] = [];
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = await file.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        data = result.data;
      } else {
        const rows = await readXlsxFile(file);
        if (rows.length > 1) {
          const headers = rows[0] as unknown as string[];
          data = rows.slice(1).map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = (row as any)[index];
            });
            return obj;
          });
        }
      }

      const formattedData = data.map((row: any) => ({
        name: row.Name || row.name || 'Unknown',
        phone: row.Phone || row.phone || row['Phone Number'] || ''
      })).filter(c => c.phone);

      if (formattedData.length === 0) {
        alert('No valid customer data found. Please ensure your sheet has Name and Phone columns.');
        setIsUploading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/customers/bulk`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers: formattedData })
      });

      if (res.ok) {
        const resData = await res.json();
        alert(resData.message || 'Import successful');
        const fetchRes = await fetch(`${API_URL}/api/customers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (fetchRes.ok) {
          setCustomers(await fetchRes.json());
        }
      } else {
        alert('Failed to import customers');
      }
    } catch (err) {
      alert('Error parsing or uploading file.');
    } finally {
      setIsUploading(false);
    }
    e.target.value = '';
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
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Customer Directory</h1>
          <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mt-2">Manage Relationships & Track Footfall</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <label className="bg-card shadow-sm text-foreground/80 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-foreground/10 transition-colors cursor-pointer border border-border">
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-foreground/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            Import CSV/Excel
            <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
          
          {userPlan === 'Scale' && (
            <button 
              onClick={() => router.push('/dashboard/marketing')}
              className="bg-gold text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gold/80 transition-colors shadow-lg shadow-gold/20"
            >
              <Megaphone size={18} /> Marketing Engine
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-card glass-card p-6 rounded-3xl border border-border">
        
        {/* Search & Segments */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-card shadow-sm border border-border rounded-2xl py-3 pl-12 pr-4 text-sm text-foreground placeholder-white/20 focus:outline-none focus:border-gold/50 transition-all font-bold tracking-widest uppercase"
            />
          </div>

          <div className="flex bg-card shadow-sm border border-border rounded-2xl p-1 overflow-x-auto scrollbar-hide">
            {(['all', 'less_than_5', '5_to_10', 'greater_than_10'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterBy(f)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterBy === f ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-foreground/40 hover:text-foreground hover:bg-card shadow-sm'
                }`}
              >
                {f === 'less_than_5' ? '<5 visits' : f === '5_to_10' ? '5-10 visits' : f === 'greater_than_10' ? '>10 visits' : 'All Visits'}
              </button>
            ))}
          </div>

          <div className="flex bg-card shadow-sm border border-border rounded-2xl p-1 overflow-x-auto scrollbar-hide">
            {(['all', 'last_7_days', 'this_month'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  timeFilter === t ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-foreground/40 hover:text-foreground hover:bg-card shadow-sm'
                }`}
              >
                {t === 'last_7_days' ? 'Last 7 Days' : t === 'this_month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              sortBy === 'recent' ? 'bg-foreground/10 text-foreground border border-foreground/20' : 'bg-card shadow-sm text-foreground/40 hover:text-foreground border border-transparent hover:border-border'
            }`}
          >
            <Clock size={14} /> Recent
          </button>
          <button
            onClick={() => setSortBy('frequent')}
            className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              sortBy === 'frequent' ? 'bg-foreground/10 text-foreground border border-foreground/20' : 'bg-card shadow-sm text-foreground/40 hover:text-foreground border border-transparent hover:border-border'
            }`}
          >
            <Users size={14} /> Freq. Sort
          </button>
          <button
            onClick={() => setSortBy('spending')}
            className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              sortBy === 'spending' ? 'bg-foreground/10 text-foreground border border-foreground/20' : 'bg-card shadow-sm text-foreground/40 hover:text-foreground border border-transparent hover:border-border'
            }`}
          >
            <TrendingUp size={14} /> Highest Spend
          </button>
        </div>
      </div>



      {/* WhatsApp Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-card border border-border p-1 rounded-3xl max-w-lg w-full relative overflow-hidden shadow-2xl shadow-green-500/10"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-green-500/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="bg-card rounded-[1.4rem] p-6 sm:p-8 relative z-10 border border-border">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <MessageSquare className="text-green-500" size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">WhatsApp Campaign</h2>
                  <p className="text-foreground/40 text-sm mt-1">
                    Ready to send to <strong className="text-foreground">{selectedCustomers.length}</strong> selected customer{selectedCustomers.length !== 1 && 's'}.
                  </p>
                </div>
                <button 
                  onClick={() => setShowMessageModal(false)} 
                  className="w-8 h-8 flex items-center justify-center bg-card shadow-sm hover:bg-foreground/10 rounded-full text-foreground/40 hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative bg-card border border-border group-hover:border-green-500/30 rounded-2xl p-4 transition-colors">
                  <div className="flex items-center justify-between mb-3 px-2 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                      </div>
                      <span className="text-xs text-foreground/30 font-bold uppercase tracking-widest ml-2">Message Preview</span>
                    </div>
                    
                    <label className="cursor-pointer text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1 text-xs uppercase font-bold tracking-widest">
                      {uploadingImage ? (
                        <div className="w-3 h-3 border-2 border-foreground/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ImageIcon size={14} />
                      )}
                      <span>Attach Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </div>

                  {whatsappImage && (
                    <div className="relative mb-3 group/img">
                      <img src={whatsappImage} alt="Attached" className="w-full h-32 object-cover rounded-xl border border-border" />
                      <button 
                        onClick={() => setWhatsappImage('')}
                        className="absolute top-2 right-2 bg-foreground/10 hover:bg-red-500/80 text-foreground p-1.5 rounded-lg opacity-0 group-hover/img:opacity-100 transition-all backdrop-blur-sm"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <textarea
                    value={whatsappMessage}
                    onChange={e => setWhatsappMessage(e.target.value)}
                    placeholder="Hey there! We have a special offer for you..."
                    className="w-full bg-transparent text-foreground/90 h-32 resize-none focus:outline-none placeholder:text-foreground/20 text-sm leading-relaxed"
                  />
                  <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-xs text-foreground/30">{whatsappMessage.length} / 1024 characters</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => setShowMessageModal(false)} 
                  className="px-6 py-3 text-foreground/40 hover:text-foreground font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !whatsappMessage.trim()}
                  className="relative overflow-hidden bg-green-500 text-black px-8 py-3 rounded-xl font-black hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all group shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {sendingMessage ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Campaign <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  {!sendingMessage && (
                    <div className="absolute inset-0 bg-foreground/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-card border border-border p-6 rounded-3xl max-w-sm w-full relative shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-4">Edit Customer</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1 block">Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1 block">Phone</label>
                <input 
                  type="text" 
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setEditingCustomer(null)} 
                className="px-4 py-2 text-foreground/40 hover:text-foreground font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditCustomer}
                className="bg-gold text-black px-6 py-2 rounded-xl font-bold hover:bg-gold/80 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Customer Modal */}
      {deletingCustomer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-card border border-border p-6 rounded-3xl max-w-sm w-full relative shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-2">Delete Customer?</h2>
            <p className="text-foreground/40 text-sm mb-6">Are you sure you want to delete <strong className="text-foreground">{deletingCustomer.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeletingCustomer(null)} 
                className="px-4 py-2 text-foreground/40 hover:text-foreground font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteCustomer}
                className="bg-red-500 text-foreground px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {editingPaymentCustomer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-card border border-border p-6 rounded-3xl max-w-sm w-full relative shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-4">Edit Payment Method</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1 block">Payment Method</label>
                <select 
                  value={editPaymentMethod}
                  onChange={(e) => setEditPaymentMethod(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-foreground focus:outline-none focus:border-gold appearance-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                  <option value="Split">Split</option>
                </select>
              </div>

              {editPaymentMethod === 'Split' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1 block">Cash Amt (₹)</label>
                    <input 
                      type="number" 
                      value={editSplitCash}
                      onChange={(e) => setEditSplitCash(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm font-bold text-foreground focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1 block">Online Amt (₹)</label>
                    <input 
                      type="number" 
                      value={editSplitOnline}
                      onChange={(e) => setEditSplitOnline(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm font-bold text-foreground focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setEditingPaymentCustomer(null)} 
                className="px-4 py-2 text-foreground/40 hover:text-foreground font-bold transition-colors"
                disabled={savingPayment}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdatePayment}
                disabled={savingPayment}
                className="bg-gold text-black px-6 py-2 rounded-xl font-bold hover:bg-gold/80 transition-all disabled:opacity-50"
              >
                {savingPayment ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : paginatedCustomers.length === 0 ? (
        <div className="bg-card glass-card rounded-[2rem] p-16 text-center border border-border">
          <Users size={48} className="mx-auto text-foreground/20 mb-6" />
          <h3 className="text-foreground/40 font-black text-lg uppercase tracking-widest">No Customers Found</h3>
          <p className="text-foreground/20 text-xs mt-3 font-bold uppercase tracking-widest">Process orders in the POS to build your directory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCustomers.map((customer, idx) => {
            const { date, time } = formatDateTime(customer.lastVisit);
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={customer._id}
                className="bg-card glass-card rounded-3xl p-6 border border-border hover:border-gold/30 transition-all group relative overflow-hidden"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-gold/10 transition-colors"></div>

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex gap-4 items-center">

                    <div className="w-12 h-12 bg-card shadow-sm rounded-2xl flex items-center justify-center text-gold font-black text-xl shadow-inner border border-border group-hover:scale-110 transition-transform">
                      {customer.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-foreground font-black text-sm uppercase tracking-wider">{customer.name || 'Unknown'}</h3>
                      <p className="text-xs text-foreground/60 font-bold tracking-widest flex items-center gap-1 mt-1">
                        <Phone size={10} /> {customer.phone}
                      </p>
                    </div>
                  </div>
                  
                  {isCreatedToday(customer.createdAt) && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditName(customer.name);
                          setEditPhone(customer.phone);
                          setEditingCustomer(customer);
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-card shadow-sm hover:bg-blue-500/20 text-foreground/40 hover:text-blue-400 rounded-lg transition-colors border border-transparent hover:border-blue-500/30"
                        title="Edit Customer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => setDeletingCustomer(customer)}
                        className="w-8 h-8 flex items-center justify-center bg-card shadow-sm hover:bg-red-500/20 text-foreground/40 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                        title="Delete Customer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10 border-t border-border pt-6">
                  <div>
                    <p className="text-[10px] font-black text-foreground/50 uppercase tracking-widest mb-1">Total Visits</p>
                    <p className="text-foreground font-bold text-lg">{customer.totalVisits}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gold/70 uppercase tracking-widest mb-1">Total Spent</p>
                    <p className="text-gold font-black text-lg flex items-center">
                      {formatCurrency(customer.totalSpent)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 relative z-10 border-t border-border pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-foreground/50 uppercase tracking-widest mb-1">Latest Payment</p>
                      <p className="text-foreground font-bold text-sm">
                        {customer.latestPaymentMethod === 'Split' && customer.latestSplitPayments ? (
                          `Split (₹${customer.latestSplitPayments.cash} / ₹${customer.latestSplitPayments.online})`
                        ) : (
                          customer.latestPaymentMethod || 'N/A'
                        )}
                      </p>
                    </div>
                    {customer.latestOrderId && (
                      <button 
                        onClick={() => {
                          setEditingPaymentCustomer(customer);
                          setEditPaymentMethod(customer.latestPaymentMethod as any || 'Cash');
                          if (customer.latestSplitPayments) {
                            setEditSplitCash(customer.latestSplitPayments.cash);
                            setEditSplitOnline(customer.latestSplitPayments.online);
                          } else {
                            setEditSplitCash(0);
                            setEditSplitOnline(0);
                          }
                        }}
                        className="px-3 py-1.5 bg-foreground/5 hover:bg-gold/10 text-gold hover:text-gold border border-gold/40 hover:border-gold/80 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        Edit Payment
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold uppercase tracking-widest text-foreground/60 group-hover:text-foreground/80 transition-colors relative z-10">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-gold/80" /> {date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-gold/80" /> {time}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-card border border-border rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold/50 transition-colors"
          >
            Prev Page
          </button>
          <span className="text-sm font-black text-foreground/60">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-card border border-border rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold/50 transition-colors"
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
}
