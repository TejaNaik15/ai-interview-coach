import React, { useEffect, useState } from "react";

type Q = {
  id: string;
  title: string;
  question: string;
  constraints: string;
  examples: Array<{ input: string; output: string }>;
};

const STORAGE_KEY = "ai_interview_history_v1";

type History = {
  easy: string[];
  medium: string[];
  hard: string[];
};

const defaultHistory: History = { easy: [], medium: [], hard: [] };

export default function CodingInterview() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [question, setQuestion] = useState<Q | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<History>(defaultHistory);
  const [error, setError] = useState<string | null>(null);

  // load history from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch (e) {
        setHistory(defaultHistory);
      }
    }
  }, []);

  // persist history whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  async function fetchNewQuestion() {
    setError(null);
    setLoading(true);
    try {
      const askedIds = history[difficulty];
      const resp = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, askedIds }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        setError(err.error || "Failed to fetch");
        setLoading(false);
        return;
      }

      const body = await resp.json();
      const q: Q = body.question;
      setQuestion(q);

      // update history
      setHistory((prev) => {
        const copy = { ...prev, [difficulty]: [...prev[difficulty], q.id] as string[] };
        return copy;
      });
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  function resetHistoryForDifficulty(d: "easy" | "medium" | "hard") {
    setHistory((prev) => ({ ...prev, [d]: [] }));
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Code Interview Practice</h2>

      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-900 rounded-lg">
        <label className="flex items-center gap-2">
          <span className="text-gray-300">Difficulty:</span>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value as any)} 
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <button 
          onClick={fetchNewQuestion} 
          disabled={loading} 
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded text-white font-medium"
        >
          {loading ? "Loading..." : `New Question (${history[difficulty].length} solved)`}
        </button>

        <button 
          onClick={() => resetHistoryForDifficulty(difficulty)} 
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-medium"
        >
          Reset {difficulty} history
        </button>

        <div className="ml-auto text-gray-400">
          Progress: {history[difficulty].length}/50
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {question ? (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-white">{question.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              difficulty === 'easy' ? 'bg-green-900 text-green-200' :
              difficulty === 'medium' ? 'bg-yellow-900 text-yellow-200' :
              'bg-red-900 text-red-200'
            }`}>
              {difficulty.toUpperCase()}
            </span>
          </div>
          
          <div className="mb-4">
            <h4 className="text-gray-300 font-medium mb-2">Problem:</h4>
            <pre className="whitespace-pre-wrap text-gray-100 bg-gray-800 p-3 rounded">
              {question.question}
            </pre>
          </div>
          
          <div className="mb-4">
            <h4 className="text-gray-300 font-medium mb-2">Constraints:</h4>
            <p className="text-gray-200">{question.constraints}</p>
          </div>
          
          <div>
            <h4 className="text-gray-300 font-medium mb-2">Examples:</h4>
            {question.examples.map((ex, i) => (
              <div key={i} className="bg-gray-800 p-3 rounded mb-2">
                <div className="text-green-400">Input: <code>{ex.input}</code></div>
                <div className="text-blue-400">Output: <code>{ex.output}</code></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          No question yet — click "New Question" to start practicing!
        </div>
      )}
    </div>
  );
}