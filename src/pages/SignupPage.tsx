import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  School,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Replace with your actual illustration
import illustration from "../assets/icon3.jpg";

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    enrollment: "",
    email: "",
    password: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update theme when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    try {
      // Add your registration logic here
      console.log("Form submitted:", formData);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Account Created Successfully", {
        description:
          "Your registration has been completed. Please wait for admin approval.",
      });

      // In a real app, you might redirect to login or a welcome page
      // navigate('/login');
    } catch (error) {
      toast.error("Registration Failed", {
        description:
          "There was a problem creating your account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
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

  const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? "dark" : ""}`}>
      {/* Background gradient elements */}
      <div className="fixed inset-0 overflow-hidden opacity-30 dark:opacity-20 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#6D28D9]/20 filter blur-[100px]" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-purple-500/20 filter blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 filter blur-[60px]" />
      </div>

      {/* Left Section (Illustration with Gradient) */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-[#6D28D9] to-purple-500 dark:from-purple-800 dark:to-indigo-900 relative overflow-hidden">
        {/* Animated circles background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0.3 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-white/20 filter blur-md"
          />
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.2 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
            className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-white/10 filter blur-md"
          />
        </div>

        <div className="flex flex-col items-center justify-center h-full relative z-10 px-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-2xl">
              <img
                src={illustration || "/placeholder.svg"}
                alt="Registration illustration"
                className="w-full h-auto rounded-lg max-w-md"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-white relative z-10"
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Platform</h2>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <School className="h-6 w-6" />
              <p className="text-xl font-medium">IIIT ALLAHABAD</p>
            </div>
            <p className="text-white/80 max-w-md">
              Create an account to access attendance tracking, analytics, and
              classroom management tools
            </p>

            <div className="mt-10 bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Why Join Us?</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive attendance tracking system</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300 flex-shrink-0 mt-0.5" />
                  <span>Real-time analytics and insights</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300 flex-shrink-0 mt-0.5" />
                  <span>Identify at-risk students automatically</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300 flex-shrink-0 mt-0.5" />
                  <span>Generate detailed reports with one click</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section (Sign Up Form) */}
      <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 md:p-10 relative">
        {/* Dark mode toggle */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] dark:focus:ring-purple-400"
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-center mb-4">
              <span className="p-2 rounded-full bg-[#6D28D9]/10 dark:bg-purple-900/30">
                <BookOpen className="h-8 w-8 text-[#6D28D9] dark:text-purple-400" />
              </span>
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Register to join our faculty platform
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              {/* First Name */}
              <div className="col-span-1">
                <Label
                  htmlFor="firstName"
                  className="text-gray-700 dark:text-gray-300"
                >
                  First Name
                </Label>
                <div className="relative mt-1">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="col-span-1">
                <Label
                  htmlFor="lastName"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Last Name
                </Label>
                <div className="relative mt-1">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Enrollment Number */}
            <motion.div variants={itemVariants}>
              <Label
                htmlFor="enrollment"
                className="text-gray-700 dark:text-gray-300"
              >
                Enrollment Number
              </Label>
              <div className="relative mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
                <Input
                  id="enrollment"
                  name="enrollment"
                  type="text"
                  placeholder="Enter your enrollment number"
                  value={formData.enrollment}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
                E-mail
              </Label>
              <div className="relative mt-1">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative mt-1">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 8 characters long
              </p>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div variants={itemVariants} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="terms"
                  className="text-gray-600 dark:text-gray-400"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-[#6D28D9] hover:text-purple-700 dark:text-purple-400"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-[#6D28D9] hover:text-purple-700 dark:text-purple-400"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </motion.div>

            {/* Register Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Social Sign Up */}
          <motion.div variants={itemVariants} className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970244 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                  />
                </svg>
                Google
              </motion.button>
              <motion.button
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#1877F2"
                    d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z"
                  />
                </svg>
                Facebook
              </motion.button>
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#6D28D9] hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              Log in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
