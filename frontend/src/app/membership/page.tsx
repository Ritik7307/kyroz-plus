import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KYROZ Membership Plans | Premium Restaurant Management SaaS',
  description: 'Explore KYROZ membership plans. Upgrade your restaurant operations with our advanced KOT, POS, AI-driven Costing, and Inventory Management tools.',
  keywords: 'Restaurant POS, Restaurant Management SaaS, Billing Software, Kitchen Operating System, KYROZ Pricing, Restaurant Software India, Restaurant KOT system, Inventory management for restaurants',
};

export default function PublicMembershipPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col text-white">
      {/* Header */}
      <header className="p-6 md:p-8 flex justify-between items-center border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#d4af37] to-[#f9e596] rounded-xl flex items-center justify-center shadow-lg border border-white/10 shrink-0">
            <span className="text-black font-black text-xl">K</span>
          </div>
          <div>
            <h1 className="font-black text-lg tracking-normal leading-none text-white whitespace-nowrap">KYROZ-PLUS</h1>
            <p className="text-[#d4af37] font-black uppercase text-[8px] tracking-[0.2em] mt-1 opacity-80">Restaurant KOS</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 rounded-full font-bold text-sm text-white/70 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-2 rounded-full font-bold text-sm bg-[#d4af37] text-black hover:bg-[#c5a028] transition-colors shadow-lg shadow-[#d4af37]/20">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-12 relative">
        <div className="text-center mb-16 mt-8">
          <h2 className="text-5xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Choose Your Plan
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Scale your restaurant operations with the perfect set of tools. Start for free or unlock the full power of KYROZ KOSA (AI).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {/* Basic Plan */}
          <div className="bg-[#111111] border border-[#333333] rounded-3xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2 group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
              <p className="text-gray-500 text-sm">Perfect for getting started.</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">Free</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> 1 Device Login
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Basic SOP Creation
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <span className="text-gray-600">✕</span> AI Integration
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <span className="text-gray-600">✕</span> Costing Tools
              </li>
            </ul>

            <Link 
              href="/signup"
              className="w-full py-4 rounded-xl font-bold transition-all bg-white/10 hover:bg-white/20 text-white text-center relative z-10"
            >
              Start for Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#1a1a1a] border-2 border-[#d4af37] rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.15)] transform scale-105 z-10">
            <div className="absolute top-0 right-0 bg-[#d4af37] text-black text-xs font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-2">Pro</h3>
              <p className="text-gray-400 text-sm">For growing restaurants.</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">₹999</span>
                <span className="text-gray-500">/mo</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-[#d4af37] font-bold">✓</span> 2 Device Logins
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-[#d4af37] font-bold">✓</span> Unlimited SOPs
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-[#d4af37] font-bold">✓</span> Costing & Margin Tools
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <span className="text-gray-600">✕</span> KYROZ KOSA (AI)
              </li>
            </ul>

            <Link 
              href="/signup"
              className="w-full py-4 rounded-xl font-bold transition-all shadow-lg bg-[#d4af37] hover:bg-[#c5a028] text-black shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 text-center"
            >
              Get Pro Now
            </Link>
          </div>

          {/* Elite Plan */}
          <div className="bg-[#111111] border border-[#333333] rounded-3xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-2 group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Elite</h3>
              <p className="text-gray-500 text-sm">The ultimate restaurant OS.</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">₹2999</span>
                <span className="text-gray-500">/mo</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> 3 Device Logins
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Everything in Pro
              </li>
              <li className="flex items-center gap-3 text-gray-300 font-bold">
                <span className="text-[#d4af37] font-bold">✓</span> Full KYROZ KOSA (AI) Access
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Scaling Strategies
              </li>
            </ul>

            <Link 
              href="/signup"
              className="w-full py-4 rounded-xl font-bold transition-all bg-white hover:bg-gray-200 text-black text-center relative z-10"
            >
              Get Elite Now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-black/50 py-10 px-6 text-center">
        <p className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">
          © 2026 KYROZ TECHNOLOGIES PVT LTD. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
