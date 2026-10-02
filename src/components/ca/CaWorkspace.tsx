import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { CaClientConnection, CaDocumentRequest, CaTaxNotice } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Briefcase,
  Users,
  CalendarCheck,
  ShieldCheck,
  BookOpen,
  FileQuestion,
  FileWarning,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Plus,
  Sparkles,
  Download,
  X
} from 'lucide-react';

export const CaWorkspace: React.FC = () => {
  const {
    caConnections,
    caDocRequests,
    taxNotices,
    gstMismatches,
    runMonthEndCheck,
    createCaDocRequest,
    showToast
  } = useApp();

  type CaTab = 'dashboard' | 'clients' | 'closing' | 'gst' | 'notices' | 'documents';
  const [activeTab, setActiveTab] = useState<CaTab>('dashboard');

  const [closingResult, setClosingResult] = useState<{
    passed: boolean;
    issues: string[];
    details: Record<string, any>;
  } | null>(null);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docDesc, setDocDesc] = useState('');

  const handleRunMonthEnd = () => {
    const res = runMonthEndCheck();
    setClosingResult(res);
    if (res.passed) {
      showToast('Month-End Check Passed', 'All double-entry ledgers, bank statements, and GST returns are balanced with zero discrepancies.', 'success');
    } else {
      showToast('Month-End Audit Completed', `Identified ${res.issues.length} audit exceptions requiring CA review before lock.`, 'warning');
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    createCaDocRequest({
      title: docTitle,
      description: docDesc,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    });

    setIsNewRequestOpen(false);
    setDocTitle('');
    setDocDesc('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-xs text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>CA Practice Management — KP Tax & Advisory</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
              CHARTERED ACCOUNTANT CONSOLE
            </span>
          </div>
          <p className="text-slate-400 mt-0.5">
            Audit-grade client bookkeeping, GST 2B reconciliation, statutory notice intelligence, and 1-click month-end closure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunMonthEnd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Run Month-End Check</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 text-xs">
        {[
          { key: 'dashboard', label: 'Practice Overview' },
          { key: 'clients', label: 'Client Portfolio' },
          { key: 'closing', label: '1-Click Month-End Close' },
          { key: 'gst', label: `GST 2B Audit (${gstMismatches.filter((g) => g.status === 'pending').length})` },
          { key: 'notices', label: `Notice Intelligence (${taxNotices.length})` },
          { key: 'documents', label: 'Document Exchange' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as CaTab)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Active Retained Clients</span>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {caConnections.length} Corporate Clients
              </div>
              <div className="text-[11px] text-slate-400">Direct ledger access enabled</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">GST ITC at Risk (2B Mismatch)</span>
              <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">
                {formatCurrency(2280)}
              </div>
              <div className="text-[11px] text-slate-400">1 supplier invoice missing on portal</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Statutory Tax Notices</span>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {taxNotices.length} Active Notice
              </div>
              <div className="text-[11px] text-slate-400">GST DRC-01A response drafting</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Audit Readiness Index</span>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                85 / 100
              </div>
              <div className="text-[11px] text-slate-400">Near closure for October 2024</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Connected Client Architecture
            </h3>
            <p className="text-slate-300 leading-relaxed">
              As a verified Chartered Accountant, you access real-time production ledgers without requesting manual Excel dumps or offline Tally backup archives.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Clients */}
      {activeTab === 'clients' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Client Portfolio & Permission Boundaries</h3>
          <div className="space-y-3">
            {caConnections.map((client) => (
              <div key={client.id} className="p-4 rounded-xl border border-slate-800 bg-slate-850 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{client.clientName}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                      LIVE ACCESS
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    GSTIN: <span className="font-mono text-slate-300">{client.clientGstin}</span> · Lead Staff: {client.assignedStaff}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    Last Books Review: {client.lastReviewDate}
                  </span>
                  <button
                    onClick={() => {
                      showToast('Client Books Opened', `Viewing live double-entry journals for ${client.clientName}.`, 'info');
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded text-xs transition-colors"
                  >
                    Open Client Books
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Month-End Close Engine */}
      {activeTab === 'closing' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">1-Click Month-End Close Engine</h3>
              <p className="text-[11px] text-slate-400">
                Audits Sales vs Output GST, Purchases vs GSTR-2B, Bank reconciliation variances, and unmapped Tally queues.
              </p>
            </div>
            <button
              onClick={handleRunMonthEnd}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-md transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>RUN MONTH-END CHECK</span>
            </button>
          </div>

          {closingResult ? (
            <div className="space-y-4 animate-in fade-in-20">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-850 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">
                    Audit Readiness Score: <span className="text-emerald-400 font-mono">{closingResult.details.auditReadinessScore}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Total Revenue: {formatCurrency(closingResult.details.totalSalesRevenue)} · Bank Balance: {formatCurrency(closingResult.details.bankBalance)}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold font-mono rounded ${
                    closingResult.passed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                      : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                  }`}
                >
                  {closingResult.passed ? 'PASSED — READY TO LOCK' : 'WARNING — ATTENTION REQUIRED'}
                </span>
              </div>

              {closingResult.issues.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-800/40 bg-amber-950/20 space-y-2">
                  <span className="font-bold text-amber-200 block text-xs">
                    Identified Exceptions Requiring Resolution Before Final Lock:
                  </span>
                  <div className="space-y-1 text-slate-300 text-xs">
                    {closingResult.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              Click &ldquo;RUN MONTH-END CHECK&rdquo; to execute the automated 14-point accounting diagnostic.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: GST 2B Audit */}
      {activeTab === 'gst' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">GSTR-2B Input Tax Credit Audit</h3>
          <div className="p-4 rounded-xl border border-rose-800/40 bg-rose-950/20 space-y-2">
            <span className="font-bold text-rose-200 block">Critical ITC Alert for Client:</span>
            <p className="text-slate-300 leading-relaxed">
              Bill SPM/OCT/011 (₹21,280) from Supreme Paper Mills is missing in the auto-drafted GSTR-2B table. Advise client to withhold tax payment of ₹2,280 until supplier uploads return.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Notice Intelligence */}
      {activeTab === 'notices' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Statutory Tax Notice Intelligence</h3>
          <div className="space-y-4">
            {taxNotices.map((notice) => (
              <div key={notice.id} className="p-5 rounded-xl border border-slate-800 bg-slate-850 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{notice.subject}</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/40">
                        DEMAND: {formatCurrency(notice.demandAmount)}
                      </span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      Ref: {notice.referenceNumber} · Authority: {notice.noticeAuthority} · Due: {formatDate(notice.responseDueDate)}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded">
                    {notice.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    AI Notice Extraction & Summary:
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">{notice.aiSummary}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => showToast('Response Drafted', 'Preliminary DRC-01A reply workpaper generated with reconciliation exhibit.', 'success')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded text-xs transition-colors"
                  >
                    Draft DRC-01A Response
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Document Exchange */}
      {activeTab === 'documents' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Client Document Requests & Audit Workpapers</h3>
              <p className="text-[11px] text-slate-400">Request signed bank statements, physical count sheets, or fixed asset invoices.</p>
            </div>
            <button
              onClick={() => setIsNewRequestOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Request Document</span>
            </button>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            {caDocRequests.map((req) => (
              <div key={req.id} className="p-3.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{req.title}</div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    Client: {req.clientName} · Due: {formatDate(req.dueDate)}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                    req.status === 'uploaded'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                      : 'bg-amber-950 text-amber-400 border-amber-800/40'
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Request Client Document</h3>
              <button onClick={() => setIsNewRequestOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. October Signed HDFC Bank Statement"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Audit Requirement Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Please provide signed copy for bank reconciliation closing."
                  value={docDesc}
                  onChange={(e) => setDocDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRequestOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-white"
                >
                  Send Request to Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
