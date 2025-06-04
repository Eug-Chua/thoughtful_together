const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/reframe', async (req, res) => {
  const { question, mbti, enneagram } = req.body;

  const prompt = `
You are a Christian life coach helping people reflect more deeply on God's voice.

Original question:
"${question}"

MBTI: ${mbti}
Enneagram: ${enneagram}

Reframe this question in a way that connects personally to their inner spiritual world.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const reframed = completion.data.choices[0].message.content;
    res.json({ reframed });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating reframed question');
  }
});

app.listen(5000, () => console.log('Server listening on port 5000'));