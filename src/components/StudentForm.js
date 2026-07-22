  import { useState } from "react";
  import { generateNSSReport } from "../services/geminiService";
  import { saveAs } from "file-saver";
  import JSZip from "jszip";
  import { generateWordDocument } from "../utils/wordGenerator";
  import {generateTemplate} from "../utils/templateGenerator";
  import {generateTemplate2} from "../utils/templateGenerator2";
  import TextField from "@mui/material/TextField";
  
  import MenuItem from "@mui/material/MenuItem";
  import Select from "@mui/material/Select";
  import FormControl from "@mui/material/FormControl";
  import InputLabel from "@mui/material/InputLabel";
  import Card from "@mui/material/Card";
  import CardContent from "@mui/material/CardContent";
  import { downloadChapter1 }from "../utils/downloadChapter1";
 
  import PreviewPage from "../pages/PreviewPage";



  function StudentForm() {
    const [selectedService, setSelectedService] =
    useState("");
    
    const [activityTitle, setActivityTitle] =
      useState("");

    const [studentCount, setStudentCount] =
      useState("");

    const [students, setStudents] =
      useState([]);
      const [generatedData, setGeneratedData] =
    useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [frontPageBlob, setFrontPageBlob] = useState(null);
    const [ackBlobPreview, setAckBlobPreview] = useState(null);

    

    const [studentEmail, setStudentEmail] =
    useState("");

    const [report, setReport] =
      useState("");

    const [loading, setLoading] =
      useState(false);
      const [progress, setProgress] = useState("");

    const [department, setDepartment] =
      useState("");

    const [academicYear, setAcademicYear] =
      useState("");

    const [guideName, setGuideName] =
      useState("");

    const [designation, setDesignation] =
      useState("");

    const [programOfficer, setProgramOfficer] =
      useState("");

    const [hod, setHod] =
      useState("");

    const [principal, setPrincipal] =
      useState("");
    const [generatedFiles, setGeneratedFiles] =
    useState(null);

    const [studentFiles, setStudentFiles] =
    useState([]);

  

    const handleCountChange = (e) => {
    const count = Number(e.target.value);

    setStudentCount(count);

    const newStudents = Array.from(
      { length: count },
      () => ({
        name: "",
        usn: "",
      })
    );

    setStudents(newStudents);
  };

    const handleStudentChange = (
      index,
      field,
      value
    ) => {
      const updatedStudents = [...students];

      updatedStudents[index][field] = value;

      setStudents(updatedStudents);
    };
  const generateReport = async () => {
    try {
      if (
        Number(studentCount) < 8 ||
        Number(studentCount) > 14
      ) {
        alert(
          "Minimum 8 and Maximum 14 Students are allowed."
        );
        return;
      }
      if (!activityTitle.trim()) {
    alert("Enter Activity Title");
    return;
  }

      if (!department) {
        alert("Select Department");
        return;
      }

      if (!academicYear) {
        alert("Select Academic Year");
        return;
      }

      const checkPrefix = (name) => {
        return (
          name.trim().startsWith("Dr.") ||
          name.trim().startsWith("Prof.")
        );
      };

      if (!checkPrefix(guideName)) {
        alert(
          "Guide Name must start with Dr. or Prof."
        );
        return;
      }

      if (!checkPrefix(programOfficer)) {
        alert(
          "Program Officer Name must start with Dr. or Prof."
        );
        return;
      }

      if (!checkPrefix(hod)) {
        alert(
          "HOD Name must start with Dr. or Prof."
        );
        return;
      }

      if (!checkPrefix(principal)) {
        alert(
          "Principal Name must start with Dr. or Prof."
        );
        return;
      }if (!studentEmail.trim()) {
    alert("Enter Student Email");
    return;
  }

      setLoading(true);

    const response =
    await generateNSSReport(
      activityTitle
    );
      await fetch("https://report-business.onrender.com/api/submissions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    activityTitle,
    studentEmail,
    studentCount: Number(studentCount),
    studentNames: students.map((student) => student.name),
  }),
});
      const {
        objective,
        activityDetails,
        reflectionNotes,
        conclusion,
      } = response;

  setProgress(
    "Generating AI Report..."
  );



  setProgress(
    "Downloading Common Report..."
  );
  let ackBlob = null;
  let firstFrontBlob = null;
  const allStudentFiles = [];
  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    setProgress(
      `Generating Student Files ${i + 1}/${students.length}`
    );

    const frontBlob = await generateTemplate({
      activityTitle,
      studentName: student?.name || "",
      usn: student?.usn || "",
      department,
      academicYear,
      guideName,
      designation,
      programOfficer,
      hod,
      principal,
    });
  

  if (i === 0 && frontBlob) {
    firstFrontBlob = frontBlob;
    setFrontPageBlob(frontBlob);
  }

  ackBlob = await generateTemplate2({
      activityTitle,
      studentName: student?.name || "",
      usn: student?.usn || "",
      department,
      academicYear,
      guideName,
      designation,
      programOfficer,
      hod,
      principal,
    });
    
    if (i === 0) {
    setAckBlobPreview(ackBlob);
  }

  allStudentFiles.push({
    studentName: student?.name || "",
    usn: student?.usn || "",
    frontBlob,
    ackBlob,
  });
  }
  const reportBlob =
    await generateWordDocument(
      activityTitle,
      {
        objective,
        activityDetails,
        reflectionNotes,
        conclusion,
      },
      department,
      academicYear
    );

  const chapter1Blob =
    await downloadChapter1(
      department,
      academicYear
    ); 
  
      setGeneratedFiles({
      frontBlob: firstFrontBlob,
      ackBlob,
      reportBlob,
      chapter1Blob,
    });
    setStudentFiles(allStudentFiles);

  setReport({
    objective,
    activityDetails,
    reflectionNotes,
    conclusion,
  });
  setGeneratedData({
    reportData: {
      objective,
      activityDetails,
      reflectionNotes,
      conclusion,
    },
    activityTitle,
    department,
    academicYear,
  });
  setShowPreview(true);


  setProgress(
    "Preview Ready 🔒"
  );


    } catch (error) {
      console.error("Gemini Error:", error);
      alert("Failed to generate report");
    } finally {
    setLoading(false);

    setTimeout(() => {
      setProgress("");
    }, 5000);
  }
  };
    const loadRazorpay = () => {
  return new Promise((resolve) => {
    resolve(true);
  });
};

