import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Receipt, ShoppingCart, Users, Package, CreditCard, ArrowDownLeft, FileSpreadsheet, RefreshCw } from 'lucide-react';

export const QuickCreateModal: React.FC = () => {
  const {
    isQuickCreateOpen,
    setIsQuickCreateOpen,
    parties,
    products,
    bankAccounts,
    createSalesInvoice,
    createPurchaseInvoice,
    createProduct,
    createParty,
    createPayment,
    createExpense,
    stockAdjustment
  } = useApp();

  type ActiveTab = 'invoice' | 'purchase' | 'payment' | 'expense' | 'product' | 'party' | 'stock';
  const [activeTab, setActiveTab] = useState<ActiveTab>('invoice');

  // Form states
  const [invoiceCustomer, setInvoiceCustomer] = useState(parties[0]?.id || '');
  const [invoiceProduct, setInvoiceProduct] = useState(products[0]?.id || '');
  const [invoiceQty, setInvoiceQty] = useState(1);
  const [invoiceRate, setInvoiceRate] = useState(products[0]?.sellingPrice || 1000);

  const [purSupplier, setPurSupplier] = useState(parties.find((p) => p.type === 'supplier')?.id || '');
  const [purProduct, setPurProduct] = useState(products[0]?.id || '');
  const [purQty, setPurQty] = useState(5);
  const [purRate, setPurRate] = useState(products[0]?.purchasePrice || 800);

  const [payParty, setPayParty] = useState(parties[0]?.id || '');
  const [payAmount, setPayAmount] = useState(5000);
  const [payMode, setPayMode] = useState<any>('bank_transfer');

  const [expCategory, setExpCategory] = useState('Logistics & Courier');
  const [expVendor, setExpVendor] = useState('');
  const [expAmount, setExpAmount] = useState(1200);

  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState(1000);
  const [prodCost, setProdCost] = useState(750);
  const [prodTax, setProdTax] = useState(18);
  const [prodStock, setProdStock] = useState(20);

  const [partyName, setPartyName] = useState('');
  const [partyType, setPartyType] = useState<'customer' | 'supplier'>('customer');
  const [partyPhone, setPartyPhone] = useState('');
  const [partyGstin, setPartyGstin] = useState('');

  const [adjProduct, setAdjProduct] = useState(products[0]?.id || '');
  const [adjQty, setAdjQty] = useState(1);
  const [adjReason, setAdjReason] = useState('physical_count');
  const [adjNotes, setAdjNotes] = useState('');

  if (!isQuickCreateOpen) return null;

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = parties.find((p) => p.id === invoiceCustomer);
    const prod = products.find((p) => p.id === invoiceProduct);
    if (!customer || !prod) return;

    createSalesInvoice({
      customerId: customer.id,
      customerName: customer.name,
      customerGstin: customer.gstin,
      billingAddress: customer.billingAddress,
      items: [
        {
          id: `item-${Date.now()}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          hsnCode: prod.hsnCode,
          quantity: Number(invoiceQty),
          unit: prod.unit,
          rate: Number(invoiceRate),
          discountPercent: 0,
          taxableValue: Number(invoiceQty) * Number(invoiceRate),
          taxRate: prod.taxRate,
          cgst: (Number(invoiceQty) * Number(invoiceRate) * (prod.taxRate / 2)) / 100,
          sgst: (Number(invoiceQty) * Number(invoiceRate) * (prod.taxRate / 2)) / 100,
          igst: 0,
          total: (Number(invoiceQty) * Number(invoiceRate) * (1 + prod.taxRate / 100))
        }
      ]
    });
    setIsQuickCreateOpen(false);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = parties.find((p) => p.id === purSupplier);
    const prod = products.find((p) => p.id === purProduct);
    if (!supplier || !prod) return;

    createPurchaseInvoice({
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierGstin: supplier.gstin,
      items: [
        {
          id: `pur-it-${Date.now()}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          hsnCode: prod.hsnCode,
          quantity: Number(purQty),
          unit: prod.unit,
          rate: Number(purRate),
          discountPercent: 0,
          taxableValue: Number(purQty) * Number(purRate),
          taxRate: prod.taxRate,
          cgst: (Number(purQty) * Number(purRate) * (prod.taxRate / 2)) / 100,
          sgst: (Number(purQty) * Number(purRate) * (prod.taxRate / 2)) / 100,
          igst: 0,
          total: (Number(purQty) * Number(purRate) * (1 + prod.taxRate / 100))
        }
      ]
    });
    setIsQuickCreateOpen(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const party = parties.find((p) => p.id === payParty);
    if (!party) return;

    createPayment({
      partyId: party.id,
      partyName: party.name,
      type: party.type === 'supplier' ? 'supplier_payment' : 'customer_payment',
      amount: Number(payAmount),
      paymentMode: payMode,
      bankAccountId: bankAccounts[0]?.id || 'bank-hdfc-current'
    });
    setIsQuickCreateOpen(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExpense({
      category: expCategory,
      vendorName: expVendor || 'Local Vendor',
      amount: Number(expAmount),
      taxAmount: Math.round(Number(expAmount) * 0.18 * 100) / 100,
      description: 'Quick expense entry'
    });
    setIsQuickCreateOpen(false);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) return;
    createProduct({
      name: prodName,
      sku: prodSku || `SKU-${Date.now().toString().slice(-5)}`,
      sellingPrice: Number(prodPrice),
      purchasePrice: Number(prodCost),
      taxRate: Number(prodTax),
      currentStock: Number(prodStock),
      unit: 'PCS',
      hsnCode: '8528'
    });
    setIsQuickCreateOpen(false);
  };

  const handlePartySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName) return;
    createParty({
      name: partyName,
      type: partyType,
      phone: partyPhone,
      gstin: partyGstin,
      billingAddress: 'Main Commercial Market, Gujarat'
    });
    setIsQuickCreateOpen(false);
  };

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stockAdjustment(adjProduct, 'br-main', Number(adjQty), adjReason, adjNotes);
    setIsQuickCreateOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">Global Quick Create</span>
            <span className="text-[10px] text-slate-400">· Single Source of Truth</span>
          </div>
          <button
            onClick={() => setIsQuickCreateOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-850 overflow-x-auto px-3 py-2 gap-1 text-xs">
          {[
            { id: 'invoice', label: 'Sale Invoice', icon: Receipt },
            { id: 'purchase', label: 'Purchase Bill', icon: ArrowDownLeft },
            { id: 'payment', label: 'Payment', icon: CreditCard },
            { id: 'expense', label: 'Expense', icon: ShoppingCart },
            { id: 'product', label: 'Product', icon: Package },
            { id: 'party', label: 'Customer/Vendor', icon: Users },
            { id: 'stock', label: 'Stock Adjust', icon: RefreshCw }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto max-h-[70vh] text-xs">
          {activeTab === 'invoice' && (
            <form onSubmit={handleInvoiceSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Select Customer</label>
                <select
                  value={invoiceCustomer}
                  onChange={(e) => setInvoiceCustomer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                >
                  {parties.filter((p) => p.type === 'customer' || p.type === 'both').map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.gstin || 'Unregistered'})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1">Product</label>
                  <select
                    value={invoiceProduct}
                    onChange={(e) => {
                      setInvoiceProduct(e.target.value);
                      const p = products.find((pr) => pr.id === e.target.value);
                      if (p) setInvoiceRate(p.sellingPrice);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStock})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={invoiceQty}
                    onChange={(e) => setInvoiceQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Unit Rate (₹)</label>
                <input
                  type="number"
                  value={invoiceRate}
                  onChange={(e) => setInvoiceRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-md transition-colors"
              >
                Generate Tax Invoice & Connect
              </button>
            </form>
          )}

          {activeTab === 'purchase' && (
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Select Supplier</label>
                <select
                  value={purSupplier}
                  onChange={(e) => setPurSupplier(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                >
                  {parties.filter((p) => p.type === 'supplier' || p.type === 'both').map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.gstin})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1">Product</label>
                  <select
                    value={purProduct}
                    onChange={(e) => {
                      setPurProduct(e.target.value);
                      const p = products.find((pr) => pr.id === e.target.value);
                      if (p) setPurRate(p.purchasePrice);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Inward Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={purQty}
                    onChange={(e) => setPurQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Purchase Rate (₹)</label>
                <input
                  type="number"
                  value={purRate}
                  onChange={(e) => setPurRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-md transition-colors"
              >
                Inward Stock & Post Purchase Bill
              </button>
            </form>
          )}

          {activeTab === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Customer / Supplier</label>
                <select
                  value={payParty}
                  onChange={(e) => setPayParty(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                >
                  {parties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="upi">UPI / QR Code</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-md transition-colors"
              >
                Record Payment & Auto-Reconcile
              </button>
            </form>
          )}

          {activeTab === 'expense' && (
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Logistics & Courier">Logistics & Courier</option>
                    <option value="Electricity & Utilities">Electricity & Utilities</option>
                    <option value="Rent & Premises">Rent & Premises</option>
                    <option value="Marketing & Ads">Marketing & Ads</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  placeholder="e.g. BlueDart Express"
                  value={expVendor}
                  onChange={(e) => setExpVendor(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-md transition-colors"
              >
                Log Expense
              </button>
            </form>
          )}

          {activeTab === 'product' && (
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Thermal Receipt Printer"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="PRN-THM-01"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    value={prodCost}
                    onChange={(e) => setProdCost(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GST Rate (%)</label>
                  <select
                    value={prodTax}
                    onChange={(e) => setProdTax(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-md transition-colors"
              >
                Add Item to Inventory
              </button>
            </form>
          )}

          {activeTab === 'party' && (
            <form onSubmit={handlePartySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Party Type</label>
                  <select
                    value={partyType}
                    onChange={(e) => setPartyType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="customer">Customer (Buyer)</option>
                    <option value="supplier">Supplier (Vendor)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Company / Trade Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Enterprises"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="24AAACS1234A1Z5"
                    value={partyGstin}
                    onChange={(e) => setPartyGstin(e.target.value.toUpperCase())}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white font-mono focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+91 98250 12345"
                    value={partyPhone}
                    onChange={(e) => setPartyPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-md transition-colors"
              >
                Register Party
              </button>
            </form>
          )}

          {activeTab === 'stock' && (
            <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Select Product</label>
                <select
                  value={adjProduct}
                  onChange={(e) => setAdjProduct(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.currentStock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Adjustment Qty (+ or -)</label>
                  <input
                    type="number"
                    value={adjQty}
                    onChange={(e) => setAdjQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reason</label>
                  <select
                    value={adjReason}
                    onChange={(e) => setAdjReason(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="physical_count">Physical Count Variance</option>
                    <option value="damage">Damaged in Transit</option>
                    <option value="expiry">Expired Stock</option>
                    <option value="theft">Loss / Theft</option>
                    <option value="correction">Clerical Correction</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Audit Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Reconciled during monthly inventory audit"
                  value={adjNotes}
                  onChange={(e) => setAdjNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-md transition-colors"
              >
                Post Stock Adjustment & Audit Trail
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
