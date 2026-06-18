import { useRef, useEffect } from "react";
import { renderAsync } from "docx-preview";

// Render a Blob (PDF or image) into a container element.


function PreviewPage({
  report,
  handlePayment,
  generatedData,
  frontPageBlob,
  ackBlobPreview,
  downloadChapter1PreviewBlob,
  chapterBlobPreview,
}) {
  const previewRef = useRef(null);
  const ackRef = useRef(null);
  const chapterRef = useRef(null);

  useEffect(() => {

    if (frontPageBlob && previewRef.current) {
  previewRef.current.innerHTML = "";

  renderAsync(
    frontPageBlob,
    previewRef.current
  );
}
if (ackBlobPreview && ackRef.current) {
  ackRef.current.innerHTML = "";

  renderAsync(
    ackBlobPreview,
    ackRef.current
  );
}

if (
  downloadChapter1PreviewBlob &&
  chapterRef.current
) {
  chapterRef.current.innerHTML = "";

  renderAsync(
    downloadChapter1PreviewBlob,
    chapterRef.current
  );
}

if (chapterBlobPreview && chapterRef.current) {
  chapterRef.current.innerHTML = "";

  renderAsync(
    chapterBlobPreview,
    chapterRef.current
  );
}
    
  }, 
  
  [frontPageBlob]);
  if (!report) return null
  
  return (
  <div
    style={{
      position: "relative",
      minHeight: "100vh",
      background: "#fff",
      zIndex: 999999,
    }}
  >
    <div
      style={{
        position: "relative",
        height: "80vh",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "10px",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: "10px",
          zIndex: 1000,
          width: "70%",
          margin: "0 auto 10px auto",
          background: "rgba(255,248,225,0.95)",
          border: "1px solid #ffd54f",
          borderRadius: "8px",
          overflow: "hidden",
          height: "35px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            whiteSpace: "nowrap",
            animation: "scrollText 20s linear infinite",
            fontSize: "13px",
            fontWeight: "600",
            color: "#8a6d00",
          }}
        >
          ⚠️ Preview is shown in HTML format. Final downloaded Word file will have proper formatting and alignment. Need help? risingsuntechhub@gmail.com
        </div>
      </div>

      <div
        ref={previewRef}
        style={{
          transform: "scale(0.8)",
          transformOrigin: "top center",
        }}
      ></div>

      <div
        style={{
          marginTop: "-650px",
        }}
      >
        <div ref={ackRef}></div>
        <div
  style={{
    marginTop: "20px",
  }}
>
  <div ref={chapterRef}></div>
</div>
      </div>
    </div>

    <div
      style={{
        textAlign: "center",
        padding: "30px",
        background: "#fff",
      }}
    >
      <h2>Complete Payment to Download</h2>

      <button
        onClick={handlePayment}
        style={{
          padding: "12px 25px",
          fontSize: "18px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Pay ₹99 & Download
      </button>
    </div>
  </div>
)};
export default PreviewPage