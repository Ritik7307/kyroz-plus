'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  FileUp,
  Square
} from 'lucide-react';

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

type Message = {
  role: 'user' | 'kosa';
  content: string;
  suggestions?: string[];
  timestamp?: Date;
};

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

export default function AiDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'kosa', 
      content: 'Namaste! I am KOSA (Production Core). I am now powered by a high-performance RAG pipeline. How can I help you in the kitchen today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>('en');
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(12).fill(0.1));
  const [errorMessage, setErrorMessage] = useState('');
  const [voiceHint, setVoiceHint] = useState('Tap the mic and speak in Hindi, English, or both.');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Voice Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
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

  const cleanupVoice = () => {
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
    setVisualizerData(new Array(12).fill(0.1));
    mediaRecorderRef.current = null;
    analyserRef.current = null;
    hasSpeechRef.current = false;
    canStopRecordingRef.current = false;
    isStoppingRef.current = false;
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

      cleanupVoice();
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
        cleanupVoice();
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
        setAssistantState('idle');
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
        for (let i = 0; i < 12; i++) bars.push(Math.max(rms * 7, dataArray[i * step] / 255));
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
      setErrorMessage(getMicErrorMessage(err));
      setAssistantState('idle');
      cleanupVoice();
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
      formData.append('lang', selectedLang);

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
      if (data.transcript) handleSend(data.transcript);
      else throw new Error('No speech detected');
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

  const handleSend = async (textOverride?: string) => {
    const userQuery = textOverride || input.trim();
    if (!userQuery) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery, timestamp: new Date() }]);
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
          message: userQuery, 
          lang: selectedLang,
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        }),
        signal 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'kosa', content: data.reply, suggestions: data.suggestions, timestamp: new Date() }]);
      
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
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted by user');
        return;
      }
      const message = error instanceof Error ? error.message : 'KOSA failed to respond.';
      setMessages(prev => [...prev, { role: 'kosa', content: `Error: ${message}` }]);
      setErrorMessage(message);
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
    setAssistantState('processing');
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
      setMessages(prev => [...prev, { role: 'kosa', content: `✅ ${data.message || data.error}`, timestamp: new Date() }]);
    } catch {
      alert("Upload failed");
    } finally {
      setAssistantState('idle');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-2xl">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-gold shadow-2xl relative">
            <Bot size={28} />
            {assistantState !== 'idle' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-ping"></span>
            )}
          </div>
          <div>
            <h2 className="text-white font-black text-lg tracking-tight uppercase">KOSA CORE</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              {assistantState === 'idle' ? 'Idle' : assistantState === 'listening' ? 'Listening...' : assistantState === 'processing' ? 'Processing...' : 'Speaking...'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-black rounded-xl p-1 border border-white/5 shadow-inner">
            <button onClick={() => setSelectedLang('en')} className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${selectedLang === 'en' ? 'bg-gold text-black shadow-lg' : 'text-white/30'}`}>ENGLISH</button>
            <button onClick={() => setSelectedLang('hi')} className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${selectedLang === 'hi' ? 'bg-gold text-black shadow-lg' : 'text-white/30'}`}>हिन्दी</button>
          </div>
          <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-xl border ${isMuted ? 'text-white/20' : 'text-gold'}`}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-[1.8rem] p-5 shadow-2xl ${msg.role === 'user' ? 'bg-gold text-black font-bold' : 'bg-white/5 text-gray-200 border border-white/5'}`}>
                <div className="text-[13px] whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
            {msg.role === 'kosa' && msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && (
              <div className="flex flex-wrap gap-2 mt-3 ml-2 max-w-[80%]">
                {msg.suggestions.map((suggestion, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSend(suggestion)}
                    disabled={assistantState === 'processing' || assistantState === 'speaking'}
                    className="px-4 py-2 bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/30 text-white/80 hover:text-gold text-xs rounded-full transition-all shadow-md font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-white/5 bg-[#080808]">
        {(assistantState === 'listening' || assistantState === 'speaking') && (
          <div className="flex items-end justify-center gap-1.5 h-12 mb-4">
            {visualizerData.map((val, i) => (
              <motion.div key={i} animate={{ height: `${Math.max(10, val * 100)}%` }} className="w-2 bg-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
            ))}
          </div>
        )}
        <div className="mb-4 min-h-5 text-center text-[11px] font-bold uppercase tracking-[0.16em]">
          <span className={errorMessage ? 'text-red-400' : 'text-white/30'}>{errorMessage || voiceHint}</span>
        </div>

        <div className="flex items-center gap-4 bg-[#111111] rounded-4xl p-3 border border-white/5 shadow-2xl">
          <button
            onClick={() => {
              if (assistantState === 'speaking') stopSpeaking();
              else if (assistantState === 'processing') stopRequest();
              else if (assistantState === 'listening') stopRecording();
              else startRecording();
            }}
            className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${
              assistantState === 'listening' ? 'bg-red-500 animate-pulse text-white' : 
              (assistantState === 'processing' || assistantState === 'speaking') ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/5'
            }`}
          >
            {assistantState === 'listening' ? <MicOff size={24} /> : 
             (assistantState === 'processing' || assistantState === 'speaking') ? <Square size={24} className="fill-current text-white" /> : 
             <Mic size={24} />}
          </button>

          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type here..." className="flex-1 bg-transparent border-none outline-none text-white text-sm" />

          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.docx,.txt" />
          <button onClick={() => fileInputRef.current?.click()} className="p-3 text-white/20 hover:text-gold"><FileUp size={20} /></button>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || assistantState === 'processing' || assistantState === 'speaking'}
            className="px-8 py-4 bg-gold text-black font-black text-xs uppercase rounded-2xl disabled:opacity-30"
          >
            Send
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}
