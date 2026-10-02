import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldAlert, Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackRoute?: string;
}

/**
 * AuthGuard ensures that protected routes and workspace views can only
 * be accessed by authenticated users with an active session.
 * Unauthenticated users are safely redirected to the `/login` path.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallbackRoute = '/login'
}) => {
  const { isAuthenticated, currentUser, currentRoute, navigateTo, showToast } = useApp();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        showToast(
          'Authentication Required',
          'Please sign in to access your secure business workspace.',
          'warning'
        );
        navigateTo(fallbackRoute);
      }
    } else {
      hasRedirectedRef.current = false;
    }
  }, [isAuthenticated, currentUser, fallbackRoute, navigateTo, showToast, currentRoute]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-900/30">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Securing Session &amp; Authenticating
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Protected route access verification in progress. Redirecting you to the authentication gateway...
        </p>
        <div className="mt-5 flex items-center gap-2 text-xs text-indigo-400 font-mono">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
