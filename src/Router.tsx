import { Routes, Route } from "react-router-dom";
import TakeAttendancePage from "./pages/TakeAttendancePage";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentList from "./pages/StudentListPage";
import HomePage from "./pages/HomePage";
import { SetStateAction } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* Default route */}
      {/* Faculty Dashboard with Nested Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/faculty-dashboard" element={<FacultyDashboard />}>
        <Route path="take-attendance" element={<TakeAttendancePage />} />
        <Route path="student-list" element={<StudentList />} />
      </Route>
      {/* Separate Routes */}
      <Route path="/take-attendance" element={<TakeAttendancePage />} />
      <Route path="/student-list" element={<StudentList />} />
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
    </Routes>
  );
};

export default AppRouter;
