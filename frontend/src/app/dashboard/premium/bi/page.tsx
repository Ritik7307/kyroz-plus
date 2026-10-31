'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  AlertCircle, TrendingUp, DollarSign, ShoppingBag, Percent, 
  Calendar, Download, Sparkles, AlertTriangle, Layers, ChefHat, 
  Store, Calculator, ArrowUpRight, ArrowDownRight, RefreshCw, 
  CheckCircle2, Bot, Sliders, ChevronRight, Zap
} from 'lucide-react';
import { API_URL } from '@/lib/api';

const GOLD_PALETTE = ['#d4af37', '#f3e5ab', '#e6c875', '#8a7322', '#c5a028', '#ffd700'];
const CATEGORY_COLORS = ['#d4af37', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function BIDashboard() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'matrix' | 'outlets'>('overview');
  
  // Date filter
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Data states
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [outlets, setOutlets] = useState<any[]>([]);
  
  // Simulation tool states
  const [selectedSimDish, setSelectedSimDish] = useState<string>('');
  const [proposedPrice, setProposedPrice] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  // AI Chat / Prompt state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Global loading
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getDateQuery = () => {
    let start: Date | null = null;
    let end: Date = new Date();

    if (customStart && customEnd) {
      return `startDate=${customStart}&endDate=${customEnd}`;
    }

    if (dateRange === '7') {
      start = new Date();
      start.setDate(end.getDate() - 7);
    } else if (dateRange === '30') {
      start = new Date();
      start.setDate(end.getDate() - 30);
    } else if (dateRange === '90') {
      start = new Date();
      start.setDate(end.getDate() - 90);
    }

    if (start) {
      return `startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
    }
    return '';
  };

  const fetchAllData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const dateQuery = getDateQuery();

      const [sumRes, trendRes, anomalyRes, predRes, catRes, menuRes, outletRes] = await Promise.all([
        fetch(`${API_URL}/api/bi/business-summary?${dateQuery}`, { headers }),
        fetch(`${API_URL}/api/bi/sales-trend?${dateQuery}`, { headers }),
        fetch(`${API_URL}/api/bi/anomalies`, { headers }),
        fetch(`${API_URL}/api/bi/predictions`, { headers }),
        fetch(`${API_URL}/api/bi/category-breakdown?${dateQuery}`, { headers }),
        fetch(`${API_URL}/api/menu-engineering/classification?days=${dateRange === 'all' ? 90 : dateRange}`, { headers }),
        fetch(`${API_URL}/api/bi/multi-outlet-summary?${dateQuery}`, { headers })
      ]);

      if (sumRes.ok) setSummary(await sumRes.json());
      if (trendRes.ok) setTrends(await trendRes.json());
      if (anomalyRes.ok) {
        const data = await anomalyRes.json();
        setAnomalies(data.anomalies || []);
      }
      if (predRes.ok) setPredictions(await predRes.json());
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategoryBreakdown(catData.breakdown || []);
      }
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenuItems(menuData);
        if (menuData.length > 0 && !selectedSimDish) {
          setSelectedSimDish(menuData[0]._id);
          setProposedPrice(menuData[0].price);
        }
      }
      if (outletRes.ok) {
        const outletData = await outletRes.json();
        setOutlets(outletData.outlets || []);
      }
    } catch (error) {
      console.error('Failed to load Advance BI data', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [dateRange, customStart, customEnd]);

  // Run price simulation
  const handleSimulate = async () => {
    if (!selectedSimDish || proposedPrice <= 0) return;
    setSimulating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/menu-engineering/simulation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dishId: selectedSimDish,
          proposedPrice: Number(proposedPrice)
        })
      });
      if (res.ok) {
        setSimulationResult(await res.json());
      }
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setSimulating(false);
    }
  };

  // Run AI consultation
  const handleAskAI = async (queryText?: string) => {
    const q = queryText || aiQuery;
    if (!q.trim()) return;
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/ai-consultant/consult`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: q })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.response);
      } else {
        const err = await res.json();
        setAiResponse(err.error || 'Failed to fetch AI recommendation.');
      }
    } catch (error) {
      console.error('AI consultation failed:', error);
      setAiResponse('Error communicating with AI Consultant service.');
    } finally {
      setAiLoading(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!trends || trends.length === 0) return;
    const headers = ['Date', 'Revenue (INR)', 'Orders Count'];
    const rows = trends.map(t => [t._id, t.revenue, t.orders]);
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kyroz_bi_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Menu quadrant grouping
  const matrixQuadrants = useMemo(() => {
    const stars = menuItems.filter(i => i.classification === 'Star');
    const cashCows = menuItems.filter(i => i.classification === 'Cash Cow' || i.classification === 'Low Margin');
    const puzzles = menuItems.filter(i => i.classification === 'Puzzle');
    const deadItems = menuItems.filter(i => i.classification === 'Dead Item');
    return { stars, cashCows, puzzles, deadItems };
  }, [menuItems]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#d4af37]">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-bold tracking-widest uppercase text-xs">Loading Executive Business Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header & Executive Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">
            <Zap size={14} /> Executive Command Center
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Advance Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">Intelligence</span>
          </h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm md:text-base">
            Comprehensive real-time profitability analytics, automated forecasting, menu engineering, and multi-outlet intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center bg-card border border-border p-1 rounded-2xl shadow-sm">
            {(['7', '30', '90', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => {
                  setCustomStart('');
                  setCustomEnd('');
                  setDateRange(range);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  dateRange === range && !customStart
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {range === 'all' ? 'All Time' : `${range}D`}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAllData(true)}
            disabled={refreshing}
            className="p-2.5 rounded-2xl bg-card border border-border text-foreground/70 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all flex items-center justify-center"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin text-[#d4af37]' : ''} />
          </button>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card border border-border hover:border-[#d4af37]/50 text-foreground font-bold text-xs uppercase tracking-wider hover:text-[#d4af37] transition-all shadow-sm"
          >
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', label: 'Executive Health & Analytics', icon: Layers },
          { id: 'predictions', label: 'AI Forecasting & Alerts', icon: Sparkles },
          { id: 'matrix', label: 'Menu Engineering Matrix', icon: ChefHat },
          { id: 'outlets', label: 'Multi-Outlet Benchmark', icon: Store }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#2a220a] to-[#1a1505] border border-[#d4af37]/50 text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                : 'text-foreground/60 hover:text-foreground hover:bg-card border border-transparent'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Detected Anomalies Banner (Always Visible if Any Exist) */}
      {anomalies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
              <AlertCircle size={16} /> Real-Time Health Anomalies ({anomalies.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anomalies.map((anomaly, idx) => (
              <div 
                key={idx} 
                className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex flex-col justify-between gap-2 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-red-400 font-extrabold uppercase text-[10px] tracking-widest px-2 py-0.5 rounded-full bg-red-500/20">
                      {anomaly.type}
                    </span>
                    <span className="text-xs text-red-300/80 font-bold">{anomaly.severity || 'High Priority'}</span>
                  </div>
                  <p className="text-foreground text-sm font-medium mt-1">{anomaly.message}</p>
                </div>
                {anomaly.action && (
                  <div className="text-xs text-foreground/80 bg-background/60 p-2.5 rounded-xl border border-red-500/20">
                    <strong className="text-red-400">Recommended Action:</strong> {anomaly.action}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW & EXECUTIVE ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Executive KPI Grid */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Total Revenue */}
              <div className="p-6 bg-card border border-border rounded-3xl shadow-sm hover:border-[#d4af37]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Total Revenue</span>
                    <div className="w-8 h-8 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black tracking-tight">₹{summary.revenue?.toLocaleString() || 0}</h3>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-green-400 font-bold">
                  <ArrowUpRight size={14} /> Total Net Gross
                </div>
              </div>

              {/* Total Orders */}
              <div className="p-6 bg-card border border-border rounded-3xl shadow-sm hover:border-[#d4af37]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Orders Count</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <ShoppingBag size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black tracking-tight">{summary.orders?.toLocaleString() || 0}</h3>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-blue-400 font-bold">
                  AOV: ₹{summary.aov || 0}
                </div>
              </div>

              {/* Food Cost % */}
              <div className="p-6 bg-card border border-border rounded-3xl shadow-sm hover:border-[#d4af37]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Food Cost %</span>
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <Percent size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black tracking-tight">{summary.foodCostPercentage || 0}%</h3>
                </div>
                <div className={`mt-4 flex items-center gap-1 text-xs font-bold ${Number(summary.foodCostPercentage) > 35 ? 'text-red-400' : 'text-green-400'}`}>
                  {Number(summary.foodCostPercentage) > 35 ? 'Above 35% benchmark' : 'Healthy margin standard'}
                </div>
              </div>

              {/* Gross Margin */}
              <div className="p-6 bg-card border border-border rounded-3xl shadow-sm hover:border-[#d4af37]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Gross Margin</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black tracking-tight">{summary.grossMargin || 0}%</h3>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-purple-400 font-bold">
                  ₹{summary.grossProfit?.toLocaleString() || 0} Profit
                </div>
              </div>

              {/* Total Wastage Cost */}
              <div className="p-6 bg-card border border-border rounded-3xl shadow-sm hover:border-[#d4af37]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Wastage Loss</span>
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                      <AlertTriangle size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black tracking-tight">₹{summary.totalWastageCost?.toLocaleString() || 0}</h3>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-red-400 font-bold">
                  Loss Impact
                </div>
              </div>
            </div>
          )}

          {/* Charts Row: Revenue Trend & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Trend Line/Bar Chart */}
            <div className="lg:col-span-2 p-6 bg-card border border-border rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">Sales & Order Volume Trend</h3>
                  <p className="text-foreground/50 text-xs">Daily aggregated turnover with volume patterns</p>
                </div>
              </div>

              {trends.length > 0 ? (
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="_id" stroke="#ffffff50" fontSize={12} tickLine={false} />
                      <YAxis stroke="#ffffff50" fontSize={12} tickFormatter={(v) => `₹${v}`} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px' }}
                        itemStyle={{ color: '#d4af37' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        name="Revenue" 
                        dataKey="revenue" 
                        stroke="#d4af37" 
                        strokeWidth={3} 
                        dot={{ r: 3, fill: '#d4af37' }} 
                        activeDot={{ r: 7 }} 
                      />
                      <Line 
                        type="monotone" 
                        name="Orders" 
                        dataKey="orders" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={{ r: 2, fill: '#3b82f6' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[340px] flex items-center justify-center text-foreground/40 text-sm">
                  No sales recorded in the selected period.
                </div>
              )}
            </div>

            {/* Category Revenue Distribution Pie/Bar */}
            <div className="p-6 bg-card border border-border rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Category Contribution</h3>
                <p className="text-foreground/50 text-xs mb-4">Share of total revenue by food category</p>
              </div>

              {categoryBreakdown.length > 0 ? (
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="revenue"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px' }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[240px] flex items-center justify-center text-foreground/40 text-sm">
                  No category transactions found.
                </div>
              )}

              {/* Category Mini Legend */}
              <div className="space-y-2 mt-4 max-h-[140px] overflow-y-auto custom-scrollbar">
                {categoryBreakdown.slice(0, 5).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} 
                      />
                      <span className="font-medium text-foreground/80">{cat.category}</span>
                    </div>
                    <span className="font-bold text-foreground">₹{cat.revenue?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Breakdown Full Table */}
          {categoryBreakdown.length > 0 && (
            <div className="p-6 bg-card border border-border rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">Category Margin Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-foreground/50 text-xs uppercase tracking-wider">
                      <th className="pb-3 font-bold">Category</th>
                      <th className="pb-3 font-bold">Revenue</th>
                      <th className="pb-3 font-bold">Items Sold</th>
                      <th className="pb-3 font-bold">Total Cost</th>
                      <th className="pb-3 font-bold">Profit</th>
                      <th className="pb-3 font-bold">Gross Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {categoryBreakdown.map((cat, idx) => (
                      <tr key={idx} className="hover:bg-foreground/5 transition-colors">
                        <td className="py-3 font-bold text-foreground flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} 
                          />
                          {cat.category}
                        </td>
                        <td className="py-3 font-medium">₹{cat.revenue?.toLocaleString()}</td>
                        <td className="py-3 text-foreground/70">{cat.itemsSold}</td>
                        <td className="py-3 text-foreground/70">₹{cat.cost?.toLocaleString()}</td>
                        <td className="py-3 font-bold text-green-400">₹{cat.profit?.toLocaleString()}</td>
                        <td className="py-3 font-black text-[#d4af37]">{cat.margin}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI FORECASTING & PREDICTIVE ANALYTICS */}
      {activeTab === 'predictions' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Revenue Forecast Cards */}
          {predictions?.forecast && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-[#2a220a] to-[#121212] border border-[#d4af37]/40 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">Next 7 Days Forecast</span>
                  <Sparkles size={18} className="text-[#d4af37]" />
                </div>
                <h3 className="text-3xl font-black text-foreground">
                  ₹{predictions.forecast.projectedNext7Days?.toLocaleString()}
                </h3>
                <p className="text-foreground/60 text-xs mt-2">
                  Projected revenue based on recent run rate & demand momentum.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-xs font-bold">
                  Avg Daily: ₹{predictions.forecast.avgDailyRevenue?.toLocaleString()}
                </div>
              </div>

              <div className="p-6 bg-card border border-border rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">30-Day Outlook</span>
                    <TrendingUp size={18} className="text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground">
                    ₹{predictions.forecast.projectedNext30Days?.toLocaleString()}
                  </h3>
                  <p className="text-foreground/60 text-xs mt-2">
                    Estimated monthly run rate under current trajectory.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-blue-400">
                  Growth Velocity: {predictions.forecast.growthRate}%
                </div>
              </div>

              <div className="p-6 bg-card border border-border rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Stockout Warning Counter</span>
                    <AlertTriangle size={18} className="text-orange-400" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground">
                    {predictions.stockoutAlerts?.length || 0} Items
                  </h3>
                  <p className="text-foreground/60 text-xs mt-2">
                    Raw materials operating below safety threshold or reorder level.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-orange-400">
                  Critical supply attention needed
                </div>
              </div>
            </div>
          )}

          {/* Action Recommendations & Stockout Risk List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Action Recommendations */}
            <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Bot className="text-[#d4af37]" size={20} /> Intelligent Action Recommendations
                </h3>
              </div>
              <p className="text-foreground/60 text-xs">
                Auto-generated prescriptive business actions based on real sales velocity and margins.
              </p>

              <div className="space-y-3 mt-4">
                {predictions?.actionRecommendations?.map((act: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-background/50 border border-border hover:border-[#d4af37]/40 transition-all flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">{act.tag}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        act.urgency === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {act.urgency} Urgency
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground text-sm">{act.title}</h4>
                    <p className="text-foreground/70 text-xs leading-relaxed">{act.description}</p>
                  </div>
                ))}
                {(!predictions?.actionRecommendations || predictions.actionRecommendations.length === 0) && (
                  <div className="p-8 text-center text-foreground/40 text-sm">
                    No urgent operational actions flagged at this time. All systems running stably.
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Stockout Risk Warnings */}
            <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="text-orange-400" size={20} /> Low Stock Warnings
                </h3>
              </div>
              <p className="text-foreground/60 text-xs">
                Ingredients at high risk of depletion before next replenishment cycle.
              </p>

              <div className="space-y-3 mt-4 max-h-[360px] overflow-y-auto custom-scrollbar">
                {predictions?.stockoutAlerts?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                      <p className="text-foreground/50 text-xs">{item.category} • Reorder Threshold: {item.reorderLevel} {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-orange-400">{item.currentStock} {item.unit}</span>
                      <span className="block text-[10px] text-red-400 font-bold uppercase">Restock Required</span>
                    </div>
                  </div>
                ))}
                {(!predictions?.stockoutAlerts || predictions.stockoutAlerts.length === 0) && (
                  <div className="p-8 text-center text-foreground/40 text-sm">
                    All inventory items are currently safely above their reorder thresholds.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive AI Business Consultant Console */}
          <div className="p-6 md:p-8 bg-gradient-to-br from-card via-[#161309] to-card border border-[#d4af37]/30 rounded-3xl shadow-lg space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[#d4af37] text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={14} /> AI Decision Consultant
                </span>
                <h3 className="text-2xl font-black text-foreground mt-1">
                  Ask Your Executive Business Partner
                </h3>
                <p className="text-foreground/60 text-xs md:text-sm mt-1">
                  Query real-time numbers, ask for menu recommendations, or test price hypotheses.
                </p>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                'How can I lower my food cost percentage?',
                'Which dishes should I promote this weekend?',
                'What is the profit impact if I raise pricing by 8%?',
                'Identify my least profitable menu items'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAiQuery(chip);
                    handleAskAI(chip);
                  }}
                  className="px-3 py-1.5 rounded-full bg-background/60 border border-border text-xs text-foreground/70 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Prompt Input Form */}
            <div className="flex gap-3">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder="Ask about your revenue, dishes, wastage, or business decisions..."
                className="flex-1 bg-background border border-border rounded-2xl px-5 py-3 text-sm text-foreground focus:outline-none focus:border-[#d4af37] transition-all"
              />
              <button
                onClick={() => handleAskAI()}
                disabled={aiLoading || !aiQuery.trim()}
                className="px-6 py-3 bg-[#d4af37] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
              >
                {aiLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Consult
              </button>
            </div>

            {/* AI Response Display */}
            {aiResponse && (
              <div className="p-6 rounded-2xl bg-background/80 border border-[#d4af37]/30 text-foreground space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                  <CheckCircle2 size={16} /> Consultation Result
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MENU ENGINEERING 4-QUADRANT MATRIX & PRICING SIMULATOR */}
      {activeTab === 'matrix' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header Explanation */}
          <div className="p-6 bg-card border border-border rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Boston Consulting Group (BCG) Menu Matrix</h3>
              <p className="text-foreground/60 text-xs mt-1">
                Classifies dishes based on Popularity (Volume Sold) vs. Profitability (Contribution Margin %).
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold">★ Stars (High Pop / High Profit)</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">🐄 Cash Cows (High Pop / Low Profit)</span>
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">🧩 Puzzles (Low Pop / High Profit)</span>
              <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold">🐕 Dead Items (Low Pop / Low Profit)</span>
            </div>
          </div>

          {/* 4 Quadrants Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. STARS */}
            <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-green-400 flex items-center gap-2">
                    ★ Stars ({matrixQuadrants.stars.length})
                  </h4>
                  <p className="text-foreground/50 text-xs">High Margin • High Volume • Keep Promoted</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase">
                  Flagship
                </span>
              </div>
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto custom-scrollbar">
                {matrixQuadrants.stars.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-foreground text-sm">{item.name}</h5>
                      <span className="text-xs text-foreground/50">₹{item.price} • Margin: {item.contributionMargin?.toFixed(1)}%</span>
                    </div>
                    <span className="text-xs font-bold text-green-400">{item.quantitySold} sold</span>
                  </div>
                ))}
                {matrixQuadrants.stars.length === 0 && (
                  <p className="text-xs text-foreground/40 text-center py-4">No stars in this period.</p>
                )}
              </div>
            </div>

            {/* 2. PUZZLES */}
            <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-orange-400 flex items-center gap-2">
                    🧩 Puzzles ({matrixQuadrants.puzzles.length})
                  </h4>
                  <p className="text-foreground/50 text-xs">High Margin • Low Volume • Reposition & Promote</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase">
                  High Margin
                </span>
              </div>
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto custom-scrollbar">
                {matrixQuadrants.puzzles.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-foreground text-sm">{item.name}</h5>
                      <span className="text-xs text-foreground/50">₹{item.price} • Margin: {item.contributionMargin?.toFixed(1)}%</span>
                    </div>
                    <span className="text-xs font-bold text-orange-400">{item.quantitySold} sold</span>
                  </div>
                ))}
                {matrixQuadrants.puzzles.length === 0 && (
                  <p className="text-xs text-foreground/40 text-center py-4">No puzzles found.</p>
                )}
              </div>
            </div>

            {/* 3. CASH COWS / WORKHORSES */}
            <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-blue-400 flex items-center gap-2">
                    🐄 Cash Cows ({matrixQuadrants.cashCows.length})
                  </h4>
                  <p className="text-foreground/50 text-xs">Low Margin • High Volume • Optimize Recipe & Pricing</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase">
                  High Volume
                </span>
              </div>
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto custom-scrollbar">
                {matrixQuadrants.cashCows.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-foreground text-sm">{item.name}</h5>
                      <span className="text-xs text-foreground/50">₹{item.price} • Margin: {item.contributionMargin?.toFixed(1)}%</span>
                    </div>
                    <span className="text-xs font-bold text-blue-400">{item.quantitySold} sold</span>
                  </div>
                ))}
                {matrixQuadrants.cashCows.length === 0 && (
                  <p className="text-xs text-foreground/40 text-center py-4">No cash cows in this period.</p>
                )}
              </div>
            </div>

            {/* 4. DEAD ITEMS / DOGS */}
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-red-400 flex items-center gap-2">
                    🐕 Dead Items ({matrixQuadrants.deadItems.length})
                  </h4>
                  <p className="text-foreground/50 text-xs">Low Margin • Low Volume • Revamp or Eliminate</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase">
                  Underperformer
                </span>
              </div>
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto custom-scrollbar">
                {matrixQuadrants.deadItems.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-foreground text-sm">{item.name}</h5>
                      <span className="text-xs text-foreground/50">₹{item.price} • Margin: {item.contributionMargin?.toFixed(1)}%</span>
                    </div>
                    <span className="text-xs font-bold text-red-400">{item.quantitySold} sold</span>
                  </div>
                ))}
                {matrixQuadrants.deadItems.length === 0 && (
                  <p className="text-xs text-foreground/40 text-center py-4">No underperformers identified.</p>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Price Simulation Sandbox */}
          <div className="p-6 md:p-8 bg-card border border-[#d4af37]/30 rounded-3xl shadow-md space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[#d4af37] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={16} /> Pricing Simulator
                </span>
                <h3 className="text-2xl font-black text-foreground mt-1">Simulate Price Elasticity & Margin Impact</h3>
                <p className="text-foreground/60 text-xs">
                  Model what happens to contribution margins and projected sales volume before updating menu prices.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Select Dish</label>
                <select
                  value={selectedSimDish}
                  onChange={(e) => {
                    setSelectedSimDish(e.target.value);
                    const found = menuItems.find(i => i._id === e.target.value);
                    if (found) setProposedPrice(found.price);
                  }}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#d4af37]"
                >
                  {menuItems.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name} (Current: ₹{item.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Proposed Selling Price (₹)</label>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="w-full py-3 bg-[#d4af37] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {simulating ? <RefreshCw size={16} className="animate-spin" /> : <Sliders size={16} />}
                Run Simulation
              </button>
            </div>

            {/* Simulation Comparison Output */}
            {simulationResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-in fade-in">
                <div className="p-4 rounded-2xl bg-background/50 border border-border">
                  <span className="text-xs text-foreground/50 uppercase font-bold">Current Margin</span>
                  <h5 className="text-xl font-black mt-1 text-foreground">
                    ₹{simulationResult.currentContribution} <span className="text-xs text-foreground/50 font-normal">({(100 - Number(simulationResult.currentFoodCostPercent)).toFixed(1)}%)</span>
                  </h5>
                  <span className="text-[10px] text-foreground/40">Food Cost: {simulationResult.currentFoodCostPercent}%</span>
                </div>

                <div className="p-4 rounded-2xl bg-background/50 border border-border">
                  <span className="text-xs text-[#d4af37] uppercase font-bold">Simulated Margin</span>
                  <h5 className="text-xl font-black mt-1 text-[#d4af37]">
                    ₹{simulationResult.proposedContribution} <span className="text-xs text-[#d4af37]/70 font-normal">({(100 - Number(simulationResult.proposedFoodCostPercent)).toFixed(1)}%)</span>
                  </h5>
                  <span className="text-[10px] text-foreground/40">Food Cost: {simulationResult.proposedFoodCostPercent}%</span>
                </div>

                <div className="p-4 rounded-2xl bg-background/50 border border-border">
                  <span className="text-xs text-foreground/50 uppercase font-bold">Volume Elasticity</span>
                  <h5 className="text-xl font-black mt-1 text-foreground">
                    {simulationResult.volumeChangeImpact}
                  </h5>
                  <span className="text-[10px] text-foreground/40">Estimated customer demand sensitivity</span>
                </div>

                <div className="p-4 rounded-2xl bg-background/50 border border-border">
                  <span className="text-xs text-foreground/50 uppercase font-bold">Unit Profit Shift</span>
                  <h5 className={`text-xl font-black mt-1 ${simulationResult.proposedContribution >= simulationResult.currentContribution ? 'text-green-400' : 'text-red-400'}`}>
                    {simulationResult.proposedContribution >= simulationResult.currentContribution ? '+' : ''}
                    ₹{(simulationResult.proposedContribution - simulationResult.currentContribution).toFixed(1)} / order
                  </h5>
                  <span className="text-[10px] text-foreground/40">Direct net gain per serving</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MULTI-OUTLET BENCHMARK */}
      {activeTab === 'outlets' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Multi-Outlet Performance Leaderboard</h3>
              <p className="text-foreground/60 text-xs mt-1">
                Comparative benchmarks across all franchise, company-owned, and branch locations.
              </p>
            </div>
            <div className="text-xs font-bold text-[#d4af37] px-3 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
              Total Outlets: {outlets.length}
            </div>
          </div>

          {outlets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outlets.map((outlet, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-card border border-border rounded-3xl shadow-sm hover:border-[#d4af37]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/70">
                          Branch #{idx + 1}
                        </span>
                        <h4 className="text-xl font-bold text-foreground mt-2">{outlet.shopName}</h4>
                        <p className="text-xs text-foreground/50">{outlet.shopAddress || 'Central HQ Unit'}</p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center font-black">
                        <Store size={20} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-4 border-y border-border/60">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground/50">Revenue</span>
                        <p className="text-lg font-black text-foreground">₹{outlet.revenue?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground/50">Orders</span>
                        <p className="text-lg font-black text-foreground">{outlet.orders?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground/50">Food Cost</span>
                        <p className={`text-lg font-black ${Number(outlet.foodCostPercentage) > 35 ? 'text-red-400' : 'text-green-400'}`}>
                          {outlet.foodCostPercentage}%
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground/50">Gross Margin</span>
                        <p className="text-lg font-black text-[#d4af37]">{outlet.grossMargin}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between text-xs">
                    <span className="text-foreground/50 font-medium">Rank Benchmark:</span>
                    <span className="font-bold text-[#d4af37]">Top Tier</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-foreground/50 bg-card rounded-3xl border border-border">
              No branch outlets registered under your scale account yet. Go to Multi Outlet dashboard to link branch locations.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
