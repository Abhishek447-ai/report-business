require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

// ---------------- GEMINI ----------------
async function tryGemini(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ---------------- OPENROUTER ----------------
async function tryOpenRouter(apiKey) {
  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  const response = await client.chat.completions.create({
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}

// ---------------- GROQ ----------------
async function tryGroq(apiKey, prompt) {
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}

// ---------------- MAIN ----------------
async function generateReport(prompt) {
  const providers = [
    {
      name: "Gemini",
      fn: () => tryGemini(prompt),
    },
    {
      name: "OpenRouter 1",
      fn: () => tryOpenRouter(process.env.OPENROUTER100, prompt),
    },
    {
      name: "OpenRouter 2",
      fn: () => tryOpenRouter(process.env.OPENROUTERNSS1, prompt),
    },
    {
      name: "Groq 1",
      fn: () => tryGroq(process.env.GROQ_API_KEY_1, prompt),
    },
    {
      name: "Groq 2",
      fn: () => tryGroq(process.env.GROQ_API_KEY_2, prompt),
    },
  ];

  let lastError;

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}...`);

      const result = await provider.fn();

      console.log(`${provider.name} Success`);

      return result;
    } catch (err) {
      console.error(`${provider.name} Failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError;
}

module.exports = {
  generateReport,
};