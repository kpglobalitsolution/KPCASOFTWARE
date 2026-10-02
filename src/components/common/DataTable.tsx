import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown, Filter } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T | ((row: T) => string);
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
  filterComponent?: React.ReactNode;
  pageSize?: number;
  exportFileName?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchKey,
  onRowClick,
  actions,
  filterComponent,
  pageSize = 10,
  exportFileName = 'vyapaaros_export'
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) => {
      if (typeof searchKey === 'function') {
        return searchKey(row).toLowerCase().includes(search.toLowerCase());
      }
      if (typeof searchKey === 'string') {
        const val = row[searchKey];
        return String(val || '').toLowerCase().includes(search.toLowerCase());
      }
      // Fallback search across all string/number fields
      return Object.values(row).some((val) =>
        String(val || '').toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [data, search, searchKey]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comp = aVal > bVal ? 1 : -1;
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const headerRow = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(',');
    const rows = sortedData.map((row) =>
      columns
        .map((c) => {
          const val = row[c.key];
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xs">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-b border-slate-800 bg-slate-850/50">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
          {filterComponent}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 h-8 px-2.5 text-xs text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/30 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`py-2.5 px-3.5 ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  } ${col.sortable !== false ? 'cursor-pointer hover:text-slate-200 select-none' : ''} ${
                    col.className || ''
                  }`}
                >
                  <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <ArrowUpDown className="w-3 h-3 text-slate-500 hover:text-slate-300" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-6 h-6 text-slate-500" />
                    <span>No records found matching current query or filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`h-10 transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-slate-800/50' : 'hover:bg-slate-800/20'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-2 px-3.5 whitespace-nowrap ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      } ${col.className || ''}`}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-slate-800 bg-slate-850/40 text-[11px] text-slate-400">
        <div>
          Showing <span className="font-semibold text-slate-300">{sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-semibold text-slate-300">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
          <span className="font-semibold text-slate-300">{sortedData.length}</span> entries
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1 rounded border border-slate-700/80 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-slate-300 font-mono">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1 rounded border border-slate-700/80 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
