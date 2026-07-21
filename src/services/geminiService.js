import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
  { type: "groq", key: process.env.REACT_APP_GROQ_API_KEY_2 },
  { type: "groq", key: process.env.REACT_APP_GROQ_API_KEY_1 },
  { type: "openrouter", key: process.env.REACT_APP_OPENROUTERNSS1 },
  { type: "openrouter", key: process.env.REACT_APP_OPENROUTER100 },
  { type: "gemini", key: process.env.REACT_APP_GEMINI_API_KEY },
  
  
].filter(Boolean);

const generateWithGemini = async (prompt) => {
  const genAI = new GoogleGenerativeAI(
    process.env.REACT_APP_GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(
    prompt
  );

  return result.response.text();
};

const generateWithGroq = async (prompt, apiKey) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
       max_tokens: 8000,

    }),
  });

  if (!response.ok) {
   const errorText = await response.text();

throw new Error(
  `Groq API Error ${response.status}: ${errorText}`
);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const generateWithOpenRouter = async (prompt, apiKey) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       model: "google/gemma-3-27b-it:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenRouter API Error ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
const extractSections = (content) => {
  const objective =
    content
      .split("===OBJECTIVE===")[1]
      ?.split("===ACTIVITY_DETAILS===")[0]
      ?.trim() || "";

  const activityDetails =
    content
      .split("===ACTIVITY_DETAILS===")[1]
      ?.split("===REFLECTION_NOTES===")[0]
      ?.trim() || "";

  const reflectionNotes =
    content
      .split("===REFLECTION_NOTES===")[1]
      ?.split("===CONCLUSION===")[0]
      ?.trim() || "";

  const conclusion =
    content
      .split("===CONCLUSION===")[1]
      ?.trim() || "";

  return {
    objective,
    activityDetails,
    reflectionNotes,
    conclusion,
  };
};
export const generateNSSReport = async (activityTitle) => {

  

  const prompt = `
Generate a detailed VTU NSS Report.
The report must look like a real VTU NSS report written by a student.
The content must be original, professional, formal, and ready for direct submission.

Activity Title: ${activityTitle}

IMPORTANT:

Chapter 2 - Objective:
Minimum 300 words.

Chapter 3 - Activity Details:
Minimum 900-1200 words.

STRICT RULES:

1. Generate EXACTLY 7 days only.
2. Never generate Day 8 or beyond.
3. Every day must have a unique activity description.
4. Each day's content must contain 150-250 words.
5. After each day's content, insert exactly three lines:

[PASTE YOUR IMAGE HERE]

[PASTE YOUR IMAGE HERE]

[PASTE YOUR IMAGE HERE]

6. Do not skip any day from Day 1 to Day 7.
7. Do not merge multiple days together.
8. Follow this exact structure:

Image Placeholder Rules:

1. After every day's activity content insert exactly one placeholder.

[PASTE YOUR IMAGE HERE]

2. Do not generate image captions.
3. Do not generate figure numbers.
4. Do not describe the image.
5. Do not assume what the image contains.
6. Users may replace the placeholder with one or multiple photos.
7. The placeholder must appear on a separate line.
8. Generate only:

[PASTE YOUR IMAGE HERE]

Day 1:
(Content)

[PASTE YOUR IMAGE HERE]

Day 2:
(Content)

[PASTE YOUR IMAGE HERE]

Day 3:
(Content)

[PASTE YOUR IMAGE HERE]

Day 4:
(Content)

[PASTE YOUR IMAGE HERE]

Day 5:
(Content)

[PASTE YOUR IMAGE HERE]

Day 6:
(Content)

[PASTE YOUR IMAGE HERE]

Day 7:
(Content)

[PASTE YOUR IMAGE HERE]

9. Ensure all activities are relevant to the selected Activity Title.
10. Use formal VTU NSS report language.
11. Do not generate tables unless explicitly required.
12. Do not generate figure captions.
13. Do not generate photo descriptions.
14. Generate only the placeholder:

[PASTE YOUR IMAGE HERE]

15. Never use markdown symbols.
16. Never use bullets for day descriptions.
17. Never leave any day empty.
18. The complete Chapter 3 must read like an actual NSS activity conducted over 7 days.

Chapter 4 - Reflection Notes:
Minimum 400 words.

STRICT RULES:

1. Generate professional VTU NSS reflection content.
2. Include exactly these sections:

Outcomes of the Activity:

Challenges Faced:

Skills Developed:

Community Impact:

Personal Learning Experience:

3. Each section must have its own heading.
4. Leave one blank line before every heading.
5. Each section must contain meaningful content.
6. Total content should be at least 400 words.
7. Do not use bullet points unless necessary.
8. Do not use markdown symbols.
9. Do not generate image placeholders.
10. Use formal academic language.
11. Ensure reflection content matches the selected Activity Title.
12. Do not repeat Chapter 3 content.
13. Focus on learning, outcomes, impact and experience.
14. Make the report suitable for direct VTU submission.

Example Structure:

Outcomes of the Activity:

(content)

Challenges Faced:

(content)

Skills Developed:

(content)

Community Impact:

(content)

Personal Learning Experience:

(content)

Chapter 5 - Conclusion:
Minimum 300 words.

STRICT RULES:

1. Generate a formal academic conclusion suitable for VTU NSS report submission.
2. Conclusion must summarize the entire activity from Day 1 to Day 7.
3. Mention the significance of the activity to society and participants.
4. Mention knowledge gained, skills developed, and community impact.
5. Maintain a positive and professional tone.
6. Ensure the conclusion is directly related to the selected Activity Title.
7. Do not introduce new activities or information.
8. Do not repeat entire paragraphs from previous chapters.
9. Do not use bullet points.
10. Do not use markdown symbols.
11. Write in paragraph format only.
12. Minimum 300 words.
13. Maximum 500 words.
14. Make it suitable for direct insertion into a Word document.
15. End with a strong concluding statement about social responsibility, community service, and personal growth.

Example Structure:

Paragraph 1:
Summary of the activity and its purpose.

Paragraph 2:
Learning outcomes, skills gained, and challenges overcome.

Paragraph 3:
Community impact and overall significance.

Paragraph 4:
Final concluding statement on NSS values, leadership, and social responsibility.

Output Format (STRICTLY FOLLOW):

===OBJECTIVE===
(Chapter 2 Content Only)

===ACTIVITY_DETAILS===
(Chapter 3 Content Only)

===REFLECTION_NOTES===
(Chapter 4 Content Only)

===CONCLUSION===
(Chapter 5 Content Only)

RULES:

1. Do not generate Chapter numbers.
2. Do not generate chapter titles.
3. Do not generate page numbers.
4. Do not generate headers or footers.
5. Do not generate student names.
6. Do not generate USN.
7. Do not generate department names.
8. Do not generate college name.
9. Do not generate acknowledgements.
10. Do not generate table of contents.
11. Generate only the content for the four sections above.
12. The output must start with:
   ===OBJECTIVE===
13. The output must end with:
   ===CONCLUSION===
14. Do not output any text before ===OBJECTIVE===.
15. Do not output any text after the conclusion.
16. Never output explanations, notes, comments, or AI messages.
17. Output only report content.

FINAL VALIDATION RULES (MANDATORY):

Before generating the report, verify all the following:

✓ Objective section exists.
✓ Activity Details section exists.
✓ Reflection Notes section exists.
✓ Conclusion section exists.
✓ Day 1 exists.
✓ Day 2 exists.
✓ Day 3 exists.
✓ Day 4 exists.
✓ Day 5 exists.
✓ Day 6 exists.
✓ Day 7 exists.
✓ Exactly 7 image placeholders exist.
✓ No Day 8 or later exists.
✓ No markdown symbols exist.
✓ No AI explanations exist.
✓ No notes to the user exist.
✓ No warnings exist.
✓ No extra headings exist.
✓ Output follows the required format exactly.
IMPORTANT:

Never generate specific place names, village names, school names,
hospital names, organization names, road names, or geographic locations.

Use generic terms such as:

Location Details Rules:

1. Never generate real place names.
2. Never generate village names.
3. Never generate school names.
4. Never generate hospital names.
5. Never generate city names.
6. Never generate district names.
7. Never generate state names.
8. Never generate postal codes.
9. Never generate addresses.
10. Never generate any specific location information.

Instead use generic descriptions such as:

"The activity was conducted at the selected location."
"The chosen venue provided a suitable environment for the activity."
"The participants actively cooperated throughout the program."
"The location was well suited for conducting the NSS activity."

The report should remain generic so that users can edit and insert their own location details later if required.

Generate only the final cleaned report.

`;


let lastError = null;

for (const api of API_KEYS) {
  try {
    let aiResponse;

    if (api.type === "openrouter")
      aiResponse = await generateWithOpenRouter(prompt, api.key);

    if (api.type === "gemini")
      aiResponse = await generateWithGemini(prompt);

    if (api.type === "groq")
      aiResponse = await generateWithGroq(prompt, api.key);

    return extractSections(aiResponse);

  } catch (error) {
    console.log(`${api.type} failed`, error.message);
    lastError = error;
  }
}

throw lastError;

};
 