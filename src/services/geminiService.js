const extractSections = (content) => {
  const objective =
    content.split("===OBJECTIVE===")[1]?.split("===ACTIVITY_DETAILS===")[0]?.trim() || "";

  const activityDetails =
    content.split("===ACTIVITY_DETAILS===")[1]?.split("===REFLECTION_NOTES===")[0]?.trim() || "";

  const reflectionNotes =
    content.split("===REFLECTION_NOTES===")[1]?.split("===CONCLUSION===")[0]?.trim() || "";

  const conclusion =
    content.split("===CONCLUSION===")[1]?.trim() || "";

  return {
    objective,
    activityDetails,
    reflectionNotes,
    conclusion,
  };
};

export const generateNSSReport = async (activityTitle) => {
  const response = await fetch(
  "https://report-business.onrender.com/api/generate-report",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: activityTitle,
    }),
  }
);

  if (!response.ok) {
    throw new Error("Failed to generate report.");
  }

  const data = await response.json();

  return extractSections(data.report);
};