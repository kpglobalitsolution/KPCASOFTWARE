import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Building2, CheckCircle2, ArrowRight, ShieldCheck, SkipForward } from 'lucide-react';

export const BuyerOnboardingView: React.FC = () => {
  const { activeTenant, completeOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [approvalLimit, setApprovalLimit] = useState(50000);
  const [terms, setTerms] = useState('Net 30 Days');
  const [poPrefix, setPoPrefix] = useState('PO/2024/');

  const handleFinish = () => {
    completeOnboarding('buyer');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-800/40 text-sky-400 text-xs font-semibold mb-2">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buyer Workspace Onboarding</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Welcome to VyapaarOS Buyer Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organization: <strong className="text-slate-200">{activeTenant.name}</strong>
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-300">
              Procurement Configuration (Step {currentStep} of 2)
            </span>
            <button
              onClick={handleFinish}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              Skip &amp; Open Dashboard →
            </button>
          </div>

          {currentStep === 1 ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Manager Approval Threshold (₹)
                </label>
                <input
                  type="number"
                  value={approvalLimit}
                  onChange={(e) => setApprovalLimit(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Requisitions above this threshold require secondary sign-off before dispatching to suppliers.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Purchase Order Prefix
                </label>
                <input
                  type="text"
                  value={poPrefix}
                  onChange={(e) => setPoPrefix(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5"
                >
                  <span>Next: Payment Terms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Default Vendor Payment Terms
                </label>
                <select
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Immediate">Immediate upon receipt (Cash on Delivery)</option>
                  <option value="Net 15 Days">Net 15 Days</option>
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Net 45 Days">Net 45 Days</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-300 font-semibold block mb-1">3-Way Match Verification</span>
                <p className="text-[11px] text-slate-400">
                  Every supplier invoice is automatically matched against the authorized Purchase Order and warehouse inward delivery note.
                </p>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5"
                >
                  <span>Launch Buyer Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
