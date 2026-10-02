import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  AlertTriangle,
  Receipt,
  ShoppingCart,
  ArrowDownLeft,
  CreditCard,
  RefreshCw,
  ShieldAlert,
  Package,
  FileQuestion,
  Landmark,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const TodayView: React.FC = () => {
  const {
    invoices,
    purchases,
    payments,
    products,
    tallyQueue,
    gstMismatches,
    caDocRequests,
    bankStatements,
    navigateTo,
    retryAllTallyQueue,
    resolveGstMismatch,
    openDocumentViewer,
    showToast
  } = useApp();

  const todayStr = '2024-10-02'; // simulation reference date
  const todayInvoices = invoices.filter((i) => i.date === todayStr);
  const todaySalesAmount = todayInvoices.reduce((s, i) => s + i.totalAmount, 0);

  const todayPurchases = purchases.filter((p) => p.date === todayStr);
  const todayPurchasesAmount = todayPurchases.reduce((s, p) => s + p.totalAmount, 0);

  const todayCollections = payments
    .filter((p) => p.date === todayStr && p.type === 'customer_payment')
    .reduce((s, p) => s + p.amount, 0);

  // Issues requiring attention
  const overdueInvoices = invoices.filter((i) => i.status === 'sent' && new Date(i.dueDate) < new Date());
  const lowStockItems = products.filter((p) => p.currentStock <= p.reorderLevel);
  const failedTallyVouchers = tallyQueue.filter((t) => t.status === 'failed' || t.status === 'needs_review');
  const unresolvedGst = gstMismatches.filter((g) => g.status === 'pending');
  const pendingCaDocs = caDocRequests.filter((d) => d.status === 'requested');
  const bankExceptions = bankStatements.filter((s) => s.matchStatus === 'exception');

  const totalUrgentCount =
    overdueInvoices.length +
    lowStockItems.length +
    failedTallyVouchers.length +
    unresolvedGst.length +
    pendingCaDocs.length +
    bankExceptions.length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight">Today Command Center</h1>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
              {totalUrgentCount} ACTION ITEMS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immediate operational dashboard showing collections, low stock alerts, Tally errors, and GST variances with instant &ldquo;Fix Now&rdquo; workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              retryAllTallyQueue();
              showToast('Auto-Fix Run', 'Retried sync for all pending accounting queues.', 'success');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>One-Click Flush All Queues</span>
          </button>
        </div>
      </div>

      {/* Today Real-Time Velocity Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span>Today&apos;s Sales</span>
            <Receipt className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-2 tabular-nums">
            {formatCurrency(todaySalesAmount)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{todayInvoices.length} invoices generated</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span>Today&apos;s Purchases</span>
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-2 tabular-nums">
            {formatCurrency(todayPurchasesAmount)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{todayPurchases.length} bills entered</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span>Today&apos;s Collections</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-2 tabular-nums">
            {formatCurrency(todayCollections)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Bank NEFT & UPI QR received</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span>Due Within 7 Days</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-300 mt-2 tabular-nums">
            {formatCurrency(29499)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">1 invoice due next week</div>
        </div>
      </div>

      {/* Urgent Operational Issues Requiring Attention (with FIX NOW buttons) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Immediate Action List ({totalUrgentCount} items)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Issue 1: Tally Sync Error */}
          {failedTallyVouchers.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-amber-800/40 bg-amber-950/20 text-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-200 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    Tally Prime Sync Failure
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 uppercase bg-amber-950 px-2 py-0.5 rounded border border-amber-800/40">
                    NEEDS REVIEW
                  </span>
                </div>
                <div className="font-mono text-slate-200">{item.voucherType} Voucher: {item.voucherNumber} ({formatCurrency(item.amount)})</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {item.errorMessage || 'Ledger mapping required between VyapaarOS and Tally company.'}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-800/30">
                <button
                  onClick={() => navigateTo('/business/tally')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1"
                >
                  <span>FIX NOW</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Issue 2: GST 2B Discrepancy */}
          {unresolvedGst.map((m) => (
            <div key={m.id} className="p-4 rounded-xl border border-rose-800/40 bg-rose-950/20 text-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    GSTR-2B Input Tax Credit Missing
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 uppercase bg-rose-950 px-2 py-0.5 rounded border border-rose-800/40">
                    TAX AT RISK
                  </span>
                </div>
                <div className="font-mono text-slate-200">{m.partyName} · Bill {m.invoiceNumber}</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Vendor did not upload Invoice to GST portal. Variance of {formatCurrency(m.varianceAmount)} cannot be claimed in GSTR-3B without vendor filing.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-800/30">
                <button
                  onClick={() => resolveGstMismatch(m.id)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs transition-colors flex items-center gap-1"
                >
                  <span>RESOLVE & NOTIFY SUPPLIER</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Issue 3: Low Stock Reorder */}
          {lowStockItems.map((prod) => (
            <div key={prod.id} className="p-4 rounded-xl border border-slate-700 bg-slate-850/60 text-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    Stock Below Reorder Level
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">
                    STOCK: {prod.currentStock} {prod.unit}
                  </span>
                </div>
                <div className="font-medium text-white">{prod.name} (SKU: {prod.sku})</div>
                <p className="text-slate-400 text-[11px]">
                  Current stock ({prod.currentStock} {prod.unit}) is below reorder threshold of {prod.reorderLevel} {prod.unit}.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/50">
                <button
                  onClick={() => navigateTo('/business/purchases')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1"
                >
                  <span>CREATE PURCHASE ORDER</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Issue 4: Bank Statement Exception */}
          {bankExceptions.map((stmt) => (
            <div key={stmt.id} className="p-4 rounded-xl border border-slate-700 bg-slate-850/60 text-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-rose-400" />
                    Unreconciled Bank Withdrawal
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800/40">
                    BANK EXCEPTION
                  </span>
                </div>
                <div className="font-mono text-slate-200">{stmt.description} ({formatCurrency(Math.abs(stmt.amount))})</div>
                <p className="text-slate-400 text-[11px]">
                  Debit entry on {formatDate(stmt.date)} has no matching voucher or payment receipt in books.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/50">
                <button
                  onClick={() => navigateTo('/business/banking')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1"
                >
                  <span>RECONCILE ENTRY</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Issue 5: CA Document Request */}
          {pendingCaDocs.map((req) => (
            <div key={req.id} className="p-4 rounded-xl border border-indigo-800/40 bg-indigo-950/20 text-xs flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-200 flex items-center gap-1.5">
                    <FileQuestion className="w-3.5 h-3.5 text-indigo-400" />
                    CA Document Request Pending
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-900 px-2 py-0.5 rounded">
                    DUE: {formatDate(req.dueDate)}
                  </span>
                </div>
                <div className="font-semibold text-white">{req.title}</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{req.description}</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-800/30">
                <button
                  onClick={() => navigateTo('/business/ca-connections')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1"
                >
                  <span>UPLOAD DOCUMENT</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
