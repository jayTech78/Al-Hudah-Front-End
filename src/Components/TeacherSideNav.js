import React from "react";
import Link from "next/link";

const TeacherSideNav = ({ className }) => {
  return (
    <div
      className="bg-success text-white"
      style={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="p-3">

        {/* Dashboard */}
        <div className="mb-3">
          <Link
            href={`/TeacherDashBoard/${className}`}
            className="nav-link text-white"
          >
            Dashboard
          </Link>
        </div>

        {/* Mark Attendance */}
        <div className="mb-3">
          <Link
            href={`/Attendance/${className}`}
            className="nav-link text-white"
          >
            Mark Attendance
          </Link>
        </div>

        {/* Filter Attendance */}
        <div className="mb-3">
          <Link
            href={`/FilterAttendance/${className}`}
            className="nav-link text-white"
          >
            Filter Attendance
          </Link>
        </div>

        {/* Grading */}
        <div className="mb-3">
          <Link
            href={`/ScoreGrading/${className}`}
            className="nav-link text-white"
          >
            Grading
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TeacherSideNav;