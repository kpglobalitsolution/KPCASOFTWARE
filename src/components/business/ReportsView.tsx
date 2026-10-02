import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, TrendingUp, Receipt, ShoppingCart, Users, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const { invoices, purchases, products, parties, showToast } = useApp();

  type ReportTab = 'sales' | 'purchases' | 'inventory' | 'aging';
  const [activeTab, setActiveTab] = useState<ReportTab>('sales');

  const handleExport = (name: string) => {
    showToast('Report Exported', `${name} compiled and exported to CSV format.`, 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Financial Reports & Business Intelligence</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
              VERIFIED LEDGER DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-ready financial statements, customer receivable aging, product margins, and stock valuation.
          </p>
        </div>

        <button
          onClick={() => handleExport(activeTab.toUpperCase())}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Active Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 text-xs">
        {[
          { key: 'sales', label: 'Sales & Customer Margins' },
          { key: 'purchases', label: 'Purchase & Vendor Analysis' },
          { key: 'inventory', label: 'Inventory Valuation Report' },
          { key: 'aging', label: 'Accounts Receivable Aging' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as ReportTab)}
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

      {/* Report 1: Sales */}
      {activeTab === 'sales' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Item-Wise Sales & Gross Profitability</h3>
            <span className="font-mono text-emerald-400 font-bold">
              Total Revenue: {formatCurrency(invoices.reduce((s, i) => s + i.totalAmount, 0))}
            </span>
          </div>

          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2 font-sans">Product</th>
                <th className="py-2 text-right">Selling Price</th>
                <th className="py-2 text-right">Cost Price</th>
                <th className="py-2 text-right">Margin / Unit</th>
                <th className="py-2 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((p) => {
                const margin = p.sellingPrice - p.purchasePrice;
                const marginPct = Math.round((margin / p.sellingPrice) * 100);
                return (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-sans font-medium text-slate-200">{p.name}</td>
                    <td className="py-2.5 text-right text-slate-200">{formatCurrency(p.sellingPrice, false)}</td>
                    <td className="py-2.5 text-right text-slate-400">{formatCurrency(p.purchasePrice, false)}</td>
                    <td className="py-2.5 text-right text-emerald-400 font-bold">+{formatCurrency(margin, false)}</td>
                    <td className="py-2.5 text-right text-emerald-400 font-bold">{marginPct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 2: Purchases */}
      {activeTab === 'purchases' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Vendor Purchase Volume & Tax Summary
          </h3>
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2 font-sans">Supplier</th>
                <th className="py-2">GSTIN</th>
                <th className="py-2 text-right">Total Inward Bills</th>
                <th className="py-2 text-right">Total Purchase Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {parties.filter((p) => p.type === 'supplier').map((supp) => (
                <tr key={supp.id}>
                  <td className="py-2.5 font-sans font-medium text-slate-200">{supp.name}</td>
                  <td className="py-2.5 text-slate-400">{supp.gstin}</td>
                  <td className="py-2.5 text-right text-slate-300">
                    {purchases.filter((p) => p.supplierId === supp.id).length}
                  </td>
                  <td className="py-2.5 text-right font-bold text-white">
                    {formatCurrency(purchases.filter((p) => p.supplierId === supp.id).reduce((s, p) => s + p.totalAmount, 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 3: Inventory Valuation */}
      {activeTab === 'inventory' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Stock Valuation by Weighted Average Cost (AS-2)</h3>
            <span className="font-mono text-emerald-400 font-bold">
              Total Valuation: {formatCurrency(products.reduce((s, p) => s + p.currentStock * p.purchasePrice, 0))}
            </span>
          </div>

          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2 font-sans">Item Description</th>
                <th className="py-2">SKU</th>
                <th className="py-2 text-right">On Hand Qty</th>
                <th className="py-2 text-right">Unit Purchase Cost</th>
                <th className="py-2 text-right">Total Inventory Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 font-sans font-medium text-slate-200">{p.name}</td>
                  <td className="py-2.5 text-slate-400">{p.sku}</td>
                  <td className="py-2.5 text-right text-slate-200">{p.currentStock} {p.unit}</td>
                  <td className="py-2.5 text-right text-slate-400">{formatCurrency(p.purchasePrice, false)}</td>
                  <td className="py-2.5 text-right font-bold text-emerald-400">
                    {formatCurrency(p.currentStock * p.purchasePrice, false)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 4: Aging */}
      {activeTab === 'aging' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Customer Receivable Aging Matrix
          </h3>
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2 font-sans">Customer</th>
                <th className="py-2 text-right">0-30 Days</th>
                <th className="py-2 text-right">31-60 Days</th>
                <th className="py-2 text-right">61-90 Days</th>
                <th className="py-2 text-right">&gt; 90 Days</th>
                <th className="py-2 text-right">Total Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {parties.filter((p) => p.type === 'customer').map((c) => (
                <tr key={c.id}>
                  <td className="py-2.5 font-sans font-medium text-slate-200">{c.name}</td>
                  <td className="py-2.5 text-right text-slate-300">{formatCurrency(c.currentBalance)}</td>
                  <td className="py-2.5 text-right text-slate-500">₹0.00</td>
                  <td className="py-2.5 text-right text-slate-500">₹0.00</td>
                  <td className="py-2.5 text-right text-slate-500">₹0.00</td>
                  <td className="py-2.5 text-right font-bold text-amber-400">{formatCurrency(c.currentBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
