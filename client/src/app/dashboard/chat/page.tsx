'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, User as UserIcon } from 'lucide-react';
import { api } from '../../../services/api';

interface Message {
  sender: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      content: `Hello! I am your **Repository-Aware AI Assistant**. Ask me to explain functions, optimize algorithms, or generate unit tests for your project!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: userMsg });
      const lastMsg = res.data.data.messages.slice(-1)[0];
      setMessages((prev) => [...prev, { sender: 'assistant', content: lastMsg.content }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', content: 'Apologies, failed to retrieve AI response. Please check server logs.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-card rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Repository AI Assistant</h3>
          <p className="text-[11px] text-gray-400">Contextual code explanation & refactoring chat</p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                msg.sender === 'user' ? 'bg-purple-600 text-white' : 'gradient-bg text-white'
              }`}
            >
              {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-purple-600/30 border border-purple-500/40 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-200'
              }`}
            >
              <div className="prose prose-invert max-w-none text-xs">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 p-2 animate-pulse">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>AI thinking & indexing codebase...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI: Explain this function, generate Vitest tests..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 rounded-xl gradient-bg text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
