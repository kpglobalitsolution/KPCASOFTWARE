import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { PaymentTransaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CreditCard, Plus, GitCommit, CheckCircle2, X } from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { payments, parties, invoices, bankAccounts, createPayment, openDnaViewer } = useApp();

  const [isRecordOpen, setIsRecordOpen] = useState(false);

  // Form states
  const [selectedPartyId, setSelectedPartyId] = useState(parties[0]?.id || '');
  const [amount, setAmount] = useState(10000);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<any>('bank_transfer');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || 'bank-hdfc-current');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');

  const selectedParty = parties.find((p) => p.id === selectedPartyId);
  const eligibleInvoices = invoices.filter(
    (i) => i.customerId === selectedPartyId && i.balanceDue > 0
  );

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParty) return;

    let remainingToAlloc = Number(amount);
    const allocated: { invoiceId: string; invoiceNumber: string; allocatedAmount: number }[] = [];

    for (const inv of eligibleInvoices) {
      if (remainingToAlloc <= 0) break;
      const allocAmt = Math.min(inv.balanceDue, remainingToAlloc);
      allocated.push({
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        allocatedAmount: allocAmt
      });
      remainingToAlloc -= allocAmt;
    }

    createPayment({
      partyId: selectedParty.id,
      partyName: selectedParty.name,
      type: selectedParty.type === 'supplier' ? 'supplier_payment' : 'customer_payment',
      amount: Number(amount),
      date: paymentDate,
      paymentMode,
      bankAccountId,
      referenceNo: referenceNo || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      allocatedInvoices: allocated,
      unallocatedAmount: Math.max(0, remainingToAlloc),
      notes
    });

    setIsRecordOpen(false);
  };

  const columns: Column<PaymentTransaction>[] = [
    {
      key: 'receiptNumber',
      header: 'Voucher #',
      render: (row) => <span className="font-mono font-semibold text-white">{row.receiptNumber}</span>
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-mono text-slate-400">{formatDate(row.date)}</span>
    },
    {
      key: 'partyName',
      header: 'Party',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-200">{row.partyName}</div>
          <div className="text-[10px] text-slate-400 font-mono">
            {row.type === 'customer_payment' ? 'Customer Receipt' : 'Vendor Payment'}
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-400 tabular-nums">
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      key: 'paymentMode',
      header: 'Payment Mode',
      render: (row) => (
        <span className="font-mono uppercase text-slate-300 text-[11px]">
          {row.paymentMode.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'referenceNo',
      header: 'Ref / UTR',
      render: (row) => <span className="font-mono text-slate-400 text-[11px]">{row.referenceNo}</span>
    },
    {
      key: 'status',
      header: 'Bank Recon',
      render: (row) => (
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
          RECONCILED
        </span>
      )
    },
    {
      key: 'actions',
      header: 'DNA Trace',
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
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <span>Payments & Collections Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single entry records cash/bank flow, allocates against unpaid invoices, updates ledgers, and matches bank statement lines.
          </p>
        </div>

        <button
          onClick={() => setIsRecordOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Payment</span>
        </button>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        searchPlaceholder="Search voucher #, party name or UTR reference..."
        exportFileName="vyapaaros_payments"
      />

      {isRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Record Transaction & Auto-Allocate Invoices</h3>
              <button onClick={() => setIsRecordOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleRecordSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Party (Customer or Vendor)</label>
                <select
                  value={selectedPartyId}
                  onChange={(e) => setSelectedPartyId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                >
                  {parties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.type} · Outstanding: {formatCurrency(p.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Payment Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Transaction Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="upi">UPI / Dynamic QR</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash Counter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Bank Account</label>
                  <select
                    value={bankAccountId}
                    onChange={(e) => setBankAccountId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>{b.accountName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reference / UTR / Cheque Number</label>
                <input
                  type="text"
                  placeholder="e.g. HDFCN2410029981"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              {eligibleInvoices.length > 0 && (
                <div className="p-3 bg-slate-850 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Auto-Allocation Preview:
                  </span>
                  <div className="text-[11px] text-slate-300 space-y-0.5">
                    {eligibleInvoices.map((inv) => (
                      <div key={inv.id} className="flex justify-between font-mono">
                        <span>{inv.invoiceNumber}:</span>
                        <span>Due {formatCurrency(inv.balanceDue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRecordOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-white"
                >
                  Post Payment & Reconcile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
