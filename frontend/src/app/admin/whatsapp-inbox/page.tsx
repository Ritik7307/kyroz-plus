'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquare, Search, Send, Phone, RefreshCw, Loader2, Paperclip, X, ArrowLeft, CheckSquare, Sparkles, LayoutTemplate, CheckCircle2, ChevronDown, Layers } from 'lucide-react';
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

  // Meta Templates State
  const [metaTemplates, setMetaTemplates] = useState<MetaTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MetaTemplate | null>(null);
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({});
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [sendingTemplate, setSendingTemplate] = useState(false);

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastType, setBroadcastType] = useState<'custom' | 'template'>('template');
  const [broadcastDraft, setBroadcastDraft] = useState('');
  const [broadcastSelectedTemplate, setBroadcastSelectedTemplate] = useState<MetaTemplate | null>(null);
  const [broadcastVarMapping, setBroadcastVarMapping] = useState<Record<string, string>>({});
  const [broadcastFile, setBroadcastFile] = useState<File | null>(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState({ done: 0, total: 0 });
  const [selectedBroadcastIds, setSelectedBroadcastIds] = useState<string[]>([]);
  const broadcastFileInputRef = useRef<HTMLInputElement>(null);

  const selected = conversations.find((c) => c._id === selectedId) || null;

  const loadMetaTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/meta-templates`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setMetaTemplates(data);
      }
    } catch (err) {
      console.error('Failed to load Meta templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

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
    loadMetaTemplates();
  }, [loadConversations, loadMetaTemplates]);

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
      // If template was selected, prefill {{1}} with the contact's name if available
      if (selected?.name) {
        setTemplateVars((prev) => ({
          ...prev,
          '1': prev['1'] || selected.name
        }));
      }
    }
  }, [selectedId, loadMessages, selected?.name]);

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

  const filteredTemplates = useMemo(() => {
    const q = templateSearch.toLowerCase();
    return metaTemplates.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.body || '').toLowerCase().includes(q)
    );
  }, [metaTemplates, templateSearch]);

  const handleSelectTemplate = (tpl: MetaTemplate) => {
    setSelectedTemplate(tpl);
    setShowTemplatePicker(false);
    const initialVars: Record<string, string> = {};
    tpl.variables.forEach((v) => {
      if (v === '1' && selected?.name) {
        initialVars[v] = selected.name;
      } else {
        initialVars[v] = '';
      }
    });
    setTemplateVars(initialVars);
  };

  const renderedChatTemplate = useMemo(() => {
    if (!selectedTemplate) return '';
    let text = selectedTemplate.body;
    selectedTemplate.variables.forEach((v) => {
      const val = templateVars[v] !== undefined && templateVars[v] !== '' ? templateVars[v] : `{{${v}}}`;
      text = text.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), val);
    });
    return text;
  }, [selectedTemplate, templateVars]);

  const handleSendTemplate = async () => {
    if (!selectedId || !selectedTemplate || sendingTemplate) return;
    setSendingTemplate(true);
    try {
      const bodyParameters = selectedTemplate.variables.map((v) => templateVars[v] || '');
      const res = await fetch(`${API_URL}/api/admin/whatsapp/messages/send-template`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          conversationId: selectedId,
          templateName: selectedTemplate.name,
          languageCode: selectedTemplate.language || 'en',
          bodyParameters,
          renderedText: renderedChatTemplate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send template message');

      setSelectedTemplate(null);
      setTemplateVars({});
      await loadMessages(selectedId);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send template message');
    } finally {
      setSendingTemplate(false);
    }
  };

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
      if (!res.ok) {
        const errorMsg = data.error || 'Failed to send message';
        setError(errorMsg);
        if (
          errorMsg.toLowerCase().includes('template') ||
          errorMsg.toLowerCase().includes('window') ||
          errorMsg.toLowerCase().includes('expired')
        ) {
          setShowTemplatePicker(true);
        }
        return;
      }

      setError('');
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
    if (selectedBroadcastIds.length === 0) return;
    setBroadcasting(true);
    setBroadcastProgress({ done: 0, total: selectedBroadcastIds.length });

    if (broadcastType === 'template') {
      if (!broadcastSelectedTemplate) {
        setError('Please select an approved Meta template');
        setBroadcasting(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/admin/whatsapp/broadcast-template`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            templateName: broadcastSelectedTemplate.name,
            languageCode: broadcastSelectedTemplate.language || 'en',
            templateBody: broadcastSelectedTemplate.body,
            variableMapping: broadcastVarMapping,
            conversationIds: selectedBroadcastIds,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to broadcast template');
        
        setShowBroadcastModal(false);
        setBroadcastSelectedTemplate(null);
        setBroadcastVarMapping({});
        loadConversations();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Broadcast failed');
      } finally {
        setBroadcasting(false);
      }
      return;
    }

    // Custom Mode
    if (!broadcastDraft.trim() && !broadcastFile) {
      setBroadcasting(false);
      return;
    }

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

                <button
                  onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md shadow-gold/20"
                >
                  <Sparkles size={14} />
                  <span>Templates</span>
                  {metaTemplates.length > 0 && (
                    <span className="text-[10px] px-1 rounded-full bg-black/20 text-black font-mono">
                      {metaTemplates.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Inline In-Chat Policy / Error Alert */}
              {error && (
                <div className="mx-4 mt-3 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between gap-2 shadow-sm">
                  <span className="flex-1 font-medium leading-relaxed">{error}</span>
                  {(error.toLowerCase().includes('template') || error.toLowerCase().includes('window')) && (
                    <button
                      onClick={() => {
                        setShowTemplatePicker(true);
                        setError('');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-gold text-black font-bold text-[11px] whitespace-nowrap shadow-sm hover:scale-105 transition-transform"
                    >
                      Pick Template
                    </button>
                  )}
                  <button onClick={() => setError('')} className="text-red-400/60 hover:text-red-400 p-1">
                    <X size={14} />
                  </button>
                </div>
              )}
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
              {/* Active Selected Meta Template Form */}
              {selectedTemplate && (
                <div className="mx-4 mt-2 p-4 bg-gradient-to-br from-gold/10 via-background to-gold/5 border border-gold/30 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-gold" />
                      <span className="font-bold text-sm text-gold">{selectedTemplate.name}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {selectedTemplate.status}
                      </span>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/60">
                        {selectedTemplate.language}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="text-foreground/40 hover:text-red-400 transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Variables Inputs */}
                  {selectedTemplate.variables.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">
                        Fill Template Variables ({selectedTemplate.variables.length} detected)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedTemplate.variables.map((varNum) => (
                          <div key={varNum} className="flex flex-col gap-1">
                            <label className="text-[10px] font-medium text-foreground/60">
                              Variable {`{{${varNum}}}`}:
                            </label>
                            <input
                              value={templateVars[varNum] || ''}
                              onChange={(e) =>
                                setTemplateVars((prev) => ({ ...prev, [varNum]: e.target.value }))
                              }
                              placeholder={varNum === '1' ? 'e.g. ' + (selected?.name || 'Customer Name') : `Value for {{${varNum}}}`}
                              className="bg-card border border-foreground/10 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-gold/50"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Live Rendered Preview */}
                  <div className="bg-background/80 rounded-xl p-3 border border-foreground/5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-foreground/40 mb-1">
                      Live Preview (As Recipient Sees It):
                    </p>
                    <p className="text-xs whitespace-pre-wrap text-foreground/80 leading-relaxed font-mono">
                      {renderedChatTemplate}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="px-3 py-1.5 rounded-xl text-xs text-foreground/60 hover:bg-foreground/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendTemplate}
                      disabled={sendingTemplate}
                      className="px-4 py-2 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md shadow-gold/20 disabled:opacity-50"
                    >
                      {sendingTemplate ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      Send Meta Template
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-foreground/5 flex flex-col gap-2 relative">
                {selectedFile && (
                  <div className="flex items-center justify-between bg-gold/10 px-4 py-2 rounded-xl text-sm font-medium">
                    <span className="truncate max-w-[250px]">{selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className="text-foreground/50 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Template Picker Popover */}
                {showTemplatePicker && (
                  <div className="absolute bottom-20 left-2 right-2 sm:left-4 sm:right-auto sm:w-96 z-50 bg-card border border-foreground/15 rounded-3xl p-4 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-gold" />
                        <h3 className="font-black text-xs uppercase tracking-wider text-gold">
                          Meta Approved Templates
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowTemplatePicker(false)}
                        className="text-foreground/40 hover:text-foreground"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="relative mb-3">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                      <input
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        placeholder="Search templates..."
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-gold/40"
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                      {loadingTemplates ? (
                        <div className="p-4 text-center text-xs text-foreground/40 flex items-center justify-center gap-2">
                          <Loader2 size={14} className="animate-spin" /> Fetching from Meta...
                        </div>
                      ) : filteredTemplates.length === 0 ? (
                        <div className="p-4 text-center text-xs text-foreground/40">
                          No approved templates found.
                        </div>
                      ) : (
                        filteredTemplates.map((tpl) => (
                          <button
                            key={tpl.id}
                            onClick={() => handleSelectTemplate(tpl)}
                            className="w-full text-left p-3 rounded-2xl bg-foreground/5 hover:bg-gold/10 border border-foreground/5 hover:border-gold/30 transition-all group"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-xs group-hover:text-gold truncate">
                                {tpl.name}
                              </span>
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                                {tpl.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-foreground/50 line-clamp-2 leading-relaxed">
                              {tpl.body}
                            </p>
                            {tpl.variables.length > 0 && (
                              <p className="text-[10px] text-gold/70 mt-1">
                                {tpl.variables.length} variable{tpl.variables.length > 1 ? 's' : ''} ({tpl.variables.map(v => `{{${v}}}`).join(', ')})
                              </p>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf,.doc,.docx"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach File"
                    className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/60 flex items-center justify-center hover:bg-foreground/10 transition-colors"
                  >
                    <Paperclip size={18} />
                  </button>

                  <button
                    onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                    title="Select Meta Template"
                    className={`h-10 lg:h-12 px-3 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                      selectedTemplate || showTemplatePicker
                        ? 'bg-gold/20 border-gold text-gold'
                        : 'bg-foreground/5 border-foreground/10 text-foreground/70 hover:bg-foreground/10'
                    }`}
                  >
                    <Sparkles size={16} className="text-gold" />
                    <span className="hidden sm:inline">Templates</span>
                    {metaTemplates.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold font-mono">
                        {metaTemplates.length}
                      </span>
                    )}
                  </button>

                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a reply or pick a template..."
                    className="flex-1 min-w-0 bg-foreground/5 border border-foreground/10 rounded-2xl px-3 py-2 lg:px-4 lg:py-3 text-sm outline-none focus:border-gold/40"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || (!draft.trim() && !selectedFile)}
                    className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-2xl bg-gold text-black flex items-center justify-center disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
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
          <div className="bg-card w-full max-w-xl rounded-[2rem] border border-foreground/10 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-gold">Broadcast Message</h2>
                <p className="text-xs text-foreground/50 mt-0.5">Send bulk messages or Meta approved templates</p>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="text-foreground/40 hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-foreground/5 rounded-2xl border border-foreground/10 mb-6">
              <button
                type="button"
                onClick={() => setBroadcastType('template')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  broadcastType === 'template'
                    ? 'bg-gold text-black shadow-md shadow-gold/20'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <Sparkles size={14} /> Meta Approved Template
              </button>
              <button
                type="button"
                onClick={() => setBroadcastType('custom')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  broadcastType === 'custom'
                    ? 'bg-gold text-black shadow-md shadow-gold/20'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <MessageSquare size={14} /> Custom Text / Media
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/60">
                Select Recipients ({selectedBroadcastIds.length} of {conversations.length} selected)
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

            <div className="max-h-[140px] overflow-y-auto custom-scrollbar space-y-1.5 mb-6 border border-foreground/10 p-3 rounded-2xl bg-foreground/5">
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
                      <p className="font-bold text-xs">{c.name || 'Unknown'}</p>
                      <p className="text-[11px] text-foreground/50">{c.phone}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${checked ? 'bg-gold border-gold text-black' : 'border-foreground/30'}`}>
                      {checked && <CheckSquare size={14} className="text-black" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {broadcastType === 'template' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">
                    Select Approved Template
                  </label>
                  <select
                    value={broadcastSelectedTemplate?.name || ''}
                    onChange={(e) => {
                      const tpl = metaTemplates.find((t) => t.name === e.target.value) || null;
                      setBroadcastSelectedTemplate(tpl);
                      const initialMap: Record<string, string> = {};
                      tpl?.variables.forEach((v) => {
                        initialMap[v] = v === '1' ? 'restaurantName' : '';
                      });
                      setBroadcastVarMapping(initialMap);
                    }}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-3.5 text-sm outline-none focus:border-gold/40 text-foreground cursor-pointer"
                  >
                    <option value="" className="bg-card text-foreground">-- Select Meta Approved Template --</option>
                    {metaTemplates.map((t) => (
                      <option key={t.id} value={t.name} className="bg-card text-foreground">
                        {t.name} ({t.status} • {t.language})
                      </option>
                    ))}
                  </select>
                </div>

                {broadcastSelectedTemplate && (
                  <div className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gold">{broadcastSelectedTemplate.name}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                        {broadcastSelectedTemplate.status}
                      </span>
                    </div>

                    <div className="p-3 bg-background/60 rounded-xl border border-foreground/5 text-xs text-foreground/80 font-mono whitespace-pre-wrap">
                      {broadcastSelectedTemplate.body}
                    </div>

                    {broadcastSelectedTemplate.variables.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-foreground/5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/60">
                          Variable Mapping / Inputs
                        </p>
                        {broadcastSelectedTemplate.variables.map((varNum) => (
                          <div key={varNum} className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gold w-20 flex-shrink-0">
                              {`{{${varNum}}}`}
                            </span>
                            <input
                              value={broadcastVarMapping[varNum] || ''}
                              onChange={(e) =>
                                setBroadcastVarMapping((prev) => ({
                                  ...prev,
                                  [varNum]: e.target.value,
                                }))
                              }
                              placeholder={varNum === '1' ? 'restaurantName or recipient name' : `Value for {{${varNum}}}`}
                              className="flex-1 bg-card border border-foreground/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-gold/40"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
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
            )}

            <div className="mt-8">
              <button
                onClick={handleBroadcast}
                disabled={
                  broadcasting ||
                  selectedBroadcastIds.length === 0 ||
                  (broadcastType === 'template' && !broadcastSelectedTemplate) ||
                  (broadcastType === 'custom' && !broadcastDraft.trim() && !broadcastFile)
                }
                className="w-full bg-gold text-black py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-gold/20"
              >
                {broadcasting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending {broadcastProgress.done} / {broadcastProgress.total}
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Broadcast to {selectedBroadcastIds.length} Contact{selectedBroadcastIds.length === 1 ? '' : 's'}
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
