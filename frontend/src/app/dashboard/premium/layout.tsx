'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Lock } from 'lucide-react';

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const checkAccess = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const user = await res.json();
          // To access Premium HQ features, user must be on Scale/Admin AND NOT be a staff/branch member (i.e. no ownerId)
          if ((user.subscriptionPlan === 'Scale' || user.subscriptionPlan === 'Admin') && !user.ownerId) {
            setIsAuthorized(true);
          }
        }
      } catch (error) {
        console.error('Failed to verify premium access', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gold font-bold uppercase tracking-[0.3em]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          Verifying Access...
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-gradient-to-br from-[#2a220a] to-[#111111] border border-[#d4af37]/30 rounded-3xl flex items-center justify-center mb-8 relative">
          <div className="absolute -top-3 -right-3 text-[#d4af37] animate-bounce">
            <Crown size={32} />
          </div>
          <Lock size={40} className="text-[#d4af37]" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
          Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">Access Only</span>
        </h1>
        
        <p className="text-foreground/60 text-lg max-w-xl mb-8">
          The features in this section, including Advanced Business Intelligence, Menu Engineering, and the Premium AI Consultant, are exclusively available to members on the <strong className="text-gold">Scale Plan</strong>.
        </p>

        <button 
          onClick={() => router.push('/dashboard/account')}
          className="px-8 py-4 bg-gold text-black font-black text-sm uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
        >
          Upgrade to Scale Plan
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
