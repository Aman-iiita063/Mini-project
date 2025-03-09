const attendanceData = [
  { date: "2023-05-01", subject: "Mathematics", status: "Present" },
  { date: "2023-05-02", subject: "Physics", status: "Absent" },
  { date: "2023-05-03", subject: "Chemistry", status: "Present" },
  { date: "2023-05-04", subject: "Biology", status: "Present" },
  { date: "2023-05-05", subject: "English", status: "Present" },
];

const AttendanceTable = () => {
  const totalClasses = attendanceData.length;
  const presentClasses = attendanceData.filter(
    (item) => item.status === "Present"
  ).length;
  const attendancePercentage = (presentClasses / totalClasses) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Attendance History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {attendanceData.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {item.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {item.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right text-sm text-gray-600 dark:text-gray-400">
        Attendance Percentage: {attendancePercentage.toFixed(2)}%
      </div>
    </div>
  );
};

export default AttendanceTable;
