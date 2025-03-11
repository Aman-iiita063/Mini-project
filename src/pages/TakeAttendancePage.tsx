"use client";
import { useState, useEffect, useRef } from "react";
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
import {
  MoonIcon,
  SunIcon,
  UserGroupIcon,
  UserIcon,
  UserMinusIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FilmIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { FilterIcon } from "lucide-react";

interface Student {
  id: string;
  name: string;
  present: boolean;
  department?: string;
  rollNumber?: string;
  email?: string;
  avatar?: string;
  lastAttendance?: string;
  attendanceRate?: number;
}

// Enhanced mock data with additional properties
const mockStudents: Student[] = [
  {
    id: "IEC2022061",
    name: "John Doe",
    present: false,
    department: "Computer Science",
    rollNumber: "CS-001",
    email: "john.doe@example.com",
    lastAttendance: "Yesterday, 10:15 AM",
    attendanceRate: 92,
  },
  {
    id: "IEC2022062",
    name: "Jane Smith",
    present: false,
    department: "Information Technology",
    rollNumber: "IT-045",
    email: "jane.smith@example.com",
    lastAttendance: "Yesterday, 2:30 PM",
    attendanceRate: 85,
  },
  {
    id: "IEC2022063",
    name: "Bob Johnson",
    present: false,
    department: "Computer Science",
    rollNumber: "CS-023",
    email: "bob.johnson@example.com",
    lastAttendance: "Last Week, Friday",
    attendanceRate: 78,
  },
  {
    id: "IEC2022064",
    name: "Alice Brown",
    present: false,
    department: "Electronics",
    rollNumber: "EC-012",
    email: "alice.brown@example.com",
    lastAttendance: "Yesterday, 9:30 AM",
    attendanceRate: 95,
  },
  {
    id: "IEC2022065",
    name: "Charlie Davis",
    present: false,
    department: "Mechanical",
    rollNumber: "ME-034",
    email: "charlie.davis@example.com",
    lastAttendance: "Last Week, Thursday",
    attendanceRate: 65,
  },
  {
    id: "IEC2022066",
    name: "Eva Wilson",
    present: false,
    department: "Information Technology",
    rollNumber: "IT-056",
    email: "eva.wilson@example.com",
    lastAttendance: "Yesterday, 11:45 AM",
    attendanceRate: 90,
  },
  {
    id: "IEC2022067",
    name: "Michael Clark",
    present: false,
    department: "Computer Science",
    rollNumber: "CS-078",
    email: "michael.clark@example.com",
    lastAttendance: "Yesterday, 3:15 PM",
    attendanceRate: 88,
  },
  {
    id: "IEC2022068",
    name: "Sophia Martinez",
    present: false,
    department: "Electronics",
    rollNumber: "EC-067",
    email: "sophia.martinez@example.com",
    lastAttendance: "Last Week, Wednesday",
    attendanceRate: 70,
  },
];

const TakeAttendancePage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | "all">(
    "all"
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [courseDetails, setCourseDetails] = useState({
    courseName: "Data Structures (CS301)",
    time: "9:30 AM - 11:00 AM",
    location: "Room 202",
    professorName: "Dr. Emily Wilson",
  });
  const [showModal, setShowModal] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);

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
    toast.success("All students marked present");
  };

  const markAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, present: false }))
    );
    toast.success("All students marked absent");
  };

  const submitAttendance = () => {
    setSaveInProgress(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Submitting attendance:", students);
      toast.success("Attendance has been successfully recorded.");
      setSaveInProgress(false);
      setShowModal(true);
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

  // Filter students based on search term and department
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.department &&
        student.department.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDepartment =
      selectedDepartment === "all" || student.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [
    ...new Set(students.map((student) => student.department).filter(Boolean)),
  ];

  // Sort students if needed
  const sortedStudents = [...filteredStudents];
  if (sortConfig) {
    sortedStudents.sort((a, b) => {
      if (a[sortConfig.key] === undefined || b[sortConfig.key] === undefined) {
        return 0;
      }

      if ((a[sortConfig.key] ?? "") < (b[sortConfig.key] ?? "")) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if ((a[sortConfig.key] ?? "") > (b[sortConfig.key] ?? "")) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  // Attendance summary
  const totalStudents = filteredStudents.length;
  const presentCount = filteredStudents.filter((s) => s.present).length;
  const absentCount = totalStudents - presentCount;
  const attendancePercentage =
    totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

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
                  Take Attendance
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
          {/* Course Information Card */}
          <motion.div
            className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {courseDetails.courseName}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {courseDetails.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {courseDetails.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {courseDetails.professorName}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200"
                    />
                    <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <motion.button
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span>Refresh</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
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
                    Present
                  </div>
                  <div className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
                    {presentCount}
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
                  <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Absent
                  </div>
                  <div className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
                    {absentCount}
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
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
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
            </div>

            {/* Right side: Action buttons */}
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={markAllPresent}
                className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Mark All Present
              </motion.button>
              <motion.button
                onClick={markAllAbsent}
                className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Mark All Absent
              </motion.button>
            </div>
          </motion.div>

          {/* Attendance Table */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                Student Attendance
              </h3>
              <span className="text-sm text-gray-500">
                Showing {filteredStudents.length} of {students.length} students
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
                      onClick={() => requestSort("lastAttendance")}
                    >
                      <div className="flex items-center">
                        Last Attendance
                        {sortConfig?.key === "lastAttendance" && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      onClick={() => requestSort("attendanceRate")}
                    >
                      <div className="flex items-center">
                        Rate
                        {sortConfig?.key === "attendanceRate" && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                      Present
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
                          {student.lastAttendance}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`text-xs font-medium ${
                                (student.attendanceRate || 0) >= 85
                                  ? "text-green-600 dark:text-green-400"
                                  : (student.attendanceRate || 0) >= 75
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {student.attendanceRate}%
                            </div>
                            <div className="ml-2 w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  (student.attendanceRate || 0) >= 85
                                    ? "bg-green-500"
                                    : (student.attendanceRate || 0) >= 75
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${student.attendanceRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <label className="inline-flex items-center space-x-2 cursor-pointer">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={student.present}
                                onChange={() => toggleAttendance(student.id)}
                                className="sr-only"
                              />
                              <div
                                className={`block w-12 h-6 rounded-full transition-colors duration-300 ${
                                  student.present
                                    ? "bg-green-400"
                                    : "bg-gray-300 dark:bg-gray-600"
                                }`}
                              ></div>
                              <div
                                className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 transform ${
                                  student.present
                                    ? "translate-x-6 bg-white"
                                    : "bg-white"
                                }`}
                              ></div>
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                student.present
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {student.present ? "Present" : "Absent"}
                            </span>
                          </label>
                        </TableCell>
                        <TableCell>
                          <motion.button
                            onClick={() => toggleAttendance(student.id)}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              student.present
                                ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {student.present ? "Mark Absent" : "Mark Present"}
                          </motion.button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </motion.div>

          {/* Attendance Progress */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                Attendance Progress
              </h3>
              <div className="mt-2 sm:mt-0 text-sm font-medium text-gray-600 dark:text-gray-400">
                {attendancePercentage.toFixed(1)}% attendance rate
              </div>
            </div>
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#6D28D9] dark:bg-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${attendancePercentage}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Students
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {totalStudents}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Present
                </div>
                <div className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                  {presentCount}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Absent
                </div>
                <div className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">
                  {absentCount}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-end"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <motion.button
              onClick={submitAttendance}
              disabled={saveInProgress}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                saveInProgress
                  ? "bg-purple-400 dark:bg-purple-600 cursor-not-allowed"
                  : "bg-[#6D28D9] dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-700"
              }`}
              whileHover={saveInProgress ? {} : { scale: 1.05 }}
              whileTap={saveInProgress ? {} : { scale: 0.98 }}
            >
              {saveInProgress ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Saving Attendance...
                </div>
              ) : (
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Submit Attendance
                </div>
              )}
            </motion.button>
          </motion.div>
        </main>

        {/* Success Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Attendance Recorded Successfully
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The attendance for {courseDetails.courseName} has been
                    recorded successfully.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full">
                    <motion.button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Close
                    </motion.button>
                    <Link to="/faculty-dashboard" className="flex-1">
                      <motion.button
                        className="w-full px-4 py-2 bg-[#6D28D9] dark:bg-purple-600 text-white rounded-lg font-medium"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Back to Dashboard
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="relative max-w-7xl mx-auto py-6 px-4 border-t border-gray-200 dark:border-gray-800 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
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
                Add Students
              </motion.button>
              <motion.button
                className="text-[#6D28D9] hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                Export Records
              </motion.button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TakeAttendancePage;
