import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BookOpen, School, Users, Calendar, CheckCircle } from "lucide-react";
import logo from "../assets/logo.png";

const cssAnimations = `
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(10px, -10px) scale(1.05); }
  50% { transform: translate(0, 20px) scale(0.95); }
  75% { transform: translate(-10px, -10px) scale(1.05); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
`;

const HomePage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);

    // Setup dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Add parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const parallaxItems = document.querySelectorAll(".parallax");
      parallaxItems.forEach((item) => {
        const speed = Number((item as HTMLElement).dataset.speed);
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        (
          item as HTMLElement
        ).style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [darkMode]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const featureCardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    hover: {
      y: -10,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.3 },
    },
  };

  // Features content
  const features = [
    {
      icon: (
        <Calendar className="h-10 w-10 text-[#6D28D9] dark:text-purple-400" />
      ),
      title: "Attendance Tracking",
      description:
        "Real-time tracking with comprehensive analytics and reports",
    },
    {
      icon: <Users className="h-10 w-10 text-[#6D28D9] dark:text-purple-400" />,
      title: "Student Management",
      description: "Efficiently manage student profiles and attendance records",
    },
    {
      icon: (
        <CheckCircle className="h-10 w-10 text-[#6D28D9] dark:text-purple-400" />
      ),
      title: "Performance Insights",
      description: "Identify at-risk students and attendance patterns",
    },
  ];

  return (
    <div className={`min-h-screen font-sans ${darkMode ? "dark" : ""}`}>
      {/* Background gradient elements */}
      <div className="fixed inset-0 overflow-hidden opacity-30 dark:opacity-20 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#6D28D9]/20 filter blur-[100px]" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-purple-500/20 filter blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 filter blur-[60px]" />

        {/* Animated blobs */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 0.8, 0.5],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full bg-blue-500/10 filter blur-xl"
        />

        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.7, 0.5],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5,
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 filter blur-xl"
        />
      </div>

      {/* Dark mode toggle */}
      <motion.button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-400 shadow-md"
        whileHover={{
          scale: 1.1,
          backgroundColor: darkMode
            ? "rgba(55, 65, 81, 0.9)"
            : "rgba(243, 244, 246, 0.9)",
        }}
        whileTap={{ scale: 0.9 }}
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </motion.button>

      <main className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Hero Section */}
          <div className="lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-0 relative">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-xl mx-auto lg:mx-0"
            >
              {/* Logo with animation */}
              <motion.div
                className="mb-8 relative flex justify-center lg:justify-start"
                variants={itemVariants}
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#6D28D9] to-purple-400 -z-10 blur-sm opacity-70"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-24 h-24 rounded-full bg-white/90 dark:bg-gray-800/90 p-2 shadow-xl parallax z-10"
                    data-speed="2"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center lg:justify-start space-x-2 mb-6"
              >
                <School className="h-6 w-6 text-[#6D28D9] dark:text-purple-400" />
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  IIIT ALLAHABAD
                </h2>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 text-center lg:text-left"
              >
                <span className="block">Attendance</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#6D28D9] to-purple-500 dark:from-purple-400 dark:to-indigo-300">
                  Management System
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 dark:text-gray-400 mb-10 text-center lg:text-left"
              >
                Empower your institution with seamless attendance tracking,
                insightful analytics, and complete student management.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="px-8 py-3 bg-[#6D28D9] hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md">
                      Faculty Login
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="px-8 py-3 border-2 border-[#6D28D9] dark:border-purple-500 text-[#6D28D9] dark:text-purple-400 hover:bg-[#6D28D9]/10 font-semibold rounded-lg"
                    >
                      Student Login
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Section with Floating Cards */}
          <div className="lg:w-1/2 relative flex items-center justify-center p-8 lg:p-16 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-purple-500 dark:bg-purple-400" />
            <div className="absolute bottom-1/3 left-1/3 w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-400" />
            <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-indigo-500 dark:bg-indigo-400" />

            {/* Main visual element - Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#6D28D9] to-purple-500" />

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Faculty Dashboard
                </h3>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                  Live Demo
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Present
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      43/50
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "86%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      At Risk Students
                    </span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      3
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500 dark:bg-red-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "6%" }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Overall Attendance
                    </span>
                    <span className="text-sm font-bold text-[#6D28D9] dark:text-purple-400">
                      88.5%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#6D28D9] dark:bg-purple-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "88.5%" }}
                      transition={{ duration: 1, delay: 1.2 }}
                    />
                  </div>
                </div>

                <motion.div
                  className="mt-4 grid grid-cols-3 gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  {[1, 2, 3].map((_, index) => (
                    <div
                      key={index}
                      className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Faculty
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Our platform provides everything you need to manage attendance
              efficiently
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={featureCardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-4 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-[#6D28D9] dark:text-purple-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Attendance Management System
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 IIIT Allahabad. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;

/* Add these custom animations to your global CSS */
/*
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(10px, -10px) scale(1.05); }
  50% { transform: translate(0, 20px) scale(0.95); }
  75% { transform: translate(-10px, -10px) scale(1.05); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
*/
