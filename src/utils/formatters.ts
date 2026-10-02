export function formatCurrency(amount: number, showSymbol = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return showSymbol ? '₹0.00' : '0.00';
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return showSymbol ? `₹${formatted}` : formatted;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateTimeString: string): string {
  if (!dateTimeString) return '—';
  try {
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return dateTimeString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return dateTimeString;
  }
}

export function calculateLineItem(item: {
  quantity: number;
  rate: number;
  discountPercent: number;
  taxRate: number;
  isInterState?: boolean;
}) {
  const gross = item.quantity * item.rate;
  const discount = (gross * (item.discountPercent || 0)) / 100;
  const taxableValue = gross - discount;
  const taxAmount = (taxableValue * (item.taxRate || 0)) / 100;
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (item.isInterState) {
    igst = taxAmount;
  } else {
    cgst = taxAmount / 2;
    sgst = taxAmount / 2;
  }

  const total = taxableValue + taxAmount;

  return {
    taxableValue: Math.round(taxableValue * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}

export function getStatusSemanticClass(status: string): { bg: string; text: string; border: string } {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'active':
    case 'synced':
    case 'approved':
    case 'matched':
    case 'completed':
    case 'posted':
      return { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' };
    case 'partially_paid':
    case 'needs_review':
    case 'pending':
    case 'draft':
    case 'trial':
    case 'in_transit':
      return { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/40' };
    case 'overdue':
    case 'cancelled':
    case 'rejected':
    case 'failed':
    case 'exception':
    case 'suspended':
    case 'past_due':
      return { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/40' };
    default:
      return { bg: 'bg-slate-800/60', text: 'text-slate-300', border: 'border-slate-700/50' };
  }
}
