import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";
import LandingPageNav from "@/Components/LandingPageNav";
import style from "../styles/background.module.css";
import Logo from '../logo-removebg-preview.png'
import Image from "next/image";
import api from '@/utils/api'

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
        const response = await api.post(
          "/staff/login",
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
          } else if (response.data.role.toLowerCase() === "vice principal") {
            localStorage.setItem("role", response.data.role);
            router.push(`/VPClasses`);
          }
          else if (response.data.role.toLowerCase() === "bursar") {
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
    <div style={{ overflow: 'hidden' }}>
      <LandingPageNav></LandingPageNav>
      <div className="row p-2">

        {/* LOGIN FORM */}
        <div className="col-12 col-lg-6 mx-auto">

          <h1 className="text-center border-bottom my-5">
            Login
          </h1>

          <form action="" onSubmit={formik.handleSubmit}>

            <div className="col-11 mx-auto">

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>

                <input
                  className={
                    formik.errors.email && formik.touched.email
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


              {/* Password */}
              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <div className="input-group">

                  <input
                    className={
                      formik.errors.password && formik.touched.password
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    type={show ? "text" : "password"}
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    placeholder="Password"
                  />

                  <button
                    className="btn btn-outline-success btn-sm"
                    type="button"
                    onClick={handleClick}
                  >
                    {show ? "Hide" : "Show"}
                  </button>

                </div>

                <div className="text-danger">
                  {formik.touched.password && formik.errors.password}
                </div>

              </div>


              {/* Login */}
              <div className="mb-3 p-3">
                <button
                  type="submit"
                  className="btn-success form-control btn text-light"
                >
                  Login
                </button>
              </div>


              {/* Signup */}
              <div className="d-flex justify-content-between mb-3">

                <Link
                  href={"/SignUp"}
                  className="btn text-primary"
                >
                  SignUp
                </Link>

              </div>

            </div>

          </form>

        </div>


        {/* LOGO */}
        <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">

          <div className="w-75">
            <Image
              src={Logo}
              width={700}
              height={500}
              className="img-fluid"
              alt="Al-Hudah Group of Schools"
              style={{
                objectFit: "contain",
              }}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default StaffLogin;
