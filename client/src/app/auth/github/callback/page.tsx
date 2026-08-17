'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../../../services/api';

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      setError('Missing GitHub authorization response. Please try signing in again.');
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await api.post('/auth/github', { code, state });
        const { accessToken, user } = res.data.data;
        localStorage.setItem('reviewforge_token', accessToken);
        localStorage.setItem('reviewforge_user', JSON.stringify(user));
        router.replace('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'GitHub authentication failed.');
      }
    };

    exchangeCode();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 text-center">
        {error ? (
          <>
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h1 className="text-lg font-semibold mb-2">GitHub Sign-In Failed</h1>
            <p className="text-sm text-gray-300">{error}</p>
            <button
              onClick={() => router.replace('/login')}
              className="mt-6 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
            <h1 className="text-lg font-semibold mb-2">Completing GitHub Sign-In</h1>
            <p className="text-sm text-gray-300">Please wait while we securely authenticate your account.</p>
          </>
        )}
      </div>
    </div>
  );
}

function CallbackLoadingState() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 text-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
        <h1 className="text-lg font-semibold mb-2">Loading GitHub Callback</h1>
        <p className="text-sm text-gray-300">Preparing secure authentication context.</p>
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoadingState />}>
      <GitHubCallbackContent />
    </Suspense>
  );
}
