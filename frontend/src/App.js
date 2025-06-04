import React, { useState, useEffect } from 'react';
import questions from './questions.json';
import './App.css';

function App() {
  const [depth, setDepth] = useState('chill');
  const [question, setQuestion] = useState(null);
  const [reframed, setReframed] = useState('');
  const [mbti, setMbti] = useState('');
  const [enneagram, setEnneagram] = useState('');

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
    const res = await fetch('http://localhost:5000/reframe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question.content,
        mbti,
        enneagram
      })
    });
    const data = await res.json();
    setReframed(data.reframed);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="mb-4">
        <button onClick={() => setDepth('chill')} className={`mx-2 px-4 py-2 rounded ${depth === 'chill' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>🧊 Chill</button>
        <button onClick={() => setDepth('deep')} className={`mx-2 px-4 py-2 rounded ${depth === 'deep' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>🔥 Deep</button>
      </div>
      <div className="bg-white shadow p-6 rounded w-full max-w-xl text-center">
        <h2 className="text-xl font-semibold mb-4">🃏 {question?.content}</h2>
        {reframed && <p className="italic text-gray-600 mt-4">✨ {reframed}</p>}
        <div className="mt-6 flex flex-col gap-2">
          <input value={mbti} onChange={(e) => setMbti(e.target.value)} placeholder="MBTI (e.g., INFJ)" className="border p-2 rounded" />
          <input value={enneagram} onChange={(e) => setEnneagram(e.target.value)} placeholder="Enneagram (e.g., 4w5)" className="border p-2 rounded" />
          <button onClick={reframeWithAI} className="bg-purple-600 text-white px-4 py-2 rounded">✨ Reframe with AI</button>
          <button onClick={pickRandomQuestion} className="bg-gray-800 text-white px-4 py-2 rounded">🔁 Next Question</button>
        </div>
      </div>
    </div>
  );
}

export default App;
