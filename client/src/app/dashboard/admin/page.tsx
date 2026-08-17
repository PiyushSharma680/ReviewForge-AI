'use client';

import React from 'react';
import { Settings, HardDrive, Server, Activity, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Admin Telemetry & Logs <Settings className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            System status, BullMQ background worker telemetry, user accounts, and API rate limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Server Health</p>
            <p className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 100% Operational
            </p>
          </div>
          <Server className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">BullMQ Active Queue</p>
            <p className="text-xl font-bold text-purple-400 mt-1">0 Pending Jobs</p>
          </div>
          <Activity className="w-6 h-6 text-purple-400" />
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Redis Memory Usage</p>
            <p className="text-xl font-bold text-blue-400 mt-1">12.4 MB</p>
          </div>
          <HardDrive className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-base font-bold text-white mb-4">System Telemetry & Feature Flags</h3>
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="text-gray-300">FEATURE_GEMINI_FALLBACK</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">ENABLED</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="text-gray-300">FEATURE_STATIC_AST_SCANNER</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">ENABLED</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="text-gray-300">FEATURE_BULLMQ_BACKGROUND_WORKERS</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
