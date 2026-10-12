'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Loader2, Save, Sparkles, RefreshCw, CheckCircle2, Search, ExternalLink, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

type Template = {
  _id: string;
  name: string;
  body: string;
  category: 'utility' | 'marketing' | 'onboarding' | 'support';
  language: 'en' | 'hi';
};

type MetaTemplate = {
  id: string;
  name: string;
  status: string;
  category: string;
  language: string;
  body: string;
  header?: string;
  footer?: string;
  buttons?: any[];
  variables: string[];
};

const emptyForm = {
  name: '',
  body: '',
  category: 'utility' as Template['category'],
  language: 'en' as Template['language'],
};

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export default function WhatsAppTemplatesPage() {
  const [activeTab, setActiveTab] = useState<'meta' | 'custom'>('meta');
  
  // Meta Templates
  const [metaTemplates, setMetaTemplates] = useState<MetaTemplate[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaSearch, setMetaSearch] = useState('');

  // Custom Local Templates
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const loadMetaTemplates = async () => {
    setLoadingMeta(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/meta-templates`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch Meta templates');
      setMetaTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Meta templates');
    } finally {
      setLoadingMeta(false);
    }
  };

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/templates`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load custom templates');
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load custom templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetaTemplates();
    loadTemplates();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.body.trim()) {
      setError('Name and message body are required.');
      return;
    }
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const url = editingId
        ? `${API_URL}/api/admin/whatsapp/templates/${editingId}`
        : `${API_URL}/api/admin/whatsapp/templates`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save template');
      setStatus(editingId ? 'Template updated' : 'Template created');
      resetForm();
      await loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/templates/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      await loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  const filteredMeta = metaTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(metaSearch.toLowerCase()) ||
      t.body.toLowerCase().includes(metaSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-2">WhatsApp Meta Business</p>
          <h1 className="text-4xl font-black tracking-tighter">MESSAGE <span className="text-gold">TEMPLATES</span></h1>
          <p className="text-foreground/40 text-sm mt-2">
            View live approved Meta templates and manage quick replies for bulk sending.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/whatsapp-broadcast"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gold text-black font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-gold/20"
          >
            <Sparkles size={16} /> Broadcast Templates
          </Link>
          <button
            onClick={loadMetaTemplates}
            disabled={loadingMeta}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-foreground/10 text-foreground/60 hover:text-gold hover:border-gold/40 transition-all text-xs font-bold"
          >
            <RefreshCw size={14} className={loadingMeta ? 'animate-spin' : ''} />
            Refresh Meta
          </button>
        </div>
      </header>

      {/* Segmented Tab Control */}
      <div className="flex items-center gap-2 p-1.5 bg-foreground/5 border border-foreground/10 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('meta')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'meta'
              ? 'bg-gold text-black shadow-md shadow-gold/20'
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          <CheckCircle2 size={15} />
          Meta Approved ({metaTemplates.length})
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'custom'
              ? 'bg-gold text-black shadow-md shadow-gold/20'
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          <FileText size={15} />
          Custom Quick Replies ({templates.length})
        </button>
      </div>

      {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
      {status && <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{status}</div>}

      {/* TAB 1: Meta Approved Templates */}
      {activeTab === 'meta' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-foreground/10 rounded-2xl p-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                value={metaSearch}
                onChange={(e) => setMetaSearch(e.target.value)}
                placeholder="Search approved templates..."
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-gold/40"
              />
            </div>
            <p className="text-xs text-foreground/50 font-medium">
              Showing <span className="text-gold font-bold">{filteredMeta.length}</span> approved template{filteredMeta.length === 1 ? '' : 's'} live from Meta Cloud API
            </p>
          </div>

          {loadingMeta ? (
            <div className="bg-card border border-foreground/10 rounded-3xl p-12 text-center text-foreground/50 flex flex-col items-center justify-center gap-3">
              <Loader2 size={24} className="animate-spin text-gold" />
              <p className="text-sm">Fetching approved message templates directly from Meta Graph API...</p>
            </div>
          ) : filteredMeta.length === 0 ? (
            <div className="bg-card border border-foreground/10 rounded-3xl p-12 text-center text-foreground/50">
              {metaTemplates.length === 0
                ? 'No approved Meta message templates found in your WhatsApp Business Account.'
                : 'No templates match your search.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMeta.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-card border border-foreground/10 hover:border-gold/30 rounded-3xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-base tracking-tight text-foreground group-hover:text-gold transition-colors font-mono">
                          {tpl.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 size={11} /> {tpl.status}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/60 border border-foreground/10">
                            {tpl.category}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/60 border border-foreground/10">
                            {tpl.language}
                          </span>
                        </div>
                      </div>
                    </div>

                    {tpl.header && (
                      <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider">
                        Header: {tpl.header}
                      </p>
                    )}

                    <div className="bg-background/80 rounded-2xl p-3 border border-foreground/5">
                      <p className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans">
                        {tpl.body}
                      </p>
                    </div>

                    {tpl.variables.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-gold/80">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-foreground/40">Variables:</span>
                        {tpl.variables.map((v) => (
                          <span key={v} className="px-1.5 py-0.5 rounded-md bg-gold/10 font-mono text-[10px] font-bold">
                            {`{{${v}}}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-foreground/5 flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/whatsapp-broadcast?template=${encodeURIComponent(tpl.name)}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-gold/10 hover:bg-gold text-gold hover:text-black font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={13} /> Broadcast
                    </Link>
                    <Link
                      href="/admin/whatsapp-inbox"
                      className="py-2 px-3 rounded-xl border border-foreground/10 hover:border-gold/40 text-foreground/70 hover:text-gold text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare size={13} /> Chat Inbox
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Custom Quick Replies (Local DB) */}
      {activeTab === 'custom' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
          <section className="bg-card border border-foreground/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-gold text-sm font-black uppercase tracking-widest">
              {editingId ? <Pencil size={16} /> : <Plus size={16} />}
              {editingId ? 'Edit Quick Reply' : 'New Quick Reply'}
            </div>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Template name"
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-gold/40"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Template['category'] })}
                className="bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-sm outline-none"
              >
                <option value="utility">Utility</option>
                <option value="marketing">Marketing</option>
                <option value="onboarding">Onboarding</option>
                <option value="support">Support</option>
              </select>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value as Template['language'] })}
                className="bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-sm outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={8}
              placeholder="Message body"
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-sm outline-none focus:border-gold/40 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-2xl bg-gold text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingId ? 'Update' : 'Save'}
              </button>
              {editingId && (
                <button onClick={resetForm} className="px-5 py-3 rounded-2xl border border-foreground/10 text-sm font-bold">
                  Cancel
                </button>
              )}
            </div>
          </section>

          <section className="space-y-4">
            {loading ? (
              <p className="text-sm text-foreground/40">Loading templates...</p>
            ) : templates.length === 0 ? (
              <div className="bg-card border border-foreground/10 rounded-3xl p-8 text-center text-foreground/40">
                No custom templates yet.
              </div>
            ) : (
              templates.map((tpl) => (
                <article key={tpl._id} className="bg-card border border-foreground/10 rounded-3xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-gold mb-1">
                        <FileText size={16} />
                        <h3 className="font-black tracking-tight">{tpl.name}</h3>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-foreground/40">
                        {tpl.category} · {tpl.language}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(tpl._id);
                          setForm({ name: tpl.name, body: tpl.body, category: tpl.category, language: tpl.language });
                        }}
                        className="p-2 rounded-xl border border-foreground/10 hover:text-gold"
                      >
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(tpl._id)} className="p-2 rounded-xl border border-foreground/10 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 mt-3 whitespace-pre-wrap">{tpl.body}</p>
                </article>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}
