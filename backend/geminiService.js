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
  // NSS AI PROMPT
  // ====================================================

  const prompt = `
You are an expert National Service Scheme (NSS) report writer.

The user provides ONLY an activity title.

ACTIVITY TITLE:
"${activityTitle}"

Your task is to generate complete, professional and detailed NSS report content based ONLY on the activity title.

======================================================
IMPORTANT GENERAL RULES
======================================================

1. Understand the activity from the activity title.
2. Generate realistic, professional and meaningful NSS content.
3. The activity title is the only factual information provided by the user.
4. DO NOT invent specific place names.
5. DO NOT mention any city, village, district, state, college, school, hospital, organization, street or other specific location.
6. DO NOT invent people's names.
7. DO NOT invent exact dates.
8. DO NOT invent exact participant numbers.
9. DO NOT invent fake statistics.
10. DO NOT mention a specific location.
11. Keep the report generic so it can be used by any NSS unit.
12. Do not repeatedly repeat the activity title.
13. Do not generate images.
14. Do not generate image links.
15. Do not generate Markdown image syntax.
16. Do not generate image descriptions.
17. Do not return JSON.
18. Do not use Markdown.
19. Do not add explanations before or after the report.
20. Every section must contain meaningful and detailed content.

======================================================
SECTION 1 - OBJECTIVE
======================================================

Return exactly:

===OBJECTIVE===

Write a detailed objective for the NSS activity.

Include:

- purpose of the activity
- importance of the activity
- social relevance
- community benefit
- objectives of NSS volunteers
- expected positive impact


======================================================
SECTION 2 - ACTIVITY DETAILS
======================================================

Return exactly:

===ACTIVITY_DETAILS===

Write detailed content describing the overall NSS activity.

Include:

- planning
- preparation
- organization
- participation of NSS volunteers
- activities performed
- awareness or service activities
- teamwork
- coordination
- interaction with people where appropriate
- observations
- outcomes
- social impact

Do not mention:

- specific places
- specific institutions
- people's names
- exact dates
- exact participant numbers
- fake statistics


======================================================
SECTION 3 - CHAPTER 3
======================================================

Return exactly:

===CHAPTER_3===

Generate a detailed SEVEN-DAY activity report.

You MUST generate exactly these seven headings:

DAY 1
DAY 2
DAY 3
DAY 4
DAY 5
DAY 6
DAY 7

IMPORTANT DAY RULES:

1. Every day must contain detailed content.
2. Every day must be different.
3. Do not repeat the same paragraph between days.
4. The seven days should logically progress.
5. Day 1 should generally cover introduction, orientation, planning and preparation.
6. Days 2 to 6 should cover different aspects of the main activity.
7. Day 7 should cover completion, review, outcomes and final observations.
8. Adapt the activities to the provided activity title.
9. Do not mention specific locations.
10. Do not invent names.
11. Do not invent exact dates.
12. Do not invent exact participant numbers.
13. Do not invent fake statistics.
14. Do not create image content.
15. Do not insert image links or image tags.
16. Do not add extra headings such as "Morning", "Afternoon", "Evening" unless genuinely required by the activity.
17. Keep the day heading on its own line.
18. Write the content immediately after the corresponding day heading.

The exact structure MUST be:

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


The DOCX generation system will handle document formatting.

The DOCX system will:

- make DAY 1 through DAY 7 headings BOLD
- place the provided image/template after each day's content
- place THREE image placeholders/images after DAY 1 content
- place THREE image placeholders/images after DAY 2 content
- place THREE image placeholders/images after DAY 3 content
- place THREE image placeholders/images after DAY 4 content
- place THREE image placeholders/images after DAY 5 content
- place THREE image placeholders/images after DAY 6 content
- place THREE image placeholders/images after DAY 7 content

Therefore, YOU MUST NOT generate the images yourself.

Only generate the text content for each day.


======================================================
SECTION 4 - REFLECTION NOTES
======================================================

Return exactly:

===REFLECTION_NOTES===

Write detailed reflection notes about the complete seven-day NSS activity.

Include:

- learning gained by volunteers
- teamwork
- leadership
- communication
- responsibility
- social awareness
- community service experience
- personal development
- lessons learned
- overall experience


======================================================
SECTION 5 - CONCLUSION
======================================================

Return exactly:

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

[objective content]


===ACTIVITY_DETAILS===

[activity details content]


===CHAPTER_3===

DAY 1

[Day 1 content]


DAY 2

[Day 2 content]


DAY 3

[Day 3 content]


DAY 4

[Day 4 content]


DAY 5

[Day 5 content]


DAY 6

[Day 6 content]


DAY 7

[Day 7 content]


===REFLECTION_NOTES===

[reflection content]


===CONCLUSION===

[conclusion content]

Do not omit any section.
Do not leave any section empty.
Do not add any text outside these sections.
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

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  generateReport,
};