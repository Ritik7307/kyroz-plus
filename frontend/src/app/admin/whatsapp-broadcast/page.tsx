'use client';

import { useEffect, useMemo, useState } from 'react';
import { 
  Megaphone, 
  Send, 
  Loader2, 
  CheckSquare, 
  Square, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { API_URL } from '@/lib/api';
import Papa from 'papaparse';
import readXlsxFile from 'read-excel-file/browser';

type Conversation = {
  _id: string;
  name: string;
  phone: string;
};

type MetaTemplate = {
  id: string;
  name: string;
  status: string;
  category: string;
  language: string;
  body: string;
  header?: string;
  headerFormat?: string;
  footer?: string;
  buttons?: any[];
  variables: string[];
};

type ContactRecord = {
  phone: string;
  restaurantName?: string;
  name?: string;
  [key: string]: any;
};

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export default function WhatsAppBroadcastPage() {
  const [targetSource, setTargetSource] = useState<'file' | 'contacts'>('file');
  const [broadcastMethod, setBroadcastMethod] = useState<'template' | 'custom'>('template');
  
  const [contacts, setContacts] = useState<Conversation[]>([]);
  const [uploadedRecords, setUploadedRecords] = useState<ContactRecord[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  // Meta Templates
  const [metaTemplates, setMetaTemplates] = useState<MetaTemplate[]>([]);
  const [selectedMetaTemplate, setSelectedMetaTemplate] = useState<MetaTemplate | null>(null);
  const [varMapping, setVarMapping] = useState<Record<string, string>>({}); // { "1": "restaurantName" }
  const [previewRowIndex, setPreviewRowIndex] = useState(0);

  // Custom text fallback
  const [customMessage, setCustomMessage] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [convRes, tplRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/whatsapp/conversations`, { headers: authHeaders() }),
          fetch(`${API_URL}/api/admin/whatsapp/meta-templates`, { headers: authHeaders() }),
        ]);
        
        const convData = await convRes.json();
        const tplData = await tplRes.json();
        
        if (convRes.ok && Array.isArray(convData)) {
          setContacts(convData);
          setSelectedIds(convData.map((c: Conversation) => c._id));
        }

        if (tplRes.ok && Array.isArray(tplData)) {
          setMetaTemplates(tplData);
          // Auto select first approved template if available
          const approved = tplData.find((t: MetaTemplate) => t.status === 'APPROVED') || tplData[0];
          if (approved) {
            handleSelectMetaTemplate(approved);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load broadcast data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelectMetaTemplate = (tpl: MetaTemplate) => {
    setSelectedMetaTemplate(tpl);
    const initialMap: Record<string, string> = {};
    tpl.variables.forEach((v) => {
      // Default variable 1 to restaurantName or name if available
      if (v === '1') {
        initialMap[v] = 'restaurantName';
      } else {
        initialMap[v] = '';
      }
    });
    setVarMapping(initialMap);
  };

  const toggleContact = (id: string) => {
    setSelectAll(false);
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError('');
    setStatus('');

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      try {
        const rows = (await readXlsxFile(file)) as unknown as any[][];
        if (!rows || rows.length < 2) {
          setError('Excel file is empty or does not have data rows.');
          return;
        }

        const headers = (rows[0] as any[]).map((h: any) => String(h || '').trim());
        setAvailableColumns(headers);

        const records: ContactRecord[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i] as any[];
          const obj: ContactRecord = { phone: '' };
          headers.forEach((h: string, idx: number) => {
            const val = row[idx] !== null && row[idx] !== undefined ? String(row[idx]).trim() : '';
            obj[h] = val;
            if (h.toLowerCase() === 'phone' || h.toLowerCase() === 'mobile' || h.toLowerCase() === 'whatsapp') {
              obj.phone = val;
            }
            if (h.toLowerCase() === 'restaurantname' || h.toLowerCase() === 'restaurant' || h.toLowerCase() === 'business') {
              obj.restaurantName = val;
            }
          });
          if (obj.phone) {
            records.push(obj);
          }
        }

        setUploadedRecords(records);
        if (records.length === 0) {
          setError('No valid contacts found in Excel file. Please ensure there is a "phone" column.');
        } else {
          setStatus(`Loaded ${records.length} contacts from Excel successfully.`);
        }
      } catch (err: any) {
        setError('Failed to parse Excel file: ' + err.message);
      }
    } else {
      // CSV File
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = results.data as ContactRecord[];
          if (parsed.length > 0) {
            const cols = Object.keys(parsed[0]);
            setAvailableColumns(cols);
          }
          const valid = parsed.filter((c) => c && (c.phone || c.Phone || c.mobile || c.Mobile));
          // Normalize phone & restaurantName
          const normalized = valid.map((c) => {
            const phone = c.phone || c.Phone || c.mobile || c.Mobile || '';
            const restaurantName = c.restaurantName || c.RestaurantName || c.name || c.Name || '';
            return { ...c, phone: String(phone), restaurantName: String(restaurantName) };
          });

          setUploadedRecords(normalized);
          if (normalized.length === 0) {
            setError('No valid contacts found in CSV. Please make sure there is a "phone" column.');
          } else {
            setStatus(`Loaded ${normalized.length} contacts from CSV successfully.`);
          }
        },
        error: (err) => {
          setError('Failed to parse CSV file: ' + err.message);
        },
      });
    }
  };

  // Preview calculation
  const renderedPreview = useMemo(() => {
    if (broadcastMethod === 'custom') {
      if (!customMessage) return 'Your custom broadcast message will appear here.';
      if (targetSource === 'file') {
        const sample = uploadedRecords[previewRowIndex] || { restaurantName: '[Restaurant Name]', phone: '[Phone]' };
        let prev = customMessage;
        for (const [k, v] of Object.entries(sample)) {
          prev = prev.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
        }
        return prev;
      }
      return customMessage.replace(/\{\{name\}\}/g, 'there');
    }

    // Meta Template Preview
    if (!selectedMetaTemplate) return 'Select an approved Meta template to view preview.';
    let text = selectedMetaTemplate.body;

    const sample: Record<string, any> = targetSource === 'file' 
      ? uploadedRecords[previewRowIndex] || { restaurantName: 'The Royal Dine', phone: '919876543210' }
      : contacts[0] ? { name: contacts[0].name, restaurantName: contacts[0].name, phone: contacts[0].phone } : { name: 'Customer', restaurantName: 'Customer' };

    selectedMetaTemplate.variables.forEach((varNum) => {
      const mappedField = varMapping[varNum];
      let val = '';
      if (mappedField && sample[mappedField] !== undefined) {
        val = String(sample[mappedField]);
      } else if (mappedField) {
        val = mappedField; // static text value
      } else {
        val = `{{${varNum}}}`;
      }
      text = text.replace(new RegExp(`\\{\\{${varNum}\\}\\}`, 'g'), val);
    });

    return text;
  }, [broadcastMethod, customMessage, selectedMetaTemplate, targetSource, uploadedRecords, contacts, varMapping, previewRowIndex]);

  const handleSend = async () => {
    setError('');
    setStatus('');

    if (targetSource === 'file' && uploadedRecords.length === 0) {
      setError('Please upload an Excel or CSV file with valid contacts first.');
      return;
    }

    if (targetSource === 'contacts' && !selectAll && selectedIds.length === 0) {
      setError('Please select at least one contact to receive the broadcast.');
      return;
    }

    setSending(true);

    try {
      if (broadcastMethod === 'template') {
        if (!selectedMetaTemplate) {
          throw new Error('Please select an approved Meta template.');
        }

        const payload: any = {
          templateName: selectedMetaTemplate.name,
          languageCode: selectedMetaTemplate.language || 'en',
          headerFormat: selectedMetaTemplate.headerFormat,
          templateBody: selectedMetaTemplate.body,
          variableMapping: varMapping,
        };

        if (targetSource === 'file') {
          payload.contacts = uploadedRecords;
        } else {
          payload.conversationIds = selectAll ? [] : selectedIds;
        }

        const res = await fetch(`${API_URL}/api/admin/whatsapp/broadcast-template`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          let msg = data.error || 'Failed to broadcast template';
          try {
            if (typeof msg === 'string' && msg.startsWith('{')) {
              const parsed = JSON.parse(msg);
              msg = parsed.error?.error_data?.details || parsed.error?.message || msg;
            }
          } catch (_) {}
          throw new Error(msg);
        }
        setStatus(`Template broadcast complete: ${data.sent} sent successfully, ${data.failed} failed.`);
      } else {
        // Custom Freeform Broadcast
        if (!customMessage.trim()) {
          throw new Error('Please enter a message before sending.');
        }

        const url = targetSource === 'file'
          ? `${API_URL}/api/admin/whatsapp/broadcast-csv`
          : `${API_URL}/api/admin/whatsapp/broadcast`;

        const payload = targetSource === 'file'
          ? { templateText: customMessage.trim(), contacts: uploadedRecords }
          : { text: customMessage.trim(), conversationIds: selectAll ? [] : selectedIds };

        const res = await fetch(url, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Broadcast failed');
        setStatus(data.message || 'Custom broadcast sent successfully');
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Broadcast failed');
    } finally {
      setSending(false);
    }
  };

  const recipientCount = targetSource === 'file'
    ? uploadedRecords.length
    : selectAll ? contacts.length : selectedIds.length;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-2">WhatsApp Marketing</p>
        <h1 className="text-4xl font-black tracking-tighter">BROADCAST <span className="text-gold">MANAGER</span></h1>
        <p className="text-foreground/40 text-sm mt-2">
          Send Meta-approved WhatsApp templates & bulk campaigns to Excel/CSV audiences or active inbox contacts.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-3">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {status && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 flex items-center gap-3">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>{status}</span>
        </div>
      )}

      {/* Target Audience Source & Method Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recipient Source */}
        <div className="bg-card border border-foreground/10 rounded-2xl p-2 flex gap-2">
          <button
            onClick={() => setTargetSource('file')}
            className={`flex-1 py-2.5 px-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
              targetSource === 'file' ? 'bg-gold text-black shadow-md shadow-gold/20' : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <FileSpreadsheet size={16} /> Excel / CSV Upload
          </button>
          <button
            onClick={() => setTargetSource('contacts')}
            className={`flex-1 py-2.5 px-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
              targetSource === 'contacts' ? 'bg-gold text-black shadow-md shadow-gold/20' : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Layers size={16} /> Existing Contacts
          </button>
        </div>

        {/* Messaging Method */}
        <div className="bg-card border border-foreground/10 rounded-2xl p-2 flex gap-2">
          <button
            onClick={() => setBroadcastMethod('template')}
            className={`flex-1 py-2.5 px-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
              broadcastMethod === 'template' ? 'bg-gold text-black shadow-md shadow-gold/20' : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Sparkles size={16} /> Meta Approved Template
          </button>
          <button
            onClick={() => setBroadcastMethod('custom')}
            className={`flex-1 py-2.5 px-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
              broadcastMethod === 'custom' ? 'bg-gold text-black shadow-md shadow-gold/20' : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Megaphone size={16} /> Freeform Text
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
        {/* Main Compose Section */}
        <section className="bg-card border border-foreground/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
            <div className="flex items-center gap-3 text-gold text-sm font-black uppercase tracking-widest">
              {broadcastMethod === 'template' ? <Sparkles size={18} /> : <Megaphone size={18} />}
              {broadcastMethod === 'template' ? 'Meta Approved Template Setup' : 'Custom Message Compose'}
            </div>
            {selectedMetaTemplate && broadcastMethod === 'template' && (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {selectedMetaTemplate.status} • {selectedMetaTemplate.category}
              </span>
            )}
          </div>

          {/* File Upload Box (If target is file) */}
          {targetSource === 'file' && (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-foreground/15 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 relative hover:bg-foreground/5 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {fileName || 'Drop Excel (.xlsx, .xls) or CSV (.csv) file here'}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    Columns like &apos;phone&apos;, &apos;restaurantName&apos;, etc. will be auto-detected for variable mapping.
                  </p>
                </div>
              </div>

              {uploadedRecords.length > 0 && (
                <div className="flex items-center justify-between px-3 py-2 bg-foreground/5 rounded-xl text-xs">
                  <span className="text-foreground/70 font-medium">
                    Loaded <strong className="text-gold">{uploadedRecords.length}</strong> contacts from {fileName}
                  </span>
                  <span className="text-foreground/40 text-[11px]">
                    Detected {availableColumns.length} columns: {availableColumns.slice(0, 4).join(', ')}{availableColumns.length > 4 ? '...' : ''}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Template Selection Mode */}
          {broadcastMethod === 'template' ? (
            <div className="space-y-5">
              {/* Template Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">
                  Select Meta Approved Template ({metaTemplates.length} Available)
                </label>
                <select
                  value={selectedMetaTemplate?.name || ''}
                  onChange={(e) => {
                    const tpl = metaTemplates.find((t) => t.name === e.target.value);
                    if (tpl) handleSelectMetaTemplate(tpl);
                  }}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-sm font-medium outline-none focus:border-gold/40 text-foreground cursor-pointer"
                >
                  <option value="" className="bg-card text-foreground">-- Choose Meta Approved Template --</option>
                  {metaTemplates.map((tpl) => (
                    <option key={tpl.id} value={tpl.name} className="bg-card text-foreground">
                      {tpl.name} ({tpl.status} • {tpl.language} • {tpl.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Body Display */}
              {selectedMetaTemplate && (
                <div className="p-4 bg-background/60 border border-foreground/10 rounded-2xl space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-foreground/40">
                    Approved Template Body:
                  </p>
                  <p className="text-xs font-mono whitespace-pre-wrap text-foreground/80 leading-relaxed">
                    {selectedMetaTemplate.body}
                  </p>
                </div>
              )}

              {/* Dynamic Variable Mapping Card */}
              {selectedMetaTemplate && selectedMetaTemplate.variables.length > 0 && (
                <div className="p-5 bg-gold/5 border border-gold/20 rounded-2xl space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gold flex items-center gap-2">
                      <Sparkles size={14} /> Map Dynamic Variables ({selectedMetaTemplate.variables.length} Found)
                    </h3>
                    <p className="text-[11px] text-foreground/50 mt-1">
                      Choose which Excel column or contact field fills each template placeholder:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedMetaTemplate.variables.map((varNum) => (
                      <div key={varNum} className="space-y-1.5 bg-card p-3 rounded-xl border border-foreground/10">
                        <label className="text-xs font-bold text-foreground/70 flex items-center justify-between">
                          <span>Placeholder <strong className="text-gold font-mono">{`{{${varNum}}}`}</strong></span>
                          {varNum === '1' && <span className="text-[10px] text-gold/60">Typically Restaurant / Contact Name</span>}
                        </label>

                        {targetSource === 'file' && availableColumns.length > 0 ? (
                          <div className="flex gap-2">
                            <select
                              value={availableColumns.includes(varMapping[varNum]) ? varMapping[varNum] : 'custom_input'}
                              onChange={(e) => {
                                if (e.target.value !== 'custom_input') {
                                  setVarMapping((prev) => ({ ...prev, [varNum]: e.target.value }));
                                }
                              }}
                              className="flex-1 bg-foreground/5 border border-foreground/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-gold/40 cursor-pointer"
                            >
                              <option value="custom_input">Custom Static Text...</option>
                              {availableColumns.map((col) => (
                                <option key={col} value={col}>Column: {col}</option>
                              ))}
                            </select>

                            {(!availableColumns.includes(varMapping[varNum]) || varMapping[varNum] === '') && (
                              <input
                                value={varMapping[varNum] || ''}
                                onChange={(e) =>
                                  setVarMapping((prev) => ({ ...prev, [varNum]: e.target.value }))
                                }
                                placeholder="Static value"
                                className="w-28 bg-foreground/5 border border-foreground/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-gold/40"
                              />
                            )}
                          </div>
                        ) : (
                          <input
                            value={varMapping[varNum] || ''}
                            onChange={(e) =>
                              setVarMapping((prev) => ({ ...prev, [varNum]: e.target.value }))
                            }
                            placeholder={varNum === '1' ? 'restaurantName or recipient name' : `Value for {{${varNum}}}`}
                            className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-gold/40"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Custom Text Broadcast Mode */
            <div className="space-y-4">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={8}
                placeholder={
                  targetSource === 'file'
                    ? "Type custom message... Use {{restaurantName}}, {{phone}} to interpolate columns."
                    : "Type the broadcast message... Use {{name}} for recipient name."
                }
                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-sm outline-none focus:border-gold/40 resize-none font-sans leading-relaxed"
              />
            </div>
          )}

          {/* Send Broadcast Action Button */}
          <button
            onClick={handleSend}
            disabled={
              sending ||
              loading ||
              (targetSource === 'file' && uploadedRecords.length === 0) ||
              (targetSource === 'contacts' && !selectAll && selectedIds.length === 0) ||
              (broadcastMethod === 'template' && !selectedMetaTemplate) ||
              (broadcastMethod === 'custom' && !customMessage.trim())
            }
            className="w-full py-4 rounded-2xl bg-gold text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg shadow-gold/20 hover:scale-[1.01] active:scale-98 transition-all disabled:opacity-40 disabled:hover:scale-100"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {broadcastMethod === 'template' ? 'Send Approved Template Broadcast' : 'Send Custom Broadcast'} ({recipientCount} Recipients)
          </button>
        </section>

        {/* Right Sidebar: Live Preview & Contact List */}
        <aside className="space-y-6">
          {/* Live Rendered Preview Card */}
          <div className="bg-card border border-foreground/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">
                Live Message Preview
              </h3>
              {targetSource === 'file' && uploadedRecords.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                  <button
                    onClick={() => setPreviewRowIndex((prev) => Math.max(0, prev - 1))}
                    disabled={previewRowIndex === 0}
                    className="p-1 rounded hover:bg-foreground/10 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-mono text-[11px]">
                    Row {previewRowIndex + 1}/{uploadedRecords.length}
                  </span>
                  <button
                    onClick={() => setPreviewRowIndex((prev) => Math.min(uploadedRecords.length - 1, prev + 1))}
                    disabled={previewRowIndex >= uploadedRecords.length - 1}
                    className="p-1 rounded hover:bg-foreground/10 disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-background/80 rounded-2xl p-4 border border-foreground/5 shadow-inner">
              <p className="text-xs whitespace-pre-wrap leading-relaxed font-sans text-foreground/90">
                {renderedPreview}
              </p>
            </div>
            
            {selectedMetaTemplate && broadcastMethod === 'template' && (
              <div className="flex items-center gap-2 text-[11px] text-foreground/40 pt-1">
                <span>Language: <strong className="text-foreground/70">{selectedMetaTemplate.language}</strong></span>
                <span>•</span>
                <span>Status: <strong className="text-emerald-400">{selectedMetaTemplate.status}</strong></span>
              </div>
            )}
          </div>

          {/* Contact / Recipient Viewer Card */}
          <div className="bg-card border border-foreground/10 rounded-3xl p-6 space-y-4">
            {targetSource === 'file' ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">
                    Uploaded Audience
                  </h3>
                  <span className="text-xs font-bold text-gold">{uploadedRecords.length} Contacts</span>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                  {uploadedRecords.length === 0 ? (
                    <div className="p-8 text-center text-foreground/40 text-xs">
                      No file uploaded yet. Drop an Excel or CSV file to start.
                    </div>
                  ) : (
                    uploadedRecords.map((c, i) => (
                      <div
                        key={i}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left border transition-colors ${
                          i === previewRowIndex ? 'bg-gold/10 border-gold/30' : 'bg-foreground/5 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText size={14} className="text-gold flex-shrink-0" />
                          <div className="truncate">
                            <span className="block text-xs font-bold truncate">
                              {c.restaurantName || c.name || `Contact #${i + 1}`}
                            </span>
                            <span className="block text-[11px] text-foreground/40 font-mono">
                              {c.phone}
                            </span>
                          </div>
                        </div>
                        {i === previewRowIndex && (
                          <span className="text-[10px] font-bold text-gold uppercase px-1.5 py-0.5 rounded bg-gold/15">
                            Previewing
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">
                    Select Recipients
                  </h3>
                  <button
                    onClick={() => {
                      const next = !selectAll;
                      setSelectAll(next);
                      setSelectedIds(next ? contacts.map((c) => c._id) : []);
                    }}
                    className="text-xs font-bold text-gold uppercase hover:underline"
                  >
                    {selectAll ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1.5">
                  {loading ? (
                    <div className="p-6 text-center text-foreground/40 text-xs">Loading contacts...</div>
                  ) : contacts.length === 0 ? (
                    <div className="p-6 text-center text-foreground/40 text-xs">No contacts found in inbox.</div>
                  ) : (
                    contacts.map((c) => {
                      const checked = selectAll || selectedIds.includes(c._id);
                      return (
                        <button
                          key={c._id}
                          onClick={() => toggleContact(c._id)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-foreground/5 text-left transition-colors"
                        >
                          <div>
                            <span className="block text-xs font-bold">{c.name || 'Unknown'}</span>
                            <span className="block text-[11px] text-foreground/40 font-mono">{c.phone}</span>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            checked ? 'bg-gold border-gold text-black' : 'border-foreground/30'
                          }`}>
                            {checked && <CheckSquare size={12} className="text-black" />}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
