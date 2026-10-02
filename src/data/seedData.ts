import {
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
  SubscriptionPlan
} from '../types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-shree-retail',
    name: 'Shree Retail Mart Pvt Ltd',
    tradeName: 'Shree Retail Mart',
    type: 'business',
    gstin: '24AAACS1234A1Z5',
    pan: 'AAACS1234A',
    email: 'accounts@shreeretail.in',
    phone: '+91 98250 12345',
    address: 'Plot 42, GIDC Commercial Zone, SG Highway',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
    planId: 'plan-pro',
    subscriptionStatus: 'active',
    billingCycle: 'annual',
    createdAt: '2024-01-15T09:00:00Z',
    branches: [
      { id: 'br-main', name: 'Main Store & Warehouse', code: 'BR-AMD-01', address: 'SG Highway, Ahmedabad', isMain: true },
      { id: 'br-surat', name: 'Surat Distribution Hub', code: 'BR-SRT-02', address: 'Ring Road, Surat', isMain: false }
    ],
    bankAccounts: [],
    settings: {
      defaultCurrency: 'INR',
      invoicePrefix: 'SRM/24-25/',
      poPrefix: 'SRM/PO/',
      quotationPrefix: 'SRM/QT/',
      financialYearStart: '2024-04-01',
      enableMakerChecker: true,
      tallySyncMode: 'automatic',
      gstFilingFrequency: 'monthly',
      enableAutoRoundoff: true,
      termsAndConditions: '1. Goods once sold will not be taken back without original invoice.\n2. 18% p.a. interest will be levied on overdue invoices.'
    }
  },
  {
    id: 'tenant-abc-traders',
    name: 'ABC Traders',
    tradeName: 'ABC Distribution',
    type: 'buyer',
    gstin: '24BBBCS5678B1Z2',
    pan: 'BBBCS5678B',
    email: 'procurement@abctraders.com',
    phone: '+91 98980 98765',
    address: '104, Textile Market, Ring Road',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395002',
    planId: 'plan-starter',
    subscriptionStatus: 'active',
    billingCycle: 'monthly',
    createdAt: '2024-02-10T10:00:00Z',
    branches: [
      { id: 'br-abc-main', name: 'Surat Central Depot', code: 'ABC-01', address: 'Ring Road, Surat', isMain: true }
    ],
    bankAccounts: [],
    settings: {
      defaultCurrency: 'INR',
      invoicePrefix: 'ABC/INV/',
      poPrefix: 'ABC/PO/',
      quotationPrefix: 'ABC/QT/',
      financialYearStart: '2024-04-01',
      enableMakerChecker: false,
      tallySyncMode: 'one-click',
      gstFilingFrequency: 'monthly',
      enableAutoRoundoff: true,
      termsAndConditions: 'Payment strictly within 30 days.'
    }
  },
  {
    id: 'tenant-global-wholesale',
    name: 'Global Wholesale Distributors LLP',
    tradeName: 'Global Wholesale',
    type: 'supplier',
    gstin: '27CCCDS9999C1Z9',
    pan: 'CCCDS9999C',
    email: 'orders@globalwholesale.in',
    phone: '+91 98200 55443',
    address: 'Warehouse Complex 7, Bhiwandi',
    city: 'Thane',
    state: 'Maharashtra',
    pincode: '421302',
    planId: 'plan-pro',
    subscriptionStatus: 'active',
    billingCycle: 'annual',
    createdAt: '2023-11-01T08:30:00Z',
    branches: [
      { id: 'br-gw-mumbai', name: 'Bhiwandi Logistics Hub', code: 'GW-01', address: 'Bhiwandi, Maharashtra', isMain: true }
    ],
    bankAccounts: [],
    settings: {
      defaultCurrency: 'INR',
      invoicePrefix: 'GWD/24-25/',
      poPrefix: 'GWD/PO/',
      quotationPrefix: 'GWD/QT/',
      financialYearStart: '2024-04-01',
      enableMakerChecker: true,
      tallySyncMode: 'automatic',
      gstFilingFrequency: 'monthly',
      enableAutoRoundoff: true,
      termsAndConditions: 'All disputes subject to Mumbai jurisdiction only.'
    }
  },
  {
    id: 'tenant-kp-tax-advisory',
    name: 'KP Tax & Advisory Chartered Accountants',
    tradeName: 'KP Tax & Advisory',
    type: 'ca',
    gstin: '24DDDCA8888D1Z1',
    pan: 'DDDCA8888D',
    email: 'info@kptaxadvisory.com',
    phone: '+91 79 2656 7890',
    address: '602, Synergy Tower, Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
    planId: 'plan-ca-firm',
    subscriptionStatus: 'active',
    billingCycle: 'annual',
    createdAt: '2023-08-20T11:00:00Z',
    branches: [
      { id: 'br-kp-ca-main', name: 'Bodakdev Head Office', code: 'KP-01', address: 'Synergy Tower, Bodakdev', isMain: true }
    ],
    bankAccounts: [],
    settings: {
      defaultCurrency: 'INR',
      invoicePrefix: 'KPT/BILL/',
      poPrefix: 'KPT/PO/',
      quotationPrefix: 'KPT/QT/',
      financialYearStart: '2024-04-01',
      enableMakerChecker: true,
      tallySyncMode: 'automatic',
      gstFilingFrequency: 'monthly',
      enableAutoRoundoff: true,
      termsAndConditions: 'Professional services rendered in accordance with ICAI standards.'
    }
  },
  {
    id: 'tenant-admin-hq',
    name: 'VyapaarOS Platform Infrastructure',
    tradeName: 'VyapaarOS HQ',
    type: 'platform',
    gstin: '24EEEEE0000E1Z0',
    pan: 'EEEEE0000E',
    email: 'support@vyapaaros.com',
    phone: '+91 80000 11223',
    address: 'Tech Park One, Airport Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    planId: 'plan-enterprise',
    subscriptionStatus: 'active',
    billingCycle: 'annual',
    createdAt: '2023-01-01T00:00:00Z',
    branches: [
      { id: 'br-hq', name: 'Cloud Operations Base', code: 'HQ-01', address: 'Tech Park One', isMain: true }
    ],
    bankAccounts: [],
    settings: {
      defaultCurrency: 'INR',
      invoicePrefix: 'VOS/INV/',
      poPrefix: 'VOS/PO/',
      quotationPrefix: 'VOS/QT/',
      financialYearStart: '2024-04-01',
      enableMakerChecker: true,
      tallySyncMode: 'automatic',
      gstFilingFrequency: 'monthly',
      enableAutoRoundoff: true,
      termsAndConditions: 'SaaS SLA standard 99.9% uptime.'
    }
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-parth',
    name: 'Parth Kanjariya (Owner)',
    email: 'parthkanjariya78@gmail.com',
    phone: '+91 98250 12345',
    role: 'OWNER',
    accountType: 'BUSINESS',
    tenantId: 'tenant-shree-retail',
    organizationName: 'Shree Retail Mart Pvt Ltd',
    assignedBranches: ['br-main', 'br-surat'],
    permissions: ['all'],
    status: 'active',
    lastActive: 'Just now',
    memberships: [
      {
        id: 'mem-parth-shree',
        userId: 'usr-parth',
        organizationId: 'tenant-shree-retail',
        tenantId: 'tenant-shree-retail',
        organizationName: 'Shree Retail Mart Pvt Ltd',
        workspaceType: 'business',
        role: 'OWNER',
        status: 'active',
        permissions: ['all'],
        joinedAt: '2024-01-15T09:00:00Z',
        lastAccessedAt: '2024-10-02T10:00:00Z',
        onboardingCompleted: true
      },
      {
        id: 'mem-parth-abc',
        userId: 'usr-parth',
        organizationId: 'tenant-abc-traders',
        tenantId: 'tenant-abc-traders',
        organizationName: 'ABC Traders (Procurement Partner)',
        workspaceType: 'buyer',
        role: 'PURCHASE_MANAGER',
        status: 'active',
        permissions: ['buyer_workspace'],
        joinedAt: '2024-02-10T10:00:00Z',
        lastAccessedAt: '2024-09-28T14:00:00Z',
        onboardingCompleted: true
      }
    ]
  },
  {
    id: 'usr-ca-kailash',
    name: 'CA Kailash Patel, FCA',
    email: 'kailash@kptaxadvisory.com',
    phone: '+91 98790 44332',
    role: 'CA_PARTNER',
    accountType: 'CA',
    tenantId: 'tenant-kp-tax-advisory',
    organizationName: 'KP Tax & Advisory Chartered Accountants',
    assignedBranches: ['br-kp-ca-main'],
    permissions: ['all_ca_features', 'audit', 'tax_filing'],
    status: 'active',
    lastActive: '5 mins ago',
    memberships: [
      {
        id: 'mem-kailash-kp',
        userId: 'usr-ca-kailash',
        organizationId: 'tenant-kp-tax-advisory',
        tenantId: 'tenant-kp-tax-advisory',
        organizationName: 'KP Tax & Advisory Chartered Accountants',
        workspaceType: 'ca',
        role: 'CA_PARTNER',
        status: 'active',
        permissions: ['all_ca_features', 'audit', 'tax_filing'],
        joinedAt: '2023-08-20T11:00:00Z',
        lastAccessedAt: '2024-10-02T11:00:00Z',
        onboardingCompleted: true
      }
    ]
  },
  {
    id: 'usr-buyer-rohit',
    name: 'Rohit Shah (Procurement)',
    email: 'procurement@abctraders.com',
    phone: '+91 98980 98765',
    role: 'PURCHASE_MANAGER',
    accountType: 'BUYER',
    tenantId: 'tenant-abc-traders',
    organizationName: 'ABC Traders',
    assignedBranches: ['br-abc-main'],
    permissions: ['buyer_workspace'],
    status: 'active',
    lastActive: '20 mins ago',
    memberships: [
      {
        id: 'mem-rohit-abc',
        userId: 'usr-buyer-rohit',
        organizationId: 'tenant-abc-traders',
        tenantId: 'tenant-abc-traders',
        organizationName: 'ABC Traders',
        workspaceType: 'buyer',
        role: 'PURCHASE_MANAGER',
        status: 'active',
        permissions: ['buyer_workspace'],
        joinedAt: '2024-02-10T10:00:00Z',
        lastAccessedAt: '2024-10-01T15:00:00Z',
        onboardingCompleted: true
      }
    ]
  },
  {
    id: 'usr-supplier-suresh',
    name: 'Suresh Agarwal (Wholesale)',
    email: 'orders@globalwholesale.in',
    phone: '+91 98200 55443',
    role: 'SALES_MANAGER',
    accountType: 'SUPPLIER',
    tenantId: 'tenant-global-wholesale',
    organizationName: 'Global Wholesale Distributors LLP',
    assignedBranches: ['br-gw-mumbai'],
    permissions: ['supplier_workspace'],
    status: 'active',
    lastActive: '1 hour ago',
    memberships: [
      {
        id: 'mem-suresh-gw',
        userId: 'usr-supplier-suresh',
        organizationId: 'tenant-global-wholesale',
        tenantId: 'tenant-global-wholesale',
        organizationName: 'Global Wholesale Distributors LLP',
        workspaceType: 'supplier',
        role: 'SALES_MANAGER',
        status: 'active',
        permissions: ['supplier_workspace'],
        joinedAt: '2023-11-01T08:30:00Z',
        lastAccessedAt: '2024-10-01T16:00:00Z',
        onboardingCompleted: true
      }
    ]
  },
  {
    id: 'usr-super-admin',
    name: 'Super Admin (VyapaarOS Platform)',
    email: 'admin@vyapaaros.com',
    phone: '+91 80000 11223',
    role: 'SUPER_ADMIN',
    tenantId: 'tenant-admin-hq',
    organizationName: 'VyapaarOS Platform Infrastructure',
    assignedBranches: ['br-hq'],
    permissions: ['super_admin_all'],
    status: 'active',
    lastActive: 'Active now',
    memberships: [
      {
        id: 'mem-admin-hq',
        userId: 'usr-super-admin',
        organizationId: 'tenant-admin-hq',
        tenantId: 'tenant-admin-hq',
        organizationName: 'VyapaarOS Platform Infrastructure',
        workspaceType: 'admin',
        role: 'SUPER_ADMIN',
        status: 'active',
        permissions: ['super_admin_all'],
        joinedAt: '2023-01-01T00:00:00Z',
        lastAccessedAt: '2024-10-02T12:00:00Z',
        onboardingCompleted: true
      }
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-tv-43',
    tenantId: 'tenant-shree-retail',
    name: 'Smart 4K UHD LED TV 43"',
    sku: 'ELEC-TV-43',
    barcode: '8901234567890',
    category: 'Consumer Electronics',
    unit: 'PCS',
    purchasePrice: 18500,
    sellingPrice: 24999,
    mrp: 29999,
    taxRate: 18,
    hsnCode: '8528',
    currentStock: 28,
    reorderLevel: 10,
    minStock: 5,
    warehouseStocks: { 'br-main': 22, 'br-surat': 6 },
    status: 'active',
    batchTracking: true,
    description: 'Ultra HD 4K IPS Panel, Dolby Audio, Google TV OS'
  },
  {
    id: 'prod-barcode-scan',
    tenantId: 'tenant-shree-retail',
    name: 'Industrial Wireless 2D Barcode Scanner',
    sku: 'SCAN-PRO-2',
    barcode: '8901234567891',
    category: 'POS & Automation',
    unit: 'PCS',
    purchasePrice: 2200,
    sellingPrice: 3499,
    mrp: 4500,
    taxRate: 18,
    hsnCode: '8471',
    currentStock: 45,
    reorderLevel: 15,
    minStock: 8,
    warehouseStocks: { 'br-main': 35, 'br-surat': 10 },
    status: 'active',
    batchTracking: false,
    description: 'Plug-and-play USB 2.4GHz with charging cradle, rugged drop resistance'
  },
  {
    id: 'prod-thermal-paper',
    tenantId: 'tenant-shree-retail',
    name: 'Thermal Billing Paper Rolls 80mm (Box of 50)',
    sku: 'STAT-THM-80',
    barcode: '8901234567892',
    category: 'Billing Consumables',
    unit: 'BOX',
    purchasePrice: 950,
    sellingPrice: 1450,
    mrp: 1800,
    taxRate: 12,
    hsnCode: '4811',
    currentStock: 12, // low stock trigger!
    reorderLevel: 25,
    minStock: 10,
    warehouseStocks: { 'br-main': 8, 'br-surat': 4 },
    status: 'active',
    batchTracking: false,
    description: 'BPA-free dark black thermal printing image retention up to 5 years'
  },
  {
    id: 'prod-cash-drawer',
    tenantId: 'tenant-shree-retail',
    name: 'Heavy Duty Metal Cash Drawer RJ11',
    sku: 'POS-CSH-01',
    barcode: '8901234567893',
    category: 'POS & Automation',
    unit: 'PCS',
    purchasePrice: 1600,
    sellingPrice: 2800,
    mrp: 3500,
    taxRate: 18,
    hsnCode: '8303',
    currentStock: 16,
    reorderLevel: 5,
    minStock: 2,
    warehouseStocks: { 'br-main': 12, 'br-surat': 4 },
    status: 'active',
    batchTracking: false,
    description: '5 bill slots, 8 coin compartments, key lock & printer interface trigger'
  },
  {
    id: 'prod-chair-exec',
    tenantId: 'tenant-shree-retail',
    name: 'Ergonomic High-Back Executive Mesh Chair',
    sku: 'FURN-CHR-01',
    barcode: '8901234567894',
    category: 'Commercial Furniture',
    unit: 'PCS',
    purchasePrice: 4200,
    sellingPrice: 6999,
    mrp: 8999,
    taxRate: 18,
    hsnCode: '9401',
    currentStock: 18,
    reorderLevel: 6,
    minStock: 3,
    warehouseStocks: { 'br-main': 14, 'br-surat': 4 },
    status: 'active',
    batchTracking: false,
    description: 'Adjustable lumbar support, 3D armrests, class 4 gas lift'
  }
];

