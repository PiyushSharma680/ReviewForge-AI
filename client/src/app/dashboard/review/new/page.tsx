'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sparkles, FileCode, Play } from 'lucide-react';
import { ScoreMeter } from '../../../../components/ScoreMeter';
import { api } from '../../../../services/api';
import { Review } from '../../../../types';

const defaultSnippet = `// Sample TypeScript Payment Processing Snippet
function processTransaction(userId: string, amount: number) {
  var apiKey = "sk_live_99214a19x2"; // Hardcoded secret
  
  if (amount > 10000) {
    console.log("Large payment processing for: " + userId);
  }

  // Nested loop causing performance bottleneck
  const users = [userId];
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users.length; j++) {
      if (users[i] === users[j]) {
        return { status: "processed", key: apiKey };
      }
    }
  }
}`;

export default function NewReviewPage() {
  const [code, setCode] = useState(defaultSnippet);
  const [language, setLanguage] = useState('typescript');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<Review | null>(null);

  const handleRunReview = async () => {
    setLoading(true);
    try {
      const res = await api.post('/review/code', {
        codeSnippet: code,
        language,
        customPrompt,
      });
      setReviewResult(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            AI Code Reviewer <Sparkles className="w-5 h-5 text-purple-400" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Paste code snippets or select target file to receive instant multi-category AI suggestions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold focus:outline-none"
          >
            <option value="typescript" className="bg-gray-900">TypeScript</option>
            <option value="javascript" className="bg-gray-900">JavaScript</option>
            <option value="python" className="bg-gray-900">Python</option>
            <option value="java" className="bg-gray-900">Java</option>
            <option value="go" className="bg-gray-900">Go</option>
          </select>

          <button
            onClick={handleRunReview}
            disabled={loading}
            className="px-5 py-2 rounded-xl font-bold gradient-bg text-white text-xs hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Analyzing Code...' : 'Run AI Review'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen Editor vs Review Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor Container */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-400" /> Input Code Editor
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-bold">{language}</span>
          </div>

          <div className="flex-1 min-h-[400px]">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>

          <div className="p-3 border-t border-white/10 bg-white/5">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Optional custom review prompt (e.g. Focus on memory allocation)..."
              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* AI Output Section */}
        <div className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between overflow-y-auto max-h-[600px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mb-4" />
              <p className="text-sm font-semibold text-white">AI Neural Engine Analyzing Code...</p>
              <p className="text-xs text-gray-400 mt-1">Scanning security, cyclomatic complexity & performance</p>
            </div>
          ) : reviewResult ? (
            <div className="space-y-6">
              {/* Score Badges */}
              <div className="flex items-center justify-around p-4 rounded-xl bg-white/5 border border-white/10">
                <ScoreMeter score={reviewResult.score} label="Overall" size="sm" />
                <ScoreMeter score={reviewResult.securityScore} label="Security" size="sm" />
                <ScoreMeter score={reviewResult.performanceScore} label="Performance" size="sm" />
                <ScoreMeter score={reviewResult.maintainabilityScore} label="Maintainability" size="sm" />
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Review Summary</h4>
                <p className="text-sm text-gray-200 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  {reviewResult.summary}
                </p>
              </div>

              {/* Line Suggestions */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Inline Line-by-Line Suggestions</h4>
                <div className="space-y-3">
                  {reviewResult.suggestions.map((sug, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-purple-300 font-bold">Line {sug.lineNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-red-500/20 text-red-300">
                          {sug.severity}
                        </span>
                      </div>
                      <p className="font-semibold text-white mb-1">{sug.issue}</p>
                      <p className="text-gray-300 text-[11px] mb-2">{sug.recommendation}</p>
                      {sug.fixedCodeSnippet && (
                        <pre className="p-2 rounded bg-black/60 text-[11px] font-mono text-emerald-300 border border-emerald-500/30 overflow-x-auto">
                          <code>{sug.fixedCodeSnippet}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center text-gray-400">
              <Sparkles className="w-10 h-10 text-purple-400/50 mb-3" />
              <p className="text-sm font-medium text-gray-300">No Review Generated Yet</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Click "Run AI Review" above to submit code to Gemini/OpenAI models.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
