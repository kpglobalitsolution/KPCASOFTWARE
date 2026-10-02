import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { Quotation } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FileSpreadsheet, Plus, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';

export const QuotationsView: React.FC = () => {
  const {
    quotations,
    parties,
    products,
    createQuotation,
    convertQuotationToOrder,
    navigateTo,
    showToast
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(parties[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [qty, setQty] = useState(5);
  const [rate, setRate] = useState(products[0]?.sellingPrice || 1000);
  const [notes, setNotes] = useState('Price quotation valid for 30 calendar days.');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = parties.find((p) => p.id === selectedCustomerId);
    const prod = products.find((p) => p.id === selectedProductId);
    if (!customer || !prod) return;

    const total = qty * rate * (1 + prod.taxRate / 100);

    createQuotation({
      customerId: customer.id,
      customerName: customer.name,
      items: [
        {
          id: `item-${Date.now()}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          hsnCode: prod.hsnCode,
          quantity: Number(qty),
          unit: prod.unit,
          rate: Number(rate),
          discountPercent: 0,
          taxableValue: Number(qty) * Number(rate),
          taxRate: prod.taxRate,
          cgst: (Number(qty) * Number(rate) * (prod.taxRate / 2)) / 100,
          sgst: (Number(qty) * Number(rate) * (prod.taxRate / 2)) / 100,
          igst: 0,
          total
        }
      ],
      totalAmount: total,
      notes
    });

    setIsCreateOpen(false);
  };

  const columns: Column<Quotation>[] = [
    {
      key: 'quotationNumber',
      header: 'Quote #',
      render: (row) => <span className="font-mono font-semibold text-white">{row.quotationNumber}</span>
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-mono text-slate-300">{formatDate(row.date)}</span>
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (row) => <span className="font-medium text-slate-200">{row.customerName}</span>
    },
    {
      key: 'totalAmount',
      header: 'Estimated Total',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-white tabular-nums">{formatCurrency(row.totalAmount)}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
            row.status === 'accepted'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
              : 'bg-indigo-950 text-indigo-400 border-indigo-800/40'
          }`}
        >
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Zero Re-entry Action',
      align: 'right',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status !== 'accepted' && row.status !== 'converted' ? (
            <button
              onClick={() => {
                convertQuotationToOrder(row.id);
                navigateTo('/business/orders');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
            >
              <span>Convert to Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Converted</span>
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <span>Price Quotations & Estimates</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Convert accepted estimates into Sales Orders and Invoices with 1-click zero re-entry data inheritance.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Quotation</span>
        </button>
      </div>

      <DataTable
        data={quotations}
        columns={columns}
        searchPlaceholder="Search quotation number or client..."
        exportFileName="vyapaaros_quotations"
      />

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Create Price Quotation</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                >
                  {parties.filter((p) => p.type === 'customer' || p.type === 'both').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1">Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      const p = products.find((pr) => pr.id === e.target.value);
                      if (p) setRate(p.sellingPrice);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quoted Rate (₹)</label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notes / Terms</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
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
                  Save Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
