import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CreditCard, Plus, X } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, createExpense } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [category, setCategory] = useState('Logistics & Courier');
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState(2500);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createExpense({
      category,
      vendorName: vendorName || 'Vendor',
      amount: Number(amount),
      date,
      description,
      taxAmount: Math.round(Number(amount) * 0.18 * 100) / 100
    });
    setIsAddOpen(false);
    setVendorName('');
    setDescription('');
  };

  const columns: Column<Expense>[] = [
    {
      key: 'expenseNumber',
      header: 'Voucher #',
      render: (row) => <span className="font-mono font-semibold text-white">{row.expenseNumber}</span>
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-mono text-slate-400">{formatDate(row.date)}</span>
    },
    {
      key: 'category',
      header: 'Expense Category',
      render: (row) => <span className="font-medium text-slate-200">{row.category}</span>
    },
    {
      key: 'vendorName',
      header: 'Payee / Vendor',
      render: (row) => <span className="text-slate-300">{row.vendorName}</span>
    },
    {
      key: 'description',
      header: 'Narration',
      render: (row) => <span className="text-slate-400 truncate max-w-xs block">{row.description}</span>
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-white tabular-nums">
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      key: 'tallySyncStatus',
      header: 'Tally Sync',
      render: (row) => (
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
          SYNCED
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <span>Operating Expense Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Log overheads, utilities, freight, and rent with direct accounting ledger impact and GST input deduction.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Expense</span>
        </button>
      </div>

      <DataTable
        data={expenses}
        columns={columns}
        searchPlaceholder="Search expense category, vendor or narration..."
        exportFileName="vyapaaros_expenses"
      />

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Log Operational Expense</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Expense Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="Logistics & Courier">Logistics & Courier</option>
                    <option value="Electricity & Utilities">Electricity & Utilities</option>
                    <option value="Commercial Rent">Commercial Rent</option>
                    <option value="Marketing & Advertising">Marketing & Advertising</option>
                    <option value="Office Consumables">Office Consumables</option>
                    <option value="Software & Cloud">Software & Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  placeholder="e.g. Torrent Power Ltd"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Narration / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Warehouse monthly electricity bill"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-white"
                >
                  Log Expense & Deduct Cash Flow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
