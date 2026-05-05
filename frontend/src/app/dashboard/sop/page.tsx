'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FileText,
  RefreshCw,
  Search,  Plus, 
  Upload, 
  Printer, 
  Languages, 
  X, 
  ChevronRight,
  ChefHat,
  UtensilsCrossed,
  Calculator,
  Trash2,
  ShieldCheck,
  Eye,
  CheckSquare,
  Square,
  Image as ImageIcon,
  Copy,
  Edit3,
  Clock,
  User as UserIcon,
  DollarSign,
  AlertCircle,
  ShoppingCart,
  File,
  Box,
  Database,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSkeleton } from '@/components/dashboard/Skeleton';
import { API_URL } from '@/lib/api';

interface Sop {
  _id: string;
  title: string;
  category: 'Dish' | 'Gravy' | 'Costing' | 'Wastage' | 'Discipline';
  contentEn?: string;
  contentHi?: string;
  content?: string;
  fileUrl?: string;
  isInventoryLinked?: boolean;
  platesPerPacket?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function SOPLibraryPage() {
  const [sops, setSops] = useState<Sop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Dish' as const,
    contentEn: '',
    contentHi: '',
    isInventoryLinked: false,
    platesPerPacket: 10
  });

  // Viewer State
  const [viewingSop, setViewingSop] = useState<Sop | null>(null);

  // File Upload State
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchSops = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sops`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSops(data);
      } else {
        setError(`Server Error: ${res.status}`);
      }
    } catch (err: any) {
      setError(`Connection Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSops();
  }, []);

  const handleCreateSop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sops`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          title: '',
          category: 'Dish',
          contentEn: '',
          contentHi: '',
          isInventoryLinked: false,
          platesPerPacket: 10
        });
        fetchSops();
      }
    } catch (error) {
      console.error('Failed to create SOP', error);
    }
  };

  const categories = ['All', 'Dish', 'Gravy', 'Costing', 'Wastage', 'Discipline'];
  
  const filteredSops = sops.filter(sop => {
    const matchesCategory = activeCategory === 'All' || 
                           (sop.category || '').toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = (sop.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderContentWithHighlights = (text: string) => {
    if (!text) return null;
    const sections = text.split('\n');
    return sections.map((line, i) => {
      const isHeader = line.toUpperCase().includes(':') && line.length < 50;
      const parts = line.split(/(\bHigh\b|\bMedium\b|\bLow\b|\bOil\b|\bButter\b|\bGhee\b)/g);
      
      return (
        <div key={i} className={`mb-4 ${isHeader ? 'mt-8 border-b border-white/5 pb-2' : ''}`}>
          <p className={`${isHeader ? 'font-black text-base text-gray-200 uppercase tracking-tight' : 'font-medium text-gray-400 text-sm leading-relaxed'}`}>
            {parts.map((part, j) => {
              const isHighlight = ['High', 'Medium', 'Low', 'Oil', 'Butter', 'Ghee'].includes(part);
              return isHighlight ? (
                <span key={j} className="text-gray-100 font-black underline decoration-gold/30 decoration-2">
                  {part}
                </span>
              ) : part;
            })}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-card/30 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-gold text-xs font-bold uppercase tracking-[0.4em]">
            <span className="w-10 h-[2px] bg-gold"></span>
            Central SOP Repository
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none">
            RESTAURANT <span className="text-gold">STANDARDS</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl font-medium leading-relaxed italic">
            "Consistency is the difference between a good kitchen and a great one."
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gold text-black rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
          >
            <Plus size={18} />
            Add New Recipe SOP
          </button>
        </div>
      </header>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between bg-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="relative w-full lg:w-[450px]">
          <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search recipes or procedures..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-16 pr-6 text-sm text-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 w-full lg:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                activeCategory === cat 
                  ? 'bg-gold/20 border-gold text-gold shadow-gold/10' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SOP GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredSops.map((sop, idx) => (
            <motion.div 
              key={sop._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#111] rounded-[2rem] border border-white/5 hover:border-white/10 transition-all p-8 flex flex-col shadow-2xl group"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-gold uppercase tracking-widest border border-white/5">
                  {sop.category}
                </span>
                {sop.isInventoryLinked && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-lg text-[9px] font-black text-green-500 uppercase tracking-widest border border-green-500/20">
                    <Database size={10} /> Inventory Linked
                  </span>
                )}
              </div>

              <h3 className="text-xl font-black text-gold mb-4 uppercase tracking-tight group-hover:translate-x-1 transition-transform">{sop.title}</h3>
              
              <div className="mt-auto flex items-center gap-3">
                <button 
                  onClick={() => setViewingSop(sop)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                >
                  <Eye size={16} /> View Recipe
                </button>
                {sop.isInventoryLinked && (
                  <div className="p-4 bg-white/5 rounded-2xl text-white/20 border border-white/5" title={`${sop.platesPerPacket} Plates per Packet`}>
                    <Box size={16} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- ADD SOP MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-card w-full max-w-5xl rounded-[3rem] p-12 border border-white/10 shadow-3xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black tracking-tighter uppercase">NEW <span className="text-gold">RECIPE ENTRY</span></h3>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X size={32} /></button>
              </div>

              <form onSubmit={handleCreateSop} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-white/40">Recipe Name (Match with Dish Name)</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-base font-bold focus:outline-none focus:border-gold transition-all"
                      placeholder="e.g., Corn Palak Cheese"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-white/40">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e: any) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-base font-bold focus:outline-none focus:border-gold transition-all appearance-none"
                    >
                      <option value="Dish">Dish Production</option>
                      <option value="Gravy">Base Gravy</option>
                      <option value="Costing">Financial Controls</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="text-gold" size={24} />
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Inventory Connection</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Automatically track stock for this recipe</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isInventoryLinked: !formData.isInventoryLinked})}
                      className={`w-14 h-8 rounded-full transition-all relative ${formData.isInventoryLinked ? 'bg-gold' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${formData.isInventoryLinked ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  {formData.isInventoryLinked && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-6 border-t border-white/5"
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex-1 space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40">Plates Per Packet (Yield)</label>
                          <input
                            type="number"
                            value={formData.platesPerPacket}
                            onChange={(e) => setFormData({...formData, platesPerPacket: Number(e.target.value)})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-base font-bold text-gold focus:outline-none focus:border-gold"
                            placeholder="e.g. 5"
                          />
                        </div>
                        <div className="w-1/2 p-6 bg-gold/5 rounded-2xl border border-gold/10">
                          <p className="text-[9px] font-black uppercase tracking-widest text-gold/60 leading-relaxed">
                            Every time 1 plate of this dish is sold in POS, the system will reduce 1/{formData.platesPerPacket} packet from the kitchen inventory.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gold">English Protocol</label>
                    <textarea
                      value={formData.contentEn}
                      onChange={(e) => setFormData({...formData, contentEn: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-base font-medium focus:outline-none focus:border-gold h-80 resize-none"
                      placeholder="Step by step recipe details..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gold">हिन्दी निर्देशिका</label>
                    <textarea
                      value={formData.contentHi}
                      onChange={(e) => setFormData({...formData, contentHi: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-base font-medium focus:outline-none focus:border-gold h-80 resize-none"
                      placeholder="रेसिपी के निर्देश..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-6 pt-6">
                  <button type="submit" className="px-16 py-5 bg-gold text-black rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.05] transition-all">
                    Save Recipe & Sync Inventory
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Viewer Modal (Simplified for brevity) */}
      <AnimatePresence>
        {viewingSop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div className="bg-[#111] border border-white/10 rounded-[3rem] p-12 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-gold">{viewingSop.title}</h2>
                <button onClick={() => setViewingSop(null)} className="p-2 hover:bg-white/5 rounded-xl"><X /></button>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <button onClick={() => setLanguage('EN')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${language === 'EN' ? 'bg-gold text-black' : 'bg-white/5 text-white/40'}`}>English</button>
                  <button onClick={() => setLanguage('HI')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${language === 'HI' ? 'bg-gold text-black' : 'bg-white/5 text-white/40'}`}>Hindi</button>
                </div>
                <div className="prose prose-invert max-w-none">
                  {renderContentWithHighlights(language === 'EN' ? viewingSop.contentEn || '' : viewingSop.contentHi || '')}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
