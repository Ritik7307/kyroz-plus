'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function MembershipPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>('Starter');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [pricing, setPricing] = useState({
    starter: { price: 999, discount: 0 },
    growth: { price: 2999, discount: 0 },
    scale: { price: 9999, discount: 0 }
  });

  const getFinalPrice = (plan: any) => {
    return Math.round(plan.price * (1 - plan.discount / 100));
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
      let plan = user.plan || 'Starter';
      if (plan === 'Basic') plan = 'Starter';
      if (plan === 'Pro') plan = 'Growth';
      if (plan === 'Elite') plan = 'Scale';
      setCurrentPlan(plan);
      if (user.role === 'admin') {
        setCurrentPlan('Admin');
      }
    }

    // Fetch dynamic pricing
    fetch(`${API_URL}/api/admin/settings/pricing`)
      .then(res => res.json())
      .then(data => {
        if (data && data.starter) setPricing(data);
      })
      .catch(err => console.error('Failed to fetch pricing:', err));
    
    return () => {
      document.body.removeChild(script);
    }
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
        <h2 className="text-4xl font-bold text-white tracking-wide">
          {currentPlan === 'Admin' ? 'Admin Control Center' : 'Choose Your Plan'}
        </h2>
        <p className="text-gray-400 mt-4 text-lg">
          {currentPlan === 'Admin' 
            ? 'As a Platform Administrator, you have full access to all elite features without any cost.' 
            : 'Scale your restaurant operations with the perfect set of tools.'}
        </p>
        <div className="mt-4 inline-block bg-[#111111] px-6 py-2 rounded-full border border-[#333333]">
          <span className="text-gray-400">Current Status: </span>
          <span className="text-[#d4af37] font-bold tracking-wider uppercase">
            {currentPlan === 'Admin' ? 'LIFETIME ACCESS (ADMIN)' : currentPlan}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        {/* Starter Plan */}
        <div className="bg-[#111111] border border-[#333333] rounded-3xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest flex items-center gap-2">
              Starter
              {pricing.starter.discount > 0 && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{pricing.starter.discount}% OFF</span>
              )}
            </h3>
            <p className="text-gray-500 text-sm">Perfect for getting started.</p>
            <div className="mt-6 flex items-baseline gap-2">
              {pricing.starter.discount > 0 ? (
                <>
                  <span className="text-2xl font-bold text-gray-500 line-through">₹{pricing.starter.price}</span>
                  <span className="text-4xl font-extrabold text-white">₹{getFinalPrice(pricing.starter)}</span>
                </>
              ) : (
                <span className="text-4xl font-extrabold text-white">₹{pricing.starter.price}</span>
              )}
              <span className="text-gray-500">/mo</span>
            </div>
          </div>
          
          <div className="mb-8 flex-1">
            <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Includes:</h4>
            <ul className="space-y-3">
              {['POS Terminal', 'KOT Display', 'WhatsApp Billing', 'Customer Directory', 'Sales Analytics', 'Team Management', '1 Cuisine SOP Library Access', 'Premix Purchase Access', 'Basic Support'].map(feature => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => handleUpgrade('Starter')}
            disabled={isLoading !== null || currentPlan === 'Starter' || currentPlan === 'Growth' || currentPlan === 'Scale'}
            className={`w-full py-4 rounded-xl font-bold transition-colors ${
              currentPlan === 'Starter' || currentPlan === 'Growth' || currentPlan === 'Scale' 
              ? 'bg-[#222222] text-gray-400 cursor-not-allowed border border-[#333333]'
              : 'bg-white hover:bg-gray-200 text-black'
            }`}
          >
            {isLoading === 'Starter' ? 'Processing...' : (currentPlan === 'Starter' ? 'Current Plan' : (currentPlan === 'Growth' || currentPlan === 'Scale' ? 'Included in Higher Plan' : 'Buy Starter'))}
          </button>
        </div>

        {/* Growth Plan */}
        <div className="bg-[#1a1a1a] border-2 border-[#d4af37] rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-[#d4af37]/10 transform scale-105 z-10">
          <div className="absolute top-0 right-0 bg-[#d4af37] text-black text-xs font-bold px-4 py-1 rounded-bl-lg uppercase tracking-wider">
            Most Popular
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#d4af37] mb-2 uppercase tracking-widest flex items-center gap-2">
              Growth
              {pricing.growth.discount > 0 && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{pricing.growth.discount}% OFF</span>
              )}
            </h3>
            <p className="text-gray-400 text-sm">For growing restaurants.</p>
            <div className="mt-6 flex items-baseline gap-2">
              {pricing.growth.discount > 0 ? (
                <>
                  <span className="text-2xl font-bold text-gray-500 line-through">₹{pricing.growth.price}</span>
                  <span className="text-4xl font-extrabold text-white">₹{getFinalPrice(pricing.growth)}</span>
                </>
              ) : (
                <span className="text-4xl font-extrabold text-white">₹{pricing.growth.price}</span>
              )}
              <span className="text-gray-500">/mo</span>
            </div>
          </div>
          
          <div className="mb-8 flex-1">
            <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Includes:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white font-medium">
                <span className="text-[#d4af37]">✓</span> Everything in Starter
              </li>
              {['Full SOP Library', 'Costing Master', 'Inventory Management', 'AI Chef', 'Gross Profit Analytics', 'Food Cost Analysis', 'Advanced Reports', 'Premix Purchase Access', 'Priority Support'].map(feature => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => handleUpgrade('Growth')}
            disabled={isLoading !== null || currentPlan === 'Growth' || currentPlan === 'Scale'}
            className={`w-full py-4 rounded-xl font-bold transition-colors shadow-lg ${
              currentPlan === 'Growth' || currentPlan === 'Scale' 
              ? 'bg-[#222222] text-gray-400 cursor-not-allowed border border-[#333333]'
              : 'bg-[#d4af37] hover:bg-[#c5a028] text-black shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40'
            }`}
          >
            {isLoading === 'Growth' ? 'Processing...' : (currentPlan === 'Growth' ? 'Current Plan' : (currentPlan === 'Scale' ? 'Included in Scale' : 'Upgrade to Growth'))}
          </button>
        </div>

        {/* Scale Plan */}
        <div className="bg-[#111111] border border-[#333333] rounded-3xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2">

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest flex items-center gap-2">
              Scale
              {pricing.scale.discount > 0 && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{pricing.scale.discount}% OFF</span>
              )}
            </h3>
            <p className="text-gray-500 text-sm">The ultimate restaurant OS.</p>
            <div className="mt-6 flex items-baseline gap-2">
              {pricing.scale.discount > 0 ? (
                <>
                  <span className="text-2xl font-bold text-gray-500 line-through">₹{pricing.scale.price}</span>
                  <span className="text-4xl font-extrabold text-white">₹{getFinalPrice(pricing.scale)}</span>
                </>
              ) : (
                <span className="text-4xl font-extrabold text-white">₹{pricing.scale.price}</span>
              )}
              <span className="text-gray-500">/mo</span>
            </div>
          </div>
          
          <div className="mb-8 flex-1">
            <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Includes:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white font-medium">
                <span className="text-[#d4af37]">✓</span> Everything in Growth
              </li>
              {['Multi Outlet Dashboard', 'Menu Engineering', 'Premium AI Restaurant Consultant', 'Marketing Engine', 'Advanced Business Intelligence'].map(feature => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => handleUpgrade('Scale')}
            disabled={isLoading !== null || currentPlan === 'Scale'}
            className={`w-full py-4 rounded-xl font-bold transition-colors ${
              currentPlan === 'Scale'
              ? 'bg-[#222222] text-gray-400 cursor-not-allowed border border-[#333333]'
              : 'bg-white hover:bg-gray-200 text-black'
            }`}
          >
             {isLoading === 'Scale' ? 'Processing...' : (currentPlan === 'Scale' ? 'Current Plan' : 'Upgrade to Scale')}
          </button>
        </div>
      </div>
    </div>
  );
}
