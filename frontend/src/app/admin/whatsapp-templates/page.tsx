'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Loader2, Save } from 'lucide-react';
import { API_URL } from '@/lib/api';

type Template = {
  _id: string;
  name: string;
  body: string;
  category: 'utility' | 'marketing' | 'onboarding' | 'support';
  language: 'en' | 'hi';
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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/templates`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load templates');
      setTemplates(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  return (
    <div className="space-y-8">
      <header>
        <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-2">WhatsApp</p>
        <h1 className="text-4xl font-black tracking-tighter">MESSAGE <span className="text-gold">TEMPLATES</span></h1>
        <p className="text-foreground/40 text-sm mt-2">Create reusable WhatsApp replies for inbox and broadcasts. Use {'{{name}}'} as a placeholder.</p>
      </header>

      {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
      {status && <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{status}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
        <section className="bg-card border border-foreground/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gold text-sm font-black uppercase tracking-widest">
            {editingId ? <Pencil size={16} /> : <Plus size={16} />}
            {editingId ? 'Edit template' : 'New template'}
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
              No templates yet.
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
    </div>
  );
}
