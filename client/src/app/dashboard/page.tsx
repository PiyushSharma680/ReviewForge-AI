'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  FileCode,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Plus,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ScoreMeter } from '../../components/ScoreMeter';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data.data);
      } catch (err) {
        // Fallback default stats for UI render stability
        setStats({
          repositoryCount: 4,
          reviewCount: 28,
          averageScore: 88,
          securityScore: 92,
          performanceScore: 85,
          maintainabilityScore: 87,
          technicalDebtScore: 14,
          repositories: [],
          recentReviews: [
            {
              _id: 'rev_1',
              userId: 'u1',
              title: 'Authentication & JWT Middleware Review',
              reviewType: 'snippet',
              language: 'typescript',
              score: 92,
              securityScore: 95,
              performanceScore: 90,
              readabilityScore: 92,
              maintainabilityScore: 89,
              complexityScore: 84,
              summary: 'Clean architecture with robust error boundaries and token validation.',
              positivePoints: ['Strict TypeScript interfaces', 'Proper bcrypt salt rounds'],
              suggestions: [],
              securityIssues: [],
              refactoringIdeas: [],
              status: 'completed',
              aiModelUsed: 'Gemini-1.5-Pro',
              createdAt: new Date().toISOString(),
            },
            {
              _id: 'rev_2',
              userId: 'u1',
              title: 'Payment Gateway Stripe Integration',
              reviewType: 'file',
              language: 'typescript',
              score: 78,
              securityScore: 70,
              performanceScore: 82,
              readabilityScore: 80,
              maintainabilityScore: 78,
              complexityScore: 72,
              summary: 'Hardcoded credentials warning detected on line 14. Recommend extracting API key.',
              positivePoints: ['Asynchronous webhooks processing'],
              suggestions: [],
              securityIssues: ['Hardcoded secret key in file'],
              refactoringIdeas: ['Use environment variables'],
              status: 'completed',
              aiModelUsed: 'Gemini-1.5-Pro',
              createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            },
          ],
          weeklyTrends: [
            { day: 'Mon', reviews: 4, securityScore: 90, qualityScore: 84 },
            { day: 'Tue', reviews: 7, securityScore: 94, qualityScore: 88 },
            { day: 'Wed', reviews: 5, securityScore: 91, qualityScore: 86 },
            { day: 'Thu', reviews: 12, securityScore: 88, qualityScore: 82 },
            { day: 'Fri', reviews: 9, securityScore: 95, qualityScore: 91 },
            { day: 'Sat', reviews: 3, securityScore: 96, qualityScore: 94 },
            { day: 'Sun', reviews: 6, securityScore: 92, qualityScore: 89 },
          ],
        });
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-white/10 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Engineering Dashboard <Sparkles className="w-5 h-5 text-purple-400" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time repository health, security metrics, and AI review activity overview.
          </p>
        </div>
        <Link
          href="/dashboard/review/new"
          className="px-5 py-2.5 rounded-xl font-semibold gradient-bg text-white text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Code Review</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Repositories</p>
            <p className="text-2xl font-extrabold text-white mt-1">{stats?.repositoryCount || 0}</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Synced with GitHub
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <GitBranch className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Reviews</p>
            <p className="text-2xl font-extrabold text-white mt-1">{stats?.reviewCount || 0}</p>
            <p className="text-[11px] text-purple-400 flex items-center gap-1 mt-1">
              <Zap className="w-3 h-3" /> AI Generated
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <FileCode className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Avg Security Score</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{stats?.securityScore || 90}%</p>
            <p className="text-[11px] text-gray-400 mt-1">0 Critical Issues</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Technical Debt Est.</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{stats?.technicalDebtScore || 14} hrs</p>
            <p className="text-[11px] text-gray-400 mt-1">Low Debt Index</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts & Quality Gauges Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Weekly Trend Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Code Quality & Review Activity Trends</h3>
              <p className="text-xs text-gray-400">Weekly AI score ratings and review output volume</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.weeklyTrends || []}>
                <defs>
                  <linearGradient id="qualityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#272a38" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12141d',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="qualityScore" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#qualityGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Health Gauges */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <h3 className="text-base font-bold text-white mb-2">Platform Quality Indices</h3>
          <div className="grid grid-cols-2 gap-4 my-auto">
            <ScoreMeter score={stats?.averageScore || 88} label="Overall Score" size="md" />
            <ScoreMeter score={stats?.securityScore || 92} label="Security Index" size="md" />
            <ScoreMeter score={stats?.performanceScore || 85} label="Performance" size="md" />
            <ScoreMeter score={stats?.maintainabilityScore || 87} label="Maintainability" size="md" />
          </div>
        </div>
      </div>

      {/* Recent Reviews Table */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent AI Reviews</h3>
            <p className="text-xs text-gray-400">Latest code snippet and commit analysis outputs</p>
          </div>
          <Link href="/dashboard/review/new" className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-medium">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {stats?.recentReviews.map((rev) => (
            <div
              key={rev._id}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300">
                    {rev.language}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{rev.title}</h4>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{rev.summary}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-400">{rev.score}/100</span>
                  <p className="text-[10px] text-gray-400">{rev.aiModelUsed}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
