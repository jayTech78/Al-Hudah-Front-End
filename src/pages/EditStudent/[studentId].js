import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import style from "../../styles/SignUp.module.css";
import ManagerNavBar from "@/Components/ParentNavBar";
import ParentSideNav from "@/Components/ParentSideNav";
import Logo from "../../logo-removebg-preview.png";
import Image from "next/image";

const EditStudent = () => {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [parent_Id, setParentId] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (router.query.studentId) {
        setStudentId(router.query.studentId);
        try {
          const { data: response } = await axios.post(
            "http://localhost:9500/student/findStudentById",
            {
              studentId: router.query.studentId,
              parent_Id: router.query.parent_Id,
            }
          );
          if (response.student.length > 0) {
            setStudentFields(response.student[0]);
          }
        } catch (error) {
          Swal.fire("Error", `There was an error: ${error.message}`, "error");
        }
      }
    };
    fetchStudents();
  }, [router.query.studentId]);

  const setStudentFields = (student) => {
    formik.setValues({
      surName: student.surName,
      otherNames: student.otherNames,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      previousClass: student.previousClass,
      classTo: student.classTo,
      nationality: student.nationality,
      tribe: student.tribe,
      religion: student.religion,
      schoolingType: student.schoolingType,
      previousSchool: student.previousSchool,
    });
  };

  const formik = useFormik({
    initialValues: {
      surName: "",
      otherNames: "",
      gender: "",
      dateOfBirth: "",
      previousClass: "",
      classTo: "",
      nationality: "",
      tribe: "",
      religion: "",
      schoolingType: "",
      previousSchool: "",
    },
    validationSchema: yup.object({
      surName: yup.string().required("This field is Required!"),
      otherNames: yup.string().required("This field is Required!"),
      gender: yup.string().required("This field is Required!"),
      dateOfBirth: yup.date().required("This field is Required!"),
      previousClass: yup.string().required("This field is Required!"),
      classTo: yup.string().required("This field is Required!"),
      nationality: yup.string().required("This field is Required!"),
      tribe: yup.string().required("This field is Required!"),
      religion: yup.string().required("This field is Required!"),
      schoolingType: yup.string().required("This field is Required!"),
      previousSchool: yup.string().required("This field is Required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          "http://localhost:9500/student/addStudent",
          { ...values, parentId: router.query.parentId }
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          router.push(`/DashBoard/${router.query.parentId}`);
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
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <ManagerNavBar />
      <div className="d-flex" style={{ height: "100vh" }}>
        {/* Sidebar (Fixed Height, Full View) */}
        <div
          className="bg-success text-white" // Ensures full green background
          style={{
            width: "250px",
            height: "100vh",
            position: "fixed", // Keeps it in place
            top: 90,
            left: 0,
          }}
        >
          <ParentSideNav parent_Id={parent_Id} />
        </div>

        {/* Main Content (Scrollable) */}
        <div
          className={`${style.shadow}${style.padded} my-5 col-6 mx-auto p-4 border rounded-3 bg-light`}
        >
          <div className="d-flex justify-content-center">
            <Image
              alt="Logo"
              src={Logo}
              height={100}
              width={100}
              className="my-4"
            />
          </div>
          <h2 className="text-center border-bottom p-3">Edit Student</h2>
          <form action="" onSubmit={formik.handleSubmit}>
            <div>
              <div className="row">
                <div className="col-4 p-3">
                  <label htmlFor="" className="form-label ">
                    SurName
                  </label>
                  <input
                    type="text"
                    className={
                      formik.errors.surName && formik.touched.surName
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    name="surName"
                    placeholder="surName"
                    onChange={formik.handleChange}
                    value={formik.values.surName}
                    onBlur={formik.handleBlur}
                  />
                  <div className="text-danger">
                    {formik.touched.surName && formik.errors.surName}
                  </div>
                </div>
                <div className="col-4 p-3">
                  <label htmlFor="" className="form-label ">
                    Other Names
                  </label>
                  <input
                    placeholder="Other Names"
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
                <div className="col-4 p-3">
                  <label htmlFor="" className="form-label">
                    Gender
                  </label>
                  <select
                    type="text"
                    className={
                      formik.errors.gender && formik.touched.gender
                        ? "form-select input-style border-2 rounded-2 is-invalid"
                        : "form-select input-style border-2 rounded-2"
                    }
                    name="gender"
                    onChange={formik.handleChange}
                    value={formik.values.gender}
                    onBlur={formik.handleBlur}
                  >
                    <option value="" className="form-control">
                      ---
                    </option>
                    <option value="male" className="form-control">
                      Male
                    </option>
                    <option value="female" className="form-control">
                      Female
                    </option>
                  </select>
                  <div className="text-danger">
                    {formik.touched.gender && formik.errors.gender}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-4 p-4">
                  <label htmlFor="" className="form-label">
                    Date Of Birth
                  </label>
                  <input
                    className={
                      formik.errors.dateOfBirth && formik.touched.dateOfBirth
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    name="dateOfBirth"
                    onChange={formik.handleChange}
                    value={formik.values.dateOfBirth}
                    onBlur={formik.handleBlur}
                    type="date"
                    readOnly // Add this attribute
                  />
                  <div className="text-danger">
                    {formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  </div>
                </div>

                <div className="col-4 p-3">
                  <label htmlFor="" className="form-label">
                    Previous Class
                  </label>
                  <select
                    className={
                      formik.errors.previousClass &&
                      formik.touched.previousClass
                        ? "form-select input-style border-2 rounded-2 is-invalid"
                        : "form-select input-style border-2 rounded-2"
                    }
                    name="previousClass"
                    onChange={formik.handleChange}
                    value={formik.values.previousClass}
                    onBlur={formik.handleBlur}
                  >
                    <option value="" className="form-control">
                      ---
                    </option>
                    <option value="JSS1" className="form-control">
                      JSS1
                    </option>
                    <option value="JSS2" className="form-control">
                      JSS2
                    </option>
                    <option value="JSS3" className="form-control">
                      JSS3
                    </option>
                    <option value="SS1" className="form-control">
                      SSS1
                    </option>
                    <option value="SS2" className="form-control">
                      SSS2
                    </option>
                    <option value="SS3" className="form-control">
                      SSS3
                    </option>
                  </select>
                  <div className="text-danger">
                    {formik.touched.previousClass &&
                      formik.errors.previousClass}
                  </div>
                </div>
                <div className="col-4 p-3">
                  <label htmlFor="" className="form-label">
                    Class To
                  </label>
                  <select
                    className={
                      formik.errors.classTo && formik.touched.classTo
                        ? "form-select input-style border-2 rounded-2 is-invalid"
                        : "form-select input-style border-2 rounded-2"
                    }
                    name="classTo"
                    onChange={formik.handleChange}
                    value={formik.values.classTo}
                    onBlur={formik.handleBlur}
                  >
                    <option value="" className="form-control">
                      ---
                    </option>
                    <option value="JSS1" className="form-control">
                      JSS1
                    </option>
                    <option value="JSS2" className="form-control">
                      JSS2
                    </option>
                    <option value="JSS3" className="form-control">
                      JSS3
                    </option>
                    <option value="SS1" className="form-control">
                      SSS1
                    </option>
                    <option value="SS2" className="form-control">
                      SSS2
                    </option>
                    <option value="SS3" className="form-control">
                      SSS3
                    </option>
                  </select>
                  <div className="text-danger">
                    {formik.touched.classTo && formik.errors.classTo}
                  </div>
                </div>
              </div>
              <div className="row ">
                <div className="col-4 p-4">
                  <label htmlFor="" className="form-label">
                    Nationality
                  </label>
                  <input
                    type="text"
                    className={
                      formik.errors.nationality && formik.touched.nationality
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    name="nationality"
                    placeholder="Nationality"
                    onChange={formik.handleChange}
                    value={formik.values.nationality}
                    onBlur={formik.handleBlur}
                  />
                  <div className="text-danger">
                    {formik.touched.nationality && formik.errors.nationality}
                  </div>
                </div>
                <div className="col-4 p-4">
                  <label htmlFor="">Tribe</label>
                  <input
                    type="text"
                    className={
                      formik.errors.tribe && formik.touched.tribe
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    name="tribe"
                    placeholder="Tribe"
                    onChange={formik.handleChange}
                    value={formik.values.tribe}
                    onBlur={formik.handleBlur}
                  />
                  <div className="text-danger">
                    {formik.touched.tribe && formik.errors.tribe}
                  </div>
                </div>
                <div className="col-4 p-4">
                  <label htmlFor="" className="form-label">
                    Religion
                  </label>
                  <input
                    className={
                      formik.errors.religion && formik.touched.religion
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    name="religion"
                    placeholder="Religion"
                    onChange={formik.handleChange}
                    value={formik.values.religion}
                    onBlur={formik.handleBlur}
                  />
                  <div className="text-danger">
                    {formik.touched.religion && formik.errors.religion}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6 p-4">
                  <label htmlFor="" className="form-label">
                    School Type
                  </label>
                  <select
                    className={
                      formik.errors.schoolingType &&
                      formik.touched.schoolingType
                        ? "form-select input-style border-2 rounded-2 is-invalid"
                        : "form-select input-style border-2 rounded-2"
                    }
                    name="schoolingType"
                    onChange={formik.handleChange}
                    value={formik.values.schoolingType}
                    onBlur={formik.handleBlur}
                  >
                    <option value="Day" className="form-control">
                      ---
                    </option>
                    <option value="Day" className="form-control">
                      Day
                    </option>
                    <option value="Boarding" className="form-control">
                      Boarding
                    </option>
                  </select>
                  <div className="text-danger">
                    {formik.touched.schoolingType &&
                      formik.errors.schoolingType}
                  </div>
                </div>
                <div className="col-6 p-4">
                  <label htmlFor="" className="form-label">
                    Previous School
                  </label>
                  <input
                    type="text"
                    className={
                      formik.errors.previousSchool &&
                      formik.touched.previousSchool
                        ? "form-control input-style border-2 rounded-2 is-invalid"
                        : "form-control input-style border-2 rounded-2"
                    }
                    name="previousSchool"
                    placeholder="Previous School"
                    onChange={formik.handleChange}
                    value={formik.values.previousSchool}
                    onBlur={formik.handleBlur}
                  />
                  <div className="text-danger">
                    {formik.touched.previousSchool &&
                      formik.errors.previousSchool}
                  </div>
                </div>
              </div>
              <div className="col-12 p-1">
                <button type="submit" className="btn btn-success form-control">
                  Edit Student
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
