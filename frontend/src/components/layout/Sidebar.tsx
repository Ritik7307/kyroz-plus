'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ChefHat, 
  Calculator, 
  Trash2, 
  Users, 
  Settings, 
  LogOut,
  X,
  Menu,
  Bell,
  Utensils,
  ClipboardList,
  Megaphone,
  ShieldCheck,
  FileText,
  Database
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole?: 'admin' | 'manager' | 'cook' | 'billing' | 'user';
  permissions?: string[];
}

export default function Sidebar({ isOpen, setIsOpen, userRole = 'user', permissions = [] }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getMenuItems = () => {
    // If we are in the Admin section, show Admin menu
    if (pathname.startsWith('/admin')) {
      return [
        { name: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', id: 'admin' },
        { name: 'Member List', icon: Users, path: '/admin/users', id: 'admin' },
        { name: 'Global SOPs', icon: ChefHat, path: '/admin/sops', id: 'admin' },
        { name: 'Member View (Test)', icon: Utensils, path: '/dashboard', id: 'admin' },
        { name: 'System Settings', icon: Settings, path: '/admin/settings', id: 'admin' },
      ];
    }

    const allItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', id: 'dashboard' },
      { name: 'POS Terminal', icon: Calculator, path: '/dashboard/pos', id: 'pos' },
      { name: 'KOT Display', icon: ClipboardList, path: '/dashboard/kot', id: 'kot' },
      { name: 'Customers', icon: Users, path: '/dashboard/customers', id: 'customers' },
      { name: 'Manage Team', icon: Users, path: '/dashboard/team', id: 'team', ownerOnly: true },
      { name: 'SOP Packets', icon: Utensils, path: '/dashboard/packets', id: 'packets' },
      { name: 'Marketing CRM', icon: Megaphone, path: '/dashboard/marketing', id: 'marketing', ownerOnly: true },
      { name: 'Sales History', icon: Calculator, path: '/dashboard/history', id: 'history' },
      { name: 'Chef', icon: MessageSquare, path: '/dashboard/ai', id: 'ai' },
      { name: 'SOP Library', icon: ChefHat, path: '/dashboard/sop', id: 'sop' },
      { name: 'Inventory', icon: Utensils, path: '/dashboard/inventory', id: 'inventory' },
      { name: 'Costing Master', icon: Calculator, path: '/dashboard/costing', id: 'costing' },
      { name: 'Wastage Master', icon: Trash2, path: '/dashboard/wastage', id: 'wastage' },
      { name: 'Account', icon: Users, path: '/dashboard/account', id: 'account' },
      { name: 'Settings', icon: Settings, path: '/dashboard/settings', id: 'settings' },
      { name: 'Privacy Policy', icon: ShieldCheck, path: '/privacy-policy', id: 'privacy' },
      { name: 'Terms of Service', icon: FileText, path: '/terms-of-service', id: 'terms' },
      { name: 'Data Deletion', icon: Database, path: '/data-deletion', id: 'data' },
    ];

    return allItems.filter(item => {
      // Admin/Owner sees everything
      if (userRole === 'admin' || userRole === 'user') return true;

      // Staff (manager, cook, billing) check permissions
      if (item.ownerOnly) return false;
      if (permissions.length > 0) {
        return permissions.includes(item.id);
      }

      // Fallback for staff with no permissions
      return ['dashboard', 'account', 'privacy', 'terms', 'data'].includes(item.id);
    });
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container (Always a drawer now) */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -300,
        }}
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-white/10 z-[70] flex flex-col transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-gradient rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">K</span>
            </div>
            <span className="font-bold text-white tracking-widest text-[10px] uppercase">Kyyroz-Plus Menu</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.path);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                  ? 'bg-gold/10 text-gold font-bold shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-6 bg-gold rounded-r-full"
                  />
                )}
                <item.icon size={20} className={isActive ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
                <span className="text-sm tracking-wide">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
