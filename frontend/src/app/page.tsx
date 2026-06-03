import Link from 'next/link';
import { API_URL } from '@/lib/api';

async function getPricingConfig() {
  const defaultPricing = {
    starter: { price: 999, discount: 0 },
    growth: { price: 2999, discount: 0 },
    scale: { price: 9999, discount: 0 }
  };

  try {
    const res = await fetch(`${API_URL}/api/admin/settings/pricing`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return {
        starter: data?.starter || defaultPricing.starter,
        growth: data?.growth || defaultPricing.growth,
        scale: data?.scale || defaultPricing.scale
      };
    }
  } catch (err) {
    console.error('Failed to fetch pricing config:', err);
  }
  return defaultPricing;
}

export default async function Home() {
  const pricing = await getPricingConfig();

  const getFinalPrice = (plan: any) => {
    if (!plan) return 0;
    if (plan.finalPrice !== undefined) return plan.finalPrice;
    return Math.round((plan.price || 0) * (1 - (plan.discount || 0) / 100));
  };

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
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Meet KYROZ KOSA. <br /><span className="text-[#d4af37]">Your AI Consultant.</span></h2>
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

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left mb-16">
            {/* Starter Plan */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-[#444] transition flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">KYROZ STARTER</h3>
              <div className="flex flex-col mb-6">
                <span className="text-xl font-bold text-gray-500 line-through">₹1,999</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">₹{getFinalPrice(pricing.starter)}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <span className="text-[#d4af37] text-sm font-bold mt-1">Founding Member Price</span>
              </div>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">Best For:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• New Restaurant</li>
                  <li>• Cafe</li>
                  <li>• Single Cuisine Setup</li>
                  <li>• Small Outlet</li>
                </ul>
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
              <Link href="/signup" className="w-full block text-center py-3 rounded-xl border border-[#333] hover:bg-[#222] transition font-medium">Get Starter</Link>
            </div>

            {/* Growth Plan */}
            <div className="bg-gradient-to-b from-[#1a1505] to-[#111] border border-[#d4af37]/50 rounded-3xl p-8 relative transform md:-translate-y-4 shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold text-[#d4af37] mb-2 uppercase tracking-widest">KYROZ GROWTH</h3>
              <div className="flex flex-col mb-6">
                <span className="text-xl font-bold text-gray-500 line-through">₹4,999</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#d4af37]">₹{getFinalPrice(pricing.growth)}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <span className="text-[#d4af37] text-sm font-bold mt-1">Founding Member Price</span>
              </div>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">Best For:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Running Restaurants</li>
                  <li>• Multi Cuisine Restaurants</li>
                  <li>• Owners focused on Profit & Consistency</li>
                </ul>
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
              <Link href="/signup" className="w-full block text-center py-3 rounded-xl bg-[#d4af37] text-black hover:bg-[#c5a028] transition font-bold">Get Growth</Link>
            </div>

            {/* Scale Plan */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-[#444] transition flex flex-col relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">KYROZ SCALE</h3>
              <div className="flex flex-col mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">₹{pricing.scale.price}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">Best For:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Growing Restaurant Brands</li>
                  <li>• Multi Outlet Businesses</li>
                  <li>• Expansion-Focused Owners</li>
                </ul>
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
              <Link href="/signup" className="w-full block text-center py-3 rounded-xl border border-white text-white hover:bg-white hover:text-black transition font-bold">Get Scale</Link>
            </div>
          </div>

          {/* Why KYROZ & Founding Offer */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 text-left mt-24 border-t border-white/10 pt-16">
            <div className="bg-white/5 p-10 rounded-3xl border border-white/10">
              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-wider">Why KYROZ?</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-green-500">✔</span> SOP + Premix + Software</li>
                <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-green-500">✔</span> Reduce Chef Dependency</li>
                <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-green-500">✔</span> Maintain Taste Consistency</li>
                <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-green-500">✔</span> Control Food Cost</li>
                <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-green-500">✔</span> Reduce Wastage</li>
                <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-green-500">✔</span> Improve Profitability</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1a1505] to-[#111] p-10 rounded-3xl border border-[#d4af37]/30 shadow-[0_0_30px_rgba(212,175,55,0.1)] flex flex-col justify-center">
              <h3 className="text-2xl font-black text-[#d4af37] mb-2 uppercase tracking-widest">Founding Member Offer</h3>
              <p className="text-white font-medium mb-8">First 50 Restaurants Only</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center bg-black/40 px-6 py-4 rounded-xl border border-white/5">
                  <span className="text-gray-300 font-bold uppercase tracking-wider">Starter</span>
                  <span className="text-2xl font-black text-white">₹999<span className="text-sm text-gray-500 font-normal">/mo</span></span>
                </div>
                <div className="flex justify-between items-center bg-black/40 px-6 py-4 rounded-xl border border-white/5">
                  <span className="text-gray-300 font-bold uppercase tracking-wider">Growth</span>
                  <span className="text-2xl font-black text-[#d4af37]">₹2999<span className="text-sm text-gray-500 font-normal">/mo</span></span>
                </div>
              </div>
              
              <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 font-bold rounded-lg text-center uppercase tracking-wider text-sm">
                24 months Founder Pricing Lock
              </div>
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
