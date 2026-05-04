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
  File
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
  createdAt: string;
  updatedAt?: string;
}

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

  const [error, setError] = useState<string | null>(null);

  const fetchSops = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Fetching SOPs from:', `${API_URL}/api/sops`);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const res = await fetch(`${API_URL}/api/sops`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      if (res.ok) {
        const data = await res.json();
        console.log('API Data received:', data);
        setSops(Array.isArray(data) ? data : []);
      } else {
        setError(`Server Error: ${res.status}`);
      }
    } catch (err: any) {
      console.error('Failed to fetch SOPs', err);
      setError(`Connection Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchSops();
    
    const cat = searchParams.get('category');
    if (cat) {
      // Normalize category (e.g. Cooking -> Dish)
      if (cat === 'Cooking') setActiveCategory('Dish');
      else setActiveCategory(cat);
    }

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
      const res = await fetch(`${API_URL}/api/sops`, {
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

      const res = await fetch(`${API_URL}/api/ai/upload-sop`, {
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

  const handleSync = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/sops/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchSops();
      }
    } catch (err) {
      console.error('Sync failed');
    } finally {
      setIsLoading(false);
    }
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
            onClick={handleSync}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all group"
            title="Sync with Global Library"
          >
            <RefreshCw size={18} className={`text-gold ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            {isLoading ? 'Syncing...' : 'Sync Global'}
          </button>
          <button 
            onClick={() => setIsFileModalOpen(true)}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all"
          >
            <Upload size={18} className="text-gold" />
            AI Document Training
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gold-gradient text-black rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
          >
            <Plus size={18} />
            Add New Manual SOP
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

      <div className="flex items-center justify-between px-4">
        <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/20">
          Operational <span className="text-gold">Standards</span>
          <span className="ml-4 text-[10px] bg-white/5 px-3 py-1 rounded-full border border-white/5 font-bold tracking-normal">
            Showing {filteredSops.length} of {sops.length}
          </span>
        </h2>
      </div>

      {/* SOP GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="py-20 text-center bg-red-500/5 rounded-[3rem] border border-dashed border-red-500/20">
          <AlertCircle size={48} className="mx-auto text-red-500/40 mb-6" />
          <p className="text-red-500/60 uppercase text-xs font-black tracking-[0.3em] mb-4">{error}</p>
          <button 
            onClick={fetchSops}
            className="px-6 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredSops.length === 0 ? (
        <div className="py-40 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <UtensilsCrossed size={64} className="mx-auto text-white/5 mb-6" />
          <p className="text-white/20 uppercase text-xs font-black tracking-[0.3em] mb-8">No operational standards found</p>
          <button 
            onClick={async () => {
              const token = localStorage.getItem('token');
              const res = await fetch(`${API_URL}/api/sops/sync`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                alert('Master library synced!');
                fetchSops();
              }
            }}
            className="px-8 py-3 bg-gold/10 hover:bg-gold text-gold hover:text-black rounded-2xl text-[11px] font-black uppercase tracking-widest border border-gold/20 transition-all"
          >
            Sync Master Library
          </button>
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
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                  {new Date(sop.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-xl font-black text-gold mb-4 uppercase tracking-tight group-hover:translate-x-1 transition-transform">{sop.title}</h3>
              
              <p className="text-white/40 text-[13px] font-medium line-clamp-3 leading-relaxed mb-8 italic">
                {language === 'EN' ? (sop.contentEn || sop.content) : (sop.contentHi || sop.content)}
              </p>

              <div className="mt-auto flex items-center gap-3">
                <button 
                  onClick={() => setViewingSop(sop)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                >
                  <Eye size={16} /> Open Document
                </button>
                {sop.fileUrl && (
                  <a 
                    href={`${API_URL}${sop.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-white/5 hover:bg-gold hover:text-black border border-white/5 rounded-2xl transition-all"
                  >
                    <File size={16} />
                  </a>
                )}
                <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white/20 hover:text-white transition-all">
                  <Printer size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- SOP VIEWER (PREMIUM DARK STYLE) --- */}
      <AnimatePresence>
        {viewingSop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/98 backdrop-blur-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="w-full max-w-6xl h-full bg-[#111111] text-white rounded-[3rem] flex flex-col overflow-hidden shadow-[0_0_150px_rgba(212,175,55,0.15)] border border-white/10"
            >
              {/* Premium Toolbar */}
              <div className="bg-[#1a1a1a] px-10 py-6 flex items-center justify-between border-b border-white/5 print:hidden">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-gold/10 rounded-[1.25rem] flex items-center justify-center text-gold font-black text-2xl border border-gold/20 shadow-inner">
                    K
                  </div>
                  <div>
                    <h4 className="font-black text-lg tracking-tighter uppercase text-white">{viewingSop.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">SOP #{viewingSop._id.slice(-8).toUpperCase()}</span>
                      <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
                      <span className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck size={10} /> Verified Protocol
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex bg-black p-2 rounded-2xl shadow-inner border border-white/5">
                    <button 
                      onClick={() => setLanguage('EN')}
                      className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${language === 'EN' ? 'bg-[#222222] text-gold shadow-2xl border border-white/5' : 'text-white/40 hover:bg-white/5'}`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => setLanguage('HI')}
                      className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${language === 'HI' ? 'bg-[#222222] text-gold shadow-2xl border border-white/5' : 'text-white/40 hover:bg-white/5'}`}
                    >
                      हिन्दी
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => window.print()}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest border border-white/5"
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
              <div className="flex-1 overflow-y-auto p-16 md:p-24 bg-black print:p-0 print:overflow-visible">
                <style jsx global>{`
                  @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; background: white !important; color: black !important; }
                    .print-hidden { display: none !important; }
                  }
                `}</style>
                
                <div className="max-w-4xl mx-auto space-y-16 print-area font-sans">
                  <div className="text-center border-b border-white/10 pb-12 relative">
                    <div className="flex justify-center mb-8">
                      <div className="w-20 h-20 bg-gold/5 text-gold rounded-3xl flex items-center justify-center text-4xl font-black border border-gold/20 shadow-2xl">
                        K
                      </div>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-gray-100">{viewingSop.title}</h2>
                    <div className="flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
                      <span className="flex items-center gap-2"><ChefHat size={14} /> Section: {viewingSop.category}</span>
                      <span className="w-2 h-2 bg-gold rounded-full"></span>
                      <span>Revision: 2.1 (2026)</span>
                    </div>
                  </div>

                  <div className="space-y-8 py-10">
                    {renderContentWithHighlights(language === 'EN' ? (viewingSop.contentEn || viewingSop.content || "") : (viewingSop.contentHi || viewingSop.content || ""))}
                  </div>

                  <div className="pt-24 border-t border-white/10 grid grid-cols-3 gap-12 text-[10px] uppercase font-black tracking-[0.2em] text-white/40">
                    <div>
                      <p className="mb-10 text-white/10 text-[9px]">Executive Chef Signature</p>
                      <div className="h-[1px] bg-white/5 mb-2"></div>
                      <p className="text-gray-500">Production Lead</p>
                    </div>
                    <div>
                      <p className="mb-10 text-white/10 text-[9px]">Quality Control Stamp</p>
                      <div className="h-[1px] bg-white/5 mb-2"></div>
                      <p className="text-gray-500 text-center">Approved Protocol</p>
                    </div>
                    <div className="text-right">
                      <p className="mb-10 text-white/10 text-[9px]">Operational Compliance</p>
                      <div className="h-[1px] bg-white/5 mb-2"></div>
                      <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
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
