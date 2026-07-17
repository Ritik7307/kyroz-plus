'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, X, Copy, ExternalLink, ShieldCheck, Smartphone, Key } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Props {
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export default function GuidedWhatsAppSetup({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { id: 1, title: 'Create Meta App' },
    { id: 2, title: 'Add WhatsApp' },
    { id: 3, title: 'Generate Token' },
    { id: 4, title: 'Connect' }
  ];

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleConnect = async () => {
    if (!phoneNumberId.trim() || !accessToken.trim()) {
      setError('Both Phone Number ID and Access Token are required.');
      return;
    }
    
    setError('');
    setIsConnecting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/whatsapp/connect`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumberId, accessToken })
      });
      
      const data = await res.json();
      if (res.ok) {
        onSuccess(data);
      } else {
        setError(data.error || 'Failed to connect. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a local toast here if desired
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111] border border-white/10 p-6 sm:p-8 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-black text-white">Manual Setup Wizard</h2>
          <p className="text-white/40 text-sm mt-1">Follow these steps to connect your WhatsApp Business API manually.</p>
        </div>

        {/* Stepper Header */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-green-500 transition-all duration-300 -z-10"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s.id ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-[#222] text-white/40 border border-white/10'
              }`}>
                {step > s.id ? <CheckCircle2 size={20} /> : s.id}
              </div>
              <span className={`text-xs font-bold hidden sm:block ${step >= s.id ? 'text-green-500' : 'text-white/40'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
                  <ShieldCheck className="text-blue-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-white mb-2">Create a Meta Developer App</h3>
                  <ol className="list-decimal pl-5 space-y-3 text-white/70 text-sm">
                    <li>Go to the <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">Meta Developer Dashboard <ExternalLink size={12}/></a>.</li>
                    <li>Click <strong>Create App</strong> and select <strong>Other</strong> as the use case.</li>
                    <li>Select <strong>Business</strong> as the app type.</li>
                    <li>Fill in your App Name (e.g., "Kyroz CRM") and contact email, then select your Business Account (if you have one).</li>
                    <li>Click <strong>Create app</strong>.</li>
                  </ol>
                  <div className="mt-6">
                    <a 
                      href="https://developers.facebook.com/apps/create/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-black font-bold rounded-xl transition-colors w-full sm:w-auto"
                    >
                      Proceed to App Creation <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
                  <Smartphone className="text-green-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-white mb-2">Set up WhatsApp Product</h3>
                  <ol className="list-decimal pl-5 space-y-3 text-white/70 text-sm">
                    <li>On your App Dashboard, scroll down to the "Add products to your app" section.</li>
                    <li>Find <strong>WhatsApp</strong> and click <strong>Set up</strong>.</li>
                    <li>Select or create a Meta Business Account.</li>
                    <li>In the left sidebar, navigate to <strong>WhatsApp &gt; API Setup</strong>.</li>
                    <li>Scroll down to "Step 5: Add a phone number" and click <strong>Add phone number</strong>.</li>
                    <li>Follow the prompts to verify your real business phone number.</li>
                  </ol>
                  <div className="mt-6 bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-white/60">
                      <strong>Note:</strong> Meta provides a temporary test number by default, but you must add your real business number to send messages to your actual customers.
                    </p>
                  </div>
                  <div className="mt-6">
                    <a 
                      href="https://developers.facebook.com/apps/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-colors w-full sm:w-auto"
                    >
                      Proceed to App Dashboard <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl">
                  <Key className="text-purple-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-white mb-2">Generate Permanent Access Token</h3>
                  <p className="text-white/60 text-sm mb-4">
                    The token generated on the API Setup page is temporary (24 hours). You need a permanent token for KyrozPlus.
                  </p>
                  <ol className="list-decimal pl-5 space-y-3 text-white/70 text-sm">
                    <li>Go to <a href="https://business.facebook.com/settings/system-users" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline inline-flex items-center gap-1">Business Settings &gt; System Users <ExternalLink size={12}/></a>.</li>
                    <li>Click <strong>Add</strong>, name it "Kyroz Integration", and select <strong>Admin</strong> role.</li>
                    <li>Select the new System User and click <strong>Add Assets</strong>. Assign your App (Full control).</li>
                    <li>Click <strong>Generate New Token</strong>.</li>
                    <li>Select your App, and choose <code>whatsapp_business_messaging</code> and <code>whatsapp_business_management</code> permissions.</li>
                    <li>Click <strong>Generate Token</strong> and save it. It will never expire.</li>
                  </ol>
                  <div className="mt-6">
                    <a 
                      href="https://business.facebook.com/settings/system-users" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-400 text-black font-bold rounded-xl transition-colors w-full sm:w-auto"
                    >
                      Proceed to System Users <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-[#161616] border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-6">Enter Your Credentials</h3>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label className="text-xs text-white/60 font-bold mb-2 block uppercase tracking-wider">
                        Phone Number ID
                      </label>
                      <p className="text-xs text-white/40 mb-2">Found in Developer Dashboard &gt; WhatsApp &gt; API Setup.</p>
                      <input 
                        type="text" 
                        value={phoneNumberId}
                        onChange={(e) => setPhoneNumberId(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-green-500 focus:outline-none transition-colors placeholder-white/20"
                        placeholder="e.g. 101234567890123"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-white/60 font-bold mb-2 block uppercase tracking-wider">
                        Permanent Access Token
                      </label>
                      <p className="text-xs text-white/40 mb-2">The never-expiring token generated from System Users.</p>
                      <input 
                        type="text" 
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-green-500 focus:outline-none transition-colors placeholder-white/20 font-mono text-sm"
                        placeholder="EAA..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button 
              onClick={handlePrev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10 font-bold transition-colors"
            >
              <ChevronLeft size={18} /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 text-black hover:bg-green-400 font-bold transition-colors shadow-lg shadow-green-500/20"
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-500 text-black hover:bg-green-400 font-black transition-colors shadow-xl shadow-green-500/30 disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : 'Save & Connect'}
              {!isConnecting && <CheckCircle2 size={20} />}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
