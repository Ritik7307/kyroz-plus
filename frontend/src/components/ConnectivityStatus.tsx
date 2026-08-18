"use client";

import React, { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

export default function ConnectivityStatus() {
  const [status, setStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health/connectivity`);
        const data = await res.json();
        
        if (data.type === 'local') {
          setIsLocal(true);
        }

        if (data.status === 'online') {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (err) {
        setStatus('offline');
      }
    };

    // Check immediately, then every 10 seconds
    checkConnectivity();
    const interval = setInterval(checkConnectivity, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isLocal && status === 'online') return null; // Don't show anything for pure cloud users unless offline

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-3 py-1.5 rounded-full shadow-lg text-sm font-medium transition-colors ${
      status === 'online' ? 'bg-green-100 text-green-800' :
      status === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }`}>
      <span className="relative flex h-3 w-3">
        {status === 'online' ? (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        ) : status === 'syncing' ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        )}
      </span>
      <span>
        {status === 'online' ? '● Online (Local Server)' : 
         status === 'syncing' ? '↻ Syncing' : 
         '● Offline (Local Mode)'}
      </span>
    </div>
  );
}
