const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { question, mbti, enneagram } = body;

    console.log("🛬 Incoming reframe request:", question, mbti, enneagram);

    // 1. Persona clause logic
    let personaClause = "to a broad Christian audience";
    if (mbti && enneagram) {
      personaClause = `to an MBTI type ${mbti} who is also an Enneagram type ${enneagram}`;
    } else if (mbti) {
      personaClause = `to an MBTI type ${mbti}`;
    } else if (enneagram) {
      personaClause = `to an Enneagram type ${enneagram}`;
    }

    // 2. Prompt construction
    const prompt = `
You are a Christian life coach helping people reflect more deeply on God's voice.

Original question:
"${question}"

Reframe this question in a way that connects personally ${personaClause}.
Make no mention of MBTI or Enneagram labels in your question. 
Keep it simple, ≤ 15 words, and do not wrap the response in quotes or markdown.
`;

    // 3. OpenAI call
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    let reframed = completion.data.choices[0].message.content.trim();

    // 4. Strip unwanted characters
    reframed = reframed.replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, "").trim();

    console.log("✅ Reframed question:", reframed);

    return {
      statusCode: 200,
      body: JSON.stringify({ reframed }),
    };
  } catch (error) {
    console.error("🔥 OpenAI error:", error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error generating reframed question" }),
    };
  }
};
