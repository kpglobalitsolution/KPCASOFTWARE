import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable, Column } from '../common/DataTable';
import { SalesOrder } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShoppingBag, ArrowRight, CheckCircle2, Truck } from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { salesOrders, convertOrderToInvoice, navigateTo } = useApp();

  const columns: Column<SalesOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      render: (row) => <span className="font-mono font-semibold text-white">{row.orderNumber}</span>
    },
    {
      key: 'date',
      header: 'Order Date',
      render: (row) => <span className="font-mono text-slate-300">{formatDate(row.date)}</span>
    },
    {
      key: 'expectedDeliveryDate',
      header: 'Expected Delivery',
      render: (row) => <span className="font-mono text-slate-400">{formatDate(row.expectedDeliveryDate)}</span>
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (row) => <span className="font-medium text-slate-200">{row.customerName}</span>
    },
    {
      key: 'totalAmount',
      header: 'Order Value',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-white tabular-nums">{formatCurrency(row.totalAmount)}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
            row.status === 'invoiced'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
              : 'bg-amber-950 text-amber-400 border-amber-800/40'
          }`}
        >
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status !== 'invoiced' ? (
            <button
              onClick={() => {
                convertOrderToInvoice(row.id);
                navigateTo('/business/sales');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
            >
              <span>Dispatch & Invoice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Invoiced & Dispatched</span>
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <span>Sales Orders & Fulfillment</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Confirmed client orders tracking stock reservation, delivery fulfillment, and automated invoice dispatch.
          </p>
        </div>
      </div>

      <DataTable
        data={salesOrders}
        columns={columns}
        searchPlaceholder="Search order number or client..."
        exportFileName="vyapaaros_sales_orders"
      />
    </div>
  );
};
