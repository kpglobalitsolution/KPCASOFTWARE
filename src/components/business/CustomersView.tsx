import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { Party } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Users, Plus, Phone, Mail, Building, ArrowUpRight, X, Send, CreditCard } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { parties, invoices, payments, createParty, openDocumentViewer, showToast } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Party | null>(null);

  // New customer form
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState(200000);
  const [paymentTermsDays, setPaymentTermsDays] = useState(30);

  const customers = parties.filter((p) => p.type === 'customer' || p.type === 'both');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    createParty({
      type: 'customer',
      name,
      contactPerson,
      phone,
      email,
      gstin: gstin.toUpperCase(),
      billingAddress,
      creditLimit: Number(creditLimit),
      paymentTermsDays: Number(paymentTermsDays)
    });

    setIsAddOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setGstin('');
  };

  const handleSendReminder = (customer: Party) => {
    showToast('Payment Reminder Sent', `WhatsApp payment reminder with UPI payment link dispatched to ${customer.phone}.`, 'success');
  };

  const columns: Column<Party>[] = [
    {
      key: 'name',
      header: 'Customer & Contact',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="text-[10px] text-slate-400">
            {row.contactPerson || 'Authorized Representative'} · {row.phone}
          </div>
        </div>
      )
    },
    {
      key: 'gstin',
      header: 'GSTIN / PAN',
      render: (row) => (
        <span className="font-mono text-slate-300">{row.gstin || 'Unregistered'}</span>
      )
    },
    {
      key: 'creditLimit',
      header: 'Credit Limit',
      align: 'right',
      render: (row) => (
        <span className="font-mono text-slate-400 tabular-nums">
          {formatCurrency(row.creditLimit)}
        </span>
      )
    },
    {
      key: 'currentBalance',
      header: 'Outstanding Balance',
      align: 'right',
      render: (row) => {
        const hasBalance = row.currentBalance > 0;
        return (
          <div className="text-right">
            <span className={`font-mono font-bold tabular-nums ${hasBalance ? 'text-amber-400' : 'text-slate-300'}`}>
              {formatCurrency(row.currentBalance)}
            </span>
            <div className="text-[10px] text-slate-500">{row.paymentTermsDays} Days Terms</div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: 'Customer 360',
      align: 'right',
      sortable: false,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCustomer(row);
          }}
          className="px-2.5 py-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/40 rounded transition-colors"
        >
          View 360°
        </button>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Customer Directory & Ledger 360°</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time accounts receivable, sales history, GST compliance, and instant WhatsApp payment follow-up links.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Customer</span>
        </button>
      </div>

      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search customer by name, contact or GSTIN..."
        onRowClick={(row) => setSelectedCustomer(row)}
        exportFileName="vyapaaros_customers"
      />

      {/* Customer 360 Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 text-xs">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{selectedCustomer.name}</h3>
                  <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
                    CUSTOMER 360°
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  GSTIN: <span className="font-mono text-slate-300 font-medium">{selectedCustomer.gstin || 'Unregistered'}</span> · State: {selectedCustomer.state}
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Outstanding</span>
                  <span className="text-sm font-bold text-amber-400">{formatCurrency(selectedCustomer.currentBalance)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Approved Credit Limit</span>
                  <span className="text-sm font-bold text-slate-200">{formatCurrency(selectedCustomer.creditLimit)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Payment Terms</span>
                  <span className="text-sm font-bold text-slate-200">{selectedCustomer.paymentTermsDays} Days</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-lg justify-between">
                <div>
                  <span className="font-semibold text-indigo-200 block">Collect Outstanding Payment</span>
                  <span className="text-[10px] text-slate-400">Generate UPI payment link & WhatsApp notification</span>
                </div>
                <button
                  onClick={() => handleSendReminder(selectedCustomer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded text-xs transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp UPI Link</span>
                </button>
              </div>

              {/* Linked Invoices */}
              <div>
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] mb-2">
                  Invoice History
                </h4>
                <div className="border border-slate-800 rounded-lg divide-y divide-slate-800 bg-slate-850/40">
                  {invoices
                    .filter((i) => i.customerId === selectedCustomer.id)
                    .map((inv) => (
                      <div key={inv.id} className="p-2.5 flex items-center justify-between hover:bg-slate-800/40">
                        <div>
                          <div className="font-mono font-semibold text-white">{inv.invoiceNumber}</div>
                          <div className="text-[10px] text-slate-400">{formatDate(inv.date)}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right font-mono">
                            <div className="font-bold text-white">{formatCurrency(inv.totalAmount)}</div>
                            <div className="text-[10px] text-slate-400">Bal: {formatCurrency(inv.balanceDue)}</div>
                          </div>
                          <button
                            onClick={() => openDocumentViewer('invoice', inv.id)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px]"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Linked Payment Receipts */}
              <div>
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] mb-2">
                  Collections & Payment Receipts
                </h4>
                <div className="border border-slate-800 rounded-lg divide-y divide-slate-800 bg-slate-850/40">
                  {payments
                    .filter((p) => p.partyId === selectedCustomer.id)
                    .map((pay) => (
                      <div key={pay.id} className="p-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-semibold text-emerald-400">{pay.receiptNumber}</div>
                          <div className="text-[10px] text-slate-400">
                            {formatDate(pay.date)} via {pay.paymentMode.toUpperCase()} ({pay.referenceNo})
                          </div>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          {formatCurrency(pay.amount)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Register New Customer</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Company / Trade Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex HyperMart Pvt Ltd"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="24AAACS1234A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Shah"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+91 98250 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="billing@apex.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Billing Address</label>
                <input
                  type="text"
                  placeholder="e.g. 101 Commercial Hub, SG Highway, Ahmedabad"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payment Terms (Days)</label>
                  <input
                    type="number"
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
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
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
