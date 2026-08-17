'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, Key } from 'lucide-react';

const mockVulnerabilities = [
  {
    id: 'SEC-101',
    category: 'Hardcoded Secret',
    severity: 'Critical',
    file: 'src/config/jwt.ts',
    line: 14,
    description: 'Plaintext secret key assigned in file instead of referencing environment variables.',
    remediation: 'Use process.env.JWT_SECRET.',
  },
  {
    id: 'SEC-102',
    category: 'SQL Injection Vulnerability',
    severity: 'High',
    file: 'src/repositories/userRepo.ts',
    line: 42,
    description: 'Raw string interpolation in database query: SELECT * FROM users WHERE email = ${req.body.email}.',
    remediation: 'Use parameterized queries or ORM bindings.',
  },
  {
    id: 'SEC-103',
    category: 'Cross-Site Scripting (XSS)',
    severity: 'Medium',
    file: 'src/components/UserBio.tsx',
    line: 28,
    description: 'Unsanitized dangerouslySetInnerHTML rendering raw user input.',
    remediation: 'Sanitize HTML output using DOMPurify.',
  },
];

export default function SecurityPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Static Security Scanner <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Automated AST analysis for OWASP Top 10 vulnerabilities, credential exposure, and unsafe APIs.
          </p>
        </div>
      </div>

      {/* Security Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Vulnerabilities Found</p>
            <p className="text-2xl font-extrabold text-red-400 mt-1">3 Issues</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Security Score Index</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">92 / 100</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Scanned Repositories</p>
            <p className="text-2xl font-extrabold text-purple-400 mt-1">4 Active</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Key className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Vulnerability Table */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-base font-bold text-white mb-4">Detected Vulnerabilities</h3>
        <div className="space-y-3">
          {mockVulnerabilities.map((vuln) => (
            <div key={vuln.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-purple-400 font-bold">{vuln.id}</span>
                  <h4 className="font-bold text-white text-sm">{vuln.category}</h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                  vuln.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {vuln.severity}
                </span>
              </div>

              <p className="text-xs text-gray-300">{vuln.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400 font-mono pt-1">
                <span>File: {vuln.file}:{vuln.line}</span>
                <span className="text-emerald-400 font-sans">Fix: {vuln.remediation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
