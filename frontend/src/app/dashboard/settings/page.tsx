'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { useTheme, Theme, PosTheme } from '@/context/ThemeContext';

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
  
  const { globalTheme, setGlobalTheme, posTheme, setPosTheme } = useTheme();
  
  // Printer settings state
  const [sopPrinterSize, setSopPrinterSize] = useState<string>('A4');
  const [billPrinterSize, setBillPrinterSize] = useState<string>('58mm');
  
  // Hardware Printers Routing state
  const [hardwarePrinters, setHardwarePrinters] = useState<{Name: string, PrinterStatus: number}[]>([]);
  const [billPrinterTarget, setBillPrinterTarget] = useState<string>('');
  const [kotPrinterTarget, setKotPrinterTarget] = useState<string>('');
  const [reportPrinterTarget, setReportPrinterTarget] = useState<string>('');
  
  // Local Hub settings state
  const [localHubUrl, setLocalHubUrl] = useState<string>('');
  const [isSavingHub, setIsSavingHub] = useState(false);

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

  const fetchPrinters = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/printers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHardwarePrinters(data.printers || []);
      }
    } catch (error) {
      console.error('Failed to fetch hardware printers', error);
    }
  };

  useEffect(() => {
    fetchSessions();
    
    // Load printer settings from local storage
    if (typeof window !== 'undefined') {
      const storedSop = localStorage.getItem('printerSize_sop');
      const storedBill = localStorage.getItem('printerSize_bill');
      const storedHub = localStorage.getItem('localHubUrl');
      const storedBillTarget = localStorage.getItem('printerTarget_bill');
      const storedKotTarget = localStorage.getItem('printerTarget_kot');
      const storedReportTarget = localStorage.getItem('printerTarget_report');
      
      if (storedSop) setSopPrinterSize(storedSop);
      if (storedBill) setBillPrinterSize(storedBill);
      if (storedHub) setLocalHubUrl(storedHub);
      if (storedBillTarget) setBillPrinterTarget(storedBillTarget);
      if (storedKotTarget) setKotPrinterTarget(storedKotTarget);
      if (storedReportTarget) setReportPrinterTarget(storedReportTarget);
      
      fetchPrinters();
    }
  }, []);

  const handleSopPrinterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSopPrinterSize(val);
    localStorage.setItem('printerSize_sop', val);
  };

  const handleBillPrinterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBillPrinterSize(val);
    localStorage.setItem('printerSize_bill', val);
  };

  const handleBillPrinterTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBillPrinterTarget(val);
    localStorage.setItem('printerTarget_bill', val);
  };
  const handleKotPrinterTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setKotPrinterTarget(val);
    localStorage.setItem('printerTarget_kot', val);
  };
  const handleReportPrinterTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setReportPrinterTarget(val);
    localStorage.setItem('printerTarget_report', val);
  };

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
    if (userPlan === 'Scale') return 3;
    if (userPlan === 'Growth') return 2;
    return 1;
  };

  const handleHubUrlSave = () => {
    setIsSavingHub(true);
    if (!localHubUrl) {
      localStorage.removeItem('localHubUrl');
    } else {
      localStorage.setItem('localHubUrl', localHubUrl);
    }
    setTimeout(() => {
      setIsSavingHub(false);
      window.location.reload(); // Reload to apply new API_URL
    }, 500);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl text-foreground">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">Settings & Security</h2>
        <p className="text-foreground/60 mt-2">Manage your account security, active devices, and local hub configuration.</p>
      </header>
      
      {/* Theme Configuration Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Theme Preferences</h3>
            <p className="text-sm text-foreground/60">
              Customize the appearance of your dashboard and POS terminal.
            </p>
          </div>
          <div className="bg-background px-4 py-2 rounded-lg border border-border flex items-center justify-center text-2xl">
            🎨
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-background border border-border p-5 rounded-xl hover:border-[var(--gold)] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-foreground font-medium">Global Theme</h4>
                <p className="text-xs text-foreground/50 mt-1">Default theme for the entire application</p>
              </div>
              <select 
                value={globalTheme}
                onChange={(e) => setGlobalTheme(e.target.value as Theme)}
                className="bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
          
          <div className="bg-background border border-border p-5 rounded-xl hover:border-[var(--gold)] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-foreground font-medium">POS Theme</h4>
                <p className="text-xs text-foreground/50 mt-1">Specific theme for the POS Terminal page</p>
              </div>
              <select 
                value={posTheme}
                onChange={(e) => setPosTheme(e.target.value as PosTheme)}
                className="bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="global">Use Global Default</option>
                <option value="dark">Always Dark</option>
                <option value="light">Always Light</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Local Hub (Offline POS)</h3>
            <p className="text-sm text-foreground/60">
              Configure this device to point to your restaurant's Local Hub Server. 
              Leave empty to use the Cloud version.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={localHubUrl}
            onChange={(e) => setLocalHubUrl(e.target.value)}
            placeholder="e.g. http://192.168.1.100:5000"
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground outline-none focus:border-[var(--gold)]"
          />
          <button 
            onClick={handleHubUrlSave}
            disabled={isSavingHub}
            className="bg-[#d4af37] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b5952f] transition disabled:opacity-50"
          >
            {isSavingHub ? 'Saving...' : 'Save & Reload'}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Active Sessions</h3>
            <p className="text-sm text-foreground/60">
              You are currently logged in on {sessions.length} device(s). 
              Your <span className="text-[var(--gold)] font-bold">{userPlan}</span> plan allows up to {getLimit()} device(s).
            </p>
          </div>
          <div className="bg-background px-4 py-2 rounded-lg border border-border">
            <span className="text-foreground/60 text-sm">Devices: </span>
            <span className={`font-bold ${sessions.length >= getLimit() ? 'text-red-400' : 'text-green-400'}`}>
              {sessions.length} / {getLimit()}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-foreground/50 py-8">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-foreground/50 py-8 border border-dashed border-border rounded-xl">
            No active sessions found.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, idx) => (
              <div key={session._id} className="flex items-center justify-between bg-background border border-border p-4 rounded-xl hover:border-[var(--gold)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center text-2xl border border-border">
                    💻
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium flex items-center gap-2">
                      {session.deviceInfo}
                      {idx === 0 && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Current</span>
                      )}
                    </h4>
                    <p className="text-xs text-foreground/50 mt-1">
                      IP: {session.ipAddress} • Last active: {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {idx !== 0 && (
                  <button 
                    onClick={() => handleLogoutDevice(session._id)}
                    className="px-4 py-2 text-sm text-red-400 hover:text-foreground hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    Log out device
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printer Configuration Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Hardware Printer Routing (Silent Print)</h3>
            <p className="text-sm text-foreground/60">
              Assign locally connected printers to specific tasks. The POS will automatically print to these silently without a dialog.
            </p>
          </div>
          <div className="bg-background px-4 py-2 rounded-lg border border-border flex items-center justify-center text-2xl">
            🔌
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-background border border-border p-5 rounded-xl hover:border-[var(--gold)] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-foreground font-medium">Customer Bill Printer</h4>
                <p className="text-xs text-foreground/50 mt-1">Silently prints final customer invoices</p>
              </div>
              <select 
                value={billPrinterTarget}
                onChange={handleBillPrinterTargetChange}
                className="bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--gold)] max-w-[250px]"
              >
                <option value="">Browser Default Dialog</option>
                {hardwarePrinters.map(p => (
                  <option key={p.Name} value={p.Name}>{p.Name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="bg-background border border-border p-5 rounded-xl hover:border-[var(--gold)] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-foreground font-medium">Kitchen (KOT) Printer</h4>
                <p className="text-xs text-foreground/50 mt-1">Silently prints kitchen order tickets</p>
              </div>
              <select 
                value={kotPrinterTarget}
                onChange={handleKotPrinterTargetChange}
                className="bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--gold)] max-w-[250px]"
              >
                <option value="">Browser Default Dialog</option>
                {hardwarePrinters.map(p => (
                  <option key={p.Name} value={p.Name}>{p.Name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-background border border-border p-5 rounded-xl hover:border-[var(--gold)] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-foreground font-medium">Reports / SOP Printer</h4>
                <p className="text-xs text-foreground/50 mt-1">Silently prints A4 reports and library SOPs</p>
              </div>
              <select 
                value={reportPrinterTarget}
                onChange={handleReportPrinterTargetChange}
                className="bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--gold)] max-w-[250px]"
              >
                <option value="">Browser Default Dialog</option>
                {hardwarePrinters.map(p => (
                  <option key={p.Name} value={p.Name}>{p.Name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Printer Configuration</h3>
            <p className="text-sm text-foreground/60">
              Configure printer paper sizes for different types of print jobs on this device.
            </p>
          </div>
          <div className="bg-background px-4 py-2 rounded-lg border border-border flex items-center justify-center text-2xl">
            🖨️
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-background border border-border p-5 rounded-xl hover:border-[var(--gold)] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-foreground font-medium">SOP Library Printer</h4>
                <p className="text-xs text-foreground/50 mt-1">Default printer size for SOP documents</p>
              </div>
              <select 
                value={sopPrinterSize}
                onChange={handleSopPrinterChange}
                className="bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="A4">A4</option>
                <option value="A5">A5</option>
                <option value="80mm">80mm</option>
              </select>
            </div>
          </div>
          
          <div className="bg-background border border-border p-5 rounded-xl hover:border-[var(--gold)] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-foreground font-medium">Bills & KOT Printer</h4>
                <p className="text-xs text-foreground/50 mt-1">Printer size for receipts and kitchen tickets</p>
              </div>
              <select 
                value={billPrinterSize}
                onChange={handleBillPrinterChange}
                className="bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="58mm">58mm</option>
                <option value="80mm">80mm</option>
                <option value="A4">A4</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