export const INITIAL_PARTIES: Party[] = [
  {
    id: 'party-abc-traders',
    tenantId: 'tenant-shree-retail',
    type: 'customer',
    name: 'ABC Traders',
    contactPerson: 'Rohit Shah',
    email: 'procurement@abctraders.com',
    phone: '+91 98980 98765',
    gstin: '24BBBCS5678B1Z2',
    pan: 'BBBCS5678B',
    billingAddress: '104, Textile Market, Ring Road',
    shippingAddress: '104, Textile Market, Ring Road, Surat',
    state: 'Gujarat',
    creditLimit: 250000,
    paymentTermsDays: 30,
    openingBalance: 18500,
    currentBalance: 78498, // outstanding
    createdAt: '2024-01-20T00:00:00Z',
    status: 'active',
    category: 'Wholesale Tier-1'
  },
  {
    id: 'party-metro-mart',
    tenantId: 'tenant-shree-retail',
    type: 'customer',
    name: 'Metro HyperMart Retail Group',
    contactPerson: 'Anjali Varma',
    email: 'finance@metrohypermart.in',
    phone: '+91 97123 45678',
    gstin: '24AAACM4321A1Z8',
    pan: 'AAACM4321A',
    billingAddress: 'GF-04, Grand Mall, Drive-In Road',
    shippingAddress: 'Grand Mall, Drive-In Road, Ahmedabad',
    state: 'Gujarat',
    creditLimit: 500000,
    paymentTermsDays: 15,
    openingBalance: 0,
    currentBalance: 49998,
    createdAt: '2024-02-01T00:00:00Z',
    status: 'active',
    category: 'Corporate Key Account'
  },
  {
    id: 'party-global-wholesale',
    tenantId: 'tenant-shree-retail',
    type: 'supplier',
    name: 'Global Wholesale Distributors LLP',
    contactPerson: 'Suresh Agarwal',
    email: 'orders@globalwholesale.in',
    phone: '+91 98200 55443',
    gstin: '27CCCDS9999C1Z9',
    pan: 'CCCDS9999C',
    billingAddress: 'Complex 7, Bhiwandi Logistics Park',
    shippingAddress: 'Thane, Maharashtra',
    state: 'Maharashtra',
    creditLimit: 1000000,
    paymentTermsDays: 45,
    openingBalance: 42000,
    currentBalance: 92500,
    bankDetails: {
      accountNumber: '920020011223344',
      ifsc: 'HDFC0000123',
      bankName: 'HDFC Bank Ltd',
      branch: 'Bhiwandi Main'
    },
    createdAt: '2024-01-16T00:00:00Z',
    status: 'active',
    category: 'National Distributor'
  },
  {
    id: 'party-supreme-paper',
    tenantId: 'tenant-shree-retail',
    type: 'supplier',
    name: 'Supreme Paper Mills Ltd',
    contactPerson: 'Devendra Mehta',
    email: 'sales@supremepapermills.com',
    phone: '+91 94260 77889',
    gstin: '24AABCS8899S1ZA',
    pan: 'AABCS8899S',
    billingAddress: 'Survey 22, Vapi Industrial Area',
    shippingAddress: 'Vapi, Gujarat',
    state: 'Gujarat',
    creditLimit: 150000,
    paymentTermsDays: 21,
    openingBalance: 0,
    currentBalance: 19000,
    bankDetails: {
      accountNumber: '50200088997766',
      ifsc: 'ICIC0001889',
      bankName: 'ICICI Bank',
      branch: 'Vapi Branch'
    },
    createdAt: '2024-02-15T00:00:00Z',
    status: 'active',
    category: 'Raw Materials'
  }
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-hdfc-current',
    tenantId: 'tenant-shree-retail',
    accountName: 'HDFC Bank Primary Current A/c',
    accountNumber: '50200011223344',
    bankName: 'HDFC Bank Ltd',
    ifsc: 'HDFC0000060',
    accountType: 'current',
    openingBalance: 1850000,
    currentBalance: 2435750,
    tallyLedgerId: 'ledg-hdfc-bank'
  },
  {
    id: 'bank-sbi-od',
    tenantId: 'tenant-shree-retail',
    accountName: 'State Bank of India CC / OD Account',
    accountNumber: '334455667788',
    bankName: 'State Bank of India',
    ifsc: 'SBIN0001234',
    accountType: 'od',
    openingBalance: 500000,
    currentBalance: 480000,
    tallyLedgerId: 'ledg-sbi-bank'
  }
];

