'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Props {
  onClose: () => void;
  onSuccess: (data: any) => void;
}

// Extend Window interface for Facebook SDK
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export default function GuidedWhatsAppSetup({ onClose, onSuccess }: Props) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : appId || 'YOUR_APP_ID',
        cookie     : true,
        xfbml      : true,
        version    : 'v19.0'
      });
      setSdkLoaded(true);
    };

    (function(d, s, id){
       var js: any, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) { setSdkLoaded(true); return; }
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       if (fjs && fjs.parentNode) {
         fjs.parentNode.insertBefore(js, fjs);
       } else {
         d.head.appendChild(js);
       }
     }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      setError('Facebook SDK failed to load. Please disable ad-blockers and try again.');
      return;
    }
    
    setIsConnecting(true);
    setError('');
    
    window.FB.login(function(response: any) {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        linkBackend(accessToken);
      } else {
        setIsConnecting(false);
        setError('Login cancelled or permissions were not fully granted.');
      }
    }, {
      scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management',
      return_scopes: true
    });
  };

  const linkBackend = async (facebook_access_token: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/whatsapp/link`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ facebook_access_token })
      });
      
      const data = await res.json();
      if (res.ok) {
        onSuccess(data);
      } else {
        setError(data.error || 'Failed to sync with backend. Please verify your business account exists.');
        setIsConnecting(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111] border border-white/10 p-6 sm:p-8 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="mb-8 text-center mt-4">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/10">
            <ShieldCheck className="text-blue-500" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white">Connect WhatsApp</h2>
          <p className="text-white/40 text-sm mt-2 px-4">
            Connect your Meta Business account to instantly sync your WhatsApp API credentials with Kyroz-Plus.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={handleFacebookLogin}
            disabled={!sdkLoaded || isConnecting}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-black transition-all shadow-xl shadow-[#1877F2]/30 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue with Facebook <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-70" />
              </span>
            )}
          </button>
          
          <div className="text-center text-xs text-white/30 font-medium">
            By connecting, you agree to grant Kyroz-Plus permission to manage your WhatsApp Business Account.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
