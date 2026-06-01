'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { Menu, ShieldCheck, Search as SearchIcon, Command, LogOut } from 'lucide-react';
import { GlobalSearch, ToastContainer, Toast } from '@/components/dashboard/GlobalSearch';
import { API_URL } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      verifyAdmin(token);
    }
  }, [router]);

  const verifyAdmin = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setAdminUser(data);
      setIsAuthorized(true);
    } catch (err) {
      console.error('Failed to verify admin', err);
      router.push('/login');
    }
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gold font-bold uppercase tracking-[0.3em]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          Verifying Admin Access...
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Admin Hub', path: '/admin/dashboard' },
    { name: 'Global SOPs', path: '/admin/sops' },
    { name: 'SOP Packets', path: '/admin/packets' },
    { name: 'Testimonials', path: '/admin/testimonials' },
    { name: 'User Management', path: '/admin/users' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <GlobalSearch isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Sidebar set to Admin role */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} userRole="admin" />

      {/* Top Header */}
      <header className="h-24 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="text-white/40 hover:text-gold p-3 hover:bg-white/5 rounded-2xl transition-all"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,55,0.2)] border border-white/10">
              <ShieldCheck size={24} className="text-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-xl tracking-tighter leading-none">KYROZ-PLUS</h1>
              <p className="text-gold font-black uppercase text-[9px] tracking-[0.3em] mt-1 opacity-60">Admin Central</p>
            </div>
          </div>
        </div>

        {/* Unified Navbar Section */}
        <div className="flex items-center gap-12">
          <nav className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                href={link.path} 
                className={`transition-all pb-2 border-b-2 ${
                  pathname === link.path 
                    ? 'text-gold border-gold' 
                    : 'text-white/30 hover:text-white border-transparent'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6 border-l border-white/5 pl-12">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-gold transition-all flex items-center gap-3 border border-white/5"
            >
              <SearchIcon size={18} />
              <div className="hidden xl:flex items-center gap-1.5 opacity-40 text-[9px] font-black uppercase">
                <Command size={10} /> K
              </div>
            </button>
            
            <button 
              onClick={() => { localStorage.clear(); router.push('/login'); }} 
              className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-bold ml-4"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-12 relative">
        {children}
      </main>

    </div>
  );
}
