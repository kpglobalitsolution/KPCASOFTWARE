import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShoppingCart,
  Truck,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { WorkspaceType } from '../../types';

export const WorkspaceSelectView: React.FC = () => {
  const { currentUser, tenants, selectWorkspace, logout, navigateTo } = useApp();

  const memberships = currentUser.memberships || [];

  const getWorkspaceMeta = (wsType: WorkspaceType) => {
    switch (wsType) {
      case 'business':
        return {
          icon: Building2,
          label: 'Business ERP',
          color: 'text-indigo-400 bg-indigo-950/70 border-indigo-700/50',
          badgeBg: 'bg-indigo-600'
        };
      case 'buyer':
        return {
          icon: ShoppingCart,
          label: 'B2B Buyer Hub',
          color: 'text-sky-400 bg-sky-950/70 border-sky-700/50',
          badgeBg: 'bg-sky-600'
        };
      case 'supplier':
        return {
          icon: Truck,
          label: 'Supplier Fulfillment',
          color: 'text-amber-400 bg-amber-950/70 border-amber-700/50',
          badgeBg: 'bg-amber-600'
        };
      case 'ca':
        return {
          icon: GraduationCap,
          label: 'CA Firm Practice',
          color: 'text-emerald-400 bg-emerald-950/70 border-emerald-700/50',
          badgeBg: 'bg-emerald-600'
        };
      case 'admin':
        return {
          icon: ShieldCheck,
          label: 'Platform Governance',
          color: 'text-purple-400 bg-purple-950/70 border-purple-700/50',
          badgeBg: 'bg-purple-600'
        };
      default:
        return {
          icon: Building2,
          label: 'Business',
          color: 'text-indigo-400 bg-indigo-950/70 border-indigo-700/50',
          badgeBg: 'bg-indigo-600'
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/40 text-indigo-300 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Multi-Workspace Session Authorization</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Select Your Workspace
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-lg mx-auto">
          Welcome back, <span className="text-slate-200 font-semibold">{currentUser.name}</span>. You have access to {memberships.length} authorized workspaces in VyapaarOS. Please select the organization you wish to manage:
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl shadow-2xl backdrop-blur-sm space-y-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Authorized Workspaces ({memberships.length})</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> RBAC Validated
            </span>
          </div>

          <div className="space-y-3">
            {memberships.map((mem) => {
              const meta = getWorkspaceMeta(mem.workspaceType);
              const Icon = meta.icon;
              const tenant = tenants.find((t) => t.id === mem.tenantId);

              return (
                <div
                  key={mem.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-950 transition-all gap-4 group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${meta.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {mem.organizationName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white ${meta.badgeBg}`}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-1">
                        <span>Role: <strong className="text-slate-300 font-medium">{mem.role}</strong></span>
                        {tenant?.gstin && (
                          <span>GSTIN: <span className="font-mono text-slate-300">{tenant.gstin}</span></span>
                        )}
                        <span>Location: {tenant?.city || 'HQ'}, {tenant?.state || 'India'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1.5 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>Last active: {mem.lastAccessedAt ? new Date(mem.lastAccessedAt).toLocaleDateString('en-IN') : 'Recent'}</span>
                        {!mem.onboardingCompleted && (
                          <span className="text-amber-400 ml-2 font-sans font-medium">
                            · Setup in progress
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                    <button
                      onClick={() => selectWorkspace(mem.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5 w-full sm:w-auto justify-center"
                    >
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px]">
              Signed in as <strong className="text-slate-200">{currentUser.email}</strong>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigateTo('/')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to Welcome Landing
          </button>
        </div>
      </div>
    </div>
  );
};
