import React from "react";
import style from "../styles/SignUp.module.css";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import Image from "next/image";
import Logo from "../logo-removebg-preview.png";

const AddStaff = () => {
  const router = useRouter();
  const handleClick = () => setShow(!show);
  const [show, setShow] = useState(false);
  let formik = useFormik({
    initialValues: {
      surName: "",
      otherNames: "",
      phoneNo: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      surName: yup.string().required("This field is required"),
      otherNames: yup.string().required("This field is required"),
      email: yup
        .string()
        .required("This field is required")
        .email("This is Not a Valid Email"),
      phoneNo: yup.string().required("This field is required"),
      dateOfBirth: yup.date().required("This field is required"),
      address: yup.string().required("This field is required"),
      confirmPassword: yup
        .string()
        .matches(
          /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/,
          "Password must contain 4-10 Characters, at least One number and at least one UPPERCASE letter"
        )
        .required("This field id required"),
      password: yup
        .string()
        .matches(
          /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/,
          "Password must contain 4-10 Characters, at least One number and at least one UPPERCASE letter"
        )
        .required("This field id required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        const response = await axios.post(
          "http://localhost:9500/staff/addStaff",
          values
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          router.push("DashBoard");
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={style.page}>
      <div className={style.body}>
        <div className="col-6 mx-auto border rounded-3 my-5 bg-light">
          <div className="d-flex justify-content-center">
            <Image
              alt="/"
              src={Logo}
              height={100}
              width={100}
              className="my-4"
            ></Image>
            <div></div>
          </div>
          <h1 className="text-center mb-3 border-bottom p-2">Sign Up</h1>
          <form action="" onSubmit={formik.handleSubmit}>
            <div className="col-11 mx-auto">
              <div className="row">
                <div className="col-6 mb-3 p-1">
                  <label className="form-label">SurName</label>
                  <input
                    placeholder="SurName"
                    type="text"
                    className={
                      formik.errors.surName && formik.touched.surName
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
                    placeholder="Middle Name Last Name"
                    type="text"
                    className={
                      formik.errors.otherNames && formik.touched.otherNames
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
                        formik.errors.email && formik.touched.email
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
                        formik.errors.phoneNo && formik.touched.phoneNo
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
                        formik.errors.dateOfBirth && formik.touched.dateOfBirth
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
                <div className="">
                  <div className="col-">
                    <label className="form-label">Address</label>
                    <input
                      placeholder="Address"
                      type="text"
                      className={
                        formik.errors.address && formik.touched.address
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
                </div>
              </div>
              <div className="mb-3 p-1">
                <div className="row">
                  <div className="col-6">
                    <label className="form-label">Password</label>

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
                      />
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-success btn-sm"
                          type="button"
                          onClick={handleClick}
                        >
                          {show ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div className="text-danger">
                      {formik.touched.password && formik.errors.password}
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label">Confirm PassWord</label>
                    <input
                      placeholder="Confirm PassWord"
                      type="text"
                      className={
                        formik.errors.confirmPassword &&
                        formik.touched.confirmPassword
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
                <button
                  type="submit"
                  className="btn-success form-control btn text-light"
                >
                  Sign Up
                </button>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <Link href={"/"} className="btn">
                  If you have an account <Link href={"/Login"}></Link>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddStaff;