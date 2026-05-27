'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic, MicOff, X, Volume2, VolumeX, Send, Loader2, Sparkles, Minimize2, Maximize2, FileUp, Square } from 'lucide-react';

import { API_URL } from '@/lib/api';

// Pointing to main backend /api/ai
const AI_CORE_URL = `${API_URL}/api/ai`;
const MIN_RECORDING_MS = 800;
const MAX_RECORDING_MS = 20000;
const SILENCE_STOP_MS = 1400;
const NO_SPEECH_TIMEOUT_MS = 7000;
const SPEECH_RMS_THRESHOLD = 0.018;
const MIN_AUDIO_BYTES = 1500;
const RECORDER_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/mpeg'
];

type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking';
type BrowserWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

const getSupportedMimeType = () => {
  if (typeof MediaRecorder === 'undefined') return '';
  return RECORDER_MIME_TYPES.find(type => MediaRecorder.isTypeSupported(type)) || '';
};

const audioExtensionFromMime = (mimeType: string) => {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('mpeg')) return 'mp3';
  return 'webm';
};

const getMicErrorMessage = (error: unknown) => {
  const name = error instanceof DOMException ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'Microphone permission was blocked. Allow mic access in the browser and try again.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No microphone device was found. Connect or enable a mic and try again.';
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Your microphone is busy in another app. Close it and try again.';
  }
  if (name === 'OverconstrainedError') {
    return 'This microphone does not support the requested audio settings.';
  }
  return 'Microphone could not start in this browser.';
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function FloatingKOSA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! I am Chef (Production Edition). I can read your PDFs and speak fluently in Hindi & English. How can I assist?", timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>('en');
  const [isUploading, setIsUploading] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(12).fill(0.1));
  const [errorMessage, setErrorMessage] = useState('');
  const [voiceHint, setVoiceHint] = useState('Tap the mic and speak in Hindi, English, or both.');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noSpeechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minRecordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxRecordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSpeechRef = useRef(false);
  const canStopRecordingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const recordingMimeTypeRef = useRef('audio/webm');
  const activeAudioUrlRef = useRef<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, assistantState]);

  const clearRecordingTimers = () => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (noSpeechTimeoutRef.current) clearTimeout(noSpeechTimeoutRef.current);
    if (minRecordingTimeoutRef.current) clearTimeout(minRecordingTimeoutRef.current);
    if (maxRecordingTimeoutRef.current) clearTimeout(maxRecordingTimeoutRef.current);
    silenceTimeoutRef.current = null;
    noSpeechTimeoutRef.current = null;
    minRecordingTimeoutRef.current = null;
    maxRecordingTimeoutRef.current = null;
  };

  const cleanupVoice = (resetState = true) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    clearRecordingTimers();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (resetState) setAssistantState('idle');
    setVisualizerData(new Array(12).fill(0.1));
    mediaRecorderRef.current = null;
    analyserRef.current = null;
    hasSpeechRef.current = false;
    canStopRecordingRef.current = false;
    isStoppingRef.current = false;
  };

  const stopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setAssistantState('idle');
    setVoiceHint('Request cancelled.');
    setTimeout(() => {
      setVoiceHint('Tap the mic and speak in Hindi, English, or both.');
    }, 2000);
  };

  const stopSpeaking = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setAssistantState('idle');
    setVoiceHint('Tap the mic and speak in Hindi, English, or both.');
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive' || isStoppingRef.current) return;
    if (!canStopRecordingRef.current) {
      minRecordingTimeoutRef.current = setTimeout(stopRecording, MIN_RECORDING_MS);
      return;
    }
    isStoppingRef.current = true;
    clearRecordingTimers();
    recorder.requestData();
    recorder.stop();
  };

  // Simulated Visualizer for Speaking
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (assistantState === 'speaking') {
      interval = setInterval(() => {
        setVisualizerData(prev => prev.map(() => Math.random() * 0.6 + 0.1));
      }, 100);
    } else if (assistantState === 'idle') {
      setVisualizerData(new Array(12).fill(0.1));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [assistantState]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (noSpeechTimeoutRef.current) clearTimeout(noSpeechTimeoutRef.current);
      if (minRecordingTimeoutRef.current) clearTimeout(minRecordingTimeoutRef.current);
      if (maxRecordingTimeoutRef.current) clearTimeout(maxRecordingTimeoutRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (activeAudioUrlRef.current) URL.revokeObjectURL(activeAudioUrlRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      setErrorMessage('');
      setVoiceHint('Listening... speak naturally. I will stop after a short silence.');

      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        setErrorMessage('Voice recording is not supported in this browser. Try Chrome or Edge.');
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
      const hasMic = devices.length === 0 || devices.some(device => device.kind === 'audioinput');
      if (!hasMic) {
        setErrorMessage('No microphone device was found. Connect or enable a mic and try again.');
        return;
      }

      const mimeType = getSupportedMimeType();
      if (!mimeType) {
        setErrorMessage('This browser cannot record audio in a Whisper-compatible format.');
        return;
      }

      cleanupVoice(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 48000,
        },
      });
      streamRef.current = stream;

      const AudioContextCtor = window.AudioContext || (window as BrowserWindow).webkitAudioContext;
      if (!AudioContextCtor) {
        throw new DOMException('AudioContext is not supported', 'NotSupportedError');
      }
      const audioContext = new AudioContextCtor();
      await audioContext.resume();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.25;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      recordingMimeTypeRef.current = mimeType;
      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
      audioChunksRef.current = [];
      hasSpeechRef.current = false;
      canStopRecordingRef.current = false;
      isStoppingRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recordingMimeTypeRef.current });
        cleanupVoice(false);
        if (audioBlob.size > MIN_AUDIO_BYTES) {
          handleTranscription(audioBlob);
        } else {
          setVoiceHint('I could not hear enough audio. Please move closer and try again.');
          setAssistantState('idle');
        }
      };

      recorder.onerror = () => {
        cleanupVoice();
        setErrorMessage('Recording failed. Please try again.');
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setAssistantState('listening');

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeDataArray = new Uint8Array(analyser.fftSize);
      const updateLoop = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        analyserRef.current.getByteTimeDomainData(timeDataArray);

        let sumSquares = 0;
        for (let i = 0; i < timeDataArray.length; i++) {
          const normalized = (timeDataArray[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / timeDataArray.length);

        if (rms > SPEECH_RMS_THRESHOLD) {
          hasSpeechRef.current = true;
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        } else if (hasSpeechRef.current && !silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(stopRecording, SILENCE_STOP_MS);
        }

        const bars = [];
        const step = Math.floor(bufferLength / 12);
        for (let i = 0; i < 12; i++) {
          bars.push(Math.max(rms * 7, dataArray[i * step] / 255));
        }
        setVisualizerData(bars);
        animationFrameRef.current = requestAnimationFrame(updateLoop);
      };
      updateLoop();

      minRecordingTimeoutRef.current = setTimeout(() => {
        canStopRecordingRef.current = true;
        minRecordingTimeoutRef.current = null;
      }, MIN_RECORDING_MS);
      noSpeechTimeoutRef.current = setTimeout(() => {
        if (!hasSpeechRef.current) {
          setVoiceHint('I am not detecting speech yet. Try speaking a little closer to the mic.');
        }
      }, NO_SPEECH_TIMEOUT_MS);
      maxRecordingTimeoutRef.current = setTimeout(stopRecording, MAX_RECORDING_MS);

    } catch (err) {
      console.error("Mic error:", err);
      setErrorMessage(getMicErrorMessage(err));
      setAssistantState('idle');
      cleanupVoice(false);
    }
  };

  const handleTranscription = async (blob: Blob, attempt = 1) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setAssistantState('processing');
    setVoiceHint('Processing...');
    setErrorMessage('');
    try {
      const formData = new FormData();
      formData.append('audio', blob, `voice.${audioExtensionFromMime(blob.type)}`);
      formData.append('lang', 'auto');

      const token = localStorage.getItem('token');
      const res = await fetch(`${AI_CORE_URL}/transcribe`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData,
        signal
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || 'Transcription failed');
      if (data.transcript) {
        handleSend(data.transcript);
      } else {
        throw new Error('No speech detected');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      if (attempt < 2) {
        setVoiceHint('Retrying transcription...');
        await handleTranscription(blob, attempt + 1);
        return;
      }
      setErrorMessage(err instanceof Error ? err.message : 'Could not transcribe audio.');
      setVoiceHint('Please try again.');
      setAssistantState('idle');
    } finally {
      if (abortControllerRef.current?.signal === signal) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleSend = async (text?: string) => {
    const query = text || inputText;
    if (!query.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: query, timestamp: new Date() }]);
    setAssistantState('processing');
    setVoiceHint('Processing...');
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${AI_CORE_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message: query, 
          lang: selectedLang,
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        }),
        signal
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date() }]);

      if (!isMuted) {
        setAssistantState('speaking');
        setVoiceHint('Speaking...');
        const speakRes = await fetch(`${AI_CORE_URL}/speak`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ text: data.reply, lang: data.detectedLang || selectedLang }),
          signal
        });
        
        if (speakRes.ok) {
          const audioBlob = await speakRes.blob();
          if (activeAudioUrlRef.current) URL.revokeObjectURL(activeAudioUrlRef.current);
          activeAudioUrlRef.current = URL.createObjectURL(audioBlob);
          const audio = new Audio(activeAudioUrlRef.current);
          activeAudioRef.current = audio;
          audio.onended = () => {
            setAssistantState('idle');
            setVoiceHint('Tap the mic and speak in Hindi, English, or both.');
          };
          audio.onerror = () => {
            setErrorMessage('Audio playback failed. You can still read the response.');
            setAssistantState('idle');
          };
          await audio.play();
        } else {
          // Final Fallback: Browser Web Speech API
          console.warn("Backend TTS failed, falling back to browser speech API");
          setAssistantState('speaking');
          const utterance = new SpeechSynthesisUtterance(data.reply);
          const actualLang = data.detectedLang || selectedLang;
          utterance.lang = actualLang === 'hi' ? 'hi-IN' : 'en-US';

          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel(); // cancel any active speech
            const voices = window.speechSynthesis.getVoices();
            const targetLangStr = actualLang === 'hi' ? 'hi' : 'en';
            
            // Filter voices by target language
            const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(targetLangStr));
            
            // Prioritize female / natural neural voices (known female voice names & key qualities)
            const femaleKeywords = ['swara', 'jenny', 'zira', 'heera', 'kalpana', 'samantha', 'google', 'female', 'natural', 'online', 'premium'];
            
            langVoices.sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
              let scoreA = 0;
              let scoreB = 0;
              
              for (const kw of femaleKeywords) {
                if (nameA.includes(kw)) scoreA++;
                if (nameB.includes(kw)) scoreB++;
              }
              
              return scoreB - scoreA;
            });

            if (langVoices.length > 0) {
              utterance.voice = langVoices[0];
            }
          }

          utterance.onend = () => {
            setAssistantState('idle');
            setVoiceHint('Tap the mic and speak in Hindi, English, or both.');
          };
          utterance.onerror = () => {
            setAssistantState('idle');
          };
          window.speechSynthesis.speak(utterance);
        }
      } else {
        setAssistantState('idle');
        setVoiceHint('Tap the mic and speak in Hindi, English, or both.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request aborted by user');
        return;
      }
      setErrorMessage(err instanceof Error ? err.message : 'Chef failed to respond.');
      setAssistantState('idle');
    } finally {
      if (abortControllerRef.current?.signal === signal) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${AI_CORE_URL}/upload-sop`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: `✅ ${data.message}`, timestamp: new Date() }]);
      }
    } catch {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-9999 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all duration-500 ${
              isMinimized ? 'h-20 w-80' : 'h-[650px] w-[450px]'
            }`}
          >
            {/* Header */}
            <div className="p-6 bg-linear-to-r from-gold/20 to-transparent border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-black border border-gold/30 flex items-center justify-center text-gold relative">
                  <Bot size={20} />
                  {assistantState !== 'idle' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="text-white text-sm font-black tracking-tight uppercase">CHEF PRO</h3>
                  <p className="text-[9px] text-white/40 font-bold tracking-widest uppercase">
                    {assistantState === 'idle' ? 'Idle' : assistantState === 'listening' ? 'Listening...' : assistantState === 'processing' ? 'Processing...' : 'Speaking...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-white/40 hover:text-gold transition-colors">
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-white/40 hover:text-white transition-colors">
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-3xl shadow-xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-gold text-black font-bold rounded-tr-none' 
                        : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Controls Area */}
                <div className="p-6 bg-black border-t border-white/5">
                  {(assistantState === 'listening' || assistantState === 'speaking') && (
                    <div className="flex items-end justify-center gap-1.5 h-8 mb-4">
                      {visualizerData.map((val, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: `${Math.max(20, val * 100)}%` }}
                          className="w-2 bg-gold rounded-full"
                        />
                      ))}
                    </div>
                  )}
                  <div className="mb-3 min-h-4 text-center text-[9px] font-bold uppercase tracking-[0.14em]">
                    <span className={errorMessage ? 'text-red-400' : 'text-white/30'}>{errorMessage || voiceHint}</span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-2 rounded-[1.8rem] border border-white/10 focus-within:border-gold/30 transition-all">
                    <button
                      onClick={() => {
                        if (assistantState === 'speaking') stopSpeaking();
                        else if (assistantState === 'processing') stopRequest();
                        else if (assistantState === 'listening') stopRecording();
                        else startRecording();
                      }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        assistantState === 'listening' ? 'bg-red-500 text-white animate-pulse' : 
                        (assistantState === 'processing' || assistantState === 'speaking') ? 'bg-red-500 hover:bg-red-600 text-white' : 
                        'bg-gold/10 text-gold hover:bg-gold hover:text-black'
                      }`}
                    >
                      {assistantState === 'listening' ? <MicOff size={20} /> : 
                       (assistantState === 'processing' || assistantState === 'speaking') ? <Square size={20} className="fill-current text-white" /> : 
                       <Mic size={20} />}
                    </button>
                    
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask Chef or upload docs..."
                      className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-white/20"
                    />

                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.docx,.txt" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 text-white/20 hover:text-gold transition-colors"
                    >
                      {isUploading ? <Loader2 size={20} className="animate-spin text-gold" /> : <FileUp size={20} />}
                    </button>

                    <button
                      onClick={() => handleSend()}
                      disabled={!inputText.trim() || assistantState === 'processing'}
                      className="w-12 h-12 rounded-2xl bg-gold text-black flex items-center justify-center disabled:opacity-20"
                    >
                      <Send size={20} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between px-2">
                    <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
                      <button onClick={() => setSelectedLang('en')} className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all ${selectedLang === 'en' ? 'bg-gold text-black' : 'text-white/20'}`}>EN</button>
                      <button onClick={() => setSelectedLang('hi')} className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all ${selectedLang === 'hi' ? 'bg-gold text-black' : 'text-white/20'}`}>HI</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={12} className="text-gold" />
                      <span className="text-[8px] text-white/20 font-black tracking-widest uppercase">Production RAG Engine</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.8rem] shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center justify-center transition-all ${
          isOpen ? 'bg-white text-black' : 'bg-gold text-black'
        }`}
      >
        <Bot size={28} />
      </motion.button>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
