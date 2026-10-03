'use client';

import { useEffect, useMemo, useState } from 'react';
import { Megaphone, Send, Loader2, CheckSquare, Square } from 'lucide-react';
import { API_URL } from '@/lib/api';

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

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export default function WhatsAppBroadcastPage() {
  const [contacts, setContacts] = useState<Conversation[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [selectAll, setSelectAll] = useState(true);

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
    setMessage(tpl.body.replace(/\{\{name\}\}/g, 'there'));
  };

  const preview = useMemo(() => message || 'Your broadcast message will appear here.', [message]);

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Write a message before sending.');
      return;
    }
    if (!selectAll && selectedIds.length === 0) {
      setError('Select at least one contact.');
      return;
    }
    setSending(true);
    setError('');
    setStatus('');
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/broadcast`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          text: message.trim(),
          conversationIds: selectAll ? [] : selectedIds,
        }),
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
        <p className="text-foreground/40 text-sm mt-2">Send one WhatsApp message to selected contacts or everyone in the inbox.</p>
      </header>

      {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
      {status && <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{status}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <section className="bg-card border border-foreground/10 rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-3 text-gold text-sm font-black uppercase tracking-widest">
            <Megaphone size={18} /> Compose
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            placeholder="Type the broadcast message..."
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
            disabled={sending || loading}
            className="w-full py-4 rounded-2xl bg-gold text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {selectAll ? 'Send to all contacts' : `Send to ${selectedIds.length} contacts`}
          </button>
        </section>

        <aside className="space-y-6">
          <div className="bg-card border border-foreground/10 rounded-3xl p-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">Preview</h3>
            <p className="text-sm whitespace-pre-wrap leading-6">{preview}</p>
          </div>
          <div className="bg-card border border-foreground/10 rounded-3xl p-6">
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
          </div>
        </aside>
      </div>
    </div>
  );
}
