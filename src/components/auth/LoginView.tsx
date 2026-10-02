import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  ShoppingCart,
  Truck,
  CheckCircle2,
  X,
  Smartphone,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { WorkspaceType } from '../../types';

export const LoginView: React.FC = () => {
  const { login, navigateTo } = useApp();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStepStatus, setAuthStepStatus] = useState<string | null>(null);

  // Forgot password modal
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Execute redirection engine
  const handleLogin = (e?: React.FormEvent, customIdentifier?: string, customTargetWs?: WorkspaceType) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const idToUse = customIdentifier || emailOrPhone;
    if (!idToUse.trim()) {
      setErrorMsg('Please enter your registered Email or Mobile number.');
      return;
    }

    setIsAuthenticating(true);
    setAuthStepStatus('IDENTIFYING USER...');

    // Provide authentic step transition for the Login Redirection Engine
    setTimeout(() => {
      setAuthStepStatus('CHECKING ACCOUNT TYPE & PERMISSIONS...');
      setTimeout(() => {
        setAuthStepStatus('CHECKING WORKSPACE ACCESS...');
        const success = login(idToUse, password || 'demo123', customTargetWs);
        setIsAuthenticating(false);
        setAuthStepStatus(null);
        if (!success) {
          setErrorMsg('Authentication failed. No user found matching the provided credentials.');
        }
      }, 300);
    }, 200);
  };

  const demoAccounts = [
    {
      label: 'Business Owner',
      desc: 'Shree Retail Mart',
      email: 'parthkanjariya78@gmail.com',
      targetWs: 'business' as WorkspaceType,
      role: 'OWNER',
      icon: Building2,
      color: 'border-indigo-500/40 hover:border-indigo-500 bg-indigo-950/20'
    },
    {
      label: 'Chartered Accountant',
      desc: 'KP Tax & Advisory',
      email: 'kailash@kptaxadvisory.com',
      targetWs: 'ca' as WorkspaceType,
      role: 'CA_PARTNER',
      icon: GraduationCap,
      color: 'border-emerald-500/40 hover:border-emerald-500 bg-emerald-950/20'
    },
    {
      label: 'B2B Buyer',
      desc: 'ABC Traders',
      email: 'procurement@abctraders.com',
      targetWs: 'buyer' as WorkspaceType,
      role: 'PURCHASE_MANAGER',
      icon: ShoppingCart,
      color: 'border-sky-500/40 hover:border-sky-500 bg-sky-950/20'
    },
    {
      label: 'Supplier / Vendor',
      desc: 'Global Wholesale',
      email: 'orders@globalwholesale.in',
      targetWs: 'supplier' as WorkspaceType,
      role: 'SALES_MANAGER',
      icon: Truck,
      color: 'border-amber-500/40 hover:border-amber-500 bg-amber-950/20'
    },
    {
      label: 'Super Admin',
      desc: 'Platform Infrastructure',
      email: 'admin@vyapaaros.com',
      targetWs: 'admin' as WorkspaceType,
      role: 'SUPER_ADMIN',
      icon: ShieldCheck,
      color: 'border-purple-500/40 hover:border-purple-500 bg-purple-950/20'
    },
    {
      label: 'Multi-Workspace User',
      desc: 'Access to Business + Buyer',
      email: 'parthkanjariya78@gmail.com',
      targetWs: undefined, // undefined triggers /workspace/select!
      role: 'MULTIPLE',
      icon: Layers,
      color: 'border-teal-500/40 hover:border-teal-500 bg-teal-950/20'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 mb-4 group"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/40 group-hover:scale-105 transition-transform">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            VyapaarOS
          </span>
        </button>

        <h2 className="text-2xl font-bold tracking-tight text-white">
          Sign in to your workspace
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">
          Enter your registered credentials to access your authorized business domain.
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800 py-8 px-6 sm:px-8 rounded-xl shadow-2xl relative backdrop-blur-sm">
          {isAuthenticating && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs rounded-xl z-20 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <span className="text-xs font-bold text-white tracking-wider">
                {authStepStatus || 'VERIFYING CREDENTIALS...'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Connecting to authorized tenant routing engine
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="name@business.com or 98250XXXXX"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-200">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-9 pr-9 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-300">Remember this workstation</span>
              </label>

              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> 256-bit SSL
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2"
            >
              <span>Login to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social / SSO Auth */}
          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-semibold tracking-wider">
                  Or login with enterprise ID
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLogin(undefined, 'parthkanjariya78@gmail.com', 'business')}
                className="flex items-center justify-center gap-2 py-2 px-3 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <span className="font-bold text-indigo-400">G</span> Google Workspace
              </button>
              <button
                type="button"
                onClick={() => handleLogin(undefined, '+919825012345', 'business')}
                className="flex items-center justify-center gap-2 py-2 px-3 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Mobile OTP
              </button>
            </div>
          </div>

          {/* Create Account Link */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              New to VyapaarOS?{' '}
              <button
                type="button"
                onClick={() => navigateTo('/register')}
                className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1 transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* 1-Click Fast Evaluator Accounts Box */}
        <div className="mt-6 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Demo Roles &amp; Redirection Engine Test
            </span>
            <span className="text-[9px] text-slate-400 font-mono">1-Click Auto Login</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Click any role to test its specific redirection path (never defaults to a generic dashboard):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {demoAccounts.map((acc, i) => {
              const Icon = acc.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setEmailOrPhone(acc.email);
                    setPassword('demo123');
                    handleLogin(undefined, acc.email, acc.targetWs);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all ${acc.color} group`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    <Icon className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 shrink-0" />
                    <span className="truncate">{acc.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {acc.desc}
                  </div>
                  <span className="text-[9px] text-indigo-400 font-mono mt-1 block">
                    {acc.role} →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigateTo('/')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to Landing / Welcome
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsForgotPasswordOpen(false);
                setResetSent(false);
              }}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-white mb-1">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered email address or mobile number. We will send a secure 6-digit recovery OTP.
            </p>

            {resetSent ? (
              <div className="py-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-white">Reset OTP Dispatched</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Sent to <span className="text-white font-mono">{resetIdentifier}</span>. Check your inbox or SMS.
                </p>
                <button
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setResetSent(false);
                  }}
                  className="mt-4 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  placeholder="Enter email or mobile..."
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (resetIdentifier.trim()) {
                      setResetSent(true);
                    }
                  }}
                  disabled={!resetIdentifier.trim()}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-md disabled:opacity-50"
                >
                  Send Recovery Link / OTP
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
