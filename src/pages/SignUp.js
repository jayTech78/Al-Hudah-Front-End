import React, { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import Image from "next/image";
import style from "../styles/background.module.css";
import Logo from '../logo-removebg-preview.png'
import LandingPageNav from "@/Components/LandingPageNav";
const ParentSignUp = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      surName: "",
      otherNames: "",
      email: "",
      phoneNo: "",
      dateOfBirth: "",
      address: "",
      password: "",
      confirmPassword: "",
      occupation: "",
      role: "parent",
    },
    validationSchema: yup.object({
      surName: yup.string().required("This field is required"),
      otherNames: yup.string().required("This field is required"),
      email: yup
        .string()
        .required("This field is required")
        .email("This is not a valid email"),
      phoneNo: yup.string().required("This field is required"),
      dateOfBirth: yup.date().required("This field is required"),
      address: yup.string().required("This field is required"),
      password: yup
        .string()
        .matches(
          /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/,
          "Password must contain 4-10 characters, at least one number, and at least one UPPERCASE letter"
        )
        .required("This field is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("This field is required"),
      occupation: yup.string().required("This field is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          "http://localhost:9500/parent/parentSignUp",
          values
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          router.push("Login");
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred. Please try again.", "error");
        console.error("Error uploading file:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClick = () => setShow(!show);

  return (
    <div className={style.page}>
      <LandingPageNav></LandingPageNav>
      <div className={style.bgLemonGreen}>
        <div className="col-6 mx-auto border rounded-3 my-5 bg-light">
          <div className="d-flex justify-content-center">
            <Image
              alt="Logo"
              src={Logo}
              height={100}
              width={100}
              className="my-4"
            />
          </div>
          <h1 className="text-center mb-3 border-bottom p-2">Sign Up</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="col-11 mx-auto">
              <div className="row">
                <div className="col-6 mb-3 p-1">
                  <label className="form-label">SurName</label>
                  <input
                    placeholder="SurName"
                    type="text"
                    className={
                      formik.touched.surName && formik.errors.surName
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    name="surName"
                    onChange={formik.handleChange}
                    value={formik.values.surName}
                    onBlur={formik.handleBlur}
                  />
                  <div className="text-danger">
                    {formik.touched.surName && formik.errors.surName}
                  </div>
                </div>
                <div className="col-6 mb-3 p-1">
                  <label className="form-label">Other Names</label>
                  <input
                    placeholder="Other Names"
                    type="text"
                    className={
                      formik.touched.otherNames && formik.errors.otherNames
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    name="otherNames"
                    onChange={formik.handleChange}
                    value={formik.values.otherNames}
                    onBlur={formik.handleBlur}
                  />
                  <div className="text-danger">
                    {formik.touched.otherNames && formik.errors.otherNames}
                  </div>
                </div>
              </div>

              <div className="mb-3 p-1">
                <div className="row">
                  <div className="col-4">
                    <label className="form-label">Email</label>
                    <input
                      placeholder="Email"
                      type="text"
                      className={
                        formik.touched.email && formik.errors.email
                          ? "form-control input-style border-2 rounded-2 is-invalid"
                          : "form-control input-style border-2 rounded-2"
                      }
                      name="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      onBlur={formik.handleBlur}
                    />
                    <div className="text-danger">
                      {formik.touched.email && formik.errors.email}
                    </div>
                  </div>
                  <div className="col-4">
                    <label className="form-label">Phone No</label>
                    <input
                      placeholder="Phone No"
                      type="text"
                      className={
                        formik.touched.phoneNo && formik.errors.phoneNo
                          ? "form-control input-style border-2 rounded-2 is-invalid"
                          : "form-control input-style border-2 rounded-2"
                      }
                      name="phoneNo"
                      onChange={formik.handleChange}
                      value={formik.values.phoneNo}
                      onBlur={formik.handleBlur}
                    />
                    <div className="text-danger">
                      {formik.touched.phoneNo && formik.errors.phoneNo}
                    </div>
                  </div>
                  <div className="col-4">
                    <label className="form-label">Date Of Birth</label>
                    <input
                      placeholder="Date Of Birth"
                      type="date"
                      className={
                        formik.touched.dateOfBirth && formik.errors.dateOfBirth
                          ? "form-control input-style border-2 rounded-2 is-invalid"
                          : "form-control input-style border-2 rounded-2"
                      }
                      name="dateOfBirth"
                      onChange={formik.handleChange}
                      value={formik.values.dateOfBirth}
                      onBlur={formik.handleBlur}
                    />
                    <div className="text-danger">
                      {formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 p-1">
                <label className="form-label">Address</label>
                <input
                  placeholder="Address"
                  type="text"
                  className={
                    formik.touched.address && formik.errors.address
                      ? "form-control input-style border-2 rounded-2 is-invalid"
                      : "form-control input-style border-2 rounded-2"
                  }
                  name="address"
                  onChange={formik.handleChange}
                  value={formik.values.address}
                  onBlur={formik.handleBlur}
                />
                <div className="text-danger">
                  {formik.touched.address && formik.errors.address}
                </div>
              </div>

              <div className="mb-3 p-1">
                <div className="row">
                  <div className="col-6">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        placeholder="Password"
                        type={show ? "text" : "password"}
                        className={
                          formik.touched.password && formik.errors.password
                            ? "form-control input-style border-2 rounded-2 is-invalid"
                            : "form-control input-style border-2 rounded-2"
                        }
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
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
                  <div className="col-6">
                    <label className="form-label">Confirm Password</label>
                    <input
                      placeholder="Confirm Password"
                      type={show ? "text" : "password"}
                      className={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "form-control input-style border-2 rounded-2 is-invalid"
                          : "form-control input-style border-2 rounded-2"
                      }
                      name="confirmPassword"
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      onBlur={formik.handleBlur}
                    />
                    <div className="text-danger">
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 p-1">
                <label className="form-label">Occupation</label>
                <input
                  placeholder="Occupation"
                  type="text"
                  className={
                    formik.touched.occupation && formik.errors.occupation
                      ? "form-control input-style border-2 rounded-2 is-invalid"
                      : "form-control input-style border-2 rounded-2"
                  }
                  name="occupation"
                  onChange={formik.handleChange}
                  value={formik.values.occupation}
                  onBlur={formik.handleBlur}
                />
                <div className="text-danger">
                  {formik.touched.occupation && formik.errors.occupation}
                </div>
              </div>

              <div className="mb-3 p-1">
                <button
                  type="submit"
                  className="btn-success form-control btn text-light"
                  disabled={formik.isSubmitting}
                >
                  Sign Up
                </button>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <p>
                  Already have an account?{" "}
                  <Link href={"/Login"}>Log In</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParentSignUp;
