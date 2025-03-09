import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  present: boolean;
}

const mockStudents: Student[] = [
  { id: "1", name: "John Doe", present: false },
  { id: "2", name: "Jane Smith", present: false },
  { id: "3", name: "Bob Johnson", present: false },
  { id: "4", name: "Alice Brown", present: false },
  { id: "5", name: "Charlie Davis", present: false },
];

const TakeAttendancePage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);

  const toggleAttendance = (id: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, present: true }))
    );
  };

  const markAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, present: false }))
    );
  };

  const submitAttendance = () => {
    console.log("Submitting attendance:", students);
    toast.success("Attendance has been successfully recorded.");
  };

  // Attendance Summary
  const totalStudents = students.length;
  const presentCount = students.filter((s) => s.present).length;
  const absentCount = totalStudents - presentCount;
  const attendancePercentage = (presentCount / totalStudents) * 100;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-indigo-700 dark:to-blue-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-3xl font-bold text-white">Take Attendance</h1>
            <Link to="/faculty-dashboard">
              <Button
                variant="outline"
                className="hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-105 transition duration-300"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Total Students
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {totalStudents}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Present
              </div>
              <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {presentCount}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Absent
              </div>
              <div className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {absentCount}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-4 flex justify-between items-center">
            <Button
              onClick={markAllPresent}
              className="transform hover:scale-105 transition duration-300"
            >
              Mark All Present
            </Button>
            <Button
              onClick={markAllAbsent}
              variant="outline"
              className="transform hover:scale-105 transition duration-300"
            >
              Mark All Absent
            </Button>
          </div>

          {/* Attendance Table */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 overflow-x-auto mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Present</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={student.present}
                        onChange={() => toggleAttendance(student.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Submit and Attendance Percentage */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Attendance: {attendancePercentage.toFixed(2)}%
            </div>
            <Button
              onClick={submitAttendance}
              className="transform hover:scale-105 transition duration-300 mt-4 sm:mt-0"
            >
              Submit Attendance
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TakeAttendancePage;
