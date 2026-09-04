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

Generate a COMPLETE, PROFESSIONAL, DETAILED NSS REPORT based ONLY on the activity title.

======================================================
IMPORTANT CONTENT REQUIREMENTS
======================================================

The generated content will be inserted directly into a Microsoft Word NSS report template.

Therefore, DO NOT generate short summaries.

The content MUST be sufficiently detailed to properly fill the available Word document pages.

Write in formal academic/report-writing English.

Use complete paragraphs with good sentence structure.

Do not use bullet points unless specifically requested.

Do not make the content artificially repetitive just to increase length.

Expand each section with meaningful details, explanations, observations, activities, learning outcomes and social relevance.

======================================================
FACTUAL RESTRICTIONS
======================================================

The ONLY factual information provided is:

"${activityTitle}"

Therefore:

1. Base the entire report on this activity title.
2. DO NOT invent specific place names.
3. DO NOT mention any city name.
4. DO NOT mention any village name.
5. DO NOT mention any district name.
6. DO NOT mention any state name.
7. DO NOT mention any college/school/institution name.
8. DO NOT mention any hospital or organization name.
9. DO NOT invent people's names.
10. DO NOT invent exact dates.
11. DO NOT invent exact participant numbers.
12. DO NOT invent fake statistics.
13. DO NOT invent specific addresses.
14. DO NOT invent claims that require factual evidence.
15. Keep the report generic enough to be used by any NSS unit.
16. Do not repeatedly repeat the activity title.

======================================================
SECTION 1 - OBJECTIVE
======================================================

Return:

===OBJECTIVE===

Write a VERY DETAILED objective section.

TARGET LENGTH:
Approximately 500-700 words.

The objective should be long enough to occupy approximately one full Word page depending on the template formatting.

Explain in detail:

- purpose of the activity
- background and importance
- social relevance
- community relevance
- awareness created through the activity
- role of NSS volunteers
- responsibilities of volunteers
- expected benefits
- expected social impact
- educational value
- development of social responsibility
- connection with NSS objectives

Do NOT simply list objectives.

Write connected, professional paragraphs.

======================================================
SECTION 2 - ACTIVITY DETAILS
======================================================

Return:

===ACTIVITY_DETAILS===

Write a VERY DETAILED overall description of the activity.

TARGET LENGTH:
Approximately 700-1000 words.

The section should be detailed enough to fill approximately 1 to 1.5 Word pages.

Explain:

- preparation
- planning
- organization
- volunteer responsibilities
- coordination
- materials and preparation where appropriate
- execution of the activity
- awareness/service activities
- participation
- interaction with people where appropriate
- teamwork
- communication
- observations
- challenges in a general sense
- how volunteers responded
- outcomes
- social impact
- educational value
- overall experience

Write detailed paragraphs rather than short statements.

Do not mention specific locations, names, dates, exact numbers or fake statistics.

======================================================
SECTION 3 - CHAPTER 3
======================================================

Return:



Generate a COMPLETE SEVEN-DAY NSS ACTIVITY REPORT.

The report MUST contain exactly:

DAY 1
DAY 2
DAY 3
DAY 4
DAY 5
DAY 6
DAY 7

======================================================
DAY CONTENT LENGTH
======================================================

Each day MUST contain approximately 350-500 words.

This is VERY IMPORTANT.

Do NOT generate only a short paragraph for each day.

Each day should contain enough meaningful content to occupy a substantial portion of a Word page.

The content should naturally explain:

- activities conducted
- preparation or execution
- volunteer participation
- responsibilities
- teamwork
- communication
- awareness/service work
- observations
- interaction where appropriate
- learning
- outcomes

Each day MUST be different.

Do not repeat the same paragraph or simply change a few words.

The seven days should logically progress.

DAY 1:
Focus on introduction, orientation, planning, preparation and beginning of the activity.

DAY 2:
Begin the main activity and describe the work performed.

DAY 3:
Continue the activity with a different aspect or approach.

DAY 4:
Describe another important component of the activity.

DAY 5:
Describe further implementation, participation and service/awareness work.

