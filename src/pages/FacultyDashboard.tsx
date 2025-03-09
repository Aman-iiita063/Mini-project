"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";

interface Student {
  id: string;
  name: string;
  status: "Present" | "Absent";
}

const mockStudents: Student[] = [
  { id: "IEC2022061", name: "John Doe", status: "Present" },
  { id: "IEC2022062", name: "Jane Smith", status: "Absent" },
  { id: "IEC2022063", name: "Bob Johnson", status: "Present" },
  { id: "IEC2022064", name: "Alice Brown", status: "Present" },
  { id: "IEC2022065", name: "Charlie Davis", status: "Absent" },
];

const FacultyDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = filteredStudents.length;
  const totalPresent = filteredStudents.filter(
    (student) => student.status === "Present"
  ).length;
  const totalAbsent = totalStudents - totalPresent;
  const overallPercentage =
    totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0;

  return (
    <div className={`transition-all duration-300 ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-indigo-700 dark:to-blue-700 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-3xl font-bold text-white">
                Faculty Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <Link to="/take-attendance">
                  <Button
                    variant="outline"
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-105 transition duration-300"
                  >
                    Take Attendance
                  </Button>
                </Link>
                <Link to="/student-list">
                  <Button
                    variant="outline"
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-105 transition duration-300"
                  >
                    Student List
                  </Button>
                </Link>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  {darkMode ? (
                    <SunIcon className="h-6 w-6" />
                  ) : (
                    <MoonIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4">
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Attendance Summary
              </h2>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-4 sm:mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </header>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Present
              </div>
              <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {totalPresent}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Absent
              </div>
              <div className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {totalAbsent}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Overall Attendance
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {overallPercentage.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
