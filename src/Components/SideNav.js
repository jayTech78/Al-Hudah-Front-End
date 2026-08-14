import React from "react";
import Link from "next/link";

const SideNav = () => {
  return (
      <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-success">
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
          <a
            href="/ManagerDashBoard"
            className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <span className="fs-5 d-none d-sm-inline">Menu</span>
          </a>
          <ul
            className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >
            <li className="nav-item">
              <a href="#" className="nav-link align-middle px-0">
                <i className="fs-4 bi-house"></i>{" "}
                <span className="ms-1 d-none d-sm-inline text-white">Home</span>
              </a>
            </li>
            <li>
              <a
                href="/GetStaffs"
                data-bs-toggle="collapse"
                className="nav-link px-0 align-middle"
              >
                <i className="fs-4 bi-speedometer2"></i>{" "}
                <span className="ms-1 d-none d-sm-inline text-white">Staffs</span>{" "}
              </a>
            </li>
            <li>
              <a href="/GetParents" className="nav-link px-0 align-middle">
                <i className="fs-4 bi-table"></i>
                <span href="" className="ms-1 d-none d-sm-inline text-white">
                  Parents
                </span>
              </a>
            </li>
            <li>
              <a
                href="GetStudents"
                data-bs-toggle="collapse"
                className="nav-link px-0 align-middle "
              >
                <i className="fs-4 bi-bootstrap"></i>{" "}
                <span className="ms-1 d-none d-sm-inline text-white">Students</span>
              </a>
              
            </li>
            <li>
              <a
                href="GetFees"
                data-bs-toggle="collapse"
                className="nav-link px-0 align-middle"
              >
                <i className="fs-4 bi-grid"></i>{" "}
                <span className="ms-1 d-none d-sm-inline text-white">Fees</span>{" "}
              </a>
            </li>
            <li>
              <a href="GetClasses" className="nav-link px-0 align-middle">
                <i className="fs-4 bi-people"></i>{" "}
                <span className="ms-1 d-none d-sm-inline text-white">Classes</span>{" "}
              </a>
            </li>
            <li>
              <a href="GetBooks" className="nav-link px-0 align-middle">
                <i className="fs-4 bi-people"></i>{" "}
                <span className="ms-1 d-none d-sm-inline text-white">Books</span>{" "}
              </a>
            </li>
            <li>
              <a href="GetRoles" className="nav-link px-0 align-middle">
                <i className="fs-4 bi-people"></i>{" "}
                <span className="ms-1 d-none d-sm-inline text-white">Roles</span>{" "}
              </a>
            </li>
            <li>
              <a href="GetSubjects" className="nav-link px-0 align-middle">
                <i className="fs-4 bi-people"></i>{" "}
                <span className="ms-1 d-none d-sm-inline text-white">Subjects</span>{" "}
              </a>
            </li>
          </ul>
          <hr />
          
        </div>
      </div>
  );
};

export default SideNav;
