'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquare, Search, Send, Phone, RefreshCw, Loader2, Paperclip, X, ArrowLeft, CheckSquare } from 'lucide-react';
import io from 'socket.io-client';
import { API_URL } from '@/lib/api';

type Conversation = {
  _id: string;
  name: string;
  phone: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount?: number;
};

type ChatMessage = {
  _id: string;
  conversationId: string;
  sender: 'user' | 'system' | 'admin';
  direction: 'inbound' | 'outbound';
  text?: string;
  timestamp?: string;
  status?: string;
};

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export default function WhatsAppInboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastDraft, setBroadcastDraft] = useState('');
  const [broadcastFile, setBroadcastFile] = useState<File | null>(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState({ done: 0, total: 0 });
  const [selectedBroadcastIds, setSelectedBroadcastIds] = useState<string[]>([]);
  const broadcastFileInputRef = useRef<HTMLInputElement>(null);

  const selected = conversations.find((c) => c._id === selectedId) || null;

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/conversations`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load conversations');
      setConversations(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/conversations/${conversationId}/messages`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load messages');
      setMessages(Array.isArray(data) ? data : []);
      setConversations((prev) => prev.map((c) => (c._id === conversationId ? { ...c, unreadCount: 0 } : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const socket = io(API_URL, { transports: ['websocket', 'polling'] });
    socket.on('new_whatsapp_message', (payload: { conversation?: Conversation; message?: ChatMessage }) => {
      if (payload.conversation) {
        setConversations((prev) => {
          const next = prev.filter((c) => c._id !== payload.conversation?._id);
          return [payload.conversation as Conversation, ...next];
        });
      }
      if (payload.message && payload.message.conversationId === selectedId) {
        setMessages((prev) => [...prev, payload.message as ChatMessage]);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) =>
      (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q)
    );
  }, [conversations, searchQuery]);

  const handleSend = async () => {
    if (!selectedId || sending || (!draft.trim() && !selectedFile)) return;
    setSending(true);
    try {
      let res;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('conversationId', selectedId);
        formData.append('file', selectedFile);
        if (draft.trim()) {
          formData.append('text', draft.trim());
        }

        res = await fetch(`${API_URL}/api/admin/whatsapp/messages/send-media`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
      } else {
        res = await fetch(`${API_URL}/api/admin/whatsapp/messages/send`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ conversationId: selectedId, text: draft.trim() }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setDraft('');
      setSelectedFile(null);
      await loadMessages(selectedId);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastDraft.trim() && !broadcastFile) return;
    if (selectedBroadcastIds.length === 0) return;
    setBroadcasting(true);
    setBroadcastProgress({ done: 0, total: selectedBroadcastIds.length });

    const selectedConvs = conversations.filter(c => selectedBroadcastIds.includes(c._id));

    for (const conv of selectedConvs) {
      try {
        if (broadcastFile) {
          const formData = new FormData();
          formData.append('conversationId', conv._id);
          formData.append('file', broadcastFile);
          if (broadcastDraft.trim()) {
            formData.append('text', broadcastDraft.trim());
          }
          await fetch(`${API_URL}/api/admin/whatsapp/messages/send-media`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: formData,
          });
        } else {
          await fetch(`${API_URL}/api/admin/whatsapp/messages/send`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ conversationId: conv._id, text: broadcastDraft.trim() }),
          });
        }
      } catch (err) {
        console.error(`Failed to send to ${conv.phone}:`, err);
      }
      setBroadcastProgress((prev) => ({ ...prev, done: prev.done + 1 }));
    }

    setBroadcasting(false);
    setShowBroadcastModal(false);
    setBroadcastDraft('');
    setBroadcastFile(null);
    loadConversations();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-2">WhatsApp</p>
          <h1 className="text-4xl font-black tracking-tighter">LIVE <span className="text-gold">INBOX</span></h1>
          <p className="text-foreground/40 text-sm mt-2">Reply to customer and member WhatsApp chats from one place.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedBroadcastIds(conversations.map(c => c._id));
              setShowBroadcastModal(true);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gold text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-gold/20"
          >
            <Send size={16} /> Broadcast
          </button>
          <button
            onClick={loadConversations}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-foreground/10 text-foreground/60 hover:text-gold hover:border-gold/40 transition-all"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-[340px_1fr] gap-4 h-[calc(100vh-16rem)] min-h-[520px] lg:h-[calc(100vh-16rem)]">
        <aside className={`${selectedId ? 'hidden lg:flex' : 'flex'} bg-card border border-foreground/10 rounded-3xl overflow-hidden flex-col h-full lg:h-auto`}>
          <div className="p-4 border-b border-foreground/5">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or phone"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-gold/40"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-foreground/40 text-sm">Loading conversations...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-foreground/40 text-sm">No conversations yet.</div>
            ) : (
              filtered.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => setSelectedId(conv._id)}
                  className={`w-full text-left px-4 py-4 border-b border-foreground/5 hover:bg-foreground/5 ${selectedId === conv._id ? 'bg-gold/10' : ''
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm">{conv.name || 'Unknown'}</p>
                      <p className="text-xs text-foreground/40 mt-1">{conv.phone}</p>
                    </div>
                    {(conv.unreadCount || 0) > 0 && (
                      <span className="min-w-5 h-5 px-1.5 rounded-full bg-gold text-black text-[10px] font-black flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/50 mt-2 line-clamp-1">{conv.lastMessagePreview || 'No messages yet'}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className={`${selectedId ? 'flex' : 'hidden lg:flex'} bg-card border border-foreground/10 rounded-3xl overflow-hidden flex-col h-[70vh] lg:h-auto`}>
          {selected ? (
            <>
              <div className="px-4 lg:px-6 py-4 border-b border-foreground/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedId(null)} className="lg:hidden text-foreground/60 p-2 -ml-2 rounded-xl hover:bg-foreground/5">
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 className="font-black text-lg tracking-tight truncate max-w-[200px] lg:max-w-full">{selected.name}</h2>
                    <p className="text-xs text-foreground/40 flex items-center gap-2 mt-1">
                      <Phone size={12} /> {selected.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
                {messages.map((msg) => {
                  const outbound = msg.direction === 'outbound';
                  return (
                    <div key={msg._id} className={`flex ${outbound ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${outbound ? 'bg-gold text-black font-medium' : 'bg-foreground/5 border border-foreground/10'
                        }`}>
                        <p className="whitespace-pre-wrap">{msg.text || '[media]'}</p>
                        <p className={`text-[10px] mt-2 ${outbound ? 'text-black/60' : 'text-foreground/30'}`}>
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t border-foreground/5 flex flex-col gap-2">
                {selectedFile && (
                  <div className="flex items-center justify-between bg-gold/10 px-4 py-2 rounded-xl text-sm font-medium">
                    <span className="truncate max-w-[250px]">{selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className="text-foreground/50 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf,.doc,.docx"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/60 flex items-center justify-center hover:bg-foreground/10"
                  >
                    <Paperclip size={18} />
                  </button>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a reply..."
                    className="flex-1 min-w-0 bg-foreground/5 border border-foreground/10 rounded-2xl px-3 py-2 lg:px-4 lg:py-3 text-sm outline-none focus:border-gold/40"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || (!draft.trim() && !selectedFile)}
                    className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-2xl bg-gold text-black flex items-center justify-center disabled:opacity-40"
                  >
                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-foreground/40 gap-3">
              <MessageSquare size={36} className="text-gold/40" />
              <p className="text-sm font-medium">Select a conversation to start chatting</p>
            </div>
          )}
        </section>
      </div>

      {showBroadcastModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-[2rem] border border-foreground/10 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight text-gold">Broadcast Message</h2>
              <button onClick={() => setShowBroadcastModal(false)} className="text-foreground/40 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-foreground/60">
                Select the contacts to send the message to.
              </p>
              <button
                onClick={() => {
                  setSelectedBroadcastIds(
                    selectedBroadcastIds.length === conversations.length 
                      ? [] 
                      : conversations.map((c) => c._id)
                  );
                }}
                className="text-xs font-bold text-gold uppercase"
              >
                {selectedBroadcastIds.length === conversations.length ? 'Unselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-[160px] overflow-y-auto custom-scrollbar space-y-2 mb-6 border border-foreground/10 p-3 rounded-2xl bg-foreground/5">
              {conversations.map(c => {
                const checked = selectedBroadcastIds.includes(c._id);
                return (
                  <button
                    key={c._id}
                    onClick={() => {
                      setSelectedBroadcastIds(prev => 
                        prev.includes(c._id) ? prev.filter(id => id !== c._id) : [...prev, c._id]
                      );
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-foreground/10 text-left transition-colors"
                  >
                    <div>
                      <p className="font-bold text-sm">{c.name || 'Unknown'}</p>
                      <p className="text-xs text-foreground/50">{c.phone}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${checked ? 'bg-gold border-gold text-black' : 'border-foreground/30'}`}>
                      {checked && <CheckSquare size={14} className="text-black" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <textarea
                value={broadcastDraft}
                onChange={(e) => setBroadcastDraft(e.target.value)}
                placeholder="Type your broadcast message..."
                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 min-h-[120px] outline-none focus:border-gold/40 text-sm resize-none"
              />
              
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  className="hidden" 
                  ref={broadcastFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setBroadcastFile(e.target.files[0]);
                    }
                  }}
                />
                <button 
                  onClick={() => broadcastFileInputRef.current?.click()}
                  className="px-4 py-2 border border-foreground/10 rounded-xl text-sm flex items-center gap-2 hover:bg-foreground/5 transition-all"
                >
                  <Paperclip size={16} /> 
                  <span className="truncate max-w-[200px]">
                    {broadcastFile ? broadcastFile.name : 'Attach File'}
                  </span>
                </button>
                {broadcastFile && (
                  <button onClick={() => setBroadcastFile(null)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleBroadcast}
                disabled={broadcasting || (!broadcastDraft.trim() && !broadcastFile)}
                className="w-full bg-gold text-black py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {broadcasting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending {broadcastProgress.done} / {broadcastProgress.total}
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send to All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
