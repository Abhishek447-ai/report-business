import PizZip from "pizzip";



export const generateTemplate = async ({
  activityTitle,
  studentName,
  usn,
  department,
  academicYear,
  guideName,
  designation,
  programOfficer,
  hod,
  principal,
}) => {
  

  const deptMap = {
  CSE: {
  DEPARTMENT:
    "Computer Science and Engineering",

  DEPT:
    "Dept. of CSE",

  DEPT_SHORT:
    "Department. of CSE",

    DEPARTMENT_NAME:
      "COMPUTER SCIENCE AND ENGINEERING"
},

  ECE: {
    DEPARTMENT:
      "ELECTRONICS AND COMMUNICATION ENGINEERING",

    DEPT:
      "Dept. of ECE",

    DEPT_SHORT:
      "Department of ECE",
  },

  ISE: {
    DEPARTMENT:
      "INFORMATION SCIENCE AND ENGINEERING",

    DEPT:
      "Dept. of ISE",

    DEPT_SHORT:
      "Department of ISE",
  },

  AIDS: {
  DEPARTMENT:
    "Artificial Intelligence and Data Science",

  DEPARTMENT_NAME:
    "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",

  DEPT:
    "Dept. of AI&DS",

  DEPT_NAME:
    "Dept. of AI&DS",

  DEPT_SHORT:
    "Department of AI&DS",
},

  AIML: {
    DEPARTMENT:
      "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",

    DEPT:
      "Dept. of AI&ML",

    DEPT_SHORT:
      "Department of AI&ML",
  },
};

  const deptData =
    deptMap[department];

  try {
    const response = await fetch("/test.docx");

    const content = await response.arrayBuffer();

    const zip = new PizZip(content);

    const escapeXml = (text) => {
      
  if (!text) return "";

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};
 
    let documentXml = zip.file("word/document.xml").asText();
    documentXml = documentXml.replaceAll("ACTIVITY_TITLE",escapeXml(activityTitle));
    documentXml = documentXml.replaceAll("STUDENT_NAME",escapeXml(studentName));
    documentXml = documentXml.replaceAll("USN", usn);
    documentXml = documentXml.replaceAll("DEPARTMENT_NAME",escapeXml(deptData.DEPARTMENT_NAME));
    documentXml = documentXml.replaceAll(
  "DEPARTMENT",
  escapeXml(deptData.DEPARTMENT)
);
    documentXml = documentXml.replaceAll("DEPT_NAME",escapeXml(deptData.DEPT_NAME));
    documentXml = documentXml.replaceAll("GUIDE_NAME",escapeXml(guideName));
    documentXml = documentXml.replaceAll(
  "DESIGNATION",
  escapeXml(designation)
);
    documentXml = documentXml.replaceAll(
  "PROGRAM_OFFICER_NAME",
  escapeXml(programOfficer)
);
    documentXml = documentXml.replaceAll(
  "XYZHOD123",
  escapeXml(hod)
);
    documentXml = documentXml.replaceAll(
  "PRINCIPLE_NAME",
  escapeXml(principal)
);
    documentXml = documentXml.replaceAll("ACADEMIC_YEAR", academicYear);
    documentXml = documentXml.replaceAll(
  "DEPT",
  escapeXml(deptData.DEPT)
);
    documentXml = documentXml.replaceAll("DEPT_SHORT",escapeXml(deptData.DEPT_SHORT));
    

    zip.file("word/document.xml", documentXml);

    const blob = zip.generate({ type: "blob" });

 return blob;
 console.log("TEMPLATE BLOB =", blob);
  } catch (error) {
    console.log("DOCXTEMPLATER ERROR", error);

    // Try to show detailed docxtemplater errors if available
    if (error.properties?.errors) {
      console.log(error.properties);
      alert(
        error.properties.errors
          .map((e) => e.properties?.explanation)
          .join("\n")
      );
    } else {
      console.log("DOCX ERROR:", error);
      alert(JSON.stringify(error, null, 2));
    }
    return;
  }
};