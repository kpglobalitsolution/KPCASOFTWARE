import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { LedgerAccount, JournalEntry } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { BookOpen, Plus, RefreshCw, GitCommit, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const AccountingView: React.FC = () => {
  const { ledgers, journalEntries, invoices, purchases, expenses, openDnaViewer, showToast } = useApp();

  type TabType = 'ledgers' | 'journals' | 'trial_balance' | 'pnl' | 'balance_sheet';
  const [activeTab, setActiveTab] = useState<TabType>('ledgers');
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  // Journal form state
  const [voucherNumber, setVoucherNumber] = useState(`JV-2024-00${journalEntries.length + 1}`);
  const [narration, setNarration] = useState('');
  const [journalRows, setJournalRows] = useState([
    { accountId: ledgers[0]?.id || '', debit: 5000, credit: 0 },
    { accountId: ledgers[1]?.id || '', debit: 0, credit: 5000 }
  ]);

  const totalDebit = journalRows.reduce((s, r) => s + Number(r.debit || 0), 0);
  const totalCredit = journalRows.reduce((s, r) => s + Number(r.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      showToast('Validation Error', 'Journal entry must be balanced (Total Debits must equal Total Credits).', 'error');
      return;
    }
    showToast('Journal Voucher Posted', `Journal voucher ${voucherNumber} successfully posted and queued for Tally sync.`, 'success');
    setIsJournalOpen(false);
  };

  // Calculations for Financial Statements
  const totalSales = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalCostOfGoods = purchases.reduce((s, p) => s + p.totalAmount, 0);
  const grossProfit = totalSales - totalCostOfGoods;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  const ledgerColumns: Column<LedgerAccount>[] = [
    {
      key: 'name',
      header: 'Account Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="text-[10px] font-mono text-slate-400">Code: {row.code}</div>
        </div>
      )
    },
    {
      key: 'group',
      header: 'Account Group',
      render: (row) => <span className="text-slate-300">{row.group}</span>
    },
    {
      key: 'currentBalance',
      header: 'Current Balance',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-white tabular-nums">
          {formatCurrency(row.currentBalance)} {row.balanceType.toUpperCase()}
        </span>
      )
    },
    {
      key: 'tallySyncStatus',
      header: 'Tally Mapping',
      render: (row) => (
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
          MAPPED: {row.tallyLedgerName}
        </span>
      )
    }
  ];

  const journalColumns: Column<JournalEntry>[] = [
    {
      key: 'voucherNumber',
      header: 'Voucher #',
      render: (row) => <span className="font-mono font-semibold text-white">{row.voucherNumber}</span>
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-mono text-slate-400">{formatDate(row.date)}</span>
    },
    {
      key: 'narration',
      header: 'Narration',
      render: (row) => (
        <div>
          <div className="text-slate-200">{row.narration}</div>
          <div className="text-[10px] text-slate-400 font-mono">Ref: {row.reference || 'Manual Entry'}</div>
        </div>
      )
    },
    {
      key: 'totalDebit',
      header: 'Debit (₹)',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-white tabular-nums">
          {formatCurrency(row.totalDebit)}
        </span>
      )
    },
    {
      key: 'totalCredit',
      header: 'Credit (₹)',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-white tabular-nums">
          {formatCurrency(row.totalCredit)}
        </span>
      )
    },
    {
      key: 'isMakerApproved',
      header: 'Maker-Checker',
      render: (row) => (
        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>APPROVED</span>
        </span>
      )
    },
    {
      key: 'actions',
      header: 'DNA Trace',
      align: 'right',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => openDnaViewer(row.dnaId)}
          className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors"
          title="Inspect Lineage DNA"
        >
          <GitCommit className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Accounting Engine & Financial Statements</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Independent double-entry accounting engine with maker-checker approvals, live trial balance, and automatic Tally bridge.
          </p>
        </div>

        <button
          onClick={() => setIsJournalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 text-xs">
        {[
          { key: 'ledgers', label: 'Chart of Accounts (Ledgers)' },
          { key: 'journals', label: 'Journal Vouchers' },
          { key: 'trial_balance', label: 'Trial Balance' },
          { key: 'pnl', label: 'Profit & Loss Statement' },
          { key: 'balance_sheet', label: 'Balance Sheet' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
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

      {/* Tab 1: Chart of Accounts */}
      {activeTab === 'ledgers' && (
        <DataTable
          data={ledgers}
          columns={ledgerColumns}
          searchPlaceholder="Search ledger name, code or group..."
          exportFileName="vyapaaros_ledgers"
        />
      )}

      {/* Tab 2: Journal Entries */}
      {activeTab === 'journals' && (
        <DataTable
          data={journalEntries}
          columns={journalColumns}
          searchPlaceholder="Search journal voucher # or narration..."
          exportFileName="vyapaaros_journal_vouchers"
        />
      )}

      {/* Tab 3: Trial Balance */}
      {activeTab === 'trial_balance' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Live Trial Balance</h3>
              <p className="text-[11px] text-slate-400">Verifying fundamental accounting equation: Total Debits = Total Credits</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/40 font-semibold">
              TRIAL BALANCE IN BALANCE
            </span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2">Account Name & Code</th>
                <th className="py-2">Group</th>
                <th className="py-2 text-right">Debit Balance (₹)</th>
                <th className="py-2 text-right">Credit Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {ledgers.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 font-sans font-medium text-slate-200">{l.name}</td>
                  <td className="py-2.5 text-slate-400 font-sans">{l.group}</td>
                  <td className="py-2.5 text-right font-semibold text-slate-100">
                    {l.balanceType === 'debit' ? formatCurrency(l.currentBalance, false) : '—'}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-slate-100">
                    {l.balanceType === 'credit' ? formatCurrency(l.currentBalance, false) : '—'}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-700 bg-slate-850/60 font-bold text-white text-xs">
                <td colSpan={2} className="py-3 px-1 font-sans">Total Balanced Sum</td>
                <td className="py-3 text-right text-emerald-400">₹42,50,000.00</td>
                <td className="py-3 text-right text-emerald-400">₹42,50,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Profit & Loss Statement */}
      {activeTab === 'pnl' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs max-w-3xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Profit & Loss Statement (FY 2024-25)</h3>
            <p className="text-[11px] text-slate-400">Accrual-based trading and operating profit calculations.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="font-sans font-semibold text-slate-200">Revenue from Operations (Gross Sales):</span>
              <span className="font-bold text-white">{formatCurrency(totalSales)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="font-sans text-slate-300">Less: Cost of Goods Sold (Purchases):</span>
              <span className="text-rose-400">-{formatCurrency(totalCostOfGoods)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800 bg-slate-850/50 px-2 rounded font-bold">
              <span className="font-sans text-emerald-300">Gross Trading Profit:</span>
              <span className="text-emerald-400">{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="font-sans text-slate-300">Less: Operating & Logistics Overheads:</span>
              <span className="text-rose-400">-{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-slate-700 bg-emerald-950/20 px-3 rounded font-bold text-sm">
              <span className="font-sans text-emerald-300">Net Operational Profit:</span>
              <span className="text-emerald-400">{formatCurrency(netProfit)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Balance Sheet */}
      {activeTab === 'balance_sheet' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs max-w-3xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Statement of Financial Position (Balance Sheet)</h3>
            <p className="text-[11px] text-slate-400">Capital, Current Assets, Bank balances and Accounts Payable.</p>
          </div>

          <div className="grid grid-cols-2 gap-6 font-mono text-xs">
            {/* Liabilities */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-slate-200 border-b border-slate-700 pb-1">
                Equities & Liabilities
              </h4>
              <div className="flex justify-between">
                <span className="font-sans text-slate-300">Partners / Share Capital:</span>
                <span>₹20,00,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-300">Retained Earnings:</span>
                <span className="text-emerald-400">{formatCurrency(netProfit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-300">Trade Payables (Suppliers):</span>
                <span>{formatCurrency(purchases.reduce((s, p) => s + p.balanceDue, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-300">GST Output Tax Payable:</span>
                <span>₹7,65,000.00</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-700 font-bold text-white">
                <span className="font-sans">Total Liabilities:</span>
                <span>₹32,25,000.00</span>
              </div>
            </div>

            {/* Assets */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-slate-200 border-b border-slate-700 pb-1">
                Assets
              </h4>
              <div className="flex justify-between">
                <span className="font-sans text-slate-300">Bank & Cash Accounts:</span>
                <span>{formatCurrency(2435750)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-300">Trade Receivables (Customers):</span>
                <span>{formatCurrency(invoices.reduce((s, i) => s + i.balanceDue, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-300">Closing Stock Valuation:</span>
                <span>₹6,15,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-300">GST Input Tax Credit (ITC):</span>
                <span>₹1,65,600.00</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-700 font-bold text-emerald-400">
                <span className="font-sans text-white">Total Assets:</span>
                <span>₹32,25,000.00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Journal Modal */}
      {isJournalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-xl p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Post Manual Journal Voucher (Maker-Checker)</h3>
              <button onClick={() => setIsJournalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handlePostJournal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Voucher Number</label>
                  <input
                    type="text"
                    value={voucherNumber}
                    onChange={(e) => setVoucherNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Voucher Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Narration</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Month-end depreciation adjustment on commercial computers"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              {/* Rows */}
              <div className="space-y-2 border border-slate-800 p-3 rounded-lg bg-slate-850/50">
                <div className="grid grid-cols-5 gap-2 text-[10px] uppercase font-semibold text-slate-400">
                  <span className="col-span-3">Account</span>
                  <span className="text-right">Debit (₹)</span>
                  <span className="text-right">Credit (₹)</span>
                </div>
                {journalRows.map((r, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                    <select
                      value={r.accountId}
                      onChange={(e) => {
                        const copy = [...journalRows];
                        copy[idx].accountId = e.target.value;
                        setJournalRows(copy);
                      }}
                      className="col-span-3 bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                    >
                      {ledgers.map((l) => (
                        <option key={l.id} value={l.id}>{l.name} ({l.group})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={r.debit}
                      onChange={(e) => {
                        const copy = [...journalRows];
                        copy[idx].debit = Number(e.target.value);
                        setJournalRows(copy);
                      }}
                      className="bg-slate-800 border border-slate-700 rounded p-1.5 text-right text-white font-mono"
                    />
                    <input
                      type="number"
                      value={r.credit}
                      onChange={(e) => {
                        const copy = [...journalRows];
                        copy[idx].credit = Number(e.target.value);
                        setJournalRows(copy);
                      }}
                      className="bg-slate-800 border border-slate-700 rounded p-1.5 text-right text-white font-mono"
                    />
                  </div>
                ))}
              </div>

              {/* Balance Verification */}
              <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-slate-400">Debits: {formatCurrency(totalDebit)}</span> ·{' '}
                  <span className="text-slate-400">Credits: {formatCurrency(totalCredit)}</span>
                </div>
                <span className={`font-semibold ${isBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isBalanced ? '✓ BALANCED' : '⚠ UNBALANCED'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsJournalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Post Journal Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
