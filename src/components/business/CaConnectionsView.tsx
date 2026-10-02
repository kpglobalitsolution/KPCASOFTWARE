import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link2, Briefcase, FileQuestion, Upload, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const CaConnectionsView: React.FC = () => {
  const { caConnections, caDocRequests, uploadCaDoc, showToast } = useApp();

  const handleUpload = (reqId: string) => {
    uploadCaDoc(reqId, 'Signed_Oct_Bank_Statement_HDFC.pdf');
    showToast('Document Transmitted', 'Signed Bank Statement uploaded and forwarded to CA Kailash Patel.', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Link2 className="w-5 h-5 text-indigo-400" />
              <span>Chartered Accountant (CA) Collaboration</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded">
              PRACTICE CONNECTED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-tenant access enabling your retained CA firm to audit double-entry ledgers, review GST 2B credits, and request compliance workpapers.
          </p>
        </div>
      </div>

      {/* Connected CA Firm Card */}
      {caConnections.map((conn) => (
        <div key={conn.id} className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4 text-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">{conn.caFirmName}</h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                  VERIFIED CA PRACTICE
                </span>
              </div>
              <div className="text-slate-400">
                Partner Lead: <strong className="text-slate-200">{conn.assignedStaff}</strong> · Connected Since {formatDate(conn.connectedSince)}
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-slate-400">
              <div>Last Books Audit: {formatDate(conn.lastReviewDate || '2024-09-30')}</div>
              <div className="text-emerald-400 font-semibold">ICAI Practice Reg: 124890W</div>
            </div>
          </div>

          {/* Scoped Permissions Granted */}
          <div className="p-3 rounded-lg bg-slate-850 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Scoped Permissions Granted by Business Owner:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Financial Books</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Post Adjustment Journals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>GSTR-1 & 3B Filing Audit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Notice Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Pending CA Document Requests */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <FileQuestion className="w-3.5 h-3.5 text-indigo-400" />
          Pending Compliance Document Requests ({caDocRequests.length})
        </h3>

        <div className="space-y-3">
          {caDocRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-xl border border-indigo-800/40 bg-indigo-950/20 text-xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{req.title}</span>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-900 px-2 py-0.5 rounded">
                    DUE: {formatDate(req.dueDate)}
                  </span>
                  {req.status === 'uploaded' && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                      UPLOADED: {req.uploadedFileName}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed max-w-xl">{req.description}</p>
              </div>

              {req.status !== 'uploaded' ? (
                <button
                  onClick={() => handleUpload(req.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors shrink-0 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              ) : (
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submitted to CA</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
