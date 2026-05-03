'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'kosa';
  content: string;
};

export default function AiDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'kosa', content: 'Namaste! I am KYROZ KOSA, your AI restaurant consultant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN'; // Default to Indian English/Hindi mix

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const playVoice = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Clean up text for TTS (remove formatting like *, -, \n)
      const cleanText = text.replace(/[*#]/g, '').replace(/\n/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'hi-IN'; // Indian accent (works well for Hinglish)
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userQuery })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'kosa', content: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'kosa', content: data.reply }]);
        // Optionally auto-play voice here: playVoice(data.reply);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'kosa', content: 'Sorry, I am having trouble connecting to my brain right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#111111] rounded-3xl border border-[#333333] overflow-hidden relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#333333] flex items-center justify-between bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-black font-bold text-xl">
            K
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">KYROZ KOSA</h2>
            <p className="text-gray-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Online & Connected to SOPs
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-2xl p-4 ${
              msg.role === 'user' 
              ? 'bg-[#222222] text-white border border-[#333333]' 
              : 'bg-[#1a1a1a] text-gray-200 border border-[#d4af37]/30'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              
              {msg.role === 'kosa' && (
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={() => playVoice(msg.content)}
                    className="text-[#d4af37] hover:text-white text-xs flex items-center gap-1 transition-colors"
                    title="Play Audio"
                  >
                    🔊 Listen
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] text-gray-400 border border-[#333333] rounded-2xl p-4 animate-pulse">
              KOSA is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#333333] bg-[#1a1a1a]">
        <div className="flex items-center gap-3 bg-[#000000] rounded-xl p-2 border border-[#333333]">
          
          <button 
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-colors ${
              isRecording 
              ? 'bg-red-500/20 text-red-500 animate-pulse' 
              : 'bg-[#111111] text-gray-400 hover:text-[#d4af37]'
            }`}
            title="Hold to speak"
          >
            🎤
          </button>

          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? "Listening..." : "Ask KOSA about a recipe, issue, or SOP..."}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600"
            disabled={isRecording}
          />

          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl disabled:opacity-50 hover:bg-[#c5a028] transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
