"use client";

import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface Student {
  id: string;
  name: string;
  email: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    totalClasses: 50,
    attendedClasses: 45,
    attendancePercentage: 90,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    totalClasses: 50,
    attendedClasses: 48,
    attendancePercentage: 96,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    totalClasses: 50,
    attendedClasses: 40,
    attendancePercentage: 80,
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    totalClasses: 50,
    attendedClasses: 47,
    attendancePercentage: 94,
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    totalClasses: 50,
    attendedClasses: 42,
    attendancePercentage: 84,
  },
];

const StudentListPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-indigo-700 dark:to-blue-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-3xl font-bold text-white">Student List</h1>
            <div className="flex items-center">
              <Link to="/faculty-dashboard">
                <Button
                  variant="outline"
                  className="mr-4 transform hover:scale-105 transition duration-300"
                >
                  Back to Dashboard
                </Button>
              </Link>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform hover:scale-105 transition duration-300"
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
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search Input */}
          <div className="mb-6 flex items-center space-x-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2">Student ID</TableHead>
                  <TableHead className="px-4 py-2">Name</TableHead>
                  <TableHead className="px-4 py-2">Email</TableHead>
                  <TableHead className="px-4 py-2">Total Classes</TableHead>
                  <TableHead className="px-4 py-2">Attended Classes</TableHead>
                  <TableHead className="px-4 py-2">Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <TableCell className="px-4 py-2">{student.id}</TableCell>
                    <TableCell className="px-4 py-2">{student.name}</TableCell>
                    <TableCell className="px-4 py-2">{student.email}</TableCell>
                    <TableCell className="px-4 py-2">
                      {student.totalClasses}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {student.attendedClasses}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {student.attendancePercentage}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentListPage;
