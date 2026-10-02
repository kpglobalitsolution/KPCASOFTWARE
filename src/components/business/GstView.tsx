import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { GstMismatch } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, RefreshCw, Send, ArrowRight } from 'lucide-react';

export const GstView: React.FC = () => {
  const { gstMismatches, invoices, purchases, resolveGstMismatch, showToast, activeTenant } = useApp();

  type GstTab = 'overview' | 'gstr1' | 'gstr3b' | 'recon_2b' | 'einvoice';
  const [activeTab, setActiveTab] = useState<GstTab>('overview');

  // GSTR-1 metrics
  const b2bInvoices = invoices.filter((i) => i.customerGstin);
  const totalTaxableSales = invoices.reduce((s, i) => s + i.taxableAmount, 0);
  const totalOutputCgst = invoices.reduce((s, i) => s + i.totalCgst, 0);
  const totalOutputSgst = invoices.reduce((s, i) => s + i.totalSgst, 0);
  const totalOutputIgst = invoices.reduce((s, i) => s + i.totalIgst, 0);
  const totalOutputTax = totalOutputCgst + totalOutputSgst + totalOutputIgst;

  // GSTR-2B Input Tax Credit
  const totalItcAvailable = purchases.reduce((s, p) => s + p.totalCgst + p.totalSgst + p.totalIgst, 0);
  const netGstPayable = Math.max(0, totalOutputTax - totalItcAvailable);

  const mismatchColumns: Column<GstMismatch>[] = [
    {
      key: 'invoiceNumber',
      header: 'Supplier Bill #',
      render: (row) => <span className="font-mono font-semibold text-white">{row.invoiceNumber}</span>
    },
    {
      key: 'partyName',
      header: 'Supplier & GSTIN',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-200">{row.partyName}</div>
          <div className="text-[10px] font-mono text-slate-400">{row.partyGstin}</div>
        </div>
      )
    },
    {
      key: 'booksDate',
      header: 'Bill Date',
      render: (row) => <span className="font-mono text-slate-300">{formatDate(row.booksDate)}</span>
    },
    {
      key: 'booksTax',
      header: 'Tax in Books',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-semibold text-white tabular-nums">
          {formatCurrency(row.booksTax)}
        </span>
      )
    },
    {
      key: 'portalTax',
      header: 'Tax in GSTR-2B',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-semibold text-rose-400 tabular-nums">
          {row.portalTax ? formatCurrency(row.portalTax) : '₹0.00'}
        </span>
      )
    },
    {
      key: 'varianceAmount',
      header: 'ITC Variance',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-amber-400 tabular-nums">
          {formatCurrency(row.varianceAmount)}
        </span>
      )
    },
    {
      key: 'reason',
      header: 'Discrepancy Cause',
      render: (row) => (
        <span className="text-[10px] font-mono uppercase bg-rose-950 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded">
          {row.reason.replace(/_/g, ' ')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status === 'pending' ? (
            <button
              onClick={() => resolveGstMismatch(row.id)}
              className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
            >
              Resolve & Accept
            </button>
          ) : (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolved</span>
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
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>GST Compliance & E-Invoicing Center</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded">
              GSP CONNECTED: ADAPTER ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            GSTIN: <span className="font-mono text-slate-200 font-bold">{activeTenant.gstin}</span> · Filing Cadence: {activeTenant.settings.gstFilingFrequency.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              showToast('GSTR-2B Refreshed', 'Successfully fetched latest October auto-drafted ITC table from GSTN portal.', 'success');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Fetch GSTR-2B Portal Feed</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 text-xs">
        {[
          { key: 'overview', label: 'GST Dashboard & Liability' },
          { key: 'recon_2b', label: `GSTR-2B ITC Mismatch (${gstMismatches.filter((g) => g.status === 'pending').length})` },
          { key: 'gstr1', label: 'GSTR-1 Outward Summary' },
          { key: 'gstr3b', label: 'GSTR-3B Tax Offset' },
          { key: 'einvoice', label: 'E-Invoice & E-Way Bill' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as GstTab)}
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

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-xs text-slate-400">Total Output GST (Liability)</span>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {formatCurrency(totalOutputTax)}
              </div>
              <div className="text-[11px] text-slate-400">
                CGST: {formatCurrency(totalOutputCgst)} · SGST: {formatCurrency(totalOutputSgst)}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-xs text-slate-400">Input Tax Credit (GSTR-2B Eligible)</span>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {formatCurrency(totalItcAvailable)}
              </div>
              <div className="text-[11px] text-slate-400">Eligible to offset against outward supply</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-xs text-slate-400">Net Cash Payable via Challan</span>
              <div className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                {formatCurrency(netGstPayable)}
              </div>
              <div className="text-[11px] text-slate-400">Due date: 20th of next month (PMT-06)</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Authorized Tax Audit & Filing Notice
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              VyapaarOS connects directly to the authorized GST Suvidha Provider (GSP) environment. Books are locked and reviewed by your connected Chartered Accountant (KP Tax & Advisory) prior to formal return filing.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: 2B Reconciliation */}
      {activeTab === 'recon_2b' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Warning:</strong> Claiming Input Tax Credit for invoices missing in GSTR-2B violates GST Section 16(2)(aa). Contact suppliers to upload before the 11th.
              </span>
            </div>
          </div>

          <DataTable
            data={gstMismatches}
            columns={mismatchColumns}
            searchPlaceholder="Search invoice # or party GSTIN..."
            exportFileName="vyapaaros_gstr2b_mismatches"
          />
        </div>
      )}

      {/* Tab 3: GSTR-1 */}
      {activeTab === 'gstr1' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">GSTR-1 Outward Supply Summary (October 2024)</h3>
              <p className="text-[11px] text-slate-400">Table 4A (B2B Taxable Invoices with IRN / E-Invoice)</p>
            </div>
            <button
              onClick={() => showToast('JSON Exported', 'GSTR-1 government offline utility JSON generated.', 'success')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded"
            >
              Export GSTR-1 JSON
            </button>
          </div>

          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2">Table</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Invoices</th>
                <th className="py-2 text-right">Taxable Value</th>
                <th className="py-2 text-right">Total Tax (CGST+SGST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2.5 font-bold text-indigo-400 font-sans">4A, 4B</td>
                <td className="py-2.5 font-sans text-slate-200">B2B Regular Tax Invoices</td>
                <td className="py-2.5 text-right font-bold text-white">{invoices.length}</td>
                <td className="py-2.5 text-right font-bold text-white">{formatCurrency(totalTaxableSales)}</td>
                <td className="py-2.5 text-right font-bold text-emerald-400">{formatCurrency(totalOutputTax)}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-400 font-sans">7</td>
                <td className="py-2.5 font-sans text-slate-400">B2C Small Invoices</td>
                <td className="py-2.5 text-right text-slate-500">0</td>
                <td className="py-2.5 text-right text-slate-500">₹0.00</td>
                <td className="py-2.5 text-right text-slate-500">₹0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: GSTR-3B */}
      {activeTab === 'gstr3b' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs max-w-2xl">
          <h3 className="text-sm font-bold text-white">GSTR-3B Monthly Return Workpaper</h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="font-sans text-slate-300">3.1(a) Outward Taxable Supplies (Tax):</span>
              <span className="font-bold text-white">{formatCurrency(totalOutputTax)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="font-sans text-slate-300">4(A)(5) All Other Eligible ITC:</span>
              <span className="text-emerald-400 font-bold">{formatCurrency(totalItcAvailable)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-slate-700 bg-slate-850 px-3 rounded text-sm font-bold">
              <span className="font-sans text-slate-200">6.1 Payment of Tax (Cash Ledger):</span>
              <span className="text-amber-400">{formatCurrency(netGstPayable)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: E-Invoice Simulator */}
      {activeTab === 'einvoice' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-white">E-Invoice System (IRP Direct Generator)</h3>
            <p className="text-[11px] text-slate-400">Generates 64-character Invoice Reference Number (IRN) and signed QR code.</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-850 border border-slate-700/60 font-mono text-[11px] space-y-2">
            <div className="text-slate-400">Sample Live Generated IRN:</div>
            <div className="text-emerald-400 font-bold break-all bg-slate-900 p-2 rounded border border-slate-800">
              998877665544332211aabbccddeeff00112233445566778899aabbccddeeff00
            </div>
            <div className="text-slate-400 pt-2">E-Way Bill Status:</div>
            <div className="text-slate-200 font-semibold">Part-A & Part-B Generated (Vehicle No: GJ-01-BX-8820)</div>
          </div>
        </div>
      )}
    </div>
  );
};
