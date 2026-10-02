import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentTemplate } from '../../types';
import { FileCode, Layout, Eye, Palette, Check, Save, Printer, QrCode } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DocumentDesigner: React.FC = () => {
  const { templates, activeTenant, showToast } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(templates[0]);
  const [primaryColor, setPrimaryColor] = useState(selectedTemplate.primaryColor || '#0F172A');
  const [showLogo, setShowLogo] = useState(selectedTemplate.showLogo);
  const [showQrCode, setShowQrCode] = useState(selectedTemplate.showQrCode);
  const [showSignature, setShowSignature] = useState(selectedTemplate.showSignature);
  const [showBankDetails, setShowBankDetails] = useState(selectedTemplate.showBankDetails);
  const [showHsnSummary, setShowHsnSummary] = useState(selectedTemplate.showHsnSummary);
  const [termsText, setTermsText] = useState(selectedTemplate.termsText);
  const [pageSize, setPageSize] = useState<'A4' | 'A5' | 'thermal_80mm'>(selectedTemplate.pageSize);

  const handleSave = () => {
    showToast('Template Saved', `Custom template "${selectedTemplate.name}" updated successfully.`, 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-400" />
              <span>Document Designer & Layout Engine</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
              WYSIWYG TEMPLATE STUDIO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize GST Tax Invoices, thermal billing slips, and quotations with dynamic fields, BharatQR, and custom terms.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Active Template</span>
        </button>
      </div>

      {/* Main Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Settings Panel */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-5 text-xs text-slate-100">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Select Template Preset
            </label>
            <div className="space-y-1.5">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplate(tpl);
                    setPageSize(tpl.pageSize);
                    setShowLogo(tpl.showLogo);
                    setShowQrCode(tpl.showQrCode);
                    setShowSignature(tpl.showSignature);
                    setShowBankDetails(tpl.showBankDetails);
                    setShowHsnSummary(tpl.showHsnSummary);
                    setTermsText(tpl.termsText);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                    selectedTemplate.id === tpl.id
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200'
                      : 'bg-slate-850 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="font-semibold">{tpl.name}</span>
                  <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded">
                    {tpl.pageSize}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Page Format & Dimensions
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['A4', 'A5', 'thermal_80mm'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={`py-1.5 rounded font-mono text-[11px] font-semibold border transition-colors ${
                    pageSize === size
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Elements & Display Toggles
            </span>
            <div className="space-y-2">
              {[
                { label: 'Company Logo & Brand Header', state: showLogo, setter: setShowLogo },
                { label: 'Dynamic BharatQR / UPI Payment Code', state: showQrCode, setter: setShowQrCode },
                { label: 'Authorized Signature & Stamp Block', state: showSignature, setter: setShowSignature },
                { label: 'Remittance Bank & Account Coordinates', state: showBankDetails, setter: setShowBankDetails },
                { label: 'HSN / SAC Tax Summary Grid', state: showHsnSummary, setter: setShowHsnSummary }
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Terms & Conditions Wording
            </label>
            <textarea
              rows={3}
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white font-sans text-xs focus:outline-hidden"
            />
          </div>
        </div>

        {/* Right Live Interactive Preview */}
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center justify-start overflow-x-auto">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Render Canvas ({pageSize})</span>
            </span>
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 text-[11px]"
            >
              <Printer className="w-3 h-3" />
              <span>Test Print</span>
            </button>
          </div>

          {/* Simulated Paper Sheet */}
          <div
            className={`bg-white text-slate-900 shadow-2xl p-6 rounded text-xs transition-all ${
              pageSize === 'thermal_80mm'
                ? 'w-72 font-mono text-[10px]'
                : pageSize === 'A5'
                ? 'w-[420px]'
                : 'w-[560px]'
            }`}
          >
            {/* Header */}
            <div className="border-b border-slate-300 pb-3 flex justify-between items-start">
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">{activeTenant.name}</h2>
                <div className="text-[10px] text-slate-600 mt-0.5">{activeTenant.address}</div>
                <div className="text-[10px] font-mono text-slate-800 mt-1">
                  GSTIN: <strong>{activeTenant.gstin}</strong>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-[10px]">
                  TAX INVOICE
                </span>
                <div className="font-mono text-[10px] mt-1 text-slate-600">
                  <div>Inv: SRM/24-25/001</div>
                  <div>Date: 01 Oct 2024</div>
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div className="py-2.5 border-b border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Billed To:</span>
              <div className="font-bold text-slate-900">ABC Traders</div>
              <div className="text-[10px] text-slate-600">GSTIN: 24BBBCS5678B1Z2 · Surat, Gujarat</div>
            </div>

            {/* Product Table */}
            <div className="py-3">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-slate-800 uppercase font-bold text-slate-700 bg-slate-50">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-right">Qty</th>
                    <th className="py-1 text-right">Rate</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-1 font-sans">Smart 4K UHD LED TV 43&quot;</td>
                    <td className="py-1 text-right">2 PCS</td>
                    <td className="py-1 text-right">₹24,999</td>
                    <td className="py-1 text-right font-bold">₹56,047</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-sans">Wireless 2D Scanner</td>
                    <td className="py-1 text-right">3 PCS</td>
                    <td className="py-1 text-right">₹3,499</td>
                    <td className="py-1 text-right font-bold">₹12,386</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bank details & QR */}
            <div className="grid grid-cols-2 gap-3 py-2 border-t border-slate-200">
              {showBankDetails && (
                <div className="text-[9px] font-mono text-slate-600 bg-slate-50 p-2 rounded">
                  <div className="font-bold text-slate-800">Bank Details:</div>
                  <div>HDFC Bank · A/c: 50200011223344</div>
                  <div>IFSC: HDFC0000060</div>
                </div>
              )}
              {showQrCode && (
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-slate-800" />
                  <span className="text-[9px] text-slate-500">Scan & Pay via UPI</span>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="py-2 border-t border-slate-200 font-mono text-right text-[11px]">
              <div className="flex justify-between font-bold text-slate-900 text-xs">
                <span>Grand Total:</span>
                <span>₹68,435.00</span>
              </div>
            </div>

            {/* Terms & Signature */}
            <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-500 flex justify-between items-end">
              <div>
                <span className="font-bold block text-slate-700">Terms:</span>
                <p className="whitespace-pre-line">{termsText}</p>
              </div>
              {showSignature && (
                <div className="text-right border-t border-slate-400 pt-1 font-medium text-slate-700 min-w-[100px]">
                  Authorized Signature
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
