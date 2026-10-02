import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShoppingCart,
  Truck,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  FileSpreadsheet,
  Globe2,
  Landmark,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { AccountType, WorkspaceType } from '../../types';

export const RegisterView: React.FC = () => {
  const { registerAccount, navigateTo } = useApp();

  // Selected account type: null = on question step
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null);

  // Common user credentials
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Business fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Private Limited');
  const [industry, setIndustry] = useState('Retail & FMCG');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Gujarat');
  const [city, setCity] = useState('Ahmedabad');
  const [address, setAddress] = useState('');
  const [gstRegistered, setGstRegistered] = useState(true);
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [financialYear, setFinancialYear] = useState('2024-2025');
  const [currency, setCurrency] = useState('INR');

  // Business Setup options
  const [numberOfBranches, setNumberOfBranches] = useState(1);
  const [numberOfUsers, setNumberOfUsers] = useState(5);
  const [warehouseRequired, setWarehouseRequired] = useState(true);
  const [inventoryRequired, setInventoryRequired] = useState(true);
  const [accountingRequired, setAccountingRequired] = useState(true);
  const [gstRequired, setGstRequired] = useState(true);
  const [tallyRequired, setTallyRequired] = useState(true);

  // Buyer specific
  const [buyerCategories, setBuyerCategories] = useState('Raw Materials, Packaging, Office Supplies');
  const [expectedSuppliers, setExpectedSuppliers] = useState('10-25');
  const [approvalRequirements, setApprovalRequirements] = useState('Two-tier approval above ₹50,000');
  const [buyerPaymentTerms, setBuyerPaymentTerms] = useState('Net 30 Days');

  // Supplier specific
  const [supplierCategories, setSupplierCategories] = useState('Industrial Goods, Bulk Commodities');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [pricingStructure, setPricingStructure] = useState('Tiered Wholesale & Volume Discounts');
  const [supplierPaymentTerms, setSupplierPaymentTerms] = useState('15 Days with 2% Cash Discount');

  // CA specific
  const [firmType, setFirmType] = useState('Chartered Accountants Firm (Partnership)');
  const [icaiFrn, setIcaiFrn] = useState('');
  const [numberOfStaff, setNumberOfStaff] = useState('5-10');
  const [expectedClients, setExpectedClients] = useState(40);
  const [gstServices, setGstServices] = useState(true);
  const [taxServices, setTaxServices] = useState(true);
  const [accountingServices, setAccountingServices] = useState(true);
  const [auditServices, setAuditServices] = useState(true);
  const [tdsServices, setTdsServices] = useState(true);
  const [automationRequired, setAutomationRequired] = useState(true);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (password && password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !mobile.trim() || !businessName.trim()) {
      setFormError('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      registerAccount({
        accountType: selectedAccountType!,
        fullName,
        email,
        mobile,
        password,
        businessName,
        businessType,
        industry,
        country,
        state,
        city,
        address,
        gstRegistered,
        gstin,
        pan,
        currency,
        numberOfBranches,
        inventoryRequired,
        accountingRequired,
        gstRequired,
        tallyRequired,
        expectedSuppliers,
        procurementCategories: buyerCategories,
        firmType,
        expectedClients
      });
      setIsSubmitting(false);
    }, 400);
  };

  const accountTypeCards = [
    {
      type: 'BUSINESS' as AccountType,
      title: 'BUSINESS',
      tagline: '“I run or manage a business.”',
      desc: 'Ideal for Retailers, Manufacturers, Distributors & Service Providers needing complete Billing, Inventory, Accounting, GST & Banking.',
      icon: Building2,
      badge: 'Full Business ERP',
      color: 'hover:border-indigo-500 bg-indigo-950/20 text-indigo-400'
    },
    {
      type: 'BUYER' as AccountType,
      title: 'BUYER',
      tagline: '“I purchase products/services from suppliers.”',
      desc: 'Corporate procurement, store purchase managers, and buyers creating POs, monitoring deliveries, and managing vendor payables.',
      icon: ShoppingCart,
      badge: 'Procurement & Spend Hub',
      color: 'hover:border-sky-500 bg-sky-950/20 text-sky-400'
    },
    {
      type: 'SUPPLIER' as AccountType,
      title: 'SUPPLIER',
      tagline: '“I sell products/services to businesses.”',
      desc: 'Suppliers, wholesalers, and vendors receiving digital POs, fulfilling shipments with E-way bills, and tracking customer payments.',
      icon: Truck,
      badge: 'Order Fulfillment & Sales',
      color: 'hover:border-amber-500 bg-amber-950/20 text-amber-400'
    },
    {
      type: 'CA' as AccountType,
      title: 'CA / ACCOUNTING FIRM',
      tagline: '“I manage accounting, tax or compliance for clients.”',
      desc: 'Chartered Accountants, Tax Practitioners, and Audit Firms accessing client books, running 2B matching, and tracking tax notices.',
      icon: GraduationCap,
      badge: 'Client Audit & Tax Practice',
      color: 'hover:border-emerald-500 bg-emerald-950/20 text-emerald-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      {/* Top Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 mb-4 group"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/40 group-hover:scale-105 transition-transform">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            VyapaarOS
          </span>
        </button>

        {!selectedAccountType ? (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              What are you using VyapaarOS for?
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Select your primary business account type. This configures your specialized registration journey and onboarding experience.
            </p>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-200 mb-2">
              <span>Account Type:</span>
              <strong className="text-indigo-400">{selectedAccountType}</strong>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {selectedAccountType === 'BUSINESS' && 'Complete Business Registration'}
              {selectedAccountType === 'BUYER' && 'Buyer Organization Registration'}
              {selectedAccountType === 'SUPPLIER' && 'Supplier Business Registration'}
              {selectedAccountType === 'CA' && 'CA / Accounting Firm Registration'}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Set up your verified organization credentials and initial workspace preferences.
            </p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        {!selectedAccountType ? (
          /* STEP 0: 4 Primary Choices */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accountTypeCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.type}
                    onClick={() => {
                      setSelectedAccountType(card.type);
                      setBusinessName('');
                    }}
                    className={`flex flex-col p-6 rounded-xl border border-slate-800 text-left transition-all hover:scale-[1.01] hover:shadow-xl group relative ${card.color}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-current" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/50 text-slate-300">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-300 mt-1 italic">
                      {card.tagline}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {card.desc}
                    </p>

                    <div className="mt-5 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <span>Select and Continue</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Super Admin Restricted Callout */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-200">Looking for Platform Super Admin Access?</span>
                <p className="text-slate-400 mt-0.5">
                  Super Admin accounts are strictly protected and cannot be created via public self-registration. They are provisioned through secure internal environment bootstrapping or administrative invitations.
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-400">
                Already have a workspace account?{' '}
                <button
                  onClick={() => navigateTo('/login')}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1"
                >
                  Sign In to Workspace
                </button>
              </span>
            </div>
          </div>
        ) : (
          /* STEP 1: Registration Form based on selected account type */
          <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm">
            <button
              type="button"
              onClick={() => {
                setSelectedAccountType(null);
                setFormError('');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-6 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Account Type</span>
            </button>

            {formError && (
              <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: Personal Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span>1. Personal &amp; Account Credentials</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Parth Kanjariya"
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98250 XXXXX"
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Organization / Business Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>
                    {selectedAccountType === 'BUSINESS' && '2. Business Information'}
                    {selectedAccountType === 'BUYER' && '2. Buyer Organization Details'}
                    {selectedAccountType === 'SUPPLIER' && '2. Supplier Business Details'}
                    {selectedAccountType === 'CA' && '2. CA Firm Information'}
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {selectedAccountType === 'CA' ? 'Firm Name *' : 'Business / Organization Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder={selectedAccountType === 'CA' ? 'e.g. KP Tax & Advisory Chartered Accountants' : 'e.g. Shree Retail Mart Pvt Ltd'}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {selectedAccountType === 'CA' ? 'Firm Constitution' : 'Business Entity Type'}
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Private Limited">Private Limited Company</option>
                      <option value="Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership Firm</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="Public Limited">Public Limited Company</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Industry Sector
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Retail & FMCG">Retail &amp; FMCG</option>
                      <option value="Wholesale & Distribution">Wholesale &amp; Distribution</option>
                      <option value="Manufacturing & Engineering">Manufacturing &amp; Engineering</option>
                      <option value="Information Technology">Information Technology &amp; SaaS</option>
                      <option value="Textile & Apparel">Textile &amp; Apparel</option>
                      <option value="Logistics & Transport">Logistics &amp; Transport</option>
                      <option value="Professional Services">Professional Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Registered Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, Commercial Complex, Area"
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* GSTIN / PAN / Registration details */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      GSTIN (Optional during trial)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 24AAACS1234A1Z5"
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Permanent Account Number (PAN)
                    </label>
                    <input
                      type="text"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      placeholder="e.g. AAACS1234A"
                      className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  {selectedAccountType === 'CA' && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        ICAI Firm Registration Number (FRN) / Member ID
                      </label>
                      <input
                        type="text"
                        value={icaiFrn}
                        onChange={(e) => setIcaiFrn(e.target.value)}
                        placeholder="e.g. 123456W / M.No 098765"
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  )}

                  {selectedAccountType === 'SUPPLIER' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Bank Name (for remittance)
                        </label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Bank Account Number
                        </label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="Current Account Number"
                          className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* SECTION 3: Workspace Specific Setup Questions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>
                    {selectedAccountType === 'BUSINESS' && '3. Business Operations Setup'}
                    {selectedAccountType === 'BUYER' && '3. Procurement Policies & Approvals'}
                    {selectedAccountType === 'SUPPLIER' && '3. Fulfillment & Commercial Terms'}
                    {selectedAccountType === 'CA' && '3. Practice Capabilities & Automations'}
                  </span>
                </h3>

                {selectedAccountType === 'BUSINESS' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                        <label className="block text-[11px] text-slate-400 mb-1">Branches</label>
                        <select
                          value={numberOfBranches}
                          onChange={(e) => setNumberOfBranches(Number(e.target.value))}
                          className="w-full text-xs bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                        >
                          <option value={1}>1 (Single Branch)</option>
                          <option value={2}>2 Branches</option>
                          <option value={5}>3 - 5 Branches</option>
                          <option value={10}>5+ Multi-Location</option>
                        </select>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                        <label className="block text-[11px] text-slate-400 mb-1">Financial Year</label>
                        <select
                          value={financialYear}
                          onChange={(e) => setFinancialYear(e.target.value)}
                          className="w-full text-xs bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                        >
                          <option value="2024-2025">FY 2024 - 2025</option>
                          <option value="2025-2026">FY 2025 - 2026</option>
                        </select>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                        <label className="block text-[11px] text-slate-400 mb-1">Currency</label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full text-xs bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                        >
                          <option value="INR">INR (₹ Indian Rupee)</option>
                          <option value="USD">USD ($ US Dollar)</option>
                          <option value="EUR">EUR (€ Euro)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        { label: 'Warehouse & Godown Tracking', state: warehouseRequired, setter: setWarehouseRequired },
                        { label: 'Real-Time Inventory & Stock Alerts', state: inventoryRequired, setter: setInventoryRequired },
                        { label: 'Double-Entry Accounting & Ledger Engine', state: accountingRequired, setter: setAccountingRequired },
                        { label: 'GST Compliance & Automated 2B Reconciler', state: gstRequired, setter: setGstRequired },
                        { label: 'Tally Prime Bi-Directional Bridge', state: tallyRequired, setter: setTallyRequired }
                      ].map((item, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={item.state}
                            onChange={(e) => item.setter(e.target.checked)}
                            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-slate-300 font-medium">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAccountType === 'BUYER' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Procurement Categories
                      </label>
                      <input
                        type="text"
                        value={buyerCategories}
                        onChange={(e) => setBuyerCategories(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Standard Payment Terms
                      </label>
                      <input
                        type="text"
                        value={buyerPaymentTerms}
                        onChange={(e) => setBuyerPaymentTerms(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        PO Approval Hierarchy
                      </label>
                      <input
                        type="text"
                        value={approvalRequirements}
                        onChange={(e) => setApprovalRequirements(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                )}

                {selectedAccountType === 'SUPPLIER' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Catalog Categories
                      </label>
                      <input
                        type="text"
                        value={supplierCategories}
                        onChange={(e) => setSupplierCategories(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Commercial Payment Terms
                      </label>
                      <input
                        type="text"
                        value={supplierPaymentTerms}
                        onChange={(e) => setSupplierPaymentTerms(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                )}

                {selectedAccountType === 'CA' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        { label: 'GST Filings & GSTR-2B Mismatch AI', state: gstServices, setter: setGstServices },
                        { label: 'Income Tax & Corporate Tax Filing', state: taxServices, setter: setTaxServices },
                        { label: 'Client Ledger Audit & Month-End Reviews', state: auditServices, setter: setAuditServices },
                        { label: 'TDS / TCS Computation & Form 26Q/27Q', state: tdsServices, setter: setTdsServices },
                        { label: 'Direct Tally & Banking Automation Rules', state: automationRequired, setter: setAutomationRequired }
                      ].map((svc, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={svc.state}
                            onChange={(e) => svc.setter(e.target.checked)}
                            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-slate-300 font-medium">{svc.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  By clicking Create Organization, you activate an instant 14-day Enterprise Trial.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>
                    {isSubmitting ? 'Provisioning Workspace...' : 'Complete Registration & Setup →'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
