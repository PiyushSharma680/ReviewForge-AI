'use client';

import React, { useState, useEffect } from 'react';
import { GitBranch, Search, Import, ExternalLink, RefreshCw, Star, GitFork, CheckCircle } from 'lucide-react';
import { api } from '../../../services/api';
import { Repository } from '../../../types';

export default function RepositoriesPage() {
  const [importedRepos, setImportedRepos] = useState<Repository[]>([]);
  const [remoteRepos, setRemoteRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [importingId, setImportingId] = useState<number | null>(null);

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    setLoading(true);
    try {
      const [importedRes, remoteRes] = await Promise.all([
        api.get('/repos'),
        api.get('/repos/github/remote'),
      ]);
      setImportedRepos(importedRes.data.data);
      setRemoteRepos(remoteRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (remoteRepo: any) => {
    setImportingId(remoteRepo.githubRepoId);
    try {
      const res = await api.post('/repos/import', remoteRepo);
      setImportedRepos((prev) => [res.data.data, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setImportingId(null);
    }
  };

  const filteredImported = importedRepos.filter((r) =>
    r.repoName.toLowerCase().includes(search.toLowerCase()) ||
    r.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            GitHub Repositories <GitBranch className="w-5 h-5 text-purple-400" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Import repositories for automated webhook monitoring and PR AI code reviews.
          </p>
        </div>
        <button
          onClick={loadRepositories}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync GitHub Account</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter repositories by name or language..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Active Imported Repositories */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Connected Repositories ({filteredImported.length})</h3>
        {loading ? (
          <div className="p-8 text-center text-gray-400 animate-pulse">Loading repositories...</div>
        ) : filteredImported.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-gray-400 border border-white/10">
            No connected repositories found. Import one from GitHub below!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImported.map((repo) => (
              <div key={repo._id} className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300">
                      {repo.language}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle className="w-3 h-3" /> Synced
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base truncate">{repo.repoName}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1 min-h-[32px]">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {repo.starsCount}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {repo.forksCount}</span>
                  </div>
                  <a href={repo.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline flex items-center gap-1">
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available GitHub Remote Repos */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Available Remote Repositories ({remoteRepos.length})</h3>
        <div className="space-y-3">
          {remoteRepos.map((remote) => {
            const isAlreadyImported = importedRepos.some((r) => r.githubRepoId === remote.githubRepoId);
            return (
              <div
                key={remote.githubRepoId}
                className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-semibold text-white text-sm">{remote.fullName}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{remote.description}</p>
                </div>

                {isAlreadyImported ? (
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                    Imported
                  </span>
                ) : (
                  <button
                    onClick={() => handleImport(remote)}
                    disabled={importingId === remote.githubRepoId}
                    className="px-3.5 py-1.5 rounded-lg gradient-bg text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <Import className="w-3.5 h-3.5" />
                    <span>{importingId === remote.githubRepoId ? 'Importing...' : 'Import Repo'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
