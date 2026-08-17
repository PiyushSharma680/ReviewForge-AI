'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Sparkles, GitPullRequest, Cpu, ArrowRight, Lock, Terminal } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">ReviewForge <span className="text-purple-400">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold gradient-bg hover:opacity-90 transition-all shadow-md shadow-purple-500/20 flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 text-center z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-purple-500/30 text-xs font-medium text-purple-300 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Next-Gen Enterprise Code Review Platform</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          Review Code Faster with <span className="gradient-text">AI Intelligence</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Automate pull request reviews, scan for security vulnerabilities, measure maintainability metrics, and refactor code in real-time with OpenAI & Gemini models.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold gradient-bg hover:scale-105 transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-3"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-medium glass-panel border border-white/10 hover:border-purple-500/40 text-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <GitPullRequest className="w-5 h-5 text-purple-400" />
            <span>Connect GitHub Repo</span>
          </Link>
        </div>

        {/* Code Preview Mockup */}
        <div className="w-full max-w-4xl glass-card rounded-2xl p-4 border border-white/10 shadow-2xl text-left font-mono text-xs text-gray-300 overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-gray-400">src/services/paymentService.ts</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-sans text-[11px]">AI Score: 94/100</span>
          </div>
          <pre className="p-4 bg-black/40 rounded-xl overflow-x-auto">
            <code>{`// Line 24: AI Security Recommendation
- var clientKey = "sk_live_99214a19x2";
+ const clientKey = process.env.STRIPE_SECRET_KEY; // Extracted hardcoded credential

// Line 38: Performance Optimization
- const item = items.find(i => i.id === targetId); // O(N) lookup in loop
+ const item = itemMap.get(targetId); // O(1) constant time map index lookup`}</code>
          </pre>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Model AI Engine</h3>
            <p className="text-sm text-gray-400">Powered by OpenAI GPT-4o & Gemini 1.5 Pro with custom prompt templates for Node, React, and Python.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Security Scanner</h3>
            <p className="text-sm text-gray-400">Detect SQL injection, XSS, hardcoded JWT secrets, CSRF risks, and unhandled promise rejections before merge.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Inline Diff Annotations</h3>
            <p className="text-sm text-gray-400">Review changed files like GitHub PRs with line-specific suggestions and one-click auto-refactoring.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-gray-500">
        <p>© 2026 ReviewForge AI Platform. Built for developers and enterprise software engineering teams.</p>
      </footer>
    </div>
  );
}
