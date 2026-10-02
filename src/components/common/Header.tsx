import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Sparkles,
  Command,
  Bell,
  Building2,
  ChevronDown,
  LogOut,
  Settings,
  Layers,
  User as UserIcon,
  ShieldAlert
} from 'lucide-react';
import { WorkspaceType } from '../../types';

export const Header: React.FC = () => {
  const {
    workspace,
    setWorkspace,
    activeTenant,
    tenants,
    setActiveTenant,
    currentUser,
    impersonatedUser,
    setIsQuickCreateOpen,
    setIsCommandPaletteOpen,
    setIsAiModalOpen,
    tallyQueue,
    gstMismatches,
    navigateTo,
    logout
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const user = impersonatedUser || currentUser;
  const pendingTallyCount = tallyQueue.filter((t) => t.status === 'pending' || t.status === 'failed').length;
  const pendingGstCount = gstMismatches.filter((g) => g.status === 'pending').length;
  const alertCount = pendingTallyCount + pendingGstCount;

  const workspaces: { key: WorkspaceType; label: string }[] = [
    { key: 'business', label: 'Business' },
    { key: 'buyer', label: 'Buyer' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'ca', label: 'CA Firm' },
    { key: 'admin', label: 'Super Admin' }
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigateTo(`/${workspace}/dashboard`);
          }}
          className="text-base font-bold tracking-tight text-white hover:text-indigo-400 transition-colors flex items-center gap-2"
        >
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            V
          </div>
          <span>VyapaarOS</span>
        </a>

        {/* Workspace Segmented Switcher */}
        <nav className="hidden lg:flex items-center gap-1 p-0.5 bg-slate-800/80 rounded-md border border-slate-700/60">
          {workspaces.map((ws) => (
            <button
              key={ws.key}
              onClick={() => setWorkspace(ws.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                workspace === ws.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {ws.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Zone 2: Search Trigger & Tenant Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 h-8 px-3 text-xs text-slate-400 bg-slate-800/80 border border-slate-700/80 rounded-md hover:border-slate-600 hover:text-slate-200 transition-colors w-64 justify-between"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search or jump to...</span>
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-slate-700/60 px-1 py-0.5 rounded">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Active Tenant Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 h-8 px-2.5 text-xs text-slate-200 bg-slate-800/80 border border-slate-700/80 rounded-md hover:bg-slate-700/60 transition-colors">
            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium max-w-[140px] truncate">{activeTenant.tradeName || activeTenant.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <div className="absolute right-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-md shadow-xl py-1 hidden group-hover:block z-50">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
              Switch Organization
            </div>
            {tenants.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTenant(t)}
                className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-700/50 transition-colors ${
                  activeTenant.id === t.id ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-200'
                }`}
              >
                <span className="font-medium truncate">{t.name}</span>
                <span className="text-[10px] text-slate-400">{t.gstin || 'Platform'} · {t.city || 'HQ'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        {/* AI Operator */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium text-indigo-200 bg-indigo-950/70 border border-indigo-700/50 rounded-md hover:bg-indigo-900/60 transition-colors"
          title="AI Business Operator"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">AI Operator</span>
        </button>

        {/* Global Quick Add (+) */}
        <button
          onClick={() => setIsQuickCreateOpen(true)}
          className="flex items-center gap-1 h-8 px-2.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors shadow-xs"
          title="Quick Create (Invoices, Purchases, Items, Parties)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create</span>
        </button>

        {/* Notification indicator */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="relative flex items-center justify-center w-8 h-8 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title={`${alertCount} Pending actions`}
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-slate-900" />
          )}
        </button>

        {/* User avatar & dropdown */}
        <div className="relative pl-2 border-l border-slate-800" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-700/60 border border-indigo-500/40 flex items-center justify-center text-xs font-semibold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-xs font-medium text-slate-200 truncate max-w-[120px]">{user.name}</span>
              <span className="text-[10px] text-slate-400">{user.role}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden xl:inline" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                    {user.role}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {user.accountType || 'BUSINESS'}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigateTo('/workspace/select');
                  }}
                  className="w-full px-4 py-2 text-xs text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Switch Workspace</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigateTo('/business/settings');
                  }}
                  className="w-full px-4 py-2 text-xs text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Workspace Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-xs text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
