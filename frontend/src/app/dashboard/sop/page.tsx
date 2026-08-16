'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  RefreshCw,
  Search, Plus,
  Upload,
  Printer,
  Download,
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
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSkeleton } from '@/components/dashboard/Skeleton';
import { API_URL } from '@/lib/api';

interface Sop {
  _id: string;
  title: string;
  category: string;
  contentEn?: string;
  contentHi?: string;
  content?: string;
  fileUrl?: string;
  isInventoryLinked?: boolean;
  platesPerPacket?: number;
  createdAt: string;
  updatedAt?: string;
}

function SOPLibraryContent() {
  const [sops, setSops] = useState<Sop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingSop, setViewingSop] = useState<Sop | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Dish' as const,
    contentEn: '',
    contentHi: '',
    isInventoryLinked: false,
    platesPerPacket: 10
  });

  const [userRole, setUserRole] = useState<string>('');
  const [userPlan, setUserPlan] = useState<string>('Starter');
  const [selectedSopCategory, setSelectedSopCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);

  const searchParams = useSearchParams();

  const fetchSops = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userRes = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userRes.json();
      const plan = userData.plan || userData.subscriptionPlan || 'Starter';
      setUserPlan(plan);
      setSelectedSopCategory(userData.selectedSopCategory || null);

      if (plan === 'Starter' && userData.role !== 'admin' && !userData.selectedSopCategory) {
        setShowCategoryModal(true);
      } else if (plan === 'Starter' && userData.role !== 'admin' && userData.selectedSopCategory) {
        setActiveCategory(userData.selectedSopCategory);
      }

      const res = await fetch(`${API_URL}/api/sops`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSops(Array.isArray(data) ? data : []);

        // Handle deep linking
        const categoryParam = searchParams.get('category');
        const idParam = searchParams.get('id');

        if (categoryParam) setActiveCategory(categoryParam);
        if (idParam) {
          const targetSop = data.find((s: Sop) => s._id === idParam);
          if (targetSop) setViewingSop(targetSop);
        }
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
  }, [searchParams]);

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
          title: '', category: 'Dish', contentEn: '', contentHi: '',
          isInventoryLinked: false, platesPerPacket: 10
        });
        fetchSops();
      }
    } catch (error) {
      console.error('Failed to create SOP', error);
    }
  };

  const categories = ['All', 'South Indian', 'Cafe', 'Mandi/Biryani', 'Chinese', 'Non-Veg', 'Veg', 'Preparation', 'Discipline'];
  
  const displayedCategories = (userPlan === 'Starter' && userRole !== 'admin' && selectedSopCategory) 
    ? [selectedSopCategory]
    : categories;

  const handleSelectCategory = async (cat: string) => {
    setIsUpdatingCategory(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ selectedSopCategory: cat })
      });
      if (res.ok) {
        setSelectedSopCategory(cat);
        setActiveCategory(cat);
        setShowCategoryModal(false);
      } else {
        alert('Failed to save category choice');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving category');
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  const filteredSops = sops.filter(sop => {
    const matchesCategory = activeCategory === 'All' ||
      (sop.category || '').toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = (sop.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderContentWithHighlights = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-4" />;
      const isHeader = (trimmedLine.toUpperCase().includes(':') && trimmedLine.length < 40) || trimmedLine.startsWith('###');
      const isBullet = trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || /^\d+\./.test(trimmedLine);
      const cleanLine = trimmedLine.replace(/^[-*]\s+/, '').replace(/^###\s+/, '');
      const parts = cleanLine.split(/(\bHigh\b|\bMedium\b|\bLow\b|\bOil\b|\bButter\b|\bGhee\b|\*\*[^*]+\*\*)/g);

      return (
        <div key={i} className={`mb-3 ${isHeader ? 'mt-10 border-b border-white/10 pb-2 mb-6' : ''} ${isBullet ? 'pl-6 relative' : ''}`}>
          {isBullet && <span className="absolute left-0 text-gold font-bold">{trimmedLine.split(' ')[0]}</span>}
          <p className={`${isHeader ? 'font-black text-lg text-gold uppercase tracking-tight' : 'font-medium text-gray-300 text-sm leading-relaxed'} ${isBullet ? 'pl-2' : ''}`}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) return <span key={j} className="font-black text-white">{part.slice(2, -2)}</span>;
              const isHighlight = ['High', 'Medium', 'Low', 'Oil', 'Butter', 'Ghee'].includes(part);
              return isHighlight ? <span key={j} className="text-white font-black underline decoration-gold/40 decoration-2 px-1 bg-white/5 rounded-sm">{part}</span> : part;
            })}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-card/30 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold/5 rounded-full -mr-32 md:-mr-64 -mt-32 md:-mt-64 blur-[80px] md:blur-[120px]"></div>
        <div className="space-y-4 relative z-10 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]"><span className="w-6 md:w-10 h-[2px] bg-gold"></span>Central SOP Repository</div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">RESTAURANT <span className="text-gold">STANDARDS</span></h1>
          <p className="text-white/60 text-sm md:text-lg max-w-xl font-medium leading-relaxed italic mx-auto lg:mx-0">"Consistency is the difference between a good kitchen and a great one."</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          {userRole === 'admin' && (
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-gold text-black rounded-[1.2rem] md:rounded-[1.5rem] text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]">
              <Plus size={18} /> Add New SOP
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center justify-between bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="relative w-full lg:w-[450px]">
          <Search size={20} className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-white/40" />
          <input type="text" placeholder="Search recipes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[1.2rem] md:rounded-[1.5rem] py-3.5 md:py-4 pl-14 md:pl-16 pr-6 text-sm text-white focus:outline-none transition-all" />
        </div>
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 w-full lg:w-auto custom-scrollbar">
          {displayedCategories.map(cat => (
            <button key={cat} onClick={() => {
              if (userPlan === 'Starter' && userRole !== 'admin' && cat !== selectedSopCategory) {
                alert('Your Starter plan only allows access to your selected category.');
                return;
              }
              setActiveCategory(cat);
            }} className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all border shrink-0 ${activeCategory === cat ? 'bg-gold/20 border-gold text-gold shadow-gold/10' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredSops.map((sop, idx) => (
            <motion.div key={sop._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-[#111] rounded-[1.8rem] md:rounded-[2rem] border border-white/5 hover:border-white/10 transition-all p-6 md:p-8 flex flex-col shadow-2xl group">
              <div className="flex justify-between items-start mb-5 md:mb-6">
                <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[8px] md:text-[9px] font-black text-gold uppercase tracking-widest border border-white/5">{sop.category}</span>
                {sop.isInventoryLinked && <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-lg text-[8px] md:text-[9px] font-black text-green-500 uppercase tracking-widest border border-green-500/20"><Database size={10} /> Linked</span>}
              </div>
              <h3 className="text-lg md:text-xl font-black text-gold mb-4 uppercase tracking-tight group-hover:translate-x-1 transition-transform">{sop.title}</h3>
              <div className="mt-auto flex items-center gap-3">
                <button onClick={() => setViewingSop(sop)} className="flex-1 py-3.5 md:py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 transition-all"><Eye size={16} /> View Recipe</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-lg rounded-[2rem] p-8 md:p-12 border border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="text-gold" size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-4 text-white">Select Your <span className="text-gold">SOP Category</span></h3>
              <p className="text-white/60 text-sm mb-8 font-medium">Your Starter plan includes access to one SOP category. Please select it carefully, as this choice is permanent for the Starter plan.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {categories.filter(c => c !== 'All').map(cat => (
                  <button 
                    key={cat}
                    disabled={isUpdatingCategory}
                    onClick={() => handleSelectCategory(cat)}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-gold/10 hover:border-gold/30 text-white font-bold transition-all text-sm uppercase tracking-wider disabled:opacity-50"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-2xl">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-card w-full max-w-5xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-white/10 shadow-3xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex items-center justify-between mb-8 md:mb-10"><h3 className="text-xl md:text-3xl font-black tracking-tighter uppercase">NEW <span className="text-gold">RECIPE</span></h3><button onClick={() => setIsModalOpen(false)} className="p-2 md:p-3 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all"><X size={28} /></button></div>
              <form onSubmit={handleCreateSop} className="space-y-8 md:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-3"><label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white/40">Recipe Name</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm md:text-base font-bold focus:outline-none focus:border-gold transition-all" required /></div>
                  <div className="space-y-3"><label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white/40">Category</label><select value={formData.category} onChange={(e: any) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm md:text-base font-bold focus:outline-none focus:border-gold transition-all appearance-none"><option value="South Indian">South Indian</option><option value="Cafe">Cafe</option><option value="Mandi/Biryani">Mandi/Biryani</option><option value="Chinese">Chinese</option><option value="Discipline">Discipline</option><option value="Veg">Veg</option><option value="Non-Veg">Non-Veg</option><option value="Preparation">Preparation</option></select></div>
                </div>
                <div className="bg-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Database className="text-gold" size={20} /><div><h4 className="text-[10px] md:text-sm font-black uppercase tracking-widest">Inventory Connection</h4></div></div><button type="button" onClick={() => setFormData({ ...formData, isInventoryLinked: !formData.isInventoryLinked })} className={`w-12 md:w-14 h-7 md:h-8 rounded-full transition-all relative ${formData.isInventoryLinked ? 'bg-gold' : 'bg-white/10'}`}><div className={`absolute top-1 w-5 md:w-6 h-5 md:h-6 rounded-full bg-white transition-all ${formData.isInventoryLinked ? 'right-1' : 'left-1'}`} /></button></div>
                  {formData.isInventoryLinked && <div className="pt-6 border-t border-white/5"><div className="flex items-center gap-6"><div className="flex-1 space-y-3"><label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white/40">Plates Per Packet</label><input type="number" value={formData.platesPerPacket} onChange={(e) => setFormData({ ...formData, platesPerPacket: Number(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm md:text-base font-bold text-gold focus:outline-none focus:border-gold" /></div></div></div>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  <div className="space-y-3"><label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-gold">English Protocol</label><textarea value={formData.contentEn} onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-sm md:text-base font-medium focus:outline-none focus:border-gold h-60 md:h-80 resize-none" /></div>
                  <div className="space-y-3"><label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-gold">हिन्दी निर्देशिका</label><textarea value={formData.contentHi} onChange={(e) => setFormData({ ...formData, contentHi: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-sm md:text-base font-medium focus:outline-none focus:border-gold h-60 md:h-80 resize-none" /></div>
                </div>
                <div className="flex justify-end gap-6 pt-6"><button type="submit" className="w-full md:w-auto px-12 md:px-16 py-4 md:py-5 bg-gold text-black rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-2xl hover:scale-[1.05] transition-all">Save Recipe</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingSop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-md">
            <motion.div className="bg-[#111] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-gold leading-tight pr-4">
                  {viewingSop.title}
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.print()} 
                    className="p-2.5 md:p-3 bg-gold text-black hover:bg-gold/90 rounded-xl transition-all flex items-center gap-2"
                  >
                    <Download size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Download PDF</span>
                  </button>
                  <button 
                    onClick={() => setViewingSop(null)} 
                    className="p-2.5 md:p-3 hover:bg-white/10 rounded-xl text-white/40"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-6 md:space-y-8">
                {/* On-screen language tabs (hidden during print) */}
                <div className="flex gap-3 md:gap-4 no-print">
                  <button onClick={() => setLanguage('EN')} className={`px-5 md:px-6 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest ${language === 'EN' ? 'bg-gold text-black' : 'bg-white/5 text-white/40'}`}>English</button>
                  <button onClick={() => setLanguage('HI')} className={`px-5 md:px-6 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest ${language === 'HI' ? 'bg-gold text-black' : 'bg-white/5 text-white/40'}`}>Hindi</button>
                </div>

                {/* On-screen content view (hidden during print) */}
                <div className="prose prose-invert max-w-none prose-sm md:prose-base no-print">
                  {renderContentWithHighlights(language === 'EN' ? viewingSop.contentEn || '' : viewingSop.contentHi || '')}
                </div>

                {/* Print-only content view (prints both English and Hindi protocols) */}
                <div className="hidden print:block space-y-10 text-black">
                  {viewingSop.contentEn && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black border-b-2 border-black pb-2 uppercase tracking-wide">English Protocol</h3>
                      <div className="prose max-w-none">
                        {renderContentWithHighlights(viewingSop.contentEn)}
                      </div>
                    </div>
                  )}
                  {viewingSop.contentHi && (
                    <div className="space-y-4 mt-8 pt-8 border-t border-dashed border-black/30">
                      <h3 className="text-xl font-black border-b-2 border-black pb-2 uppercase tracking-wide">हिन्दी निर्देशिका</h3>
                      <div className="prose max-w-none">
                        {renderContentWithHighlights(viewingSop.contentHi)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            margin: 1cm;
            size: portrait;
          }

          /* --- SELECTIVE HIDING --- */
          /* Hide global UI & buttons */
          header, footer, aside, nav, .notification-panel, .floating-kosa-btn, button, .no-print {
            display: none !important;
          }

          /* Hide SOP Page Background specifically */
          .max-w-7xl > header,
          .max-w-7xl > div.flex.flex-col,
          .max-w-7xl > div.grid,
          .max-w-7xl > div.mt-12 {
            display: none !important;
          }

          /* --- ENSURE MODAL VISIBILITY & NO CUTOFFS --- */
          body, main, #__next, .max-w-7xl {
            background: white !important;
            color: black !important;
            height: auto !important;
            overflow: visible !important;
          }

          main {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .fixed.inset-0 { 
            position: static !important;
            display: block !important; 
            width: 100% !important; 
            background: white !important; 
            padding: 0 !important; 
            margin: 0 !important;
            visibility: visible !important;
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
          }

          /* Reset Container Border & Padding */
          .bg-\\[\\#111\\], .custom-scrollbar, .overflow-y-auto { 
            background: white !important; 
            border: 2pt solid black !important; 
            width: 100% !important; 
            padding: 40px !important;
            margin: 0 !important;
            box-shadow: none !important;
            display: block !important;
            visibility: visible !important;
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
          }

          /* Master SOP Header */
          .bg-\\[\\#111\\]::before {
            content: 'KYROZ-PLUS | MASTER SOP CARD';
            display: block;
            text-align: center;
            font-weight: 900;
            font-size: 10pt;
            letter-spacing: 0.2em;
            padding: 10px;
            border-bottom: 1.5pt solid black;
            margin-bottom: 30px;
          }

          /* Recipe Title */
          .text-gold { 
            display: block !important;
            font-size: 24pt !important;
            font-weight: 900 !important;
            color: black !important; 
            margin-bottom: 20px !important;
            text-transform: uppercase;
            visibility: visible !important;
          }

          /* Content Text */
          .prose { 
            color: black !important; 
            max-width: 100% !important; 
            visibility: visible !important;
            display: block !important;
          }

          .text-gray-300 { 
            color: black !important; 
            font-size: 11pt !important;
            line-height: 1.6 !important; 
            visibility: visible !important;
          }

          .font-black.text-lg.text-gold { 
            color: black !important; 
            font-size: 14pt !important;
            margin-top: 20px !important;
            display: block !important;
            text-decoration: underline !important;
          }

          /* Highlights in print */
          span.bg-white\\/5 {
            background-color: #f3f4f6 !important;
            color: black !important;
            border: 1px solid #d1d5db !important;
            padding: 2px 4px !important;
            border-radius: 4px !important;
            text-decoration: underline !important;
            display: inline-block !important;
          }

          .pl-6 { padding-left: 25px !important; }
          p { margin-bottom: 10px !important; }
        }
      `}} />
    </div>
  );
}

export default function SOPLibraryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gold font-black tracking-widest">LOADING STANDARDS...</div>}>
      <SOPLibraryContent />
    </Suspense>
  );
}
