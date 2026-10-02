import React, { useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceType } from '../../types';
import { ShieldAlert, AlertTriangle, ArrowRight, Layers, Loader2 } from 'lucide-react';

interface WorkspaceGuardProps {
  children: React.ReactNode;
  /**
   * Explicit workspace type to enforce. If omitted, the guard will
   * automatically determine it from the active `currentRoute` or current `workspace`.
   */
  requiredWorkspace?: WorkspaceType;
}

/**
 * Determines the target workspace domain from the URL route string.
 */
function getWorkspaceFromPath(route: string): WorkspaceType | null {
  if (route.startsWith('/business')) return 'business';
  if (route.startsWith('/buyer')) return 'buyer';
  if (route.startsWith('/supplier')) return 'supplier';
  if (route.startsWith('/ca')) return 'ca';
  if (route.startsWith('/admin')) return 'admin';
  return null;
}

/**
 * WorkspaceGuard validates whether the currently authenticated user has an
 * active membership and valid subscription access for the specific workspace
 * identified in the current route or requiredWorkspace prop.
 *
 * If validation fails, the user is redirected to `/workspace/select`.
 */
export const WorkspaceGuard: React.FC<WorkspaceGuardProps> = ({
  children,
  requiredWorkspace
}) => {
  const {
    currentUser,
    impersonatedUser,
    activeTenant,
    tenants,
    currentRoute,
    workspace,
    navigateTo,
    showToast
  } = useApp();

  const hasNotifiedRef = useRef<string | null>(null);

  // 1. Resolve Target Workspace
  const targetWorkspace: WorkspaceType = useMemo(() => {
    if (requiredWorkspace) return requiredWorkspace;
    const inferred = getWorkspaceFromPath(currentRoute);
    return inferred || workspace;
  }, [requiredWorkspace, currentRoute, workspace]);

  // 2. Authorization & Subscription Validation
  const validationResult = useMemo(() => {
    const activeUser = impersonatedUser || currentUser;

    // Platform Super Admin has universal access to admin governance
    if (activeUser.role === 'SUPER_ADMIN') {
      return { authorized: true, reason: 'SUPER_ADMIN_ACCESS' };
    }

    // Platform Admin workspace is strictly reserved for Super Admin
    if (targetWorkspace === 'admin') {
      return {
        authorized: false,
        reason: 'Super Admin privileges required to access Platform Governance.'
      };
    }

    // Check user memberships for this specific workspace
    const memberships = activeUser.memberships || [];
    const matchingMembership = memberships.find(
      (m) => m.workspaceType === targetWorkspace
    );

    if (!matchingMembership) {
      return {
        authorized: false,
        reason: `Your account (${activeUser.email}) does not have an active membership for the ${targetWorkspace.toUpperCase()} workspace.`
      };
    }

    if (matchingMembership.status !== 'active') {
      return {
        authorized: false,
        reason: `Your membership for ${matchingMembership.organizationName} is currently ${matchingMembership.status}.`
      };
    }

    // Check Tenant Active Subscription
    const targetTenant =
      tenants.find((t) => t.id === matchingMembership.tenantId) || activeTenant;

    if (targetTenant) {
      if (targetTenant.subscriptionStatus === 'suspended') {
        return {
          authorized: false,
          reason: `The subscription for ${targetTenant.name} is currently suspended. Please contact billing support.`
        };
      }

      // Check if trial has expired
      if (
        targetTenant.subscriptionStatus === 'trial' &&
        targetTenant.trialEndsAt &&
        new Date(targetTenant.trialEndsAt).getTime() < Date.now()
      ) {
        return {
          authorized: false,
          reason: `The free trial for ${targetTenant.name} expired on ${new Date(targetTenant.trialEndsAt).toLocaleDateString('en-IN')}. Subscription upgrade required.`
        };
      }
    }

    return { authorized: true, reason: 'AUTHORIZED' };
  }, [currentUser, impersonatedUser, targetWorkspace, tenants, activeTenant]);

  // 3. Effect: Handle redirection when validation fails
  useEffect(() => {
    if (!validationResult.authorized) {
      const errorKey = `${targetWorkspace}-${validationResult.reason}`;
      if (hasNotifiedRef.current !== errorKey) {
        hasNotifiedRef.current = errorKey;
        showToast(
          'Workspace Access Restricted',
          validationResult.reason,
          'error'
        );
        navigateTo('/workspace/select');
      }
    } else {
      hasNotifiedRef.current = null;
    }
  }, [validationResult, targetWorkspace, navigateTo, showToast]);

  // 4. Fallback UI if access check fails
  if (!validationResult.authorized) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center text-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-950/40">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Unauthorized Workspace Access
        </h2>
        <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
          {validationResult.reason}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Redirecting you to your authorized workspaces list...
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => navigateTo('/workspace/select')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Select Authorized Workspace</span>
          </button>
        </div>
      </div>
    );
  }

  // Access approved
  return <>{children}</>;
};
