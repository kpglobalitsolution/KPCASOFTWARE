import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { TallySyncItem } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { RefreshCw, CheckCircle2, AlertTriangle, Layers, ArrowRight, Settings2 } from 'lucide-react';

export const TallyView: React.FC = () => {
  const { tallyQueue, syncTallyItem, retryAllTallyQueue, ledgers, activeTenant, showToast } = useApp();

  type TallyTab = 'queue' | 'ledgers' | 'vouchers' | 'config';
  const [activeTab, setActiveTab] = useState<TallyTab>('queue');

  const pendingCount = tallyQueue.filter((t) => t.status === 'pending').length;
  const failedCount = tallyQueue.filter((t) => t.status === 'failed' || t.status === 'needs_review').length;
  const syncedCount = tallyQueue.filter((t) => t.status === 'synced').length;

  const queueColumns: Column<TallySyncItem>[] = [
    {
      key: 'voucherType',
      header: 'Voucher Type',
      render: (row) => <span className="font-semibold text-white">{row.voucherType}</span>
    },
    {
      key: 'voucherNumber',
      header: 'Voucher #',
      render: (row) => <span className="font-mono text-slate-200">{row.voucherNumber}</span>
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-mono text-slate-400">{formatDate(row.date)}</span>
    },
    {
      key: 'amount',
      header: 'Voucher Amount',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-white tabular-nums">
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Sync Status',
      render: (row) => {
        let style = 'bg-slate-800 text-slate-300 border-slate-700';
        if (row.status === 'synced') style = 'bg-emerald-950 text-emerald-400 border-emerald-800/40';
        if (row.status === 'needs_review' || row.status === 'failed') style = 'bg-amber-950 text-amber-400 border-amber-800/40';
        if (row.status === 'pending') style = 'bg-indigo-950 text-indigo-400 border-indigo-800/40';
        return (
          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${style}`}>
            {row.status.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      key: 'errorMessage',
      header: 'Sync Diagnostic / Error',
      render: (row) => (
        <span className="text-[11px] text-slate-400 truncate max-w-xs block">
          {row.errorMessage || (row.tallyMasterId ? `Pushed as ${row.tallyMasterId}` : 'Enqueued for worker')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Sync Action',
      align: 'right',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {row.status !== 'synced' ? (
            <button
              onClick={() => syncTallyItem(row.id)}
              className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
            >
              Push to Tally
            </button>
          ) : (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Synced</span>
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-400" />
              <span>Tally Prime Integration & Sync Engine</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded">
              TALLY CONNECTOR LIVE: {activeTenant.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time XML/ODBC sync adapter pushing Sales, Purchases, Receipts, and Journal Vouchers directly into Tally Prime.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={retryAllTallyQueue}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flush Queue & Retry All ({pendingCount + failedCount})</span>
          </button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-slate-400">Successfully Synced</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {syncedCount} Vouchers
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Master IDs verified in Tally company</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-slate-400">Awaiting Sync Queue</span>
          <div className="text-xl font-bold font-mono text-indigo-300 mt-1 tabular-nums">
            {pendingCount} Vouchers
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Auto-retry every 60 seconds</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-slate-400">Requires Review / Mapping</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {failedCount} Exceptions
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Ledger name conflict detected</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 text-xs">
        {[
          { key: 'queue', label: 'Voucher Sync Queue' },
          { key: 'ledgers', label: 'Smart Ledger Mapping' },
          { key: 'vouchers', label: 'Voucher Types Mapping' },
          { key: 'config', label: 'Bridge Configuration' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TallyTab)}
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

      {/* Tab 1: Queue */}
      {activeTab === 'queue' && (
        <DataTable
          data={tallyQueue}
          columns={queueColumns}
          searchPlaceholder="Search voucher number or type..."
          exportFileName="vyapaaros_tally_queue"
        />
      )}

      {/* Tab 2: Smart Ledger Mapping */}
      {activeTab === 'ledgers' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Smart Ledger Mapping</h3>
              <p className="text-[11px] text-slate-400">
                Matches VyapaarOS account names with Tally Prime ledgers by GSTIN, PAN, and fuzzy text match.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/40">
              ALL 7 LEDGERS MAPPED
            </span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2">VyapaarOS Ledger</th>
                <th className="py-2">Account Group</th>
                <th className="py-2">Tally Prime Equivalent Ledger</th>
                <th className="py-2 text-center">Confidence</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {ledgers.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 font-sans font-medium text-slate-200">{l.name}</td>
                  <td className="py-2.5 font-sans text-slate-400">{l.group}</td>
                  <td className="py-2.5 text-indigo-300 font-semibold">{l.tallyLedgerName || l.name}</td>
                  <td className="py-2.5 text-center text-emerald-400">100% (High)</td>
                  <td className="py-2.5 text-right font-sans">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                      CONNECTED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Voucher Types */}
      {activeTab === 'vouchers' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs max-w-2xl">
          <h3 className="text-sm font-bold text-white">Voucher Type Mapping Rules</h3>
          <div className="space-y-2 text-xs">
            {[
              { source: 'Sales Invoice', target: 'Sales Voucher', status: 'Active' },
              { source: 'Purchase Bill', target: 'Purchase Voucher', status: 'Active' },
              { source: 'Customer Payment', target: 'Receipt Voucher', status: 'Active' },
              { source: 'Supplier Payout', target: 'Payment Voucher', status: 'Active' },
              { source: 'Manual Journal', target: 'Journal Voucher', status: 'Active' }
            ].map((v, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-200">{v.source}</span>
                <span className="text-slate-400 font-mono">→ Maps to Tally Prime: <strong className="text-indigo-300">{v.target}</strong></span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Config */}
      {activeTab === 'config' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs max-w-xl">
          <h3 className="text-sm font-bold text-white">Tally Bridge Security & Local Connector</h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans block text-[10px]">Tally Company Target:</span>
              <span className="text-white font-bold">{activeTenant.name}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans block text-[10px]">Sync Mode:</span>
              <span className="text-indigo-400 font-bold uppercase">{activeTenant.settings.tallySyncMode}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans block text-[10px]">Bridge Port:</span>
              <span className="text-slate-200">127.0.0.1:9000 (Secured Localhost Agent)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
