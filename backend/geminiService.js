require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

// ---------------- GEMINI ----------------
async function tryGemini(apiKey, prompt) {
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-3.8-flash",
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
}

// ---------------- OPENROUTER ----------------
async function tryOpenRouter(apiKey, prompt) {
  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  const response = await client.chat.completions.create({
    model: "google/gemini-3.8-flash",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 12000,
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
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 12000,
  });

  return response.choices[0].message.content;
}

// ---------------- MAIN ----------------
async function generateReport(prompt) {
  const providers = [
    // ---------------- GEMINI ACCOUNT 1 ----------------
    {
      name: "Gemini 1",
      fn: () =>
        tryGemini(
          process.env.gemini_okali_100,
          prompt
        ),
    },

    // ---------------- GEMINI ACCOUNT 2 ----------------
    {
      name: "Gemini 2",
      fn: () =>
        tryGemini(
          process.env.gemini_nss1,
          prompt
        ),
    },

    // ---------------- OPENROUTER ACCOUNT 1 ----------------
    {
      name: "OpenRouter 1",
      fn: () =>
        tryOpenRouter(
          process.env.openrouter_okali_100,
          prompt
        ),
    },

    // ---------------- OPENROUTER ACCOUNT 2 ----------------
    {
      name: "OpenRouter 2",
      fn: () =>
        tryOpenRouter(
          process.env.openrouter_nss_1,
          prompt
        ),
    },

    // ---------------- GROQ ACCOUNT 1 ----------------
    {
      name: "Groq 1",
      fn: () =>
        tryGroq(
          process.env.groq_okali_100,
          prompt
        ),
    },

    // ---------------- GROQ ACCOUNT 2 ----------------
    {
      name: "Groq 2",
      fn: () =>
        tryGroq(
          process.env.groq_nss_1,
          prompt
        ),
    },
  ];

  let lastError;

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}...`);

      const result = await provider.fn();

      console.log(`✅ ${provider.name} Success`);

      return result;
    } catch (err) {
      console.error(`❌ ${provider.name} Failed:`, err.message);

      lastError = err;
    }
  }

  throw lastError;
}

module.exports = {
  generateReport,
};