export const INITIAL_LEDGERS: LedgerAccount[] = [
  {
    id: 'ledg-sales-rev',
    tenantId: 'tenant-shree-retail',
    name: 'Sales Account (Domestic)',
    code: '3001',
    group: 'Direct Incomes',
    openingBalance: 0,
    currentBalance: 4250000,
    balanceType: 'credit',
    tallyLedgerName: 'Sales Domestic GST',
    tallySyncStatus: 'mapped',
    gstApplicable: true
  },
  {
    id: 'ledg-pur-rev',
    tenantId: 'tenant-shree-retail',
    name: 'Purchase Account (Trade)',
    code: '4001',
    group: 'Direct Expenses',
    openingBalance: 0,
    currentBalance: 2980000,
    balanceType: 'debit',
    tallyLedgerName: 'Purchase Trade Account',
    tallySyncStatus: 'mapped',
    gstApplicable: true
  },
  {
    id: 'ledg-cust-abc',
    tenantId: 'tenant-shree-retail',
    name: 'ABC Traders Ledger',
    code: '1001-ABC',
    group: 'Current Assets',
    openingBalance: 18500,
    currentBalance: 78498,
    balanceType: 'debit',
    tallyLedgerName: 'ABC Traders Surat',
    tallySyncStatus: 'mapped',
    gstApplicable: false
  },
  {
    id: 'ledg-supp-global',
    tenantId: 'tenant-shree-retail',
    name: 'Global Wholesale Distributors LLP',
    code: '2001-GWD',
    group: 'Current Liabilities',
    openingBalance: 42000,
    currentBalance: 92500,
    balanceType: 'credit',
    tallyLedgerName: 'Global Wholesale Bhiwandi',
    tallySyncStatus: 'mapped',
    gstApplicable: false
  },
  {
    id: 'ledg-output-cgst',
    tenantId: 'tenant-shree-retail',
    name: 'Output CGST 9%',
    code: '2010',
    group: 'Current Liabilities',
    openingBalance: 0,
    currentBalance: 382500,
    balanceType: 'credit',
    tallyLedgerName: 'Output CGST @ 9%',
    tallySyncStatus: 'mapped',
    gstApplicable: true
  },
  {
    id: 'ledg-output-sgst',
    tenantId: 'tenant-shree-retail',
    name: 'Output SGST 9%',
    code: '2011',
    group: 'Current Liabilities',
    openingBalance: 0,
    currentBalance: 382500,
    balanceType: 'credit',
    tallyLedgerName: 'Output SGST @ 9%',
    tallySyncStatus: 'mapped',
    gstApplicable: true
  },
  {
    id: 'ledg-input-igst',
    tenantId: 'tenant-shree-retail',
    name: 'Input IGST 18%',
    code: '1012',
    group: 'Current Assets',
    openingBalance: 0,
    currentBalance: 165600,
    balanceType: 'debit',
    tallyLedgerName: 'Input IGST @ 18%',
    tallySyncStatus: 'mapped',
    gstApplicable: true
  },
  {
    id: 'ledg-hdfc-bank',
    tenantId: 'tenant-shree-retail',
    name: 'HDFC Bank Current Account',
    code: '1020',
    group: 'Bank Accounts',
    openingBalance: 1850000,
    currentBalance: 2435750,
    balanceType: 'debit',
    tallyLedgerName: 'HDFC Bank 50200011223344',
    tallySyncStatus: 'mapped',
    gstApplicable: false
  }
];

