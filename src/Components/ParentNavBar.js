import React from 'react'
import Image from 'next/image'
import logo from '../logo-removebg-preview.png'
import Link from 'next/link'

const ManagerNavBar = () => {
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/Login"; // Redirect to login page
  }

  return (
    <div>
      <div className="d-flex justify-content-between p-1 bg-success text-white align-items-center">
        <div className="">
          <div className="d-flex g-1">
            <Image src={logo} width={70} alt='' className="md-md-5 ms-5" />
            <div className="fs-6 fs-md-5 d-flex align-items-center ms-2 ms-md-3 ">
              Al-Hudah Model College
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around ">
          <div className="me-5 fs-5 ">
            <button onClick={()=>{signOut()}} className="btn text-light fs-g fs-md-5">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerNavBar