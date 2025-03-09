import type React from "react";
import { useEffect } from "react";
import Header from "../components/Header";
import AttendanceTable from "../components/AttendanceTable";
import InsightCards from "../components/InsightCards";
import MarkAttendanceButton from "../components/MarkAttendanceButton";

interface DashboardProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const StudentDashboard: React.FC<DashboardProps> = ({
  darkMode,
  setDarkMode,
}) => {
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`transition-all duration-300 ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Navbar is handled by the Header component */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Insight Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InsightCards />
          </div>

          {/* Mark Attendance Button */}
          <div className="mb-8">
            <MarkAttendanceButton />
          </div>

          {/* Attendance Table Container */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <AttendanceTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
