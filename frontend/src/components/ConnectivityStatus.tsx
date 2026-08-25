"use client";

import React, { useEffect, useState } from 'react';
import { syncService } from '@/lib/syncService';

export default function ConnectivityStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const updateQueue = async () => {
      const count = await syncService.getQueueCount();
      setQueueCount(count);
    };
    
    // Sync events from syncService
    const handleSyncStart = () => {
      setSyncing(true);
      updateQueue();
    };
    const handleSyncComplete = () => {
      setSyncing(false);
      updateQueue();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offline-sync-queued', updateQueue);
    window.addEventListener('offline-sync-completed', handleSyncComplete);

    // Polling queue count every 10 seconds just in case
    const interval = setInterval(updateQueue, 10000);
    updateQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-sync-queued', updateQueue);
      window.removeEventListener('offline-sync-completed', handleSyncComplete);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && !syncing) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg text-sm font-black uppercase tracking-widest transition-colors ${
      isOnline && syncing ? 'bg-blue-100 text-blue-800 border border-blue-500/30' :
      !isOnline ? 'bg-red-100 text-red-800 border border-red-500/30' :
      'bg-yellow-100 text-yellow-800 border border-yellow-500/30'
    }`}>
      <span className="relative flex h-3 w-3">
        {syncing ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </>
        ) : !isOnline ? (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        ) : (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        )}
      </span>
      <span>
        {syncing ? `Syncing... (${queueCount} left)` : 
         !isOnline ? `Offline Mode - ${queueCount} unsynced` : 
         `${queueCount} items pending`}
      </span>
    </div>
  );
}
