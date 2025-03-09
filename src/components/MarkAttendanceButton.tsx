import React from "react";

const MarkAttendanceButton = () => {
  const handleMarkAttendance = () => {
    console.log("Marking attendance...");
  };

  return (
    <button
      onClick={handleMarkAttendance}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Mark Attendance
    </button>
  );
};

export default MarkAttendanceButton;
