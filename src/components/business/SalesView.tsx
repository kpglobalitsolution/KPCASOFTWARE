import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { SalesInvoice, LineItem } from '../../types';
import { formatCurrency, formatDate, calculateLineItem } from '../../utils/formatters';
import {
  Plus,
  Receipt,
  GitCommit,
  Printer,
  FileSpreadsheet,
  Trash2,
  Copy,
  CheckCircle2,
  X,
  Share2
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const {
    invoices,
    parties,
    products,
    createSalesInvoice,
    updateSalesInvoiceStatus,
    openDnaViewer,
    openDocumentViewer,
    showToast
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Invoice Form state
  const [selectedCustomerId, setSelectedCustomerId] = useState(parties[0]?.id || '');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [paymentTerms, setPaymentTerms] = useState('30 Days Net');
  const [placeOfSupply, setPlaceOfSupply] = useState('24-Gujarat');
  const [warehouseId, setWarehouseId] = useState('br-main');
  const [notes, setNotes] = useState('Thank you for choosing Shree Retail Mart. All goods covered under manufacturer warranty.');

  const [items, setItems] = useState<LineItem[]>([
    {
      id: 'it-1',
      productId: products[0]?.id || 'prod-tv-43',
      productName: products[0]?.name || 'Smart 4K UHD LED TV 43"',
      sku: products[0]?.sku || 'ELEC-TV-43',
      hsnCode: products[0]?.hsnCode || '8528',
      quantity: 1,
      unit: products[0]?.unit || 'PCS',
      rate: products[0]?.sellingPrice || 24999,
      discountPercent: 0,
      taxableValue: products[0]?.sellingPrice || 24999,
      taxRate: products[0]?.taxRate || 18,
      cgst: ((products[0]?.sellingPrice || 24999) * 0.09),
      sgst: ((products[0]?.sellingPrice || 24999) * 0.09),
      igst: 0,
      total: ((products[0]?.sellingPrice || 24999) * 1.18)
    }
  ]);

  const selectedCustomer = parties.find((p) => p.id === selectedCustomerId);

  const addItemRow = () => {
    const prod = products[0];
    const newItem: LineItem = {
      id: `it-${Date.now()}`,
      productId: prod?.id || 'prod-tv-43',
      productName: prod?.name || 'Item',
      sku: prod?.sku || 'SKU',
      hsnCode: prod?.hsnCode || '8528',
      quantity: 1,
      unit: prod?.unit || 'PCS',
      rate: prod?.sellingPrice || 1000,
      discountPercent: 0,
      taxableValue: prod?.sellingPrice || 1000,
      taxRate: prod?.taxRate || 18,
      cgst: (prod?.sellingPrice || 1000) * 0.09,
      sgst: (prod?.sellingPrice || 1000) * 0.09,
      igst: 0,
      total: (prod?.sellingPrice || 1000) * 1.18
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItemRow = (idx: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (index: number, updates: Partial<LineItem>) => {
    setItems((prev) => {
      const copy = [...prev];
      const current = { ...copy[index], ...updates };

      if (updates.productId) {
        const prod = products.find((p) => p.id === updates.productId);
        if (prod) {
          current.productName = prod.name;
          current.sku = prod.sku;
          current.hsnCode = prod.hsnCode;
          current.rate = prod.sellingPrice;
          current.unit = prod.unit;
          current.taxRate = prod.taxRate;
        }
      }

      const isInter = placeOfSupply.slice(0, 2) !== '24';
      const calc = calculateLineItem({
        quantity: current.quantity,
        rate: current.rate,
        discountPercent: current.discountPercent,
        taxRate: current.taxRate,
        isInterState: isInter
      });

      current.taxableValue = calc.taxableValue;
      current.cgst = calc.cgst;
      current.sgst = calc.sgst;
      current.igst = calc.igst;
      current.total = calc.total;

      copy[index] = current;
      return copy;
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    createSalesInvoice({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerGstin: selectedCustomer.gstin,
      billingAddress: selectedCustomer.billingAddress,
      placeOfSupply,
      warehouseId,
      date: invoiceDate,
      dueDate,
      paymentTerms,
      notes,
      items
    });

    setIsCreateOpen(false);
  };

  const columns: Column<SalesInvoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: (row) => (
        <span className="font-mono font-semibold text-white">{row.invoiceNumber}</span>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-mono text-slate-300">{formatDate(row.date)}</span>
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-200">{row.customerName}</div>
          <div className="text-[10px] font-mono text-slate-400">{row.customerGstin || 'Unregistered'}</div>
        </div>
      )
    },
    {
      key: 'totalAmount',
      header: 'Total Value',
      align: 'right',
      render: (row) => (
        <div className="text-right">
          <div className="font-mono font-bold text-white tabular-nums">{formatCurrency(row.totalAmount)}</div>
          <div className="text-[10px] font-mono text-slate-400">Bal: {formatCurrency(row.balanceDue)}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        let style = 'bg-slate-800 text-slate-300 border-slate-700';
        if (row.status === 'paid') style = 'bg-emerald-950 text-emerald-300 border-emerald-800/40';
        if (row.status === 'partially_paid') style = 'bg-amber-950 text-amber-300 border-amber-800/40';
        if (row.status === 'overdue') style = 'bg-rose-950 text-rose-300 border-rose-800/40';
        return (
          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${style}`}>
            {row.status.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      key: 'tallySyncStatus',
      header: 'Tally',
      render: (row) => (
        <span className={`text-[10px] font-mono ${row.tallySyncStatus === 'synced' ? 'text-emerald-400' : 'text-amber-400'}`}>
          {row.tallySyncStatus.toUpperCase()}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openDnaViewer(row.dnaId)}
            className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors"
            title="Inspect Transaction DNA"
          >
            <GitCommit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openDocumentViewer('invoice', row.id)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="View & Print Tax Document"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  const subtotal = items.reduce((s, it) => s + it.taxableValue, 0);
  const totalTax = items.reduce((s, it) => s + it.cgst + it.sgst + it.igst, 0);
  const grandTotal = subtotal + totalTax;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <span>Sales & Tax Invoices</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full lifecycle: Quotation → Sales Order → Dispatch → Invoice → Payment. Live double-entry bookkeeping & Tally queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={invoices}
        columns={columns}
        searchPlaceholder="Search by invoice number or customer name..."
        onRowClick={(row) => openDocumentViewer('invoice', row.id)}
        exportFileName="vyapaaros_sales_invoices"
      />

      {/* Full Modal: Create Tax Invoice */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl flex flex-col shadow-2xl my-auto text-xs text-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Create GST Tax Invoice</h3>
                <p className="text-[11px] text-slate-400">
                  Real-time stock deduction, customer ledger posting, and Tally sync queue insertion.
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-850/60 border border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Billed To (Customer)</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white font-medium focus:outline-hidden focus:border-indigo-500"
                  >
                    {parties.filter((p) => p.type === 'customer' || p.type === 'both').map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.gstin || 'Unregistered'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white font-mono focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white font-mono focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Place of Supply</label>
                  <select
                    value={placeOfSupply}
                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="24-Gujarat">24 - Gujarat (CGST + SGST)</option>
                    <option value="27-Maharashtra">27 - Maharashtra (IGST)</option>
                    <option value="07-Delhi">07 - Delhi (IGST)</option>
                    <option value="29-Karnataka">29 - Karnataka (IGST)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Warehouse / Branch</label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="br-main">Main Store & Warehouse (Ahmedabad)</option>
                    <option value="br-surat">Surat Distribution Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Payment Terms</label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                    Line Items & Tax Calculations
                  </span>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="border border-slate-800 rounded-lg overflow-x-auto bg-slate-850/40">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold bg-slate-800/50">
                        <th className="p-2.5">Product</th>
                        <th className="p-2.5 w-20">HSN</th>
                        <th className="p-2.5 w-20 text-right">Qty</th>
                        <th className="p-2.5 w-28 text-right">Rate (₹)</th>
                        <th className="p-2.5 w-20 text-right">Disc %</th>
                        <th className="p-2.5 w-24 text-right">Taxable</th>
                        <th className="p-2.5 w-20 text-right">Tax %</th>
                        <th className="p-2.5 w-28 text-right">Total (₹)</th>
                        <th className="p-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                      {items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-800/30">
                          <td className="p-2">
                            <select
                              value={item.productId}
                              onChange={(e) => updateItem(idx, { productId: e.target.value })}
                              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-sans text-xs focus:outline-hidden"
                            >
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} (Stock: {p.currentStock})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2 text-center text-slate-400">{item.hsnCode}</td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                              className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-right text-white focus:outline-hidden"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(idx, { rate: Number(e.target.value) })}
                              className="w-24 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-right text-white focus:outline-hidden"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.discountPercent}
                              onChange={(e) => updateItem(idx, { discountPercent: Number(e.target.value) })}
                              className="w-14 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-right text-white focus:outline-hidden"
                            />
                          </td>
                          <td className="p-2 text-right text-slate-300 font-medium">
                            {formatCurrency(item.taxableValue, false)}
                          </td>
                          <td className="p-2 text-right text-slate-400">{item.taxRate}%</td>
                          <td className="p-2 text-right text-white font-bold">
                            {formatCurrency(item.total, false)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItemRow(idx)}
                              disabled={items.length <= 1}
                              className="text-slate-500 hover:text-rose-400 disabled:opacity-20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Summary & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Terms & Invoice Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="p-4 rounded-lg bg-slate-850 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Taxable Amount:</span>
                    <span className="font-semibold text-slate-200">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST (CGST + SGST / IGST):</span>
                    <span className="font-semibold text-slate-200">{formatCurrency(totalTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-700">
                    <span>Grand Total:</span>
                    <span className="text-emerald-400">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-xs"
                >
                  Generate Tax Invoice & Connect Everything
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
