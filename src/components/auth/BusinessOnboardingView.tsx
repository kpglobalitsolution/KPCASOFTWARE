import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Receipt,
  Users,
  Package,
  UserCheck,
  Truck,
  BookOpen,
  Landmark,
  RefreshCw,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react';

export const BusinessOnboardingView: React.FC = () => {
  const { activeTenant, completeOnboarding, createProduct, createParty } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Profile
  const [tradeName, setTradeName] = useState(activeTenant.tradeName || activeTenant.name);
  const [phone, setPhone] = useState(activeTenant.phone || '+91 98250 12345');
  const [address, setAddress] = useState(activeTenant.address || 'Commercial Zone, Bodakdev');

  // Step 2: Tax / GST
  const [gstin, setGstin] = useState(activeTenant.gstin || '24AAACS1234A1Z5');
  const [eInvoiceEnabled, setEInvoiceEnabled] = useState(true);
  const [eWayBillEnabled, setEWayBillEnabled] = useState(true);

  // Step 3: Users
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('ACCOUNTANT');
  const [invitedUsers, setInvitedUsers] = useState<Array<{ email: string; role: string }>>([
    { email: 'accountant@business.com', role: 'ACCOUNTANT' }
  ]);

  // Step 4: Products
  const [productName, setProductName] = useState('Premium Basmati Rice 25kg');
  const [productSku, setProductSku] = useState('RICE-BAS-25');
  const [productPrice, setProductPrice] = useState(2450);
  const [productGst, setProductGst] = useState(5);
  const [addedProducts, setAddedProducts] = useState<string[]>(['Sample Catalog Pack']);

  // Step 5: Customers
  const [customerName, setCustomerName] = useState('Apex Supermarket Retailers');
  const [customerGstin, setCustomerGstin] = useState('24BBBCS9876B1Z3');
  const [customerCreditLimit, setCustomerCreditLimit] = useState(100000);

  // Step 6: Suppliers
  const [supplierName, setSupplierName] = useState('National Agro Mills LLP');
  const [supplierTerms, setSupplierTerms] = useState('Net 15 Days');

  // Step 7: Accounting
  const [coaPreset, setCoaPreset] = useState('Standard Indian Commercial Chart of Accounts');
  const [autoRoundoff, setAutoRoundoff] = useState(true);

  // Step 8: Banking
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNo, setAccountNo] = useState('50200088991122');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('business@hdfcbank');

  // Step 9: Tally
  const [tallyPort, setTallyPort] = useState('9000');
  const [tallyCompanyName, setTallyCompanyName] = useState(activeTenant.name);
  const [tallySyncMode, setTallySyncMode] = useState('automatic');

  // Step 10: CA Connection
  const [caCode, setCaCode] = useState('KP-TAX-2024');
  const [caConnected, setCaConnected] = useState(true);

  const steps = [
    { number: 1, title: 'Business Profile', icon: Building2 },
    { number: 2, title: 'Tax / GST', icon: Receipt },
    { number: 3, title: 'Users & Roles', icon: Users },
    { number: 4, title: 'Products / Inventory', icon: Package },
    { number: 5, title: 'Customers', icon: UserCheck },
    { number: 6, title: 'Suppliers', icon: Truck },
    { number: 7, title: 'Accounting', icon: BookOpen },
    { number: 8, title: 'Banking', icon: Landmark },
    { number: 9, title: 'Tally Prime', icon: RefreshCw },
    { number: 10, title: 'CA Connection', icon: GraduationCap }
  ];

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    if (currentStep < 10) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Optionally create entered product & party if user added them
    if (productName.trim()) {
      try {
        createProduct({
          name: productName,
          sku: productSku,
          sellingPrice: Number(productPrice),
          purchasePrice: Number(productPrice) * 0.8,
          taxRate: Number(productGst),
          hsnCode: '10063020',
          currentStock: 50,
          category: 'General',
          unit: 'BAG'
        });
      } catch (e) {}
    }

    if (customerName.trim()) {
      try {
        createParty({
          name: customerName,
          type: 'customer',
          gstin: customerGstin,
          creditLimit: customerCreditLimit,
          billingAddress: 'Ahmedabad, Gujarat',
          state: 'Gujarat'
        });
      } catch (e) {}
    }

    completeOnboarding('business');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col py-8 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/70 border border-indigo-800/40 px-2 py-0.5 rounded">
              Workspace Setup Wizard
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Welcome to VyapaarOS, <span className="text-indigo-400">{activeTenant.name}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Let&apos;s calibrate your business operating system. You can complete all steps now, skip any step, or finish later.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleComplete}
              className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-md border border-slate-700 transition-colors"
            >
              Continue Later
            </button>
            <button
              onClick={handleComplete}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stepper Tabs Bar */}
        <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
          {steps.map((s) => {
            const isDone = s.number < currentStep;
            const isCurrent = s.number === currentStep;
            const Icon = s.icon;
            return (
              <button
                key={s.number}
                onClick={() => setCurrentStep(s.number)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : isDone
                    ? 'bg-slate-900 text-emerald-400 border border-emerald-900/50'
                    : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>Step {s.number}: {s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800">
          <div
            className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Card */}
      <div className="max-w-4xl mx-auto w-full flex-1">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          {/* STEP 1: Business Profile */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 1: Business Profile</h2>
                  <p className="text-xs text-slate-400">Confirm your public trade identity and registered business coordinates.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Trade / Display Name</label>
                  <input
                    type="text"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Business Helpline / Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Official Address for Invoices</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Tax / GST */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 2: Tax &amp; GST Configuration</h2>
                  <p className="text-xs text-slate-400">Set up Goods &amp; Services Tax, e-Invoicing credentials, and e-Way bill thresholds.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Registered GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="w-full sm:w-80 p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 p-3 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eInvoiceEnabled}
                      onChange={(e) => setEInvoiceEnabled(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700"
                    />
                    <div>
                      <span className="font-semibold text-slate-200">E-Invoice Generation</span>
                      <p className="text-[10px] text-slate-400">Auto generate IRN &amp; signed QR code from IRP portal</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eWayBillEnabled}
                      onChange={(e) => setEWayBillEnabled(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700"
                    />
                    <div>
                      <span className="font-semibold text-slate-200">E-Way Bill Integration</span>
                      <p className="text-[10px] text-slate-400">Auto generate Part A &amp; Part B for shipments &gt; ₹50,000</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Users & Roles */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 3: Users &amp; Roles</h2>
                  <p className="text-xs text-slate-400">Invite accountants, billing operators, and sales managers to your workspace.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@business.com"
                  className="flex-1 text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                >
                  <option value="ACCOUNTANT">Accountant</option>
                  <option value="BILLING_OPERATOR">Billing Operator</option>
                  <option value="SALES_MANAGER">Sales Manager</option>
                  <option value="INVENTORY_MANAGER">Inventory Manager</option>
                  <option value="ADMIN">Co-Admin</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (inviteEmail.trim()) {
                      setInvitedUsers([...invitedUsers, { email: inviteEmail, role: inviteRole }]);
                      setInviteEmail('');
                    }
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Invite
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Invited Members:</span>
                {invitedUsers.map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-200">{u.email}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-indigo-300 font-medium">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Products / Inventory */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 4: Products &amp; Inventory</h2>
                  <p className="text-xs text-slate-400">Add your first fast-moving SKU or import stock records.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Product Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">SKU / Item Code</label>
                  <input
                    type="text"
                    value={productSku}
                    onChange={(e) => setProductSku(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">GST Rate (%)</label>
                  <select
                    value={productGst}
                    onChange={(e) => setProductGst(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={5}>5% Standard</option>
                    <option value={12}>12% Standard</option>
                    <option value={18}>18% General Goods</option>
                    <option value={28}>28% Luxury / Sin</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Customers */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 5: Customers Directory</h2>
                  <p className="text-xs text-slate-400">Add a primary customer to immediately issue sales quotations or tax invoices.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Customer / Company Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Customer GSTIN</label>
                  <input
                    type="text"
                    value={customerGstin}
                    onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={customerCreditLimit}
                    onChange={(e) => setCustomerCreditLimit(Number(e.target.value))}
                    className="w-full sm:w-60 p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Suppliers */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 6: Suppliers &amp; Vendors</h2>
                  <p className="text-xs text-slate-400">Set up key supplier accounts to manage purchase orders and vendor payments.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Supplier Business Name</label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Agreed Payment Terms</label>
                  <input
                    type="text"
                    value={supplierTerms}
                    onChange={(e) => setSupplierTerms(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Accounting */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 7: Double-Entry Accounting Engine</h2>
                  <p className="text-xs text-slate-400">Select standard chart of accounts presets and automated round-off ledger policies.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Chart of Accounts Preset</label>
                  <select
                    value={coaPreset}
                    onChange={(e) => setCoaPreset(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  >
                    <option value="Standard Indian Commercial Chart of Accounts">
                      Standard Indian Commercial Chart of Accounts (Recommended)
                    </option>
                    <option value="Manufacturing & WIP Specialized CoA">
                      Manufacturing &amp; WIP Specialized CoA
                    </option>
                    <option value="Service Sector Simplified CoA">
                      Service Sector Simplified CoA
                    </option>
                  </select>
                </div>

                <label className="flex items-center gap-2 p-3 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRoundoff}
                    onChange={(e) => setAutoRoundoff(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700"
                  />
                  <div>
                    <span className="font-semibold text-slate-200">Auto Round-off Invoices</span>
                    <p className="text-[10px] text-slate-400">Automatically post fractional paise to Round-off Expense/Income ledger</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 8: Banking */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 8: Current Bank Account &amp; UPI</h2>
                  <p className="text-xs text-slate-400">Add bank account details printed on invoices with dynamic UPI QR code.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">UPI ID (for QR Code)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: Tally */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 9: Tally Prime Integration</h2>
                  <p className="text-xs text-slate-400">Connect VyapaarOS directly with your local or cloud Tally Prime company.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tally Company Name</label>
                  <input
                    type="text"
                    value={tallyCompanyName}
                    onChange={(e) => setTallyCompanyName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">XML Bridge Port</label>
                  <input
                    type="text"
                    value={tallyPort}
                    onChange={(e) => setTallyPort(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Sync Frequency</label>
                  <select
                    value={tallySyncMode}
                    onChange={(e) => setTallySyncMode(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white"
                  >
                    <option value="automatic">Automatic Real-Time Sync on every voucher created</option>
                    <option value="manual">Manual Batch Sync (One-click export queue)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: CA Connection */}
          {currentStep === 10 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Step 10: Connect with your Chartered Accountant</h2>
                  <p className="text-xs text-slate-400">Grant read-only audit &amp; GST filing privileges to your CA firm.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-300">Chartered Accountant Partnership Verified</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      <strong>KP Tax &amp; Advisory Chartered Accountants</strong> is pre-authorized for tax filing and audit access.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">CA Firm Authorization Code (or CA Email)</label>
                  <input
                    type="text"
                    value={caCode}
                    onChange={(e) => setCaCode(e.target.value)}
                    className="w-full sm:w-80 p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step Footer Navigation */}
          <div className="mt-8 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSkip}
                className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Skip this step</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <span>{currentStep === 10 ? 'Finish Setup & Open Dashboard' : 'Save & Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
