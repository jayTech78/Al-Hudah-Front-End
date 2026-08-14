import React from "react";
import Image from "next/image";

import logo from "../logo-removebg-preview.png";

const TeacherNavBar = () => {

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "/Login";
  };

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center bg-success text-white px-2 py-2"
      >

        {/* ==============================
            LOGO + SCHOOL NAME
        ============================== */}
        <div className="d-flex align-items-center">

          <Image
            src={logo}
            width={70}
            height={70}
            alt="Al-Hudah Model College"
            className="ms-2 ms-md-4"
          />

          <div className="ms-2 ms-md-3 fs-6 fs-md-5">
            Al-Hudah Model College
          </div>

        </div>

        {/* ==============================
            SIGN OUT
        ============================== */}
        <button
          onClick={signOut}
          className="btn text-white fs-6 fs-md-5 me-2 me-md-4"
        >
          Sign Out
        </button>

      </div>
    </div>
  );
};

export default TeacherNavBar;