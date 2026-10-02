import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { Tenant, User, SubscriptionPlan, AuditLogItem } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  LayoutDashboard,
  Building,
  Users,
  CreditCard,
  Layers,
  Lock,
  FileCode,
  ShieldAlert,
  ArrowRight,
  LogOut,
  RefreshCw,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';

export const AdminWorkspace: React.FC = () => {
  const {
    tenants,
    users,
    plans,
    auditLogs,
    impersonateUser,
    impersonatedUser,
    exitImpersonation,
    showToast
  } = useApp();

  type AdminTab = 'dashboard' | 'tenants' | 'users' | 'plans' | 'features' | 'security' | 'logs';
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const [impersonateModalUser, setImpersonateModalUser] = useState<User | null>(null);
  const [impersonateReason, setImpersonateReason] = useState('');

  const [featureFlags, setFeatureFlags] = useState({
    enableTallySync: true,
    enableGstAutomations: true,
    enableOcrVision: true,
    enableWhatsAppApi: true,
    enableRestWebhooks: true,
    enableAiBusinessOperator: true
  });

  const handleStartImpersonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!impersonateModalUser || !impersonateReason) return;
    impersonateUser(impersonateModalUser, impersonateReason);
    setImpersonateModalUser(null);
    setImpersonateReason('');
  };

  const tenantColumns: Column<Tenant>[] = [
    {
      key: 'name',
      header: 'Organization Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="text-[10px] text-slate-400 font-mono">
            {row.type.toUpperCase()} · GSTIN: {row.gstin || 'None'}
          </div>
        </div>
      )
    },
    {
      key: 'city',
      header: 'Location',
      render: (row) => <span className="text-slate-300">{row.city}, {row.state}</span>
    },
    {
      key: 'planId',
      header: 'Subscription Plan',
      render: (row) => {
        const p = plans.find((pl) => pl.id === row.planId);
        return (
          <span className="font-mono text-indigo-300 font-medium">
            {p?.name || row.planId}
          </span>
        );
      }
    },
    {
      key: 'subscriptionStatus',
      header: 'Status',
      render: (row) => (
        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
            row.subscriptionStatus === 'active'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
              : 'bg-amber-950 text-amber-400 border-amber-800/40'
          }`}
        >
          {row.subscriptionStatus}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (row) => <span className="font-mono text-slate-400">{formatDate(row.createdAt)}</span>
    }
  ];

  const userColumns: Column<User>[] = [
    {
      key: 'name',
      header: 'User Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="text-[10px] text-slate-400">{row.email}</div>
        </div>
      )
    },
    {
      key: 'organizationName',
      header: 'Assigned Organization',
      render: (row) => <span className="text-slate-300">{row.organizationName}</span>
    },
    {
      key: 'role',
      header: 'RBAC Role',
      render: (row) => (
        <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
          {row.role}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Account Status',
      render: (row) => (
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
          {row.status.toUpperCase()}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Super Admin Access',
      align: 'right',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => setImpersonateModalUser(row)}
          className="px-2.5 py-1 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/40 rounded transition-colors"
        >
          Login as User
        </button>
      )
    }
  ];

  const logColumns: Column<AuditLogItem>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (row) => <span className="font-mono text-slate-400 text-[11px]">{formatDate(row.timestamp)}</span>
    },
    {
      key: 'actor',
      header: 'Security Actor',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.actor}</div>
          <div className="text-[10px] font-mono text-slate-400">{row.actorEmail}</div>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Audit Action',
      render: (row) => (
        <span className="font-mono text-indigo-300 font-semibold">{row.action}</span>
      )
    },
    {
      key: 'details',
      header: 'Audit Trail Details',
      render: (row) => <span className="text-slate-300 max-w-sm truncate block">{row.details}</span>
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-xs text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" />
              <span>Super Admin — SaaS Operational Control Center</span>
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded">
              PLATFORM HQ
            </span>
          </div>
          <p className="text-slate-400 mt-0.5">
            Operational governance: multi-tenant provisioning, subscription entitlements, feature flags, and secure audit logging.
          </p>
        </div>

        {impersonatedUser && (
          <button
            onClick={exitImpersonation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Impersonation</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 text-xs">
        {[
          { key: 'dashboard', label: 'Platform Metrics' },
          { key: 'tenants', label: `Tenants (${tenants.length})` },
          { key: 'users', label: `Users & Impersonation (${users.length})` },
          { key: 'plans', label: 'Subscription Plans & Quotas' },
          { key: 'features', label: 'Feature Flags & Limits' },
          { key: 'security', label: 'Security Center' },
          { key: 'logs', label: `Audit Trail (${auditLogs.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as AdminTab)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Active SaaS Tenants</span>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {tenants.length} Organizations
              </div>
              <div className="text-[11px] text-slate-400">100% strict server-side tenant isolation</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Total Platform MRR</span>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {formatCurrency(124970)}
              </div>
              <div className="text-[11px] text-slate-400">+22.4% Annual recurring run-rate</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">Tally Sync Success Rate</span>
              <div className="text-xl font-bold font-mono text-indigo-400 tabular-nums">
                99.4%
              </div>
              <div className="text-[11px] text-slate-400">Live webhook worker queues nominal</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
              <span className="text-slate-400 text-xs">OCR Vision Bill Parsed</span>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                4,892 Documents
              </div>
              <div className="text-[11px] text-slate-400">Average accuracy: 96.8%</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Zero Re-Entry Platform Telemetry
            </h3>
            <p className="text-slate-300 leading-relaxed">
              VyapaarOS single source of truth prevents duplicate record creation across Business, Buyer, Supplier, and CA workspaces.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Tenants */}
      {activeTab === 'tenants' && (
        <DataTable
          data={tenants}
          columns={tenantColumns}
          searchPlaceholder="Search tenant by trade name, city or GSTIN..."
          exportFileName="vyapaaros_tenants"
        />
      )}

      {/* Tab 3: Users */}
      {activeTab === 'users' && (
        <DataTable
          data={users}
          columns={userColumns}
          searchPlaceholder="Search user by name, email or role..."
          exportFileName="vyapaaros_users"
        />
      )}

      {/* Tab 4: Plans */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div key={p.id} className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{p.name}</h3>
                  <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded">
                    {p.target.toUpperCase()}
                  </span>
                </div>
                <div className="font-mono text-xl font-bold text-white">
                  {formatCurrency(p.priceMonthly)} <span className="text-xs text-slate-400 font-sans font-normal">/ mo</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>Max Users: <strong>{p.maxUsers}</strong></div>
                  <div>Max Invoices: <strong>{p.maxInvoicesMonthly} / mo</strong></div>
                  <div>Storage: <strong>{p.maxStorageGb} GB</strong></div>
                  <div>AI Credits: <strong>{p.aiCreditsMonthly} / mo</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-300">
                {p.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Features */}
      {activeTab === 'features' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 max-w-xl">
          <h3 className="text-sm font-bold text-white">Global Platform Feature Flags</h3>
          <div className="space-y-3">
            {[
              { key: 'enableTallySync', label: 'Tally Prime Live XML/ODBC Connector' },
              { key: 'enableGstAutomations', label: 'GST GSP Integration & GSTR-2B Auto Recon' },
              { key: 'enableOcrVision', label: 'AI Document Vision & OCR Ingestion' },
              { key: 'enableWhatsAppApi', label: 'WhatsApp Business API for Invoices & Reminders' },
              { key: 'enableRestWebhooks', label: 'Developer REST APIs & Event Webhooks' },
              { key: 'enableAiBusinessOperator', label: 'Context-Aware AI Business Operator' }
            ].map((f) => (
              <label key={f.key} className="p-3 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between cursor-pointer">
                <span className="font-medium text-slate-200">{f.label}</span>
                <input
                  type="checkbox"
                  checked={(featureFlags as any)[f.key]}
                  onChange={(e) => {
                    setFeatureFlags((prev) => ({ ...prev, [f.key]: e.target.checked }));
                    showToast('Feature Flag Updated', `${f.label} toggled.`, 'info');
                  }}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Security */}
      {activeTab === 'security' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white">Platform Security & Governance Policies</h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans block text-[10px]">Multi-Tenant Enforcement:</span>
              <span className="text-emerald-400 font-bold">Strict PostgreSQL Row-Level Isolation (tenant_id)</span>
            </div>
            <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans block text-[10px]">Audit Logging:</span>
              <span className="text-slate-200 font-bold">Append-Only Immutable Event Stream</span>
            </div>
            <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans block text-[10px]">Maker-Checker Dual Sign-off:</span>
              <span className="text-indigo-300 font-bold">Enabled for high-value journals and GST filings</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Logs */}
      {activeTab === 'logs' && (
        <DataTable
          data={auditLogs}
          columns={logColumns}
          searchPlaceholder="Search audit events by action, actor or details..."
          exportFileName="vyapaaros_audit_trail"
        />
      )}

      {/* Impersonate Modal */}
      {impersonateModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Start Secure Impersonation</h3>
              </div>
              <button onClick={() => setImpersonateModalUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg text-amber-200 leading-relaxed">
              You are about to log in as <strong>{impersonateModalUser.name}</strong> ({impersonateModalUser.organizationName}). All actions will be logged in the immutable security audit trail.
            </div>

            <form onSubmit={handleStartImpersonation} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Required Operational Justification / Reason:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assisting customer with GST reconciliation support ticket #892"
                  value={impersonateReason}
                  onChange={(e) => setImpersonateReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setImpersonateModalUser(null)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Authorize & Switch Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
