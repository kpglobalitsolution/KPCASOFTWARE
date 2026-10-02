import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { PurchaseInvoice, LineItem } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, ArrowDownLeft, GitCommit, FileText, X } from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const {
    purchases,
    parties,
    products,
    createPurchaseInvoice,
    openDnaViewer
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [selectedSupplierId, setSelectedSupplierId] = useState(
    parties.find((p) => p.type === 'supplier')?.id || parties[0]?.id || ''
  );
  const [supplierInvoiceNumber, setSupplierInvoiceNumber] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(5);
  const [rate, setRate] = useState(products[0]?.purchasePrice || 1000);

  const selectedSupplier = parties.find((p) => p.id === selectedSupplierId);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;

    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const taxable = quantity * rate;
    const tax = taxable * (prod.taxRate / 100);
    const total = taxable + tax;

    const items: LineItem[] = [
      {
        id: `pur-it-${Date.now()}`,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        hsnCode: prod.hsnCode,
        quantity: Number(quantity),
        unit: prod.unit,
        rate: Number(rate),
        discountPercent: 0,
        taxableValue: taxable,
        taxRate: prod.taxRate,
        cgst: tax / 2,
        sgst: tax / 2,
        igst: 0,
        total
      }
    ];

    createPurchaseInvoice({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierGstin: selectedSupplier.gstin,
      supplierInvoiceNumber: supplierInvoiceNumber || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: billDate,
      dueDate,
      items,
      totalAmount: total
    });

    setIsCreateOpen(false);
  };

  const columns: Column<PurchaseInvoice>[] = [
    {
      key: 'billNumber',
      header: 'Bill #',
      render: (row) => <span className="font-mono font-semibold text-white">{row.billNumber}</span>
    },
    {
      key: 'supplierInvoiceNumber',
      header: 'Supplier Ref',
      render: (row) => <span className="font-mono text-slate-300">{row.supplierInvoiceNumber}</span>
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-mono text-slate-400">{formatDate(row.date)}</span>
    },
    {
      key: 'supplierName',
      header: 'Supplier',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-200">{row.supplierName}</div>
          <div className="text-[10px] font-mono text-slate-400">{row.supplierGstin}</div>
        </div>
      )
    },
    {
      key: 'totalAmount',
      header: 'Bill Total',
      align: 'right',
      render: (row) => (
        <div className="text-right font-mono font-bold text-white tabular-nums">
          {formatCurrency(row.totalAmount)}
        </div>
      )
    },
    {
      key: 'gstStatus',
      header: 'GSTR-2B Status',
      render: (row) => (
        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
            row.gstStatus === 'matched'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
              : 'bg-rose-950 text-rose-400 border-rose-800/40'
          }`}
        >
          {row.gstStatus.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Lineage DNA',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-indigo-400" />
            <span>Purchases & Vendor Bills</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Record supplier bills, inward warehouse stock automatically, update accounts payable, and verify input tax credit against GSTR-2B.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Purchase Bill</span>
        </button>
      </div>

      <DataTable
        data={purchases}
        columns={columns}
        searchPlaceholder="Search by bill number, supplier or GSTIN..."
        exportFileName="vyapaaros_purchases"
      />

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Record Purchase Bill & Inward Inventory</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Select Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                >
                  {parties.filter((p) => p.type === 'supplier' || p.type === 'both').map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.gstin})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Supplier Invoice #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GWD/8821"
                    value={supplierInvoiceNumber}
                    onChange={(e) => setSupplierInvoiceNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Bill Date</label>
                  <input
                    type="date"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1">Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      const p = products.find((pr) => pr.id === e.target.value);
                      if (p) setRate(p.purchasePrice);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Inward Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Unit Cost Rate (₹)</label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                />
              </div>

              <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(quantity * rate)}</span>
                </div>
                <div className="flex justify-between text-white font-bold">
                  <span>Total Payable:</span>
                  <span className="text-emerald-400">
                    {formatCurrency(quantity * rate * (1 + (products.find((p) => p.id === selectedProductId)?.taxRate || 18) / 100))}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-white"
                >
                  Post Bill & Increase Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
