import PizZip from "pizzip";


export const downloadChapter1 = async (
  department,
  academicYear
) => {
  const deptMap = {
    CSE: "Dept. of CSE",
    ECE: "Dept. of ECE",
    ISE: "Dept. of ISE",
    AIDS: "Dept. of AI&DS",
    AIML: "Dept. of AI&ML",
  };

  const response = await fetch(
    "/chapter_1_for_all.docx"
  );

  const content =
    await response.arrayBuffer();

  const zip = new PizZip(content);
  

  let documentXml =
    zip.file("word/document.xml").asText();

  documentXml = documentXml.replaceAll(
    "DEPT_SHORT",
    deptMap[department] || department
  );

  documentXml = documentXml.replaceAll(
    "ACADEMIC_YEAR",
    academicYear
  );

  zip.file(
    "word/document.xml",
    documentXml
  );

  const blob = zip.generate({
    type: "blob",
  });

  return blob;
};