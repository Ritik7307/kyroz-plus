import Link from 'next/link';
import { API_URL } from '@/lib/api';

async function getPricingConfig() {
  try {
    const res = await fetch(`${API_URL}/api/admin/settings/pricing`, { next: { revalidate: 60 } });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch pricing config:', err);
  }
  // Fallback default pricing
  return {
    basic: { price: 999, discount: 0 },
    pro: { price: 2999, discount: 0 },
    elite: { price: 4999, discount: 0 }
  };
}

export default async function Home() {
  const pricing = await getPricingConfig();
  
  const getFinalPrice = (price: number, discount: number) => Math.round(price * (1 - discount / 100));

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-[#222]">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tighter text-[#d4af37]">KYROZ-PLUS</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link href="#features" className="hover:text-[#d4af37] transition">Features</Link>
          <Link href="#solution" className="hover:text-[#d4af37] transition">Solution</Link>
          <Link href="#pricing" className="hover:text-[#d4af37] transition">Pricing</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-medium hover:text-[#d4af37] transition">Log in</Link>
          <Link href="/signup" className="px-5 py-2 text-sm font-medium bg-[#d4af37] text-black rounded-full hover:bg-[#c5a028] transition shadow-[0_0_15px_rgba(212,175,55,0.3)]">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold tracking-wide uppercase">
            KYROZ: Your Growth Partner in Restaurant Excellence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Standardize. Optimize. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">Scale.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The AI-powered restaurant operating system. Reduce chef dependency, control food costs, and enforce SOPs effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-[#d4af37] text-black font-bold rounded-full hover:bg-[#c5a028] transition shadow-[0_0_20px_rgba(212,175,55,0.4)] text-lg">
              Start Free Trial
            </Link>
            <Link href="#solution" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#333] text-white font-bold rounded-full hover:bg-[#111] transition text-lg">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-[#0a0a0a] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Running a restaurant is chaos.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">You shouldn't have to be held hostage by your head chef or lose margins to uncontrolled wastage.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-[#222] bg-[#111] rounded-2xl">
              <div className="text-[#d4af37] text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-bold mb-3">Chef Dependency</h3>
              <p className="text-gray-400">Recipes change when the chef changes. Consistency is impossible without strict, documented standards.</p>
            </div>
            <div className="p-8 border border-[#222] bg-[#111] rounded-2xl">
              <div className="text-[#d4af37] text-4xl mb-4">📉</div>
              <h3 className="text-xl font-bold mb-3">Hidden Food Costs</h3>
              <p className="text-gray-400">Unmeasured wastage and inaccurate costing kill your profit margins silently every single day.</p>
            </div>
            <div className="p-8 border border-[#222] bg-[#111] rounded-2xl">
              <div className="text-[#d4af37] text-4xl mb-4">🤯</div>
              <h3 className="text-xl font-bold mb-3">Operational Chaos</h3>
              <p className="text-gray-400">Staff discipline and daily routines are hard to enforce without a centralized operating system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section (Features) */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Meet KYROZ KOSA. <br/><span className="text-[#d4af37]">Your AI Consultant.</span></h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Stop guessing. Ask KYROZ. Our RAG-powered AI ingests your specific SOPs, recipes, and costing files to give you precise, actionable answers instantly.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">✓</div>
                  <span className="text-gray-300">Instant answers from your SOP Library</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">✓</div>
                  <span className="text-gray-300">Cost-saving insights on wastage logs</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">✓</div>
                  <span className="text-gray-300">24/7 staff training companion</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-[#111] border border-[#333] rounded-2xl p-6 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
                <div className="flex gap-3 mb-6 border-b border-[#222] pb-4">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center font-bold text-black text-xl">K</div>
                  <div>
                    <h4 className="font-bold text-white">KYROZ AI</h4>
                    <p className="text-xs text-gray-500">Always active</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#222] rounded-xl p-4 ml-auto w-[80%] text-sm text-gray-200">
                    What is the standard marination time for the house chicken tikka?
                  </div>
                  <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-4 mr-auto w-[90%] text-sm text-[#d4af37]">
                    <span className="block font-bold mb-1">Problem → Rule → Solution</span>
                    Based on [Dish SOP - Chicken Tikka v2], the standard marination time is strictly 6 hours. Do not exceed 8 hours to prevent texture degradation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#0a0a0a] px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent pricing.</h2>
          <p className="text-gray-400 mb-16 text-lg">Scale your restaurant operations without breaking the bank.</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Basic Plan */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-[#444] transition flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Basic
                {pricing.basic.discount > 0 && (
                  <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{pricing.basic.discount}% OFF</span>
                )}
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                {pricing.basic.discount > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-gray-500 line-through">₹{pricing.basic.price}</span>
                    <span className="text-4xl font-extrabold text-white">₹{getFinalPrice(pricing.basic.price, pricing.basic.discount)}</span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold text-white">₹{pricing.basic.price}</span>
                )}
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Full SOP Library Access
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Limited AI Queries (100/mo)
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Basic Dashboard
                </li>
              </ul>
              <Link href="/signup" className="w-full block text-center py-3 rounded-xl border border-[#333] hover:bg-[#222] transition font-medium">Get Basic</Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-[#1a1505] to-[#111] border border-[#d4af37]/50 rounded-3xl p-8 relative transform md:-translate-y-4 shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold text-[#d4af37] mb-2 flex items-center gap-2">
                Pro
                {pricing.pro.discount > 0 && (
                  <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{pricing.pro.discount}% OFF</span>
                )}
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                {pricing.pro.discount > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-gray-500 line-through">₹{pricing.pro.price}</span>
                    <span className="text-5xl font-extrabold text-[#d4af37]">₹{getFinalPrice(pricing.pro.price, pricing.pro.discount)}</span>
                  </>
                ) : (
                  <span className="text-5xl font-extrabold text-[#d4af37]">₹{pricing.pro.price}</span>
                )}
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Everything in Basic
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="text-[#d4af37]">✓</span> Unlimited AI Queries
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="text-[#d4af37]">✓</span> Full Costing & Menu Tools
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Inventory & Wastage System
                </li>
              </ul>
              <Link href="/signup" className="w-full block text-center py-3 rounded-xl bg-[#d4af37] text-black hover:bg-[#c5a028] transition font-bold">Get Pro</Link>
            </div>

            {/* Elite Plan */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-[#444] transition flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Elite
                {pricing.elite.discount > 0 && (
                  <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{pricing.elite.discount}% OFF</span>
                )}
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                {pricing.elite.discount > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-gray-500 line-through">₹{pricing.elite.price}</span>
                    <span className="text-4xl font-extrabold text-white">₹{getFinalPrice(pricing.elite.price, pricing.elite.discount)}</span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold text-white">₹{pricing.elite.price}</span>
                )}
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Everything in Pro
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Strategy & Scaling Consultation
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Priority 24/7 Support
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Multiple Locations (up to 3)
                </li>
              </ul>
              <Link href="/signup" className="w-full block text-center py-3 rounded-xl border border-[#333] hover:bg-[#222] transition font-medium">Get Elite</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-extrabold tracking-tighter text-[#d4af37]">KYROZ-PLUS</div>
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} KYROZ OS. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