export const INITIAL_INVOICES: SalesInvoice[] = [
  {
    id: 'inv-2425-001',
    tenantId: 'tenant-shree-retail',
    invoiceNumber: 'SRM/24-25/001',
    orderNumber: 'SO-2024-001',
    quotationNumber: 'QT-2024-001',
    date: '2024-10-01',
    dueDate: '2024-10-31',
    customerId: 'party-abc-traders',
    customerName: 'ABC Traders',
    customerGstin: '24BBBCS5678B1Z2',
    billingAddress: '104, Textile Market, Ring Road, Surat, Gujarat',
    placeOfSupply: '24-Gujarat',
    warehouseId: 'br-main',
    items: [
      {
        id: 'item-inv-1',
        productId: 'prod-tv-43',
        productName: 'Smart 4K UHD LED TV 43"',
        sku: 'ELEC-TV-43',
        hsnCode: '8528',
        quantity: 2,
        unit: 'PCS',
        rate: 24999,
        discountPercent: 5,
        taxableValue: 47498.10,
        taxRate: 18,
        cgst: 4274.83,
        sgst: 4274.83,
        igst: 0,
        total: 56047.76
      },
      {
        id: 'item-inv-2',
        productId: 'prod-barcode-scan',
        productName: 'Industrial Wireless 2D Barcode Scanner',
        sku: 'SCAN-PRO-2',
        hsnCode: '8471',
        quantity: 3,
        unit: 'PCS',
        rate: 3499,
        discountPercent: 0,
        taxableValue: 10497.00,
        taxRate: 18,
        cgst: 944.73,
        sgst: 944.73,
        igst: 0,
        total: 12386.46
      }
    ],
    subtotal: 60495,
    totalDiscount: 2499.90,
    taxableAmount: 57995.10,
    totalCgst: 5219.56,
    totalSgst: 5219.56,
    totalIgst: 0,
    roundOff: 0.78,
    totalAmount: 68435.00,
    paidAmount: 20000.00,
    balanceDue: 48435.00,
    status: 'partially_paid',
    paymentTerms: '30 Days Net',
    notes: 'Thank you for your business. Fast warranty service available at all service centers.',
    tallySyncStatus: 'synced',
    gstStatus: 'uploaded',
    eInvoiceNumber: 'INV2425001-IRN-998877665544332211',
    eWayBillNumber: '241009876543',
    dnaId: 'dna-inv-2425-001',
    createdAt: '2024-10-01T10:15:00Z'
  },
  {
    id: 'inv-2425-002',
    tenantId: 'tenant-shree-retail',
    invoiceNumber: 'SRM/24-25/002',
    date: '2024-10-02',
    dueDate: '2024-10-17',
    customerId: 'party-metro-mart',
    customerName: 'Metro HyperMart Retail Group',
    customerGstin: '24AAACM4321A1Z8',
    billingAddress: 'GF-04, Grand Mall, Drive-In Road, Ahmedabad, Gujarat',
    placeOfSupply: '24-Gujarat',
    warehouseId: 'br-main',
    items: [
      {
        id: 'item-inv-3',
        productId: 'prod-chair-exec',
        productName: 'Ergonomic High-Back Executive Mesh Chair',
        sku: 'FURN-CHR-01',
        hsnCode: '9401',
        quantity: 4,
        unit: 'PCS',
        rate: 6999,
        discountPercent: 10,
        taxableValue: 25196.40,
        taxRate: 18,
        cgst: 2267.68,
        sgst: 2267.68,
        igst: 0,
        total: 29731.76
      },
      {
        id: 'item-inv-4',
        productId: 'prod-cash-drawer',
        productName: 'Heavy Duty Metal Cash Drawer RJ11',
        sku: 'POS-CSH-01',
        hsnCode: '8303',
        quantity: 2,
        unit: 'PCS',
        rate: 2800,
        discountPercent: 0,
        taxableValue: 5600.00,
        taxRate: 18,
        cgst: 504.00,
        sgst: 504.00,
        igst: 0,
        total: 6608.00
      }
    ],
    subtotal: 33596,
    totalDiscount: 2799.60,
    taxableAmount: 30796.40,
    totalCgst: 2771.68,
    totalSgst: 2771.68,
    totalIgst: 0,
    roundOff: 0.24,
    totalAmount: 36340.00,
    paidAmount: 36340.00,
    balanceDue: 0,
    status: 'paid',
    paymentTerms: '15 Days Net',
    notes: 'Paid via HDFC NEFT transaction N9922001.',
    tallySyncStatus: 'synced',
    gstStatus: 'uploaded',
    dnaId: 'dna-inv-2425-002',
    createdAt: '2024-10-02T14:30:00Z'
  },
  {
    id: 'inv-2425-003',
    tenantId: 'tenant-shree-retail',
    invoiceNumber: 'SRM/24-25/003',
    date: '2024-10-03',
    dueDate: '2024-10-18',
    customerId: 'party-abc-traders',
    customerName: 'ABC Traders',
    customerGstin: '24BBBCS5678B1Z2',
    billingAddress: '104, Textile Market, Ring Road, Surat',
    placeOfSupply: '24-Gujarat',
    warehouseId: 'br-main',
    items: [
      {
        id: 'item-inv-5',
        productId: 'prod-tv-43',
        productName: 'Smart 4K UHD LED TV 43"',
        sku: 'ELEC-TV-43',
        hsnCode: '8528',
        quantity: 1,
        unit: 'PCS',
        rate: 24999,
        discountPercent: 0,
        taxableValue: 24999.00,
        taxRate: 18,
        cgst: 2249.91,
        sgst: 2249.91,
        igst: 0,
        total: 29498.82
      }
    ],
    subtotal: 24999,
    totalDiscount: 0,
    taxableAmount: 24999.00,
    totalCgst: 2249.91,
    totalSgst: 2249.91,
    totalIgst: 0,
    roundOff: 0.18,
    totalAmount: 29499.00,
    paidAmount: 0,
    balanceDue: 29499.00,
    status: 'sent',
    paymentTerms: '15 Days Net',
    notes: 'Urgent festival stock dispatch',
    tallySyncStatus: 'pending',
    gstStatus: 'pending',
    dnaId: 'dna-inv-2425-003',
    createdAt: '2024-10-03T11:00:00Z'
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'qt-2024-001',
    tenantId: 'tenant-shree-retail',
    quotationNumber: 'SRM/QT/24-089',
    date: '2024-09-28',
    validUntil: '2024-10-28',
    customerId: 'party-abc-traders',
    customerName: 'ABC Traders',
    items: [
      {
        id: 'qt-item-1',
        productId: 'prod-tv-43',
        productName: 'Smart 4K UHD LED TV 43"',
        sku: 'ELEC-TV-43',
        hsnCode: '8528',
        quantity: 5,
        unit: 'PCS',
        rate: 24500,
        discountPercent: 3,
        taxableValue: 118825,
        taxRate: 18,
        cgst: 10694.25,
        sgst: 10694.25,
        igst: 0,
        total: 140213.50
      }
    ],
    totalAmount: 140213.50,
    status: 'accepted',
    notes: 'Special festival bulk discount approved by Owner.',
    convertedToOrderId: 'so-2024-001'
  },
  {
    id: 'qt-2024-002',
    tenantId: 'tenant-shree-retail',
    quotationNumber: 'SRM/QT/24-090',
    date: '2024-10-02',
    validUntil: '2024-11-02',
    customerId: 'party-metro-mart',
    customerName: 'Metro HyperMart Retail Group',
    items: [
      {
        id: 'qt-item-2',
        productId: 'prod-barcode-scan',
        productName: 'Industrial Wireless 2D Barcode Scanner',
        sku: 'SCAN-PRO-2',
        hsnCode: '8471',
        quantity: 10,
        unit: 'PCS',
        rate: 3300,
        discountPercent: 5,
        taxableValue: 31350,
        taxRate: 18,
        cgst: 2821.50,
        sgst: 2821.50,
        igst: 0,
        total: 36993.00
      }
    ],
    totalAmount: 36993.00,
    status: 'sent',
    notes: 'Quotation sent via email and WhatsApp to client procurement team.'
  }
];

