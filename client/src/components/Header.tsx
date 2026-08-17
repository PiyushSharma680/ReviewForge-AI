'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, User as UserIcon } from 'lucide-react';
import { User } from '../types';

export const Header: React.FC<{ onOpenCommandPalette?: () => void }> = ({ onOpenCommandPalette }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('reviewforge_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  return (
    <header className="h-16 glass-panel border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Quick Command Palette Search */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:border-purple-500/50 hover:text-gray-200 transition-all w-72"
      >
        <Search className="w-3.5 h-3.5 text-gray-400" />
        <span>Search repos, reviews, prompts...</span>
        <kbd className="ml-auto bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-gray-300 font-mono">⌘K</kbd>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI Engine Active</span>
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs shadow-md">
            {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">{user?.name || 'Developer'}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{user?.email || 'dev@reviewforge.ai'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
