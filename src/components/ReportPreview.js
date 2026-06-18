
function ReportPreview({ report }) {
  if (!report) return null;

  return (
  <div
    style={{
      position: "relative",
      marginTop: "40px",
      background: "#fff",
      borderRadius: "12px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        maxHeight: "50vh",
        overflowY: "auto",
        padding: "40px",
        fontFamily: "Times New Roman",
        lineHeight: "1.8",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Generated NSS Report
      </h1>

      <h2>Chapter 2 - Objective</h2>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {report.objective}
      </div>

      <h2>Chapter 3 - Activity Details</h2>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {report.activityDetails}
      </div>

      <h2>Chapter 4 - Reflection Notes</h2>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {report.reflectionNotes}
      </div>

      <h2>Chapter 5 - Conclusion</h2>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {report.conclusion}
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50%",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>🔒 PAY TO DOWNLOAD</h1>

      <p>
        Preview Available
      </p>

      <button
        style={{
          padding: "12px 30px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Unlock Report
      </button>
    </div>
  </div>
);}
export default ReportPreview;