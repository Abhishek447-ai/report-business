export const parseReport = (report) => {
  return {
    objective:
      report
        .split("===OBJECTIVE===")[1]
        ?.split("===ACTIVITY_DETAILS===")[0]
        ?.trim() || "",

    activityDetails:
      report
        .split("===ACTIVITY_DETAILS===")[1]
        ?.split("===REFLECTION_NOTES===")[0]
        ?.trim() || "",

    reflectionNotes:
      report
        .split("===REFLECTION_NOTES===")[1]
        ?.split("===CONCLUSION===")[0]
        ?.trim() || "",

    conclusion:
      report
        .split("===CONCLUSION===")[1]
        ?.trim() || "",
  };
};