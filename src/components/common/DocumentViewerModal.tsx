import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Share2, Check, QrCode } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const DocumentViewerModal: React.FC = () => {
  const { previewDocument, closeDocumentViewer, invoices, activeTenant, showToast } = useApp();

  if (!previewDocument) return null;

  const invoice = invoices.find((i) => i.id === previewDocument.id) || previewDocument.data;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Invoice Link Copied', 'Shareable secure document link copied to clipboard.', 'success');
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in-20">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl flex flex-col shadow-2xl my-auto">
        {/* Top actions toolbar (hidden on print) */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/60 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">
              Tax Document Preview: {invoice.invoiceNumber || 'Document'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              ORIGINAL FOR RECIPIENT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={closeDocumentViewer}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-8 bg-white text-slate-900 rounded-b-xl print:rounded-none text-xs leading-normal">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-300 pb-5">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{activeTenant.name}</h1>
              <p className="text-slate-600 mt-1 max-w-sm">{activeTenant.address}, {activeTenant.city}, {activeTenant.state} - {activeTenant.pincode}</p>
              <div className="mt-2 space-y-0.5 font-mono text-[11px] text-slate-700">
                <div>GSTIN: <strong className="text-slate-900">{activeTenant.gstin}</strong></div>
                <div>PAN: {activeTenant.pan} · Phone: {activeTenant.phone}</div>
                <div>Email: {activeTenant.email}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded border border-slate-300">
                TAX INVOICE
              </span>
              <div className="mt-3 space-y-1 font-mono text-[11px]">
                <div>Invoice No: <strong className="text-slate-900">{invoice.invoiceNumber}</strong></div>
                <div>Date: {formatDate(invoice.date)}</div>
                <div>Due Date: {formatDate(invoice.dueDate)}</div>
                {invoice.placeOfSupply && <div>Place of Supply: {invoice.placeOfSupply}</div>}
              </div>
            </div>
          </div>

          {/* Bill To & Ship To */}
          <div className="grid grid-cols-2 gap-6 py-4 border-b border-slate-300 text-xs">
            <div>
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Billed To (Buyer):
              </span>
              <div className="font-bold text-slate-900 text-sm">{invoice.customerName}</div>
              <p className="text-slate-600 mt-0.5">{invoice.billingAddress}</p>
              {invoice.customerGstin && (
                <div className="mt-1 font-mono text-[11px] text-slate-800">
                  GSTIN: <strong>{invoice.customerGstin}</strong>
                </div>
              )}
            </div>
            <div>
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Dispatch Details:
              </span>
              <div className="text-slate-700 space-y-1 font-mono text-[11px]">
                {invoice.orderNumber && <div>Order Ref: {invoice.orderNumber}</div>}
                {invoice.eWayBillNumber && <div>E-Way Bill: {invoice.eWayBillNumber}</div>}
                {invoice.eInvoiceNumber && <div className="truncate">IRN: {invoice.eInvoiceNumber}</div>}
                <div>Payment Terms: {invoice.paymentTerms || '30 Days'}</div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-[10px] uppercase font-semibold text-slate-700 bg-slate-50">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Item & Description</th>
                  <th className="py-2 px-2 text-center">HSN</th>
                  <th className="py-2 px-2 text-right">Qty</th>
                  <th className="py-2 px-2 text-right">Rate</th>
                  <th className="py-2 px-2 text-right">Taxable</th>
                  <th className="py-2 px-2 text-right">Tax</th>
                  <th className="py-2 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {(invoice.items || []).map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-2 text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-2 font-sans font-medium text-slate-900">{item.productName}</td>
                    <td className="py-2 px-2 text-center text-slate-600">{item.hsnCode}</td>
                    <td className="py-2 px-2 text-right">{item.quantity} {item.unit}</td>
                    <td className="py-2 px-2 text-right">{formatCurrency(item.rate, false)}</td>
                    <td className="py-2 px-2 text-right">{formatCurrency(item.taxableValue, false)}</td>
                    <td className="py-2 px-2 text-right">{item.taxRate}%</td>
                    <td className="py-2 px-2 text-right font-semibold text-slate-900">{formatCurrency(item.total, false)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Summary */}
          <div className="grid grid-cols-2 gap-6 pt-2 pb-5 border-t border-slate-300">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono">
                <span className="font-semibold block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                  Bank Details for Remittance:
                </span>
                <div>Bank: HDFC Bank Ltd</div>
                <div>A/c No: 50200011223344</div>
                <div>IFSC: HDFC0000060 (SG Highway Branch)</div>
                <div>UPI ID: shreeretail@hdfcbank</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 border border-slate-300 rounded bg-white">
                  <QrCode className="w-14 h-14 text-slate-800" />
                </div>
                <div className="text-[10px] text-slate-500">
                  <span>Scan to pay instantly via any UPI App</span>
                  <div className="font-mono text-slate-700 font-semibold mt-0.5">UPI / Dynamic BharatQR</div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-right">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Taxable Amount:</span>
                <span className="font-semibold">{formatCurrency(invoice.taxableAmount)}</span>
              </div>
              {invoice.totalCgst > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">CGST:</span>
                  <span>{formatCurrency(invoice.totalCgst)}</span>
                </div>
              )}
              {invoice.totalSgst > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">SGST:</span>
                  <span>{formatCurrency(invoice.totalSgst)}</span>
                </div>
              )}
              {invoice.totalIgst > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">IGST:</span>
                  <span>{formatCurrency(invoice.totalIgst)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-bold text-slate-950">
                <span>Total Amount:</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 text-xs">
                <span>Amount Paid:</span>
                <span className="text-emerald-700">{formatCurrency(invoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-900 font-bold text-xs bg-slate-100 px-2 rounded">
                <span>Balance Due:</span>
                <span>{formatCurrency(invoice.balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Signature */}
          <div className="pt-4 border-t border-slate-300 grid grid-cols-2 gap-6 items-end">
            <div className="text-[10px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-700 block mb-1">Terms & Conditions:</span>
              <p>1. Goods once sold will not be accepted back without original tax invoice.</p>
              <p>2. Interest @ 18% per annum will be charged if payment is delayed beyond due date.</p>
              <p>3. All disputes subject to Ahmedabad jurisdiction.</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold text-slate-700 mb-8">For {activeTenant.name}</div>
              <div className="border-t border-slate-400 inline-block pt-1 min-w-[160px] text-center text-[10px] text-slate-600 font-medium">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
