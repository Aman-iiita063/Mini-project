import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png"; // Update with the actual path of your logo

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-blue-400 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="bg-blue-100 w-40 h-40 mb-6 rounded-full shadow-xl animate-bounce"
      />

      {/* Welcome Text */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white text-center">
        Welcome to the Attendance Management System
      </h1>
      <p className="mt-4 text-lg text-gray-800 dark:text-gray-300 text-center max-w-xl">
        Empowering you to track attendance effortlessly. Choose your role to get
        started.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link to="/faculty-dashboard">
          <Button className="px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
            Faculty
          </Button>
        </Link>
        <Link to="/login">
          <Button
            variant="outline"
            className="px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
          >
            Student
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
