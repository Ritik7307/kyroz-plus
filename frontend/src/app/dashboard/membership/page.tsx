'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function MembershipPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>('Basic');
  const [isLoading, setIsLoading] = useState<string | null>(null);

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
      setCurrentPlan(user.plan);
      if (user.role === 'admin') {
        setCurrentPlan('Admin');
      }
    }
    
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const handleUpgrade = async (plan: 'Basic' | 'Pro' | 'Elite') => {
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
        {/* Basic Plan */}
        <div className="bg-[#111111] border border-[#333333] rounded-3xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
            <p className="text-gray-500 text-sm">Perfect for getting started.</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">₹999</span>
              <span className="text-gray-500">/mo</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-500">✓</span> 1 Device Login
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-500">✓</span> 1 SOP Category
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-500">✓</span> Inventory Management
            </li>
            <li className="flex items-center gap-3 text-gray-500">
              <span className="text-gray-600">✕</span> Costing & Wastage Master
            </li>
            <li className="flex items-center gap-3 text-gray-500">
              <span className="text-gray-600">✕</span> AI Integration
            </li>
          </ul>

          <button 
            onClick={() => handleUpgrade('Basic')}
            disabled={isLoading !== null || currentPlan === 'Basic' || currentPlan === 'Pro' || currentPlan === 'Elite'}
            className={`w-full py-4 rounded-xl font-bold transition-colors ${
              currentPlan === 'Basic' || currentPlan === 'Pro' || currentPlan === 'Elite' 
              ? 'bg-[#222222] text-gray-400 cursor-not-allowed border border-[#333333]'
              : 'bg-white hover:bg-gray-200 text-black'
            }`}
          >
            {isLoading === 'Basic' ? 'Processing...' : (currentPlan === 'Basic' ? 'Current Plan' : (currentPlan === 'Pro' || currentPlan === 'Elite' ? 'Included in Higher Plan' : 'Buy Basic'))}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-[#1a1a1a] border-2 border-[#d4af37] rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-[#d4af37]/10 transform scale-105 z-10">
          <div className="absolute top-0 right-0 bg-[#d4af37] text-black text-xs font-bold px-4 py-1 rounded-bl-lg uppercase tracking-wider">
            Most Popular
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#d4af37] mb-2">Pro</h3>
            <p className="text-gray-400 text-sm">For growing restaurants.</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">₹1999</span>
              <span className="text-gray-500">/mo</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-[#d4af37]">✓</span> 1 Device Login
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-[#d4af37]">✓</span> Unlimited SOPs
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-[#d4af37]">✓</span> Costing & Margin Tools
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-[#d4af37]">✓</span> Full KYROZ KOSA (AI) Access
            </li>
          </ul>

          <button 
            onClick={() => handleUpgrade('Pro')}
            disabled={isLoading !== null || currentPlan === 'Pro' || currentPlan === 'Elite'}
            className={`w-full py-4 rounded-xl font-bold transition-colors shadow-lg ${
              currentPlan === 'Pro' || currentPlan === 'Elite' 
              ? 'bg-[#222222] text-gray-400 cursor-not-allowed border border-[#333333]'
              : 'bg-[#d4af37] hover:bg-[#c5a028] text-black shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40'
            }`}
          >
            {isLoading === 'Pro' ? 'Processing...' : (currentPlan === 'Pro' ? 'Current Plan' : (currentPlan === 'Elite' ? 'Included in Elite' : 'Upgrade to Pro'))}
          </button>
        </div>

        {/* Elite Plan */}
        <div className="bg-[#111111] border border-[#333333] rounded-3xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Elite</h3>
            <p className="text-gray-500 text-sm">The ultimate restaurant OS.</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">₹2999</span>
              <span className="text-gray-500">/mo</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-500">✓</span> 4 Device Logins
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-500">✓</span> Everything in Pro
            </li>
            <li className="flex items-center gap-3 text-gray-300 font-bold text-[#d4af37]">
              <span className="text-[#d4af37]">✓</span> Priority Support
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-500">✓</span> Scaling Strategies
            </li>
          </ul>

          <button 
            onClick={() => handleUpgrade('Elite')}
            disabled={isLoading !== null || currentPlan === 'Elite'}
            className={`w-full py-4 rounded-xl font-bold transition-colors ${
              currentPlan === 'Elite'
              ? 'bg-[#222222] text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-200 text-black'
            }`}
          >
             {isLoading === 'Elite' ? 'Processing...' : (currentPlan === 'Elite' ? 'Current Plan' : 'Upgrade to Elite')}
          </button>
        </div>
      </div>
    </div>
  );
}
