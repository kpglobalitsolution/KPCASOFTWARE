import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  WorkspaceType,
  AccountType,
  UserRole,
  WorkspaceMembership,
  UserSession,
  Tenant,
  User,
  Party,
  Product,
  SalesInvoice,
  Quotation,
  SalesOrder,
  PurchaseInvoice,
  PurchaseOrder,
  PaymentTransaction,
  Expense,
  LedgerAccount,
  JournalEntry,
  BankAccount,
  BankStatementItem,
  GstMismatch,
  TallySyncItem,
  DataInboxItem,
  TransactionDNA,
  CaClientConnection,
  CaDocumentRequest,
  CaTaxNotice,
  AutomationRule,
  DocumentTemplate,
  SubscriptionPlan,
  AuditLogItem,
  LineItem
} from '../types';
import {
  INITIAL_TENANTS,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_PARTIES,
  INITIAL_INVOICES,
  INITIAL_QUOTATIONS,
  INITIAL_SALES_ORDERS,
  INITIAL_PURCHASES,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_BANK_STATEMENTS,
  INITIAL_LEDGERS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_GST_MISMATCHES,
  INITIAL_TALLY_QUEUE,
  INITIAL_DATA_INBOX,
  INITIAL_CA_CONNECTIONS,
  INITIAL_CA_DOC_REQUESTS,
  INITIAL_TAX_NOTICES,
  INITIAL_AUTOMATIONS,
  INITIAL_TEMPLATES,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_TRANSACTION_DNAS
} from '../data/seedData';
import { calculateLineItem } from '../utils/formatters';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  currentUser: User;
  users: User[];
  login: (emailOrPhone: string, password?: string, targetWorkspace?: WorkspaceType) => boolean;
  loginAsPersona: (personaKey: 'owner' | 'ca' | 'buyer' | 'supplier' | 'admin') => void;
  logout: () => void;
  registerAccount: (data: {
    accountType: AccountType;
    fullName: string;
    email: string;
    mobile: string;
    password?: string;
    businessName: string;
    businessType?: string;
    industry?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    gstRegistered?: boolean;
    gstin?: string;
    pan?: string;
    currency?: string;
    numberOfBranches?: number;
    inventoryRequired?: boolean;
    accountingRequired?: boolean;
    gstRequired?: boolean;
    tallyRequired?: boolean;
    expectedSuppliers?: string;
    procurementCategories?: string;
    firmType?: string;
    expectedClients?: number;
  }) => void;
  completeOnboarding: (workspaceType: WorkspaceType) => void;
  selectWorkspace: (membershipId: string) => void;
  userSessions: UserSession[];
  revokeSession: (sessionId: string) => void;

  workspace: WorkspaceType;
  setWorkspace: (ws: WorkspaceType) => void;
  currentRoute: string;
  navigateTo: (route: string) => void;
  activeTenant: Tenant;
  setActiveTenant: (t: Tenant) => void;
  tenants: Tenant[];
  impersonatedUser: User | null;
  impersonationReason: string | null;
  impersonateUser: (user: User, reason: string) => void;
  exitImpersonation: () => void;

  // Data
  products: Product[];
  parties: Party[];
  invoices: SalesInvoice[];
  quotations: Quotation[];
  salesOrders: SalesOrder[];
  purchases: PurchaseInvoice[];
  purchaseOrders: PurchaseOrder[];
  payments: PaymentTransaction[];
  expenses: Expense[];
  ledgers: LedgerAccount[];
  journalEntries: JournalEntry[];
  bankAccounts: BankAccount[];
  bankStatements: BankStatementItem[];
  gstMismatches: GstMismatch[];
  tallyQueue: TallySyncItem[];
  dataInbox: DataInboxItem[];
  caConnections: CaClientConnection[];
  caDocRequests: CaDocumentRequest[];
  taxNotices: CaTaxNotice[];
  automations: AutomationRule[];
  templates: DocumentTemplate[];
  plans: SubscriptionPlan[];
  auditLogs: AuditLogItem[];

  // Action methods
  createSalesInvoice: (data: Partial<SalesInvoice>) => SalesInvoice;
  updateSalesInvoiceStatus: (id: string, status: SalesInvoice['status']) => void;
  createQuotation: (data: Partial<Quotation>) => Quotation;
  convertQuotationToOrder: (quotationId: string) => SalesOrder;
  convertOrderToInvoice: (orderId: string) => SalesInvoice;
  createPurchaseInvoice: (data: Partial<PurchaseInvoice>) => PurchaseInvoice;
  createPayment: (data: Partial<PaymentTransaction>) => PaymentTransaction;
  createExpense: (data: Partial<Expense>) => Expense;
  createProduct: (product: Partial<Product>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  stockAdjustment: (productId: string, warehouseId: string, adjustedQty: number, reason: any, notes: string) => void;
  createParty: (party: Partial<Party>) => Party;
  updateParty: (id: string, updates: Partial<Party>) => void;
  matchBankStatement: (statementId: string, transactionId: string) => void;
  unmatchBankStatement: (statementId: string) => void;
  syncTallyItem: (queueId: string) => void;
  retryAllTallyQueue: () => void;
  convertInboxItem: (itemId: string, targetType: 'purchase' | 'expense') => void;
  resolveGstMismatch: (id: string) => void;
  createCaDocRequest: (data: Partial<CaDocumentRequest>) => void;
  uploadCaDoc: (requestId: string, fileName: string) => void;
  runMonthEndCheck: () => { passed: boolean; issues: string[]; details: Record<string, any> };
  
  // Modals & UI Viewers
  isQuickCreateOpen: boolean;
  setIsQuickCreateOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  selectedDna: TransactionDNA | null;
  openDnaViewer: (dnaId: string) => void;
  closeDnaViewer: () => void;
  previewDocument: { type: string; id: string; data?: any } | null;
  openDocumentViewer: (type: string, id: string, data?: any) => void;
  closeDocumentViewer: () => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspace, setWorkspaceState] = useState<WorkspaceType>('business');
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [activeTenant, setActiveTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  const [impersonationReason, setImpersonationReason] = useState<string | null>(null);
  const [userSessions, setUserSessions] = useState<UserSession[]>([
    {
      id: 'sess-001',
      userId: 'usr-parth',
      deviceName: 'Chrome on macOS (1440x900)',
      ipAddress: '103.21.244.18',
      loginTime: 'Today at 08:30 AM',
      lastActivity: 'Active now',
      isCurrent: true
    }
  ]);

  // Core entities
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [parties, setParties] = useState<Party[]>(INITIAL_PARTIES);
  const [invoices, setInvoices] = useState<SalesInvoice[]>(INITIAL_INVOICES);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(INITIAL_SALES_ORDERS);
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>(INITIAL_PURCHASES);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [ledgers, setLedgers] = useState<LedgerAccount[]>(INITIAL_LEDGERS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [bankStatements, setBankStatements] = useState<BankStatementItem[]>(INITIAL_BANK_STATEMENTS);
  const [gstMismatches, setGstMismatches] = useState<GstMismatch[]>(INITIAL_GST_MISMATCHES);
  const [tallyQueue, setTallyQueue] = useState<TallySyncItem[]>(INITIAL_TALLY_QUEUE);
  const [dataInbox, setDataInbox] = useState<DataInboxItem[]>(INITIAL_DATA_INBOX);
  const [caConnections, setCaConnections] = useState<CaClientConnection[]>(INITIAL_CA_CONNECTIONS);
  const [caDocRequests, setCaDocRequests] = useState<CaDocumentRequest[]>(INITIAL_CA_DOC_REQUESTS);
  const [taxNotices, setTaxNotices] = useState<CaTaxNotice[]>(INITIAL_TAX_NOTICES);
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [templates, setTemplates] = useState<DocumentTemplate[]>(INITIAL_TEMPLATES);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [transactionDnas, setTransactionDnas] = useState<Record<string, TransactionDNA>>(INITIAL_TRANSACTION_DNAS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-01',
      timestamp: new Date().toISOString(),
      actor: 'Parth Kanjariya (Owner)',
      actorEmail: 'parthkanjariya78@gmail.com',
      action: 'LOGIN',
      entityType: 'AUTH_SESSION',
      entityId: 'sess-001',
      details: 'Logged into Shree Retail Mart Pvt Ltd via standard credential verification.'
    }
  ]);

  // UI state
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedDna, setSelectedDna] = useState<TransactionDNA | null>(null);
  const [previewDocument, setPreviewDocument] = useState<{ type: string; id: string; data?: any } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keyboard shortcut listener for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, entityType: string, entityId: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: impersonatedUser ? `${impersonatedUser.name} (Impersonated by Super Admin)` : currentUser.name,
      actorEmail: impersonatedUser ? impersonatedUser.email : currentUser.email,
      action,
      entityType,
      entityId,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const setWorkspace = (ws: WorkspaceType) => {
    setWorkspaceState(ws);
    // Auto configure tenant and user based on workspace context
    if (ws === 'business') {
      const t = tenants.find((item) => item.type === 'business') || tenants[0];
      setActiveTenant(t);
      setCurrentUser(users.find((u) => u.tenantId === t.id) || users[0]);
      setCurrentRoute('/business/dashboard');
    } else if (ws === 'buyer') {
      const t = tenants.find((item) => item.type === 'buyer') || tenants[1];
      setActiveTenant(t);
      setCurrentUser(users.find((u) => u.tenantId === t.id) || users[2]);
      setCurrentRoute('/buyer/dashboard');
    } else if (ws === 'supplier') {
      const t = tenants.find((item) => item.type === 'supplier') || tenants[2];
      setActiveTenant(t);
      setCurrentUser(users.find((u) => u.tenantId === t.id) || users[3]);
      setCurrentRoute('/supplier/dashboard');
    } else if (ws === 'ca') {
      const t = tenants.find((item) => item.type === 'ca') || tenants[3];
      setActiveTenant(t);
      setCurrentUser(users.find((u) => u.tenantId === t.id) || users[1]);
      setCurrentRoute('/ca/dashboard');
    } else if (ws === 'admin') {
      const t = tenants.find((item) => item.type === 'platform') || tenants[4];
      setActiveTenant(t);
      setCurrentUser(users.find((u) => u.role === 'SUPER_ADMIN') || users[4]);
      setCurrentRoute('/admin/dashboard');
    }
  };

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
  };

  const login = (emailOrPhone: string, password?: string, targetWorkspace?: WorkspaceType): boolean => {
    const query = emailOrPhone.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === query || u.phone.toLowerCase().includes(query)
    );

    if (!foundUser) {
      showToast('Authentication Failed', 'Account not found. Please verify your email or mobile.', 'error');
      return false;
    }

    if (foundUser.status === 'suspended') {
      showToast('Account Suspended', 'This account has been suspended by compliance administrator.', 'error');
      setCurrentRoute('/suspended');
      return false;
    }

    setCurrentUser(foundUser);
    setIsAuthenticated(true);
    addAuditLog('AUTH_LOGIN_SUCCESS', 'USER', foundUser.id, `User ${foundUser.name} signed in successfully.`);

    const memberships = foundUser.memberships || [];

    // If explicit target workspace provided (e.g. from persona buttons)
    if (targetWorkspace) {
      const match = memberships.find((m) => m.workspaceType === targetWorkspace);
      if (match) {
        setWorkspaceState(match.workspaceType);
        const t = tenants.find((item) => item.id === match.tenantId) || tenants[0];
        setActiveTenant(t);
        if (!match.onboardingCompleted) {
          setCurrentRoute(`/${match.workspaceType}/onboarding`);
        } else {
          setCurrentRoute(`/${match.workspaceType}/dashboard`);
        }
        showToast('Login Successful', `Welcome back, ${foundUser.name}!`, 'success');
        return true;
      }
    }

    // If multi-workspace user and no explicit target
    if (memberships.length > 1) {
      setCurrentRoute('/workspace/select');
      showToast('Multiple Workspaces', `Please choose an authorized workspace.`, 'info');
      return true;
    }

    // Single workspace
    const primary = memberships[0];
    if (primary) {
      setWorkspaceState(primary.workspaceType);
      const t = tenants.find((item) => item.id === primary.tenantId) || tenants[0];
      setActiveTenant(t);
      if (!primary.onboardingCompleted) {
        setCurrentRoute(`/${primary.workspaceType}/onboarding`);
      } else {
        setCurrentRoute(`/${primary.workspaceType}/dashboard`);
      }
    } else {
      if (foundUser.role === 'SUPER_ADMIN') {
        setWorkspaceState('admin');
        setCurrentRoute('/admin/dashboard');
      } else {
        setWorkspaceState('business');
        setCurrentRoute('/business/dashboard');
      }
    }

    showToast('Login Successful', `Welcome back, ${foundUser.name}!`, 'success');
    return true;
  };

  const loginAsPersona = (personaKey: 'owner' | 'ca' | 'buyer' | 'supplier' | 'admin') => {
    let email = 'parthkanjariya78@gmail.com';
    let targetWs: WorkspaceType | undefined = 'business';

    if (personaKey === 'owner') {
      email = 'parthkanjariya78@gmail.com';
      targetWs = 'business';
    } else if (personaKey === 'ca') {
      email = 'kailash@kptaxadvisory.com';
      targetWs = 'ca';
    } else if (personaKey === 'buyer') {
      email = 'procurement@abctraders.com';
      targetWs = 'buyer';
    } else if (personaKey === 'supplier') {
      email = 'orders@globalwholesale.in';
      targetWs = 'supplier';
    } else if (personaKey === 'admin') {
      email = 'admin@vyapaaros.com';
      targetWs = 'admin';
    }

    login(email, 'demo123', targetWs);
  };

  const logout = () => {
    addAuditLog('AUTH_LOGOUT', 'USER', currentUser.id, `User ${currentUser.name} signed out.`);
    setIsAuthenticated(false);
    setImpersonatedUser(null);
    setCurrentRoute('/');
    showToast('Signed Out', 'You have been safely signed out.', 'info');
  };

  const selectWorkspace = (membershipId: string) => {
    const mem = currentUser.memberships?.find((m) => m.id === membershipId);
    if (!mem) return;

    setWorkspaceState(mem.workspaceType);
    const targetTenant = tenants.find((t) => t.id === mem.tenantId) || tenants[0];
    setActiveTenant(targetTenant);

    if (!mem.onboardingCompleted) {
      setCurrentRoute(`/${mem.workspaceType}/onboarding`);
    } else {
      setCurrentRoute(`/${mem.workspaceType}/dashboard`);
    }

    showToast('Workspace Switched', `Entered ${mem.organizationName}.`, 'info');
  };

  const completeOnboarding = (workspaceType: WorkspaceType) => {
    setCurrentUser((prev) => {
      const updatedMemberships = (prev.memberships || []).map((m) =>
        m.workspaceType === workspaceType ? { ...m, onboardingCompleted: true } : m
      );
      return { ...prev, memberships: updatedMemberships };
    });

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          const updatedMemberships = (u.memberships || []).map((m) =>
            m.workspaceType === workspaceType ? { ...m, onboardingCompleted: true } : m
          );
          return { ...u, memberships: updatedMemberships };
        }
        return u;
      })
    );

    setCurrentRoute(`/${workspaceType}/dashboard`);
    showToast('Setup Completed', `Welcome to VyapaarOS! Your ${workspaceType.toUpperCase()} workspace is ready.`, 'success');
  };

  const registerAccount = (data: any) => {
    const userId = `usr-${Date.now()}`;
    const tenantId = `tenant-${Date.now()}`;
    const workspaceType: WorkspaceType =
      data.accountType === 'BUSINESS'
        ? 'business'
        : data.accountType === 'BUYER'
        ? 'buyer'
        : data.accountType === 'SUPPLIER'
        ? 'supplier'
        : 'ca';

    const role: UserRole =
      data.accountType === 'CA'
        ? 'CA_PARTNER'
        : data.accountType === 'BUYER'
        ? 'PURCHASE_MANAGER'
        : data.accountType === 'SUPPLIER'
        ? 'SALES_MANAGER'
        : 'OWNER';

    const newTenant: Tenant = {
      id: tenantId,
      name: data.businessName,
      tradeName: data.businessName,
      type: workspaceType === 'business' ? 'business' : workspaceType === 'ca' ? 'ca' : workspaceType === 'buyer' ? 'buyer' : 'supplier',
      gstin: data.gstin || '',
      pan: data.pan || '',
      email: data.email,
      phone: data.mobile,
      address: data.address || `${data.city || 'Commercial Zone'}, ${data.state || 'Gujarat'}`,
      city: data.city || 'Ahmedabad',
      state: data.state || 'Gujarat',
      pincode: '380001',
      planId: workspaceType === 'ca' ? 'plan-ca-firm' : 'plan-starter',
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      billingCycle: 'monthly',
      createdAt: new Date().toISOString(),
      branches: [
        { id: `br-${Date.now()}`, name: 'Head Office', code: 'BR-01', address: data.city || 'HQ', isMain: true }
      ],
      bankAccounts: [],
      settings: {
        defaultCurrency: data.currency || 'INR',
        invoicePrefix: `${data.businessName.slice(0, 3).toUpperCase()}/24-25/`,
        poPrefix: `${data.businessName.slice(0, 3).toUpperCase()}/PO/`,
        quotationPrefix: `${data.businessName.slice(0, 3).toUpperCase()}/QT/`,
        financialYearStart: '2024-04-01',
        enableMakerChecker: false,
        tallySyncMode: data.tallyRequired ? 'automatic' : 'manual',
        gstFilingFrequency: 'monthly',
        enableAutoRoundoff: true,
        termsAndConditions: 'Payment strictly within agreed terms.'
      }
    };

    const newMembership: WorkspaceMembership = {
      id: `mem-${Date.now()}`,
      userId,
      organizationId: tenantId,
      tenantId,
      organizationName: data.businessName,
      workspaceType,
      role,
      status: 'active',
      permissions: ['all'],
      joinedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      onboardingCompleted: false
    };

    const newUser: User = {
      id: userId,
      name: data.fullName,
      email: data.email,
      phone: data.mobile,
      role,
      accountType: data.accountType,
      tenantId,
      organizationName: data.businessName,
      assignedBranches: [`br-${Date.now()}`],
      permissions: ['all'],
      status: 'active',
      lastActive: 'Active now',
      memberships: [newMembership]
    };

    setTenants((prev) => [newTenant, ...prev]);
    setUsers((prev) => [newUser, ...prev]);
    setActiveTenant(newTenant);
    setCurrentUser(newUser);
    setWorkspaceState(workspaceType);
    setIsAuthenticated(true);

    addAuditLog('ACCOUNT_REGISTER', 'USER', userId, `New account registered as ${data.accountType} (${data.businessName}).`);
    setCurrentRoute(`/${workspaceType}/onboarding`);
    showToast('Registration Successful', `Welcome to VyapaarOS, ${data.fullName}! Let's set up your workspace.`, 'success');
  };

  const revokeSession = (sessionId: string) => {
    setUserSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast('Session Revoked', 'Session terminated successfully.', 'info');
  };

  const impersonateUser = (user: User, reason: string) => {
    setImpersonatedUser(user);
    setImpersonationReason(reason);
    const targetTenant = tenants.find((t) => t.id === user.tenantId) || activeTenant;
    setActiveTenant(targetTenant);
    if (targetTenant.type === 'business') setWorkspaceState('business');
    else if (targetTenant.type === 'ca') setWorkspaceState('ca');
    else if (targetTenant.type === 'buyer') setWorkspaceState('buyer');
    else if (targetTenant.type === 'supplier') setWorkspaceState('supplier');
    addAuditLog('SECURITY_IMPERSONATION_START', 'USER', user.id, `Super admin started impersonation session. Reason: "${reason}"`);
    showToast('Impersonation Session Active', `You are now logged in as ${user.name} (${user.organizationName}).`, 'warning');
  };

  const exitImpersonation = () => {
    if (impersonatedUser) {
      addAuditLog('SECURITY_IMPERSONATION_END', 'USER', impersonatedUser.id, 'Super admin terminated impersonation session.');
    }
    setImpersonatedUser(null);
    setImpersonationReason(null);
    setWorkspace('admin');
    showToast('Impersonation Ended', 'Returned to Super Admin control center.', 'info');
  };

  // 1. Sales Invoice Creation with Full Connected State (Decrements stock, creates journal, updates party balance, queues Tally)
  const createSalesInvoice = (data: Partial<SalesInvoice>): SalesInvoice => {
    const invoiceNumber = data.invoiceNumber || `SRM/24-25/00${invoices.length + 1}`;
    const dnaId = `dna-inv-${Date.now()}`;
    const invoiceId = `inv-${Date.now()}`;

    // Recalculate totals
    let taxable = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let subtotal = 0;
    let totalDiscount = 0;

    const items = (data.items || []).map((it) => {
      const calc = calculateLineItem({
        quantity: it.quantity,
        rate: it.rate,
        discountPercent: it.discountPercent,
        taxRate: it.taxRate,
        isInterState: data.placeOfSupply?.startsWith('24') ? false : false
      });
      subtotal += it.quantity * it.rate;
      totalDiscount += (it.quantity * it.rate * it.discountPercent) / 100;
      taxable += calc.taxableValue;
      cgst += calc.cgst;
      sgst += calc.sgst;
      igst += calc.igst;
      return {
        ...it,
        taxableValue: calc.taxableValue,
        cgst: calc.cgst,
        sgst: calc.sgst,
        igst: calc.igst,
        total: calc.total
      };
    });

    const totalAmount = Math.round((taxable + cgst + sgst + igst) * 100) / 100;
    const paidAmount = data.paidAmount || 0;
    const balanceDue = totalAmount - paidAmount;

    const newInvoice: SalesInvoice = {
      id: invoiceId,
      tenantId: activeTenant.id,
      invoiceNumber,
      orderNumber: data.orderNumber,
      quotationNumber: data.quotationNumber,
      date: data.date || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      customerId: data.customerId || '',
      customerName: data.customerName || 'Customer',
      customerGstin: data.customerGstin,
      billingAddress: data.billingAddress || '',
      placeOfSupply: data.placeOfSupply || '24-Gujarat',
      warehouseId: data.warehouseId || 'br-main',
      items,
      subtotal,
      totalDiscount,
      taxableAmount: taxable,
      totalCgst: cgst,
      totalSgst: sgst,
      totalIgst: igst,
      roundOff: 0,
      totalAmount,
      paidAmount,
      balanceDue,
      status: paidAmount >= totalAmount ? 'paid' : (paidAmount > 0 ? 'partially_paid' : 'sent'),
      paymentTerms: data.paymentTerms || '30 Days Net',
      notes: data.notes,
      tallySyncStatus: 'pending',
      gstStatus: 'pending',
      dnaId,
      createdAt: new Date().toISOString()
    };

    // 1. Decrement inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const item = items.find((i) => i.productId === prod.id);
        if (item) {
          const currentWarehouseStock = prod.warehouseStocks[newInvoice.warehouseId] || 0;
          return {
            ...prod,
            currentStock: Math.max(0, prod.currentStock - item.quantity),
            warehouseStocks: {
              ...prod.warehouseStocks,
              [newInvoice.warehouseId]: Math.max(0, currentWarehouseStock - item.quantity)
            }
          };
        }
        return prod;
      })
    );

    // 2. Update customer outstanding balance
    setParties((prev) =>
      prev.map((party) => {
        if (party.id === newInvoice.customerId) {
          return {
            ...party,
            currentBalance: party.currentBalance + balanceDue
          };
        }
        return party;
      })
    );

    // 3. Create double-entry journal entry
    const jrnId = `jrn-${Date.now()}`;
    const newJournal: JournalEntry = {
      id: jrnId,
      tenantId: activeTenant.id,
      voucherNumber: `JV-${new Date().getFullYear()}-${journalEntries.length + 1}`,
      date: newInvoice.date,
      reference: newInvoice.invoiceNumber,
      narration: `Sales booked against Invoice ${newInvoice.invoiceNumber} to ${newInvoice.customerName}`,
      items: [
        {
          accountId: 'ledg-cust-abc',
          accountName: `${newInvoice.customerName} Ledger`,
          debit: totalAmount,
          credit: 0
        },
        {
          accountId: 'ledg-sales-rev',
          accountName: 'Sales Account (Domestic)',
          debit: 0,
          credit: taxable
        },
        ...(cgst > 0 ? [{ accountId: 'ledg-output-cgst', accountName: 'Output CGST 9%', debit: 0, credit: cgst }] : []),
        ...(sgst > 0 ? [{ accountId: 'ledg-output-sgst', accountName: 'Output SGST 9%', debit: 0, credit: sgst }] : []),
        ...(igst > 0 ? [{ accountId: 'ledg-input-igst', accountName: 'Output IGST 18%', debit: 0, credit: igst }] : [])
      ],
      totalDebit: totalAmount,
      totalCredit: totalAmount,
      isMakerApproved: true,
      createdBy: currentUser.name,
      status: 'posted',
      tallySyncStatus: 'pending',
      dnaId
    };
    setJournalEntries((prev) => [newJournal, ...prev]);

    // 4. Queue Tally sync
    const tallyItem: TallySyncItem = {
      id: `tq-${Date.now()}`,
      tenantId: activeTenant.id,
      voucherType: 'Sales',
      voucherNumber: newInvoice.invoiceNumber,
      date: newInvoice.date,
      amount: newInvoice.totalAmount,
      status: 'pending',
      retryCount: 0
    };
    setTallyQueue((prev) => [tallyItem, ...prev]);

    // 5. Build Transaction DNA
    const newDna: TransactionDNA = {
      dnaId,
      tenantId: activeTenant.id,
      entityType: 'invoice',
      referenceNo: newInvoice.invoiceNumber,
      createdAt: new Date().toISOString(),
      source: data.orderNumber ? 'quotation_conversion' : 'manual',
      sourceDocument: data.orderNumber || data.quotationNumber,
      createdBy: currentUser.name,
      approvedBy: 'Auto-Approved (Policy < ₹1,00,000)',
      inventoryMoved: true,
      journalVoucherNo: newJournal.voucherNumber,
      bankReconciliationStatus: paidAmount > 0 ? 'reconciled' : 'pending',
      gstReturnCategory: 'GSTR-1 Table 4A (B2B)',
      tallyVoucherId: undefined,
      caReviewStatus: 'pending',
      lineage: [
        {
          stage: 'Invoice Created',
          timestamp: new Date().toLocaleString(),
          actor: currentUser.name,
          description: `Invoice ${newInvoice.invoiceNumber} created for ${newInvoice.customerName} for total ₹${newInvoice.totalAmount}.`
        },
        {
          stage: 'Stock Deducted',
          timestamp: new Date().toLocaleString(),
          actor: 'Warehouse Controller',
          description: `Items deducted from ${newInvoice.warehouseId} stock.`
        },
        {
          stage: 'Double-Entry Accounting Journal Posted',
          timestamp: new Date().toLocaleString(),
          actor: 'VyapaarOS Accounting Engine',
          description: `Journal ${newJournal.voucherNumber} posted with total debit ₹${newJournal.totalDebit}.`
        },
        {
          stage: 'Tally Connector Queued',
          timestamp: new Date().toLocaleString(),
          actor: 'Tally Sync Worker',
          description: `Voucher enqueued for real-time sync with Tally company ${activeTenant.name}.`
        }
      ]
    };
    setTransactionDnas((prev) => ({ ...prev, [dnaId]: newDna }));

    setInvoices((prev) => [newInvoice, ...prev]);
    addAuditLog('SALES_INVOICE_CREATE', 'INVOICE', newInvoice.id, `Created Invoice ${newInvoice.invoiceNumber} for ₹${newInvoice.totalAmount}`);
    showToast('Invoice Created', `Invoice ${newInvoice.invoiceNumber} generated & connected across accounting, inventory, and Tally queue.`, 'success');

    return newInvoice;
  };

  const updateSalesInvoiceStatus = (id: string, status: SalesInvoice['status']) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
    showToast('Invoice Updated', `Status updated to ${status}.`, 'info');
  };

  // 2. Quotation creation & Zero Re-entry Conversion
  const createQuotation = (data: Partial<Quotation>): Quotation => {
    const quotationNumber = data.quotationNumber || `SRM/QT/24-0${quotations.length + 90}`;
    const newQuotation: Quotation = {
      id: `qt-${Date.now()}`,
      tenantId: activeTenant.id,
      quotationNumber,
      date: data.date || new Date().toISOString().split('T')[0],
      validUntil: data.validUntil || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      customerId: data.customerId || '',
      customerName: data.customerName || 'Customer',
      items: data.items || [],
      totalAmount: data.totalAmount || 0,
      status: 'sent',
      notes: data.notes
    };
    setQuotations((prev) => [newQuotation, ...prev]);
    addAuditLog('QUOTATION_CREATE', 'QUOTATION', newQuotation.id, `Created Quotation ${newQuotation.quotationNumber}`);
    showToast('Quotation Generated', `Quotation ${newQuotation.quotationNumber} ready to share with customer.`, 'success');
    return newQuotation;
  };

  const convertQuotationToOrder = (quotationId: string): SalesOrder => {
    const qt = quotations.find((q) => q.id === quotationId);
    if (!qt) throw new Error('Quotation not found');

    const orderNumber = `SO-${new Date().getFullYear()}-00${salesOrders.length + 1}`;
    const orderId = `so-${Date.now()}`;
    const newOrder: SalesOrder = {
      id: orderId,
      tenantId: activeTenant.id,
      orderNumber,
      quotationId: qt.id,
      date: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      customerId: qt.customerId,
      customerName: qt.customerName,
      items: qt.items,
      totalAmount: qt.totalAmount,
      status: 'confirmed'
    };

    setSalesOrders((prev) => [newOrder, ...prev]);
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'accepted', convertedToOrderId: orderId } : q))
    );
    addAuditLog('QUOTATION_CONVERT_ORDER', 'SALES_ORDER', orderId, `Converted Quotation ${qt.quotationNumber} to Sales Order ${orderNumber}`);
    showToast('Zero Re-entry Flow', `Quotation ${qt.quotationNumber} converted to Sales Order ${orderNumber} without re-typing data.`, 'success');
    return newOrder;
  };

  const convertOrderToInvoice = (orderId: string): SalesInvoice => {
    const order = salesOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const customer = parties.find((p) => p.id === order.customerId);

    const created = createSalesInvoice({
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      customerGstin: customer?.gstin,
      billingAddress: customer?.billingAddress || '',
      placeOfSupply: '24-Gujarat',
      items: order.items,
      totalAmount: order.totalAmount,
      paymentTerms: `${customer?.paymentTermsDays || 30} Days Net`
    });

    setSalesOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'invoiced', convertedInvoiceId: created.id } : o))
    );
    showToast('Order Invoiced', `Sales Order ${order.orderNumber} converted to Invoice ${created.invoiceNumber}.`, 'success');
    return created;
  };

  // 3. Purchase Invoice creation (increments stock, updates supplier balance, creates journal)
  const createPurchaseInvoice = (data: Partial<PurchaseInvoice>): PurchaseInvoice => {
    const billNumber = data.billNumber || `BILL-SRM-0${purchases.length + 47}`;
    const dnaId = `dna-pur-${Date.now()}`;
    const purId = `pur-${Date.now()}`;

    const items = data.items || [];
    let taxable = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    items.forEach((it) => {
      taxable += it.taxableValue;
      cgst += it.cgst;
      sgst += it.sgst;
      igst += it.igst;
    });

    const totalAmount = data.totalAmount || taxable + cgst + sgst + igst;
    const paidAmount = data.paidAmount || 0;
    const balanceDue = totalAmount - paidAmount;

    const newPurchase: PurchaseInvoice = {
      id: purId,
      tenantId: activeTenant.id,
      billNumber,
      supplierInvoiceNumber: data.supplierInvoiceNumber || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      poNumber: data.poNumber,
      date: data.date || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      supplierId: data.supplierId || '',
      supplierName: data.supplierName || 'Supplier',
      supplierGstin: data.supplierGstin,
      warehouseId: data.warehouseId || 'br-main',
      items,
      subtotal: taxable,
      taxableAmount: taxable,
      totalCgst: cgst,
      totalSgst: sgst,
      totalIgst: igst,
      totalAmount,
      paidAmount,
      balanceDue,
      status: 'approved',
      gstStatus: 'matched',
      tallySyncStatus: 'pending',
      dnaId,
      createdAt: new Date().toISOString()
    };

    // Increment inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const it = items.find((i) => i.productId === prod.id);
        if (it) {
          const currentWarehouseStock = prod.warehouseStocks[newPurchase.warehouseId] || 0;
          return {
            ...prod,
            currentStock: prod.currentStock + it.quantity,
            warehouseStocks: {
              ...prod.warehouseStocks,
              [newPurchase.warehouseId]: currentWarehouseStock + it.quantity
            }
          };
        }
        return prod;
      })
    );

    // Update supplier balance
    setParties((prev) =>
      prev.map((party) => {
        if (party.id === newPurchase.supplierId) {
          return {
            ...party,
            currentBalance: party.currentBalance + balanceDue
          };
        }
        return party;
      })
    );

    // Add journal entry
    const newJournal: JournalEntry = {
      id: `jrn-${Date.now()}`,
      tenantId: activeTenant.id,
      voucherNumber: `JV-${new Date().getFullYear()}-${journalEntries.length + 1}`,
      date: newPurchase.date,
      reference: newPurchase.billNumber,
      narration: `Purchase booked from ${newPurchase.supplierName} Bill ${newPurchase.supplierInvoiceNumber}`,
      items: [
        { accountId: 'ledg-pur-rev', accountName: 'Purchase Account (Trade)', debit: taxable, credit: 0 },
        ...(cgst > 0 ? [{ accountId: 'ledg-output-cgst', accountName: 'Input CGST', debit: cgst, credit: 0 }] : []),
        ...(sgst > 0 ? [{ accountId: 'ledg-output-sgst', accountName: 'Input SGST', debit: sgst, credit: 0 }] : []),
        ...(igst > 0 ? [{ accountId: 'ledg-input-igst', accountName: 'Input IGST 18%', debit: igst, credit: 0 }] : []),
        { accountId: 'ledg-supp-global', accountName: `${newPurchase.supplierName} A/c`, debit: 0, credit: totalAmount }
      ],
      totalDebit: totalAmount,
      totalCredit: totalAmount,
      isMakerApproved: true,
      createdBy: currentUser.name,
      status: 'posted',
      tallySyncStatus: 'pending',
      dnaId
    };
    setJournalEntries((prev) => [newJournal, ...prev]);

    // Queue Tally Sync
    const tallyItem: TallySyncItem = {
      id: `tq-${Date.now()}`,
      tenantId: activeTenant.id,
      voucherType: 'Purchase',
      voucherNumber: newPurchase.billNumber,
      date: newPurchase.date,
      amount: newPurchase.totalAmount,
      status: 'pending',
      retryCount: 0
    };
    setTallyQueue((prev) => [tallyItem, ...prev]);

    // Transaction DNA
    const newDna: TransactionDNA = {
      dnaId,
      tenantId: activeTenant.id,
      entityType: 'purchase',
      referenceNo: newPurchase.billNumber,
      createdAt: new Date().toISOString(),
      source: 'manual',
      createdBy: currentUser.name,
      inventoryMoved: true,
      journalVoucherNo: newJournal.voucherNumber,
      bankReconciliationStatus: 'pending',
      tallyVoucherId: undefined,
      caReviewStatus: 'pending',
      lineage: [
        {
          stage: 'Purchase Bill Entered',
          timestamp: new Date().toLocaleString(),
          actor: currentUser.name,
          description: `Bill ${newPurchase.billNumber} received from ${newPurchase.supplierName} for ₹${newPurchase.totalAmount}.`
        },
        {
          stage: 'Stock Inwarded',
          timestamp: new Date().toLocaleString(),
          actor: 'Storekeeper',
          description: `Inventory physically received and updated in ${newPurchase.warehouseId}.`
        },
        {
          stage: 'Double-Entry Purchase Journal',
          timestamp: new Date().toLocaleString(),
          actor: 'VyapaarOS Accounting Engine',
          description: `Journal ${newJournal.voucherNumber} created.`
        }
      ]
    };
    setTransactionDnas((prev) => ({ ...prev, [dnaId]: newDna }));

    setPurchases((prev) => [newPurchase, ...prev]);
    addAuditLog('PURCHASE_BILL_CREATE', 'PURCHASE', newPurchase.id, `Created Purchase Bill ${newPurchase.billNumber} for ₹${newPurchase.totalAmount}`);
    showToast('Purchase Bill Saved', `Stock incremented and ₹${newPurchase.totalAmount} added to accounts payable.`, 'success');
    return newPurchase;
  };

  // 4. Payment Creation (Allocates against invoice, updates balances, creates bank entry & journal)
  const createPayment = (data: Partial<PaymentTransaction>): PaymentTransaction => {
    const receiptNumber = data.receiptNumber || `RCPT-${new Date().getFullYear()}-${payments.length + 103}`;
    const dnaId = `dna-pay-${Date.now()}`;
    const paymentId = `pay-${Date.now()}`;

    const newPayment: PaymentTransaction = {
      id: paymentId,
      tenantId: activeTenant.id,
      receiptNumber,
      type: data.type || 'customer_payment',
      partyId: data.partyId || '',
      partyName: data.partyName || 'Party',
      amount: data.amount || 0,
      date: data.date || new Date().toISOString().split('T')[0],
      paymentMode: data.paymentMode || 'bank_transfer',
      bankAccountId: data.bankAccountId || 'bank-hdfc-current',
      referenceNo: data.referenceNo || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      allocatedInvoices: data.allocatedInvoices || [],
      unallocatedAmount: data.unallocatedAmount || 0,
      notes: data.notes,
      status: 'completed',
      tallySyncStatus: 'pending',
      dnaId,
      createdAt: new Date().toISOString()
    };

    // 1. Update allocated invoices
    if (newPayment.allocatedInvoices && newPayment.allocatedInvoices.length > 0) {
      setInvoices((prev) =>
        prev.map((inv) => {
          const alloc = newPayment.allocatedInvoices.find((a) => a.invoiceId === inv.id);
          if (alloc) {
            const newPaid = inv.paidAmount + alloc.allocatedAmount;
            const newBalance = Math.max(0, inv.totalAmount - newPaid);
            return {
              ...inv,
              paidAmount: newPaid,
              balanceDue: newBalance,
              status: newBalance <= 0 ? 'paid' : 'partially_paid'
            };
          }
          return inv;
        })
      );
    }

    // 2. Update party outstanding
    setParties((prev) =>
      prev.map((p) => {
        if (p.id === newPayment.partyId) {
          const delta = newPayment.type === 'customer_payment' ? -newPayment.amount : newPayment.amount;
          return {
            ...p,
            currentBalance: p.currentBalance + delta
          };
        }
        return p;
      })
    );

    // 3. Update bank account balance
    setBankAccounts((prev) =>
      prev.map((b) => {
        if (b.id === newPayment.bankAccountId) {
          const delta = newPayment.type === 'customer_payment' ? newPayment.amount : -newPayment.amount;
          return {
            ...b,
            currentBalance: b.currentBalance + delta
          };
        }
        return b;
      })
    );

    // 4. Create Bank Statement item & auto-match
    const newStmt: BankStatementItem = {
      id: `stmt-${Date.now()}`,
      bankAccountId: newPayment.bankAccountId,
      date: newPayment.date,
      description: `${newPayment.paymentMode.toUpperCase()} - ${newPayment.partyName} - ${newPayment.referenceNo}`,
      referenceNo: newPayment.referenceNo,
      amount: newPayment.type === 'customer_payment' ? newPayment.amount : -newPayment.amount,
      type: newPayment.type === 'customer_payment' ? 'credit' : 'debit',
      matchStatus: 'matched',
      matchedTransactionId: paymentId,
      matchedParty: newPayment.partyName,
      balance: (bankAccounts.find((b) => b.id === newPayment.bankAccountId)?.currentBalance || 2400000) + newPayment.amount
    };
    setBankStatements((prev) => [newStmt, ...prev]);

    // 5. Journal entry
    const newJournal: JournalEntry = {
      id: `jrn-${Date.now()}`,
      tenantId: activeTenant.id,
      voucherNumber: `JV-${new Date().getFullYear()}-${journalEntries.length + 1}`,
      date: newPayment.date,
      reference: newPayment.receiptNumber,
      narration: `Payment received of ₹${newPayment.amount} from ${newPayment.partyName} via ${newPayment.paymentMode}`,
      items: [
        { accountId: 'ledg-hdfc-bank', accountName: 'HDFC Bank Current Account', debit: newPayment.amount, credit: 0 },
        { accountId: 'ledg-cust-abc', accountName: `${newPayment.partyName} A/c`, debit: 0, credit: newPayment.amount }
      ],
      totalDebit: newPayment.amount,
      totalCredit: newPayment.amount,
      isMakerApproved: true,
      createdBy: currentUser.name,
      status: 'posted',
      tallySyncStatus: 'pending',
      dnaId
    };
    setJournalEntries((prev) => [newJournal, ...prev]);

    // 6. Queue Tally sync
    setTallyQueue((prev) => [
      {
        id: `tq-${Date.now()}`,
        tenantId: activeTenant.id,
        voucherType: 'Receipt',
        voucherNumber: newPayment.receiptNumber,
        date: newPayment.date,
        amount: newPayment.amount,
        status: 'pending',
        retryCount: 0
      },
      ...prev
    ]);

    setPayments((prev) => [newPayment, ...prev]);
    addAuditLog('PAYMENT_RECORD', 'PAYMENT', paymentId, `Recorded payment ${newPayment.receiptNumber} of ₹${newPayment.amount} from ${newPayment.partyName}`);
    showToast('Payment Recorded', `₹${newPayment.amount} posted to Bank, Invoice updated, and reconciled in 1 step!`, 'success');
    return newPayment;
  };

  const createExpense = (data: Partial<Expense>): Expense => {
    const expenseNumber = `EXP-${new Date().getFullYear()}-0${expenses.length + 43}`;
    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      tenantId: activeTenant.id,
      expenseNumber,
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || 'General Operations',
      vendorName: data.vendorName || 'Vendor',
      amount: data.amount || 0,
      taxAmount: data.taxAmount || 0,
      paymentMode: data.paymentMode || 'bank_transfer',
      bankAccountId: data.bankAccountId || 'bank-hdfc-current',
      description: data.description || '',
      tallySyncStatus: 'pending'
    };
    setExpenses((prev) => [newExp, ...prev]);
    addAuditLog('EXPENSE_CREATE', 'EXPENSE', newExp.id, `Created expense ${newExp.expenseNumber} for ₹${newExp.amount}`);
    showToast('Expense Logged', `Expense ${newExp.expenseNumber} saved and deducted from cash flow.`, 'success');
    return newExp;
  };

  const createProduct = (product: Partial<Product>): Product => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      tenantId: activeTenant.id,
      name: product.name || 'New Product',
      sku: product.sku || `SKU-${Date.now()}`,
      category: product.category || 'General',
      unit: product.unit || 'PCS',
      purchasePrice: product.purchasePrice || 0,
      sellingPrice: product.sellingPrice || 0,
      mrp: product.mrp || 0,
      taxRate: product.taxRate || 18,
      hsnCode: product.hsnCode || '9999',
      currentStock: product.currentStock || 0,
      reorderLevel: product.reorderLevel || 10,
      minStock: product.minStock || 5,
      warehouseStocks: { 'br-main': product.currentStock || 0 },
      status: 'active',
      batchTracking: !!product.batchTracking,
      description: product.description
    };
    setProducts((prev) => [newProd, ...prev]);
    addAuditLog('PRODUCT_CREATE', 'PRODUCT', newProd.id, `Created product ${newProd.name} (SKU: ${newProd.sku})`);
    showToast('Product Created', `${newProd.name} added to catalog.`, 'success');
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product Updated', 'Product details saved.', 'info');
  };

  const stockAdjustment = (productId: string, warehouseId: string, adjustedQty: number, reason: any, notes: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentWh = p.warehouseStocks[warehouseId] || 0;
          const newWh = Math.max(0, currentWh + adjustedQty);
          const newTotal = Math.max(0, p.currentStock + adjustedQty);
          return {
            ...p,
            currentStock: newTotal,
            warehouseStocks: {
              ...p.warehouseStocks,
              [warehouseId]: newWh
            }
          };
        }
        return p;
      })
    );

    addAuditLog('STOCK_ADJUSTMENT', 'INVENTORY', productId, `Adjusted ${adjustedQty} units of ${prod.name} due to ${reason}. Notes: ${notes}`);
    showToast('Stock Adjusted', `Inventory updated for ${prod.name} in ${warehouseId}.`, 'info');
  };

  const createParty = (party: Partial<Party>): Party => {
    const newParty: Party = {
      id: `party-${Date.now()}`,
      tenantId: activeTenant.id,
      type: party.type || 'customer',
      name: party.name || 'New Party',
      contactPerson: party.contactPerson || '',
      email: party.email || '',
      phone: party.phone || '',
      gstin: party.gstin,
      pan: party.pan,
      billingAddress: party.billingAddress || '',
      shippingAddress: party.shippingAddress || '',
      state: party.state || 'Gujarat',
      creditLimit: party.creditLimit || 100000,
      paymentTermsDays: party.paymentTermsDays || 30,
      openingBalance: party.openingBalance || 0,
      currentBalance: party.openingBalance || 0,
      bankDetails: party.bankDetails,
      createdAt: new Date().toISOString(),
      status: 'active',
      category: party.category || 'General'
    };
    setParties((prev) => [newParty, ...prev]);
    addAuditLog('PARTY_CREATE', 'PARTY', newParty.id, `Created party ${newParty.name} (${newParty.type})`);
    showToast('Party Created', `${newParty.name} registered.`, 'success');
    return newParty;
  };

  const updateParty = (id: string, updates: Partial<Party>) => {
    setParties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Party Updated', 'Customer/Supplier details updated.', 'info');
  };

  const matchBankStatement = (statementId: string, transactionId: string) => {
    setBankStatements((prev) =>
      prev.map((stmt) =>
        stmt.id === statementId
          ? { ...stmt, matchStatus: 'matched', matchedTransactionId: transactionId }
          : stmt
      )
    );
    showToast('Reconciliation Complete', 'Bank statement line matched with transaction.', 'success');
  };

  const unmatchBankStatement = (statementId: string) => {
    setBankStatements((prev) =>
      prev.map((stmt) =>
        stmt.id === statementId
          ? { ...stmt, matchStatus: 'unmatched', matchedTransactionId: undefined }
          : stmt
      )
    );
    showToast('Reconciliation Unmatched', 'Bank statement line reverted to unmatched.', 'info');
  };

  const syncTallyItem = (queueId: string) => {
    setTallyQueue((prev) =>
      prev.map((item) =>
        item.id === queueId
          ? {
              ...item,
              status: 'synced',
              tallyMasterId: `TALLY-SYNC-${Math.floor(10000 + Math.random() * 90000)}`,
              errorMessage: undefined,
              lastAttemptAt: new Date().toISOString()
            }
          : item
      )
    );
    showToast('Tally Synchronized', 'Voucher pushed to Tally company ledger.', 'success');
  };

  const retryAllTallyQueue = () => {
    setTallyQueue((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'synced',
        tallyMasterId: item.tallyMasterId || `TALLY-SYNC-${Math.floor(10000 + Math.random() * 90000)}`,
        errorMessage: undefined,
        lastAttemptAt: new Date().toISOString()
      }))
    );
    showToast('Tally Queue Flushed', 'All pending & failed vouchers synchronized.', 'success');
  };

  const convertInboxItem = (itemId: string, targetType: 'purchase' | 'expense') => {
    const item = dataInbox.find((i) => i.id === itemId);
    if (!item) return;

    if (targetType === 'purchase') {
      const pur = createPurchaseInvoice({
        supplierName: item.extractedData.partyName,
        supplierGstin: item.extractedData.gstin,
        supplierInvoiceNumber: item.extractedData.invoiceNumber,
        date: item.extractedData.date,
        totalAmount: item.extractedData.totalAmount,
        items: [
          {
            id: `item-inbox-${Date.now()}`,
            productId: products[0]?.id || 'prod-tv-43',
            productName: `${item.extractedData.partyName} Supply Item`,
            sku: 'OCR-ITEM-01',
            hsnCode: '8528',
            quantity: 1,
            unit: 'PCS',
            rate: item.extractedData.taxableAmount,
            discountPercent: 0,
            taxableValue: item.extractedData.taxableAmount,
            taxRate: 18,
            cgst: item.extractedData.taxAmount / 2,
            sgst: item.extractedData.taxAmount / 2,
            igst: 0,
            total: item.extractedData.totalAmount
          }
        ]
      });
      setDataInbox((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, status: 'converted', convertedTo: 'purchase', convertedId: pur.id } : i))
      );
      showToast('Zero Re-entry OCR', `Extracted bill converted to Purchase Bill ${pur.billNumber}!`, 'success');
    } else {
      const exp = createExpense({
        vendorName: item.extractedData.partyName,
        amount: item.extractedData.totalAmount,
        taxAmount: item.extractedData.taxAmount,
        description: `Imported via Data Inbox OCR (${item.originalFileName})`
      });
      setDataInbox((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, status: 'converted', convertedTo: 'expense', convertedId: exp.id } : i))
      );
      showToast('OCR Converted to Expense', `Saved as Expense ${exp.expenseNumber}.`, 'success');
    }
  };

  const resolveGstMismatch = (id: string) => {
    setGstMismatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'resolved' } : m))
    );
    showToast('GST Mismatch Resolved', 'Variance reconciled against 2B portal payload.', 'success');
  };

  const createCaDocRequest = (data: Partial<CaDocumentRequest>) => {
    const newReq: CaDocumentRequest = {
      id: `req-${Date.now()}`,
      caFirmId: 'tenant-kp-tax-advisory',
      clientTenantId: 'tenant-shree-retail',
      clientName: 'Shree Retail Mart Pvt Ltd',
      title: data.title || 'Document Request',
      description: data.description || '',
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'requested',
      notes: data.notes
    };
    setCaDocRequests((prev) => [newReq, ...prev]);
    showToast('Document Requested', `Sent request to client: "${newReq.title}".`, 'info');
  };

  const uploadCaDoc = (requestId: string, fileName: string) => {
    setCaDocRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'uploaded',
              uploadedFileName: fileName,
              uploadedAt: new Date().toISOString()
            }
          : r
      )
    );
    showToast('Document Uploaded', `File ${fileName} transmitted to CA portal.`, 'success');
  };

  const runMonthEndCheck = () => {
    const issues: string[] = [];
    const pendingInvoices = invoices.filter((i) => i.status === 'sent' && new Date(i.dueDate) < new Date());
    if (pendingInvoices.length > 0) {
      issues.push(`${pendingInvoices.length} invoices are currently overdue.`);
    }

    const unresolvedGst = gstMismatches.filter((g) => g.status === 'pending');
    if (unresolvedGst.length > 0) {
      issues.push(`${unresolvedGst.length} GSTR-2B ITC purchase mismatches require party reconciliation.`);
    }

    const bankExceptions = bankStatements.filter((s) => s.matchStatus === 'exception' || s.matchStatus === 'unmatched');
    if (bankExceptions.length > 0) {
      issues.push(`${bankExceptions.length} bank statement entries remain unreconciled.`);
    }

    const pendingTally = tallyQueue.filter((t) => t.status === 'pending' || t.status === 'failed');
    if (pendingTally.length > 0) {
      issues.push(`${pendingTally.length} vouchers are pending sync with Tally.`);
    }

    const details = {
      totalSalesRevenue: invoices.reduce((s, i) => s + i.totalAmount, 0),
      totalPurchases: purchases.reduce((s, p) => s + p.totalAmount, 0),
      bankBalance: bankAccounts.reduce((s, b) => s + b.currentBalance, 0),
      unresolvedGstCount: unresolvedGst.length,
      auditReadinessScore: issues.length === 0 ? 100 : Math.max(40, 100 - issues.length * 15)
    };

    return {
      passed: issues.length === 0,
      issues,
      details
    };
  };

  const openDnaViewer = (dnaId: string) => {
    const found = transactionDnas[dnaId];
    if (found) {
      setSelectedDna(found);
    } else {
      // Build on-the-fly DNA
      const syntheticDna: TransactionDNA = {
        dnaId,
        tenantId: activeTenant.id,
        entityType: 'invoice',
        referenceNo: dnaId,
        createdAt: new Date().toISOString(),
        source: 'manual',
        createdBy: currentUser.name,
        inventoryMoved: true,
        bankReconciliationStatus: 'reconciled',
        caReviewStatus: 'approved',
        lineage: [
          {
            stage: 'Record Initialized',
            timestamp: new Date().toLocaleString(),
            actor: currentUser.name,
            description: 'Original record created and verified in VyapaarOS single source of truth.'
          }
        ]
      };
      setSelectedDna(syntheticDna);
    }
  };

  const closeDnaViewer = () => setSelectedDna(null);

  const openDocumentViewer = (type: string, id: string, data?: any) => {
    setPreviewDocument({ type, id, data });
  };

  const closeDocumentViewer = () => setPreviewDocument(null);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        users,
        login,
        loginAsPersona,
        logout,
        registerAccount,
        completeOnboarding,
        selectWorkspace,
        userSessions,
        revokeSession,

        workspace,
        setWorkspace,
        currentRoute,
        navigateTo,
        activeTenant,
        setActiveTenant,
        tenants,
        impersonatedUser,
        impersonationReason,
        impersonateUser,
        exitImpersonation,

        products,
        parties,
        invoices,
        quotations,
        salesOrders,
        purchases,
        purchaseOrders,
        payments,
        expenses,
        ledgers,
        journalEntries,
        bankAccounts,
        bankStatements,
        gstMismatches,
        tallyQueue,
        dataInbox,
        caConnections,
        caDocRequests,
        taxNotices,
        automations,
        templates,
        plans,
        auditLogs,

        createSalesInvoice,
        updateSalesInvoiceStatus,
        createQuotation,
        convertQuotationToOrder,
        convertOrderToInvoice,
        createPurchaseInvoice,
        createPayment,
        createExpense,
        createProduct,
        updateProduct,
        stockAdjustment,
        createParty,
        updateParty,
        matchBankStatement,
        unmatchBankStatement,
        syncTallyItem,
        retryAllTallyQueue,
        convertInboxItem,
        resolveGstMismatch,
        createCaDocRequest,
        uploadCaDoc,
        runMonthEndCheck,

        isQuickCreateOpen,
        setIsQuickCreateOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        selectedDna,
        openDnaViewer,
        closeDnaViewer,
        previewDocument,
        openDocumentViewer,
        closeDocumentViewer,

        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
