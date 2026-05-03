'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
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
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSkeleton } from '@/components/dashboard/Skeleton';

interface Sop {
  _id: string;
  title: string;
  category: 'Dish' | 'Gravy' | 'Costing' | 'Wastage' | 'Discipline';
  contentEn?: string;
  contentHi?: string;
  content?: string;
  createdAt: string;
  updatedAt?: string;
}

const DISH_THUMBNAILS: Record<string, string> = {
  "VEG JALFREZI": "C:/Users/Ritik prajapati/.gemini/antigravity/brain/ea87dbd1-1b00-4b60-915c-e59e9c1f9b86/veg_jalfrezi_thumbnail_1777803411336.png",
  "LEHSUNI PANEER": "C:/Users/Ritik prajapati/.gemini/antigravity/brain/ea87dbd1-1b00-4b60-915c-e59e9c1f9b86/lehsuni_paneer_thumbnail_1777803428983.png",
  "MALAI KOFTA RED": "C:/Users/Ritik prajapati/.gemini/antigravity/brain/ea87dbd1-1b00-4b60-915c-e59e9c1f9b86/malai_kofta_thumbnail_1777803454372.png",
};

export default function SOPLibraryPage() {
  const [sops, setSops] = useState<Sop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Dish' | 'Gravy' | 'Costing' | 'Wastage' | 'Discipline'>('Dish');
  const [newContentEn, setNewContentEn] = useState('');
  const [newContentHi, setNewContentHi] = useState('');

  // Viewer State
  const [viewingSop, setViewingSop] = useState<Sop | null>(null);

  // File Upload State
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchSops = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/sops', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSops(data);
      }
    } catch (error) {
      console.error('Failed to fetch SOPs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSops();
    
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-sop-modal', handleOpenModal);
    return () => window.removeEventListener('open-sop-modal', handleOpenModal);
  }, []);

  const toggleStep = (step: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  const handleCreateSop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/sops', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title: newTitle, 
          category: newCategory, 
          contentEn: newContentEn,
          contentHi: newContentHi 
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewContentEn('');
        setNewContentHi('');
        fetchSops();
      }
    } catch (error) {
      console.error('Failed to create SOP', error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('http://localhost:5000/api/ai/upload-sop', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Success! KOSA learned ${data.dish}`);
        setIsFileModalOpen(false);
        setSelectedFile(null);
        fetchSops();
      }
    } catch (error) {
      alert('Network error while uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const categories = ['All', 'Dish', 'Gravy', 'Costing', 'Wastage', 'Discipline'];
  
  const filteredSops = sops.filter(sop => {
    const matchesCategory = activeCategory === 'All' || sop.category === activeCategory;
    const matchesSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderContentWithHighlights = (text: string) => {
    if (!text) return null;
    const sections = text.split('\n');
    return sections.map((line, i) => {
      const isHeader = line.toUpperCase().includes(':') && line.length < 50;
      
      const parts = line.split(/(\bHigh\b|\bMedium\b|\bLow\b|\bOil\b|\bButter\b|\bGhee\b)/g);
      
      return (
        <div key={i} className={`mb-4 flex gap-4 items-start ${isHeader ? 'mt-8 border-l-4 border-black pl-4' : ''}`}>
          {!isHeader && line.trim() && (
            <button 
              onClick={() => toggleStep(line)}
              className={`mt-1 transition-colors ${completedSteps[line] ? 'text-green-600' : 'text-black/20 hover:text-black/40'}`}
            >
              {completedSteps[line] ? <CheckSquare size={20} /> : <Square size={20} />}
            </button>
          )}
          <p className={`${isHeader ? 'font-black text-xl text-black uppercase tracking-tighter' : 'font-medium text-[#1a1a1a]'}`}>
            {parts.map((part, j) => {
              const isHighlight = ['High', 'Medium', 'Low', 'Oil', 'Butter', 'Ghee'].includes(part);
              return isHighlight ? (
                <span key={j} className="bg-gold/20 text-black px-2 py-0.5 rounded font-black border border-black/10">
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
      
      {/* HEADER */}
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
        
        <div className="flex flex-wrap gap-4 relative z-10">
          <div className="hidden xl:flex items-center gap-4 bg-black/40 p-4 rounded-3xl border border-white/10 mr-4">
            <img 
              src={DISH_THUMBNAILS["VEG JALFREZI"]} 
              className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg"
              alt="Veg Jalfrezi"
            />
            <div>
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Featured Dish</p>
              <p className="text-xs font-black uppercase text-white">Veg Jalfrezi</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsFileModalOpen(true)}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all"
            >
              <Upload size={18} className="text-gold" />
              AI Training
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gold-gradient text-black rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
            >
              <Plus size={18} />
              Add Manual SOP
            </button>
          </div>
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
            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-16 pr-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 w-full lg:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border shadow-lg ${
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
      ) : filteredSops.length === 0 ? (
        <div className="py-40 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <UtensilsCrossed size={64} className="mx-auto text-white/5 mb-6" />
          <p className="text-white/20 uppercase text-xs font-black tracking-[0.3em]">No operational standards found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredSops.map((sop, idx) => (
            <motion.div 
              key={sop._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card glass-card rounded-[2.5rem] border border-white/5 hover:border-gold/40 transition-all group relative overflow-hidden flex flex-col shadow-xl"
            >
              <div className="h-48 w-full relative overflow-hidden bg-white/5">
                <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="p-4 bg-white/10 hover:bg-gold hover:text-black rounded-2xl transition-all" title="Edit SOP">
                    <Edit3 size={20} />
                  </button>
                  <button className="p-4 bg-white/10 hover:bg-gold hover:text-black rounded-2xl transition-all" title="Duplicate SOP">
                    <Copy size={20} />
                  </button>
                  <button className="p-4 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all" title="Delete SOP">
                    <Trash2 size={20} />
                  </button>
                </div>

                {DISH_THUMBNAILS[sop.title] ? (
                  <img 
                    src={DISH_THUMBNAILS[sop.title]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                    alt={sop.title} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5 group-hover:text-gold/20 transition-colors">
                    <ChefHat size={80} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[9px] font-black text-gold uppercase tracking-widest shadow-2xl z-10">
                  {sop.category}
                </div>
              </div>

              <div className="p-10 pt-4 flex flex-col flex-1">
                <h3 className="text-2xl font-black mb-4 group-hover:text-gold transition-colors tracking-tighter">{sop.title}</h3>
                
                <div className="space-y-3 mb-8 flex-1">
                  <p className="text-white/40 text-xs font-black uppercase tracking-widest">Preview Content:</p>
                  <p className="text-white/60 text-[13px] font-bold line-clamp-2 leading-relaxed italic">
                    {language === 'EN' ? (sop.contentEn || sop.content) : (sop.contentHi || sop.content)}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/20">
                    <Clock size={12} className="text-gold/40" />
                    Updated {new Date(sop.updatedAt || sop.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/20">
                    <UserIcon size={12} className="text-gold/40" />
                    Admin
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setViewingSop(sop)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all group/btn shadow-inner"
                  >
                    <Eye size={16} className="group-hover/btn:scale-125 transition-transform" /> 
                    Open Document
                  </button>
                  <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/40 hover:text-gold transition-all shadow-inner">
                    <Printer size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- SOP VIEWER (PREMIUM PDF STYLE) --- */}
      <AnimatePresence>
        {viewingSop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/98 backdrop-blur-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="w-full max-w-6xl h-full bg-white text-black rounded-[3rem] flex flex-col overflow-hidden shadow-[0_0_150px_rgba(212,175,55,0.3)] border-4 border-gold/10"
            >
              {/* Premium Toolbar */}
              <div className="bg-[#f1f3f5] px-10 py-6 flex items-center justify-between border-b-2 border-[#dee2e6] print:hidden">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-black rounded-[1.25rem] flex items-center justify-center text-gold font-black text-2xl shadow-xl">
                    K
                  </div>
                  <div>
                    <h4 className="font-black text-xl tracking-tighter uppercase">{viewingSop.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#495057] font-black uppercase tracking-widest">SOP #{viewingSop._id.slice(-8).toUpperCase()}</span>
                      <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
                      <span className="text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck size={10} /> Verified Protocol
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex bg-white p-2 rounded-2xl shadow-inner border border-[#dee2e6]">
                    <button 
                      onClick={() => setLanguage('EN')}
                      className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${language === 'EN' ? 'bg-black text-gold shadow-2xl' : 'text-[#495057] hover:bg-[#f1f3f5]'}`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => setLanguage('HI')}
                      className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${language === 'HI' ? 'bg-black text-gold shadow-2xl' : 'text-[#495057] hover:bg-[#f1f3f5]'}`}
                    >
                      हिन्दी
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => window.print()}
                    className="px-8 py-4 bg-black text-white hover:bg-[#333] rounded-2xl transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10"
                  >
                    <Printer size={18} className="text-gold" /> Save as PDF
                  </button>
                  <button 
                    onClick={() => setViewingSop(null)}
                    className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all shadow-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Document Content */}
              <div className="flex-1 overflow-y-auto p-16 md:p-24 bg-white print:p-0 print:overflow-visible">
                <style jsx global>{`
                  @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .print-hidden { display: none !important; }
                  }
                `}</style>
                
                <div className="max-w-4xl mx-auto space-y-16 print-area font-sans">
                  <div className="text-center border-b-4 border-black pb-12 relative">
                    <div className="flex justify-center mb-8">
                      <div className="w-20 h-20 bg-black text-gold rounded-3xl flex items-center justify-center text-4xl font-black border-4 border-gold shadow-2xl">
                        K
                      </div>
                    </div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black">{viewingSop.title}</h2>
                    <div className="flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-[#495057]">
                      <span className="flex items-center gap-2"><ChefHat size={14} /> Section: {viewingSop.category}</span>
                      <span className="w-2 h-2 bg-gold rounded-full"></span>
                      <span>Revision: 2.1 (2026)</span>
                    </div>
                  </div>

                  <div className="space-y-8 py-10">
                    {renderContentWithHighlights(language === 'EN' ? (viewingSop.contentEn || viewingSop.content || "") : (viewingSop.contentHi || viewingSop.content || ""))}
                  </div>

                  <div className="pt-24 border-t-2 border-[#dee2e6] grid grid-cols-3 gap-12 text-[10px] uppercase font-black tracking-[0.2em] text-[#495057]">
                    <div>
                      <p className="mb-10 text-black/20">Executive Chef Signature</p>
                      <div className="h-[1px] bg-black/10 mb-2"></div>
                      <p className="text-black">Production Lead</p>
                    </div>
                    <div>
                      <p className="mb-10 text-black/20">Quality Control Stamp</p>
                      <div className="h-[1px] bg-black/10 mb-2"></div>
                      <p className="text-black text-center">Approved Protocol</p>
                    </div>
                    <div className="text-right">
                      <p className="mb-10 text-black/20">Operational Compliance</p>
                      <div className="h-[1px] bg-black/10 mb-2"></div>
                      <p className="text-black">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <h3 className="text-3xl font-black tracking-tighter uppercase">NEW <span className="text-gold">VAULT ENTRY</span></h3>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X size={32} /></button>
              </div>

              <form onSubmit={handleCreateSop} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-white/40">Operation Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-base font-bold focus:outline-none focus:border-gold focus:bg-white/10 transition-all"
                      placeholder="e.g., MASTER GRAVY RED"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-white/40">System Category</label>
                    <select
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-base font-bold focus:outline-none focus:border-gold focus:bg-white/10 transition-all appearance-none"
                    >
                      <option value="Dish">Dish Production</option>
                      <option value="Gravy">Base Gravy</option>
                      <option value="Costing">Financial Controls</option>
                      <option value="Wastage">Waste Management</option>
                      <option value="Discipline">Standard Discipline</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gold flex items-center gap-3">
                      <Languages size={14} /> English Protocol
                    </label>
                    <textarea
                      value={newContentEn}
                      onChange={(e) => setNewContentEn(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-base font-medium focus:outline-none focus:border-gold h-80 resize-none leading-loose"
                      placeholder="Define the standard operating procedure in English..."
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gold flex items-center gap-3">
                      <Languages size={14} /> हिन्दी निर्देशिका (Hindi Protocol)
                    </label>
                    <textarea
                      value={newContentHi}
                      onChange={(e) => setNewContentHi(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-base font-medium focus:outline-none focus:border-gold h-80 resize-none leading-loose"
                      placeholder="प्रोटोकॉल हिन्दी में लिखें..."
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-6 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-10 py-5 text-white/20 font-black uppercase text-[11px] tracking-widest hover:text-white transition-all"
                  >
                    Abort Entry
                  </button>
                  <button
                    type="submit"
                    className="px-16 py-5 bg-gold-gradient text-black rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-gold/20 hover:scale-[1.05] transition-all"
                  >
                    Secure to Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- AI FILE UPLOAD MODAL --- */}
      <AnimatePresence>
        {isFileModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-card w-full max-w-xl rounded-[3rem] p-12 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gold-gradient"></div>
              
              <div className="w-24 h-24 bg-gold/10 rounded-[2rem] flex items-center justify-center text-gold mx-auto mb-10 shadow-inner">
                <Upload size={48} />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">AI <span className="text-gold">COGNITION</span></h3>
              <p className="text-white/40 text-sm mb-12 font-medium leading-relaxed px-6">
                Upload master recipes in <span className="text-white">PDF/DOCX</span>. Our neural engine will analyze, cross-reference, and index the protocols into the AI memory.
              </p>
              
              <label className="block w-full cursor-pointer mb-12">
                <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] p-12 hover:border-gold/50 transition-all bg-white/5 group shadow-inner">
                  <ImageIcon size={48} className="mx-auto text-white/10 group-hover:text-gold transition-all mb-6 group-hover:scale-110" />
                  <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-gold transition-colors">
                    {selectedFile ? selectedFile.name : 'Select Master Document'}
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
              </label>

              <div className="flex gap-6">
                <button 
                  onClick={() => setIsFileModalOpen(false)}
                  className="flex-1 py-5 text-white/20 font-black uppercase text-[11px] tracking-widest hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={isUploading || !selectedFile}
                  onClick={handleFileUpload}
                  className="flex-1 py-5 bg-gold-gradient text-black rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-gold/10 disabled:opacity-50 hover:scale-[1.05] transition-all"
                >
                  {isUploading ? 'TRAINING...' : 'INITIATE TRAINING'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
