'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  AlertCircle, TrendingUp, IndianRupee, ShoppingBag, Percent, 
  Calendar, Download, AlertTriangle, BarChart3, ChefHat, 
  Building2, Calculator, ArrowUpRight, ArrowDownRight, RefreshCw, 
  CheckCircle2, Sliders, MessageSquare, ShieldAlert, ArrowRight,
  Sparkles, Layers
} from 'lucide-react';
import { API_URL } from '@/lib/api';

const CATEGORY_COLORS = ['#d4af37', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

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

  // AI Consultant query states
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getDateQuery = () => {
    let start: Date | null = null;
    const end: Date = new Date();

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
      console.error('Failed to load BI data', error);
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
        setAiResponse(err.error || 'Failed to generate advisory response.');
      }
    } catch (error) {
      console.error('AI consultation failed:', error);
      setAiResponse('Unable to reach the advisory engine. Please try again.');
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
    link.setAttribute('download', `sales_bi_report_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-foreground/60">
        <div className="w-8 h-8 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="font-semibold text-xs tracking-wider uppercase">Loading Business Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 size={13} /> Business Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Advance Business Reports & Analytics
          </h1>
          <p className="text-foreground/60 text-xs sm:text-sm mt-1 max-w-2xl">
            Real-time financial performance, profitability margins, predictive run-rate forecasts, and menu performance matrix.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center bg-card border border-border p-1 rounded-xl shadow-xs">
            {(['7', '30', '90', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => {
                  setCustomStart('');
                  setCustomEnd('');
                  setDateRange(range);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                  dateRange === range && !customStart
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {range === 'all' ? 'All Time' : `${range} Days`}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAllData(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-card border border-border text-foreground/70 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin text-[#d4af37]' : ''} />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-border hover:border-[#d4af37]/40 text-foreground font-semibold text-xs hover:text-[#d4af37] transition-colors"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Clean Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', label: 'Financial Health', icon: BarChart3 },
          { id: 'predictions', label: 'Forecasts & Safety Stock', icon: TrendingUp },
          { id: 'matrix', label: 'Menu Engineering Matrix', icon: ChefHat },
          { id: 'outlets', label: 'Outlet Comparisons', icon: Building2 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-card border border-[#d4af37]/40 text-[#d4af37] shadow-xs'
                : 'text-foreground/60 hover:text-foreground hover:bg-card/50 border border-transparent'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Anomalies Banner (Only if genuine operational anomalies detected) */}
      {anomalies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
            <AlertCircle size={15} /> Operational Alerts ({anomalies.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {anomalies.map((anomaly, idx) => (
              <div 
                key={idx} 
                className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-red-400 font-bold uppercase text-[11px] tracking-wider">
                      {anomaly.type}
                    </span>
                    <span className="text-[11px] text-red-300 font-medium">{anomaly.severity || 'Attention'}</span>
                  </div>
                  <p className="text-foreground text-xs font-medium leading-relaxed">{anomaly.message}</p>
                </div>
                {anomaly.action && (
                  <div className="text-[11px] text-foreground/80 bg-background/50 p-2.5 rounded-lg border border-red-500/10">
                    <strong className="text-red-400">Action:</strong> {anomaly.action}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: FINANCIAL HEALTH & OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground/60 uppercase">Net Revenue</span>
                    <div className="w-7 h-7 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                      <IndianRupee size={15} />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">₹{summary.revenue?.toLocaleString() || 0}</h3>
                </div>
                <div className="mt-3 text-[11px] text-green-500 font-medium flex items-center gap-1">
                  <ArrowUpRight size={13} /> Recorded Sales
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground/60 uppercase">Completed Orders</span>
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <ShoppingBag size={15} />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{summary.orders?.toLocaleString() || 0}</h3>
                </div>
                <div className="mt-3 text-[11px] text-blue-400 font-medium">
                  Average Order: ₹{summary.aov || 0}
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground/60 uppercase">Food Cost %</span>
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <Percent size={15} />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{summary.foodCostPercentage || 0}%</h3>
                </div>
                <div className={`mt-3 text-[11px] font-medium ${Number(summary.foodCostPercentage) > 35 ? 'text-red-400' : 'text-green-500'}`}>
                  {Number(summary.foodCostPercentage) > 35 ? 'Above standard threshold' : 'Within target range'}
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground/60 uppercase">Gross Margin</span>
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <TrendingUp size={15} />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{summary.grossMargin || 0}%</h3>
                </div>
                <div className="mt-3 text-[11px] text-purple-400 font-medium">
                  ₹{summary.grossProfit?.toLocaleString() || 0} Gross Profit
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground/60 uppercase">Wastage Loss</span>
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                      <ShieldAlert size={15} />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">₹{summary.totalWastageCost?.toLocaleString() || 0}</h3>
                </div>
                <div className="mt-3 text-[11px] text-red-400 font-medium">
                  Recorded Waste Cost
                </div>
              </div>
            </div>
          )}

          {/* Revenue & Volume Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">Revenue & Order Volume</h3>
                  <p className="text-foreground/50 text-xs">Daily aggregated turnover pattern</p>
                </div>
              </div>

              {trends.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends} margin={{ top: 5, right: 15, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="_id" stroke="#ffffff50" fontSize={11} tickLine={false} />
                      <YAxis stroke="#ffffff50" fontSize={11} tickFormatter={(v) => `₹${v}`} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                        itemStyle={{ color: '#d4af37' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line 
                        type="monotone" 
                        name="Revenue (₹)" 
                        dataKey="revenue" 
                        stroke="#d4af37" 
                        strokeWidth={2.5} 
                        dot={{ r: 2, fill: '#d4af37' }} 
                        activeDot={{ r: 6 }} 
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
                <div className="h-[300px] flex items-center justify-center text-foreground/40 text-xs">
                  No sales recorded in the selected period.
                </div>
              )}
            </div>

            {/* Category Revenue Contribution */}
            <div className="p-5 bg-card border border-border rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Category Contribution</h3>
                <p className="text-foreground/50 text-xs mb-3">Revenue percentage by menu category</p>
              </div>

              {categoryBreakdown.length > 0 ? (
                <div className="h-[210px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="revenue"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[210px] flex items-center justify-center text-foreground/40 text-xs">
                  No category transactions recorded.
                </div>
              )}

              <div className="space-y-1.5 mt-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                {categoryBreakdown.slice(0, 5).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-sm" 
                        style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} 
                      />
                      <span className="text-foreground/80 truncate max-w-[120px]">{cat.category}</span>
                    </div>
                    <span className="font-semibold text-foreground">₹{cat.revenue?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Category Margin Performance Table */}
          {categoryBreakdown.length > 0 && (
            <div className="p-5 bg-card border border-border rounded-2xl">
              <h3 className="text-base font-bold text-foreground mb-4">Category Margin Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-foreground/50 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Revenue</th>
                      <th className="pb-3 font-semibold">Units Sold</th>
                      <th className="pb-3 font-semibold">Cost</th>
                      <th className="pb-3 font-semibold">Profit</th>
                      <th className="pb-3 font-semibold">Gross Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {categoryBreakdown.map((cat, idx) => (
                      <tr key={idx} className="hover:bg-foreground/5 transition-colors">
                        <td className="py-2.5 font-medium text-foreground flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} 
                          />
                          {cat.category}
                        </td>
                        <td className="py-2.5">₹{cat.revenue?.toLocaleString()}</td>
                        <td className="py-2.5 text-foreground/70">{cat.itemsSold}</td>
                        <td className="py-2.5 text-foreground/70">₹{cat.cost?.toLocaleString()}</td>
                        <td className="py-2.5 font-semibold text-green-500">₹{cat.profit?.toLocaleString()}</td>
                        <td className="py-2.5 font-bold text-[#d4af37]">{cat.margin}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FORECASTS & SAFETY STOCK */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          {/* Forecast Metric Cards */}
          {predictions?.forecast && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-card border border-border rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground/60 uppercase">7-Day Run Rate</span>
                  <TrendingUp size={16} className="text-[#d4af37]" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  ₹{predictions.forecast.projectedNext7Days?.toLocaleString()}
                </h3>
                <p className="text-foreground/50 text-xs mt-1">
                  Estimated 7-day revenue based on recent daily run-rate.
                </p>
                <div className="mt-3 text-xs font-semibold text-[#d4af37]">
                  Daily Average: ₹{predictions.forecast.avgDailyRevenue?.toLocaleString()}
                </div>
              </div>

              <div className="p-5 bg-card border border-border rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground/60 uppercase">30-Day Projection</span>
                  <BarChart3 size={16} className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  ₹{predictions.forecast.projectedNext30Days?.toLocaleString()}
                </h3>
                <p className="text-foreground/50 text-xs mt-1">
                  Monthly velocity assuming current traffic holds.
                </p>
                <div className="mt-3 text-xs font-semibold text-blue-400">
                  Weekly Momentum: {predictions.forecast.growthRate}%
                </div>
              </div>

              <div className="p-5 bg-card border border-border rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground/60 uppercase">Low Stock Warnings</span>
                  <AlertTriangle size={16} className="text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {predictions.stockoutAlerts?.length || 0} Items
                </h3>
                <p className="text-foreground/50 text-xs mt-1">
                  Ingredients near or below configured reorder levels.
                </p>
                <div className="mt-3 text-xs font-semibold text-orange-400">
                  Inventory reorder review required
                </div>
              </div>
            </div>
          )}

          {/* Action Recommendations & Stockout List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-card border border-border rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp size={17} className="text-[#d4af37]" /> Operational Recommendations
              </h3>
              <p className="text-foreground/50 text-xs">
                Derived directly from current order volume trends and margin variances.
              </p>

              <div className="space-y-3 mt-2">
                {predictions?.actionRecommendations?.map((act: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-background/50 border border-border flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#d4af37] uppercase">{act.tag}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        act.urgency === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {act.urgency}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground text-xs">{act.title}</h4>
                    <p className="text-foreground/70 text-xs leading-relaxed">{act.description}</p>
                  </div>
                ))}
                {(!predictions?.actionRecommendations || predictions.actionRecommendations.length === 0) && (
                  <div className="p-6 text-center text-foreground/40 text-xs">
                    No critical operational alerts at this time. Current velocity is stable.
                  </div>
                )}
              </div>
            </div>

            {/* Raw Material Low Stock List */}
            <div className="p-5 bg-card border border-border rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertTriangle size={17} className="text-orange-400" /> Low Stock Warning Items
              </h3>
              <p className="text-foreground/50 text-xs">
                Ingredients approaching depletion threshold.
              </p>

              <div className="space-y-2.5 mt-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {predictions?.stockoutAlerts?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground text-xs">{item.name}</h4>
                      <p className="text-foreground/50 text-[11px]">{item.category} • Reorder Level: {item.reorderLevel} {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-orange-400">{item.currentStock} {item.unit}</span>
                      <span className="block text-[10px] text-red-400 font-semibold uppercase">Reorder</span>
                    </div>
                  </div>
                ))}
                {(!predictions?.stockoutAlerts || predictions.stockoutAlerts.length === 0) && (
                  <div className="p-6 text-center text-foreground/40 text-xs">
                    All inventory items are currently above configured safety reorder levels.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Business Advisory Query Console */}
          <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <MessageSquare size={17} className="text-[#d4af37]" /> Business Advisory Console
              </h3>
              <p className="text-foreground/60 text-xs mt-0.5">
                Query actual sales, recipe margins, and cost data to explore business recommendations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'How can I lower my food cost percentage?',
                'Which dishes should I promote this week?',
                'What is the profit impact of raising prices by 5%?',
                'Identify underperforming menu items'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAiQuery(chip);
                    handleAskAI(chip);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs text-foreground/70 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex gap-2.5">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder="Ask about margins, sales trends, or recipe costs..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#d4af37]"
              />
              <button
                onClick={() => handleAskAI()}
                disabled={aiLoading || !aiQuery.trim()}
                className="px-4 py-2.5 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#c5a028] disabled:opacity-50 transition-colors"
              >
                {aiLoading ? 'Analyzing...' : 'Ask'}
              </button>
            </div>

            {aiResponse && (
              <div className="p-4 rounded-xl bg-background border border-border text-xs text-foreground/90 space-y-2">
                <div className="font-bold text-[#d4af37] flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle2 size={14} /> Advisory Findings
                </div>
                <div className="leading-relaxed whitespace-pre-line">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MENU MATRIX & PRICING SIMULATOR */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-foreground">Menu Performance Matrix</h3>
              <p className="text-foreground/60 text-xs mt-0.5">
                Classifies dishes based on Popularity (Volume Sold) vs. Profitability (Contribution Margin %).
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-500 border border-green-500/20">Stars (High Pop / High Margin)</span>
              <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">Workhorses (High Pop / Low Margin)</span>
              <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">Puzzles (Low Pop / High Margin)</span>
              <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">Underperformers (Low Pop / Low Margin)</span>
            </div>
          </div>

          {/* 4 Quadrants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stars */}
            <div className="p-4 sm:p-5 bg-card border border-green-500/20 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-green-500">Stars ({matrixQuadrants.stars.length})</h4>
                  <p className="text-foreground/50 text-[11px]">High Demand & High Margin</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-green-500/10 text-green-500">
                  Priority
                </span>
              </div>
              <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                {matrixQuadrants.stars.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <span className="block text-[11px] text-foreground/50">₹{item.price} • Margin: {item.contributionMargin?.toFixed(1)}%</span>
                    </div>
                    <span className="font-bold text-green-500">{item.quantitySold} sold</span>
                  </div>
                ))}
                {matrixQuadrants.stars.length === 0 && (
                  <p className="text-xs text-foreground/40 text-center py-4">No star items in this period.</p>
                )}
              </div>
            </div>

            {/* Puzzles */}
            <div className="p-4 sm:p-5 bg-card border border-orange-500/20 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-orange-400">Puzzles ({matrixQuadrants.puzzles.length})</h4>
                  <p className="text-foreground/50 text-[11px]">High Margin, Lower Volume</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400">
                  Reposition
                </span>
              </div>
              <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                {matrixQuadrants.puzzles.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <span className="block text-[11px] text-foreground/50">₹{item.price} • Margin: {item.contributionMargin?.toFixed(1)}%</span>
                    </div>
                    <span className="font-bold text-orange-400">{item.quantitySold} sold</span>
                  </div>
                ))}
                {matrixQuadrants.puzzles.length === 0 && (
                  <p className="text-xs text-foreground/40 text-center py-4">No puzzle items found.</p>
                )}
              </div>
            </div>

            {/* Cash Cows / Workhorses */}
            <div className="p-4 sm:p-5 bg-card border border-blue-500/20 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-blue-400">Workhorses ({matrixQuadrants.cashCows.length})</h4>
                  <p className="text-foreground/50 text-[11px]">High Demand, Lower Margin</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400">
                  Optimize Cost
                </span>
              </div>
              <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                {matrixQuadrants.cashCows.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <span className="block text-[11px] text-foreground/50">₹{item.price} • Margin: {item.contributionMargin?.toFixed(1)}%</span>
                    </div>
                    <span className="font-bold text-blue-400">{item.quantitySold} sold</span>
                  </div>
                ))}
                {matrixQuadrants.cashCows.length === 0 && (
                  <p className="text-xs text-foreground/40 text-center py-4">No workhorse items recorded.</p>
                )}
              </div>
            </div>

            {/* Dead Items / Underperformers */}
            <div className="p-4 sm:p-5 bg-card border border-red-500/20 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-400">Underperformers ({matrixQuadrants.deadItems.length})</h4>
                  <p className="text-foreground/50 text-[11px]">Low Margin, Low Demand</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-500/10 text-red-400">
                  Review
                </span>
              </div>
              <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                {matrixQuadrants.deadItems.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <span className="block text-[11px] text-foreground/50">₹{item.price} • Margin: {item.contributionMargin?.toFixed(1)}%</span>
                    </div>
                    <span className="font-bold text-red-400">{item.quantitySold} sold</span>
                  </div>
                ))}
                {matrixQuadrants.deadItems.length === 0 && (
                  <p className="text-xs text-foreground/40 text-center py-4">No underperformers identified.</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Simulator */}
          <div className="p-5 sm:p-6 bg-card border border-border rounded-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Calculator size={17} className="text-[#d4af37]" /> Recipe Price Simulator
              </h3>
              <p className="text-foreground/60 text-xs mt-0.5">
                Simulate gross contribution changes before revising dish pricing on the live POS terminal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase">Menu Item</label>
                <select
                  value={selectedSimDish}
                  onChange={(e) => {
                    setSelectedSimDish(e.target.value);
                    const found = menuItems.find(i => i._id === e.target.value);
                    if (found) setProposedPrice(found.price);
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#d4af37]"
                >
                  {menuItems.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name} (Current: ₹{item.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase">Proposed Price (₹)</label>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="w-full py-2 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wide rounded-xl hover:bg-[#c5a028] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
              >
                {simulating ? 'Calculating...' : 'Calculate Margin'}
              </button>
            </div>

            {simulationResult && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border text-xs">
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-foreground/50 font-semibold uppercase text-[10px]">Current Margin</span>
                  <p className="text-base font-bold text-foreground mt-0.5">
                    ₹{simulationResult.currentContribution} <span className="text-[11px] font-normal text-foreground/50">({(100 - Number(simulationResult.currentFoodCostPercent)).toFixed(1)}%)</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-[#d4af37] font-semibold uppercase text-[10px]">Simulated Margin</span>
                  <p className="text-base font-bold text-[#d4af37] mt-0.5">
                    ₹{simulationResult.proposedContribution} <span className="text-[11px] font-normal text-[#d4af37]/70">({(100 - Number(simulationResult.proposedFoodCostPercent)).toFixed(1)}%)</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-foreground/50 font-semibold uppercase text-[10px]">Volume Sensitivity</span>
                  <p className="text-base font-bold text-foreground mt-0.5">
                    {simulationResult.volumeChangeImpact}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-foreground/50 font-semibold uppercase text-[10px]">Net Difference</span>
                  <p className={`text-base font-bold mt-0.5 ${simulationResult.proposedContribution >= simulationResult.currentContribution ? 'text-green-500' : 'text-red-400'}`}>
                    {simulationResult.proposedContribution >= simulationResult.currentContribution ? '+' : ''}
                    ₹{(simulationResult.proposedContribution - simulationResult.currentContribution).toFixed(1)} / dish
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: OUTLET COMPARISONS */}
      {activeTab === 'outlets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Multi-Outlet Benchmark</h3>
              <p className="text-foreground/60 text-xs mt-0.5">
                Financial comparison between company-owned and linked branch outlets.
              </p>
            </div>
            <span className="text-xs font-semibold text-foreground/70 px-3 py-1 rounded-lg bg-card border border-border w-max">
              Outlets: {outlets.length}
            </span>
          </div>

          {outlets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {outlets.map((outlet, idx) => (
                <div 
                  key={idx}
                  className="p-4 sm:p-5 bg-card border border-border rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-foreground/10 text-foreground/70">
                          Branch #{idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-foreground mt-1.5">{outlet.shopName}</h4>
                        <p className="text-[11px] text-foreground/50 truncate max-w-[200px]">{outlet.shopAddress || 'Central Unit'}</p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-border/50 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-foreground/50">Revenue</span>
                        <p className="text-sm font-bold text-foreground">₹{outlet.revenue?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-foreground/50">Orders</span>
                        <p className="text-sm font-bold text-foreground">{outlet.orders?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-foreground/50">Food Cost</span>
                        <p className={`text-sm font-bold ${Number(outlet.foodCostPercentage) > 35 ? 'text-red-400' : 'text-green-500'}`}>
                          {outlet.foodCostPercentage}%
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-foreground/50">Gross Margin</span>
                        <p className="text-sm font-bold text-[#d4af37]">{outlet.grossMargin}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-foreground/60 flex items-center justify-between">
                    <span>Performance:</span>
                    <span className="font-semibold text-green-500">Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-foreground/40 bg-card rounded-2xl border border-border text-xs">
              No branch outlets currently registered under your account.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
