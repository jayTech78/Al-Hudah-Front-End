import React from 'react'
import Image from 'next/image'
import Link from "next/link";
import style from '../styles/SignUp.module.css'
import NavBar from '../Components/NavBar'

const ParentStudentDetailsPage = () => {
  return (
    <div>
        <NavBar></NavBar>
      <div className="col-10 mx-auto border rounded-3 p-5 my-5 bg-light">
        <h2 className="text-center border-bottom p-3">Student's Details</h2>
        <div className="col-10 my-5 mx-auto p-4 shadow-bg border rounded-3 bg-white">
          <div className="row d-flex justify-content-between">
            <div className="border rounded-3 col-3 p-3">
              <div className="fs-2 ">Student's Pics</div>
            </div>
            <div className="col-8 bg-white p-3">
              <div>FullName : Jafar Lawal Okikiola</div>
              <div>Date Of Birth : 25/9/2002</div>
              <div>Gender : Male</div>
              <div>Class : Senior Secondary School Two</div>
              <div>Class Teacher : Mrs Faleye</div>
            </div>
          </div>
        </div>
        <div className="col-10 my-1 mx-auto shadow-bg border rounded-3 bg-light bg-white">
          <div className="my-3 p-3">
            <div className=" p-2 ">
              <h4 className="border-bottom p-3">Academics</h4>
              <div className="p-3">
                <div className="">Position : 4th</div>
                <div className="">Overall Performance Percentage : 82%</div>
                <div className="">No of students in Class : 30</div>
                <div>No Of Times School Opened : 95</div>
                <div>No Of Times Absent : 15</div>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-between'>
            <div className=''>

            </div>
            <div className='p-1 me-5'>
                <Link href={'/'}>See Full Report</Link>
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
  );
}

export default ParentStudentDetailsPage