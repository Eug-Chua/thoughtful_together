import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import OpenAI from 'openai';

const app = express();
const port = 5050;
const local_host = 3000

app.use(cors({
  origin: `http://localhost:${local_host}`,
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));


// ✅ Parse JSON bodies
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/ping', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send('pong');
});

app.post('/reframe', async (req, res) => {
  const { question, mbti, enneagram } = req.body;
  console.log('🛬 Incoming reframe request:', question, mbti, enneagram);

  const prompt = `
You are a Christian life coach helping people reflect more deeply on God's voice.

Original question:
"${question}"

Reframe this question in a way that connects personally to an MBTI type ${mbti} who is also an Enneagram type ${enneagram}.
Make no mention of MBTI type or Enneagram type in your question. The question should be simple to understand. Limit it to 15 words. 
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

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});