const handlePayment = async () => {
  const res = await loadRazorpay();

  if (!res) {
    alert("Razorpay SDK Failed");
    return;
  }

  const orderData = await fetch(
  "https://report-business.onrender.com/create-order",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  reportCount: Number(studentCount),
}),
  }
);

  const order = await orderData.json();

  const options = {
    key: "rzp_live_TG1XZrcjeAxVEe",

    amount: order.amount,

    currency: order.currency,

    name: "Rising Sun Tech Hub",

    description: "NSS Report Generation",

    order_id: order.id,

    handler: async function (response) {
      alert("Payment Successful ✅");

      await downloadWord();
    },

    theme: {
      color: "#3399cc",
    },
  };

  const paymentObject =
    new window.Razorpay(options);

  paymentObject.open();
};
    const downloadWord = async () => {
    
    try{
      if (!generatedFiles) {
    alert("Files not generated");
    return;
  }

    if(
    Number(studentCount) < 8 ||
    Number(studentCount) > 14
  ) {
    alert(
      "Minimum 8 and Maximum 14 Students are allowed."
    );
    return;
  }
 
  
  console.log(studentFiles);
    const zip = new JSZip();
    studentFiles.forEach((student) => {
  zip.file(
    `${student.usn}_Front_Page.docx`,
    student.frontBlob
  );

  zip.file(
    `${student.usn}_Acknowledgement.docx`,
    student.ackBlob
  );
});

zip.file(
  "Chapter_1_Introduction.docx",
  generatedFiles.chapter1Blob
);

zip.file(
  "NSS_Report.docx",
  generatedFiles.reportBlob
);
const zipBlob = await zip.generateAsync({
  type: "blob",
});
console.log(Object.keys(zip.files));
alert(`ZIP contains ${Object.keys(zip.files).length} files`);

saveAs(
  zipBlob,
  "NSS_Report.zip"
);
      
    } catch (error) {
      console.error(error);
      alert("Word generation failed");
    }
  };
  if (!selectedService) {
    return (
      <div
        style={{
    minHeight: "100vh",
    background: "#F7F4EF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  padding: "20px",
  boxSizing: "border-box",
    color: "white",
    position: "relative",
  }}
      >
      <img
    src="/bg-DTj3Nnfc.png"
    alt="logo"
    style={{
      position: "absolute",

      width:
    window.innerWidth < 768
      ? "700px"
      : "1200px",

      opacity: 0.10,

      zIndex: 0,

      top: "50%",
      left: "50%",

      transform: "translate(-50%, -50%)",

      pointerEvents: "none",
    }}
  />


        
            <div
    style={{
      position: "absolute",
      top: "20px",
      left: "20px",
      zIndex: 100,
    }}
  >
    <img
    src="companylogo_transparant.png"
    alt="Rising Sun Tech Hub"
    style={{
      width: "140px",
      height: "auto",
      transform: "translate(-72px, -55px)",
    }}
  />
  
  </div>
      

        <div
          style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    width: "100%",
    maxWidth: "1400px",
    marginTop: "40px",
  }}
        >
      
          {[
    { name: "NSS", active: true },

    { name: "AICTE", active: false },

    { name: "SCR", active: false },

    { name: "MINI PROJECT", active: false },

    { name: "MAJOR PROJECT", active: false },

    { name: "BASE PAPER", active: false },
  ].map((item) => (
            <div
              key={item.name}
              onClick={() =>
                item.active
                  ? setSelectedService("NSS")
                  : alert(
                      "Coming Soon. Stay Tuned 🚀"
                    )
              }
            style={{
    padding: "35px",
    borderRadius: "24px",

    background: "transparent",

    border: "1px solid rgba(0,0,0,0.25)",

    boxShadow: "none",

    textAlign: "center",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "22px",

    color: item.active ? "#111827" : "#777",

    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "translateY(-4px)";
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0px)";
  }}
            >
            <>
    {item.name}

    {!item.active && (
      <div
        style={{
          marginTop: "10px",
          fontSize: "14px",
          color: "#666",
        }}
      >
      🔒 Coming Soon
      </div>
    )}
  </>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          <h2
    style={{
    fontSize: "clamp(32px, 6vw, 52px)",
      fontWeight: "900",
      letterSpacing: "8px",
      color: "#0f172a",
      marginBottom: "15px",
    }}
  >
    OUR PRODUCTS
  </h2>

          <p
    style={{
      color: "#64748b",
    fontSize: "clamp(14px, 2vw, 20px)",
      fontWeight: "500",
    }}
  >
    Innovative AI Solutions for Students,
    Faculty & Educational Institutions
  </p>
  <a
    href="mailto:risingsuntechhub@gmail.com"
    style={{
      display: "inline-block",
      marginTop: "20px",
      padding: "10px 20px",
      borderRadius: "12px",
      background: "red",
      color: "white",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "14px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}
  >
    ✉ Contact Us
  </a>

        </div>

      </div>
      
    );
  }


    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#F7F4EF",}}
      >
        <div
    style={{
      position: "absolute",
      width: "350px",
      height: "350px",
      borderRadius: "50%",
      background: "#4f46e5",
      filter: "blur(140px)",
      top: "-100px",
      left: "-100px",
      opacity: 0.4,
    }}
  />
  <div
    style={{
      position: "absolute",
      top: "20px",
      left: "30px",
      zIndex: 100,
    }}
  >

  </div>


  <div
    style={{
      position: "absolute",
      width: "350px",
      height: "350px",
      borderRadius: "50%",
      background: "#06b6d4",
      filter: "blur(140px)",
      bottom: "-100px",
      right: "-100px",
      opacity: 0.4,
      
    }}
  />




      <Card
    sx={{
      width: 900,

      maxWidth: "95%",

      padding: "30px",

      background: "rgba(255,255,255,0.65)",

      backdropFilter: "blur(20px)",

      border: "1px solid rgba(255,255,255,0.3)",

      boxShadow:
        "0 20px 50px rgba(0,0,0,0.15)",

      borderRadius: "24px",

      position: "relative",
    }}
  >
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      marginBottom: "20px",
    }}
  >
    

    <span
      style={{
        fontSize: "14px",
        fontWeight: "700",
        letterSpacing: "2px",
        color: "#64748b",
        textTransform: "uppercase",
      }}
    >
      "Report Generator" A Product of Rising SUN Tech Hub Company
    </span>
  </div>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
    }}
  >
  <img
    src="/sun.png"
    alt="Rotating Sun"
    className="rotating-sun"
    style={{
      width: "100px",
      height: "100px",
    }}
  />
  </div>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      marginBottom: "20px",
    }}
  >
  

    <span
      style={{
        fontSize: "14px",
        fontWeight: "600",
        color: "#64748b",
        letterSpacing: "1px",
      }}
    >
    
    </span>
  </div>
        <CardContent>
          <h2
    style={{
      fontSize: "40px",
      fontWeight: "700",
      color: "#111111",
      marginBottom: "30px",
    }}
  >
    AI NSS Report Generator
  </h2>

          <br />
        

          <TextField
    fullWidth
    label="Activity Title"
    value={activityTitle}
    onChange={(e) =>
      setActivityTitle(e.target.value)
    }
    margin="normal"
  />
          <label>"(Appears on Cover Page & Certificate)"</label>

          <br />
          <br />

          

        
      <FormControl fullWidth margin="normal">
    <InputLabel>Department</InputLabel>

    <Select
      value={department}
      onChange={(e) =>
        setDepartment(e.target.value)
      }
    >
      <MenuItem value="CSE">CSE</MenuItem>
      <MenuItem value="ISE">ISE</MenuItem>
      <MenuItem value="ECE">ECE</MenuItem>
      <MenuItem value="AIDS">AI&DS</MenuItem>
      <MenuItem value="AIML">AI&ML</MenuItem>
    </Select>
  </FormControl>

    <br /><br />

    <FormControl fullWidth margin="normal">
    <InputLabel>
      Academic Year
    </InputLabel>

    <Select
      value={academicYear}
      label="Academic Year"
      onChange={(e) =>
        setAcademicYear(e.target.value)
      }
    >
      <MenuItem value="2023-2024">
    2023-2024
  </MenuItem>

  <MenuItem value="2024-2025">
    2024-2025
  </MenuItem>

  <MenuItem value="2025-2026">
    2025-2026
  </MenuItem>

  <MenuItem value="2026-2027">
    2026-2027
  </MenuItem>

  <MenuItem value="2027-2028">
    2027-2028
  </MenuItem>

  <MenuItem value="2028-2029">
    2028-2029
  </MenuItem>

  <MenuItem value="2029-2030">
    2029-2030
  </MenuItem>

  <MenuItem value="2030-2031">
    2030-2031
  </MenuItem>

  <MenuItem value="2031-2032">
    2031-2032
  </MenuItem>

  <MenuItem value="2032-2033">
    2032-2033
  </MenuItem>
    </Select>
  </FormControl>
    <br /><br />
  <TextField
    fullWidth
    label="Guide Name"
    placeholder="Eg: Dr. Suchitra Devi"
    value={guideName}
    onChange={(e) =>
      setGuideName(e.target.value)
    }
  />



  <br /><br />

  <TextField
    fullWidth
    label="Guide Designation"
    placeholder="Eg: Assistant Professor"
    value={designation}
    onChange={(e) =>
      setDesignation(e.target.value)
    }
    margin="normal"
  />
  <br /><br />



  <TextField
    fullWidth
    label="Program Officer Name"
    placeholder="Eg: Dr. K. Balakrishna"
    value={programOfficer}
    onChange={(e) =>
      setProgramOfficer(e.target.value)
    }
    margin="normal"
  />

  <br /><br />



  <TextField
    fullWidth
    label="HOD Name"
    placeholder="Eg: Dr. T. John Peter"
    value={hod}
    onChange={(e) =>
      setHod(e.target.value)
    }
    margin="normal"
  />

  <br /><br />



  <TextField
    fullWidth
    label="Principal Name"
    placeholder="Eg: Dr. H. G. Chandrakanth"
    value={principal}
    onChange={(e) =>
      setPrincipal(e.target.value)
    }
    margin="normal"
  />

  <br /><br />
  <TextField
    fullWidth
    label="Any One Student Email"
    placeholder="Eg: student@gmail.com"
    value={studentEmail}
    onChange={(e) =>
      setStudentEmail(e.target.value)
    }
    margin="normal"
  />

  <br /><br />


  <FormControl fullWidth margin="normal">
    <InputLabel>
      Number of Students
    </InputLabel>

    <Select
      value={studentCount}
      label="Number of Students"
      onChange={handleCountChange}
    >
      <MenuItem value={8}>8 students</MenuItem>
      <MenuItem value={9}>9 students</MenuItem>
      <MenuItem value={10}>10 students</MenuItem>
      <MenuItem value={11}>11 students</MenuItem>
      <MenuItem value={12}>12 students</MenuItem>
      <MenuItem value={13}>13 students</MenuItem>
      <MenuItem value={14}>14 students</MenuItem>
    </Select>
  </FormControl>

  <br /><br />

  <br /><br />

          {students.map((student, index) => (
    <div
      key={index}
      style={{
      background: "#F7F4EF",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "20px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        style={{
          marginBottom: "15px",
          color: "#111827",
        }}
      >
        Student {index + 1}
      </h3>

      <TextField
        fullWidth
        label="Student Name"
        value={student.name}
        onChange={(e) =>
          handleStudentChange(
            index,
            "name",
            e.target.value
          )
        }
        margin="normal"
      />

      <TextField
        fullWidth
        label="USN"
        value={student.usn}
        onChange={(e) =>
          handleStudentChange(
            index,
            "usn",
            e.target.value
          )
        }
        margin="normal"
      />
    </div>
  ))}

              <br />
              <br />
          

          <button
            onClick={generateReport}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: `
  radial-gradient(circle at top left, #4f46e5 0%, transparent 30%),
  radial-gradient(circle at top right, #06b6d4 0%, transparent 30%),
  radial-gradient(circle at bottom left, #9333ea 0%, transparent 30%),
  linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)
  `,
              color: "white",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            
            {loading
              ? "Generating Report..."
              : "Generate Report"}
          </button>
          {progress && (
    <div
      style={{
        marginTop: "10px",
        fontWeight: "bold",
        color: "#2563eb",
      }}
    >
      {progress}
    </div>
  )}

          <br />
          <br />
        
          {showPreview && (
  <PreviewPage
  report={report}
  generatedData={generatedData}
  frontPageBlob={frontPageBlob}
  ackBlobPreview={ackBlobPreview}
  downloadChapter1PreviewBlob={generatedFiles?.chapter1Blob}
  handlePayment={handlePayment}
  
/>
  )}
        {false && report && (
    <button
      onClick={downloadWord}
      style={{
        marginTop: "20px",
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "12px",
        background: "#16a34a",
        color: "white",
        fontSize: "18px",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      Download Final Report
    </button>
  )}

          <br />

          
        </CardContent>
      </Card>
      </div>
    );
  }

  export default StudentForm;