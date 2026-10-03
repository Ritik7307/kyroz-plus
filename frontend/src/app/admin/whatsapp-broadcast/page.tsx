'use client';

import { useEffect, useMemo, useState } from 'react';
import { Megaphone, Send, Loader2, CheckSquare, Square, UploadCloud, FileText } from 'lucide-react';
import { API_URL } from '@/lib/api';
import Papa from 'papaparse';

type Conversation = {
  _id: string;
  name: string;
  phone: string;
};

type Template = {
  _id: string;
  name: string;
  body: string;
};

type CsvContact = {
  phone: string;
  restaurantName: string;
  [key: string]: any;
};

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export default function WhatsAppBroadcastPage() {
  const [mode, setMode] = useState<'contacts' | 'csv'>('csv');
  const [contacts, setContacts] = useState<Conversation[]>([]);
  const [csvContacts, setCsvContacts] = useState<CsvContact[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [selectAll, setSelectAll] = useState(true);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [convRes, tplRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/whatsapp/conversations`, { headers: authHeaders() }),
          fetch(`${API_URL}/api/admin/whatsapp/templates`, { headers: authHeaders() }),
        ]);
        const convData = await convRes.json();
        const tplData = await tplRes.json();
        
        if (!convRes.ok) throw new Error(convData.error || 'Failed to load contacts');
        
        setContacts(Array.isArray(convData) ? convData : []);
        setTemplates(Array.isArray(tplData) ? tplData : []);
        setSelectedIds(Array.isArray(convData) ? convData.map((c: Conversation) => c._id) : []);

        // Pre-select Meta Approved template if available in CSV mode
        if (Array.isArray(tplData)) {
          const metaTemplate = tplData.find(t => t.name === 'Meta Approved Partnership');
          if (metaTemplate) {
            setMessage(metaTemplate.body);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load broadcast data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleContact = (id: string) => {
    setSelectAll(false);
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const applyTemplate = (tpl: Template) => {
    setMessage(tpl.body);
  };

  const preview = useMemo(() => {
    if (!message) return 'Your broadcast message will appear here.';
    if (mode === 'csv') {
      const sample = csvContacts[0] || { restaurantName: '[Restaurant Name]', phone: '[Phone]' };
      let prev = message;
      for (const [k, v] of Object.entries(sample)) {
        prev = prev.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
      }
      return prev;
    } else {
      return message.replace(/\{\{name\}\}/g, 'there');
    }
  }, [message, mode, csvContacts]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as CsvContact[];
        const valid = parsed.filter(c => c.phone && c.restaurantName);
        setCsvContacts(valid);
        if (valid.length === 0) {
          setError('No valid contacts found in CSV. Make sure headers are "phone" and "restaurantName".');
        } else {
          setError('');
        }
      },
      error: (err) => {
        setError('Failed to parse CSV file: ' + err.message);
      }
    });
  };

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Write a message before sending.');
      return;
    }
    
    if (mode === 'contacts' && !selectAll && selectedIds.length === 0) {
      setError('Select at least one contact.');
      return;
    }

    if (mode === 'csv' && csvContacts.length === 0) {
      setError('Upload a valid CSV file with contacts.');
      return;
    }

    setSending(true);
    setError('');
    setStatus('');
    
    try {
      const url = mode === 'csv' 
        ? `${API_URL}/api/admin/whatsapp/broadcast-csv`
        : `${API_URL}/api/admin/whatsapp/broadcast`;
        
      const payload = mode === 'csv'
        ? { templateText: message.trim(), contacts: csvContacts }
        : { text: message.trim(), conversationIds: selectAll ? [] : selectedIds };

      const res = await fetch(url, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Broadcast failed');
      setStatus(data.message || 'Broadcast sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Broadcast failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-2">WhatsApp</p>
        <h1 className="text-4xl font-black tracking-tighter">BROADCAST <span className="text-gold">MANAGER</span></h1>
        <p className="text-foreground/40 text-sm mt-2">Send WhatsApp messages to your audience efficiently.</p>
      </header>

      {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
      {status && <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{status}</div>}

      <div className="flex bg-foreground/5 rounded-2xl p-1 w-full max-w-md">
        <button
          onClick={() => setMode('csv')}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
            mode === 'csv' ? 'bg-card text-gold shadow-sm' : 'text-foreground/50 hover:text-foreground'
          }`}
        >
          CSV Upload
        </button>
        <button
          onClick={() => setMode('contacts')}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
            mode === 'contacts' ? 'bg-card text-gold shadow-sm' : 'text-foreground/50 hover:text-foreground'
          }`}
        >
          Existing Contacts
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <section className="bg-card border border-foreground/10 rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-3 text-gold text-sm font-black uppercase tracking-widest">
            <Megaphone size={18} /> Compose
          </div>
          
          {mode === 'csv' && (
            <div className="border-2 border-dashed border-foreground/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 relative hover:bg-foreground/5 transition-colors cursor-pointer">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud size={32} className="text-gold/60" />
              <div>
                <p className="text-sm font-bold">{fileName || 'Upload CSV File'}</p>
                <p className="text-xs text-foreground/40 mt-1">Must contain headers: phone, restaurantName</p>
              </div>
            </div>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            placeholder={mode === 'csv' ? "Type message... Use {{restaurantName}} for variables." : "Type the broadcast message..."}
            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-sm outline-none focus:border-gold/40 resize-none"
          />
          <div className="flex flex-wrap gap-2">
            {templates.map((tpl) => (
              <button
                key={tpl._id}
                onClick={() => applyTemplate(tpl)}
                className="px-3 py-2 rounded-xl border border-foreground/10 text-xs font-bold uppercase tracking-wider hover:border-gold/40 hover:text-gold"
              >
                {tpl.name}
              </button>
            ))}
          </div>
          <button
            onClick={handleSend}
            disabled={sending || loading || (mode === 'csv' && csvContacts.length === 0)}
            className="w-full py-4 rounded-2xl bg-gold text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40 hover:scale-[1.02] transition-transform"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {mode === 'csv' 
              ? `Send to ${csvContacts.length} CSV contacts` 
              : selectAll ? 'Send to all contacts' : `Send to ${selectedIds.length} contacts`}
          </button>
        </section>

        <aside className="space-y-6">
          <div className="bg-card border border-foreground/10 rounded-3xl p-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">Preview</h3>
            <p className="text-sm whitespace-pre-wrap leading-6">{preview}</p>
          </div>
          <div className="bg-card border border-foreground/10 rounded-3xl p-6">
            {mode === 'csv' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">CSV Contacts</h3>
                  <span className="text-xs font-bold text-gold">{csvContacts.length} found</span>
                </div>
                <div className="max-h-[360px] overflow-y-auto custom-scrollbar space-y-2">
                  {csvContacts.length === 0 ? (
                    <p className="text-sm text-foreground/40">No contacts loaded yet.</p>
                  ) : (
                    csvContacts.map((c, i) => (
                      <div key={i} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-foreground/5 text-left">
                        <FileText size={16} className="text-gold" />
                        <span>
                          <span className="block text-sm font-bold">{c.restaurantName || 'Unknown'}</span>
                          <span className="block text-xs text-foreground/40">{c.phone}</span>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">Recipients</h3>
                  <button
                    onClick={() => {
                      const next = !selectAll;
                      setSelectAll(next);
                      setSelectedIds(next ? contacts.map((c) => c._id) : []);
                    }}
                    className="text-xs font-bold text-gold uppercase"
                  >
                    {selectAll ? 'All selected' : 'Select all'}
                  </button>
                </div>
                <div className="max-h-[360px] overflow-y-auto custom-scrollbar space-y-2">
                  {loading ? (
                    <p className="text-sm text-foreground/40">Loading contacts...</p>
                  ) : contacts.length === 0 ? (
                    <p className="text-sm text-foreground/40">No contacts found.</p>
                  ) : (
                    contacts.map((c) => {
                      const checked = selectAll || selectedIds.includes(c._id);
                      return (
                        <button
                          key={c._id}
                          onClick={() => toggleContact(c._id)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-foreground/5 text-left"
                        >
                          {checked ? <CheckSquare size={16} className="text-gold" /> : <Square size={16} className="text-foreground/30" />}
                          <span>
                            <span className="block text-sm font-bold">{c.name}</span>
                            <span className="block text-xs text-foreground/40">{c.phone}</span>
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
