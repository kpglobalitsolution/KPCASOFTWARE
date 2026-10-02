import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ImpersonationBanner } from './components/common/ImpersonationBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { QuickCreateModal } from './components/common/QuickCreateModal';
import { CommandPalette } from './components/common/CommandPalette';
import { TransactionDnaModal } from './components/common/TransactionDnaModal';
import { DocumentViewerModal } from './components/common/DocumentViewerModal';
import { AiOperatorModal } from './components/ai/AiOperatorModal';

// Auth & Starting Experience
import { LandingView } from './components/auth/LandingView';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { WorkspaceSelectView } from './components/auth/WorkspaceSelectView';
import { BusinessOnboardingView } from './components/auth/BusinessOnboardingView';
import { BuyerOnboardingView } from './components/auth/BuyerOnboardingView';
import { SupplierOnboardingView } from './components/auth/SupplierOnboardingView';
import { CaOnboardingView } from './components/auth/CaOnboardingView';
import { AuthGuard } from './components/auth/AuthGuard';
import { WorkspaceGuard } from './components/auth/WorkspaceGuard';

// Business views
import { DashboardView } from './components/business/DashboardView';
import { TodayView } from './components/business/TodayView';
import { SalesView } from './components/business/SalesView';
import { QuotationsView } from './components/business/QuotationsView';
import { OrdersView } from './components/business/OrdersView';
import { PurchasesView } from './components/business/PurchasesView';
import { InventoryView } from './components/business/InventoryView';
import { CustomersView } from './components/business/CustomersView';
import { SuppliersView } from './components/business/SuppliersView';
import { PaymentsView } from './components/business/PaymentsView';
import { ExpensesView } from './components/business/ExpensesView';
import { AccountingView } from './components/business/AccountingView';
import { BankingView } from './components/business/BankingView';
import { GstView } from './components/business/GstView';
import { TallyView } from './components/business/TallyView';
import { DataInboxView } from './components/business/DataInboxView';
import { CashFlowView } from './components/business/CashFlowView';
import { DocumentDesigner } from './components/designer/DocumentDesigner';
import { ReportsView } from './components/business/ReportsView';
import { AutomationView } from './components/business/AutomationView';
import { CaConnectionsView } from './components/business/CaConnectionsView';
import { SettingsView } from './components/business/SettingsView';

// Other workspaces
import { BuyerWorkspace } from './components/buyer/BuyerWorkspace';
import { SupplierWorkspace } from './components/supplier/SupplierWorkspace';
import { CaWorkspace } from './components/ca/CaWorkspace';
import { AdminWorkspace } from './components/admin/AdminWorkspace';

const MainRouter: React.FC = () => {
  const { workspace, currentRoute } = useApp();

  // Route routing logic
  if (workspace === 'buyer') {
    return <BuyerWorkspace />;
  }
  if (workspace === 'supplier') {
    return <SupplierWorkspace />;
  }
  if (workspace === 'ca') {
    return <CaWorkspace />;
  }
  if (workspace === 'admin') {
    return <AdminWorkspace />;
  }

  // Business workspace routes
  switch (currentRoute) {
    case '/business/dashboard':
      return <DashboardView />;
    case '/business/today':
      return <TodayView />;
    case '/business/sales':
    case '/business/invoices':
      return <SalesView />;
    case '/business/quotations':
      return <QuotationsView />;
    case '/business/orders':
      return <OrdersView />;
    case '/business/purchases':
    case '/business/purchase-orders':
      return <PurchasesView />;
    case '/business/inventory':
      return <InventoryView />;
    case '/business/customers':
      return <CustomersView />;
    case '/business/suppliers':
      return <SuppliersView />;
    case '/business/payments':
      return <PaymentsView />;
    case '/business/expenses':
      return <ExpensesView />;
    case '/business/accounting':
      return <AccountingView />;
    case '/business/banking':
      return <BankingView />;
    case '/business/gst':
      return <GstView />;
    case '/business/tally':
      return <TallyView />;
    case '/business/data-inbox':
      return <DataInboxView />;
    case '/business/cash-flow':
      return <CashFlowView />;
    case '/business/templates':
    case '/business/templates/new':
      return <DocumentDesigner />;
    case '/business/reports':
      return <ReportsView />;
    case '/business/automation':
      return <AutomationView />;
    case '/business/ca-connections':
      return <CaConnectionsView />;
    case '/business/settings':
      return <SettingsView />;
    default:
      return <DashboardView />;
  }
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('VyapaarOS Boundary Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center text-slate-100">
          <div className="p-3 rounded-full bg-rose-500/20 text-rose-400 mb-4 border border-rose-500/30">
            ⚠️
          </div>
          <h2 className="text-base font-bold text-white">An unexpected state error occurred</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            The single source of truth caught an isolated component error. Your accounting records and transactions remain secure and undamaged.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded text-xs text-white"
          >
            Reload Workspace
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppLayout: React.FC = () => {
  const { isAuthenticated, currentRoute } = useApp();

  // 1. Unauthenticated starting experience and public guest routes
  if (currentRoute === '/login') {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }
  if (currentRoute === '/register') {
    return (
      <>
        <RegisterView />
        <ToastContainer />
      </>
    );
  }
  if (!isAuthenticated && currentRoute === '/') {
    // Default starting page: Landing / Welcome
    return (
      <>
        <LandingView />
        <ToastContainer />
      </>
    );
  }

  // 2. Protected Routes wrapped with AuthGuard

  // Multi-workspace selection screen
  if (currentRoute === '/workspace/select') {
    return (
      <AuthGuard>
        <WorkspaceSelectView />
        <ToastContainer />
      </AuthGuard>
    );
  }

  // Onboarding flows wrapped with AuthGuard and WorkspaceGuard
  if (currentRoute === '/business/onboarding') {
    return (
      <AuthGuard>
        <WorkspaceGuard requiredWorkspace="business">
          <BusinessOnboardingView />
          <ToastContainer />
        </WorkspaceGuard>
      </AuthGuard>
    );
  }
  if (currentRoute === '/buyer/onboarding') {
    return (
      <AuthGuard>
        <WorkspaceGuard requiredWorkspace="buyer">
          <BuyerOnboardingView />
          <ToastContainer />
        </WorkspaceGuard>
      </AuthGuard>
    );
  }
  if (currentRoute === '/supplier/onboarding') {
    return (
      <AuthGuard>
        <WorkspaceGuard requiredWorkspace="supplier">
          <SupplierOnboardingView />
          <ToastContainer />
        </WorkspaceGuard>
      </AuthGuard>
    );
  }
  if (currentRoute === '/ca/onboarding') {
    return (
      <AuthGuard>
        <WorkspaceGuard requiredWorkspace="ca">
          <CaOnboardingView />
          <ToastContainer />
        </WorkspaceGuard>
      </AuthGuard>
    );
  }

  // 3. Authenticated workspace layout with Sidebar, Header & MainRouter
  // Fully secured by AuthGuard and WorkspaceGuard
  return (
    <AuthGuard>
      <WorkspaceGuard>
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
          <ImpersonationBanner />
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <div className="no-print">
              <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto bg-slate-950/50">
              <ErrorBoundary>
                <MainRouter />
              </ErrorBoundary>
            </main>
          </div>

          {/* Global Modals & Notifications */}
          <QuickCreateModal />
          <CommandPalette />
          <TransactionDnaModal />
          <DocumentViewerModal />
          <AiOperatorModal />
          <ToastContainer />
        </div>
      </WorkspaceGuard>
    </AuthGuard>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
