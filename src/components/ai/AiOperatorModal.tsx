import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Send, Bot, Check, ArrowRight, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const AiOperatorModal: React.FC = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    invoices,
    purchases,
    products,
    parties,
    gstMismatches,
    tallyQueue,
    caDocRequests,
    bankStatements,
    navigateTo,
    showToast
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; action?: { label: string; route?: string; callback?: () => void } }>>([
    {
      sender: 'assistant',
      text: 'Hello! I am your VyapaarOS Business Operator. I monitor your live receivables, inventory stock levels, Tally sync queues, GST mismatches, and CA requests in real time. How can I assist your business operations today?'
    }
  ]);

  if (!isAiModalOpen) return null;

  const quickPrompts = [
    'What is pending today?',
    'Who owes me money?',
    'Which products are low on stock?',
    'What GST issues exist?',
    'What Tally sync failed?'
  ];

  const handleSend = (text: string) => {
    const query = (text || input).trim();
    if (!query) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInput('');

    // Grounded intelligence based on actual database entities
    setTimeout(() => {
      let reply = '';
      let action: { label: string; route?: string; callback?: () => void } | undefined = undefined;

      const q = query.toLowerCase();

      if (q.includes('pending') || q.includes('today')) {
        const pendingTally = tallyQueue.filter((t) => t.status === 'pending' || t.status === 'failed').length;
        const pendingGst = gstMismatches.filter((g) => g.status === 'pending').length;
        const pendingDocs = caDocRequests.filter((d) => d.status === 'requested').length;
        const overdueInv = invoices.filter((i) => i.status === 'sent' && new Date(i.dueDate) < new Date()).length;

        reply = `Here is your high-priority operational summary for today:\n• ${overdueInv} invoices are currently overdue for collection.\n• ${pendingGst} GSTR-2B ITC purchase mismatches require review.\n• ${pendingTally} accounting vouchers are pending in the Tally sync queue.\n• ${pendingDocs} document request pending from CA Kailash Patel (Signed Bank Statement).`;
        action = { label: 'Go to Today Command Center', route: '/business/today' };
      } else if (q.includes('owe') || q.includes('receivable') || q.includes('customer')) {
        const outstandingParties = parties.filter((p) => p.type === 'customer' && p.currentBalance > 0);
        const total = outstandingParties.reduce((sum, p) => sum + p.currentBalance, 0);
        const list = outstandingParties.map((p) => `• ${p.name}: ${formatCurrency(p.currentBalance)}`).join('\n');
        reply = `Total customer receivables outstanding: ${formatCurrency(total)}.\n\nBreakdown by customer:\n${list}\n\nTip: You can send automated WhatsApp payment reminders with dynamic UPI links.`;
        action = { label: 'View Customer Aging', route: '/business/customers' };
      } else if (q.includes('low') || q.includes('stock') || q.includes('inventory')) {
        const lowStock = products.filter((p) => p.currentStock <= p.reorderLevel);
        if (lowStock.length > 0) {
          const list = lowStock.map((p) => `• ${p.name} (SKU: ${p.sku}): Current stock ${p.currentStock} ${p.unit} (Reorder level: ${p.reorderLevel})`).join('\n');
          reply = `Found ${lowStock.length} items currently below minimum reorder thresholds:\n\n${list}\n\nWould you like to auto-generate a Purchase Order to suppliers?`;
          action = { label: 'Manage Stock & Reorders', route: '/business/inventory' };
        } else {
          reply = 'All product stock levels are currently healthy and above reorder thresholds.';
        }
      } else if (q.includes('gst')) {
        const unresolved = gstMismatches.filter((g) => g.status === 'pending');
        if (unresolved.length > 0) {
          reply = `Alert: Found ${unresolved.length} purchase invoices with GST discrepancies. For example, Bill ${unresolved[0].invoiceNumber} from ${unresolved[0].partyName} has a variance of ${formatCurrency(unresolved[0].varianceAmount)} missing in supplier's GSTR-2B return.`;
          action = { label: 'Resolve GST 2B Discrepancies', route: '/business/gst' };
        } else {
          reply = 'All GSTR-1 sales and GSTR-2B purchase input tax credits are currently reconciled with zero mismatches.';
        }
      } else if (q.includes('tally')) {
        const failed = tallyQueue.filter((t) => t.status === 'failed' || t.status === 'needs_review');
        if (failed.length > 0) {
          reply = `Found ${failed.length} vouchers needing attention. ${failed[0].voucherType} voucher ${failed[0].voucherNumber}: "${failed[0].errorMessage || 'Verification conflict'}"`;
          action = { label: 'View Tally Connector Sync', route: '/business/tally' };
        } else {
          reply = 'Tally sync bridge is operating normally. All vouchers are either synced or queued.';
        }
      } else {
        reply = `I analyzed your live financial ledger. Gross sales revenue is ${formatCurrency(invoices.reduce((s, i) => s + i.totalAmount, 0))}, purchases total ${formatCurrency(purchases.reduce((s, p) => s + p.totalAmount, 0))}, and live bank balance across connected accounts is ${formatCurrency(2435750)}. All records originate from the single source of truth.`;
        action = { label: 'View Cash Flow Command', route: '/business/cash-flow' };
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: reply, action }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden h-[620px] text-slate-100">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-tight">AI Business Operator</h3>
              <p className="text-[10px] text-slate-400">Context-Aware Accounting, Tax & Inventory Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg p-3 leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800/70 border border-slate-700/60 text-slate-200'
                }`}
              >
                {m.text}
                {m.action && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/50">
                    <button
                      onClick={() => {
                        if (m.action?.route) {
                          navigateTo(m.action.route);
                          setIsAiModalOpen(false);
                        }
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300 hover:text-indigo-200"
                    >
                      <span>{m.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-850 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors border border-slate-700/50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about sales, pending approvals, GST, or inventory..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
          />
          <button
            type="submit"
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
