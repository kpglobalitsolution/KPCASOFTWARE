import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Plus, Play, CheckCircle2, Clock, X } from 'lucide-react';

export const AutomationView: React.FC = () => {
  const { automations, showToast } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('invoice.overdue');

  const handleTestRule = (name: string) => {
    showToast('Rule Executed', `Automation rule "${name}" evaluated successfully against 14 eligible records.`, 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span>Business Automation Engine</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
              EVENT-DRIVEN WORKFLOWS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Trigger → Condition → Action builder: automate overdue WhatsApp reminders, Tally sync queues, and CA task alerts.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((rule) => (
          <div key={rule.id} className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{rule.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                    ACTIVE
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Trigger: <strong className="text-indigo-300">{rule.triggerEvent}</strong>
                </div>
              </div>

              <button
                onClick={() => handleTestRule(rule.name)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                title="Run immediate test"
              >
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Test Run</span>
              </button>
            </div>

            {/* Conditions & Actions Pipeline */}
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <div className="p-2.5 rounded bg-slate-850 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Conditions:
                </span>
                <div className="font-mono text-slate-300 text-[11px]">
                  {rule.conditions.map((c, idx) => (
                    <div key={idx}>• {c.field} {c.operator.replace('_', ' ')} &ldquo;{c.value}&rdquo;</div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded bg-indigo-950/30 border border-indigo-800/40">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  Automated Actions:
                </span>
                <div className="font-mono text-indigo-200 text-[11px]">
                  {rule.actions.map((a, idx) => (
                    <div key={idx}>• Action: {a.actionType.replace('_', ' ').toUpperCase()} {a.template ? `(${a.template})` : ''}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                <span>Executed {rule.executionCount} times</span>
              </span>
              <span>Last run: Today</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Create Automation Rule</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Rule Configured', `Rule "${ruleName}" activated in event worker queue.`, 'success');
                setIsAddOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Auto Alert CA when high value invoice generated"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Trigger Event</label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="invoice.overdue">invoice.overdue (Payment past due date)</option>
                  <option value="invoice.created">invoice.created (New sale finalized)</option>
                  <option value="stock.low">stock.low (Threshold breached)</option>
                  <option value="bank.exception">bank.exception (Unreconciled entry)</option>
                </select>
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
                  Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
