'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Menu, 
  Bell, 
  User, 
  Plus, 
  Search as SearchIcon, 
  Command,
  LayoutDashboard,
  Calculator,
  ChefHat,
  Utensils,
  Package,
  TrendingUp,
  MessageSquare,
  IndianRupee,
  Users,
  ChevronDown,
  ClipboardList,
  Lock,
  Crown,
  Trash2
} from 'lucide-react';
import { GlobalSearch, ToastContainer, Toast } from '@/components/dashboard/GlobalSearch';
import NotificationPanel from '@/components/dashboard/NotificationPanel';
import FloatingKOSA from '@/components/dashboard/FloatingKOSA';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';
import ConnectivityStatus from '@/components/ConnectivityStatus';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [impersonationData, setImpersonationData] = useState<{ token: string, locationName: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchUser(token);
    }
    
    // Check impersonation status
    const eliteToken = localStorage.getItem('eliteToken');
    const locationName = localStorage.getItem('impersonatedLocation');
    if (eliteToken && locationName) {
      setImpersonationData({ token: eliteToken, locationName });
    }
  }, [router]);

  const fetchNotifications = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const unread = data.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err instanceof Error ? err.message : String(err));
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Unauthorized');
      }
      const data = await res.json();
      setUser(data);
      setIsAuthorized(true);
      fetchNotifications(token);
    } catch (err) {
      console.error('Failed to fetch user:', err instanceof Error ? err.message : String(err));
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleReturnToMaster = () => {
    if (impersonationData?.token) {
      localStorage.setItem('token', impersonationData.token);
      localStorage.removeItem('eliteToken');
      localStorage.removeItem('impersonatedLocation');
      window.location.href = '/dashboard/elite';
    }
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

  const allNavLinks = [
    { name: 'Dashboard', path: '/dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'POS Terminal', path: '/dashboard/pos', id: 'pos', icon: Calculator },
    { name: 'KOT Display', path: '/dashboard/kot', id: 'kot', icon: ClipboardList },
    { name: 'SOP Library', path: '/dashboard/sop', id: 'sop', icon: ChefHat },
    { name: 'Inventory', path: '/dashboard/inventory', id: 'inventory', icon: Utensils },
    { name: 'SOP Packets', path: '/dashboard/packets', id: 'packets', icon: Package },
    { name: 'Sales History', path: '/dashboard/history', id: 'history', icon: TrendingUp },
    { name: 'Chef', path: '/dashboard/ai', id: 'ai', icon: MessageSquare },
    { name: 'Costing Master', path: '/dashboard/costing', id: 'costing', icon: IndianRupee },
    { name: 'Wastage Master', path: '/dashboard/wastage', id: 'wastage', icon: Trash2 },
    { name: 'Customers', path: '/dashboard/customers', id: 'customers', icon: Users },
    { name: 'Manage Team', path: '/dashboard/team', id: 'team', ownerOnly: true, icon: Users },
    { name: 'Premium', path: '/dashboard/premium', id: 'premium', icon: Crown },
    { name: 'Account', path: '/dashboard/account', id: 'account', icon: User },
  ];

  const navLinks = allNavLinks.filter(link => {
    // If Admin, show everything
    if (user?.role === 'admin') return true;
    
    // If Owner (user) or Impersonating an Elite Location, show everything except specifically restricted ones
    if (user?.role === 'user' || impersonationData) return true;

    // If Staff, check permissions
    if (link.ownerOnly) return false;
    if (user?.permissions && user.permissions.length > 0) {
      return user.permissions.includes(link.id) || link.id === 'account';
    }

    // Default for staff with no explicit permissions
    return ['account', 'premium'].includes(link.id);
  });

  let currentPlan = user?.plan || user?.subscriptionPlan || 'None';
  if (currentPlan === 'Basic') currentPlan = 'Starter';
  if (currentPlan === 'Pro') currentPlan = 'Growth';
  if (currentPlan === 'Elite') currentPlan = 'Scale';

  const mainLinks = navLinks.filter((link) => ['dashboard', 'pos', 'kot', 'inventory', 'sop', 'ai', 'costing', 'elite'].includes(link.id));
  const moreLinks = navLinks.filter((link) => !['dashboard', 'pos', 'kot', 'inventory', 'sop', 'ai', 'costing', 'elite'].includes(link.id));
  const isMoreActive = moreLinks.some((link) => pathname === link.path);
  
  let isLocked = false;
  let isChefLocked = false;
  if (user?.role === 'user') { // Only apply locks to the owner, staff bypass this (their access is dictated by owner's plan theoretically, or they just do their job)
    const isMembershipRoute = pathname.startsWith('/dashboard/membership');
    const isAccountRoute = pathname.startsWith('/dashboard/account');
    const isAiRoute = pathname.startsWith('/dashboard/ai');
    const isCostingRoute = pathname.startsWith('/dashboard/costing');
    const isWastageRoute = pathname.startsWith('/dashboard/wastage');
    const isMarketingRoute = pathname.startsWith('/dashboard/marketing');
    
    if (currentPlan === 'None') {
      if (!isMembershipRoute && !isAccountRoute) isLocked = true;
      isChefLocked = true;
    } else if (currentPlan === 'Starter') {
      // Starter plan doesn't have AI, Costing, Wastage, or Marketing
      if (isAiRoute || isCostingRoute || isWastageRoute || isMarketingRoute) isLocked = true;
      isChefLocked = true;
    } else if (currentPlan === 'Growth') {
      // Growth (Premium) plan now has access to everything except maybe some scale-only things.
      // We will no longer lock marketing.
      // (Scale has access to everything)
    }
    // Scale has access to everything
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <ConnectivityStatus />
      <GlobalSearch isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {impersonationData && (
        <div className="bg-gold text-black py-2 px-4 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-4 z-[60] relative">
          <span>Viewing as: {impersonationData.locationName}</span>
          <button 
            onClick={handleReturnToMaster}
            className="bg-black text-foreground px-4 py-1 rounded-full hover:bg-black/80 transition-colors"
          >
            Return to Master Dashboard
          </button>
        </div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        userRole={impersonationData ? 'user' : (user?.role || 'user')} 
        permissions={user?.permissions || []}
      />

      <header className="h-24 border-b border-foreground/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between print:hidden">
        {/* Left Section: Menu & Logo */}
        <div className="flex items-center gap-4 min-w-fit">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="text-foreground/80 hover:text-gold p-2.5 hover:bg-foreground/5 rounded-2xl transition-all"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-lg border border-foreground/10 shrink-0">
              <span className="text-black font-black text-xl">K</span>
            </div>
            <div className="hidden xl:block">
              <h1 className="font-black text-lg tracking-normal leading-none text-foreground whitespace-nowrap">KYROZ-PLUS</h1>
              <p className="text-gold font-black uppercase text-[8px] tracking-[0.2em] mt-1 opacity-60">Restaurant KOS</p>
            </div>
          </div>
        </div>

        {/* Center Section: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 mx-4">
          {mainLinks.map((link) => {
            const Icon = (link as any).icon;
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.path}
                href={link.path} 
                className={`flex items-center gap-2 transition-all py-2 border-b-2 whitespace-nowrap text-xs font-black uppercase tracking-widest ${
                  isActive 
                    ? 'text-gold border-gold' 
                    : 'text-foreground/60 hover:text-foreground border-transparent'
                }`}
              >
                {Icon && <Icon size={16} className={isActive ? 'text-gold' : 'text-foreground/60'} />}
                <span>{link.name}</span>
              </Link>
            );
          })}

          {moreLinks.length > 0 && (
            <div 
              className="relative"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button 
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center gap-2 transition-all py-2 border-b-2 whitespace-nowrap text-xs font-black uppercase tracking-widest ${
                  isMoreActive 
                    ? 'text-gold border-gold' 
                    : 'text-foreground/60 hover:text-gold border-transparent'
                }`}
              >
                <span>More</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-3 bg-card glass-card border border-foreground/10 rounded-2xl p-4 w-56 shadow-2xl z-[70] space-y-1.5"
                  >
                    {moreLinks.map((link) => {
                      const Icon = (link as any).icon;
                      const isActive = pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          href={link.path}
                          onClick={() => setIsMoreOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${
                            isActive 
                              ? 'bg-gold/10 text-gold border border-gold/20' 
                              : 'text-foreground/70 hover:text-gold hover:bg-foreground/5 border border-transparent'
                          }`}
                        >
                          {Icon && <Icon size={16} className={isActive ? 'text-gold' : 'text-foreground/60'} />}
                          <span>{link.name}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-4 min-w-fit">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl text-foreground/80 hover:text-gold transition-all border border-foreground/5"
          >
            <SearchIcon size={18} />
          </button>
          
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl text-foreground/80 hover:text-gold transition-all border border-foreground/5 relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
            )}
          </button>

          <div className="flex items-center gap-3 bg-foreground/5 pl-2 pr-4 py-1.5 rounded-xl border border-foreground/10 hover:border-gold/30 transition-all cursor-pointer group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center text-black font-black text-sm">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-black text-foreground uppercase leading-none truncate max-w-[80px]">{user?.name || 'User'}</p>
              <p className="text-[8px] text-gold/40 uppercase mt-1 font-bold tracking-tighter">{user?.role || 'Member'}</p>
            </div>
          </div>
        </div>
      </header>

      <main className={`flex-1 w-full mx-auto relative print:static print:p-0 print:m-0 ${pathname === '/dashboard/pos' ? 'max-w-[1800px] px-2 md:px-8 py-4 md:py-6' : 'max-w-7xl p-4 md:p-8 lg:p-12'}`}>
        <div className="relative w-full h-full print:static print:p-0 print:m-0">
          {children}
          {isLocked && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/60 rounded-3xl">
              <div className="bg-card border border-border p-8 md:p-12 rounded-3xl text-center max-w-lg shadow-2xl shadow-black">
                <div className="w-16 h-16 bg-gradient-to-tr from-[#d4af37] to-[#f9e596] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#d4af37]/20">
                  <Lock size={32} className="text-black" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">Feature Locked</h3>
                <p className="text-foreground/60 mb-8 font-medium leading-relaxed">
                  You need an active premium subscription to access this feature. Upgrade your plan to unlock the full power of KYROZ KOSA.
                </p>
                <Link 
                  href="/dashboard/membership"
                  className="inline-block w-full py-4 rounded-xl font-bold transition-all shadow-lg bg-[#d4af37] hover:bg-[#c5a028] text-black shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 uppercase tracking-widest text-sm"
                >
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {pathname === '/dashboard' && <FloatingKOSA isLocked={isChefLocked} />}
      <NotificationPanel 
        isOpen={isNotificationsOpen} 
        setIsOpen={setIsNotificationsOpen} 
        onRefresh={() => {
          const token = localStorage.getItem('token');
          if (token) fetchNotifications(token);
        }}
      />

      {/* --- PREMIUM FOOTER --- */}
      <footer className="w-full border-t border-foreground/5 bg-black/20 backdrop-blur-md pt-4 md:pt-6 pb-4 md:pb-4 px-6 md:px-12 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-6">
            
            {/* Brand Section */}
            <div className="space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-lg border border-foreground/10 shrink-0">
                  <span className="text-black font-black text-xl">K</span>
                </div>
                <h3 className="font-black text-lg tracking-normal leading-none text-foreground text-center sm:text-left">
                  KYROZ-PLUS <span className="text-xs font-bold text-foreground/80 uppercase tracking-widest ml-1 block sm:inline mt-1 sm:mt-0">powered by AROMA AGRO INTERNATIONAL</span>
                </h3>
              </div>
              <p className="text-foreground/80 text-xs md:text-xs leading-relaxed max-w-xs font-medium">
                The world's most advanced Kitchen Operating System. Standardizing excellence for elite restaurants globally.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/kyroz_plus?igsi=MTBrcDdodmJ5eXRodA==" target="_blank" className="p-2.5 bg-foreground/5 hover:bg-gold/10 rounded-xl text-foreground/60 hover:text-gold transition-all border border-foreground/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61591653621553&mibextid=wwXIfr" target="_blank" className="p-2.5 bg-foreground/5 hover:bg-gold/10 rounded-xl text-foreground/60 hover:text-gold transition-all border border-foreground/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
              </div>
            </div>

            {/* Support Section */}
            <div className="space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="text-foreground text-[11px] font-black uppercase tracking-[0.2em]">Immediate Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="tel:+917887009800" className="flex items-center gap-3 text-foreground/80 hover:text-gold transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-gold/10 transition-all"><span className="text-[14px]">📞</span></div>
                    <span className="text-[11px] font-bold">+91 78870 09800</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@kyrozplus.com" className="flex items-center gap-3 text-foreground/80 hover:text-gold transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-gold/10 transition-all"><span className="text-[14px]">✉️</span></div>
                    <span className="text-[11px] font-bold truncate max-w-[150px] md:max-w-none">info@kyrozplus.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="text-foreground text-[11px] font-black uppercase tracking-[0.2em]">Platform</h4>
              <ul className="space-y-2">
                {navLinks.slice(0, 4).map(link => (
                  <li key={link.path}>
                    <Link href={link.path} className="text-[11px] font-bold text-foreground/80 hover:text-gold transition-all uppercase tracking-widest">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Section */}
            <div className="space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="text-foreground text-[11px] font-black uppercase tracking-[0.2em]">Enterprise Grade</h4>
              <div className="bg-foreground/5 rounded-2xl p-4 border border-foreground/5 w-full max-w-[250px] sm:max-w-none">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-foreground/60 uppercase tracking-widest">Global Status: Active</span>
                </div>
                <p className="text-[10px] text-foreground/60 font-bold uppercase tracking-tighter leading-relaxed">
                  256-bit encrypted infrastructure ensuring 99.9% uptime for your kitchen operations.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-foreground/5 text-center md:text-left">
            <p className="text-[10px] md:text-xs font-black text-foreground/60 uppercase tracking-[0.2em]">
              © 2026 KYROZ TECHNOLOGIES PVT LTD. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6 md:gap-8">
              <Link href="#" className="text-[10px] font-black text-foreground/60 hover:text-gold uppercase tracking-widest">Privacy Policy</Link>
              <Link href="#" className="text-[10px] font-black text-foreground/60 hover:text-gold uppercase tracking-widest">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