export const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'so-2024-001',
    tenantId: 'tenant-shree-retail',
    orderNumber: 'SO-2024-001',
    quotationId: 'qt-2024-001',
    date: '2024-09-30',
    expectedDeliveryDate: '2024-10-05',
    customerId: 'party-abc-traders',
    customerName: 'ABC Traders',
    items: [
      {
        id: 'so-item-1',
        productId: 'prod-tv-43',
        productName: 'Smart 4K UHD LED TV 43"',
        sku: 'ELEC-TV-43',
        hsnCode: '8528',
        quantity: 5,
        unit: 'PCS',
        rate: 24500,
        discountPercent: 3,
        taxableValue: 118825,
        taxRate: 18,
        cgst: 10694.25,
        sgst: 10694.25,
        igst: 0,
        total: 140213.50
      }
    ],
    totalAmount: 140213.50,
    status: 'confirmed',
    convertedInvoiceId: 'inv-2425-001'
  }
];

export const INITIAL_PURCHASES: PurchaseInvoice[] = [
  {
    id: 'pur-2425-001',
    tenantId: 'tenant-shree-retail',
    billNumber: 'BILL-SRM-045',
    supplierInvoiceNumber: 'GWD/24-25/8920',
    poNumber: 'PO-2024-012',
    date: '2024-09-25',
    dueDate: '2024-11-09',
    supplierId: 'party-global-wholesale',
    supplierName: 'Global Wholesale Distributors LLP',
    supplierGstin: '27CCCDS9999C1Z9',
    warehouseId: 'br-main',
    items: [
      {
        id: 'item-pur-1',
        productId: 'prod-tv-43',
        productName: 'Smart 4K UHD LED TV 43"',
        sku: 'ELEC-TV-43',
        hsnCode: '8528',
        quantity: 5,
        unit: 'PCS',
        rate: 18500,
        discountPercent: 0,
        taxableValue: 92500,
        taxRate: 18,
        cgst: 0,
        sgst: 0,
        igst: 16650,
        total: 109150
      }
    ],
    subtotal: 92500,
    taxableAmount: 92500,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 16650,
    totalAmount: 109150,
    paidAmount: 16650,
    balanceDue: 92500,
    status: 'approved',
    gstStatus: 'matched',
    tallySyncStatus: 'synced',
    dnaId: 'dna-pur-2425-001',
    createdAt: '2024-09-25T16:00:00Z'
  },
  {
    id: 'pur-2425-002',
    tenantId: 'tenant-shree-retail',
    billNumber: 'BILL-SRM-046',
    supplierInvoiceNumber: 'SPM/OCT/011',
    date: '2024-10-01',
    dueDate: '2024-10-22',
    supplierId: 'party-supreme-paper',
    supplierName: 'Supreme Paper Mills Ltd',
    supplierGstin: '24AABCS8899S1ZA',
    warehouseId: 'br-main',
    items: [
      {
        id: 'item-pur-2',
        productId: 'prod-thermal-paper',
        productName: 'Thermal Billing Paper Rolls 80mm (Box of 50)',
        sku: 'STAT-THM-80',
        hsnCode: '4811',
        quantity: 20,
        unit: 'BOX',
        rate: 950,
        discountPercent: 0,
        taxableValue: 19000,
        taxRate: 12,
        cgst: 1140,
        sgst: 1140,
        igst: 0,
        total: 21280
      }
    ],
    subtotal: 19000,
    taxableAmount: 19000,
    totalCgst: 1140,
    totalSgst: 1140,
    totalIgst: 0,
    totalAmount: 21280,
    paidAmount: 2280,
    balanceDue: 19000,
    status: 'approved',
    gstStatus: 'unmatched_in_2b', // triggers GST alert!
    tallySyncStatus: 'pending',
    dnaId: 'dna-pur-2425-002',
    createdAt: '2024-10-01T18:00:00Z'
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-2024-012',
    tenantId: 'tenant-shree-retail',
    poNumber: 'SRM/PO/24-012',
    date: '2024-09-22',
    supplierId: 'party-global-wholesale',
    supplierName: 'Global Wholesale Distributors LLP',
    items: [
      {
        id: 'po-item-1',
        productId: 'prod-tv-43',
        productName: 'Smart 4K UHD LED TV 43"',
        sku: 'ELEC-TV-43',
        hsnCode: '8528',
        quantity: 5,
        unit: 'PCS',
        rate: 18500,
        discountPercent: 0,
        taxableValue: 92500,
        taxRate: 18,
        cgst: 0,
        sgst: 0,
        igst: 16650,
        total: 109150
      }
    ],
    totalAmount: 109150,
    status: 'invoiced'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-001',
    tenantId: 'tenant-shree-retail',
    receiptNumber: 'RCPT-2024-101',
    type: 'customer_payment',
    partyId: 'party-abc-traders',
    partyName: 'ABC Traders',
    amount: 20000,
    date: '2024-10-02',
    paymentMode: 'bank_transfer',
    bankAccountId: 'bank-hdfc-current',
    referenceNo: 'HDFCN2410029981',
    allocatedInvoices: [
      { invoiceId: 'inv-2425-001', invoiceNumber: 'SRM/24-25/001', allocatedAmount: 20000 }
    ],
    unallocatedAmount: 0,
    notes: 'Part payment against Invoice SRM/24-25/001',
    status: 'completed',
    tallySyncStatus: 'synced',
    dnaId: 'dna-pay-001',
    createdAt: '2024-10-02T16:00:00Z'
  },
  {
    id: 'pay-002',
    tenantId: 'tenant-shree-retail',
    receiptNumber: 'RCPT-2024-102',
    type: 'customer_payment',
    partyId: 'party-metro-mart',
    partyName: 'Metro HyperMart Retail Group',
    amount: 36340,
    date: '2024-10-02',
    paymentMode: 'upi',
    bankAccountId: 'bank-hdfc-current',
    referenceNo: 'UPI-METRO-998822',
    allocatedInvoices: [
      { invoiceId: 'inv-2425-002', invoiceNumber: 'SRM/24-25/002', allocatedAmount: 36340 }
    ],
    unallocatedAmount: 0,
    notes: 'Full payment received instantly via UPI QR',
    status: 'completed',
    tallySyncStatus: 'synced',
    dnaId: 'dna-pay-002',
    createdAt: '2024-10-02T17:15:00Z'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-001',
    tenantId: 'tenant-shree-retail',
    expenseNumber: 'EXP-2024-041',
    date: '2024-10-01',
    category: 'Logistics & Courier',
    vendorName: 'BlueDart Express Ltd',
    amount: 4500,
    taxAmount: 810,
    paymentMode: 'bank_transfer',
    bankAccountId: 'bank-hdfc-current',
    description: 'Express cargo delivery to Surat client distribution center',
    tallySyncStatus: 'synced'
  },
  {
    id: 'exp-002',
    tenantId: 'tenant-shree-retail',
    expenseNumber: 'EXP-2024-042',
    date: '2024-10-02',
    category: 'Electricity & Utilities',
    vendorName: 'Torrent Power Ltd',
    amount: 18250,
    taxAmount: 0,
    paymentMode: 'bank_transfer',
    bankAccountId: 'bank-hdfc-current',
    description: 'Showroom & warehouse commercial electricity bill for Sept 2024',
    tallySyncStatus: 'synced'
  }
];

