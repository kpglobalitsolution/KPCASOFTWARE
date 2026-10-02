import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building, Users, FileSpreadsheet, ShoppingBag, Truck, Receipt, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SupplierWorkspace: React.FC = () => {
  const { salesOrders, invoices, payments, parties, showToast } = useApp();

  type SupplierTab = 'overview' | 'orders' | 'deliveries' | 'invoices' | 'receivables';
  const [subTab, setSubTab] = useState<SupplierTab>('overview');

  const handleDispatch = (orderNo: string) => {
    showToast('Consignment Dispatched', `Delivery Challan DC-2024-041 created and dispatched for ${orderNo}.`, 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-xs text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-400" />
              <span>Supplier Workspace — Wholesale & Fulfillment</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
              TENANT: GLOBAL WHOLESALE DISTRIBUTORS LLP
            </span>
          </div>
          <p className="text-slate-400 mt-0.5">
            B2B vendor control center: manage buyer orders, generate delivery challans, and issue E-Invoices.
          </p>
        </div>

        <button
          onClick={() => showToast('Catalog Broadcast', 'Updated B2B price list transmitted to connected retail network.', 'success')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <span>Broadcast Catalog Updates</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 text-xs">
        {[
          { key: 'overview', label: 'Wholesale Overview' },
          { key: 'orders', label: 'Buyer Orders' },
          { key: 'deliveries', label: 'Delivery Challans' },
          { key: 'invoices', label: 'Tax Invoices' },
          { key: 'receivables', label: 'Receivables & Aging' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSubTab(tab.key as SupplierTab)}
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
              <span className="text-slate-400 text-xs">Incoming Retail Orders</span>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {salesOrders.length} Confirmed
              </div>
              <div className="text-[11px] text-slate-400">Total: {formatCurrency(salesOrders.reduce((s, o) => s + o.totalAmount, 0))}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Dispatches In-Transit</span>
              <div className="text-xl font-bold font-mono text-indigo-400 tabular-nums">
                2 Consignments
              </div>
              <div className="text-[11px] text-slate-400">Bhiwandi Hub logistics active</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">B2B Trade Receivables</span>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {formatCurrency(78498)}
              </div>
              <div className="text-[11px] text-slate-400">From connected retailers</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Connected Retail Network
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Wholesale dispatches from Global Wholesale Distributors LLP are instantly acknowledged by Shree Retail Mart with zero reconciliation delays.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {subTab === 'orders' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Incoming Buyer Purchase Orders</h3>
          <div className="space-y-3 font-mono text-[11px]">
            {salesOrders.map((o) => (
              <div key={o.id} className="p-3.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{o.orderNumber}</div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    Buyer: {o.customerName} · Expected Delivery: {formatDate(o.expectedDeliveryDate)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm">{formatCurrency(o.totalAmount)}</span>
                  <button
                    onClick={() => handleDispatch(o.orderNumber)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded text-xs transition-colors"
                  >
                    Generate Delivery Challan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Deliveries */}
      {subTab === 'deliveries' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Dispatched Delivery Challans</h3>
          <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 font-mono text-[11px] flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">DC-2024-041: Transporter VRL Logistics</div>
              <div className="text-[10px] text-slate-400">Vehicle: MH-04-AB-9922 · Destination: Ahmedabad Warehouse</div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
              DISPATCHED
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: Invoices */}
      {subTab === 'invoices' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Issued Wholesale Tax Invoices</h3>
          <div className="space-y-3 font-mono text-[11px]">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-3.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{inv.invoiceNumber}</div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    Customer: {inv.customerName} · Date: {formatDate(inv.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white text-sm">{formatCurrency(inv.totalAmount)}</div>
                  <div className="text-[10px] text-emerald-400">IRN: 9988...4433</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Receivables */}
      {subTab === 'receivables' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">B2B Customer Receivables & Outstanding Aging</h3>
          <div className="p-4 bg-slate-850 rounded-lg border border-slate-800 font-mono text-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-white font-sans text-sm">Shree Retail Mart Pvt Ltd</div>
              <div className="text-[11px] text-slate-400">Total Billed: ₹1,09,150 · Paid: ₹16,650</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-sans">Outstanding Due</span>
              <span className="text-sm font-bold text-amber-400 font-mono">₹92,500.00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
