import React from "react";
import Image from "next/image";
import Link from "next/link";

const LandingPageNav = () => {
  return (
    <div className="bg-success text-white p-1">
  <nav className="navbar navbar-expand-md navbar-light container">

    {/* LOGO + SCHOOL NAME */}
    <div className="d-flex align-items-center">
      <Image
        src="/logo-removebg-preview.png"
        width={120}
        height={55}
        alt="School Logo"
      />
      <h1 className="fw-bold ms-3 fs-3 fst-italic">
        Al-Hudah Group <span className="d-block">Of Schools</span>
      </h1>
    </div>

    {/* TOGGLER */}
    <button
      className="navbar-toggler bg-light"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#main-nav"
      aria-controls="main-nav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* NAV LINKS */}
    <div className="collapse navbar-collapse justify-content-end" id="main-nav">
      <ul className="navbar-nav align-items-center">

        <li className="nav-item">
          <Link href="/LandingPage" className="nav-link text-white">Home</Link>
        </li>

        <li className="nav-item">
          <Link href="/About" className="nav-link text-white">About</Link>
        </li>

        <li className="nav-item">
          <Link href="/Contact" className="nav-link text-white">Contacts</Link>
        </li>

        <li className="nav-item">
          <Link href="/Gallery" className="nav-link text-white">Gallery</Link>
        </li>

        <li className="nav-item dropdown">
          <button
            className="btn text-white"
            type=""
            data-bs-toggle="dropdown"
          >
            Login
          </button>
          <ul className="dropdown-menu">
            <li className="nav-item"><Link href="/StaffLogin" className="dropdown-item nav-link">Staff</Link></li>
            <li className="nav-item"><Link href="/Login" className="dropdown-item nav-link">Parent</Link></li>
          </ul>
        </li>

      </ul>
    </div>
  </nav>
</div>

  );
};

export default LandingPageNav;
