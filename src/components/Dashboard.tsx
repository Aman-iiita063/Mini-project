import type React from "react";
import Header from "./Header";
import AttendanceTable from "./AttendanceTable";
import InsightCards from "./InsightCards";
import MarkAttendanceButton from "./MarkAttendanceButton";

interface DashboardProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode, setDarkMode }) => {
  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InsightCards />
          </div>
          <div className="mb-8">
            <MarkAttendanceButton />
          </div>
          <AttendanceTable />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
