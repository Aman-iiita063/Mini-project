import { BrowserRouter as Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Default Home Page */}
      <Route path="/" element={<HomePage />} />

      {/* Faculty and Student Dashboards */}
      <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
    </Routes>
  );
};

export default App;
