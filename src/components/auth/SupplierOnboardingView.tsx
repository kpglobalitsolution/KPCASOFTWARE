import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, CheckCircle2, ArrowRight, Landmark } from 'lucide-react';

export const SupplierOnboardingView: React.FC = () => {
  const { activeTenant, completeOnboarding } = useApp();
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNo, setAccountNo] = useState('389922114400');
  const [ifsc, setIfsc] = useState('SBIN0004567');
  const [terms, setTerms] = useState('Net 15 Days with 2% early cash settlement');

  const handleFinish = () => {
    completeOnboarding('supplier');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800/40 text-amber-400 text-xs font-semibold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Supplier Fulfillment Setup</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, {activeTenant.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure your vendor fulfillment policies, settlement account, and trade terms.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-slate-300">
              Commercial &amp; Remittance Details
            </span>
            <button
              onClick={handleFinish}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              Skip &amp; Open Dashboard →
            </button>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Beneficiary Bank Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Standard B2B Payment Terms
            </label>
            <input
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5"
            >
              <span>Launch Supplier Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