export const INITIAL_BANK_STATEMENTS: BankStatementItem[] = [
  {
    id: 'stmt-001',
    bankAccountId: 'bank-hdfc-current',
    date: '2024-10-02',
    description: 'NEFT CR - ABC TRADERS - HDFCN2410029981',
    referenceNo: 'HDFCN2410029981',
    amount: 20000,
    type: 'credit',
    matchStatus: 'matched',
    matchedTransactionId: 'pay-001',
    matchedParty: 'ABC Traders',
    balance: 2452290
  },
  {
    id: 'stmt-002',
    bankAccountId: 'bank-hdfc-current',
    date: '2024-10-02',
    description: 'UPI / METRO HYPERMART / UPI-METRO-998822',
    referenceNo: 'UPI-METRO-998822',
    amount: 36340,
    type: 'credit',
    matchStatus: 'matched',
    matchedTransactionId: 'pay-002',
    matchedParty: 'Metro HyperMart Retail Group',
    balance: 2488630
  },
  {
    id: 'stmt-003',
    bankAccountId: 'bank-hdfc-current',
    date: '2024-10-03',
    description: 'CHQ WDL / RAJESH ELECTRICALS UNKNOWN REF',
    referenceNo: 'CHQ-882190',
    amount: -12500,
    type: 'debit',
    matchStatus: 'exception', // Bank exception trigger!
    balance: 2476130
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'jrn-2024-001',
    tenantId: 'tenant-shree-retail',
    voucherNumber: 'JV-2024-001',
    date: '2024-10-01',
    reference: 'SRM/24-25/001',
    narration: 'Being sales booked against invoice SRM/24-25/001 to ABC Traders',
    items: [
      { accountId: 'ledg-cust-abc', accountName: 'ABC Traders Ledger', debit: 68435, credit: 0 },
      { accountId: 'ledg-sales-rev', accountName: 'Sales Account (Domestic)', debit: 0, credit: 57995.10 },
      { accountId: 'ledg-output-cgst', accountName: 'Output CGST 9%', debit: 0, credit: 5219.56 },
      { accountId: 'ledg-output-sgst', accountName: 'Output SGST 9%', debit: 0, credit: 5219.56 },
      { accountId: 'ledg-rndoff', accountName: 'Round Off Account', debit: 0, credit: 0.78 }
    ],
    totalDebit: 68435,
    totalCredit: 68435,
    isMakerApproved: true,
    createdBy: 'Parth Kanjariya',
    approvedBy: 'CA Kailash Patel',
    status: 'posted',
    tallySyncStatus: 'synced',
    dnaId: 'dna-inv-2425-001'
  }
];

