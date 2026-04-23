'use client';

import { useState } from 'react';
import { summarizeItemSentiment } from './actions';

export default function AISummaryPage() {
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    const formData = new FormData(e.currentTarget);
    const result = await summarizeItemSentiment(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.summary) {
      setSummary(result.summary);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <header>
        <h1 className="text-4xl font-bold text-white mb-2">Community Sentiment AI</h1>
        <p className="text-gray-400">
          Query the AI to summarize what the Deadlock community thinks about specific items, heroes, or mechanics.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'Unstoppable' or 'Haze'"
          className="flex-1 p-3 rounded-md bg-gray-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          required
        />
        <button
          type="submit"
          disabled={loading || !query}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          {loading ? 'Analyzing...' : 'Ask AI'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-900/30 text-red-300 border border-red-800 rounded-md">
          {error}
        </div>
      )}

      {summary && (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">AI Summary:</h2>
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}
