import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, LogOut } from 'lucide-react';

export const ImpersonationBanner: React.FC = () => {
  const { impersonatedUser, impersonationReason, exitImpersonation } = useApp();

  if (!impersonatedUser) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-amber-300 text-xs flex items-center justify-between z-40 relative">
      <div className="flex items-center gap-2 truncate">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold text-amber-200">SUPER ADMIN IMPERSONATION SESSION:</span>
        <span className="truncate">
          Operating as <strong className="text-white">{impersonatedUser.name}</strong> ({impersonatedUser.organizationName})
        </span>
        {impersonationReason && (
          <span className="hidden md:inline text-amber-300/80">· Reason: &ldquo;{impersonationReason}&rdquo;</span>
        )}
      </div>
      <button
        onClick={exitImpersonation}
        className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded text-xs transition-colors shrink-0"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Exit Session</span>
      </button>
    </div>
  );
};
