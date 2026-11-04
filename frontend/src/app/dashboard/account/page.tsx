'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Store, 
  ShieldCheck, 
  CreditCard, 
  Calendar,
  ChevronRight,
  Settings,
  Bell,
  QrCode,
  Upload,
  Phone,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    shopAddress: '',
    gstNumber: '',
    phone: '',
    gstPercentage: 5,
    paymentQrCode: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data);
      setFormData({
        name: data.name || '',
        shopName: data.shopName || '',
        shopAddress: data.shopAddress || '',
        gstNumber: data.gstNumber || '',
        phone: data.phone || '',
        gstPercentage: data.gstPercentage || 5,
        paymentQrCode: data.paymentQrCode || ''
      });
    } catch (err) {
      console.error('Failed to fetch user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, paymentQrCode: data.url }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsEditing(false);
        fetchUser();
      }
    } catch (err) {
      console.error('Update failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gold font-bold tracking-widest uppercase animate-pulse">
        Fetching Profile...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-20 px-1 sm:px-0">
      <header>
        <h2 className="text-xl sm:text-2xl font-bold">MY <span className="text-gold">ACCOUNT</span></h2>
        <p className="text-foreground/40 text-[11px] sm:text-xs uppercase tracking-widest mt-1">Manage your professional profile and subscription</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        
        {/* PROFILE CARD */}
        <div className="md:col-span-7 space-y-6 min-w-0">
          <div className="bg-card glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold/10 transition-all pointer-events-none"></div>
            
            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gold-gradient flex items-center justify-center text-black font-bold text-2xl sm:text-3xl shadow-[0_0_30px_rgba(212,175,55,0.2)] shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold truncate">{user?.name || 'User Name'}</h3>
                <p className="text-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">{user?.role || 'Member'}</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* EMAIL */}
              <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-card shadow-sm rounded-xl sm:rounded-2xl border border-border min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-sm flex items-center justify-center text-foreground/40 shrink-0">
                  <Mail size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-foreground/30 uppercase font-bold tracking-tight">Email Address</p>
                  <p className="text-xs sm:text-sm font-medium truncate break-all">{user?.email || 'N/A'}</p>
                </div>
              </div>

              {/* SHOP NAME & GST NUMBER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-card shadow-sm rounded-xl sm:rounded-2xl border border-border min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-sm flex items-center justify-center text-foreground/40 shrink-0">
                    <Store size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs text-foreground/30 uppercase font-bold tracking-tight">Shop Name</p>
                    <p className="text-xs sm:text-sm font-medium truncate">{user?.shopName || 'Not Set'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-card shadow-sm rounded-xl sm:rounded-2xl border border-border min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-sm flex items-center justify-center text-foreground/40 shrink-0">
                    <QrCode size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs text-foreground/30 uppercase font-bold tracking-tight">GST Number</p>
                    <p className="text-xs sm:text-sm font-medium truncate">{user?.gstNumber || 'Not Set'}</p>
                  </div>
                </div>
              </div>

              {/* SHOP ADDRESS */}
              <div className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 bg-card shadow-sm rounded-xl sm:rounded-2xl border border-border min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-sm flex items-center justify-center text-foreground/40 shrink-0 mt-0.5">
                  <Store size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-foreground/30 uppercase font-bold tracking-tight">Shop Address</p>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed break-words">{user?.shopAddress || 'Not Set'}</p>
                </div>
              </div>

              {/* ACCOUNT STATUS */}
              <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-card shadow-sm rounded-xl sm:rounded-2xl border border-border min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-sm flex items-center justify-center text-foreground/40 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-foreground/30 uppercase font-bold tracking-tight">Account Status</p>
                  <p className="text-xs sm:text-sm font-bold text-green-500 truncate">Verified & Active</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[9px] sm:text-[10px] font-black text-green-500 uppercase tracking-widest">Live</span>
                </div>
              </div>

              {/* CONTACT NO. & DEFAULT GST */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-card shadow-sm rounded-xl sm:rounded-2xl border border-border min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-sm flex items-center justify-center text-foreground/40 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs text-foreground/30 uppercase font-bold tracking-tight">Contact No.</p>
                    <p className="text-xs sm:text-sm font-medium truncate">{user?.phone || 'Not Set'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-card shadow-sm rounded-xl sm:rounded-2xl border border-border min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-sm flex items-center justify-center text-foreground/40 shrink-0">
                    <Settings size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs text-foreground/30 uppercase font-bold tracking-tight">Default GST</p>
                    <p className="text-xs sm:text-sm font-medium truncate">{user?.gstPercentage || 5}%</p>
                  </div>
                </div>
              </div>

              {/* PAYMENT QR CODE */}
              {user?.paymentQrCode && (
                <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-card shadow-sm rounded-xl sm:rounded-2xl border border-border min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-sm flex items-center justify-center text-foreground/40 shrink-0">
                    <QrCode size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs text-foreground/30 uppercase font-bold tracking-tight">Payment QR Code</p>
                    <p className="text-xs sm:text-sm font-medium truncate">Uploaded Successfully</p>
                  </div>
                  <img src={user.paymentQrCode} alt="QR Code" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-border shrink-0" />
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              className="w-full mt-6 sm:mt-8 py-3.5 sm:py-4 bg-card shadow-sm hover:bg-foreground/10 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-all border border-border active:scale-[0.99]"
            >
              Edit Profile Details
            </button>
          </div>
        </div>

        {/* SUBSCRIPTION SIDEBAR */}
        <div className="md:col-span-5 space-y-6 min-w-0">
          <div className="bg-card glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-l-4 border-gold">
            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4 sm:mb-6">Subscription Plan</h4>
            
            <div className="flex items-center justify-between gap-3 mb-6 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-xl sm:text-2xl font-bold text-gold truncate">{user?.subscriptionPlan || 'KYROZ STARTER'}</p>
                {user?.subscriptionExpiryDate ? (
                  <p className="text-[11px] sm:text-xs text-foreground/50 mt-1">
                    Expires: {new Date(user.subscriptionExpiryDate).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-[10px] sm:text-xs text-foreground/30 uppercase mt-1">Billed Monthly</p>
                )}
              </div>
              <div className="p-2.5 sm:p-3 bg-gold/10 rounded-xl sm:rounded-2xl text-gold shrink-0">
                <CreditCard size={22} className="sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs text-foreground/60 font-medium">
                <ChevronRight size={14} className="text-gold shrink-0" />
                <span>{user?.subscriptionPlan === 'Starter' ? 'Basic SOP Access' : 'Unlimited SOP Access'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/60 font-medium">
                <ChevronRight size={14} className={`shrink-0 ${(user?.subscriptionPlan === 'Scale' || user?.subscriptionPlan === 'Elite' || user?.role === 'admin') ? 'text-gold' : 'text-foreground/20'}`} />
                <span className={(user?.subscriptionPlan === 'Scale' || user?.subscriptionPlan === 'Elite' || user?.role === 'admin') ? 'text-foreground/60' : 'text-foreground/20'}>
                  Chef Support 24/7
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/60 font-medium">
                <ChevronRight size={14} className={`shrink-0 ${user?.subscriptionPlan !== 'Starter' ? 'text-gold' : 'text-foreground/20'}`} />
                <span className={user?.subscriptionPlan !== 'Starter' ? 'text-foreground/60' : 'text-foreground/20'}>
                  Costing & Margin Tools
                </span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/dashboard/membership')}
              className="w-full py-3.5 sm:py-4 bg-gold-gradient rounded-xl sm:rounded-2xl text-black font-bold text-[11px] sm:text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gold/10"
            >
              {(user?.subscriptionPlan === 'Scale' || user?.subscriptionPlan === 'Elite' || user?.role === 'admin') ? 'Manage Subscription' : 'Upgrade Your Plan'}
            </button>
          </div>

          <div className="bg-card glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border space-y-3 sm:space-y-4">
            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-foreground/40">Security Settings</h4>
            <div 
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-between p-3 hover:bg-card shadow-sm rounded-xl cursor-pointer transition-all group active:scale-[0.99]"
            >
              <span className="text-xs font-medium group-hover:text-gold transition-colors">Change OTP Phone</span>
              <Settings size={14} className="text-foreground/20 group-hover:text-gold transition-colors" />
            </div>
            <div 
              onClick={() => alert('Notification preferences will be available in the next update.')}
              className="flex items-center justify-between p-3 hover:bg-card shadow-sm rounded-xl cursor-pointer transition-all group active:scale-[0.99]"
            >
              <span className="text-xs font-medium group-hover:text-gold transition-colors">Notification Preferences</span>
              <Bell size={14} className="text-foreground/20 group-hover:text-gold transition-colors" />
            </div>
          </div>
        </div>

      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card glass-card p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-border w-full max-w-md shadow-2xl overflow-y-auto max-h-[92vh] custom-scrollbar"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6">EDIT <span className="text-gold">PROFILE</span></h3>
            <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground/40">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-card shadow-sm border border-border rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-gold outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground/40">Restaurant Name</label>
                  <input 
                    type="text" 
                    value={formData.shopName}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    className="w-full bg-card shadow-sm border border-border rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-gold outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground/40">GST Number</label>
                  <input 
                    type="text" 
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                    className="w-full bg-card shadow-sm border border-border rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground/40">Shop Address</label>
                <textarea 
                  value={formData.shopAddress}
                  onChange={(e) => setFormData({...formData, shopAddress: e.target.value})}
                  className="w-full bg-card shadow-sm border border-border rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-gold outline-none transition-all min-h-[70px] sm:min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground/40">Contact Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-card shadow-sm border border-border rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-gold outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground/40">GST Rate (%)</label>
                  <input 
                    type="number" 
                    value={formData.gstPercentage}
                    onChange={(e) => setFormData({...formData, gstPercentage: Number(e.target.value)})}
                    className="w-full bg-card shadow-sm border border-border rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground/40">Payment QR Code (Optional)</label>
                <div className="flex items-center gap-3 sm:gap-4">
                  {formData.paymentQrCode ? (
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-border overflow-hidden bg-card shadow-sm shrink-0">
                      <img src={formData.paymentQrCode} alt="QR Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, paymentQrCode: ''})}
                        className="absolute inset-0 bg-foreground/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <span className="text-[10px] sm:text-xs font-bold text-foreground uppercase">Remove</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-border border-dashed bg-card shadow-sm flex items-center justify-center text-foreground/40 shrink-0">
                      <QrCode size={20} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-card shadow-sm hover:bg-foreground/10 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest border border-border cursor-pointer transition-all active:scale-[0.99]">
                      {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                      <span className="truncate">{isUploading ? 'Uploading...' : 'Upload QR Image'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 sm:py-4 bg-card shadow-sm rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-widest border border-border active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 sm:py-4 bg-gold text-black rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-widest active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
