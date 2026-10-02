export type WorkspaceType = 'business' | 'buyer' | 'supplier' | 'ca' | 'admin';

export type AccountType = 'BUSINESS' | 'BUYER' | 'SUPPLIER' | 'CA';

export type UserRole = 
  | 'OWNER' 
  | 'ADMIN' 
  | 'ACCOUNTANT' 
  | 'BILLING_OPERATOR' 
  | 'SALES_MANAGER' 
  | 'PURCHASE_MANAGER' 
  | 'INVENTORY_MANAGER' 
  | 'CA_PARTNER' 
  | 'CA_STAFF' 
  | 'SUPER_ADMIN';

export interface WorkspaceMembership {
  id: string;
  userId: string;
  organizationId: string;
  tenantId: string;
  organizationName: string;
  workspaceType: WorkspaceType;
  role: UserRole;
  status: 'active' | 'suspended';
  permissions: string[];
  joinedAt: string;
  lastAccessedAt: string;
  onboardingCompleted: boolean;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceName: string;
  ipAddress: string;
  loginTime: string;
  lastActivity: string;
  isCurrent: boolean;
}

export interface OnboardingProgress {
  tenantId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  isCompleted: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  accountType?: AccountType;
  avatar?: string;
  tenantId: string;
  organizationName: string;
  assignedBranches: string[];
  permissions: string[];
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
  memberships?: WorkspaceMembership[];
}

export interface Tenant {
  id: string;
  name: string;
  type: 'business' | 'buyer' | 'supplier' | 'ca' | 'platform';
  tradeName?: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  planId: string;
  subscriptionStatus: 'active' | 'trial' | 'past_due' | 'suspended';
  trialEndsAt?: string;
  billingCycle: 'monthly' | 'annual';
  createdAt: string;
  branches: Branch[];
  bankAccounts: BankAccount[];
  settings: BusinessSettings;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  isMain: boolean;
}

export interface BusinessSettings {
  defaultCurrency: string;
  invoicePrefix: string;
  poPrefix: string;
  quotationPrefix: string;
  financialYearStart: string;
  enableMakerChecker: boolean;
  tallySyncMode: 'manual' | 'one-click' | 'automatic';
  gstFilingFrequency: 'monthly' | 'quarterly';
  enableAutoRoundoff: boolean;
  termsAndConditions: string;
}

export interface Party {
  id: string;
  tenantId: string;
  type: 'customer' | 'supplier' | 'both';
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin?: string;
  pan?: string;
  billingAddress: string;
  shippingAddress: string;
  state: string;
  creditLimit: number;
  paymentTermsDays: number;
  openingBalance: number;
  currentBalance: number;
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branch: string;
  };
  createdAt: string;
  status: 'active' | 'archived';
  category?: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  taxRate: number; // e.g. 18 for 18% GST
  hsnCode: string;
  currentStock: number;
  reorderLevel: number;
  minStock: number;
  warehouseStocks: Record<string, number>;
  status: 'active' | 'archived';
  batchTracking: boolean;
  description?: string;
}

export interface StockAdjustment {
  id: string;
  tenantId: string;
  productId: string;
  productName: string;
  warehouseId: string;
  currentQty: number;
  adjustedQty: number; // difference (+ or -)
  reason: 'damage' | 'expiry' | 'physical_count' | 'theft' | 'loss' | 'correction';
  date: string;
  referenceNo: string;
  notes: string;
  createdBy: string;
}

export interface LineItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  discountPercent: number;
  taxableValue: number;
  taxRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  batchNumber?: string;
}

export type SalesStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface SalesInvoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  orderNumber?: string;
  quotationNumber?: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerGstin?: string;
  billingAddress: string;
  placeOfSupply: string;
  warehouseId: string;
  items: LineItem[];
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  roundOff: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: SalesStatus;
  paymentTerms: string;
  notes?: string;
  tallySyncStatus: 'synced' | 'pending' | 'failed' | 'not_applicable';
  tallySyncError?: string;
  gstStatus: 'uploaded' | 'pending' | 'mismatch';
  eInvoiceNumber?: string;
  eWayBillNumber?: string;
  dnaId: string;
  createdAt: string;
}

export interface Quotation {
  id: string;
  tenantId: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  items: LineItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted';
  notes?: string;
  convertedToOrderId?: string;
  convertedToInvoiceId?: string;
}

