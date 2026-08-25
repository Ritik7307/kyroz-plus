'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChefHat, BarChart3, Megaphone, Network, Crown, ArrowRight, Bot } from 'lucide-react';

const premiumFeatures = [
  {
    title: 'AI Assistance',
    description: 'Ask your AI assistant for real-time insights on daily sales, most sold dishes, customer analytics, and complete business data.',
    icon: Bot,
    href: '/dashboard/business-ai',
    status: 'Active',
  },
  {
    title: 'Marketing Engine',
    description: 'Launch targeted marketing campaigns and manage your CRM effortlessly.',
    icon: Megaphone,
    href: '/dashboard/marketing',
    status: 'Active',
  },
  {
    title: 'Menu Engineering',
    description: 'Analyze item profitability and popularity to optimize your menu offerings.',
    icon: ChefHat,
    href: '#',
    status: 'Coming Soon',
  },
  {
    title: 'Multi Outlet Dashboard',
    description: 'Get a bird\'s eye view of all your restaurant locations in one unified dashboard.',
    icon: Network,
    href: '#',
    status: 'Coming Soon',
  },
  {
    title: 'Advance Business Intelligence',
    description: 'Deep dive into advanced analytics, forecasting, and custom reports.',
    icon: BarChart3,
    href: '#',
    status: 'Coming Soon',
  },
];

export default function PremiumDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-4">
            <Crown size={14} /> Exclusively for Premium Members
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">Suite</span>
          </h1>
          <p className="text-gray-400 mt-3 text-lg max-w-2xl">
            Access your advanced tools to optimize, scale, and grow your restaurant empire.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumFeatures.map((feature, idx) => (
          <Link 
            key={idx} 
            href={feature.href}
            className={`group relative p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full ${
              feature.status === 'Active' 
                ? 'bg-card border-border hover:border-[#d4af37] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:-translate-y-1' 
                : 'bg-background border-border opacity-80 cursor-default'
            }`}
          >
            {/* Background Glow on Hover */}
            {feature.status === 'Active' && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            )}

            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                  feature.status === 'Active' 
                    ? 'bg-gradient-to-br from-[#2a220a] to-[#111111] border border-[#d4af37]/30 text-[#d4af37]' 
                    : 'bg-card shadow-sm border border-border text-gray-500'
                }`}>
                  <feature.icon size={28} />
                </div>
                
                <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  feature.status === 'Active'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-card shadow-sm text-gray-500 border border-border'
                }`}>
                  {feature.status}
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-3 ${
                feature.status === 'Active' ? 'text-foreground' : 'text-gray-400'
              }`}>
                {feature.title}
              </h3>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                {feature.description}
              </p>

              {feature.status === 'Active' && (
                <div className="flex items-center gap-2 text-[#d4af37] text-sm font-bold uppercase tracking-widest group-hover:gap-4 transition-all mt-auto">
                  Launch App <ArrowRight size={16} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
