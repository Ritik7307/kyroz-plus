'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, Send, User, Clock, Check, CheckCheck } from 'lucide-react';
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
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex h-[calc(100vh-80px)] bg-background">
      {/* LEFT PANE - CONVERSATIONS */}
      <div className="w-1/3 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border bg-foreground/5 flex items-center justify-between">
          <h2 className="text-xl font-black text-gold tracking-widest uppercase">WhatsApp Inbox</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-foreground/50">
            <MessageCircle size={16} /> {conversations.length}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map(conv => (
            <div 
              key={conv._id} 
              onClick={() => setActiveConv(conv)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-foreground/5 transition-colors flex flex-col gap-1 ${activeConv?._id === conv._id ? 'bg-foreground/10 border-l-4 border-l-gold' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground text-sm uppercase tracking-wide truncate pr-2">{conv.name}</span>
                <span className="text-[10px] text-foreground/50 whitespace-nowrap flex items-center gap-1">
                  <Clock size={10} /> {formatTime(conv.lastMessageAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground/60 truncate">{conv.lastMessagePreview || 'Media Message'}</span>
                {conv.unreadCount > 0 && (
                  <span className="bg-gold text-black text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="p-8 text-center text-foreground/40 text-sm">
              No conversations yet.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE - CHAT */}
      <div className="w-2/3 flex flex-col bg-[#0a0a0a]">
        {activeConv ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-gold">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-foreground uppercase tracking-wide">{activeConv.name}</h3>
                <p className="text-xs text-foreground/50">{activeConv.phone}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {messages.map(msg => {
                const isOutbound = msg.direction === 'outbound';
                const isAdmin = msg.sender === 'admin';
                return (
                  <div key={msg._id} className={`flex flex-col max-w-[70%] ${isOutbound ? 'self-end' : 'self-start'}`}>
                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                      isOutbound 
                        ? (isAdmin ? 'bg-gold text-black rounded-tr-sm' : 'bg-foreground/20 text-foreground rounded-tr-sm') 
                        : 'bg-card border border-border text-foreground rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-[10px] text-foreground/40 ${isOutbound ? 'justify-end' : 'justify-start'}`}>
                      {isAdmin && <span className="font-bold text-gold mr-1">Admin</span>}
                      {msg.sender === 'system' && <span className="font-bold mr-1">AI Bot</span>}
                      {formatTime(msg.timestamp)}
                      {isOutbound && (
                        <span>
                          {msg.status === 'read' ? <CheckCheck size={12} className="text-blue-400" /> : <Check size={12} />}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder="Type a manual reply..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                />
                <button 
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="bg-gold text-black px-6 rounded-xl font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={16} /> <span className="hidden sm:inline">Send</span>
                </button>
              </div>
              <p className="text-[10px] text-foreground/40 mt-2 text-center">
                Manual replies are sent directly via Meta Cloud API. AI will continue to process inbound messages normally.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-foreground/30">
            <MessageCircle size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-bold uppercase tracking-widest">Select a Conversation</p>
            <p className="text-sm">Click on any chat on the left to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
