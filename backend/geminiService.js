require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

// ======================================================
// GEMINI
// ======================================================
async function tryGemini(apiKey, prompt) {
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-3.8-flash",
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
}

// ======================================================
// OPENROUTER
// ======================================================
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

// ======================================================
// GROQ
// ======================================================
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

// ======================================================
// MAIN REPORT GENERATOR
// ======================================================
async function generateReport(activityTitle) {

  // ====================================================
  // THIS IS THE ACTUAL AI PROMPT
  // ====================================================

  const prompt = `
You are an expert National Service Scheme (NSS) report writer.

The user has provided ONLY an activity title.

ACTIVITY TITLE:
"${activityTitle}"

Your job is to generate complete NSS report CONTENT based on this activity title.

IMPORTANT RULES:

1. Understand the activity from the activity title.
2. Generate realistic, professional and meaningful NSS content.
3. The activity title is the only factual information provided.
4. DO NOT invent specific place names.
5. DO NOT mention any city, village, district, state, college, school, hospital, organization or street name.
6. DO NOT invent people's names.
7. DO NOT invent exact dates.
8. DO NOT invent exact participant numbers.
9. DO NOT invent fake statistics.
10. Do not mention a specific location.
11. Keep the report generic so that it can be used by any NSS unit.
12. Do not repeatedly repeat the activity title.
13. Do not return JSON.
14. Do not use Markdown.
15. Do not add explanations before or after the report.
16. Every section must contain proper detailed content.

======================================================
SECTION 1 - OBJECTIVE
======================================================

Return:

===OBJECTIVE===

Write a detailed objective for the NSS activity.

Include:
- purpose of the activity
- importance of the activity
- social relevance
- community benefit
- objectives of NSS volunteers
- expected impact


======================================================
SECTION 2 - ACTIVITY DETAILS
======================================================

Return:

===ACTIVITY_DETAILS===

Write detailed content about the overall NSS activity.

Include:
- planning
- preparation
- organization
- participation of NSS volunteers
- activities performed
- awareness/service activities
- teamwork
- coordination
- interaction with people where appropriate
- observations
- outcomes
- social impact

Do not mention specific places, names, dates or invented statistics.


======================================================
SECTION 3 - CHAPTER 3
======================================================

Return:

===CHAPTER_3===

Generate a SEVEN-DAY detailed activity report.

You MUST generate:

DAY 1
DAY 2
DAY 3
DAY 4
DAY 5
DAY 6
DAY 7

Each day must contain detailed content.

IMPORTANT:

- Every day must be different.
- Do not repeat the same paragraph.
- The seven days should logically progress.
- Day 1 should generally introduce the activity and cover preparation/orientation.
- Days 2-6 should cover different aspects of the main activity.
- Day 7 should cover completion, review, outcomes and final observations.
- Adapt all activities to the given activity title.
- Do not mention specific locations.
- Do not invent names.
- Do not invent dates.
- Do not invent exact participant numbers.
- Do not invent fake statistics.

The format MUST be:

DAY 1

[Detailed Day 1 content]


DAY 2

[Detailed Day 2 content]


DAY 3

[Detailed Day 3 content]


DAY 4

[Detailed Day 4 content]


DAY 5

[Detailed Day 5 content]


DAY 6

[Detailed Day 6 content]


DAY 7

[Detailed Day 7 content]


======================================================
SECTION 4 - REFLECTION NOTES
======================================================

Return:

===REFLECTION_NOTES===

Write detailed reflection notes about the complete seven-day NSS activity.

Include:
- learning
- teamwork
- leadership
- communication
- responsibility
- social awareness
- community service experience
- personal development
- lessons learned


======================================================
SECTION 5 - CONCLUSION
======================================================

Return:

===CONCLUSION===

Write a detailed conclusion for the complete NSS activity.

Include:
- importance of the activity
- overall impact
- benefits to volunteers
- benefits to the community
- skills developed
- overall outcome
- contribution to NSS objectives


======================================================
FINAL OUTPUT FORMAT
======================================================

Return ONLY these sections in EXACTLY this order:

===OBJECTIVE===

[content]


===ACTIVITY_DETAILS===

[content]


===CHAPTER_3===

[content]


===REFLECTION_NOTES===

[content]


===CONCLUSION===

[content]

Do not omit any section.
Do not leave any section empty.
`;


  // ====================================================
  // AI PROVIDERS
  // ====================================================

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


  // ====================================================
  // FALLBACK SYSTEM
  // ====================================================

  let lastError;

  for (const provider of providers) {

    try {

      console.log(`Trying ${provider.name}...`);

      const result = await provider.fn();

      console.log(`✅ ${provider.name} Success`);

      return result;

    } catch (err) {

      console.error(
        `❌ ${provider.name} Failed:`,
        err.message
      );

      lastError = err;
    }
  }

  throw lastError;
}

module.exports = {
  generateReport,
};