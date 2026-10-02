import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShoppingCart,
  Truck,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Receipt,
  Landmark,
  RefreshCw,
  GitCommit,
  PhoneCall,
  Mail,
  HelpCircle,
  X,
  Layers,
  Zap,
  Globe2,
  Lock
} from 'lucide-react';
import { WorkspaceType } from '../../types';

export const LandingView: React.FC = () => {
  const { navigateTo, loginAsPersona } = useApp();
  const [activeTab, setActiveTab] = useState<'business' | 'buyer' | 'supplier' | 'ca' | 'admin'>('business');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  const personaList = [
    {
      key: 'owner' as const,
      workspace: 'business' as WorkspaceType,
      title: 'Business Owner / Admin',
      org: 'Shree Retail Mart Pvt Ltd',
      role: 'Owner (Parth Kanjariya)',
      icon: Building2,
      color: 'indigo',
      badge: 'Full ERP & GST'
    },
    {
      key: 'ca' as const,
      workspace: 'ca' as WorkspaceType,
      title: 'Chartered Accountant',
      org: 'KP Tax & Advisory',
      role: 'CA Partner (CA Kailash Patel)',
      icon: GraduationCap,
      color: 'emerald',
      badge: 'Audit & Compliance'
    },
    {
      key: 'buyer' as const,
      workspace: 'buyer' as WorkspaceType,
      title: 'B2B Buyer',
      org: 'ABC Traders',
      role: 'Procurement (Rohit Shah)',
      icon: ShoppingCart,
      color: 'sky',
      badge: 'Purchase & POs'
    },
    {
      key: 'supplier' as const,
      workspace: 'supplier' as WorkspaceType,
      title: 'Supplier & Vendor',
      org: 'Global Wholesale Distributors',
      role: 'Fulfillment (Vikas Sharma)',
      icon: Truck,
      color: 'amber',
      badge: 'Sales & Inventory'
    },
    {
      key: 'admin' as const,
      workspace: 'admin' as WorkspaceType,
      title: 'Platform Super Admin',
      org: 'VyapaarOS Platform Infrastructure',
      role: 'Super Admin (System)',
      icon: ShieldCheck,
      color: 'purple',
      badge: 'Tenants & Security'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
            V
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">VyapaarOS</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-semibold tracking-wider text-indigo-400 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-800/40">
              Enterprise B2B
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Support
          </button>
          <button
            onClick={() => navigateTo('/login')}
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-md border border-slate-700 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigateTo('/register')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-sm shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <span>Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 px-6 lg:px-12 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-700/50 text-indigo-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>ENTER ONCE → CONNECT EVERYTHING → RECONCILE AUTOMATICALLY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">VyapaarOS</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal">
            Business Operating System for Modern Businesses, Buyers, Suppliers &amp; CA Firms.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            A single, production-grade connected environment uniting sales, purchase orders, inventory, double-entry bookkeeping, GST 2B reconciliation, Tally Prime synchronization, and chartered accountant verification.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('/login')}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Login to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('/register')}
              className="px-6 py-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <span>Create Account</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('explore-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-3 rounded-lg text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
            >
              Explore VyapaarOS ↓
            </button>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="mt-12 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Instant Evaluator Persona Login (1-Click)
                </span>
                <p className="text-[11px] text-slate-400">
                  Select any pre-configured authorized persona to test the role-based workspace immediately:
                </p>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded self-start sm:self-auto font-mono">
                No password required for preview
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {personaList.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.key}
                    onClick={() => loginAsPersona(p.key)}
                    className="flex flex-col p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-indigo-500/70 hover:bg-indigo-950/20 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:bg-indigo-950/80 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 group-hover:text-indigo-300">
                        {p.badge}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">{p.org}</span>
                    <span className="text-[9px] text-indigo-400 mt-1 flex items-center gap-1 font-medium">
                      Enter Workspace →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section id="explore-section" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            One Core Engine. Dedicated Workspaces.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            VyapaarOS assigns each user a personalized, high-performance workspace tailored to their exact business role.
          </p>

          {/* Workspace Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 p-1 bg-slate-900 border border-slate-800 rounded-lg max-w-2xl mx-auto">
            {[
              { id: 'business', label: '1. Business OS', icon: Building2 },
              { id: 'buyer', label: '2. Buyer Hub', icon: ShoppingCart },
              { id: 'supplier', label: '3. Supplier Portal', icon: Truck },
              { id: 'ca', label: '4. CA Practice', icon: GraduationCap },
              { id: 'admin', label: '5. Super Admin', icon: ShieldCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Detail Cards */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8">
          {activeTab === 'business' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/40 mb-3">
                  Business Operating System
                </div>
                <h3 className="text-xl font-bold text-white">Full-Spectrum Commercial Enterprise ERP</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Engineered specifically for retailers, distributors, and manufacturers. Eliminate double data entry between invoices, inventory tracking, accounts, and GST compliance.
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    'Instant GST Invoicing with HSN breakdown & Dynamic QR code',
                    'Real-time Multi-Warehouse inventory inwarding and stock alerts',
                    'Automated bank statement reconciliation with 99.4% match rate',
                    'Direct 2-way Tally Prime integration & automated voucher sync',
                    'Transaction DNA™ traceability showing origin, approvals, and journals'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => loginAsPersona('owner')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Open Business Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigateTo('/register')}
                    className="px-3 py-2 text-slate-300 hover:text-white text-xs font-medium"
                  >
                    Register Business →
                  </button>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-[11px] text-slate-300 space-y-2">
                <div className="text-indigo-400 text-xs font-bold font-sans">Sample Transaction DNA Trail</div>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <div className="text-emerald-400">Step 1: Quotation #QT-2024-001</div>
                  <div className="text-slate-400 text-[10px]">Client: Apex Logistics · Total ₹1,42,400</div>
                </div>
                <div className="text-slate-500 pl-4">↓ Auto-converted on PO acceptance</div>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <div className="text-indigo-300">Step 2: Tax Invoice #INV-2024-0089</div>
                  <div className="text-slate-400 text-[10px]">CGST ₹10,800 · SGST ₹10,800 · E-way Generated</div>
                </div>
                <div className="text-slate-500 pl-4">↓ Auto-posted journal entry</div>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <div className="text-amber-300">Step 3: Journal #JV-882 &amp; Tally Bridge</div>
                  <div className="text-slate-400 text-[10px]">Synced to Tally Prime Company in 120ms</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'buyer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-800/40 mb-3">
                  B2B Buyer Workspace
                </div>
                <h3 className="text-xl font-bold text-white">Streamlined Purchasing &amp; Spend Control</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Empower procurement managers and buyers with structured purchase orders, approval limits, vendor catalogs, and 3-way matching before bill authorization.
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    'Purchase Requisitions & Multi-tier approval thresholds',
                    'Direct Purchase Order dispatch to connected suppliers',
                    'Automated 3-way matching between PO, Delivery Challan & Bill',
                    'Accounts Payable age analysis and early-payment discount tracking'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => loginAsPersona('buyer')}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Open Buyer Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigateTo('/register')}
                    className="px-3 py-2 text-slate-300 hover:text-white text-xs font-medium"
                  >
                    Register as Buyer →
                  </button>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                <div className="text-xs font-bold text-white mb-3">Procurement Overview</div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Active POs</span>
                    <div className="text-lg font-bold text-sky-400">14 Orders</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Pending Approval</span>
                    <div className="text-lg font-bold text-amber-400">2 Requisitions</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">Connected with 28 verified regional suppliers.</div>
              </div>
            </div>
          )}

          {activeTab === 'supplier' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800/40 mb-3">
                  Supplier &amp; Vendor Portal
                </div>
                <h3 className="text-xl font-bold text-white">Fulfillment, Catalogs &amp; Receivables</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Suppliers receive customer orders digitally, convert incoming purchase orders to delivery challans with 1 click, and monitor payment status directly from clients.
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    'Instant order notification when buyers approve purchase orders',
                    'Bulk product catalog management with tiered wholesale pricing',
                    'E-Way bill and dispatch documentation generation',
                    'Direct bank remittance advice and payment receipt logging'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => loginAsPersona('supplier')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Open Supplier Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigateTo('/register')}
                    className="px-3 py-2 text-slate-300 hover:text-white text-xs font-medium"
                  >
                    Register as Supplier →
                  </button>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                <div className="text-xs font-bold text-white mb-3">Supplier Fulfillment Matrix</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800 text-xs">
                    <div>
                      <span className="font-semibold text-slate-200">PO #PO-2024-881</span>
                      <span className="text-[10px] text-slate-400 block">Buyer: Shree Retail Mart</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                      Ready to Dispatch
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800 text-xs">
                    <div>
                      <span className="font-semibold text-slate-200">PO #PO-2024-879</span>
                      <span className="text-[10px] text-slate-400 block">Buyer: ABC Traders</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                      Dispatched · In Transit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ca' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/40 mb-3">
                  CA Firm &amp; Tax Practice
                </div>
                <h3 className="text-xl font-bold text-white">Client Portfolio Audit &amp; Compliance Hub</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Chartered Accountants gain read-and-verify access to connected client books. Perform GST 2B vs Purchase mismatches, TDS computations, and end-of-year audit reviews in minutes.
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    'Unified multi-client dashboard with real-time filing status',
                    'Automated GSTR-2B mismatch detector with auto-credit recommendation',
                    'Client document request workflows with secure evidence locker',
                    'Tax Notice Intelligence: deadline tracking, draft reply generator',
                    'Month-end health check engine validating negative cash & tax codes'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => loginAsPersona('ca')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Open CA Firm Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigateTo('/register')}
                    className="px-3 py-2 text-slate-300 hover:text-white text-xs font-medium"
                  >
                    Register CA Firm →
                  </button>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                <div className="text-xs font-bold text-white mb-3">Active Client Practice Monitor</div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200">Shree Retail Mart Pvt Ltd</span>
                      <span className="text-[10px] text-slate-400 block">GSTIN: 24AAACS1234A1Z5</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 rounded border border-amber-800/40">
                      1 ITC Mismatch
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200">ABC Traders</span>
                      <span className="text-[10px] text-slate-400 block">GSTIN: 24BBBCS5678B1Z2</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 rounded border border-emerald-800/40">
                      Books Clean
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800/40 mb-3">
                  Super Admin &amp; Governance
                </div>
                <h3 className="text-xl font-bold text-white">Platform Tenant &amp; Security Control Center</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Strictly controlled platform governance with immutable audit logging, cross-tenant telemetry, subscription lifecycle management, and audited zero-token user impersonation.
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    'Multi-tenant provisioning, status governance & health scores',
                    'Audited Impersonation Engine with mandatory justification logging',
                    'Immutable cryptographic audit trail recording all privileged actions',
                    'Feature flags, rate limit monitors and plan quota management'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => loginAsPersona('admin')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Launch Super Admin</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-slate-500 italic">
                    Public registration disabled for Super Admin.
                  </span>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                <div className="text-xs font-bold text-white mb-3">Security &amp; Tenant Telemetry</div>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400">Total Tenants</span>
                    <div className="text-base font-bold text-white">5 Active</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400">Audit Status</span>
                    <div className="text-base font-bold text-emerald-400">100% Sealed</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800 font-mono">
                  ISO-27001 · SOC-2 · GDPR Ready · RBI Guidelines Compliant
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust & Features Grid */}
      <section className="py-12 border-t border-slate-800/80 bg-slate-950 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="w-8 h-8 rounded bg-indigo-950/80 text-indigo-400 flex items-center justify-center mb-3">
                <Receipt className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">GST Invoicing &amp; 2B Sync</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                HSN summary, automated tax calculations, e-Way bills, and live GSTR-2B mismatch flags.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="w-8 h-8 rounded bg-emerald-950/80 text-emerald-400 flex items-center justify-center mb-3">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Tally Prime Bi-Directional</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero data re-entry. Auto sync ledger masters and vouchers into Tally Prime continuously.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="w-8 h-8 rounded bg-sky-950/80 text-sky-400 flex items-center justify-center mb-3">
                <Landmark className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Live Banking Auto-Match</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Bank feed parser reconciles invoice payments with bank credit lines automatically.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="w-8 h-8 rounded bg-purple-950/80 text-purple-400 flex items-center justify-center mb-3">
                <GitCommit className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Transaction DNA™</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Trace any rupee back to its original quote, PO, invoice, tax challan, and journal line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">VyapaarOS</span>
            <span>· All-in-One Multi-Tenant Business Operating System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setIsSupportModalOpen(true)} className="hover:text-slate-300">Support Center</button>
            <button onClick={() => navigateTo('/login')} className="hover:text-slate-300">Sign In</button>
            <button onClick={() => navigateTo('/register')} className="hover:text-slate-300">Register</button>
            <span className="text-slate-600">v2.5.0 Production Ready</span>
          </div>
        </div>
      </footer>

      {/* Support Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsSupportModalOpen(false);
                setSupportSent(false);
              }}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded bg-indigo-950 text-indigo-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">VyapaarOS Enterprise Support</h3>
                <span className="text-[11px] text-slate-400">Guaranteed 15-minute SLA for Business &amp; CA partners</span>
              </div>
            </div>

            {supportSent ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-white">Support Ticket Created</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Ticket #VOS-88241 assigned. Our senior technical desk is reviewing your request.
                </p>
                <button
                  onClick={() => {
                    setIsSupportModalOpen(false);
                    setSupportSent(false);
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-indigo-400" /> Helpline
                    </span>
                    <span className="font-semibold text-slate-200 text-xs block mt-0.5">+91 79 2656 7890</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-indigo-400" /> Support Desk
                    </span>
                    <span className="font-semibold text-slate-200 text-xs block mt-0.5">desk@vyapaaros.com</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Describe your enquiry or issue:
                  </label>
                  <textarea
                    rows={3}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="e.g., Assistance with GST 2B reconciliation or Tally connector setup..."
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsSupportModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (supportMessage.trim()) {
                        setSupportSent(true);
                      }
                    }}
                    disabled={!supportMessage.trim()}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded disabled:opacity-50"
                  >
                    Submit Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
