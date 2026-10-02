import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { DataInboxItem } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Inbox, Upload, FileText, CheckCircle2, ArrowRight, Sparkles, X, MessageSquare, Mail } from 'lucide-react';

export const DataInboxView: React.FC = () => {
  const { dataInbox, convertInboxItem, showToast } = useApp();

  const [selectedItem, setSelectedItem] = useState<DataInboxItem | null>(null);

  const handleSimulateUpload = () => {
    showToast('Document Received', 'Simulated WhatsApp PDF bill received and parsed via OCR Engine (Confidence: 97%).', 'success');
  };

  const columns: Column<DataInboxItem>[] = [
    {
      key: 'source',
      header: 'Ingestion Source',
      render: (row) => {
        let Icon = Upload;
        let label = 'Direct Upload';
        let color = 'text-indigo-400';
        if (row.source === 'whatsapp') {
          Icon = MessageSquare;
          label = 'WhatsApp Inward';
          color = 'text-emerald-400';
        } else if (row.source === 'email') {
          Icon = Mail;
          label = 'Email-to-Accounting';
          color = 'text-blue-400';
        }
        return (
          <div className="flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            <span className="font-medium text-slate-200">{label}</span>
          </div>
        );
      }
    },
    {
      key: 'originalFileName',
      header: 'File Name',
      render: (row) => (
        <span className="font-mono text-slate-300 text-[11px] truncate max-w-xs block">
          {row.originalFileName}
        </span>
      )
    },
    {
      key: 'extractedParty',
      header: 'Extracted Entity',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.extractedData.partyName}</div>
          <div className="text-[10px] font-mono text-slate-400">
            Inv #{row.extractedData.invoiceNumber} · GSTIN: {row.extractedData.gstin || 'None'}
          </div>
        </div>
      )
    },
    {
      key: 'totalAmount',
      header: 'Parsed Total',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-white tabular-nums">
          {formatCurrency(row.extractedData.totalAmount)}
        </span>
      )
    },
    {
      key: 'confidenceScore',
      header: 'OCR Confidence',
      align: 'center',
      render: (row) => (
        <div className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
          <Sparkles className="w-2.5 h-2.5" />
          <span>{row.extractedData.confidenceScore}%</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Workflow Status',
      render: (row) => {
        let style = 'bg-slate-800 text-slate-300 border-slate-700';
        if (row.status === 'converted') style = 'bg-emerald-950 text-emerald-400 border-emerald-800/40';
        if (row.status === 'needs_review') style = 'bg-amber-950 text-amber-400 border-amber-800/40';
        return (
          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${style}`}>
            {row.status.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: '1-Click Convert',
      align: 'right',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status !== 'converted' ? (
            <button
              onClick={() => setSelectedItem(row)}
              className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
            >
              Review & Post
            </button>
          ) : (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Converted to {row.convertedTo?.toUpperCase()}</span>
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Inbox className="w-5 h-5 text-indigo-400" />
            <span>Universal Data Inbox & OCR Parsing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Incoming bills from WhatsApp and Email automatically extracted with AI vision and mapped to purchase ledgers with zero manual re-entry.
          </p>
        </div>

        <button
          onClick={handleSimulateUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload PDF / Image Bill</span>
        </button>
      </div>

      <DataTable
        data={dataInbox}
        columns={columns}
        searchPlaceholder="Search parsed invoices by file name or supplier..."
        onRowClick={(row) => row.status !== 'converted' && setSelectedItem(row)}
        exportFileName="vyapaaros_data_inbox"
      />

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Verify Extracted Invoice Data</h3>
                <span className="text-[10px] font-mono text-emerald-400">
                  OCR Accuracy: {selectedItem.extractedData.confidenceScore}%
                </span>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="font-sans text-slate-400">Supplier:</span>
                  <span className="text-white font-bold">{selectedItem.extractedData.partyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-400">GSTIN:</span>
                  <span className="text-slate-200">{selectedItem.extractedData.gstin || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-400">Invoice Number:</span>
                  <span className="text-slate-200">{selectedItem.extractedData.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-400">Date:</span>
                  <span className="text-slate-200">{formatDate(selectedItem.extractedData.date)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="font-sans">Taxable Value:</span>
                  <span>{formatCurrency(selectedItem.extractedData.taxableAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="font-sans">GST Tax (12%):</span>
                  <span>{formatCurrency(selectedItem.extractedData.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-700">
                  <span className="font-sans">Total Amount:</span>
                  <span className="text-emerald-400">{formatCurrency(selectedItem.extractedData.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  convertInboxItem(selectedItem.id, 'expense');
                  setSelectedItem(null);
                }}
                className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold"
              >
                Post as Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  convertInboxItem(selectedItem.id, 'purchase');
                  setSelectedItem(null);
                }}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-white"
              >
                Convert to Purchase Bill & Inward Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
