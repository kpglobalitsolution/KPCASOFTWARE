import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Receipt,
  ShoppingCart,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  GitCommit
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const {
    invoices,
    purchases,
    products,
    parties,
    bankAccounts,
    tallyQueue,
    gstMismatches,
    caDocRequests,
    navigateTo,
    openDnaViewer,
    openDocumentViewer,
    setIsQuickCreateOpen
  } = useApp();

  // Metrics
  const totalSales = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalPurchases = purchases.reduce((s, p) => s + p.totalAmount, 0);
  const totalReceivables = parties
    .filter((p) => p.type === 'customer' || p.type === 'both')
    .reduce((s, p) => s + Math.max(0, p.currentBalance), 0);
  const totalPayables = parties
    .filter((p) => p.type === 'supplier' || p.type === 'both')
    .reduce((s, p) => s + Math.max(0, p.currentBalance), 0);

  const bankBalance = bankAccounts.reduce((s, b) => s + b.currentBalance, 0);
  const lowStockCount = products.filter((p) => p.currentStock <= p.reorderLevel).length;
  const pendingTallyCount = tallyQueue.filter((t) => t.status === 'pending' || t.status === 'failed').length;
  const pendingGstCount = gstMismatches.filter((g) => g.status === 'pending').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Operational Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-tight">Executive Business Overview</span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              SINGLE SOURCE OF TRUTH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time financial synchronization across sales, stock, double-entry ledgers, Tally Prime, and GST portal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('/business/today')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 rounded-md transition-colors"
          >
            <span>Today Command Center</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsQuickCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
          >
            <span>+ Quick Transaction</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Sales */}
        <div
          onClick={() => navigateTo('/business/sales')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Sales Revenue</span>
            <Receipt className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-2 tabular-nums">
            {formatCurrency(totalSales)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.8% vs last month</span>
          </div>
        </div>

        {/* Purchases */}
        <div
          onClick={() => navigateTo('/business/purchases')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Purchases</span>
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-2 tabular-nums">
            {formatCurrency(totalPurchases)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {purchases.length} bills entered & inwarded
          </div>
        </div>

        {/* Customer Receivables */}
        <div
          onClick={() => navigateTo('/business/customers')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Receivables (Outstanding)</span>
            <ArrowDownLeft className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-2 tabular-nums">
            {formatCurrency(totalReceivables)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            3 customer accounts active
          </div>
        </div>

        {/* Bank & Cash Balance */}
        <div
          onClick={() => navigateTo('/business/banking')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Bank & Cash Reserve</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
            {formatCurrency(bankBalance)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            HDFC & SBI OD connected
          </div>
        </div>
      </div>

      {/* Secondary Operational Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-850/60 border border-slate-800 text-xs">
        <div
          onClick={() => navigateTo('/business/inventory')}
          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <div className={`p-2 rounded-lg ${lowStockCount > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">{lowStockCount} Low Stock Items</div>
            <div className="text-[11px] text-slate-400">Reorder thresholds triggered</div>
          </div>
        </div>

        <div
          onClick={() => navigateTo('/business/tally')}
          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <div className={`p-2 rounded-lg ${pendingTallyCount > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">{pendingTallyCount} Tally Vouchers</div>
            <div className="text-[11px] text-slate-400">{pendingTallyCount === 0 ? 'Fully synchronized' : 'Awaiting sync dispatch'}</div>
          </div>
        </div>

        <div
          onClick={() => navigateTo('/business/gst')}
          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <div className={`p-2 rounded-lg ${pendingGstCount > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">{pendingGstCount} GST 2B Exceptions</div>
            <div className="text-[11px] text-slate-400">Input tax variance detected</div>
          </div>
        </div>

        <div
          onClick={() => navigateTo('/business/ca-connections')}
          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">KP Tax & Advisory</div>
            <div className="text-[11px] text-slate-400">CA Connected · 1 Doc Pending</div>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Invoices & Live Connected Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices with DNA Drilldown */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Sales Invoices</h3>
              <p className="text-xs text-slate-400">Every invoice connects directly to ledgers, stock, and Tally.</p>
            </div>
            <button
              onClick={() => navigateTo('/business/sales')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <span>View All Invoices</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {invoices.slice(0, 5).map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between hover:bg-slate-850/40 px-2 rounded-lg transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-white">{inv.invoiceNumber}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        inv.status === 'paid'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : inv.status === 'partially_paid'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {inv.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-2 text-[11px]">
                    <span className="text-slate-200 font-medium">{inv.customerName}</span>
                    <span>·</span>
                    <span>{formatDate(inv.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono font-bold text-white">{formatCurrency(inv.totalAmount)}</div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Bal: {formatCurrency(inv.balanceDue)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openDnaViewer(inv.dnaId)}
                      className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/50 rounded transition-colors"
                      title="Inspect Transaction DNA"
                    >
                      <GitCommit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDocumentViewer('invoice', inv.id)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Zero Re-entry Flow Highlights */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Zero Re-Entry Architecture</h3>
            <p className="text-xs text-slate-400">Data entered once updates all linked modules automatically.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-850 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span>Quotation → Order → Invoice</span>
                <span className="text-[10px] font-mono text-emerald-400">100% AUTOMATED</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Accepted Quotation SRM/QT/24-089 was converted into Sales Order SO-2024-001 and Invoice SRM/24-25/001 with zero duplicate typing.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-850 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span>OCR Bill → Purchase Inward</span>
                <span className="text-[10px] font-mono text-indigo-400">AI EXTRACTED</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Supreme Paper Mills WhatsApp bill extracted with 96% confidence score into draft purchase ledger.
              </p>
              <button
                onClick={() => navigateTo('/business/data-inbox')}
                className="text-indigo-400 hover:text-indigo-300 font-medium text-[11px] flex items-center gap-1"
              >
                <span>Review in Data Inbox</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-850 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span>Payment → Bank Reconciliation</span>
                <span className="text-[10px] font-mono text-emerald-400">RECONCILED</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                HDFC NEFT receipt of ₹20,000 matched automatically with statement item HDFCN2410029981.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
