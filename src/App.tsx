import { SetStateAction } from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  return (
    // <Router>
    <Routes>
      {/* Default Home Page */}
      <Route path="/" element={<HomePage />} />

      {/* Faculty and Student Dashboards */}
      <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
      <Route
        path="/student-dashboard"
        element={
          <StudentDashboard
            darkMode={false}
            setDarkMode={function (value: SetStateAction<boolean>): void {
              throw new Error("Function not implemented.");
            }}
          />
        }
      />

      {/* Pages inside dashboard layout */}
      {/* <Route element={<DashboardLayout />}>
          <Route path="/take-attendance" element={<TakeAttendancePage />} />
          <Route path="/student-list" element={<StudentListPage />} />
        </Route> */}

      {/* 404 Page (Optional) */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
    // </Router>
  );
};

export default App;
