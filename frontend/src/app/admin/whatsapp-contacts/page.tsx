'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Upload, Users } from 'lucide-react';
import { API_URL } from '@/lib/api';

type Conversation = {
  _id: string;
  name: string;
  phone: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
};

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export default function WhatsAppContactsPage() {
  const [contacts, setContacts] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/conversations`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load contacts');
      setContacts(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return contacts.filter((c) => (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q));
  }, [contacts, searchQuery]);

  const handleImport = async (file: File) => {
    const text = await file.text();
    const rows = text.split(/\r?\n/).filter(Boolean);
    const contactsToImport = rows.map((row) => {
      const [name, phone] = row.split(',').map((part) => part?.trim().replace(/^"|"$/g, ''));
      return { name: name || 'Imported User', phone: phone || name };
    }).filter((c) => c.phone);

    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/import-contacts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ contacts: contactsToImport }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');
      setStatus(data.message || 'Contacts imported');
      await loadContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-2">WhatsApp</p>
          <h1 className="text-4xl font-black tracking-tighter">WHATSAPP <span className="text-gold">CONTACTS</span></h1>
          <p className="text-foreground/40 text-sm mt-2">All numbers available for inbox and broadcast messages.</p>
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gold text-black font-black uppercase tracking-widest cursor-pointer">
          <Upload size={16} /> Import CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = '';
            }}
          />
        </label>
      </header>

      {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
      {status && <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{status}</div>}

      <div className="bg-card border border-foreground/10 rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts"
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-gold/40"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/50">
            <Users size={16} className="text-gold" /> {filtered.length} contacts
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-foreground/40">Loading contacts...</p>
        ) : (
          <div className="divide-y divide-foreground/5">
            {filtered.map((c) => (
              <div key={c._id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-sm text-foreground/40">{c.phone}</p>
                </div>
                <p className="text-xs text-foreground/30 max-w-xs truncate">{c.lastMessagePreview || 'No recent message'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