export interface SalesOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  quotationId?: string;
  date: string;
  expectedDeliveryDate: string;
  customerId: string;
  customerName: string;
  items: LineItem[];
  totalAmount: number;
  status: 'draft' | 'confirmed' | 'dispatched' | 'delivered' | 'invoiced' | 'cancelled';
  convertedInvoiceId?: string;
}

export interface PurchaseInvoice {
  id: string;
  tenantId: string;
  billNumber: string;
  supplierInvoiceNumber: string;
  poNumber?: string;
  date: string;
  dueDate: string;
  supplierId: string;
  supplierName: string;
  supplierGstin?: string;
  warehouseId: string;
  items: LineItem[];
  subtotal: number;
  taxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'draft' | 'approved' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  gstStatus: 'matched' | 'unmatched_in_2b' | 'pending';
  tallySyncStatus: 'synced' | 'pending' | 'failed';
  dnaId: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  poNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: LineItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'received' | 'invoiced';
}

export interface PaymentTransaction {
  id: string;
  tenantId: string;
  receiptNumber: string;
  type: 'customer_payment' | 'supplier_payment' | 'refund' | 'advance';
  partyId: string;
  partyName: string;
  amount: number;
  date: string;
  paymentMode: 'bank_transfer' | 'upi' | 'cheque' | 'cash' | 'credit_card';
  bankAccountId: string;
  referenceNo: string;
  allocatedInvoices: {
    invoiceId: string;
    invoiceNumber: string;
    allocatedAmount: number;
  }[];
  unallocatedAmount: number;
  notes?: string;
  status: 'completed' | 'reconciled' | 'bounced' | 'cancelled';
  tallySyncStatus: 'synced' | 'pending' | 'failed';
  dnaId: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  tenantId: string;
  expenseNumber: string;
  date: string;
  category: string;
  vendorName: string;
  amount: number;
  taxAmount: number;
  paymentMode: string;
  bankAccountId: string;
  receiptUrl?: string;
  description: string;
  tallySyncStatus: 'synced' | 'pending';
}

export interface LedgerAccount {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  group: 'Current Assets' | 'Fixed Assets' | 'Current Liabilities' | 'Direct Incomes' | 'Indirect Incomes' | 'Direct Expenses' | 'Indirect Expenses' | 'Capital Account' | 'Bank Accounts';
  openingBalance: number;
  currentBalance: number;
  balanceType: 'debit' | 'credit';
  tallyLedgerName?: string;
  tallySyncStatus: 'mapped' | 'unmapped' | 'sync_error';
  gstApplicable: boolean;
}

export interface JournalItem {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  tenantId: string;
  voucherNumber: string;
  date: string;
  reference?: string;
  narration: string;
  items: JournalItem[];
  totalDebit: number;
  totalCredit: number;
  isMakerApproved: boolean;
  createdBy: string;
  approvedBy?: string;
  status: 'draft' | 'posted' | 'rejected';
  tallySyncStatus: 'synced' | 'pending';
  dnaId: string;
}

export interface BankAccount {
  id: string;
  tenantId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  accountType: 'current' | 'savings' | 'od';
  openingBalance: number;
  currentBalance: number;
  tallyLedgerId?: string;
}

export interface BankStatementItem {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  referenceNo: string;
  amount: number; // positive for credit, negative for debit
  type: 'credit' | 'debit';
  matchStatus: 'matched' | 'unmatched' | 'partial' | 'exception';
  matchedTransactionId?: string;
  matchedParty?: string;
  balance: number;
}

export interface GstMismatch {
  id: string;
  invoiceNumber: string;
  partyName: string;
  partyGstin: string;
  booksDate: string;
  portalDate?: string;
  booksTaxable: number;
  portalTaxable?: number;
  booksTax: number;
  portalTax?: number;
  varianceAmount: number;
  reason: 'missing_in_2b' | 'tax_difference' | 'date_mismatch' | 'duplicate_claim';
  status: 'pending' | 'resolved' | 'accepted_by_ca';
}

export interface TallySyncItem {
  id: string;
  tenantId: string;
  voucherType: 'Sales' | 'Purchase' | 'Receipt' | 'Payment' | 'Journal' | 'Contra';
  voucherNumber: string;
  date: string;
  amount: number;
  status: 'synced' | 'pending' | 'failed' | 'needs_review';
  errorMessage?: string;
  tallyMasterId?: string;
  retryCount: number;
  lastAttemptAt?: string;
}

