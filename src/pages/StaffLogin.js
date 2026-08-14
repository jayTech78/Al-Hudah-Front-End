import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import LandingPageNav from "@/Components/LandingPageNav";
import style from "../styles/background.module.css";

const StaffLogin = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .required("Email is required")
        .email("Enter a valid email"),
      password: yup
        .string()
        .required("Password is required")
        .matches(
          /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/,
          "Password must be 4-10 characters, contain at least one number and one uppercase letter"
        ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          "http://localhost:9500/staff/login",
          values
        );
        localStorage.token = response.data.token;
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          // console.log(response.data);
          if (response.data.role.toLowerCase() === "manager") {
            localStorage.setItem("role", response.data.role);
            router.push(`/MBooks`);
          } else if (response.data.role.toLowerCase() === "principal") {
            localStorage.setItem("role", response.data.role);
            router.push(`/PrincipalDashBoard`);
          } else if (response.data.role.toLowerCase() === "teacher") {
            localStorage.setItem("role", response.data.role);
            router.push(`TeacherDashBoard/${response.data.className}`);
          }else if(response.data.role.toLowerCase() ==="vice principal")
          {
            localStorage.setItem("role", response.data.role);
            router.push(`/VPClasses`);
          }
          else if(response.data.role.toLowerCase() ==="bursar")
          {
            localStorage.setItem("role", response.data.role);
            router.push(`/GetBooks`);
          }
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        Swal.fire("Error", "An unexpected error occurred.", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={style.page}>
      <LandingPageNav></LandingPageNav>
      <div className={style.bgLemonGreen}>
        <div className="col-4 mx-auto border rounded-3 my-5 bg-light">
          <h1 className="text-center my-5 border-bottom mb-3 p-3">Login</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="col-11 mx-auto">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className={
                    formik.touched.email && formik.errors.email
                      ? "form-control input-style border-2 rounded-3 is-invalid"
                      : "form-control input-style border-2 rounded-3"
                  }
                  placeholder="Email"
                  name="email"
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  type="text"
                  onChange={formik.handleChange}
                />
                <div className="text-danger">
                  {formik.touched.email && formik.errors.email}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    className={
                      formik.touched.password && formik.errors.password
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    type={show ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-success btn-sm"
                      type="button"
                      onClick={handleClick}
                      title={show ? "Hide password" : "Show password"}
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="text-danger">
                  {formik.touched.password && formik.errors.password}
                </div>
              </div>
              <div className="mb-3 p-3">
                <button
                  type="submit"
                  className="btn-success form-control btn text-light"
                >
                  Login
                </button>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <Link href="/" className="btn">
                  If you don't have an account, Sign Up
                </Link>
                <Link href="/" className="btn">
                  Forgot Password
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
