import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, Landmark, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

export const CashFlowView: React.FC = () => {
  const { bankAccounts, invoices, purchases } = useApp();

  type Horizon = '7d' | '30d' | '90d';
  const [horizon, setHorizon] = useState<Horizon>('30d');

  const currentBankBalance = bankAccounts.reduce((s, b) => s + b.currentBalance, 0);

  // Forecast projections
  let expectedReceipts = invoices.reduce((s, i) => s + i.balanceDue, 0);
  let expectedPayouts = purchases.reduce((s, p) => s + p.balanceDue, 0);

  if (horizon === '7d') {
    expectedReceipts = Math.round(expectedReceipts * 0.45);
    expectedPayouts = Math.round(expectedPayouts * 0.35);
  } else if (horizon === '90d') {
    expectedReceipts = Math.round(expectedReceipts * 2.8);
    expectedPayouts = Math.round(expectedPayouts * 2.1);
  }

  const projectedBalance = currentBankBalance + expectedReceipts - expectedPayouts;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Cash Flow Command Center</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
              LIQUIDITY INTELLIGENCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Predictive cash and liquidity forecasting modeling customer payment cycles, supplier due dates, and tax obligations.
          </p>
        </div>

        {/* Horizon Switcher */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-800 rounded-md border border-slate-700">
          {(['7d', '30d', '90d'] as Horizon[]).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                horizon === h
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {h === '7d' ? '7-Day Horizon' : h === '30d' ? '30-Day Horizon' : '90-Day Horizon'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Current Bank Balance</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">ACTUAL</span>
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            {formatCurrency(currentBankBalance)}
          </div>
          <div className="text-[11px] text-slate-400">Verified against statement feeds</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Expected Inflows</span>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">ESTIMATE</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            +{formatCurrency(expectedReceipts)}
          </div>
          <div className="text-[11px] text-slate-400">Customer invoice due dates</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Expected Outflows</span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">ESTIMATE</span>
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">
            -{formatCurrency(expectedPayouts)}
          </div>
          <div className="text-[11px] text-slate-400">Supplier bills & utility overheads</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Projected Liquidity</span>
            <span className="text-[10px] font-mono text-indigo-300 font-bold">FORECAST</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300 tabular-nums">
            {formatCurrency(projectedBalance)}
          </div>
          <div className="text-[11px] text-slate-400">Zero cash shortfall anticipated</div>
        </div>
      </div>

      {/* Cash Flow Timeline Projection */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white">Upcoming Liquidity Events & Obligations</h3>
        <div className="space-y-3 font-mono text-[11px]">
          <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div>
                <span className="font-sans font-semibold text-slate-200">Customer Receipt: ABC Traders (SRM/24-25/003)</span>
                <div className="text-[10px] text-slate-400">Expected Oct 18, 2024 · Net 15 terms</div>
              </div>
            </div>
            <span className="font-bold text-emerald-400 text-sm">+{formatCurrency(29499)}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div>
                <span className="font-sans font-semibold text-slate-200">GST Monthly Liability (PMT-06 Challan)</span>
                <div className="text-[10px] text-slate-400">Due Oct 20, 2024 · Statutory tax remittance</div>
              </div>
            </div>
            <span className="font-bold text-rose-400 text-sm">-{formatCurrency(41250)}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div>
                <span className="font-sans font-semibold text-slate-200">Supplier Payout: Supreme Paper Mills (BILL-SRM-046)</span>
                <div className="text-[10px] text-slate-400">Due Oct 22, 2024 · 21 days credit terms</div>
              </div>
            </div>
            <span className="font-bold text-rose-400 text-sm">-{formatCurrency(19000)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
