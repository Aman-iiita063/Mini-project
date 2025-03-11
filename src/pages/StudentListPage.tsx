"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
import {
  MoonIcon,
  SunIcon,
  UserGroupIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  FilmIcon,
  AcademicCapIcon,
  MapIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { FilterIcon, MailIcon } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  department?: string;
  rollNumber?: string;
  year?: string;
  status?: "Good" | "Average" | "Poor";
  trend?: "up" | "down" | "stable";
  lastAttendance?: string;
}

// Enhanced mock data with additional properties
const mockStudents: Student[] = [
  {
    id: "IEC2022061",
    name: "Baljit Singh",
    email: "john@example.com",
    totalClasses: 50,
    attendedClasses: 45,
    attendancePercentage: 90,
    department: "Computer Science",
    rollNumber: "CS-001",
    year: "2nd Year",
    status: "Good",
    trend: "up",
    lastAttendance: "Today, 9:30 AM",
  },
  {
    id: "IEC2022062",
    name: "Animesh Singh",
    email: "jane@example.com",
    totalClasses: 50,
    attendedClasses: 48,
    attendancePercentage: 96,
    department: "Information Technology",
    rollNumber: "IT-045",
    year: "2nd Year",
    status: "Good",
    trend: "stable",
    lastAttendance: "Today, 11:00 AM",
  },
  {
    id: "IEC2022063",
    name: "Aman Kumar",
    email: "bob@example.com",
    totalClasses: 50,
    attendedClasses: 40,
    attendancePercentage: 80,
    department: "ECE",
    rollNumber: "63",
    year: "2nd Year",
    status: "Average",
    trend: "down",
    lastAttendance: "Yesterday, 2:15 PM",
  },
  {
    id: "IEC2022066",
    name: "Chennugari Karthik reddy",
    email: "alice@example.com",
    totalClasses: 50,
    attendedClasses: 47,
    attendancePercentage: 94,
    department: "Electronics",
    rollNumber: "66",
    year: "2nd Year",
    status: "Good",
    trend: "stable",
    lastAttendance: "Today, 9:30 AM",
  },
  {
    id: "IEC2022069",
    name: "Ankit Vehicle",
    email: "charlie@example.com",
    totalClasses: 50,
    attendedClasses: 42,
    attendancePercentage: 84,
    department: "ECE",
    rollNumber: "69",
    year: "2nd Year",
    status: "Average",
    trend: "down",
    lastAttendance: "Yesterday, 10:45 AM",
  },
  {
    id: "IEC2022117",
    name: "Akshay Waghmare",
    email: "eva@example.com",
    totalClasses: 50,
    attendedClasses: 33,
    attendancePercentage: 66,
    department: "Information Technology",
    rollNumber: "IT-056",
    year: "2nd Year",
    status: "Poor",
    trend: "down",
    lastAttendance: "Last week, Friday",
  },
  {
    id: "IEC2022077",
    name: "Jot Singh Bindra",
    email: "michael@example.com",
    totalClasses: 50,
    attendedClasses: 46,
    attendancePercentage: 92,
    department: "Computer Science",
    rollNumber: "CS-078",
    year: "2nd Year",
    status: "Good",
    trend: "up",
    lastAttendance: "Today, 9:30 AM",
  },
  {
    id: "IEC2022068",
    name: "Aryan Gautam",
    email: "sophia@example.com",
    totalClasses: 50,
    attendedClasses: 32,
    attendancePercentage: 64,
    department: "Electronics",
    rollNumber: "EC-067",
    year: "2nd Year",
    status: "Poor",
    trend: "down",
    lastAttendance: "Last week, Wednesday",
  },
];

const StudentListPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | "all">(
    "all"
  );
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [isExporting, setIsExporting] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [darkMode]);

  // Export data function
  const exportData = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      console.log("Exporting data:", filteredStudents);
      setIsExporting(false);
      // In a real app, you would trigger a download here
    }, 1500);
  };

  // Request sort
  const requestSort = (key: keyof Student) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get unique departments for filter
  const departments = useMemo(() => {
    return [
      ...new Set(
        mockStudents.map((student) => student.department).filter(Boolean)
      ),
    ] as string[];
  }, []);

  // Filter students based on search term, department and status
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch =
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.department &&
          student.department.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDepartment =
        selectedDepartment === "all" ||
        student.department === selectedDepartment;

      const matchesStatus =
        selectedStatus === "all" || student.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus]);

  // Sort students if needed
  const sortedStudents = useMemo(() => {
    let result = [...filteredStudents];
    if (sortConfig) {
      result.sort((a, b) => {
        if (
          a[sortConfig.key] === undefined ||
          b[sortConfig.key] === undefined
        ) {
          return 0;
        }

        if (
          sortConfig &&
          a[sortConfig.key] !== undefined &&
          b[sortConfig.key] !== undefined
        ) {
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];

          // Ensure both values are not null or undefined before comparing
          if (aValue != null && bValue != null) {
            if (aValue < bValue) {
              return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
              return sortConfig.direction === "ascending" ? 1 : -1;
            }
          }
        }
        return 0;
      });
    }
    return result;
  }, [filteredStudents, sortConfig]);

  // Summary statistics
  const totalStudents = sortedStudents.length;
  const goodAttendance = sortedStudents.filter(
    (s) => s.attendancePercentage >= 85
  ).length;
  const averageAttendance = sortedStudents.filter(
    (s) => s.attendancePercentage >= 75 && s.attendancePercentage < 85
  ).length;
  const poorAttendance = sortedStudents.filter(
    (s) => s.attendancePercentage < 75
  ).length;

  // Average attendance percentage
  const averagePercentage =
    sortedStudents.length > 0
      ? sortedStudents.reduce(
          (sum, student) => sum + student.attendancePercentage,
          0
        ) / sortedStudents.length
      : 0;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const navbarVariants = {
    initial: { y: -100 },
    animate: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + i * 0.05,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
    hover: {
      backgroundColor: darkMode
        ? "rgba(55, 65, 81, 0.7)"
        : "rgba(243, 244, 246, 0.7)",
      transition: { duration: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.1 + i * 0.05,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  // Function to get status color
  const getStatusColor = (status?: "Good" | "Average" | "Poor") => {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Average":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Poor":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Function to get trend icon
  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "stable":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get current date for header
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`transition-all duration-500 ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        {/* Background gradient elements */}
        <div className="fixed inset-0 overflow-hidden opacity-30 dark:opacity-20 pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#6D28D9]/20 filter blur-[100px]" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-purple-500/20 filter blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 filter blur-[60px]" />
        </div>

        {/* Navbar */}
        <motion.nav
          ref={navRef}
          className="relative bg-white dark:bg-gray-800 shadow-md backdrop-blur-sm z-10"
          variants={navbarVariants}
          initial="initial"
          animate="animate"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <motion.h1
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6D28D9] to-purple-500 dark:from-purple-400 dark:to-indigo-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Student List
                </motion.h1>
                <div className="ml-6 flex items-center space-x-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {currentDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link to="/faculty-dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="border border-[#6D28D9]/20 hover:border-[#6D28D9]/80 text-[#6D28D9] hover:text-purple-600 hover:bg-purple-50/50 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
                    >
                      Back to Dashboard
                    </Button>
                  </motion.div>
                </Link>
                <motion.button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-400"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: darkMode
                      ? "rgba(55, 65, 81, 0.9)"
                      : "rgba(243, 244, 246, 0.9)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {darkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto py-8 px-4 z-10">
          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
                  <UserGroupIcon className="h-6 w-6 text-[#6D28D9] dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Students
                  </div>
                  <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                    {totalStudents}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Good Attendance
                  </div>
                  <div className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
                    {goodAttendance}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Average Attendance
                  </div>
                  <div className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {averageAttendance}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600 dark:text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Poor Attendance
                  </div>
                  <div className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
                    {poorAttendance}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Controls & Filters */}
          <motion.div
            className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            {/* Left side: Search and filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Search input */}
              <motion.div
                className="relative w-full sm:w-64"
                whileHover={{ scale: 1.02 }}
              >
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>

              {/* Department filter */}
              <motion.div
                className="relative w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
              >
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value as any)}
                  className="appearance-none w-full pl-10 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <FilterIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Status filter */}
              <motion.div
                className="relative w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
              >
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="appearance-none w-full pl-10 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200"
                >
                  <option value="all">All Status</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
                <CheckCircleIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </motion.div>
            </div>

            {/* Right side: View toggles and export */}
            <div className="flex items-center space-x-3">
              {/* View mode toggle */}
              <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <motion.button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md ${
                    viewMode === "table"
                      ? "bg-white dark:bg-gray-800 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("cards")}
                  className={`p-1.5 rounded-md ${
                    viewMode === "cards"
                      ? "bg-white dark:bg-gray-800 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </motion.button>
              </div>

              {/* Export button */}
              <motion.button
                onClick={exportData}
                disabled={isExporting}
                className={`flex items-center space-x-1 px-3 py-2 bg-[#6D28D9] dark:bg-purple-600 text-white rounded-lg text-sm font-medium ${
                  isExporting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-purple-700 dark:hover:bg-purple-700"
                }`}
                whileHover={isExporting ? {} : { scale: 1.05 }}
                whileTap={isExporting ? {} : { scale: 0.95 }}
              >
                {isExporting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    <span>Export</span>
                  </>
                )}
              </motion.button>

              {/* Refresh button */}
              <motion.button
                className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <ArrowPathIcon className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Table View */}
          {viewMode === "table" && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-8"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  Student List
                </h3>
                <span className="text-sm text-gray-500">
                  Showing {sortedStudents.length} of {mockStudents.length}{" "}
                  students
                </span>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/70">
                      <TableHead
                        className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        onClick={() => requestSort("id")}
                      >
                        <div className="flex items-center">
                          Student ID
                          {sortConfig?.key === "id" && (
                            <span className="ml-1">
                              {sortConfig.direction === "ascending" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        onClick={() => requestSort("name")}
                      >
                        <div className="flex items-center">
                          Name
                          {sortConfig?.key === "name" && (
                            <span className="ml-1">
                              {sortConfig.direction === "ascending" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        onClick={() => requestSort("department")}
                      >
                        <div className="flex items-center">
                          Department
                          {sortConfig?.key === "department" && (
                            <span className="ml-1">
                              {sortConfig.direction === "ascending" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        onClick={() => requestSort("email")}
                      >
                        <div className="flex items-center">
                          Email
                          {sortConfig?.key === "email" && (
                            <span className="ml-1">
                              {sortConfig.direction === "ascending" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        onClick={() => requestSort("attendancePercentage")}
                      >
                        <div className="flex items-center">
                          Attendance %
                          {sortConfig?.key === "attendancePercentage" && (
                            <span className="ml-1">
                              {sortConfig.direction === "ascending" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                        Classes
                      </TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {sortedStudents.map((student, index) => (
                        <motion.tr
                          key={student.id}
                          className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                          custom={index}
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          exit={{ opacity: 0, x: -10 }}
                        >
                          <TableCell className="font-mono text-xs text-gray-600 dark:text-gray-300">
                            {student.id}
                          </TableCell>
                          <TableCell className="font-medium text-gray-800 dark:text-white">
                            {student.name}
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-300">
                            {student.department}
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-300">
                            {student.email}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`text-sm font-medium ${
                                  student.attendancePercentage >= 85
                                    ? "text-green-600 dark:text-green-400"
                                    : student.attendancePercentage >= 75
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {student.attendancePercentage}%
                              </div>
                              <div className="flex items-center">
                                {getTrendIcon(student.trend)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {student.attendedClasses} / {student.totalClasses}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                student.status
                              )}`}
                            >
                              {student.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <motion.button
                                className="p-1 text-[#6D28D9] hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </motion.button>
                              <motion.button
                                className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </motion.button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {/* Card View */}
          {viewMode === "cards" && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <AnimatePresence>
                {sortedStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div
                      className={`h-2 w-full ${
                        student.attendancePercentage >= 85
                          ? "bg-green-500"
                          : student.attendancePercentage >= 75
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                            {student.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {student.id}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            student.status
                          )}`}
                        >
                          {student.status}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                            {student.department}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {student.year}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <MailIcon className="h-4 w-4 mr-1" />
                            {student.email}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Attendance
                          </span>
                          <span className="text-sm font-medium flex items-center">
                            <span
                              className={`${
                                student.attendancePercentage >= 85
                                  ? "text-green-600 dark:text-green-400"
                                  : student.attendancePercentage >= 75
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {student.attendancePercentage}%
                            </span>
                            <span className="ml-1">
                              {getTrendIcon(student.trend)}
                            </span>
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.attendancePercentage >= 85
                                ? "bg-green-500"
                                : student.attendancePercentage >= 75
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${student.attendancePercentage}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {student.attendedClasses} of {student.totalClasses}{" "}
                          classes attended
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last attendance: {student.lastAttendance}
                        </div>
                        <motion.button
                          className="px-3 py-1 bg-[#6D28D9] dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-700 text-white text-xs rounded"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Overall Statistics */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                Overall Statistics
              </h3>
              <div className="mt-2 md:mt-0 text-sm font-medium text-gray-600 dark:text-gray-400">
                Average attendance: {averagePercentage.toFixed(1)}%
              </div>
            </div>

            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#6D28D9] dark:bg-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${averagePercentage}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Good Attendance (≥85%)
                  </h4>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {goodAttendance}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(goodAttendance / totalStudents) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {((goodAttendance / totalStudents) * 100).toFixed(1)}% of
                  total students
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Average Attendance (75-84%)
                  </h4>
                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                    {averageAttendance}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-yellow-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(averageAttendance / totalStudents) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {((averageAttendance / totalStudents) * 100).toFixed(1)}% of
                  total students
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Poor Attendance (&lt;75%)
                  </h4>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    {poorAttendance}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(poorAttendance / totalStudents) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {((poorAttendance / totalStudents) * 100).toFixed(1)}% of
                  total students
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="relative max-w-7xl mx-auto py-6 px-4 border-t border-gray-200 dark:border-gray-800 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Current Semester: Spring 2025
              </span>
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Last updated: Today, 15:30
              </span>
            </div>
            <div className="flex space-x-4">
              <motion.button
                className="text-[#6D28D9] hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Add Student
              </motion.button>
              <motion.button
                className="text-[#6D28D9] hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                Generate Report
              </motion.button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StudentListPage;
