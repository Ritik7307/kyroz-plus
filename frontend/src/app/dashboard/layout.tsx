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
    </div>
  );
}
