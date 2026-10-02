import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Receipt,
  FileSpreadsheet,
  Package,
  Users,
  Building,
  CreditCard,
  ArrowDownLeft,
  BookOpen,
  Landmark,
  ShieldCheck,
  RefreshCw,
  Inbox,
  TrendingUp,
  FileCode,
  BarChart3,
  Bot,
  Link2,
  Settings,
  ShoppingBag,
  FileCheck,
  Truck,
  Briefcase,
  FileQuestion,
  HelpCircle,
  FileWarning,
  Layers,
  Lock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { workspace, currentRoute, navigateTo, tallyQueue, gstMismatches, dataInbox } = useApp();

  const pendingTally = tallyQueue.filter((t) => t.status === 'pending' || t.status === 'failed').length;
  const pendingGst = gstMismatches.filter((g) => g.status === 'pending').length;
  const pendingInbox = dataInbox.filter((i) => i.status === 'needs_review' || i.status === 'new').length;

  interface NavItem {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }

  const businessNav: { section: string; items: NavItem[] }[] = [
    {
      section: 'COMMAND',
      items: [
        { path: '/business/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/business/today', label: 'Today Command', icon: CalendarCheck, badge: pendingTally + pendingGst }
      ]
    },
    {
      section: 'SALES & REVENUE',
      items: [
        { path: '/business/sales', label: 'Sales Invoices', icon: Receipt },
        { path: '/business/quotations', label: 'Quotations', icon: FileSpreadsheet },
        { path: '/business/orders', label: 'Sales Orders', icon: ShoppingBag },
        { path: '/business/customers', label: 'Customers', icon: Users }
      ]
    },
    {
      section: 'PURCHASE & EXPENSE',
      items: [
        { path: '/business/purchases', label: 'Purchase Bills', icon: ArrowDownLeft },
        { path: '/business/purchase-orders', label: 'Purchase Orders', icon: FileCheck },
        { path: '/business/suppliers', label: 'Suppliers', icon: Building },
        { path: '/business/expenses', label: 'Expenses', icon: CreditCard }
      ]
    },
    {
      section: 'INVENTORY & ASSETS',
      items: [
        { path: '/business/inventory', label: 'Stock & Items', icon: Package }
      ]
    },
    {
      section: 'FINANCE & AUDIT',
      items: [
        { path: '/business/payments', label: 'Payments & Receipts', icon: CreditCard },
        { path: '/business/banking', label: 'Banking & Recon', icon: Landmark },
        { path: '/business/accounting', label: 'Accounting & Ledger', icon: BookOpen },
        { path: '/business/gst', label: 'GST Compliance', icon: ShieldCheck, badge: pendingGst, badgeColor: 'bg-rose-500' },
        { path: '/business/tally', label: 'Tally Prime Sync', icon: RefreshCw, badge: pendingTally, badgeColor: 'bg-amber-500' }
      ]
    },
    {
      section: 'INTELLIGENCE & AUTOMATION',
      items: [
        { path: '/business/data-inbox', label: 'Data Inbox & OCR', icon: Inbox, badge: pendingInbox, badgeColor: 'bg-indigo-500' },
        { path: '/business/cash-flow', label: 'Cash Flow Center', icon: TrendingUp },
        { path: '/business/templates', label: 'Document Designer', icon: FileCode },
        { path: '/business/automation', label: 'Automation Rules', icon: Bot },
        { path: '/business/reports', label: 'Reports & Analytics', icon: BarChart3 },
        { path: '/business/ca-connections', label: 'CA Collaboration', icon: Link2 },
        { path: '/business/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const buyerNav: { section: string; items: NavItem[] }[] = [
    {
      section: 'BUYER WORKSPACE',
      items: [
        { path: '/buyer/dashboard', label: 'Procurement Overview', icon: LayoutDashboard },
        { path: '/buyer/suppliers', label: 'Supplier Discovery & RFQ', icon: Building },
        { path: '/buyer/purchase-orders', label: 'Purchase Orders', icon: FileCheck },
        { path: '/buyer/receipts', label: 'Goods Receipts (GRN)', icon: Truck },
        { path: '/buyer/invoices', label: 'Invoices & Payables', icon: Receipt },
        { path: '/buyer/payments', label: 'Vendor Payments', icon: CreditCard },
        { path: '/buyer/inventory', label: 'Warehouse Intake', icon: Package },
        { path: '/buyer/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const supplierNav: { section: string; items: NavItem[] }[] = [
    {
      section: 'SUPPLIER WORKSPACE',
      items: [
        { path: '/supplier/dashboard', label: 'Wholesale Overview', icon: LayoutDashboard },
        { path: '/supplier/customers', label: 'B2B Customers', icon: Users },
        { path: '/supplier/quotations', label: 'Price Quotes', icon: FileSpreadsheet },
        { path: '/supplier/orders', label: 'Incoming Orders', icon: ShoppingBag },
        { path: '/supplier/deliveries', label: 'Delivery Challans', icon: Truck },
        { path: '/supplier/invoices', label: 'Dispatched Invoices', icon: Receipt },
        { path: '/supplier/receivables', label: 'Collections & Aging', icon: CreditCard },
        { path: '/supplier/inventory', label: 'Stock Available', icon: Package },
        { path: '/supplier/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const caNav: { section: string; items: NavItem[] }[] = [
    {
      section: 'PRACTICE COMMAND',
      items: [
        { path: '/ca/dashboard', label: 'CA Dashboard', icon: LayoutDashboard },
        { path: '/ca/clients', label: 'Client Portfolio', icon: Briefcase },
        { path: '/ca/closing', label: '1-Click Month Close', icon: CalendarCheck }
      ]
    },
    {
      section: 'AUDIT & COMPLIANCE',
      items: [
        { path: '/ca/accounting', label: 'Client Books Review', icon: BookOpen },
        { path: '/ca/gst', label: 'GST 2B Reconciliation', icon: ShieldCheck, badge: pendingGst, badgeColor: 'bg-rose-500' },
        { path: '/ca/tax', label: 'TDS & Direct Tax', icon: FileSpreadsheet },
        { path: '/ca/documents', label: 'Document Requests', icon: FileQuestion },
        { path: '/ca/notices', label: 'Notice Intelligence', icon: FileWarning },
        { path: '/ca/audit', label: 'Audit Workpapers', icon: ShieldCheck },
        { path: '/ca/tasks', label: 'Deadlines & Tasks', icon: Layers },
        { path: '/ca/settings', label: 'Practice Settings', icon: Settings }
      ]
    }
  ];

  const adminNav: { section: string; items: NavItem[] }[] = [
    {
      section: 'SAAS OPERATIONS',
      items: [
        { path: '/admin/dashboard', label: 'Operations Console', icon: LayoutDashboard },
        { path: '/admin/businesses', label: 'Business Tenants', icon: Building },
        { path: '/admin/ca-firms', label: 'CA Firms', icon: Briefcase },
        { path: '/admin/users', label: 'User Directory', icon: Users },
        { path: '/admin/subscriptions', label: 'Subscriptions & Plans', icon: CreditCard },
        { path: '/admin/features', label: 'Feature Flags & Limits', icon: Layers },
        { path: '/admin/usage', label: 'SaaS Usage Analytics', icon: BarChart3 },
        { path: '/admin/security', label: 'Security & Impersonate', icon: Lock },
        { path: '/admin/logs', label: 'System & Audit Logs', icon: FileCode },
        { path: '/admin/settings', label: 'Platform Settings', icon: Settings }
      ]
    }
  ];

  let currentNavGroup = businessNav;
  if (workspace === 'buyer') currentNavGroup = buyerNav;
  if (workspace === 'supplier') currentNavGroup = supplierNav;
  if (workspace === 'ca') currentNavGroup = caNav;
  if (workspace === 'admin') currentNavGroup = adminNav;

  return (
    <aside className="w-60 shrink-0 border-r border-slate-800 bg-slate-900/80 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 select-none">
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-xs">
        {currentNavGroup.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {group.section}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.path || currentRoute.startsWith(item.path + '/');
                return (
                  <button
                    key={item.path}
                    onClick={() => navigateTo(item.path)}
                    className={`group flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full text-white ${
                          item.badgeColor || 'bg-indigo-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="truncate">VyapaarOS v3.2</span>
        <button
          onClick={() => navigateTo('/business/settings')}
          className="hover:text-slate-300 transition-colors flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Support</span>
        </button>
      </div>
    </aside>
  );
};
