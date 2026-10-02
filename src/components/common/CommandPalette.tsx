import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Receipt,
  Users,
  Package,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Landmark,
  ShieldCheck,
  X
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    invoices,
    products,
    parties,
    ledgers,
    navigateTo,
    openDocumentViewer,
    retryAllTallyQueue,
    setIsAiModalOpen
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredInvoices = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
      i.customerName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase())
  );

  const filteredParties = parties.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.gstin && p.gstin.toLowerCase().includes(query.toLowerCase()))
  );

  const navigationActions = [
    { label: 'Today Command Center', path: '/business/today', icon: Landmark },
    { label: 'Sales & Tax Invoices', path: '/business/sales', icon: Receipt },
    { label: 'Purchase Bills & POs', path: '/business/purchases', icon: Receipt },
    { label: 'Live Inventory & Warehouses', path: '/business/inventory', icon: Package },
    { label: 'Tally Prime Sync Queue', path: '/business/tally', icon: RefreshCw },
    { label: 'GST Compliance & 2B Recon', path: '/business/gst', icon: ShieldCheck },
    { label: 'Cash Flow Command (7/30/90 Days)', path: '/business/cash-flow', icon: Landmark },
    { label: 'Universal Data Inbox (OCR)', path: '/business/data-inbox', icon: Receipt },
    { label: 'Document Designer', path: '/business/templates', icon: Package },
    { label: 'CA Collaboration Portal', path: '/ca/dashboard', icon: Users }
  ].filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-sm p-4 animate-in fade-in-20">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-800/40">
          <Search className="w-4 h-4 text-indigo-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, customer, invoice number, or product SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-white text-xs placeholder:text-slate-500 focus:outline-hidden"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick AI & Automation shortcut */}
          <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-700/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="font-semibold text-indigo-200">Ask AI Business Operator</span>
                <p className="text-[11px] text-slate-300">Run financial audits, summarize pending tasks, analyze profit margins</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCommandPaletteOpen(false);
                setIsAiModalOpen(true);
              }}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded transition-colors shrink-0"
            >
              Open AI
            </button>
          </div>

          {/* Quick Actions */}
          {navigationActions.length > 0 && (
            <div>
              <h5 className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Navigation & Views
              </h5>
              <div className="space-y-0.5">
                {navigationActions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        navigateTo(item.path);
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800 flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2 text-slate-200">
                        <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400" />
                        <span>{item.label}</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Invoices */}
          {filteredInvoices.length > 0 && (
            <div>
              <h5 className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Invoices ({filteredInvoices.length})
              </h5>
              <div className="space-y-0.5">
                {filteredInvoices.slice(0, 4).map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      openDocumentViewer('invoice', inv.id);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-mono text-slate-200 font-medium">{inv.invoiceNumber}</span>
                      <span className="text-slate-400">· {inv.customerName}</span>
                    </span>
                    <span className="font-mono text-slate-300 font-medium">
                      {formatCurrency(inv.totalAmount)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers & Suppliers */}
          {filteredParties.length > 0 && (
            <div>
              <h5 className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Parties & Contacts ({filteredParties.length})
              </h5>
              <div className="space-y-0.5">
                {filteredParties.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigateTo(p.type === 'supplier' ? '/business/suppliers' : '/business/customers');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-200 font-medium">{p.name}</span>
                      <span className="text-slate-400 text-[10px]">({p.type})</span>
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      Bal: {formatCurrency(p.currentBalance)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div>
              <h5 className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Catalog & Stock ({filteredProducts.length})
              </h5>
              <div className="space-y-0.5">
                {filteredProducts.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigateTo('/business/inventory');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-200 font-medium">{p.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">[{p.sku}]</span>
                    </span>
                    <span className="font-mono text-slate-300">
                      Stock: {p.currentStock} {p.unit}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-800/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1 bg-slate-700 rounded text-[10px]">↑</kbd> <kbd className="px-1 bg-slate-700 rounded text-[10px]">↓</kbd></span>
            <span>Select: <kbd className="px-1 bg-slate-700 rounded text-[10px]">Enter</kbd></span>
            <span>Close: <kbd className="px-1 bg-slate-700 rounded text-[10px]">Esc</kbd></span>
          </div>
          <span className="text-indigo-400 font-medium">VyapaarOS Universal Index</span>
        </div>
      </div>
    </div>
  );
};
