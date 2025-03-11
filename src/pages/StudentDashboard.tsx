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
  MagnifyingGlassIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowDownTrayIcon,
  BellIcon,
  ExclamationCircleIcon,
  AcademicCapIcon,
  UserIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  ArrowPathIcon,
  HomeIcon,
  CogIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

// Define interfaces
// interface StudentDashboardProps {
//   darkMode: boolean;
//   setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
// }

interface CourseAttendance {
  courseId: string;
  courseName: string;
  attendanceRate: number;
  attendedClasses: number;
  totalClasses: number;
  lastAttendance: string;
  status: "Good" | "Warning" | "Critical";
  nextClass?: string;
  professorName: string;
}

interface AttendanceRecord {
  date: string;
  courseName: string;
  status: "Present" | "Absent" | "Late";
  duration: string;
  location: string;
}

interface Assignment {
  id: string;
  courseName: string;
  title: string;
  dueDate: string;
  status: "Upcoming" | "Submitted" | "Late" | "Missed";
  grade?: string;
}

interface Notification {
  id: string;
  type: "attendance" | "assignment" | "announcement" | "alert";
  message: string;
  date: string;
  read: boolean;
  courseName?: string;
}

// Mock data
const mockStudentInfo = {
  id: "IEC2022063",
  name: "Aman Kumar",
  department: "ECE",
  semester: "6th",
  enrollmentYear: "2022",
  profilePicture: "https://i.pravatar.cc/300",
  overallAttendance: 87.5,
  cgpa: "7.61",
};

const mockCourseAttendance: CourseAttendance[] = [
  {
    courseId: "CS301",
    courseName: "Data Structures",
    attendanceRate: 92,
    attendedClasses: 23,
    totalClasses: 25,
    lastAttendance: "Yesterday, 10:15 AM",
    status: "Good",
    nextClass: "Tomorrow, 9:30 AM",
    professorName: "Dr. Emily Wilson",
  },
  {
    courseId: "CS302",
    courseName: "Algorithms",
    attendanceRate: 88,
    attendedClasses: 22,
    totalClasses: 25,
    lastAttendance: "Today, 1:30 PM",
    status: "Good",
    nextClass: "Friday, 11:00 AM",
    professorName: "Dr. James Peterson",
  },
  {
    courseId: "CS303",
    courseName: "Database Systems",
    attendanceRate: 76,
    attendedClasses: 19,
    totalClasses: 25,
    lastAttendance: "Monday, 3:45 PM",
    status: "Warning",
    nextClass: "Thursday, 2:15 PM",
    professorName: "Dr. Sarah Johnson",
  },
  {
    courseId: "CS304",
    courseName: "Web Development",
    attendanceRate: 68,
    attendedClasses: 17,
    totalClasses: 25,
    lastAttendance: "Last week, Friday",
    status: "Critical",
    nextClass: "Today, 4:30 PM",
    professorName: "Prof. Michael Brown",
  },
  {
    courseId: "CS305",
    courseName: "Computer Networks",
    attendanceRate: 84,
    attendedClasses: 21,
    totalClasses: 25,
    lastAttendance: "Yesterday, 2:00 PM",
    status: "Good",
    nextClass: "Wednesday, 10:00 AM",
    professorName: "Dr. Robert Clark",
  },
];

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    date: "2025-03-11",
    courseName: "Data Structures",
    status: "Present",
    duration: "1.5 hours",
    location: "Room 202",
  },
  {
    date: "2025-03-11",
    courseName: "Algorithms",
    status: "Present",
    duration: "1.5 hours",
    location: "Room 305",
  },
  {
    date: "2025-03-10",
    courseName: "Database Systems",
    status: "Absent",
    duration: "1.5 hours",
    location: "Room 101",
  },
  {
    date: "2025-03-10",
    courseName: "Data Structures",
    status: "Present",
    duration: "1.5 hours",
    location: "Room 202",
  },
  {
    date: "2025-03-09",
    courseName: "Web Development",
    status: "Late",
    duration: "1.5 hours",
    location: "Lab 3",
  },
  {
    date: "2025-03-09",
    courseName: "Computer Networks",
    status: "Present",
    duration: "1.5 hours",
    location: "Room 405",
  },
  {
    date: "2025-03-08",
    courseName: "Database Systems",
    status: "Present",
    duration: "1.5 hours",
    location: "Room 101",
  },
  {
    date: "2025-03-08",
    courseName: "Algorithms",
    status: "Present",
    duration: "1.5 hours",
    location: "Room 305",
  },
];