export const INITIAL_GST_MISMATCHES: GstMismatch[] = [
  {
    id: 'gst-mis-01',
    invoiceNumber: 'SPM/OCT/011',
    partyName: 'Supreme Paper Mills Ltd',
    partyGstin: '24AABCS8899S1ZA',
    booksDate: '2024-10-01',
    portalDate: undefined,
    booksTaxable: 19000,
    portalTaxable: undefined,
    booksTax: 2280,
    portalTax: 0,
    varianceAmount: 2280,
    reason: 'missing_in_2b',
    status: 'pending'
  }
];

export const INITIAL_TALLY_QUEUE: TallySyncItem[] = [
  {
    id: 'tq-001',
    tenantId: 'tenant-shree-retail',
    voucherType: 'Sales',
    voucherNumber: 'SRM/24-25/001',
    date: '2024-10-01',
    amount: 68435,
    status: 'synced',
    tallyMasterId: 'TALLY-VCH-88901',
    retryCount: 0,
    lastAttemptAt: '2024-10-01T10:16:00Z'
  },
  {
    id: 'tq-002',
    tenantId: 'tenant-shree-retail',
    voucherType: 'Sales',
    voucherNumber: 'SRM/24-25/003',
    date: '2024-10-03',
    amount: 29499,
    status: 'pending',
    retryCount: 0
  },
  {
    id: 'tq-003',
    tenantId: 'tenant-shree-retail',
    voucherType: 'Purchase',
    voucherNumber: 'BILL-SRM-046',
    date: '2024-10-01',
    amount: 21280,
    status: 'needs_review',
    errorMessage: 'Ledger "Supreme Paper Mills Ltd" has GSTIN verification conflict in Tally Prime.',
    retryCount: 1,
    lastAttemptAt: '2024-10-02T09:00:00Z'
  }
];

export const INITIAL_DATA_INBOX: DataInboxItem[] = [
  {
    id: 'inbox-001',
    tenantId: 'tenant-shree-retail',
    source: 'whatsapp',
    originalFileName: 'WhatsApp_Invoice_Oct_SupremePaper.pdf',
    uploadedAt: '2024-10-01T14:20:00Z',
    fileType: 'pdf',
    status: 'needs_review',
    extractedData: {
      partyName: 'Supreme Paper Mills Ltd',
      gstin: '24AABCS8899S1ZA',
      invoiceNumber: 'SPM/OCT/011',
      date: '2024-10-01',
      taxableAmount: 19000,
      taxAmount: 2280,
      totalAmount: 21280,
      itemsCount: 1,
      confidenceScore: 96,
      suggestedCategory: 'Purchase'
    }
  },
  {
    id: 'inbox-002',
    tenantId: 'tenant-shree-retail',
    source: 'email',
    originalFileName: 'BlueDart_Freight_Invoice_8820.pdf',
    uploadedAt: '2024-10-02T11:15:00Z',
    fileType: 'pdf',
    status: 'converted',
    extractedData: {
      partyName: 'BlueDart Express Ltd',
      invoiceNumber: 'BDE-AMD-8820',
      date: '2024-10-01',
      taxableAmount: 4500,
      taxAmount: 810,
      totalAmount: 5310,
      itemsCount: 1,
      confidenceScore: 98,
      suggestedCategory: 'Expense'
    },
    convertedTo: 'expense',
    convertedId: 'exp-001'
  }
];

export const INITIAL_CA_CONNECTIONS: CaClientConnection[] = [
  {
    id: 'ca-conn-01',
    caFirmId: 'tenant-kp-tax-advisory',
    caFirmName: 'KP Tax & Advisory Chartered Accountants',
    clientTenantId: 'tenant-shree-retail',
    clientName: 'Shree Retail Mart Pvt Ltd',
    clientGstin: '24AAACS1234A1Z5',
    connectedSince: '2024-01-20',
    status: 'connected',
    permissions: {
      canViewBooks: true,
      canPostJournals: true,
      canFileGst: true,
      canPerformAudit: true
    },
    assignedStaff: 'CA Kailash Patel',
    pendingRequestsCount: 1,
    lastReviewDate: '2024-09-30'
  }
];

export const INITIAL_CA_DOC_REQUESTS: CaDocumentRequest[] = [
  {
    id: 'req-001',
    caFirmId: 'tenant-kp-tax-advisory',
    clientTenantId: 'tenant-shree-retail',
    clientName: 'Shree Retail Mart Pvt Ltd',
    title: 'HDFC Bank October Statement (Signed PDF)',
    description: 'Please upload signed bank statement for quarterly audit and bank reconciliation closure.',
    dueDate: '2024-10-10',
    status: 'requested',
    notes: 'Required before finalizing monthly GST review.'
  }
];

export const INITIAL_TAX_NOTICES: CaTaxNotice[] = [
  {
    id: 'not-001',
    clientTenantId: 'tenant-shree-retail',
    clientName: 'Shree Retail Mart Pvt Ltd',
    noticeAuthority: 'GST Department',
    referenceNumber: 'GST/DRC-01A/24-25/8892',
    noticeDate: '2024-09-28',
    responseDueDate: '2024-10-15',
    taxPeriod: 'FY 2023-24 Q4',
    demandAmount: 14250,
    subject: 'Intimation of tax difference between GSTR-1 and GSTR-3B for March 2024',
    status: 'analysing',
    aiSummary: 'Notice alleges difference of ₹14,250 in Output Tax for March 2024 due to timing adjustment of credit note SRM/CN/04. Recommended to submit reconciliation workpaper and original credit note acknowledgment.'
  }
];

