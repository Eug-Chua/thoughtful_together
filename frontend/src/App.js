import React, { useState, useEffect } from 'react';
import questions from './questions.json';
import './index.css';

const mbtiPairs = [
  ['E', 'I'],
  ['N', 'S'],
  ['T', 'F'],
  ['P', 'J'],
];

function App() {
  const [depth, setDepth] = useState('chill');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [reframed, setReframed] = useState('');
  const [mbti, setMbti] = useState(['E', 'N', 'T', 'J']);
  const [enneagram, setEnneagram] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

  const filtered = questions.filter(q => q.depth === depth);
  const question = reframed || filtered[questionIndex]?.content || '';

  const pickQuestion = (offset) => {
    const newIndex = (questionIndex + offset + filtered.length) % filtered.length;
    setQuestionIndex(newIndex);
    setReframed('');
    setFadeKey(prev => prev + 1);
  };

  const toggleMbti = (row, value) => {
    setMbti(prev => ({ ...prev, [row]: value }));
  };

  const fullMbti = Object.values(mbti).join('');

  const reframeWithAI = async () => {
    if (!fullMbti || !enneagram || !question) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5050/reframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          mbti: fullMbti,
          enneagram
        }),
      });
      const data = await res.json();
      setReframed(data.reframed);
      setFadeKey(prev => prev + 1);
    } catch (err) {
      setReframed('⚠️ Failed to reframe. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-indigo-100 font-sans flex items-center justify-center relative px-6">
      {/* 🔮 Soft Glowing Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[5%] w-[300px] h-[300px] bg-pink-300 opacity-30 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-blue-300 opacity-30 blur-3xl rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[40%] w-[250px] h-[250px] bg-purple-300 opacity-20 blur-3xl rounded-full animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-xl space-y-6 text-center">
        {/* 🔘 Chill vs Deep */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => { setDepth('chill'); setQuestionIndex(0); setReframed(''); }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${depth === 'chill' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            🧊 Chill
          </button>
          <button
            onClick={() => { setDepth('deep'); setQuestionIndex(0); setReframed(''); }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${depth === 'deep' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            🔥 Deep
          </button>
        </div>

        {/* 🃏 Question */}
        <div key={fadeKey} className="bg-white bg-opacity-90 shadow-md rounded-lg p-6 text-lg text-gray-800 transition-opacity duration-700 animate-fade-in">
          {question}
        </div>

        {/* 🎯 MBTI */}
        <div className="grid grid-cols-4 gap-2 w-full">
          {['EI', 'NS', 'TF', 'PJ'].map((pair, idx) => (
            <button
              key={pair}
              onClick={() => {
                const updated = [...mbti];
                updated[idx] = updated[idx] === pair[0] ? pair[1] : pair[0];
                setMbti(updated);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium w-full ${
                mbti[idx] === pair[0] ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-black'
              }`}
            >
              {mbti[idx]}
            </button>
          ))}
        </div>


        {/* 🔢 Enneagram */}
        <div className="grid grid-cols-9 gap-1 text-sm">
          {[...Array(9)].map((_, i) => {
            const val = (i + 1).toString();
            return (
              <button
                key={val}
                onClick={() => setEnneagram(val)}
                className={`py-1 rounded font-medium border ${
                  enneagram === val
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>

        {/* ✨ Actions */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={reframeWithAI}
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Thinking...' : '✨ Reframe with AI'}
          </button>

          <div className="flex justify-between space-x-2">
            <button
              onClick={() => pickQuestion(-1)}
              className="w-full py-2 rounded-full text-white bg-purple-600 hover:bg-purple-700"
            >
              ⬅️ Previous
            </button>
            <button
              onClick={() => pickQuestion(1)}
              className="w-full py-2 rounded-full text-white bg-purple-600 hover:bg-purple-700"
            >
              🔁 Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