export interface DataInboxItem {
  id: string;
  tenantId: string;
  source: 'whatsapp' | 'email' | 'upload' | 'ocr_scan';
  originalFileName: string;
  uploadedAt: string;
  fileType: 'pdf' | 'image' | 'excel';
  status: 'new' | 'processing' | 'needs_review' | 'converted' | 'rejected';
  extractedData: {
    partyName: string;
    gstin?: string;
    invoiceNumber: string;
    date: string;
    taxableAmount: number;
    taxAmount: number;
    totalAmount: number;
    itemsCount: number;
    confidenceScore: number; // 0 to 100
    suggestedCategory: string;
  };
  convertedTo?: 'purchase' | 'expense' | 'sales';
  convertedId?: string;
}

export interface TransactionDNA {
  dnaId: string;
  tenantId: string;
  entityType: 'invoice' | 'purchase' | 'payment' | 'journal';
  referenceNo: string;
  createdAt: string;
  source: 'manual' | 'quotation_conversion' | 'ocr_inbox' | 'tally_import' | 'pos_terminal';
  sourceDocument?: string;
  createdBy: string;
  approvedBy?: string;
  inventoryMoved: boolean;
  journalVoucherNo?: string;
  bankReconciliationStatus: 'reconciled' | 'pending' | 'unmatched';
  gstReturnCategory?: string;
  tallyVoucherId?: string;
  caReviewStatus: 'approved' | 'flagged' | 'pending';
  lineage: {
    stage: string;
    timestamp: string;
    actor: string;
    description: string;
  }[];
}

export interface CaClientConnection {
  id: string;
  caFirmId: string;
  caFirmName: string;
  clientTenantId: string;
  clientName: string;
  clientGstin: string;
  connectedSince: string;
  status: 'connected' | 'invitation_pending' | 'disconnected';
  permissions: {
    canViewBooks: boolean;
    canPostJournals: boolean;
    canFileGst: boolean;
    canPerformAudit: boolean;
  };
  assignedStaff: string;
  pendingRequestsCount: number;
  lastReviewDate?: string;
}

export interface CaDocumentRequest {
  id: string;
  caFirmId: string;
  clientTenantId: string;
  clientName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'requested' | 'uploaded' | 'under_review' | 'approved' | 'rejected';
  uploadedFileName?: string;
  uploadedAt?: string;
  notes?: string;
}

export interface CaTaxNotice {
  id: string;
  clientTenantId: string;
  clientName: string;
  noticeAuthority: 'Income Tax Department' | 'GST Department' | 'ROC';
  referenceNumber: string;
  noticeDate: string;
  responseDueDate: string;
  taxPeriod: string;
  demandAmount: number;
  subject: string;
  status: 'new' | 'analysing' | 'draft_prepared' | 'submitted' | 'closed';
  aiSummary: string;
}

export interface AutomationRule {
  id: string;
  tenantId: string;
  name: string;
  triggerEvent: string;
  conditions: {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
    value: string;
  }[];
  actions: {
    actionType: 'send_whatsapp' | 'send_email' | 'create_task' | 'queue_tally' | 'flag_ca';
    recipient?: string;
    template?: string;
  }[];
  isActive: boolean;
  lastRun?: string;
  executionCount: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'gst_invoice' | 'retail_thermal' | 'quotation' | 'delivery_challan' | 'ca_report';
  pageSize: 'A4' | 'A5' | 'thermal_80mm';
  primaryColor: string;
  showLogo: boolean;
  showQrCode: boolean;
  showSignature: boolean;
  showBankDetails: boolean;
  showHsnSummary: boolean;
  termsText: string;
  footerNotes: string;
  isDefault: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  target: 'business' | 'ca';
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  maxUsers: number;
  maxInvoicesMonthly: number;
  maxStorageGb: number;
  aiCreditsMonthly: number;
  tallySyncIncluded: boolean;
  gstAutomationsIncluded: boolean;
}

export interface SaasUsageMetrics {
  totalTenants: number;
  activeBusinesses: number;
  activeCaFirms: number;
  totalMonthlyRevenue: number;
  invoicesGeneratedThisMonth: number;
  tallySyncSuccessRate: number;
  ocrDocumentsProcessed: number;
  activeImpersonationSessions: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
}
