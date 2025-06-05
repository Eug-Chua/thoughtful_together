import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/reframe', async (req, res) => {
  const { question, mbti, enneagram } = req.body;

  const prompt = `
You are a Christian life coach helping people reflect more deeply on God's voice.

Original question:
"${question}"

Reframe this question in a way that connects personally to an MBTI type ${mbti} who is also an Enneagram type ${enneagram}.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [{ role: 'user', content: prompt }],
    });

    const reframed = response.choices[0].message.content;
    res.json({ reframed });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating reframed question');
  }
  console.log('🛬 Incoming reframe request:', question, mbti, enneagram);
});
  

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
