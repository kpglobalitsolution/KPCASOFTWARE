import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  GitCommit,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  FileText
} from 'lucide-react';

export const TransactionDnaModal: React.FC = () => {
  const { selectedDna, closeDnaViewer } = useApp();

  if (!selectedDna) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Transaction DNA & Traceability</h3>
                <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-700/40 px-2 py-0.5 rounded">
                  {selectedDna.entityType.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full lineage audit answering: <span className="text-slate-200 italic">&ldquo;Where did this number come from?&rdquo;</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeDnaViewer}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Summary Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Reference No</span>
              <span className="font-semibold text-slate-200">{selectedDna.referenceNo}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Origin Type</span>
              <span className="text-indigo-300 font-semibold">{selectedDna.source}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Double-Entry Journal</span>
              <span className="text-emerald-400 font-semibold">{selectedDna.journalVoucherNo || 'Auto-balanced'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">GST Category</span>
              <span className="text-amber-300 font-semibold">{selectedDna.gstReturnCategory || 'In Scope'}</span>
            </div>
          </div>

          {/* Connected System Pipeline Pills */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Connected Ecosystem Verification
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded border border-slate-700/60 bg-slate-800/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-medium text-slate-200">Stock Decremented</div>
                  <div className="text-[10px] text-slate-400">Warehouse inventory aligned</div>
                </div>
              </div>
              <div className="p-2.5 rounded border border-slate-700/60 bg-slate-800/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-medium text-slate-200">Double-Entry Ledger</div>
                  <div className="text-[10px] text-slate-400">Balanced debit & credit</div>
                </div>
              </div>
              <div className="p-2.5 rounded border border-slate-700/60 bg-slate-800/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-medium text-slate-200">Tally Connector</div>
                  <div className="text-[10px] text-slate-400">{selectedDna.tallyVoucherId || 'Queued for sync'}</div>
                </div>
              </div>
              <div className="p-2.5 rounded border border-slate-700/60 bg-slate-800/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-medium text-slate-200">Bank Reconciliation</div>
                  <div className="text-[10px] text-slate-400">{selectedDna.bankReconciliationStatus}</div>
                </div>
              </div>
              <div className="p-2.5 rounded border border-slate-700/60 bg-slate-800/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-medium text-slate-200">CA Review Lock</div>
                  <div className="text-[10px] text-slate-400">{selectedDna.caReviewStatus}</div>
                </div>
              </div>
              <div className="p-2.5 rounded border border-slate-700/60 bg-slate-800/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-medium text-slate-200">Single Source of Truth</div>
                  <div className="text-[10px] text-slate-400">Zero duplicate entries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Chronological Lineage Timeline */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Chronological Audit Lineage
            </h4>
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
              {selectedDna.lineage.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-1">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shrink-0 z-10">
                    <span className="text-[10px] font-mono font-bold text-indigo-300">{idx + 1}</span>
                  </div>
                  <div className="flex-1 bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{step.stage}</span>
                      <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">{step.description}</p>
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-2">
                      <span>Actor: <strong className="text-slate-300">{step.actor}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-800/20 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">DNA ID: {selectedDna.dnaId}</span>
          <button
            onClick={closeDnaViewer}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-md transition-colors"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
