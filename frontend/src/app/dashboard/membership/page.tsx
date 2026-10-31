'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function MembershipPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>('Starter');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [pricing, setPricing] = useState({
    starter: { price: 4999, discount: 50 },
    growth: { price: 9999, discount: 50 },
    scale: { price: 19999, discount: 50 }
  });

  const getFinalPrice = (plan: any) => {
    if (!plan) return 0;
    if (plan.finalPrice !== undefined && plan.finalPrice !== null) return plan.finalPrice;
    if (plan.discount !== undefined && plan.discount > 0) {
      return Math.round(plan.price * (1 - plan.discount / 100));
    }
    return plan.price || 0;
  };

  useEffect(() => {
    // Load Razorpay Script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Get current plan from local storage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      let plan = user.subscriptionPlan || user.plan || 'Starter';
      if (plan === 'Basic') plan = 'Starter';
      if (plan === 'Pro') plan = 'Growth';
      if (plan === 'Elite') plan = 'Scale';
      setCurrentPlan(plan);
      if (user.role === 'admin') {
        setCurrentPlan('Admin');
      }
    }

    // Fetch dynamic pricing directly matching admin dashboard settings
    const fetchDynamicPricing = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/settings/pricing`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPricing({
              starter: data.starter || data.basic || { price: 4999, discount: 50 },
              growth: data.growth || data.pro || { price: 9999, discount: 50 },
              scale: data.scale || data.elite || { price: 19999, discount: 50 }
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch pricing:', err);
      }
    };

    fetchDynamicPricing();
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleUpgrade = async (plan: 'Starter' | 'Growth' | 'Scale') => {
    setIsLoading(plan);
    try {
      const token = localStorage.getItem('token');
      
      // 1. Create Order
      const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ plan })
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        alert(`Error: ${orderData.error}`);
        setIsLoading(null);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // Frontend needs the public key
        amount: orderData.order.amount,
        currency: "INR",
        name: "KYROZ",
        description: `Upgrade to ${plan} Plan`,
        image: "https://your-logo-url.com/logo.png", // Optional
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            alert('Payment Successful! Welcome to ' + plan);
            // Update local storage token and user
            localStorage.setItem('token', verifyData.token);
            localStorage.setItem('user', JSON.stringify(verifyData.user));
            setCurrentPlan(plan);
            // Refresh page to apply new plan layout changes
            window.location.reload();
          } else {
            alert(`Payment verification failed: ${verifyData.error}`);
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').name || "",
          email: JSON.parse(localStorage.getItem('user') || '{}').email || "",
        },
        theme: {
          color: "#d4af37" // Gold theme
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      console.error('Error during upgrade:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      <header className="mb-12 text-center mt-8">
        <h2 className="text-4xl font-bold text-foreground tracking-wide">
          {currentPlan === 'Admin' ? 'Admin Control Center' : 'Choose Your Plan'}
        </h2>
        <p className="text-foreground/60 mt-4 text-lg">
          {currentPlan === 'Admin' 
            ? 'As a Platform Administrator, you have full access to all elite features without any cost.' 
            : 'Scale your restaurant operations with the perfect set of tools.'}
        </p>
        <div className="mt-4 inline-block bg-card px-6 py-2 rounded-full border border-border">
          <span className="text-foreground/60">Current Status: </span>
          <span className="text-[#d4af37] font-bold tracking-wider uppercase">
            {currentPlan === 'Admin' ? 'LIFETIME ACCESS (ADMIN)' : currentPlan}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 max-w-5xl mx-auto">
        {/* Starter Plan */}
        <div className="bg-card border border-border rounded-3xl p-8 hover:border-[#444] transition flex flex-col">
          <h3 className="text-xl font-bold text-foreground mb-2 uppercase tracking-widest">KYROZ Starter</h3>
          <div className="flex flex-col mb-6">
            {pricing.starter.price > getFinalPrice(pricing.starter) ? (
              <span className="text-xl font-bold text-foreground/40 line-through">₹{pricing.starter.price}</span>
            ) : null}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-foreground">₹{getFinalPrice(pricing.starter)}</span>
              <span className="text-foreground/50">/mo</span>
            </div>
            <span className="text-[#d4af37] text-sm font-bold mt-1">Founding Member Price</span>
          </div>
          <p className="text-foreground/50 text-sm mb-6 pb-6 border-b border-border">Billing and team control.</p>
          <div className="mb-6">
            <h4 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-2">Best For:</h4>
            <ul className="text-sm text-foreground/50 space-y-1">
              <li>• New restaurant</li>
              <li>• Café</li>
              <li>• Single cuisine setup</li>
              <li>• Small outlet</li>
            </ul>
          </div>
          <div className="mb-8 flex-1">
            <h4 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-3">Includes:</h4>
            <ul className="space-y-3">
              {['POS Terminal', 'KOT Display', 'WhatsApp Billing', 'Customer Directory', 'Sales Analytics', 'Team Management', '1 Cuisine SOP Library Access'].map(feature => (
                <li key={feature} className="flex items-start gap-3 text-sm text-foreground/70">
                  <span className="text-[#d4af37]">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => handleUpgrade('Starter')}
            disabled={isLoading !== null || currentPlan === 'Starter' || currentPlan === 'Growth' || currentPlan === 'Scale' || currentPlan === 'Admin'}
            className={`w-full py-3.5 rounded-xl font-bold transition-all ${
              currentPlan === 'Starter' || currentPlan === 'Growth' || currentPlan === 'Scale' || currentPlan === 'Admin'
              ? 'bg-foreground/10 text-foreground/40 cursor-not-allowed border border-border'
              : 'border border-border hover:bg-foreground/5 text-foreground'
            }`}
          >
            {isLoading === 'Starter' ? 'Processing...' : (currentPlan === 'Starter' ? 'Current Plan' : (currentPlan === 'Growth' || currentPlan === 'Scale' || currentPlan === 'Admin' ? 'Included in Higher Plan' : 'Get Started'))}
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-b from-[#1a1505] to-card border-2 border-[#d4af37]/80 rounded-3xl p-8 relative transform md:-translate-y-4 shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
            Recommended
          </div>
          <h3 className="text-xl font-bold text-[#d4af37] mb-2 uppercase tracking-widest">KYROZ Premium</h3>
          <div className="flex flex-col mb-6">
            {pricing.growth.price > getFinalPrice(pricing.growth) ? (
              <span className="text-xl font-bold text-foreground/40 line-through">₹{pricing.growth.price}</span>
            ) : null}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-[#d4af37]">₹{getFinalPrice(pricing.growth)}</span>
              <span className="text-foreground/50">/mo</span>
            </div>
            <span className="text-[#d4af37] text-sm font-bold mt-1">Founding Member Price</span>
          </div>
          <p className="text-foreground/50 text-sm mb-6 pb-6 border-b border-border">The kitchen system that runs without a head chef.</p>
          <div className="mb-6">
            <h4 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-2">Best For:</h4>
            <ul className="text-sm text-foreground/50 space-y-1">
              <li>• Running restaurants</li>
              <li>• Multi-cuisine restaurants</li>
              <li>• Owners focused on profit and consistency</li>
            </ul>
          </div>
          <div className="mb-8 flex-1">
            <h4 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-3">Includes:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground font-medium">
                <span className="text-[#d4af37]">✓</span> Everything in Starter
              </li>
              {['Full SOP Library', 'KYROZ+ Base Access', 'Costing Master', 'Inventory Management', 'KYROZ KOSA (AI Assistance)', 'Menu Engineering', 'Priority Support'].map(feature => (
                <li key={feature} className="flex items-start gap-3 text-sm text-foreground/70">
                  <span className="text-[#d4af37]">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => handleUpgrade('Growth')}
            disabled={isLoading !== null || currentPlan === 'Growth' || currentPlan === 'Scale' || currentPlan === 'Admin'}
            className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg ${
              currentPlan === 'Growth' || currentPlan === 'Scale' || currentPlan === 'Admin'
              ? 'bg-foreground/10 text-foreground/40 cursor-not-allowed border border-border'
              : 'bg-[#d4af37] hover:bg-[#c5a028] text-black shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40'
            }`}
          >
            {isLoading === 'Growth' ? 'Processing...' : (currentPlan === 'Growth' ? 'Current Plan' : (currentPlan === 'Scale' || currentPlan === 'Admin' ? 'Included in Scale' : 'Get Premium'))}
          </button>
        </div>

        {/* Scale Plan */}
        <div className="bg-card border border-border rounded-3xl p-8 hover:border-[#444] transition flex flex-col relative overflow-hidden">
          <h3 className="text-xl font-bold text-foreground mb-2 uppercase tracking-widest">KYROZ Scale</h3>
          <div className="flex flex-col mb-6">
            {pricing.scale.price > getFinalPrice(pricing.scale) ? (
              <span className="text-xl font-bold text-foreground/40 line-through">₹{pricing.scale.price}</span>
            ) : null}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-foreground">₹{getFinalPrice(pricing.scale)}</span>
              <span className="text-foreground/50">/mo</span>
            </div>
            <span className="text-[#d4af37] text-sm font-bold mt-1">Founding Member Price</span>
          </div>
          <p className="text-foreground/50 text-sm mb-6 pb-6 border-b border-border">Multi-outlet growth.</p>
          <div className="mb-6">
            <h4 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-2">Best For:</h4>
            <ul className="text-sm text-foreground/50 space-y-1">
              <li>• Growing restaurant brands</li>
              <li>• Multi-outlet businesses</li>
              <li>• Expansion-focused owners</li>
            </ul>
          </div>
          <div className="mb-8 flex-1">
            <h4 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-3">Includes:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground font-medium">
                <span className="text-[#d4af37]">✓</span> Everything in Premium
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <span className="text-[#d4af37]">✓</span> Multi-Outlet Dashboard
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <span className="text-[#d4af37]">✓</span> Marketing Engine
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <span className="text-[10px] uppercase font-black bg-foreground/10 text-foreground/60 px-1.5 py-0.5 rounded border border-foreground/20">SOON</span> Advanced Business Intelligence
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <span className="text-[10px] uppercase font-black bg-foreground/10 text-foreground/60 px-1.5 py-0.5 rounded border border-foreground/20">SOON</span> Premium AI Restaurant Consultant
              </li>
            </ul>
          </div>

          <button 
            onClick={() => handleUpgrade('Scale')}
            disabled={isLoading !== null || currentPlan === 'Scale' || currentPlan === 'Admin'}
            className={`w-full py-3.5 rounded-xl font-bold transition-all ${
              currentPlan === 'Scale' || currentPlan === 'Admin'
              ? 'bg-foreground/10 text-foreground/40 cursor-not-allowed border border-border'
              : 'bg-[#d4af37] hover:bg-[#c5a028] text-black shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40'
            }`}
          >
             {isLoading === 'Scale' ? 'Processing...' : (currentPlan === 'Scale' || currentPlan === 'Admin' ? 'Current Plan' : 'Upgrade to Scale')}
          </button>
        </div>
      </div>
    </div>
  );
}