DAY 6:
Describe continued activity, observations, improvement and learning.

DAY 7:
Describe completion, final activities, review, outcomes, learning and overall observations.

Adapt these naturally according to the activity title.

======================================================
DAY FORMAT
======================================================

Use EXACTLY this format:

DAY 1

[350-500 words of detailed content]


DAY 2

[350-500 words of detailed content]


DAY 3

[350-500 words of detailed content]


DAY 4

[350-500 words of detailed content]


DAY 5

[350-500 words of detailed content]


DAY 6

[350-500 words of detailed content]


DAY 7

[350-500 words of detailed content]

IMPORTANT:

- Keep DAY 1, DAY 2, etc. on their own line.
- Do not add extra text to the day heading.
- Do not use "Day One", use exactly "DAY 1".
- Do not add Markdown bold symbols.
- The Word generation system will make the DAY headings bold automatically.
- Do not generate images.
- Do not generate image links.
- Do not generate image tags.
- Do not generate image descriptions.

The Word template system will insert THREE images after each day's content.

Therefore, generate ONLY the written content.

======================================================
SECTION 4 - REFLECTION NOTES
======================================================

Return:

===REFLECTION_NOTES===

Write a VERY DETAILED reflection section.

TARGET LENGTH:
Approximately 400-430 words.

This section should be long enough to fill almost an entire Word page or more depending on the template formatting.

Do NOT write a short generic reflection.

Discuss in detailed paragraphs:

- overall experience
- what NSS volunteers learned
- practical learning
- social awareness
- sense of responsibility
- teamwork
- leadership
- communication
- cooperation
- discipline
- problem-solving
- confidence
- interaction with people
- understanding of community needs
- importance of service
- personal development
- values developed
- lessons learned from the activity
- how the activity changed or strengthened the volunteers' understanding
- overall reflection on the seven-day experience

Write naturally and meaningfully.

Do not repeat the same points unnecessarily.

Do not mention specific places, names, dates or fake statistics.

======================================================
SECTION 5 - CONCLUSION
======================================================

Return:

===CONCLUSION===

Write a VERY DETAILED conclusion.

TARGET LENGTH:
Approximately 400-430 words.

The conclusion must be long enough to fill almost an entire Word page or more depending on the template formatting.

Do NOT write a short 1-2 paragraph conclusion.

Discuss in detailed paragraphs:

- overall importance of the activity
- achievement of the activity objectives
- contribution to society/community
- benefits to NSS volunteers
- awareness created
- skills developed
- teamwork
- leadership
- responsibility
- social consciousness
- practical learning
- overall experience
- outcomes of the seven-day activity
- long-term value of such activities
- contribution to NSS values
- importance of continuing community-oriented activities
- final overall assessment

End with a strong professional concluding paragraph.

Do not mention specific locations, names, exact dates or fake statistics.

======================================================
WRITING STYLE
======================================================

Use:

- formal academic English
- professional report style
- detailed paragraphs
- natural transitions
- meaningful explanations
- varied sentence structure
- clear descriptions
- realistic NSS terminology

Avoid:

- one-line answers
- short summaries
- excessive repetition
- filler sentences
- fake statistics
- fake names
- fake locations
- fake dates
- Markdown
- bullet-point lists
- image instructions

======================================================
FINAL OUTPUT
======================================================

Return ONLY these five sections in EXACTLY this order:

===OBJECTIVE===

[400-430 words]


===ACTIVITY_DETAILS===

[700-1000 words]


===CHAPTER_3===

DAY 1

[350-500 words]


DAY 2

[350-500 words]


DAY 3

[350-500 words]


DAY 4

[350-500 words]


DAY 5

[350-500 words]


DAY 6

[350-500 words]


DAY 7

[350-500 words]


===REFLECTION_NOTES===

[600-800 words]


===CONCLUSION===

[600-800 words]

DO NOT omit any section.

DO NOT leave any section empty.

DO NOT add anything before the first section.

DO NOT add anything after the conclusion.

Generate the complete report now.
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