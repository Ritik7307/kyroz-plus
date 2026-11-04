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
    if (val) localStorage.setItem('printerTarget_bill', val);
    else localStorage.removeItem('printerTarget_bill');
  };

  const handleKotPrinterTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setKotPrinterTarget(val);
    if (val) localStorage.setItem('printerTarget_kot', val);
    else localStorage.removeItem('printerTarget_kot');
  };

  const handleReportPrinterTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setReportPrinterTarget(val);
    if (val) localStorage.setItem('printerTarget_report', val);
    else localStorage.removeItem('printerTarget_report');
  };

  const handleLogoutDevice = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s._id !== sessionId));
      }
    } catch (error) {
      console.error('Failed to logout device', error);
    }
  };

  const getLimit = () => {
    switch (userPlan) {
      case 'Scale': return 5;
      case 'Elite': return 10;
      case 'Custom': return 25;
      default: return 2;
    }
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
    <div className="flex flex-col h-full w-full max-w-4xl text-foreground px-1 sm:px-0">
      <header className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Settings & Security</h2>
        <p className="text-foreground/60 text-xs sm:text-sm mt-1 sm:mt-2">Manage your account security, active devices, and local hub configuration.</p>
      </header>
      
      {/* Theme Configuration Section */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-5 sm:mb-6 border-b border-border pb-5 sm:pb-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">Theme Preferences</h3>
            <p className="text-xs sm:text-sm text-foreground/60">
              Customize the appearance of your dashboard and POS terminal.
            </p>
          </div>
          <div className="bg-background px-3 sm:px-4 py-2 rounded-lg border border-border flex items-center justify-center text-xl sm:text-2xl shrink-0">
            🎨
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl hover:border-[var(--gold)] transition-colors min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground font-medium text-sm sm:text-base">Global Theme</h4>
                <p className="text-[11px] sm:text-xs text-foreground/50 mt-0.5 sm:mt-1">Default theme for the entire application</p>
              </div>
              <select 
                value={globalTheme}
                onChange={(e) => setGlobalTheme(e.target.value as Theme)}
                className="w-full sm:w-auto bg-card border border-border text-foreground rounded-lg px-3.5 sm:px-4 py-2 text-sm focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
          
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl hover:border-[var(--gold)] transition-colors min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground font-medium text-sm sm:text-base">POS Theme</h4>
                <p className="text-[11px] sm:text-xs text-foreground/50 mt-0.5 sm:mt-1">Specific theme for the POS Terminal page</p>
              </div>
              <select 
                value={posTheme}
                onChange={(e) => setPosTheme(e.target.value as PosTheme)}
                className="w-full sm:w-auto bg-card border border-border text-foreground rounded-lg px-3.5 sm:px-4 py-2 text-sm focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="global">Use Global Default</option>
                <option value="dark">Always Dark</option>
                <option value="light">Always Light</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Local Hub (Offline POS) */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-5 sm:mb-6 border-b border-border pb-5 sm:pb-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">Local Hub (Offline POS)</h3>
            <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed">
              Configure this device to point to your restaurant&apos;s Local Hub Server. 
              Leave empty to use the Cloud version.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full">
          <input
            type="text"
            value={localHubUrl}
            onChange={(e) => setLocalHubUrl(e.target.value)}
            placeholder="e.g. http://192.168.1.100:5000"
            className="w-full flex-1 min-w-0 bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-[var(--gold)] transition-colors"
          />
          <button 
            onClick={handleHubUrlSave}
            disabled={isSavingHub}
            className="w-full sm:w-auto whitespace-nowrap bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#b5952f] active:scale-[0.98] transition disabled:opacity-50 shrink-0"
          >
            {isSavingHub ? 'Saving...' : 'Save & Reload'}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 sm:mb-6 border-b border-border pb-5 sm:pb-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">Active Sessions</h3>
            <p className="text-xs sm:text-sm text-foreground/60">
              You are currently logged in on {sessions.length} device(s). 
              Your <span className="text-[var(--gold)] font-bold">{userPlan}</span> plan allows up to {getLimit()} device(s).
            </p>
          </div>
          <div className="bg-background px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-border shrink-0">
            <span className="text-foreground/60 text-xs sm:text-sm">Devices: </span>
            <span className={`font-bold text-xs sm:text-sm ${sessions.length >= getLimit() ? 'text-red-400' : 'text-green-400'}`}>
              {sessions.length} / {getLimit()}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-foreground/50 py-8 text-sm">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-foreground/50 py-8 border border-dashed border-border rounded-xl text-sm">
            No active sessions found.
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sessions.map((session, idx) => (
              <div key={session._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-background border border-border p-3.5 sm:p-4 rounded-xl hover:border-[var(--gold)] transition-colors min-w-0">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-card rounded-lg flex items-center justify-center text-xl sm:text-2xl border border-border shrink-0">
                    💻
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-foreground font-medium text-sm sm:text-base flex items-center gap-2 flex-wrap">
                      <span className="truncate">{session.deviceInfo}</span>
                      {idx === 0 && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shrink-0">Current</span>
                      )}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-foreground/50 mt-1 break-all">
                      IP: {session.ipAddress} • Last active: {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {idx !== 0 && (
                  <button 
                    onClick={() => handleLogoutDevice(session._id)}
                    className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm text-red-400 hover:text-foreground hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20 sm:border-transparent self-end sm:self-center"
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
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-5 sm:mb-6 border-b border-border pb-5 sm:pb-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">Hardware Printer Routing (Silent Print)</h3>
            <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed">
              Assign locally connected printers to specific tasks. The POS will automatically print to these silently without a dialog.
            </p>
          </div>
          <div className="bg-background px-3 sm:px-4 py-2 rounded-lg border border-border flex items-center justify-center text-xl sm:text-2xl shrink-0">
            🔌
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl hover:border-[var(--gold)] transition-colors min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground font-medium text-sm sm:text-base">Customer Bill Printer</h4>
                <p className="text-[11px] sm:text-xs text-foreground/50 mt-0.5 sm:mt-1">Silently prints final customer invoices</p>
              </div>
              <select 
                value={billPrinterTarget}
                onChange={handleBillPrinterTargetChange}
                className="w-full sm:w-auto bg-card border border-border text-foreground rounded-lg px-3.5 sm:px-4 py-2 text-sm focus:outline-none focus:border-[var(--gold)] max-w-full sm:max-w-[250px]"
              >
                <option value="">Browser Default Dialog</option>
                {hardwarePrinters.map(p => (
                  <option key={p.Name} value={p.Name}>{p.Name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl hover:border-[var(--gold)] transition-colors min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground font-medium text-sm sm:text-base">Kitchen (KOT) Printer</h4>
                <p className="text-[11px] sm:text-xs text-foreground/50 mt-0.5 sm:mt-1">Silently prints kitchen order tickets</p>
              </div>
              <select 
                value={kotPrinterTarget}
                onChange={handleKotPrinterTargetChange}
                className="w-full sm:w-auto bg-card border border-border text-foreground rounded-lg px-3.5 sm:px-4 py-2 text-sm focus:outline-none focus:border-[var(--gold)] max-w-full sm:max-w-[250px]"
              >
                <option value="">Browser Default Dialog</option>
                {hardwarePrinters.map(p => (
                  <option key={p.Name} value={p.Name}>{p.Name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl hover:border-[var(--gold)] transition-colors min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground font-medium text-sm sm:text-base">Reports / SOP Printer</h4>
                <p className="text-[11px] sm:text-xs text-foreground/50 mt-0.5 sm:mt-1">Silently prints A4 reports and library SOPs</p>
              </div>
              <select 
                value={reportPrinterTarget}
                onChange={handleReportPrinterTargetChange}
                className="w-full sm:w-auto bg-card border border-border text-foreground rounded-lg px-3.5 sm:px-4 py-2 text-sm focus:outline-none focus:border-[var(--gold)] max-w-full sm:max-w-[250px]"
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

      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-5 sm:mb-6 border-b border-border pb-5 sm:pb-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">Printer Configuration</h3>
            <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed">
              Configure printer paper sizes for different types of print jobs on this device.
            </p>
          </div>
          <div className="bg-background px-3 sm:px-4 py-2 rounded-lg border border-border flex items-center justify-center text-xl sm:text-2xl shrink-0">
            🖨️
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl hover:border-[var(--gold)] transition-colors min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground font-medium text-sm sm:text-base">SOP Library Printer</h4>
                <p className="text-[11px] sm:text-xs text-foreground/50 mt-0.5 sm:mt-1">Default printer size for SOP documents</p>
              </div>
              <select 
                value={sopPrinterSize}
                onChange={handleSopPrinterChange}
                className="w-full sm:w-auto bg-card border border-border text-foreground rounded-lg px-3.5 sm:px-4 py-2 text-sm focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="A4">A4</option>
                <option value="A5">A5</option>
                <option value="80mm">80mm</option>
              </select>
            </div>
          </div>
          
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl hover:border-[var(--gold)] transition-colors min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground font-medium text-sm sm:text-base">Bills & KOT Printer</h4>
                <p className="text-[11px] sm:text-xs text-foreground/50 mt-0.5 sm:mt-1">Printer size for receipts and kitchen tickets</p>
              </div>
              <select 
                value={billPrinterSize}
                onChange={handleBillPrinterChange}
                className="w-full sm:w-auto bg-card border border-border text-foreground rounded-lg px-3.5 sm:px-4 py-2 text-sm focus:outline-none focus:border-[var(--gold)]"
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
