import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
const NavBar = () => {
  const router = useRouter();
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/Login");
  }

  return (
    <div>
      <div className="d-flex justify-content-between p-1 bg-success text-white align-items-center">
        <div className="d">
          <div className="d-flex g-1">
            <Image
              src="/logo-removebg-preview.png"
              width={100}
              height={50}
              alt="School Logo"
            />{" "}
            <div className="fs-5 d-flex align-items-center ms-3 ">
              Al-Hudah Model College
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around ">
          <div className="me-5 fs-5 ">
            <button href={"/"} className="btn text-light fs-5">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
