'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function CodeMetricsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Code Metrics Engine <BarChart3 className="w-5 h-5 text-blue-400" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Cyclomatic complexity calculation, maintainability index, and code duplication analysis.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <p className="text-xs text-gray-400">Cyclomatic Complexity</p>
          <p className="text-2xl font-extrabold text-white mt-1">4.2 (Low)</p>
          <p className="text-[11px] text-emerald-400 mt-1">Ideal threshold &lt; 10</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <p className="text-xs text-gray-400">Maintainability Index</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">87 / 100</p>
          <p className="text-[11px] text-gray-400 mt-1">Highly maintainable</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <p className="text-xs text-gray-400">Code Duplication Rate</p>
          <p className="text-2xl font-extrabold text-purple-400 mt-1">1.8%</p>
          <p className="text-[11px] text-gray-400 mt-1">Target &lt; 5%</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <p className="text-xs text-gray-400">Comment Ratio</p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">22.4%</p>
          <p className="text-[11px] text-gray-400 mt-1">Good documentation</p>
        </div>
      </div>

      {/* Detailed File Complexity breakdown */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-base font-bold text-white mb-4">File-Level Complexity Distribution</h3>
        <div className="space-y-3">
          {[
            { name: 'server/src/services/aiService.ts', lines: 210, complexity: 6, status: 'Optimal' },
            { name: 'server/src/controllers/authController.ts', lines: 140, complexity: 4, status: 'Optimal' },
            { name: 'client/src/app/dashboard/page.tsx', lines: 180, complexity: 5, status: 'Optimal' },
          ].map((file, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-semibold text-white">{file.name}</span>
                <p className="text-[11px] text-gray-400 mt-0.5">{file.lines} Lines of Code</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-300 font-mono">Complexity: {file.complexity}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                  {file.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
