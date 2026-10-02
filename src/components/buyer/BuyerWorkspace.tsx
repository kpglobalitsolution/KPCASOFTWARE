import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { ShoppingBag, Building, FileCheck, Truck, Receipt, CreditCard, Plus, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const BuyerWorkspace: React.FC = () => {
  const { purchaseOrders, purchases, parties, products, showToast } = useApp();

  type BuyerSubTab = 'overview' | 'suppliers' | 'orders' | 'receipts' | 'payables';
  const [subTab, setSubTab] = useState<BuyerSubTab>('overview');

  const suppliers = parties.filter((p) => p.type === 'supplier' || p.type === 'both');

  const handleSendRfq = (suppName: string) => {
    showToast('RFQ Transmitted', `Request for Quotation sent to ${suppName} with procurement spec sheet.`, 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-xs text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <span>Buyer Workspace — Procurement Operations</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
              TENANT: ABC TRADERS
            </span>
          </div>
          <p className="text-slate-400 mt-0.5">
            Procurement command center managing Supplier Discovery, RFQ comparison, Purchase Orders, and Goods Receipts (GRN).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('RFQ Prepared', 'New RFQ drafted for electronic distribution.', 'info')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create RFQ / Tender</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 text-xs">
        {[
          { key: 'overview', label: 'Procurement Dashboard' },
          { key: 'suppliers', label: 'Supplier Discovery & RFQ' },
          { key: 'orders', label: 'Purchase Orders' },
          { key: 'receipts', label: 'Goods Receipts (GRN)' },
          { key: 'payables', label: 'Invoices & Payables' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSubTab(tab.key as BuyerSubTab)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              subTab === tab.key
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Active Purchase Orders</span>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {purchaseOrders.length} Orders
              </div>
              <div className="text-[11px] text-slate-400">Total: {formatCurrency(purchaseOrders.reduce((s, p) => s + p.totalAmount, 0))}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Awaiting Delivery / GRN</span>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                1 Consignment
              </div>
              <div className="text-[11px] text-slate-400">In-transit from Global Wholesale</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Verified Payables Due</span>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {formatCurrency(purchases.reduce((s, p) => s + p.balanceDue, 0))}
              </div>
              <div className="text-[11px] text-slate-400">Within payment terms</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Connected B2B Supply Chain
            </h3>
            <p className="text-slate-300 leading-relaxed">
              When suppliers generate tax invoices on VyapaarOS, they populate directly into your Buyer Inward ledger with zero re-entry or manual transcription.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Supplier Discovery & RFQ */}
      {subTab === 'suppliers' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Verified B2B Suppliers Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((supp) => (
              <div key={supp.id} className="p-4 rounded-xl border border-slate-800 bg-slate-850 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{supp.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                      TIER-1 SUPPLIER
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    GSTIN: <span className="font-mono text-slate-300">{supp.gstin}</span> · {supp.billingAddress}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Rep: {supp.contactPerson} ({supp.phone})
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                  <button
                    onClick={() => handleSendRfq(supp.name)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Request Quotation (RFQ)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Purchase Orders */}
      {subTab === 'orders' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Issued Purchase Orders</h3>
          <div className="space-y-3 font-mono text-[11px]">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="p-3.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{po.poNumber}</div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    Supplier: {po.supplierName} · Date: {formatDate(po.date)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white text-sm">{formatCurrency(po.totalAmount)}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                    {po.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Receipts */}
      {subTab === 'receipts' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Goods Receipts & Inward Physical Inspections (GRN)</h3>
          <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 font-mono text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="font-sans font-semibold text-white">GRN-2024-089: 5x Smart 4K UHD LED TV 43&quot;</span>
                <div className="text-[10px] text-slate-400">PO Ref: SRM/PO/24-012 · Consignment received in Surat Hub</div>
              </div>
            </div>
            <span className="text-emerald-400 font-bold font-mono">100% QUALITY INSPECTED</span>
          </div>
        </div>
      )}

      {/* Tab 5: Payables */}
      {subTab === 'payables' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Supplier Invoices & Approved Payables</h3>
          <div className="space-y-3 font-mono text-[11px]">
            {purchases.map((pur) => (
              <div key={pur.id} className="p-3.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{pur.billNumber} (Supplier Inv #{pur.supplierInvoiceNumber})</div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    Payee: {pur.supplierName} · Due {formatDate(pur.dueDate)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white text-sm">{formatCurrency(pur.totalAmount)}</div>
                  <div className="text-[10px] text-amber-400">Due: {formatCurrency(pur.balanceDue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
