'use client';

import React, { useState } from 'react';
import { Users, Plus, UserPlus } from 'lucide-react';

export default function WorkspacesPage() {
  const [workspaces] = useState([
    {
      id: 'ws_1',
      name: 'ReviewForge Core Engineering',
      slug: 'reviewforge-core',
      role: 'Owner',
      membersCount: 8,
      repositoriesCount: 4,
    },
    {
      id: 'ws_2',
      name: 'Mobile Apps Development',
      slug: 'mobile-dev',
      role: 'Admin',
      membersCount: 5,
      repositoriesCount: 2,
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Organization Workspaces <Users className="w-5 h-5 text-purple-400" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Collaborate with team members, share code reviews, and manage access permissions.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl gradient-bg text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Workspace</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workspaces.map((ws) => (
          <div key={ws.id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300">
                  {ws.role}
                </span>
                <span className="text-xs font-mono text-gray-400">{ws.slug}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{ws.name}</h3>
              <p className="text-xs text-gray-400">
                Shared workspace for cross-functional review management and security governance.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
              <span>{ws.membersCount} Members • {ws.repositoriesCount} Repositories</span>
              <button className="text-purple-400 hover:underline flex items-center gap-1 font-semibold">
                <UserPlus className="w-3.5 h-3.5" /> Invite Member
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
