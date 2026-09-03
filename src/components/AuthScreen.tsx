import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthMode = 'login' | 'register' | 'confirmation' | 'forgot' | 'recovery';

export const AuthScreen: React.FC<{ adminOnly?: boolean }> = ({ adminOnly = false }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'alumni' | 'faculty'>('student');
  const [batch, setBatch] = useState('');
  const [studentId, setStudentId] = useState('');
  const [hasAcceptedPolicies, setHasAcceptedPolicies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adminOnly && mode === 'register') {
      setMode('login');
    }
  }, [adminOnly, mode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const code = params.get('code');
    const tokenHash = params.get('token_hash');
    const isRecovery = params.get('type') === 'recovery' || hash.get('type') === 'recovery';
    const hasAuthCallback = Boolean(code || tokenHash || hash.get('access_token') || hash.get('refresh_token'));

    if (!hasAuthCallback) return;

    const finalizeAuth = async () => {
      try {
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }
        if (tokenHash) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: isRecovery ? 'recovery' : 'signup'
          });
          if (verifyError) throw verifyError;
        }
      } catch (callbackError) {
        console.error('Auth callback failed:', callbackError);
        setError(getAuthErrorMessage(callbackError));
        if (isRecovery) setMode('recovery');
      } finally {
        if (isRecovery) return;
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    void finalizeAuth();
  }, []);

  const resetStatus = () => setError(null);

  const requestPasswordReset = async () => {
    if (submittingRef.current) return;
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (!isUftbEmail(normalizedEmail)) {
      setError('Only UFTB email addresses can access this network.');
      return;
    }
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo: `${window.location.origin}/` });
      if (resetError) throw resetError;
      setEmail(normalizedEmail);
      setMode('confirmation');
    } catch (resetError) {
      setError(getAuthErrorMessage(resetError));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submittingRef.current) return;
    setError(null);
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      window.history.replaceState({}, '', window.location.pathname);
      setPassword('');
      setMode('login');
    } catch (updateError) {
      setError(getAuthErrorMessage(updateError));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submittingRef.current) return;
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    setEmail(normalizedEmail);
    if (adminOnly && mode !== 'login') {
      setError('Administrator accounts cannot be created here. Sign in with an authorized administrator account.');
      return;
    }
    setIsSubmitting(true);
    submittingRef.current = true;

    try {
      if (!isUftbEmail(normalizedEmail)) throw new Error('Use your UFTB email address (for example, name@uftb.ac.bd).');
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
        if (signInError) {
          if (signInError.message.toLowerCase().includes('not confirmed')) {
            throw new Error('Your email is not confirmed yet. Re-send the confirmation email or confirm the Supabase Auth redirect URL is configured correctly.');
          }
          throw new Error(getAuthErrorMessage(signInError));
        }
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { full_name: name, role, batch: batch.trim(), student_id: studentId.trim(), terms_accepted: true, privacy_policy_accepted: true },
          emailRedirectTo: window.location.origin
        }
      });
      if (signUpError) throw new Error(getAuthErrorMessage(signUpError));
      if (!data.session) setMode('confirmation');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const resendConfirmation = async () => {
    if (submittingRef.current) return;
    setError(null);
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: email.trim().toLowerCase() });
      if (resendError) throw resendError;
    } catch (resendError) {
      setError(getAuthErrorMessage(resendError));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (mode === 'confirmation') {
    return (
      <AuthLayout>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <span className="material-symbols-outlined">mark_email_read</span>
        </div>
        <h1 className="mt-5 font-heading text-2xl font-bold text-slate-900">Verify your email</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          We sent a verification link to <strong>{email}</strong>. Open it to activate your IRE Network account.
        </p>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
        <button
          type="button"
          onClick={resendConfirmation}
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending…' : 'Resend verification email'}
        </button>
        <button type="button" onClick={() => setMode('login')} className="mt-3 w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          Back to sign in
        </button>
      </AuthLayout>
    );
  }

  if (mode === 'recovery') {
    return (
      <AuthLayout>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">IRE Department Network</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-slate-900">Set a new password</h1>
        <p className="mt-2 text-sm text-slate-600">Choose a new password for your IREConnect account.</p>
        <form className="mt-6 space-y-4" onSubmit={updatePassword}>
          <label className="block text-xs font-bold text-slate-700">New password
            <input required minLength={6} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="At least 6 characters" />
          </label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
          <button disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </AuthLayout>
    );
  }

  if (mode === 'forgot') {
    return (
      <AuthLayout>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">IRE Department Network</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-slate-900">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your university email and we will send you a secure reset link.</p>
        <form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); void requestPasswordReset(); }}>
          <label className="block text-xs font-bold text-slate-700">University email
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="your.name@uftb.ac.bd" />
          </label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
          <button disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <button type="button" onClick={() => { resetStatus(); setMode('login'); }} className="mt-3 w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          Back to sign in
        </button>
      </AuthLayout>
    );
  }

  const isRegister = mode === 'register';
  return (
    <AuthLayout>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">IRE Department Network</p>
      <h1 className="mt-2 font-heading text-2xl font-bold text-slate-900">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
      <p className="mt-2 text-sm text-slate-600">{isRegister ? 'Create an account for the department community.' : adminOnly ? 'Sign in with an authorized administrator account.' : 'Sign in to continue.'}</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <label className="block text-xs font-bold text-slate-700">Full name
              <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="Your full name" />
            </label>
            <label className="block text-xs font-bold text-slate-700">Account type
              <select value={role} onChange={(event) => setRole(event.target.value as typeof role)} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="faculty">Faculty</option>
              </select>
            </label>
            <label className="block text-xs font-bold text-slate-700">Batch or graduation year
              <input required={role === 'student'} value={batch} onChange={(event) => setBatch(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder={role === 'faculty' ? 'Optional' : 'e.g. 2026 or Batch 10'} />
            </label>
            <label className="block text-xs font-bold text-slate-700">{role === 'faculty' ? 'Employee ID' : 'Student ID'}
              <input required value={studentId} onChange={(event) => setStudentId(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder={role === 'faculty' ? 'Your employee ID' : 'Your university ID'} />
            </label>
          </>
        )}
        <label className="block text-xs font-bold text-slate-700">University email
          <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="your.name@uftb.ac.bd" />
        </label>
        <label className="block text-xs font-bold text-slate-700">Password
          <input required minLength={6} type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="At least 6 characters" />
        </label>
        {isRegister && (
          <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
            <input required type="checkbox" checked={hasAcceptedPolicies} onChange={(event) => setHasAcceptedPolicies(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600" />
            <span>I agree to the IREConnect Terms of Service and Privacy Policy.</span>
          </label>
        )}
        {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
        {!isRegister && (
          <button type="button" onClick={() => { resetStatus(); setMode('forgot'); }} className="w-full text-right text-xs font-semibold text-blue-600 hover:text-blue-700">
            Forgot password?
          </button>
        )}
        <button disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
        </button>
      </form>
      {!adminOnly && (
        <p className="mt-5 text-center text-xs text-slate-600">
          {isRegister ? 'Already have an account?' : 'New to IRE Network?'}{' '}
          <button type="button" onClick={() => { resetStatus(); setMode(isRegister ? 'login' : 'register'); }} className="font-bold text-blue-600 hover:text-blue-700">
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      )}
    </AuthLayout>
  );
};

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl sm:p-8">{children}</section>
  </main>
);

const isUftbEmail = (email: string) => /^[^\s@]+@uftb\.ac\.bd$/i.test(email.trim());

const getAuthErrorMessage = (authError: unknown) => {
  const message = authError instanceof Error ? authError.message : '';
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login credentials')) return 'Email or password is incorrect.';
  if (normalized.includes('email not confirmed') || normalized.includes('not confirmed')) return 'Your email is not confirmed yet. Check your inbox for the verification link.';
  if (normalized.includes('user already registered')) return 'An account with this email already exists. Try signing in instead.';
  if (normalized.includes('password')) return 'Password must be at least 6 characters.';
  if (normalized.includes('rate limit')) return 'Too many attempts. Please wait a moment and try again.';
  return message || 'Something went wrong. Please try again.';
};
