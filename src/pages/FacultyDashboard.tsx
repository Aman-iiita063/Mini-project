"use client";
import { useState, useEffect, useRef, useMemo } from "react";
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
import {
  MoonIcon,
  SunIcon,
  MagnifyingGlassIcon, // This replaces MagnifyingGlassIcon
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  FunnelIcon, // This replaces FunnelIcon
  ArrowDownTrayIcon, // This replaces ArrowDownTrayIcon
  ExclamationCircleIcon,
  CheckCircleIcon,
  Bars4Icon, // This replaces Bars4Icon
  Squares2X2Icon, // This replaces Squares2X2Icon
  DocumentTextIcon, // This replaces DocumentTextIcon
  ArrowPathIcon, // This replaces ArrowPathIcon
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

interface Student {
  id: string;
  name: string;
  status: "Present" | "Absent";
  department?: string;
  course?: string;
  lastAttendance?: string;
  attendanceRate?: number;
  consecutiveAbsences?: number;
  trend?: "up" | "down" | "stable";
}

// Enhanced mock data with additional properties
const mockStudents: Student[] = [
  {
    id: "IEC2022061",
    name: "Baljit Singh",
    status: "Present",
    department: "Electronics",
    course: "Data Structures",
    lastAttendance: "Today, 9:30 AM",
    attendanceRate: 92,
    consecutiveAbsences: 0,
    trend: "up",
  },
  {
    id: "IEC2022062",
    name: "Animesh Singh",
    status: "Absent",
    department: "Information Technology",
    course: "Web Development",
    lastAttendance: "Yesterday, 2:15 PM",
    attendanceRate: 78,
    consecutiveAbsences: 1,
    trend: "down",
  },
  {
    id: "IEC2022063",
    name: "Aman Kumar",
    status: "Present",
    department: "Computer Science",
    course: "Data Structures",
    lastAttendance: "Today, 9:30 AM",
    attendanceRate: 85,
    consecutiveAbsences: 0,
    trend: "stable",
  },
  {
    id: "IEC2022069",
    name: "Ankit Vehicle",
    status: "Present",
    department: "Electronics",
    course: "Circuit Theory",
    lastAttendance: "Today, 11:00 AM",
    attendanceRate: 90,
    consecutiveAbsences: 0,
    trend: "up",
  },
  {
    id: "IEC2022077",
    name: "Jot Singh Bindra",
    status: "Absent",
    department: "Electronics",
    course: "Thermodynamics",
    lastAttendance: "2 days ago, 10:45 AM",
    attendanceRate: 65,
    consecutiveAbsences: 3,
    trend: "down",
  },
  {
    id: "IEC2022066",
    name: "Chennugari Karthik Reddy",
    status: "Present",
    department: "Information Technology",
    course: "Database Systems",
    lastAttendance: "Today, 1:30 PM",
    attendanceRate: 88,
    consecutiveAbsences: 0,
    trend: "stable",
  },
  {
    id: "IEC2022067",
    name: "Sunil Kumar Yadav",
    status: "Present",
    department: "Information Technology",
    course: "Algorithms",
    lastAttendance: "Today, 3:00 PM",
    attendanceRate: 95,
    consecutiveAbsences: 0,
    trend: "up",
  },
  {
    id: "IEC2022117",
    name: "Akshay Waghmare",
    status: "Absent",
    department: "Electronics",
    course: "Digital Logic",
    lastAttendance: "3 days ago, 9:15 AM",
    attendanceRate: 72,
    consecutiveAbsences: 2,
    trend: "down",
  },
];

// Attendance trend data for charts
const mockAttendanceTrend = [
  { date: "Mon", present: 45, absent: 5, total: 50 },
  { date: "Tue", present: 42, absent: 8, total: 50 },
  { date: "Wed", present: 38, absent: 12, total: 50 },
  { date: "Thu", present: 44, absent: 6, total: 50 },
  { date: "Fri", present: 40, absent: 10, total: 50 },
  { date: "Sat", present: 35, absent: 15, total: 50 },
  { date: "Today", present: 43, absent: 7, total: 50 },
];

// Department-wise attendance data
const mockDepartmentData = [
  // { department: "Computer Science", present: 32, absent: 3, total: 35 },
  { department: "Information Technology", present: 28, absent: 5, total: 33 },
  { department: "Electronics", present: 24, absent: 8, total: 32 },
  // { department: "Mechanical", present: 18, absent: 7, total: 25 },
];

const FacultyDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedDepartment, setSelectedDepartment] = useState<string | "all">(
    "all"
  );
  const [showAtRiskStudents, setShowAtRiskStudents] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"attendance" | "analytics">(
    "attendance"
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "ascending" | "descending";
  } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const deptChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Draw attendance trend chart
    if (chartRef.current && isLoaded) {
      drawAttendanceChart();
    }

    // Draw department chart
    if (deptChartRef.current && isLoaded) {
      drawDepartmentChart();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, [darkMode, isLoaded, activeTab]);

  // Draw simple bar chart for attendance trend
  const drawAttendanceChart = () => {
    if (!chartRef.current) return;

    // In a real implementation, you would use a proper charting library
    // like Chart.js, Recharts, or D3.js
    const chartElement = chartRef.current;
    chartElement.innerHTML = "";

    const chartContainer = document.createElement("div");
    chartContainer.className = "flex items-end h-40 gap-2 mt-4";

    mockAttendanceTrend.forEach((day, index) => {
      const presentPercentage = (day.present / day.total) * 100;

      const barGroup = document.createElement("div");
      barGroup.className = "flex flex-col items-center flex-1";

      const barContainer = document.createElement("div");
      barContainer.className = "relative w-full h-32";

      const absentBar = document.createElement("div");
      absentBar.className =
        "absolute bottom-0 w-full bg-red-200 dark:bg-red-900/30 rounded-t transition-all duration-700";
      absentBar.style.height = `${100 - presentPercentage}%`;

      const presentBar = document.createElement("div");
      presentBar.className =
        "absolute bottom-0 w-full bg-green-400 dark:bg-green-600 rounded-t transition-all duration-700";
      presentBar.style.height = "0%";
      setTimeout(() => {
        presentBar.style.height = `${presentPercentage}%`;
      }, 100 * index);

      const label = document.createElement("div");
      label.className =
        "text-xs font-medium text-gray-600 dark:text-gray-400 mt-2";
      label.textContent = day.date;

      barContainer.appendChild(absentBar);
      barContainer.appendChild(presentBar);
      barGroup.appendChild(barContainer);
      barGroup.appendChild(label);
      chartContainer.appendChild(barGroup);
    });

    chartElement.appendChild(chartContainer);
  };

  // Draw department chart
  const drawDepartmentChart = () => {
    if (!deptChartRef.current) return;

    const chartElement = deptChartRef.current;
    chartElement.innerHTML = "";

    const chartContainer = document.createElement("div");
    chartContainer.className = "space-y-4 mt-4";

    mockDepartmentData.forEach((dept, index) => {
      const percentPresent = (dept.present / dept.total) * 100;

      const deptGroup = document.createElement("div");
      deptGroup.className = "space-y-2";

      const header = document.createElement("div");
      header.className = "flex justify-between items-center";

      const deptName = document.createElement("div");
      deptName.className =
        "text-sm font-medium text-gray-700 dark:text-gray-300";
      deptName.textContent = dept.department;

      const percentText = document.createElement("div");
      percentText.className =
        "text-sm font-medium text-gray-500 dark:text-gray-400";
      percentText.textContent = `${percentPresent.toFixed(1)}%`;

      header.appendChild(deptName);
      header.appendChild(percentText);

      const progressContainer = document.createElement("div");
      progressContainer.className =
        "h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden";

      const progressBar = document.createElement("div");
      progressBar.className =
        "h-full bg-[#6D28D9] dark:bg-blue-500 rounded-full transition-all duration-1000 ease-out";
      progressBar.style.width = "0%";
      setTimeout(() => {
        progressBar.style.width = `${percentPresent}%`;
      }, 300 * index);

      progressContainer.appendChild(progressBar);
      deptGroup.appendChild(header);
      deptGroup.appendChild(progressContainer);
      chartContainer.appendChild(deptGroup);
    });

    chartElement.appendChild(chartContainer);
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

  // Filter students based on search term, department, and at-risk status
  const filteredStudents = useMemo(() => {
    let result = mockStudents.filter((student) => {
      const matchesSearch =
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.department &&
          student.department
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (student.course &&
          student.course.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDepartment =
        selectedDepartment === "all" ||
        student.department === selectedDepartment;

      const isAtRisk =
        student.attendanceRate !== undefined && student.attendanceRate < 75;
      const matchesRisk = !showAtRiskStudents || isAtRisk;

      return matchesSearch && matchesDepartment && matchesRisk;
    });

    // Apply sorting if configured
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (
          a[sortConfig.key] === undefined ||
          b[sortConfig.key] === undefined
        ) {
          return 0;
        }

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // if (aValue < bValue) {
        //   return sortConfig.direction === 'ascending' ? -1 : 1;
        // }
        if (aValue !== undefined && bValue !== undefined && aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [searchTerm, selectedDepartment, showAtRiskStudents, sortConfig]);

  // Calculate statistics
  const totalStudents = filteredStudents.length;
  const totalPresent = filteredStudents.filter(
    (student) => student.status === "Present"
  ).length;
  const totalAbsent = totalStudents - totalPresent;
  const overallPercentage =
    totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0;

  // Get unique departments for filter
  const departments = useMemo(() => {
    const deps = new Set(
      mockStudents
        .map((student) => student.department)
        .filter(Boolean) as string[]
    );
    return Array.from(deps);
  }, []);

  // Calculate at-risk students
  const atRiskCount = useMemo(() => {
    return mockStudents.filter(
      (student) =>
        student.attendanceRate !== undefined && student.attendanceRate < 75
    ).length;
  }, []);

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

  const handleCardHover = (cardId: string) => {
    setActiveSummaryCard(cardId);
  };

  const handleCardLeave = () => {
    setActiveSummaryCard(null);
  };

  // Get date for header
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Function to get trend icon
  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    if (trend === "up") {
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
    } else if (trend === "down") {
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
    } else {
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
    }
  };

  return (
    <div className={`transition-all duration-500 ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        {/* Background gradient elements */}
        <div className="fixed inset-0 overflow-hidden opacity-30 dark:opacity-20 pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#6D28D9]/20 filter blur-[100px]" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-purple-500/20 filter blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 filter blur-[60px]" />
        </div>

        {/* Custom cursor (minimal dot) */}
        {/* <div
          className="fixed w-2 h-2 bg-[#6D28D9] rounded-full z-50 pointer-events-none mix-blend-exclusion transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        /> */}

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
                  Faculty Dashboard
                </motion.h1>
                <div className="ml-6 flex items-center space-x-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {currentDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link to="/take-attendance">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="border border-[#6D28D9]/20 hover:border-[#6D28D9]/80 text-[#6D28D9] hover:text-blue-600 hover:bg-blue-50/50 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Take Attendance
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/student-list">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="border border-[#6D28D9]/20 hover:border-[#6D28D9]/80 text-[#6D28D9] hover:text-blue-600 hover:bg-blue-50/50 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                    >
                      <Bars4Icon className="h-4 w-4 mr-2" />
                      Student List
                    </Button>
                  </motion.div>
                </Link>
                <motion.button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-blue-400"
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
          {/* Dashboard Header with stats summary */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Quick Stats */}
            <motion.div
              className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <motion.div
                className={`bg-white dark:bg-gray-800 border border-transparent hover:border-[#6D28D9]/20 dark:hover:border-blue-500/20 rounded-xl p-6 ${
                  activeSummaryCard === "present"
                    ? "ring-2 ring-green-400 dark:ring-green-500"
                    : ""
                }`}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.2 },
                }}
                onMouseEnter={() => handleCardHover("present")}
                onMouseLeave={handleCardLeave}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Present
                    </div>
                    <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                      {totalPresent}
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      out of {totalStudents} students
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {/* Progress indicator */}
                <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(totalPresent / totalStudents) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </motion.div>

              <motion.div
                className={`bg-white dark:bg-gray-800 border border-transparent hover:border-[#6D28D9]/20 dark:hover:border-blue-500/20 rounded-xl p-6 ${
                  activeSummaryCard === "absent"
                    ? "ring-2 ring-red-400 dark:ring-red-500"
                    : ""
                }`}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.2 },
                }}
                onMouseEnter={() => handleCardHover("absent")}
                onMouseLeave={handleCardLeave}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Absent
                    </div>
                    <div className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                      {totalAbsent}
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {totalAbsent > 0 &&
                        `${((totalAbsent / totalStudents) * 100).toFixed(
                          1
                        )}% of total`}
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-600 dark:text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {/* Progress indicator */}
                <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500 dark:bg-red-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(totalAbsent / totalStudents) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </motion.div>

              <motion.div
                className={`bg-white dark:bg-gray-800 border border-transparent hover:border-[#6D28D9]/20 dark:hover:border-blue-500/20 rounded-xl p-6 ${
                  activeSummaryCard === "percentage"
                    ? "ring-2 ring-[#6D28D9] dark:ring-blue-500"
                    : ""
                }`}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.2 },
                }}
                onMouseEnter={() => handleCardHover("percentage")}
                onMouseLeave={handleCardLeave}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Overall Attendance
                    </div>
                    <div className="mt-2 text-3xl font-bold text-[#6D28D9] dark:text-blue-400">
                      {overallPercentage.toFixed(1)}%
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {overallPercentage >= 85
                        ? "Excellent"
                        : overallPercentage >= 75
                        ? "Good"
                        : "Needs improvement"}
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#6D28D9] dark:text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                {/* Circular progress */}
                <div className="mt-2 flex justify-center">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle
                      cx="30"
                      cy="30"
                      r="24"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="6"
                      className="dark:stroke-gray-700"
                    />
                    <motion.circle
                      cx="30"
                      cy="30"
                      r="24"
                      fill="none"
                      stroke="#6D28D9"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="151"
                      className="dark:stroke-blue-400"
                      initial={{ strokeDashoffset: 151 }}
                      animate={{
                        strokeDashoffset: 151 - (151 * overallPercentage) / 100,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5,
                        ease: "easeOut",
                      }}
                      style={{
                        transformOrigin: "center",
                        transform: "rotate(-90deg)",
                      }}
                    />
                  </svg>
                </div>
              </motion.div>
            </motion.div>

            {/* At-risk students alert */}
            <motion.div
              className="bg-white dark:bg-gray-800 border border-transparent hover:border-orange-300/20 rounded-xl p-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={1}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center text-sm font-medium text-orange-500 dark:text-orange-400">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    Attendance Alert
                  </div>
                  <div className="mt-2 text-3xl font-bold text-orange-500 dark:text-orange-400">
                    {atRiskCount}
                  </div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Students at risk (&lt;75%)
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowAtRiskStudents(!showAtRiskStudents)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    showAtRiskStudents
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showAtRiskStudents ? "Viewing" : "View"}
                </motion.button>
              </div>

              {/* Action buttons */}
              <div className="mt-4 space-y-2">
                <motion.button
                  className="w-full text-sm flex items-center justify-center py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send Reminder
                </motion.button>
                <motion.button
                  className="w-full text-sm flex items-center justify-center py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Generate Report
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* View Controls & Filters */}
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
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-blue-500 text-gray-700 dark:text-gray-200"
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
                  className="appearance-none w-full pl-10 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-blue-500 text-gray-700 dark:text-gray-200"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <FunnelIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
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

            {/* Right side: View toggles and actions */}
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
                  <Bars4Icon className="h-5 w-5" />
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
                  <Squares2X2Icon className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Tab toggles */}
              <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <motion.button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "attendance"
                      ? "bg-white dark:bg-gray-800 shadow-sm text-[#6D28D9] dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Attendance
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "analytics"
                      ? "bg-white dark:bg-gray-800 shadow-sm text-[#6D28D9] dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analytics
                </motion.button>
              </div>

              {/* Export button */}
              <motion.button
                className="flex items-center space-x-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export</span>
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

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {activeTab === "attendance" && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Attendance Table View */}
                {viewMode === "table" && (
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Student Attendance
                      </h3>
                      <span className="text-sm text-gray-500">
                        Showing {filteredStudents.length} of{" "}
                        {mockStudents.length} students
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
                                    {sortConfig.direction === "ascending"
                                      ? "↑"
                                      : "↓"}
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
                                    {sortConfig.direction === "ascending"
                                      ? "↑"
                                      : "↓"}
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
                                    {sortConfig.direction === "ascending"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                )}
                              </div>
                            </TableHead>
                            <TableHead
                              className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              onClick={() => requestSort("status")}
                            >
                              <div className="flex items-center">
                                Status
                                {sortConfig?.key === "status" && (
                                  <span className="ml-1">
                                    {sortConfig.direction === "ascending"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                )}
                              </div>
                            </TableHead>
                            <TableHead
                              className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              onClick={() => requestSort("attendanceRate")}
                            >
                              <div className="flex items-center">
                                Attendance Rate
                                {sortConfig?.key === "attendanceRate" && (
                                  <span className="ml-1">
                                    {sortConfig.direction === "ascending"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                )}
                              </div>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                              Trend
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <AnimatePresence>
                            {filteredStudents.map((student, index) => (
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
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      student.status === "Present"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    }`}
                                  >
                                    {student.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className={`text-sm font-medium ${
                                        (student.attendanceRate || 0) >= 85
                                          ? "text-green-600 dark:text-green-400"
                                          : (student.attendanceRate || 0) >= 75
                                          ? "text-yellow-600 dark:text-yellow-400"
                                          : "text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {student.attendanceRate}%
                                    </div>
                                    <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${
                                          (student.attendanceRate || 0) >= 85
                                            ? "bg-green-500"
                                            : (student.attendanceRate || 0) >=
                                              75
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                        style={{
                                          width: `${student.attendanceRate}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {getTrendIcon(student.trend)}
                                    {student.consecutiveAbsences &&
                                      student.consecutiveAbsences > 1 && (
                                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                                          {student.consecutiveAbsences}d
                                        </span>
                                      )}
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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnimatePresence>
                      {filteredStudents.map((student, index) => (
                        <motion.div
                          key={student.id}
                          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                          custom={index}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ y: -5 }}
                        >
                          <div
                            className={`h-2 w-full ${
                              student.status === "Present"
                                ? "bg-green-500 dark:bg-green-600"
                                : "bg-red-500 dark:bg-red-600"
                            }`}
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {student.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {student.id}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  student.status === "Present"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {student.status}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Department:
                                </span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {student.department}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Course:
                                </span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {student.course}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Last Attendance:
                                </span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {student.lastAttendance}
                                </span>
                              </div>

                              <div className="pt-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Attendance Rate
                                  </span>
                                  <div className="flex items-center">
                                    <span
                                      className={`text-xs font-medium ${
                                        (student.attendanceRate || 0) >= 85
                                          ? "text-green-600 dark:text-green-400"
                                          : (student.attendanceRate || 0) >= 75
                                          ? "text-yellow-600 dark:text-yellow-400"
                                          : "text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {student.attendanceRate}%
                                    </span>
                                    <span className="ml-1">
                                      {getTrendIcon(student.trend)}
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full rounded-full ${
                                      (student.attendanceRate || 0) >= 85
                                        ? "bg-green-500"
                                        : (student.attendanceRate || 0) >= 75
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${student.attendanceRate}%`,
                                    }}
                                    transition={{
                                      duration: 1,
                                      delay: 0.3 + index * 0.05,
                                      ease: "easeOut",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Weekly Attendance Trend */}
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Weekly Attendance Trend
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Overall attendance rate for the past week
                    </div>
                    <div ref={chartRef} className="w-full"></div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Attendance rates by department
                    </div>
                    <div ref={deptChartRef} className="w-full"></div>
                  </div>
                </motion.div>

                {/* Students at Risk */}
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden lg:col-span-2"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Students at Risk
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Students with attendance rate below 75% or with
                      consecutive absences
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/70">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Student
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Department
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Attendance Rate
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Consecutive Absences
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Last Attendance
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {mockStudents
                            .filter(
                              (student) =>
                                (student.attendanceRate !== undefined &&
                                  student.attendanceRate < 75) ||
                                (student.consecutiveAbsences !== undefined &&
                                  student.consecutiveAbsences > 1)
                            )
                            .map((student, index) => (
                              <motion.tr
                                key={student.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                  opacity: 1,
                                  x: 0,
                                  transition: { delay: 0.2 + index * 0.1 },
                                }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {student.name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {student.id}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-700 dark:text-gray-300">
                                    {student.department}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {student.course}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                      {student.attendanceRate}%
                                    </span>
                                    <span className="ml-2">
                                      {getTrendIcon(student.trend)}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {student.consecutiveAbsences &&
                                  student.consecutiveAbsences > 1 ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                      {student.consecutiveAbsences} days
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      -
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                  {student.lastAttendance}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <motion.button
                                    className="text-[#6D28D9] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Contact
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer with additional info and stats */}
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Last updated: Today, 15:30
                </span>
                <span className="flex items-center">
                  <ChartBarIcon className="h-4 w-4 mr-1" />
                  Attendance target: 90%
                </span>
              </div>
              <div className="flex space-x-4">
                <motion.button
                  className="text-[#6D28D9] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  Generate report
                </motion.button>
                <motion.button
                  className="text-[#6D28D9] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Download data
                </motion.button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
