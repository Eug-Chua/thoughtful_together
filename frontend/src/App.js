import React, { useState, useEffect } from 'react';
import questions from './questions.json';
import './index.css';

function App() {
  const [depth, setDepth] = useState('chill');         // chill 🔵 or deep 🔴
  const [question, setQuestion] = useState(null);      // current question
  const [reframed, setReframed] = useState('');        // AI-enhanced version
  const [mbti, setMbti] = useState('');
  const [enneagram, setEnneagram] = useState('');
  const [loading, setLoading] = useState(false);

  // pick a random question when depth changes
  useEffect(() => {
    pickRandomQuestion();
  }, [depth]);

  const pickRandomQuestion = () => {
    const filtered = questions.filter(q => q.depth === depth);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setQuestion(random);
    setReframed('');
  };

  const reframeWithAI = async () => {
    if (!mbti || !enneagram || !question) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/reframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.content,
          mbti,
          enneagram
        }),
      });

      const data = await res.json();
      setReframed(data.reframed);
    } catch (err) {
      setReframed('⚠️ Failed to reframe. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex flex-col items-center justify-center space-y-8">
      <div className="flex space-x-4">
        <button
          onClick={() => setDepth('chill')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${depth === 'chill' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          🧊 Chill
        </button>
        <button
          onClick={() => setDepth('deep')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${depth === 'deep' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          🔥 Deep
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg max-w-xl w-full p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">🃏 {question?.content}</h2>
        {reframed && (
          <p className="text-gray-700 italic mt-4 border-t pt-4">
            ✨ <span className="font-medium">Reframed for {mbti} / {enneagram}:</span><br />
            {reframed}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center space-y-3 w-full max-w-sm">
        <input
          value={mbti}
          onChange={(e) => setMbti(e.target.value)}
          placeholder="Your MBTI (e.g., INFJ)"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <input
          value={enneagram}
          onChange={(e) => setEnneagram(e.target.value)}
          placeholder="Your Enneagram (e.g. 4)"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button
          onClick={reframeWithAI}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${loading ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {loading ? 'Thinking...' : '✨ Reframe with AI'}
        </button>
        <button
          onClick={pickRandomQuestion}
          className="w-full py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
        >
          🔁 Next Question
        </button>
      </div>
    </div>
  );
}

export default App;
