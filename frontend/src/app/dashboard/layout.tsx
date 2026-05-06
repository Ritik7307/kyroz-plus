'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { Menu, Bell, User, Plus, Search as SearchIcon, Command } from 'lucide-react';
import { GlobalSearch, ToastContainer, Toast } from '@/components/dashboard/GlobalSearch';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      fetchUser(token);
    }
  }, [router]);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gold font-bold uppercase tracking-[0.3em]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          Authenticating...
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'POS Terminal', path: '/dashboard/pos' },
    { name: 'SOP Library', path: '/dashboard/sop' },
    { name: 'Inventory', path: '/dashboard/inventory' },
    { name: 'KOSA AI', path: '/dashboard/ai' },
    { name: 'Account', path: '/dashboard/account' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <GlobalSearch isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} userRole={user?.role || 'user'} />

      <header className="h-24 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
        {/* Left Section: Menu & Logo */}
        <div className="flex items-center gap-4 min-w-fit">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="text-white/40 hover:text-gold p-2.5 hover:bg-white/5 rounded-2xl transition-all"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-lg border border-white/10 shrink-0">
              <span className="text-black font-black text-xl">K</span>
            </div>
            <div className="hidden xl:block">
              <h1 className="font-black text-lg tracking-normal leading-none text-white whitespace-nowrap">KYYROZ-PLUS</h1>
              <p className="text-gold font-black uppercase text-[8px] tracking-[0.2em] mt-1 opacity-60">Restaurant KOS</p>
            </div>
          </div>
        </div>

        {/* Center Section: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest mx-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              href={link.path} 
              className={`transition-all py-2 border-b-2 whitespace-nowrap ${
                pathname === link.path 
                  ? 'text-gold border-gold' 
                  : 'text-white/20 hover:text-white border-transparent'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-4 min-w-fit">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-gold transition-all border border-white/5"
          >
            <SearchIcon size={18} />
          </button>
          
          <div className="relative hidden sm:block">
            <Bell size={18} className="text-white/20 hover:text-gold cursor-pointer transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
          </div>

          <div className="flex items-center gap-3 bg-white/5 pl-2 pr-4 py-1.5 rounded-xl border border-white/10 hover:border-gold/30 transition-all cursor-pointer group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center text-black font-black text-sm">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-[10px] font-black text-white uppercase leading-none truncate max-w-[80px]">{user?.name || 'User'}</p>
              <p className="text-[8px] text-gold/40 uppercase mt-1 font-bold tracking-tighter">{user?.role || 'Member'}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 relative">
        {children}
      </main>

      {/* --- PREMIUM FOOTER --- */}
      <footer className="w-full border-t border-white/5 bg-black/20 backdrop-blur-md pt-20 pb-10 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-lg border border-white/10 shrink-0">
                  <span className="text-black font-black text-xl">K</span>
                </div>
                <h3 className="font-black text-lg tracking-normal leading-none text-white whitespace-nowrap">KYYROZ-PLUS</h3>
              </div>
              <p className="text-white/40 text-xs leading-relaxed max-w-xs font-medium">
                The world's most advanced Kitchen Operating System. Standardizing excellence for elite restaurants globally.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com/kyyroz" target="_blank" className="p-2.5 bg-white/5 hover:bg-gold/10 rounded-xl text-white/20 hover:text-gold transition-all border border-white/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://facebook.com/kyyroz" target="_blank" className="p-2.5 bg-white/5 hover:bg-gold/10 rounded-xl text-white/20 hover:text-gold transition-all border border-white/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
              </div>
            </div>

            {/* Support Section */}
            <div className="space-y-6">
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em]">Immediate Support</h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+917307255940" className="flex items-center gap-3 text-white/40 hover:text-gold transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-all"><span className="text-[14px]">📞</span></div>
                    <span className="text-[11px] font-bold">+91 73072 55940</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:support@kyyroz.com" className="flex items-center gap-3 text-white/40 hover:text-gold transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-all"><span className="text-[14px]">✉️</span></div>
                    <span className="text-[11px] font-bold">support@kyyroz.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em]">Platform</h4>
              <ul className="space-y-4">
                {navLinks.slice(0, 4).map(link => (
                  <li key={link.path}>
                    <Link href={link.path} className="text-[11px] font-bold text-white/40 hover:text-gold transition-all uppercase tracking-widest">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Section */}
            <div className="space-y-6">
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em]">Enterprise Grade</h4>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Global Status: Active</span>
                </div>
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-tighter leading-relaxed">
                  256-bit encrypted infrastructure ensuring 99.9% uptime for your kitchen operations.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
              © 2026 KYYROZ TECHNOLOGIES PVT LTD. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="text-[9px] font-black text-white/20 hover:text-gold uppercase tracking-widest">Privacy Policy</Link>
              <Link href="#" className="text-[9px] font-black text-white/20 hover:text-gold uppercase tracking-widest">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