const mockAssignments: Assignment[] = [
  {
    id: "ASG001",
    courseName: "Data Structures",
    title: "Binary Tree Implementation",
    dueDate: "2025-03-15",
    status: "Upcoming",
  },
  {
    id: "ASG002",
    courseName: "Algorithms",
    title: "Sorting Algorithm Analysis",
    dueDate: "2025-03-12",
    status: "Upcoming",
  },
  {
    id: "ASG003",
    courseName: "Database Systems",
    title: "SQL Query Optimization",
    dueDate: "2025-03-05",
    status: "Submitted",
    grade: "A",
  },
  {
    id: "ASG004",
    courseName: "Web Development",
    title: "Responsive Portfolio Site",
    dueDate: "2025-03-08",
    status: "Late",
  },
  {
    id: "ASG005",
    courseName: "Computer Networks",
    title: "Network Protocol Analysis",
    dueDate: "2025-02-28",
    status: "Submitted",
    grade: "B+",
  },
];

const mockNotifications: Notification[] = [
  {
    id: "NOTE001",
    type: "alert",
    message: "Your attendance is below 70% in Web Development",
    date: "2025-03-11",
    read: false,
    courseName: "Web Development",
  },
  {
    id: "NOTE002",
    type: "assignment",
    message: "Assignment due tomorrow: Sorting Algorithm Analysis",
    date: "2025-03-11",
    read: false,
    courseName: "Algorithms",
  },
  {
    id: "NOTE003",
    type: "announcement",
    message: "Database Systems class on Thursday is rescheduled to Friday",
    date: "2025-03-10",
    read: true,
    courseName: "Database Systems",
  },
  {
    id: "NOTE004",
    type: "attendance",
    message: "Your attendance was marked for Data Structures",
    date: "2025-03-10",
    read: true,
    courseName: "Data Structures",
  },
  {
    id: "NOTE005",
    type: "assignment",
    message: "Your assignment 'SQL Query Optimization' was graded: A",
    date: "2025-03-09",
    read: true,
    courseName: "Database Systems",
  },
];

// Weekly attendance trend data
const mockWeeklyAttendance = [
  { day: "Mon", present: 3, total: 3 },
  { day: "Tue", present: 2, total: 3 },
  { day: "Wed", present: 3, total: 3 },
  { day: "Thu", present: 2, total: 2 },
  { day: "Fri", present: 1, total: 3 },
  { day: "Sat", present: 0, total: 0 },
  { day: "Sun", present: 0, total: 0 },
];

const StudentDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "attendance" | "courses" | "assignments"
  >("dashboard");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | "all">("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const navRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const attendanceChartRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

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

    // Count unread notifications
    const unreadCount = mockNotifications.filter(
      (notification) => !notification.read
    ).length;
    setUnreadNotifications(unreadCount);

    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Draw attendance chart
    if (chartRef.current && isLoaded) {
      drawAttendanceChart();
    }

    // Draw weekly attendance chart
    if (attendanceChartRef.current && isLoaded) {
      drawWeeklyAttendanceChart();
    }

    // Close notifications when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(timer);
    };
  }, [darkMode, isLoaded, activeTab, showNotifications]);

  // Draw attendance chart
  const drawAttendanceChart = () => {
    if (!chartRef.current) return;

    const chartElement = chartRef.current;
    chartElement.innerHTML = "";

    const chartContainer = document.createElement("div");
    chartContainer.className = "space-y-6 mt-4";

    mockCourseAttendance.forEach((course, index) => {
      const courseGroup = document.createElement("div");
      courseGroup.className = "space-y-2";

      const header = document.createElement("div");
      header.className = "flex justify-between items-center";

      const courseName = document.createElement("div");
      courseName.className =
        "text-sm font-medium text-gray-700 dark:text-gray-300";
      courseName.textContent = `${course.courseName} (${course.courseId})`;

      const percentText = document.createElement("div");
      percentText.className = `text-sm font-medium ${
        course.attendanceRate >= 85
          ? "text-green-600 dark:text-green-400"
          : course.attendanceRate >= 75
          ? "text-yellow-600 dark:text-yellow-400"
          : "text-red-600 dark:text-red-400"
      }`;
      percentText.textContent = `${course.attendanceRate}% (${course.attendedClasses}/${course.totalClasses})`;

      header.appendChild(courseName);
      header.appendChild(percentText);

      const progressContainer = document.createElement("div");
      progressContainer.className =
        "h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden";

      const progressBar = document.createElement("div");
      progressBar.className = `h-full rounded-full transition-all duration-1000 ease-out ${
        course.attendanceRate >= 85
          ? "bg-green-500 dark:bg-green-400"
          : course.attendanceRate >= 75
          ? "bg-yellow-500 dark:bg-yellow-400"
          : "bg-red-500 dark:bg-red-400"
      }`;
      progressBar.style.width = "0%";
      setTimeout(() => {
        progressBar.style.width = `${course.attendanceRate}%`;
      }, 300 * index);

      progressContainer.appendChild(progressBar);
      courseGroup.appendChild(header);
      courseGroup.appendChild(progressContainer);
      chartContainer.appendChild(courseGroup);
    });

    chartElement.appendChild(chartContainer);
  };

  // Draw weekly attendance chart
  const drawWeeklyAttendanceChart = () => {
    if (!attendanceChartRef.current) return;

    const chartElement = attendanceChartRef.current;
    chartElement.innerHTML = "";

    const chartContainer = document.createElement("div");
    chartContainer.className = "flex items-end h-40 gap-2 mt-4";

    mockWeeklyAttendance.forEach((day, index) => {
      const percentPresent =
        day.total > 0 ? (day.present / day.total) * 100 : 0;

      const barGroup = document.createElement("div");
      barGroup.className = "flex flex-col items-center flex-1";

      const barContainer = document.createElement("div");
      barContainer.className = "relative w-full h-32";

      const barBg = document.createElement("div");
      barBg.className =
        "absolute bottom-0 w-full bg-gray-200 dark:bg-gray-700 rounded-t transition-all duration-700";
      barBg.style.height = day.total > 0 ? "100%" : "0%";

      const barFill = document.createElement("div");
      barFill.className =
        "absolute bottom-0 w-full bg-[#6D28D9] dark:bg-purple-500 rounded-t transition-all duration-700";
      barFill.style.height = "0%";

      if (day.total > 0) {
        setTimeout(() => {
          barFill.style.height = `${percentPresent}%`;
        }, 100 * index);
      }

      const label = document.createElement("div");
      label.className =
        "text-xs font-medium text-gray-600 dark:text-gray-400 mt-2";
      label.textContent = day.day;

      barContainer.appendChild(barBg);
      barContainer.appendChild(barFill);
      barGroup.appendChild(barContainer);
      barGroup.appendChild(label);
      chartContainer.appendChild(barGroup);
    });

    chartElement.appendChild(chartContainer);
  };

  // Request sort
  const requestSort = (key: string) => {
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

  // Filter attendance records based on search term and selected course
  const filteredAttendanceRecords = useMemo(() => {
    return mockAttendanceRecords.filter((record) => {
      const matchesSearch =
        record.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourse =
        selectedCourse === "all" || record.courseName === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [searchTerm, selectedCourse]);

  // Filter assignments based on search term
  const filteredAssignments = useMemo(() => {
    let result = mockAssignments.filter((assignment) => {
      return (
        assignment.courseName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Apply sorting if configured
    if (sortConfig !== null) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [searchTerm, sortConfig]);

  // Get unique courses for filter
  const courses = useMemo(() => {
    return [
      ...new Set(mockCourseAttendance.map((course) => course.courseName)),
    ];
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

  // Function to get status color
  const getStatusColor = (status: "Present" | "Absent" | "Late") => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Function to get assignment status color
  const getAssignmentStatusColor = (
    status: "Upcoming" | "Submitted" | "Late" | "Missed"
  ) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Submitted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Missed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Function to get notification icon
  const getNotificationIcon = (
    type: "attendance" | "assignment" | "announcement" | "alert"
  ) => {
    switch (type) {
      case "attendance":
        return (
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <CheckCircleIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        );
      case "assignment":
        return (
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <BookOpenIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        );
      case "announcement":
        return (
          <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <BellIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </div>
        );
      case "alert":
        return (
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
            <ExclamationCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
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
                  Student Dashboard
                </motion.h1>
                <div className="ml-6 flex items-center space-x-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {currentDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <motion.button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-400 relative"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: darkMode
                        ? "rgba(55, 65, 81, 0.9)"
                        : "rgba(243, 244, 246, 0.9)",
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <BellIcon className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </motion.button>

                  {/* Notifications panel */}
                  {showNotifications && (
                    <motion.div
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Notifications
                          </h3>
                          <span className="text-xs text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">
                            Mark all as read
                          </span>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b border-gray-200 dark:border-gray-700 ${
                              !notification.read
                                ? "bg-purple-50 dark:bg-purple-900/10"
                                : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              {getNotificationIcon(notification.type)}
                              <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {notification.message}
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {notification.date}
                                  </span>
                                  {notification.courseName && (
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                      {notification.courseName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center text-sm text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">
                        View all notifications
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* User profile */}
                <Link to="/profile">
                  <motion.div
                    className="flex items-center space-x-2 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="relative h-8 w-8 rounded-full bg-purple-100 overflow-hidden">
                      <UserIcon className="h-5 w-5 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {mockStudentInfo.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {mockStudentInfo.id}
                      </p>
                    </div>
                  </motion.div>
                </Link>

                {/* Dark mode toggle */}
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
        <div className="relative max-w-7xl mx-auto pt-4 pb-8 px-4 z-10">
          {/* Tabs */}
          <div className="mb-6 flex overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <motion.button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === "dashboard"
                    ? "bg-white dark:bg-gray-700 shadow-sm text-[#6D28D9] dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <HomeIcon className="h-4 w-4 inline-block mr-1.5" />
                Dashboard
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("attendance")}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === "attendance"
                    ? "bg-white dark:bg-gray-700 shadow-sm text-[#6D28D9] dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <CheckCircleIcon className="h-4 w-4 inline-block mr-1.5" />
                Attendance
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("courses")}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === "courses"
                    ? "bg-white dark:bg-gray-700 shadow-sm text-[#6D28D9] dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <BookOpenIcon className="h-4 w-4 inline-block mr-1.5" />
                My Courses
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("assignments")}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === "assignments"
                    ? "bg-white dark:bg-gray-700 shadow-sm text-[#6D28D9] dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <DocumentTextIcon className="h-4 w-4 inline-block mr-1.5" />
                Assignments
              </motion.button>
            </div>
          </div>

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Quick Stats & Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                  {/* Student Profile Card */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
                    <div className="p-6 flex flex-col items-center">
                      <div className="relative h-20 w-20 rounded-full bg-purple-100 overflow-hidden mb-4">
                        <UserIcon className="h-12 w-12 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                        {mockStudentInfo.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {mockStudentInfo.id}
                      </p>
                      <div className="w-full space-y-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Department
                          </span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {mockStudentInfo.department}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Semester
                          </span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {mockStudentInfo.semester}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Enrollment Year
                          </span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {mockStudentInfo.enrollmentYear}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            CGPA
                          </span>
                          <span className="text-xs font-medium bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded text-purple-700 dark:text-purple-300">
                            {mockStudentInfo.cgpa}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        className="mt-5 text-sm text-[#6D28D9] dark:text-purple-400 flex items-center"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <CogIcon className="h-4 w-4 mr-1" />
                        View Profile
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Quick Stats Cards */}
                  <motion.div
                    className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                  >
                    {/* Overall Attendance Card */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
                      whileHover={{
                        y: -5,
                        boxShadow:
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Overall Attendance
                          </div>
                          <div className="mt-2 text-3xl font-bold text-[#6D28D9] dark:text-purple-400">
                            {mockStudentInfo.overallAttendance}%
                          </div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {mockStudentInfo.overallAttendance >= 85
                              ? "Excellent"
                              : mockStudentInfo.overallAttendance >= 75
                              ? "Good"
                              : "Needs improvement"}
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                          <CheckCircleIcon className="h-5 w-5 text-[#6D28D9] dark:text-purple-400" />
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
                            className="dark:stroke-purple-500"
                            initial={{ strokeDashoffset: 151 }}
                            animate={{
                              strokeDashoffset:
                                151 -
                                (151 * mockStudentInfo.overallAttendance) / 100,
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

                    {/* Classes Today Card */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
                      whileHover={{
                        y: -5,
                        boxShadow:
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Classes Today
                          </div>
                          <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                            2
                          </div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Next: Data Structures, 4:30 PM
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                          <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      {/* Today's schedule */}
                      <div className="mt-4">
                        <div className="space-y-2">
                          <div className="flex items-center bg-green-50 dark:bg-green-900/10 p-2 rounded-md">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                Web Development
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                4:30 PM - 6:00 PM
                              </div>
                            </div>
                            <div className="text-xs bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded text-green-600 dark:text-green-400">
                              Room 305
                            </div>
                          </div>
                          <div className="flex items-center bg-blue-50 dark:bg-blue-900/10 p-2 rounded-md">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                Data Structures
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                6:15 PM - 7:45 PM
                              </div>
                            </div>
                            <div className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">
                              Room 202
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Upcoming Assignments Card */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
                      whileHover={{
                        y: -5,
                        boxShadow:
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Upcoming Assignments
                          </div>
                          <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {
                              mockAssignments.filter(
                                (a) => a.status === "Upcoming"
                              ).length
                            }
                          </div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Next due: Tomorrow
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      {/* Assignments list */}
                      <div className="mt-4 space-y-2">
                        {mockAssignments
                          .filter((a) => a.status === "Upcoming")
                          .slice(0, 2)
                          .map((assignment, index) => (
                            <div
                              key={assignment.id}
                              className="flex items-center bg-blue-50 dark:bg-blue-900/10 p-2 rounded-md"
                            >
                              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                              <div className="flex-1">
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {assignment.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Due:{" "}
                                  {new Date(
                                    assignment.dueDate
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">
                                {assignment.courseName}
                              </div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Recent Activity and Attendance Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Recent Attendance Activity */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Recent Attendance
                      </h3>
                      <span
                        className="text-sm text-purple-600 dark:text-purple-400 cursor-pointer"
                        onClick={() => setActiveTab("attendance")}
                      >
                        View All
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        {mockAttendanceRecords
                          .slice(0, 5)
                          .map((record, index) => (
                            <div
                              key={`${record.date}-${record.courseName}`}
                              className="flex items-center bg-gray-50 dark:bg-gray-800/70 p-3 rounded-lg"
                            >
                              <div
                                className={`h-2 w-2 rounded-full mr-3 ${
                                  record.status === "Present"
                                    ? "bg-green-500"
                                    : record.status === "Absent"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                              ></div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {record.courseName}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                                      record.status
                                    )}`}
                                  >
                                    {record.status}
                                  </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(record.date).toLocaleDateString()}{" "}
                                    • {record.location}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {record.duration}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Weekly Attendance Chart */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={3}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Weekly Attendance
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        Your attendance for this week
                      </div>
                      <div ref={attendanceChartRef} className="w-full"></div>
                      <div className="mt-4 flex justify-center space-x-6">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-[#6D28D9] mr-2"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Present
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Total Classes
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Course-wise Attendance */}
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-8"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Course-wise Attendance
                    </h3>
                    <span
                      className="text-sm text-purple-600 dark:text-purple-400 cursor-pointer"
                      onClick={() => setActiveTab("courses")}
                    >
                      View All Courses
                    </span>
                  </div>
                  <div className="p-4">
                    <div ref={chartRef} className="w-full"></div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === "attendance" && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
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
                        placeholder="Search attendance records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </motion.div>

                    {/* Course filter */}
                    <motion.div
                      className="relative w-full sm:w-auto"
                      whileHover={{ scale: 1.02 }}
                    >
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="appearance-none w-full pl-10 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200"
                      >
                        <option value="all">All Courses</option>
                        {courses.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                      <BookOpenIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
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
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded-md ${
                          viewMode === "list"
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
                        onClick={() => setViewMode("calendar")}
                        className={`p-1.5 rounded-md ${
                          viewMode === "calendar"
                            ? "bg-white dark:bg-gray-800 shadow-sm"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CalendarIcon className="h-5 w-5" />
                      </motion.button>
                    </div>

                    {/* Export button */}
                    <motion.button
                      className="flex items-center space-x-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
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

                {/* List View */}
                {viewMode === "list" && (
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Attendance Records
                      </h3>
                      <span className="text-sm text-gray-500">
                        Showing {filteredAttendanceRecords.length} records
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 dark:bg-gray-800/70">
                            <TableHead
                              className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              onClick={() => requestSort("date")}
                            >
                              <div className="flex items-center">
                                Date
                                {sortConfig?.key === "date" && (
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
                              onClick={() => requestSort("courseName")}
                            >
                              <div className="flex items-center">
                                Course
                                {sortConfig?.key === "courseName" && (
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
                            <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                              Duration
                            </TableHead>
                            <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                              Location
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <AnimatePresence>
                            {filteredAttendanceRecords.map((record, index) => (
                              <motion.tr
                                key={`${record.date}-${record.courseName}`}
                                className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                                custom={index}
                                variants={tableRowVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                exit={{ opacity: 0, x: -10 }}
                              >
                                <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                                  {new Date(record.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{record.courseName}</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                      record.status
                                    )}`}
                                  >
                                    {record.status}
                                  </span>
                                </TableCell>
                                <TableCell>{record.duration}</TableCell>
                                <TableCell>{record.location}</TableCell>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>
                )}

                {/* Calendar View */}
                {viewMode === "calendar" && (
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Attendance Calendar
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-7 gap-2 text-center mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (day) => (
                            <div
                              key={day}
                              className="text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
                            >
                              {day}
                            </div>
                          )
                        )}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {/* Example calendar days - in a real implementation, these would be generated dynamically */}
                        {Array.from({ length: 35 }).map((_, index) => {
                          const day = index - 5; // Offset to start month on the correct day
                          const isCurrentMonth = day > 0 && day <= 31;
                          const isToday = day === 11; // Assuming today is the 11th

                          // Check if there's attendance data for this day
                          const hasData =
                            isCurrentMonth &&
                            mockAttendanceRecords.some((record) => {
                              const recordDay = new Date(record.date).getDate();
                              return recordDay === day;
                            });

                          const dayStatus =
                            isCurrentMonth && hasData
                              ? mockAttendanceRecords.find(
                                  (record) =>
                                    new Date(record.date).getDate() === day
                                )?.status
                              : null;

                          return (
                            <div
                              key={index}
                              className={`
                                aspect-square rounded-md flex flex-col items-center justify-center
                                ${
                                  !isCurrentMonth
                                    ? "text-gray-300 dark:text-gray-600"
                                    : ""
                                }
                                ${
                                  isToday
                                    ? "border-2 border-[#6D28D9] dark:border-purple-500"
                                    : ""
                                }
                                ${
                                  isCurrentMonth
                                    ? "hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
                                    : ""
                                }
                                ${
                                  dayStatus === "Present"
                                    ? "bg-green-50 dark:bg-green-900/10"
                                    : dayStatus === "Absent"
                                    ? "bg-red-50 dark:bg-red-900/10"
                                    : dayStatus === "Late"
                                    ? "bg-yellow-50 dark:bg-yellow-900/10"
                                    : ""
                                }
                              `}
                            >
                              <span
                                className={`
                                text-sm 
                                ${
                                  isToday
                                    ? "font-bold text-[#6D28D9] dark:text-purple-400"
                                    : ""
                                }
                                ${
                                  !isCurrentMonth
                                    ? "text-gray-300 dark:text-gray-600"
                                    : "text-gray-700 dark:text-gray-300"
                                }
                              `}
                              >
                                {isCurrentMonth ? day : ""}
                              </span>
                              {dayStatus && (
                                <div
                                  className={`
                                  mt-1 h-1.5 w-1.5 rounded-full
                                  ${
                                    dayStatus === "Present"
                                      ? "bg-green-500"
                                      : dayStatus === "Absent"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                  }
                                `}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Attendance Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  {/* Course-wise Attendance */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Course-wise Attendance
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        {mockCourseAttendance.map((course, index) => (
                          <div
                            key={course.courseId}
                            className="bg-gray-50 dark:bg-gray-800/70 p-3 rounded-lg"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {course.courseName}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  course.status === "Good"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : course.status === "Warning"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {course.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              {course.attendedClasses} of {course.totalClasses}{" "}
                              classes attended
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  course.status === "Good"
                                    ? "bg-green-500"
                                    : course.status === "Warning"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${course.attendanceRate}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>Last: {course.lastAttendance}</span>
                              <span>{course.attendanceRate}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Attendance Status Summary */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Attendance Summary
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                            {
                              mockAttendanceRecords.filter(
                                (r) => r.status === "Present"
                              ).length
                            }
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Present
                          </div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                            {
                              mockAttendanceRecords.filter(
                                (r) => r.status === "Late"
                              ).length
                            }
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Late
                          </div>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                            {
                              mockAttendanceRecords.filter(
                                (r) => r.status === "Absent"
                              ).length
                            }
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Absent
                          </div>
                        </div>
                      </div>

                      {/* Overall percentage display */}
                      <div className="mt-6 flex flex-col items-center">
                        <div className="relative h-32 w-32">
                          <svg viewBox="0 0 36 36" className="w-full h-full">
                            <path
                              className="stroke-current text-gray-200 dark:text-gray-700"
                              strokeWidth="3"
                              fill="none"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="stroke-current text-[#6D28D9] dark:text-purple-500"
                              strokeWidth="3"
                              strokeDasharray={`${mockStudentInfo.overallAttendance}, 100`}
                              strokeLinecap="round"
                              fill="none"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text
                              x="18"
                              y="20.35"
                              className="text-3xl font-bold text-gray-700 dark:text-gray-300"
                              textAnchor="middle"
                            >
                              {mockStudentInfo.overallAttendance}%
                            </text>
                          </svg>
                        </div>
                        <div className="text-center mt-4">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Overall Attendance
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {mockStudentInfo.overallAttendance >= 85
                              ? "Excellent attendance!"
                              : mockStudentInfo.overallAttendance >= 75
                              ? "Good attendance, keep it up!"
                              : "Needs improvement. Try to attend more classes."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* COURSES TAB */}
            {activeTab === "courses" && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCourseAttendance.map((course, index) => (
                    <motion.div
                      key={course.courseId}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      whileHover={{
                        y: -5,
                        boxShadow:
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div
                        className={`h-2 w-full ${
                          course.status === "Good"
                            ? "bg-green-500"
                            : course.status === "Warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                              {course.courseName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {course.courseId}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.status === "Good"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : course.status === "Warning"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {course.attendanceRate}%
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Attendance
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {course.attendedClasses}/{course.totalClasses}{" "}
                              classes
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                course.status === "Good"
                                  ? "bg-green-500"
                                  : course.status === "Warning"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${course.attendanceRate}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {course.professorName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Last attended: {course.lastAttendance}
                            </span>
                          </div>
                          {course.nextClass && (
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Next class: {course.nextClass}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between">
                          <motion.button
                            className="text-[#6D28D9] dark:text-purple-400 text-sm flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Details
                          </motion.button>
                          <motion.button
                            className="bg-[#6D28D9] dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-700 text-white text-sm px-4 py-1.5 rounded-md flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Schedule
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ASSIGNMENTS TAB */}
            {activeTab === "assignments" && (
              <motion.div
                key="assignments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
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
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </motion.div>

                    {/* Status filter */}
                    <motion.div
                      className="relative w-full sm:w-auto"
                      whileHover={{ scale: 1.02 }}
                    >
                      <select className="appearance-none w-full pl-10 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-500 text-gray-700 dark:text-gray-200">
                        <option value="all">All Statuses</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="submitted">Submitted</option>
                        <option value="late">Late</option>
                        <option value="missed">Missed</option>
                      </select>
                      <DocumentTextIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
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

                  {/* Right side: Add new assignment */}
                  <motion.button
                    className="flex items-center space-x-1 px-4 py-2 bg-[#6D28D9] dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>New Submission</span>
                  </motion.button>
                </motion.div>

                {/* Assignments Table */}
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Assignments
                    </h3>
                    <span className="text-sm text-gray-500">
                      Showing {filteredAssignments.length} assignments
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800/70">
                          <TableHead
                            className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            onClick={() => requestSort("courseName")}
                          >
                            <div className="flex items-center">
                              Course
                              {sortConfig?.key === "courseName" && (
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
                            onClick={() => requestSort("title")}
                          >
                            <div className="flex items-center">
                              Title
                              {sortConfig?.key === "title" && (
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
                            onClick={() => requestSort("dueDate")}
                          >
                            <div className="flex items-center">
                              Due Date
                              {sortConfig?.key === "dueDate" && (
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
                          <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                            Grade
                          </TableHead>
                          <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredAssignments.map((assignment, index) => (
                            <motion.tr
                              key={assignment.id}
                              className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                              custom={index}
                              variants={tableRowVariants}
                              initial="hidden"
                              animate="visible"
                              whileHover="hover"
                              exit={{ opacity: 0, x: -10 }}
                            >
                              <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                                {assignment.courseName}
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {assignment.title}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  assignment.dueDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAssignmentStatusColor(
                                    assignment.status
                                  )}`}
                                >
                                  {assignment.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                {assignment.grade ? (
                                  <span className="font-medium text-purple-600 dark:text-purple-400">
                                    {assignment.grade}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 dark:text-gray-500">
                                    -
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <motion.button
                                  className="text-[#6D28D9] hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {assignment.status === "Upcoming"
                                    ? "Submit"
                                    : assignment.status === "Submitted" ||
                                      assignment.status === "Late"
                                    ? "View"
                                    : "Details"}
                                </motion.button>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>

                {/* Assignment Status Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                        <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Upcoming
                        </div>
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                          {
                            mockAssignments.filter(
                              (a) => a.status === "Upcoming"
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
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
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
                        <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Submitted
                        </div>
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                          {
                            mockAssignments.filter(
                              (a) => a.status === "Submitted"
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
                        <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Late
                        </div>
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                          {
                            mockAssignments.filter((a) => a.status === "Late")
                              .length
                          }
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={3}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-4">
                        <ExclamationCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Missed
                        </div>
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                          {
                            mockAssignments.filter((a) => a.status === "Missed")
                              .length
                          }
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="relative max-w-7xl mx-auto py-6 px-4 border-t border-gray-200 dark:border-gray-800 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Academic Year: 2024-2025
              </span>
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
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Help Center
              </motion.button>
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
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact Support
              </motion.button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StudentDashboard;
