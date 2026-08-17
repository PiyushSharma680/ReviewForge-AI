'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitBranch,
  FileCode,
  ShieldCheck,
  BarChart3,
  Bot,
  Users,
  Settings,
  Zap,
  ChevronRight,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Repositories', href: '/dashboard/repos', icon: GitBranch },
  { name: 'Manual Review', href: '/dashboard/review/new', icon: FileCode },
  { name: 'Security Scanner', href: '/dashboard/security', icon: ShieldCheck },
  { name: 'Code Metrics', href: '/dashboard/metrics', icon: BarChart3 },
  { name: 'AI Assistant Chat', href: '/dashboard/chat', icon: Bot },
  { name: 'Workspaces', href: '/dashboard/workspaces', icon: Users },
  { name: 'Admin Telemetry', href: '/dashboard/admin', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('reviewforge_token');
    localStorage.removeItem('reviewforge_user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 glass-panel border-r border-white/10 min-h-screen flex flex-col justify-between p-4 sticky top-0 z-30">
      <div>
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-4 mb-6 group">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              ReviewForge <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono">AI</span>
            </h1>
            <p className="text-xs text-gray-400">Enterprise Code Quality</p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-inner'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile / Logout */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
