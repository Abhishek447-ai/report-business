import StudentForm from "./components/StudentForm";
import PreviewPage from "./pages/PreviewPage";
import "./App.css";

function App() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <StudentForm />
    </div>
  );
}

export default App;