export const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'auto-001',
    tenantId: 'tenant-shree-retail',
    name: 'Auto WhatsApp Overdue Reminder on Day 7',
    triggerEvent: 'invoice.overdue',
    conditions: [
      { field: 'daysPastDue', operator: 'greater_than', value: '7' }
    ],
    actions: [
      { actionType: 'send_whatsapp', template: 'WhatsApp Overdue Friendly Reminder' },
      { actionType: 'create_task', recipient: 'Accounts Receivable Lead' }
    ],
    isActive: true,
    executionCount: 14,
    lastRun: '2024-10-02T18:00:00Z'
  },
  {
    id: 'auto-002',
    tenantId: 'tenant-shree-retail',
    name: 'Auto Queue Tally Sync on Approved Sale',
    triggerEvent: 'invoice.approved',
    conditions: [
      { field: 'status', operator: 'equals', value: 'approved' }
    ],
    actions: [
      { actionType: 'queue_tally' }
    ],
    isActive: true,
    executionCount: 38,
    lastRun: '2024-10-03T11:00:00Z'
  }
];

export const INITIAL_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl-gst-modern',
    name: 'Standard GST Tax Invoice (Modern A4)',
    type: 'gst_invoice',
    pageSize: 'A4',
    primaryColor: '#0F172A',
    showLogo: true,
    showQrCode: true,
    showSignature: true,
    showBankDetails: true,
    showHsnSummary: true,
    termsText: '1. Goods once sold will not be returned.\n2. Overdue payments incur 18% p.a. interest.\n3. Subject to local jurisdiction.',
    footerNotes: 'This is a computer generated invoice and requires authorized signature.',
    isDefault: true
  },
  {
    id: 'tpl-thermal-pos',
    name: 'Retail Thermal Bill 80mm',
    type: 'retail_thermal',
    pageSize: 'thermal_80mm',
    primaryColor: '#000000',
    showLogo: false,
    showQrCode: true,
    showSignature: false,
    showBankDetails: false,
    showHsnSummary: false,
    termsText: 'No cash refunds. Exchange within 7 days with bill.',
    footerNotes: 'Thank you for shopping at Shree Retail Mart!',
    isDefault: false
  }
];

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-starter',
    name: 'VyapaarOS Starter',
    target: 'business',
    priceMonthly: 999,
    priceAnnual: 9990,
    features: ['Up to 5 Users', 'Single Branch', 'Billing & Invoicing', 'Inventory Management', 'Basic Tally Export'],
    maxUsers: 5,
    maxInvoicesMonthly: 500,
    maxStorageGb: 5,
    aiCreditsMonthly: 50,
    tallySyncIncluded: true,
    gstAutomationsIncluded: false
  },
  {
    id: 'plan-pro',
    name: 'VyapaarOS Professional',
    target: 'business',
    priceMonthly: 2499,
    priceAnnual: 24990,
    features: ['Unlimited Users', 'Up to 5 Branches', 'Live Tally Connector', 'Automated GST 2B Reconciliation', 'WhatsApp & Email Billing', 'Maker-Checker Workflows', 'CA Direct Connect'],
    maxUsers: 50,
    maxInvoicesMonthly: 5000,
    maxStorageGb: 50,
    aiCreditsMonthly: 500,
    tallySyncIncluded: true,
    gstAutomationsIncluded: true
  },
  {
    id: 'plan-enterprise',
    name: 'VyapaarOS Enterprise',
    target: 'business',
    priceMonthly: 5999,
    priceAnnual: 59990,
    features: ['Custom Branches', 'Dedicated Cloud Instance', 'Full White Labeling', 'REST API & Webhooks Access', 'SLA 99.9% Support', 'Custom ERP Integrations'],
    maxUsers: 999,
    maxInvoicesMonthly: 99999,
    maxStorageGb: 500,
    aiCreditsMonthly: 2000,
    tallySyncIncluded: true,
    gstAutomationsIncluded: true
  },
  {
    id: 'plan-ca-firm',
    name: 'VyapaarOS CA Practice Pro',
    target: 'ca',
    priceMonthly: 1999,
    priceAnnual: 19990,
    features: ['Up to 100 Business Clients', 'Direct Multi-Client Ledger Access', '1-Click Month-End Close Engine', 'Notice Intelligence OCR', 'Audit Checklist & Workpapers', 'Tax Return Preparation'],
    maxUsers: 25,
    maxInvoicesMonthly: 99999,
    maxStorageGb: 100,
    aiCreditsMonthly: 1000,
    tallySyncIncluded: true,
    gstAutomationsIncluded: true
  }
];

export const INITIAL_TRANSACTION_DNAS: Record<string, TransactionDNA> = {
  'dna-inv-2425-001': {
    dnaId: 'dna-inv-2425-001',
    tenantId: 'tenant-shree-retail',
    entityType: 'invoice',
    referenceNo: 'SRM/24-25/001',
    createdAt: '2024-10-01T10:15:00Z',
    source: 'quotation_conversion',
    sourceDocument: 'SRM/QT/24-089',
    createdBy: 'Parth Kanjariya (Owner)',
    approvedBy: 'Auto-Approved (Policy < ₹1,00,000)',
    inventoryMoved: true,
    journalVoucherNo: 'JV-2024-001',
    bankReconciliationStatus: 'reconciled',
    gstReturnCategory: 'GSTR-1 Table 4A (B2B)',
    tallyVoucherId: 'TALLY-VCH-88901',
    caReviewStatus: 'approved',
    lineage: [
      {
        stage: 'Quotation Created',
        timestamp: '2024-09-28 11:00',
        actor: 'Parth Kanjariya',
        description: 'Quotation SRM/QT/24-089 generated for ABC Traders.'
      },
      {
        stage: 'Sales Order Confirmed',
        timestamp: '2024-09-30 14:10',
        actor: 'ABC Traders (Procurement)',
        description: 'Accepted quotation; converted to Sales Order SO-2024-001.'
      },
      {
        stage: 'Invoice Dispatched & Inventory Deducted',
        timestamp: '2024-10-01 10:15',
        actor: 'Parth Kanjariya',
        description: 'Tax Invoice SRM/24-25/001 generated; 2x TV-43 and 3x SCAN-PRO-2 deducted from Main Warehouse.'
      },
      {
        stage: 'Double-Entry Accounting Posted',
        timestamp: '2024-10-01 10:15',
        actor: 'System Accounting Engine',
        description: 'Journal JV-2024-001 posted: Debited Customer ₹68,435; Credited Sales Revenue & GST Output.'
      },
      {
        stage: 'Tally Prime Auto-Sync',
        timestamp: '2024-10-01 10:16',
        actor: 'Tally Connector v2.4',
        description: 'Voucher pushed to Tally company "Shree Retail Mart" as TALLY-VCH-88901.'
      },
      {
        stage: 'Payment Received & Bank Reconciled',
        timestamp: '2024-10-02 16:00',
        actor: 'Parth Kanjariya',
        description: 'NEFT credit ₹20,000 matched with HDFC Bank statement item stmt-001.'
      },
      {
        stage: 'CA Review Completed',
        timestamp: '2024-10-03 09:30',
        actor: 'CA Kailash Patel',
        description: 'Tax rates, HSN codes, and ledger allocations reviewed and locked for GSTR-1.'
      }
    ]
  }
};
