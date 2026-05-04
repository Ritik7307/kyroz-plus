'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

interface Session {
  _id: string;
  deviceInfo: string;
  ipAddress: string;
  lastActive: string;
  createdAt: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>('Basic');

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        setUserPlan(JSON.parse(userStr).plan);
      }

      const res = await fetch(`${API_URL}/api/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleLogoutDevice = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        fetchSessions(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to logout device', error);
    }
  };

  const getLimit = () => {
    if (userPlan === 'Elite') return 3;
    if (userPlan === 'Pro') return 2;
    return 1;
  };

  return (
    <div className="flex flex-col h-full max-w-4xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white">Settings & Security</h2>
        <p className="text-gray-400 mt-2">Manage your account security and active devices.</p>
      </header>

      <div className="bg-[#111111] border border-[#333333] rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex justify-between items-start mb-6 border-b border-[#222222] pb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Active Sessions</h3>
            <p className="text-sm text-gray-400">
              You are currently logged in on {sessions.length} device(s). 
              Your <span className="text-[#d4af37] font-bold">{userPlan}</span> plan allows up to {getLimit()} device(s).
            </p>
          </div>
          <div className="bg-[#222222] px-4 py-2 rounded-lg border border-[#333333]">
            <span className="text-gray-400 text-sm">Devices: </span>
            <span className={`font-bold ${sessions.length >= getLimit() ? 'text-red-400' : 'text-green-400'}`}>
              {sessions.length} / {getLimit()}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8 border border-dashed border-[#333333] rounded-xl">
            No active sessions found.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, idx) => (
              <div key={session._id} className="flex items-center justify-between bg-[#0a0a0a] border border-[#222222] p-4 rounded-xl hover:border-[#333333] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#222222] rounded-lg flex items-center justify-center text-2xl border border-[#333333]">
                    💻
                  </div>
                  <div>
                    <h4 className="text-white font-medium flex items-center gap-2">
                      {session.deviceInfo}
                      {idx === 0 && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Current</span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      IP: {session.ipAddress} • Last active: {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {idx !== 0 && (
                  <button 
                    onClick={() => handleLogoutDevice(session._id)}
                    className="px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    Log out device
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
