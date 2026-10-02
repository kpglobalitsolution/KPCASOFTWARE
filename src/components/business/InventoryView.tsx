import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Package, Plus, RefreshCw, AlertTriangle, ArrowRightLeft, X } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { products, createProduct, stockAdjustment, showToast } = useApp();

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // New Product states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Consumer Electronics');
  const [unit, setUnit] = useState('PCS');
  const [sellingPrice, setSellingPrice] = useState(1000);
  const [purchasePrice, setPurchasePrice] = useState(750);
  const [taxRate, setTaxRate] = useState(18);
  const [hsnCode, setHsnCode] = useState('8528');
  const [initialStock, setInitialStock] = useState(10);
  const [reorderLevel, setReorderLevel] = useState(5);

  // Adjustment states
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState<'damage' | 'expiry' | 'physical_count' | 'theft' | 'correction'>('physical_count');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Transfer states
  const [transferProductId, setTransferProductId] = useState(products[0]?.id || '');
  const [fromWarehouse, setFromWarehouse] = useState('br-main');
  const [toWarehouse, setToWarehouse] = useState('br-surat');
  const [transferQty, setTransferQty] = useState(2);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    createProduct({
      name,
      sku: sku || `SKU-${Date.now().toString().slice(-5)}`,
      category,
      unit,
      sellingPrice: Number(sellingPrice),
      purchasePrice: Number(purchasePrice),
      taxRate: Number(taxRate),
      hsnCode,
      currentStock: Number(initialStock),
      reorderLevel: Number(reorderLevel),
      warehouseStocks: { 'br-main': Number(initialStock) }
    });

    setIsAddProductOpen(false);
    setName('');
    setSku('');
  };

  const handleAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    stockAdjustment(selectedProductId, 'br-main', Number(adjustQty), adjustReason, adjustNotes);
    setIsAdjustmentOpen(false);
    setAdjustNotes('');
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromWarehouse === toWarehouse) {
      showToast('Validation Error', 'Source and destination warehouses must be different.', 'warning');
      return;
    }
    // Perform internal transfer
    stockAdjustment(transferProductId, fromWarehouse, -Number(transferQty), 'correction', `Transferred to ${toWarehouse}`);
    stockAdjustment(transferProductId, toWarehouse, Number(transferQty), 'correction', `Received from ${fromWarehouse}`);
    showToast('Warehouse Transfer Recorded', `Transferred ${transferQty} units from ${fromWarehouse} to ${toWarehouse}.`, 'success');
    setIsTransferOpen(false);
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product & SKU',
      render: (row) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="text-[10px] font-mono text-slate-400">
            SKU: {row.sku} · HSN: {row.hsnCode}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => <span className="text-slate-300">{row.category}</span>
    },
    {
      key: 'currentStock',
      header: 'Stock On Hand',
      align: 'right',
      render: (row) => {
        const isLow = row.currentStock <= row.reorderLevel;
        return (
          <div className="text-right">
            <span className={`font-mono font-bold tabular-nums ${isLow ? 'text-amber-400' : 'text-white'}`}>
              {row.currentStock} {row.unit}
            </span>
            {isLow && (
              <div className="text-[10px] font-mono text-amber-400 flex items-center justify-end gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>Low (Min: {row.reorderLevel})</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'sellingPrice',
      header: 'Selling Price',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-medium text-slate-200 tabular-nums">
          {formatCurrency(row.sellingPrice)}
        </span>
      )
    },
    {
      key: 'purchasePrice',
      header: 'Purchase Cost',
      align: 'right',
      render: (row) => (
        <span className="font-mono text-slate-400 tabular-nums">
          {formatCurrency(row.purchasePrice)}
        </span>
      )
    },
    {
      key: 'taxRate',
      header: 'GST %',
      align: 'center',
      render: (row) => <span className="font-mono text-slate-300">{row.taxRate}%</span>
    },
    {
      key: 'warehouseStocks',
      header: 'Warehouses',
      render: (row) => (
        <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
          <div>Main AMD: {row.warehouseStocks['br-main'] || 0}</div>
          <div>Surat Hub: {row.warehouseStocks['br-surat'] || 0}</div>
        </div>
      )
    }
  ];

  const totalInventoryValuation = products.reduce((sum, p) => sum + p.currentStock * p.purchasePrice, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <span>Inventory & Warehouse Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Total Inventory Valuation: <strong className="text-emerald-400 font-mono">{formatCurrency(totalInventoryValuation)}</strong> across 2 warehouses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Stock Transfer</span>
          </button>
          <button
            onClick={() => setIsAdjustmentOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Stock Adjustment</span>
          </button>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Search product by name, SKU or category..."
        exportFileName="vyapaaros_inventory"
      />

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Add New Catalog Product</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Thermal Receipt Printer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="PRN-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">HSN/SAC Code</label>
                  <input
                    type="text"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GST Rate (%)</label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={initialStock}
                    onChange={(e) => setInitialStock(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reorder Level Alert</label>
                  <input
                    type="number"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-white"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Stock Adjustment & Audit Reconciliation</h3>
              <button onClick={() => setIsAdjustmentOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdjustment} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Select Item</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.currentStock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity Adjustment (+ or -)</label>
                  <input
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Audit Reason</label>
                  <select
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="physical_count">Physical Count Variance</option>
                    <option value="damage">Damaged in Transit / Handling</option>
                    <option value="expiry">Expired Goods</option>
                    <option value="theft">Theft / Unexplained Loss</option>
                    <option value="correction">Clerical Entry Correction</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Auditor / Controller Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Verified by Store Manager during quarterly inventory check"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-white"
                >
                  Commit Adjustment & Update Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warehouse Transfer Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in-20">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-5 space-y-4 text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Inter-Warehouse Stock Transfer</h3>
              <button onClick={() => setIsTransferOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleTransfer} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Item to Transfer</label>
                <select
                  value={transferProductId}
                  onChange={(e) => setTransferProductId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">From Warehouse</label>
                  <select
                    value={fromWarehouse}
                    onChange={(e) => setFromWarehouse(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="br-main">Main Store & Warehouse</option>
                    <option value="br-surat">Surat Distribution Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">To Warehouse</label>
                  <select
                    value={toWarehouse}
                    onChange={(e) => setToWarehouse(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="br-surat">Surat Distribution Hub</option>
                    <option value="br-main">Main Store & Warehouse</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Transfer Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-white"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
