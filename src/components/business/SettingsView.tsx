import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Building, Save, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { activeTenant, showToast } = useApp();

  const [tradeName, setTradeName] = useState(activeTenant.tradeName || activeTenant.name);
  const [gstin, setGstin] = useState(activeTenant.gstin);
  const [invoicePrefix, setInvoicePrefix] = useState(activeTenant.settings.invoicePrefix);
  const [tallyMode, setTallyMode] = useState(activeTenant.settings.tallySyncMode);
  const [makerChecker, setMakerChecker] = useState(activeTenant.settings.enableMakerChecker);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Business preferences and numbering sequences updated.', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto text-xs text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <span>Business Profile & Master Configuration</span>
          </h1>
          <p className="text-slate-400 mt-0.5">
            Configure GSTIN credentials, document numbering sequences, branches, and accounting policies.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Identity */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-indigo-400" />
            Legal Business Identity
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Business / Trade Name</label>
              <input
                type="text"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">GSTIN (India)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">PAN</label>
              <input
                type="text"
                disabled
                value={activeTenant.pan}
                className="w-full bg-slate-800/50 border border-slate-800 rounded-md p-2 text-slate-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">State Code</label>
              <input
                type="text"
                disabled
                value="24 - Gujarat"
                className="w-full bg-slate-800/50 border border-slate-800 rounded-md p-2 text-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Default Currency</label>
              <input
                type="text"
                disabled
                value="INR (₹) Indian Rupee"
                className="w-full bg-slate-800/50 border border-slate-800 rounded-md p-2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Numbering & Prefixes */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            Document Numbering Sequences
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Invoice Number Prefix</label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Quotation Prefix</label>
              <input
                type="text"
                defaultValue={activeTenant.settings.quotationPrefix}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Purchase Order Prefix</label>
              <input
                type="text"
                defaultValue={activeTenant.settings.poPrefix}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Accounting Policies & Tally */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            Tally & Governance Policies
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Tally Prime Sync Mode</label>
              <select
                value={tallyMode}
                onChange={(e) => setTallyMode(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white font-medium"
              >
                <option value="automatic">Automatic (Real-time webhook sync)</option>
                <option value="one-click">One-Click Manual Batch Sync</option>
                <option value="manual">Manual XML File Export Only</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Maker-Checker Policy</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={makerChecker}
                  onChange={(e) => setMakerChecker(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                />
                <span>Require dual authorization for manual journal postings</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
