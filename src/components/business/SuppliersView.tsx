import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { Party } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Building, Plus, Phone, Mail, Landmark, X } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { parties, purchases, createParty } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Party | null>(null);

  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [bankAcc, setBankAcc] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');

  const suppliers = parties.filter((p) => p.type === 'supplier' || p.type === 'both');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    createParty({
      type: 'supplier',
      name,
      contactPerson,
      phone,
      email,
      gstin: gstin.toUpperCase(),
      billingAddress,
      bankDetails: bankAcc
        ? {
            accountNumber: bankAcc,
            ifsc: ifsc.toUpperCase(),
            bankName,
            branch: 'Main'
          }
        : undefined
    });

    setIsAddOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setGstin('');
  };

  const columns: Column<Party>[] = [
    {
      key: 'name',
      header: 'Supplier & Contact',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="text-[10px] text-slate-400">
            {row.contactPerson} · {row.phone}
          </div>
        </div>
      )
    },
    {
      key: 'gstin',
      header: 'GSTIN',
      render: (row) => <span className="font-mono text-slate-300">{row.gstin || 'Unregistered'}</span>
    },
    {
      key: 'currentBalance',
      header: 'Payables (Due to Supplier)',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-amber-400 tabular-nums">
          {formatCurrency(row.currentBalance)}
        </span>
      )
    },
    {
      key: 'bankDetails',
      header: 'Bank Remittance',
      render: (row) => (
        <div className="text-[10px] font-mono text-slate-400">
          {row.bankDetails ? (
            <>
              <div>{row.bankDetails.bankName}</div>
              <div>A/c: ...{row.bankDetails.accountNumber.slice(-4)}</div>
            </>
          ) : (
            'Not configured'
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Supplier 360',
      align: 'right',
      sortable: false,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSupplier(row);
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
            <Building className="w-5 h-5 text-indigo-400" />
            <span>Supplier Management & Payables 360°</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Vendor master, payment terms, bank remittance coordinates, and GSTR-2B ITC tracking.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Supplier</span>
        </button>
      </div>

      <DataTable
        data={suppliers}
        columns={columns}
        searchPlaceholder="Search supplier by name, GSTIN or phone..."
        onRowClick={(row) => setSelectedSupplier(row)}
        exportFileName="vyapaaros_suppliers"
      />

      {/* Supplier 360 Drawer */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 text-xs">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{selectedSupplier.name}</h3>
                  <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
                    SUPPLIER 360°
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  GSTIN: {selectedSupplier.gstin} · {selectedSupplier.state}
                </div>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Outstanding Payable</span>
                  <span className="text-sm font-bold text-amber-400">{formatCurrency(selectedSupplier.currentBalance)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Credit Terms</span>
                  <span className="text-sm font-bold text-slate-200">{selectedSupplier.paymentTermsDays} Days</span>
                </div>
              </div>

              {selectedSupplier.bankDetails && (
                <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                  <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Verified Bank Coordinates:
                  </span>
                  <div>Bank: {selectedSupplier.bankDetails.bankName}</div>
                  <div>Account Number: <strong>{selectedSupplier.bankDetails.accountNumber}</strong></div>
                  <div>IFSC: <strong>{selectedSupplier.bankDetails.ifsc}</strong></div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] mb-2">
                  Recent Purchase Inward Bills
                </h4>
                <div className="border border-slate-800 rounded-lg divide-y divide-slate-800 bg-slate-850/40">
                  {purchases
                    .filter((p) => p.supplierId === selectedSupplier.id)
                    .map((pur) => (
                      <div key={pur.id} className="p-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-semibold text-white">{pur.billNumber}</div>
                          <div className="text-[10px] text-slate-400">
                            Inv #{pur.supplierInvoiceNumber} · {formatDate(pur.date)}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-white text-sm">
                          {formatCurrency(pur.totalAmount)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Register New Supplier / Vendor</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Supplier Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paramount Logistics LLP"
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
                    placeholder="27CCCDS9999C1Z9"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh Agarwal"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98200 55443"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="920020011223344"
                    value={bankAcc}
                    onChange={(e) => setBankAcc(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="HDFC0000123"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
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
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
