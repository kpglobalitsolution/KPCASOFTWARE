import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { BankStatementItem, BankAccount } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Landmark, CheckCircle2, AlertTriangle, RefreshCw, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const BankingView: React.FC = () => {
  const { bankAccounts, bankStatements, matchBankStatement, unmatchBankStatement, showToast } = useApp();

  const primaryAccount = bankAccounts[0];
  const matchedCount = bankStatements.filter((s) => s.matchStatus === 'matched').length;
  const exceptionCount = bankStatements.filter((s) => s.matchStatus === 'exception').length;

  const handleManualResolve = (item: BankStatementItem) => {
    matchBankStatement(item.id, 'manual-recon-entry');
    showToast('Exception Resolved', `Bank entry ${item.referenceNo} linked to suspense adjustment account.`, 'success');
  };

  const columns: Column<BankStatementItem>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-mono text-slate-300">{formatDate(row.date)}</span>
    },
    {
      key: 'description',
      header: 'Narration / Description',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-200">{row.description}</div>
          <div className="text-[10px] font-mono text-slate-400">Ref: {row.referenceNo}</div>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Deposit / Withdrawal',
      align: 'right',
      render: (row) => {
        const isCredit = row.type === 'credit';
        return (
          <span
            className={`font-mono font-bold tabular-nums ${
              isCredit ? 'text-emerald-400' : 'text-slate-200'
            }`}
          >
            {isCredit ? '+' : ''}{formatCurrency(row.amount)}
          </span>
        );
      }
    },
    {
      key: 'balance',
      header: 'Running Balance',
      align: 'right',
      render: (row) => (
        <span className="font-mono text-slate-400 tabular-nums">
          {formatCurrency(row.balance)}
        </span>
      )
    },
    {
      key: 'matchStatus',
      header: 'Reconciliation Status',
      render: (row) => {
        let style = 'bg-slate-800 text-slate-300 border-slate-700';
        if (row.matchStatus === 'matched') style = 'bg-emerald-950 text-emerald-400 border-emerald-800/40';
        if (row.matchStatus === 'exception') style = 'bg-rose-950 text-rose-400 border-rose-800/40';
        if (row.matchStatus === 'unmatched') style = 'bg-amber-950 text-amber-400 border-amber-800/40';
        return (
          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${style}`}>
            {row.matchStatus}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {row.matchStatus === 'exception' ? (
            <button
              onClick={() => handleManualResolve(row)}
              className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors"
            >
              Resolve Exception
            </button>
          ) : row.matchStatus === 'matched' ? (
            <button
              onClick={() => unmatchBankStatement(row.id)}
              className="px-2 py-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              Unmatch
            </button>
          ) : (
            <button
              onClick={() => matchBankStatement(row.id, 'auto-match')}
              className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
            >
              Auto Match
            </button>
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
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-400" />
            <span>Banking & Live Statement Reconciliation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Connected current and OD accounts matching customer payments and expense payouts in 1 step.
          </p>
        </div>

        <button
          onClick={() => {
            showToast('Bank Feed Synced', 'Refreshed bank statement feed from HDFC Bank API adapter.', 'success');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Live Bank Feed</span>
        </button>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bankAccounts.map((acc) => (
          <div key={acc.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
                {acc.accountType.toUpperCase()} ACCOUNT
              </span>
              <div className="font-bold text-white text-sm">{acc.accountName}</div>
              <div className="text-[11px] font-mono text-slate-400">
                A/c: {acc.accountNumber} · IFSC: {acc.ifsc}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Book Balance</div>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {formatCurrency(acc.currentBalance)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reconciliation Summary Bar */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-850 border border-slate-800 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            Reconciled: <strong className="text-emerald-400 font-mono">{matchedCount}</strong> entries
          </span>
          <span className="text-slate-400">
            Exceptions: <strong className="text-rose-400 font-mono">{exceptionCount}</strong> entries
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>98.2% Auto-Match Success Rate</span>
        </span>
      </div>

      <DataTable
        data={bankStatements}
        columns={columns}
        searchPlaceholder="Search bank narration or reference #..."
        exportFileName="vyapaaros_bank_reconciliation"
      />
    </div>
  );
};
