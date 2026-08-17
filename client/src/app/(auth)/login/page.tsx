'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Github, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { api, API_URL } from '../../../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, user } = res.data.data;
      localStorage.setItem('reviewforge_token', accessToken);
      localStorage.setItem('reviewforge_user', JSON.stringify(user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubOAuth = () => {
    setLoading(true);
    setError('');
    const returnTo = `${window.location.origin}/auth/github/callback`;
    const oauthUrl = `${API_URL}/auth/github?returnTo=${encodeURIComponent(returnTo)}`;
    window.location.href = oauthUrl;
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col justify-center items-center p-6 relative">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 shadow-2xl z-10">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/25 mb-3">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-400 mt-1">Sign in to your ReviewForge AI platform</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="dev@reviewforge.ai"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold gradient-bg text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 text-sm mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In with Email'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[11px] text-gray-500 font-medium">OR CONTINUE WITH</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <button
          onClick={handleGitHubOAuth}
          disabled={loading}
          className="w-full py-3 rounded-xl font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center justify-center gap-3 text-sm"
        >
          <Github className="w-4 h-4" />
          <span>Sign In with GitHub</span>
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-purple-400 hover:underline font-medium">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
