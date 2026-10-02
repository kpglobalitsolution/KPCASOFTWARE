import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const CaOnboardingView: React.FC = () => {
  const { activeTenant, completeOnboarding } = useApp();
  const [partnerInCharge, setPartnerInCharge] = useState('CA Kailash Patel, FCA');
  const [frn, setFrn] = useState('123456W');
  const [enable2BScan, setEnable2BScan] = useState(true);

  const handleFinish = () => {
    completeOnboarding('ca');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-emerald-400 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>CA Practice &amp; Audit Setup</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, {activeTenant.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure your client audit practice, compliance automations, and filing credentials.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-slate-300">
              Practice Credentials &amp; Automations
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
              Lead Audit Partner
            </label>
            <input
              type="text"
              value={partnerInCharge}
              onChange={(e) => setPartnerInCharge(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              ICAI Firm Registration Number (FRN)
            </label>
            <input
              type="text"
              value={frn}
              onChange={(e) => setFrn(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>

          <label className="flex items-center gap-2 p-3 rounded bg-slate-950 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={enable2BScan}
              onChange={(e) => setEnable2BScan(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700"
            />
            <div>
              <span className="font-semibold text-slate-200">Continuous GSTR-2B Mismatch Detection</span>
              <p className="text-[10px] text-slate-400">
                Automatically compare client purchase books with supplier GST portal returns every night.
              </p>
            </div>
          </label>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5"
            >
              <span>Launch CA Firm Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
