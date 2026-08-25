'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { 
  Users, Crown, Repeat, UserMinus, Sparkles, TrendingUp,
  Settings, Lock, MessageSquare, ArrowRight, Save, CheckCircle2, XCircle, BarChart3, Smartphone, ImageIcon, X, Info
} from 'lucide-react';
import { ToastContainer, Toast, GlobalSearch } from '@/components/dashboard/GlobalSearch';
import ConnectWhatsAppButton from '@/components/marketing/ConnectWhatsAppButton';
import GuidedWhatsAppSetup from '@/components/marketing/GuidedWhatsAppSetup';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MarketingCRM() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isElite, setIsElite] = useState(false);
  const [crmData, setCrmData] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [whatsappImage, setWhatsappImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Settings Form State
  const [formData, setFormData] = useState({
    vipThreshold: 5000,
    highSpendingThreshold: 1000,
  });
  
  // WhatsApp State
  const [waStatus, setWaStatus] = useState<any>(null);
  const [waAnalytics, setWaAnalytics] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [waPhoneNumberId, setWaPhoneNumberId] = useState('');
  const [waAccessToken, setWaAccessToken] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState('');
  const [activePreview, setActivePreview] = useState('Order Confirmation');
  const [showGuidedSetup, setShowGuidedSetup] = useState(false);
  
  const [automationSettings, setAutomationSettings] = useState({
    orderConfirmation: false,
    paymentConfirmation: false,
    orderReady: false,
    deliveryUpdates: false,
    reservationConfirmation: false,
    reservationReminder: false,
    reservationCancellation: false,
    feedbackRequests: false,
    loyaltyReward: false,
    birthdayWishes: false,
    vipOffers: false,
    promotionalBroadcasts: false,
    festivalOffers: false,
    weekendDiscounts: false,
    newMenuLaunch: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        router.push('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      if (user.plan !== 'Scale' && user.role !== 'admin') {
        setIsElite(false);
        setLoading(false);
        return;
      }
      
      setIsElite(true);
      
      try {
        // Fetch Marketing Settings
        const settingsRes = await fetch(`${API_URL}/api/marketing/settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (settingsRes.ok) {
          const s = await settingsRes.json();
          setSettings(s);
          setFormData({
            vipThreshold: s.vipThreshold || 5000,
            highSpendingThreshold: s.highSpendingThreshold || 1000,
          });
        }
        
        // Fetch WhatsApp Status
        const waRes = await fetch(`${API_URL}/api/whatsapp/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (waRes.ok) {
          const data = await waRes.json();
          setWaStatus(data.settings);
          setWaAnalytics(data.analytics);
          if (data.settings?.automationSettings) {
            setAutomationSettings(data.settings.automationSettings);
          }
        }
        
        // Fetch CRM Data
        const crmRes = await fetch(`${API_URL}/api/marketing/crm`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (crmRes.ok) {
          setCrmData(await crmRes.json());
        }
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleSaveSettings = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/marketing/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      
      await fetch(`${API_URL}/api/whatsapp/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ automationSettings })
      });
      
      setShowSettings(false);
      
      const crmRes = await fetch(`${API_URL}/api/marketing/crm`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (crmRes.ok) setCrmData(await crmRes.json());
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    }
  };

  const handleConnectWhatsApp = async () => {
    if (!waPhoneNumberId || !waAccessToken) {
      alert('Please enter both Phone Number ID and Access Token');
      return;
    }
    setIsConnecting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/whatsapp/connect`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumberId: waPhoneNumberId, accessToken: waAccessToken })
      });
      const data = await res.json();
      if (res.ok) {
        setWaStatus(data.settings);
        setWaPhoneNumberId('');
        setWaAccessToken('');
      } else {
        alert(data.error || 'Failed to connect');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    if(!confirm('Are you sure you want to disconnect WhatsApp Business?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/whatsapp/disconnect`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setWaStatus({ ...waStatus, whatsappConnected: false });
    }
  };

  const handleUpdatePhone = async () => {
    if (!tempPhone.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/whatsapp/update-phone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ businessPhone: tempPhone })
      });
      if (res.ok) {
        setWaStatus({ ...waStatus, businessPhone: tempPhone });
        setIsEditingPhone(false);
      }
    } catch (error) {
      alert('Failed to update phone number');
    }
  };

  // Reset selections when filter changes
  useEffect(() => {
    setSelectedCustomers([]);
  }, [activeFilter]);

  if (loading) return <div className="p-8 text-foreground">Loading Marketing Data...</div>;

  if (!isElite) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6">
        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/30">
          <Lock size={40} />
        </div>
        <h2 className="text-4xl font-black text-foreground tracking-tighter">Scale Feature Locked</h2>
        <p className="text-foreground/60 max-w-md mx-auto">
          The Customer Marketing CRM is exclusively available to Scale plan members. Upgrade to unlock powerful customer segmentation and WhatsApp campaign integrations.
        </p>
        <button 
          onClick={() => router.push('/dashboard/membership')}
          className="bg-gold text-black px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-gold/80 transition-all mt-4"
        >
          Upgrade to Scale <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  const getFilteredCustomers = () => {
    if (activeFilter === 'All') return crmData;
    return crmData.filter(c => c.segments.includes(activeFilter));
  };

  const filteredCustomers = getFilteredCustomers();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.phone));
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

  const segmentCounts = {
    Total: crmData.length,
    VIP: crmData.filter(c => c.segments.includes('VIP')).length,
    Frequent: crmData.filter(c => c.segments.includes('Frequent')).length,
    Lost: crmData.filter(c => c.segments.includes('Lost')).length,
    New: crmData.filter(c => c.segments.includes('New')).length,
    'High Spending': crmData.filter(c => c.segments.includes('High Spending')).length,
  };

  const cards = [
    { label: 'Total Customers', count: segmentCounts.Total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'VIP Customers', count: segmentCounts.VIP, icon: Crown, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Frequent', count: segmentCounts.Frequent, icon: Repeat, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'High Spending', count: segmentCounts['High Spending'], icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'New (Last 30D)', count: segmentCounts.New, icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { label: 'Lost (>30D)', count: segmentCounts.Lost, icon: UserMinus, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Marketing Engine</h1>
          <p className="text-foreground/40 text-sm mt-1">Convert your transaction data into actionable marketing campaigns.</p>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="bg-card shadow-sm border border-border text-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-foreground/10 transition-colors"
        >
          <Settings size={18} /> Engine Settings
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border p-8 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4 sticky top-0 bg-card z-10 pt-2">
              <h2 className="text-2xl font-black text-foreground">Marketing Engine & WhatsApp Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-foreground/40 hover:text-foreground">✕</button>
            </div>
            
            <div className="space-y-8">
              {/* Customer Segmentation Rules */}
              <div className="bg-card shadow-sm p-6 rounded-2xl border border-border">
                <h3 className="text-gold font-bold mb-4 uppercase tracking-widest text-sm">Customer Segmentation Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-foreground/40 mb-2 block font-bold">VIP Threshold (Total Spend ₹)</label>
                    <input type="number" value={formData.vipThreshold} onChange={e => setFormData({...formData, vipThreshold: Number(e.target.value)})} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground font-bold" />
                  </div>
                  <div>
                    <label className="text-xs text-foreground/40 mb-2 block font-bold">High Spending Threshold (Avg Bill ₹)</label>
                    <input type="number" value={formData.highSpendingThreshold} onChange={e => setFormData({...formData, highSpendingThreshold: Number(e.target.value)})} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground font-bold" />
                  </div>
                </div>
              </div>

              {/* WhatsApp Business Integration */}
              <div className="bg-card shadow-sm p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare size={20} className="text-green-500" />
                  <h3 className="text-green-500 font-bold uppercase tracking-widest text-sm">WhatsApp Business Integration</h3>
                </div>

                {!waStatus?.whatsappConnected ? (
                    <div className="bg-black/50 border border-border rounded-xl p-8 text-center flex flex-col items-center">
                      <MessageSquare size={48} className="text-foreground/20 mb-4" />
                      <h4 className="text-foreground font-bold text-lg mb-2">Status: Not Connected</h4>
                      <p className="text-foreground/40 text-sm max-w-md mb-2">Connect your WhatsApp Business account to automate customer communication securely using the official Meta Cloud API.</p>
                      
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-left max-w-md w-full mb-4">
                        <p className="text-blue-400 font-bold mb-2 text-sm flex items-center gap-2">
                          <Info size={16} /> How it works:
                        </p>
                        <ol className="list-decimal pl-4 text-xs text-foreground/70 space-y-2">
                          <li>Click the button below to connect with Meta.</li>
                          <li>Log in to your Facebook account.</li>
                          <li>Select your Business Profile and WhatsApp Number.</li>
                          <li>Approve the permissions, and KYROZ-PLUS will automatically configure your connection!</li>
                        </ol>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs text-left max-w-md mb-6 w-full">
                        <p className="font-bold mb-1">Billing Notice:</p>
                        <ul className="list-disc pl-4 space-y-1 text-foreground/60">
                          <li>WhatsApp message charges are billed directly by Meta and are not included in your KyrozPlus subscription.</li>
                          <li>KyrozPlus provides automation tools only.</li>
                        </ul>
                      </div>

                      <div className="flex flex-col gap-3 w-full max-w-md">
                        <ConnectWhatsAppButton
                          isConnecting={isConnecting}
                          onSuccess={(data) => {
                            setWaStatus({
                              ...waStatus,
                              whatsappConnected: true,
                              businessPhone: data.displayName || '+91 00000 00000'
                            });
                            alert('WhatsApp Connected Successfully!');
                            setShowSettings(false); // Close settings to force a refresh on reopen
                          }}
                          onError={(error) => {
                            alert(error);
                            setIsConnecting(false);
                          }}
                        />
                        <button
                          onClick={() => setShowGuidedSetup(true)}
                          className="bg-foreground/10 hover:bg-foreground/20 text-foreground px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center w-full"
                        >
                          Guided Manual Setup
                        </button>
                      </div>
                    </div>
                ) : (
                  <div className="space-y-8">
                    {/* Connected Status */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h4 className="text-green-400 font-bold text-lg flex items-center gap-2">Connected</h4>
                          <p className="text-sm text-foreground/60">Business Name: <strong className="text-foreground">{waStatus.businessName}</strong></p>
                          <div className="text-sm text-foreground/60 flex items-center gap-2">
                            Phone Number: 
                            {isEditingPhone ? (
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text" 
                                  value={tempPhone} 
                                  onChange={e => setTempPhone(e.target.value)} 
                                  className="bg-black/50 border border-border rounded px-2 py-1 text-foreground text-xs w-32" 
                                />
                                <button onClick={handleUpdatePhone} className="text-xs bg-green-500 text-black px-2 py-1 rounded font-bold">Save</button>
                                <button onClick={() => setIsEditingPhone(false)} className="text-xs text-foreground/40 hover:text-foreground">Cancel</button>
                              </div>
                            ) : (
                              <>
                                <strong className="text-foreground">{waStatus.businessPhone}</strong>
                                <button onClick={() => { setTempPhone(waStatus.businessPhone); setIsEditingPhone(true); }} className="text-xs text-green-400 hover:underline">Edit</button>
                              </>
                            )}
                          </div>
                          <div className="text-sm text-foreground/60 flex items-center gap-2 mt-2">
                            Billing: <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded text-xs">Charges handled directly by Meta</span>
                          </div>
                          <div className="text-sm text-foreground/60 flex items-center gap-2 mt-1">
                            KyrozPlus Subscription: <span className="text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded text-xs">Active</span>
                          </div>
                          <p className="text-xs text-foreground/40 mt-3">Last Synced: {new Date(waStatus.lastSynced).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 md:items-end">
                        <button onClick={() => window.open('https://business.facebook.com/wa/manage/home', '_blank')} className="px-4 py-2 bg-foreground/10 text-foreground rounded-lg font-bold hover:bg-foreground/20 text-sm w-full md:w-auto text-center">Manage WhatsApp</button>
                        <div className="flex gap-3">
                          <button onClick={handleConnectWhatsApp} className="px-4 py-2 bg-card shadow-sm text-foreground rounded-lg font-bold hover:bg-foreground/10 text-sm">Reconnect</button>
                          <button onClick={handleDisconnectWhatsApp} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/40 text-sm">Disconnect</button>
                        </div>
                      </div>
                    </div>

                    {/* Automation Settings & Preview Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-foreground font-bold mb-4 flex items-center gap-2"><Settings size={16} className="text-gold"/> Automation Settings</h4>
                        <div className="space-y-6">
                          {/* Order Management */}
                          <div>
                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Order Management</p>
                            <div className="space-y-3">
                              {Object.entries({
                                orderConfirmation: 'Order Confirmation Messages',
                                paymentConfirmation: 'Payment Confirmation Messages',
                                orderReady: 'Order Ready Notifications',
                                deliveryUpdates: 'Delivery Updates'
                              }).map(([key, label]) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    checked={automationSettings[key as keyof typeof automationSettings]}
                                    onChange={e => setAutomationSettings({...automationSettings, [key]: e.target.checked})}
                                    className="accent-green-500 w-4 h-4 rounded cursor-pointer"
                                  />
                                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* Reservation Management */}
                          <div>
                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Reservation Management</p>
                            <div className="space-y-3">
                              {Object.entries({
                                reservationConfirmation: 'Reservation Confirmation',
                                reservationReminder: 'Reservation Reminder',
                                reservationCancellation: 'Reservation Cancellation Alerts'
                              }).map(([key, label]) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    checked={automationSettings[key as keyof typeof automationSettings]}
                                    onChange={e => setAutomationSettings({...automationSettings, [key]: e.target.checked})}
                                    className="accent-green-500 w-4 h-4 rounded cursor-pointer"
                                  />
                                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Customer Engagement */}
                          <div>
                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Customer Engagement</p>
                            <div className="space-y-3">
                              {Object.entries({
                                feedbackRequests: 'Feedback Requests',
                                loyaltyReward: 'Loyalty Reward Notifications',
                                birthdayWishes: 'Birthday Wishes',
                                vipOffers: 'VIP Customer Offers'
                              }).map(([key, label]) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    checked={automationSettings[key as keyof typeof automationSettings]}
                                    onChange={e => setAutomationSettings({...automationSettings, [key]: e.target.checked})}
                                    className="accent-green-500 w-4 h-4 rounded cursor-pointer"
                                  />
                                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Marketing Campaigns */}
                          <div>
                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Marketing Campaigns</p>
                            <div className="space-y-3">
                              {Object.entries({
                                promotionalBroadcasts: 'Promotional Broadcasts',
                                festivalOffers: 'Festival Offers',
                                weekendDiscounts: 'Weekend Discounts',
                                newMenuLaunch: 'New Menu Launch Notifications'
                              }).map(([key, label]) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    checked={automationSettings[key as keyof typeof automationSettings]}
                                    onChange={e => setAutomationSettings({...automationSettings, [key]: e.target.checked})}
                                    className="accent-green-500 w-4 h-4 rounded cursor-pointer"
                                  />
                                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div>
                        <h4 className="text-foreground font-bold mb-4 flex items-center gap-2"><Smartphone size={16} className="text-blue-400"/> Message Preview</h4>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
                          {['Order Confirmation', 'Reservation', 'Feedback', 'Loyalty'].map(tab => (
                            <button 
                              key={tab}
                              onClick={() => setActivePreview(tab)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${activePreview === tab ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-card shadow-sm text-foreground/40 hover:text-foreground border border-border'}`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                        <div className="bg-[#efeae2] rounded-3xl p-4 h-[400px] border-[8px] border-[#111] shadow-2xl relative overflow-hidden flex flex-col">
                          {/* Chat Header */}
                          <div className="bg-[#075e54] -mx-4 -mt-4 p-3 flex items-center gap-3 shadow-md mb-4 z-10 relative">
                            <div className="w-8 h-8 bg-foreground/20 rounded-full flex items-center justify-center text-foreground font-bold text-xs">ABC</div>
                            <div className="text-foreground">
                              <p className="font-bold text-sm leading-tight">{waStatus.businessName}</p>
                              <p className="text-xs text-foreground/70 flex items-center gap-1"><CheckCircle2 size={10} className="text-green-300"/> Verified Business</p>
                            </div>
                          </div>
                          
                          {/* Chat Body */}
                          <div className="bg-white rounded-xl p-3 shadow-sm text-sm text-[#111] max-w-[85%] relative">
                            {activePreview === 'Order Confirmation' && (
                              <>
                                <p className="font-bold mb-2">Hello Rahul 👋</p>
                                <p className="mb-2">Your order <strong className="text-blue-600">#1234</strong> has been confirmed.</p>
                                <p className="mb-2">Estimated delivery time:<br/><strong>30 minutes.</strong></p>
                                <p className="text-xs text-gray-500">Thank you for choosing {waStatus.businessName}.</p>
                              </>
                            )}
                            {activePreview === 'Reservation' && (
                              <>
                                <p className="font-bold mb-2">Hi Sarah,</p>
                                <p className="mb-2">Your table for <strong>4 guests</strong> is reserved at {waStatus.businessName} for <strong>Tonight, 8:00 PM</strong>.</p>
                                <p className="text-xs text-gray-500">Reply 'CANCEL' to cancel.</p>
                              </>
                            )}
                            {activePreview === 'Feedback' && (
                              <>
                                <p className="font-bold mb-2">Hope you enjoyed your meal! 🍽️</p>
                                <p className="mb-2">We'd love to hear your feedback on your recent visit to {waStatus.businessName}.</p>
                                <p className="text-blue-600 underline">Tap here to rate us</p>
                              </>
                            )}
                            {activePreview === 'Loyalty' && (
                              <>
                                <p className="font-bold mb-2">Congrats! 🎉</p>
                                <p className="mb-2">You've earned <strong>50 Kyroz Points</strong> from your last visit.</p>
                                <p className="mb-2">You now have <strong>250 Points</strong> total.</p>
                                <p className="text-xs text-gray-500">Show this message to redeem 10% off your next bill!</p>
                              </>
                            )}
                            <span className="text-[10px] text-gray-400 absolute bottom-1 right-2">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Section */}
                    {waAnalytics && (
                      <div className="pt-6 border-t border-border mt-8">
                        <h4 className="text-foreground font-bold mb-6 flex items-center gap-2"><BarChart3 size={16} className="text-purple-400"/> WhatsApp Analytics</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                          <div className="bg-card shadow-sm border border-border p-4 rounded-xl">
                            <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest mb-1">Sent (This Month)</p>
                            <p className="text-xl font-black text-foreground">{waAnalytics.messagesSent}</p>
                          </div>
                          <div className="bg-card shadow-sm border border-border p-4 rounded-xl">
                            <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest mb-1">Delivered</p>
                            <p className="text-xl font-black text-green-400">{waAnalytics.messagesDelivered}</p>
                          </div>
                          <div className="bg-card shadow-sm border border-border p-4 rounded-xl">
                            <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest mb-1">Read Rate</p>
                            <p className="text-xl font-black text-blue-400">{waAnalytics.readRate}%</p>
                          </div>
                          <div className="bg-card shadow-sm border border-border p-4 rounded-xl">
                            <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest mb-1">Response Rate</p>
                            <p className="text-xl font-black text-purple-400">{waAnalytics.responseRate}%</p>
                          </div>
                          <div className="bg-card shadow-sm border border-border p-4 rounded-xl">
                            <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest mb-1">Success Rate</p>
                            <p className="text-xl font-black text-gold">{waAnalytics.campaignSuccessRate}%</p>
                          </div>
                        </div>

                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={waAnalytics.trendData}>
                              <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                              <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px'}} />
                              <Bar dataKey="success" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border sticky bottom-0 bg-card pb-2 z-10">
              <button onClick={() => setShowSettings(false)} className="px-6 py-3 text-foreground/60 hover:text-foreground font-bold transition-colors">Cancel</button>
              <button onClick={handleSaveSettings} className="bg-gold text-black px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-gold/80 transition-transform hover:scale-105 shadow-lg shadow-gold/20">
                <Save size={18} /> Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showGuidedSetup && (
        <GuidedWhatsAppSetup 
          onClose={() => setShowGuidedSetup(false)}
          onSuccess={(data) => {
            setWaStatus({
              ...waStatus,
              whatsappConnected: true,
              businessPhone: data.settings?.businessPhone || '+91 00000 00000'
            });
            alert('WhatsApp Connected Successfully via Manual Setup!');
            setShowGuidedSetup(false);
          }}
        />
      )}



      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-card glass-card p-4 rounded-2xl border border-border flex flex-col justify-between">
            <div className={`${card.bg} ${card.color} w-8 h-8 rounded-lg flex items-center justify-center mb-3`}>
              <card.icon size={16} />
            </div>
            <div>
              <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{card.label}</p>
              <p className="text-2xl font-black text-foreground mt-1">{card.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
          {['All', 'VIP', 'Frequent', 'High Spending', 'New', 'Lost'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === filter 
                  ? 'bg-gold text-black shadow-lg shadow-gold/20' 
                  : 'bg-card shadow-sm text-foreground/40 hover:text-foreground border border-border'
              }`}
            >
              {filter} ({filter === 'All' ? segmentCounts.Total : segmentCounts[filter as keyof typeof segmentCounts]})
            </button>
          ))}
        </div>
        {selectedCustomers.length > 0 && (
          <button 
            onClick={() => setShowMessageModal(true)}
            className="bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap"
          >
            <MessageSquare size={16} /> Send WhatsApp ({selectedCustomers.length})
          </button>
        )}
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

      {/* Customer Table */}
      <div className="bg-card glass-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-card shadow-sm text-xs uppercase tracking-[0.2em] text-foreground/40">
                <th className="p-4 pl-6 w-12">
                  <input 
                    type="checkbox" 
                    checked={filteredCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length}
                    onChange={handleSelectAll}
                    className="accent-gold w-4 h-4 rounded"
                  />
                </th>
                <th className="p-4 font-bold">Customer Name</th>
                <th className="p-4 font-bold">Phone</th>
                <th className="p-4 font-bold">Visits</th>
                <th className="p-4 font-bold">Total Spend</th>
                <th className="p-4 font-bold">Avg Bill</th>
                <th className="p-4 font-bold">Last Visit</th>
                <th className="p-4 pr-6 font-bold">Segments</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-foreground/40 font-bold uppercase tracking-widest text-xs">
                    No customers found in this segment.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, idx) => (
                  <tr key={idx} className="border-t border-border hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <input 
                        type="checkbox" 
                        checked={selectedCustomers.includes(customer.phone)}
                        onChange={() => handleSelectCustomer(customer.phone)}
                        className="accent-gold w-4 h-4 rounded"
                      />
                    </td>
                    <td className="p-4 font-bold text-foreground">{customer.name || 'Unknown'}</td>
                    <td className="p-4 text-foreground/60">{customer.phone}</td>
                    <td className="p-4 font-black">{customer.totalVisits}</td>
                    <td className="p-4 text-gold font-bold">₹{customer.totalSpend.toFixed(0)}</td>
                    <td className="p-4 text-foreground/60">₹{customer.avgBillValue.toFixed(0)}</td>
                    <td className="p-4 text-xs text-foreground/40">
                      {new Date(customer.lastVisitDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex flex-wrap gap-1">
                        {customer.segments.map((seg: string) => (
                          <span 
                            key={seg} 
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${
                              seg === 'VIP' ? 'bg-gold/20 text-gold' :
                              seg === 'Lost' ? 'bg-red-500/20 text-red-400' :
                              seg === 'New' ? 'bg-pink-500/20 text-pink-400' :
                              seg === 'Frequent' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-green-500/20 text-green-400' // High Spending
                            }`}
                          >
                            {seg}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
