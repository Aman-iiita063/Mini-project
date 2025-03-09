import type React from "react";
import {
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";

const InsightCards: React.FC = () => {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <AcademicCapIcon className="h-8 w-8 text-blue-500" />
          <h3 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
            Total Classes Attended
          </h3>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          42
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Out of 50 total classes
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <ClockIcon className="h-8 w-8 text-green-500" />
          <h3 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
            Upcoming Lectures
          </h3>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          3
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          In the next 7 days
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <ChartBarIcon className="h-8 w-8 text-purple-500" />
          <h3 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
            Attendance Trend
          </h3>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          84%
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          5% increase from last month
        </p>
      </div>
    </>
  );
};

export default InsightCards;
