'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, Send, User, Clock, Check, CheckCheck, Search, Phone, MoreVertical, Bot, Paperclip, Image as ImageIcon, Video, SwitchCamera, Upload, Filter, X } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Conversation {
  _id: string;
  phone: string;
  name: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: number;
}

interface Message {
  _id: string;
  messageId: string;
  sender: 'user' | 'system' | 'admin';
  direction: 'inbound' | 'outbound';
  type: string;
  text: string;
  status: string;
  timestamp: string;
}

export default function WhatsappInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [takeover, setTakeover] = useState(false);
  const [isSendAllModalOpen, setIsSendAllModalOpen] = useState(false);
  const [sendAllMessage, setSendAllMessage] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConversations();
    
    // Initialize Socket
    const newSocket = io(API_URL.replace('/api', ''), { transports: ['websocket', 'polling'] });
    setSocket(newSocket);

    newSocket.on('new_whatsapp_message', (data) => {
      const { conversation, message } = data;
      
      setConversations(prev => {
        const existing = prev.find(c => c._id === conversation._id);
        if (existing) {
          return [conversation, ...prev.filter(c => c._id !== conversation._id)];
        } else {
          return [conversation, ...prev];
        }
      });

      setActiveConv(currentActive => {
        if (currentActive && currentActive._id === conversation._id) {
          setMessages(prevMsgs => [...prevMsgs, message]);
          return conversation;
        }
        return currentActive;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
    }
  }, [activeConv?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/conversations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setConversations(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/conversations/${id}/messages`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setMessages(await res.json());
        // Update unread count locally
        setConversations(prev => prev.map(c => c._id === id ? { ...c, unreadCount: 0 } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeConv) return;
    
    const textToSend = replyText;
    setReplyText(''); // optimistic clear
    
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/messages/send`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: activeConv._id,
          text: textToSend
        })
      });
      
      if (!res.ok) {
        alert('Failed to send message');
        setReplyText(textToSend); // restore on fail
      }
    } catch (err) {
      console.error(err);
      setReplyText(textToSend);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    if (!matchesSearch) return false;
    if (filterType === 'unread') return c.unreadCount > 0;
    return true;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        // Basic CSV parsing
        const lines = text.split('\n').filter(l => l.trim() !== '');
        const contacts = [];
        
        // Skip header if first line looks like header
        let startIndex = 0;
        if (lines[0].toLowerCase().includes('restaurant') || lines[0].toLowerCase().includes('name')) {
          startIndex = 1;
        }

        for (let i = startIndex; i < lines.length; i++) {
          // split by comma, handling potential quotes roughly
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 2) {
            contacts.push({ name: cols[0], phone: cols[1] });
          }
        }

        if (contacts.length === 0) {
          alert('No valid contacts found in CSV. Expected format: Restaurant Name, Contact No.');
          return;
        }

        const res = await fetch(`${API_URL}/api/admin/whatsapp/import-contacts`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ contacts })
        });
        
        if (res.ok) {
          const data = await res.json();
          alert(data.message);
          fetchConversations();
        } else {
          alert('Failed to import contacts');
        }
      } catch (err) {
        console.error(err);
        alert('Error parsing CSV');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const executeSendAll = async () => {
    if (!sendAllMessage.trim()) return;
    try {
      await fetch(`${API_URL}/api/admin/whatsapp/messages/send-all`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: sendAllMessage })
      });
      alert('Message sent to all users');
      setIsSendAllModalOpen(false);
      setSendAllMessage('');
    } catch (e) {
      alert('Failed to send message to all');
    }
  };

  const getDisplayName = (conv: Conversation) => {
    if (!conv.name || conv.name.toLowerCase() === 'unknown user') {
      return conv.phone;
    }
    return conv.name;
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    if (!name || name.toLowerCase() === 'unknown user') return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Helper to assign a consistent random color to avatars based on phone
  const getAvatarColor = (phone: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    const index = phone.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-card border border-border shadow-2xl overflow-hidden mt-2 relative z-10" style={{ borderRadius: '24px' }}>
      {/* LEFT PANE - CONVERSATIONS */}
      <div className="w-[380px] min-w-[320px] border-r border-border bg-background flex flex-col z-20">
        
        {/* Header */}
        <div className="p-4 px-5 border-b border-border bg-card/80 flex items-center justify-between h-[72px]">
          <h2 className="text-[15px] font-black text-foreground tracking-widest uppercase">Live Chats <span className="text-foreground/40 font-normal">({conversations.length} Active)</span></h2>
          <div className="flex items-center gap-2">
            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1"
              title="Import CSV (Format: Restaurant Name, Contact No)"
            >
              <Upload size={14} /> Import
            </button>
            <button 
              onClick={() => setIsSendAllModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-bold transition-colors"
            >
              Send to All
            </button>
            <span className="text-[10px] font-bold text-foreground/50 uppercase">Takeover</span>
            <button 
              onClick={() => setTakeover(!takeover)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${takeover ? 'bg-green-500' : 'bg-foreground/20'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${takeover ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
        
        {/* Search & Filter */}
        <div className="p-3 border-b border-border bg-background space-y-2">
          <div className="bg-card border border-border rounded-xl flex items-center px-3 py-2">
            <Search size={16} className="text-foreground/40 mr-2" />
            <input 
              type="text" 
              placeholder="Search by name or phone" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder-foreground/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-foreground/40" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-card border border-border rounded-lg text-xs px-2 py-1 outline-none text-foreground flex-1"
            >
              <option value="all">All Chats</option>
              <option value="unread">Unread Only</option>
            </select>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
          {filteredConversations.map(conv => {
            const isActive = activeConv?._id === conv._id;
            const displayName = getDisplayName(conv);
            return (
              <div 
                key={conv._id} 
                onClick={() => setActiveConv(conv)}
                className={`flex items-center gap-3 p-3 px-4 cursor-pointer hover:bg-foreground/5 transition-colors border-b border-border/50 relative ${
                  isActive ? 'bg-[#1a202c] hover:bg-[#1a202c]' : ''
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r-md"></div>}
                
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0 ${getAvatarColor(conv.phone)}`}>
                  {getInitials(displayName)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`font-bold text-sm truncate pr-2 ${isActive ? 'text-white' : 'text-foreground'}`}>
                      {displayName}
                    </span>
                    <span className={`text-[11px] whitespace-nowrap ${conv.unreadCount > 0 ? 'text-green-500 font-bold' : 'text-foreground/40'}`}>
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-[13px] truncate ${conv.unreadCount > 0 ? 'text-foreground font-semibold' : 'text-foreground/50'}`}>
                      {conv.lastMessagePreview || 'Media Message'}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 ml-2">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-foreground/40 text-sm">
              No chats found.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE - CHAT */}
      <div className="flex-1 flex flex-col relative bg-[#e5ddd5] dark:bg-[#0b141a]">
        {/* WhatsApp Web Style Background Pattern */}
        <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none z-0" 
             style={{ backgroundImage: 'url("https://w7.pngwing.com/pngs/351/361/png-transparent-whatsapp-background-thumbnail.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }}>
        </div>

        {activeConv ? (
          <div className="flex flex-col h-full z-10">
            {/* Chat Header */}
            <div className="h-[72px] px-5 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#d1d7db] dark:border-[#2a3942] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(activeConv.phone)}`}>
                  {getInitials(getDisplayName(activeConv))}
                </div>
                <div>
                  <h3 className="font-semibold text-[16px] text-[#111b21] dark:text-[#e9edef] leading-5">{getDisplayName(activeConv)}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[13px] text-[#667781] dark:text-[#8696a0] leading-4">{activeConv.phone}</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[12px] text-green-500 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-[#54656f] dark:text-[#aebac1]">
                <button className="hover:bg-foreground/5 p-2 rounded-full"><Search size={20} /></button>
                <button className="hover:bg-foreground/5 p-2 rounded-full"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-2 custom-scrollbar relative">
              {/* Date Badge */}
              <div className="flex justify-center my-2">
                <div className="bg-white dark:bg-[#182229] shadow-sm text-[#54656f] dark:text-[#8696a0] text-[12px] px-3 py-1 rounded-lg uppercase tracking-wide font-medium">
                  TODAY
                </div>
              </div>

              {messages.map(msg => {
                const isOutbound = msg.direction === 'outbound';
                const isAdmin = msg.sender === 'admin';
                const isSystem = msg.sender === 'system';
                
                return (
                  <div key={msg._id} className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isOutbound ? 'self-end' : 'self-start'} mb-1 group`}>
                    
                    {/* Sender Label for Outbound context */}
                    {isOutbound && (
                      <div className="text-[10px] text-foreground/50 mb-0.5 ml-2 font-bold flex items-center gap-1 justify-end">
                        {isAdmin ? (
                           <><User size={10}/> Admin</>
                        ) : (
                           <><Bot size={10}/> Kyroz AI Bot</>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {/* Avatar for Inbound */}
                      {!isOutbound && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold mt-1 shadow-sm flex-shrink-0 ${getAvatarColor(activeConv.phone)}`}>
                          {getInitials(getDisplayName(activeConv))}
                        </div>
                      )}

                      <div className={`relative px-3 py-2 text-[14.5px] shadow-sm leading-relaxed ${
                        isOutbound 
                          ? (isAdmin ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-l-xl rounded-tr-xl rounded-br-sm' : 'bg-[#e7f8e3] dark:bg-[#1a4a3e] text-[#111b21] dark:text-[#e9edef] rounded-l-xl rounded-tr-xl rounded-br-sm') 
                          : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-r-xl rounded-tl-xl rounded-bl-sm'
                      }`}>
                        
                        {/* The Tail */}
                        {isOutbound ? (
                          <svg viewBox="0 0 8 13" width="8" height="13" className={`absolute -right-[8px] top-0 ${isAdmin ? 'text-[#d9fdd3] dark:text-[#005c4b]' : 'text-[#e7f8e3] dark:text-[#1a4a3e]'} fill-current`}>
                            <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
                            <path d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 8 13" width="8" height="13" className="absolute -left-[8px] top-0 text-white dark:text-[#202c33] fill-current">
                            <path opacity=".13" fill="#0000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path>
                            <path d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path>
                          </svg>
                        )}

                        <span className="whitespace-pre-wrap">{msg.text}</span>
                        
                        <div className={`flex items-center gap-1 float-right mt-2 ml-4 text-[10px] ${
                          isOutbound 
                            ? 'text-[#667781] dark:text-[#8696a0]' 
                            : 'text-[#667781] dark:text-[#8696a0]'
                        }`}>
                          <span>{formatTime(msg.timestamp)}</span>
                          {isOutbound && (
                            <span className="ml-0.5">
                              {msg.status === 'read' ? <CheckCheck size={14} className="text-[#53bdeb]" /> : <Check size={14} />}
                            </span>
                          )}
                        </div>
                        {/* Clear float hack */}
                        <div className="clear-both"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="min-h-[62px] px-4 py-3 bg-[#f0f2f5] dark:bg-[#202c33] flex items-end gap-3 z-20">
              <div className="flex gap-2 text-[#54656f] dark:text-[#aebac1] pb-2">
                <button className="hover:bg-foreground/10 p-2 rounded-full transition-colors"><Paperclip size={22} /></button>
              </div>
              
              <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg shadow-sm border border-transparent dark:border-[#31434e] flex items-end">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  placeholder={takeover ? "Type your manual reply here..." : "Takeover is OFF. Turn ON to reply manually..."}
                  disabled={!takeover}
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                  className="w-full bg-transparent border-none outline-none resize-none px-4 py-2.5 text-[15px] text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] custom-scrollbar disabled:opacity-50"
                />
              </div>
              
              <button 
                onClick={handleSendReply}
                disabled={!replyText.trim() || !takeover}
                className={`p-3 rounded-full flex items-center justify-center transition-colors pb-2 ${
                  replyText.trim() && takeover ? 'text-green-500 bg-green-500/10' : 'text-[#54656f] dark:text-[#aebac1]'
                }`}
              >
                {replyText.trim() ? <Send size={22} className="ml-1" /> : <Send size={22} className="opacity-50" />}
              </button>
            </div>
            {!takeover && (
               <div className="absolute bottom-[70px] left-1/2 -translate-x-1/2 bg-[#111b21]/80 dark:bg-black/60 backdrop-blur text-white text-[11px] px-4 py-1.5 rounded-full z-30 font-medium tracking-wide">
                 Enable Takeover from the top left switch to reply manually
               </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 border-b-8 border-green-500 z-10 bg-[#f0f2f5] dark:bg-[#222e35]">
            <div className="w-[300px] mb-8">
              {/* WhatsApp like placeholder image */}
              <div className="relative mx-auto w-64 h-48 mb-8 opacity-70">
                <div className="absolute inset-0 border-2 border-dashed border-foreground/20 rounded-3xl flex items-center justify-center bg-background/50 backdrop-blur-sm">
                   <div className="flex gap-4 items-end">
                     <div className="w-12 h-10 bg-green-500/20 rounded-t-xl rounded-br-xl"></div>
                     <div className="w-16 h-12 bg-foreground/10 rounded-t-xl rounded-bl-xl"></div>
                   </div>
                   <MessageCircle size={64} className="absolute text-foreground/20" strokeWidth={1} />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-light text-[#41525d] dark:text-[#e9edef] mb-4">KYROZ+ Admin WhatsApp</h1>
            <p className="text-[14px] text-[#667781] dark:text-[#8696a0] max-w-md leading-relaxed">
              Send and receive messages seamlessly from the Dashboard. <br/>
              Select a conversation to view your AI Bot's interactions or take over manually.
            </p>
            <div className="mt-8 flex items-center gap-2 text-[12px] text-[#8696a0]">
              <Lock size={12} /> End-to-end encrypted integration
            </div>
          </div>
        )}
      </div>

      {/* Send to All Modal */}
      {isSendAllModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-2xl w-[90%] max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsSendAllModalOpen(false)}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4">Send Broadcast Message</h3>
            <p className="text-sm text-foreground/60 mb-4">
              This message will be sent to all {conversations.length} active contacts in your Live Chats list.
            </p>
            <textarea
              value={sendAllMessage}
              onChange={(e) => setSendAllMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={5}
              className="w-full bg-background border border-border rounded-xl p-3 outline-none resize-none mb-4 custom-scrollbar"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsSendAllModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-foreground/70 hover:bg-foreground/5"
              >
                Cancel
              </button>
              <button 
                onClick={executeSendAll}
                disabled={!sendAllMessage.trim()}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold disabled:opacity-50"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Lock icon since it wasn't imported at top
function Lock(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}
