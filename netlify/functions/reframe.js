// netlify/functions/reframe.js
const OpenAI = require("openai");

// v4 client – no Configuration class
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  try {
    const { question, mbti, enneagram } = JSON.parse(event.body || "{}");
    console.log("🛬 Incoming reframe request:", question, mbti, enneagram);

    /* 1. Persona clause */
    let personaClause = "to a broad Christian audience";
    if (mbti && enneagram) {
      personaClause = `to an MBTI type ${mbti} who is also an Enneagram type ${enneagram}`;
    } else if (mbti) {
      personaClause = `to an MBTI type ${mbti}`;
    } else if (enneagram) {
      personaClause = `to an Enneagram type ${enneagram}`;
    }

    /* 2. Prompt */
    const prompt = `
You are a Christian life coach helping people reflect more deeply on God's voice.

Original question:
"${question}"

Reframe this question in a way that connects personally ${personaClause}.
Make no mention of MBTI or Enneagram labels in your question.
Keep it simple, ≤ 15 words, and do not wrap the response in quotes or markdown.
`;

    /* 3. Call OpenAI */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",          // or gpt-4o / gpt-4o-turbo, etc.
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
      temperature: 0.7,
    });

    let reframed = completion.choices[0].message.content.trim();
    reframed = reframed.replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, "");

    console.log("✅ Reframed question:", reframed);
    return { statusCode: 200, body: JSON.stringify({ reframed }) };
  } catch (err) {
    console.error("🔥 Function error:", err);
    return { statusCode: 500, body: "Error generating reframed question" };
  }
};