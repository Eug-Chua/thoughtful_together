import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import OpenAI from 'openai';

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  preflightContinue: false,
}));

app.use(express.json());

app.post('/reframe', async (req, res) => {
  const { question, mbti, enneagram } = req.body;
  console.log('🛬 Incoming reframe request:', question, mbti, enneagram);

  const prompt = `
You are a Christian life coach helping people reflect more deeply on God's voice.

Original question:
"${question}"

Reframe this question in a way that connects personally to an MBTI type ${mbti} who is also an Enneagram type ${enneagram}.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const reframed = response.choices[0].message.content;
    console.log('✅ Reframed question:', reframed);
    res.json({ reframed });
  } catch (error) {
    console.error('🔥 OpenAI error:', error.response?.data || error.message);
    res.status(500).send('Error generating reframed question');
  }
});
