import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Layout from "@/Components/ParentLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import style from "../../styles/SignUp.module.css";
import Swal from "sweetalert2";

export default function AddStudent() {
  const router = useRouter();
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    // console.log(router.query.parent_Id)
    if (router.query.parent_Id) {
      setParentId(router.query.parent_Id);
    }
    // console.log(parentId)
  }, [router.query.parent_Id]);

  // console.log(parentId)
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      parentId,
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
      surName: yup.string().required("This feild is Required!"),
      otherNames: yup.string().required("This feild is Required!"),
      gender: yup.string().required("This feild is Required!"),
      dateOfBirth: yup.date().required("This field is Required"),
      previousClass: yup.string().required("This feild is Required!"),
      classTo: yup.string().required("This feild is Required!"),
      nationality: yup.string().required("This feild is Required!"),
      tribe: yup.string().required("This feild is Required!"),
      religion: yup.string().required("This feild is Required!"),
      schoolingType: yup.string().required("This field is Required!"),
      previousSchool: yup.string().required("This field is required!"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      // console.log(values)
      const formData = new FormData();
      formData.append("surName", values.surName);
      formData.append("otherNames", values.otherNames);
      formData.append("gender", values.gender);
      formData.append("dateOfBirth", values.dateOfBirth);
      formData.append("previousClass", values.previousClass);
      formData.append("classTo", values.classTo);
      formData.append("nationality", values.nationality);
      formData.append("tribe", values.tribe);
      formData.append("religion", values.religion);
      formData.append("schoolType", values.schoolingType);
      formData.append("previousSchool", values.previousSchool);
      try {
        sessionStorage.setItem(
          "studentRegistration",
          JSON.stringify({ ...values, parentId }),
        );

        let studentName = `${values.surName} ${values.otherNames}`;
        const paidFor = "Admission Form";
        const price = 5000;
        const id = parentId;

        router.push(
          `/AdmissionCheckout?id=${id}&paidFor=${paidFor}&price=${price}&studentName=${studentName}`,
        );

        // const response = await axios.post("http://localhost:9500/student/addStudent",
        //   { ...values, parentId }
        // );
        // if (response.data.status) {
        //   Swal.fire('Success', response.data.message, 'success')
        //   router.push(`/DashBoard/${parentId}`)
        // } else {
        //   Swal.fire('Error', response.data.message, 'error')
        // }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Layout>
      <div
        // className="flex-grow-1"
        // style={{
        //   marginLeft: "250px",
        //   overflowY: "auto",
        //   padding: "20px",
        //   height: "100vh",
        // }}
      >
        <div>
          <div>
            <div className="text-center text-primary p-3">
              Admission form of non-refundable fee of N5000. <br></br>
              After filling this form you will be taken to checkout page.
            </div>

            <div
              className= 'my-4 col-md-12 mx-auto p-4 border rounded-3 bg-light'
            >
              <h2 className="text-center border-bottom p-3">Add New Student</h2>
              <form action="" onSubmit={formik.handleSubmit}>
                <div>
                  <div className="row align-items-center">
                    <div className="col-4 p-">
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
                  <div className="row align-items-center">
                    <div className="col-4 p-4">
                      <label htmlFor="" className="form-label">
                        Date Of Birth
                      </label>
                      <input
                        className={
                          formik.errors.dateOfBirth &&
                          formik.touched.dateOfBirth
                            ? "form-control input-style border-2 rounded-2 is-invalid"
                            : "form-control input-style border-2 rounded-2"
                        }
                        name="dateOfBirth"
                        onChange={formik.handleChange}
                        value={formik.values.dateOfBirth}
                        onBlur={formik.handleBlur}
                        type="date"
                      ></input>
                      <div className="text-danger">
                        {formik.touched.dateOfBirth &&
                          formik.errors.dateOfBirth}
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
                  <div className="row align-items-center">
                    <div className="col-4 p-4 align-items-center">
                      <label htmlFor="" className="form-label">
                        Nationality
                      </label>
                      <input
                        type="text"
                        className={
                          formik.errors.nationality &&
                          formik.touched.nationality
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
                        {formik.touched.nationality &&
                          formik.errors.nationality}
                      </div>
                    </div>
                    <div className="col-4 p-4">
                      <label htmlFor="" className="form-label">
                        Religion
                      </label>
                      <select
                        type="text"
                        className={
                          formik.errors.tribe && formik.touched.tribe
                            ? "form-select input-style border-2 rounded-2 is-invalid"
                            : "form-select input-style border-2 rounded-2"
                        }
                        name="tribe"
                        onChange={formik.handleChange}
                        value={formik.values.tribe}
                        onBlur={formik.handleBlur}
                      >
                        <option value="" className="form-control">
                          ---
                        </option>
                        <option value="Yoruba" className="form-control">
                          Yoruba
                        </option>
                        <option value="Hausa" className="form-control">
                          Hausa
                        </option>
                        <option value="Igbo" className="form-control">
                          Igbo
                        </option>
                      </select>
                      <div className="text-danger">
                        {formik.touched.tribe && formik.errors.tribe}
                      </div>
                    </div>
                    <div className="col-4 p-4">
                      <label htmlFor="" className="form-label">
                        Religion
                      </label>
                      <select
                        type="text"
                        className={
                          formik.errors.religion && formik.touched.religion
                            ? "form-select input-style border-2 rounded-2 is-invalid"
                            : "form-select input-style border-2 rounded-2"
                        }
                        name="religion"
                        onChange={formik.handleChange}
                        value={formik.values.religion}
                        onBlur={formik.handleBlur}
                      >
                        <option value="" className="form-control">
                          ---
                        </option>
                        <option value="Christian" className="form-control">
                          Christian
                        </option>
                        <option value="Muslim" className="form-control">
                          Muslim
                        </option>
                        <option value="Others" className="form-control">
                          Others
                        </option>
                      </select>
                      <div className="text-danger">
                        {formik.touched.religion && formik.errors.religion}
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
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
                    <button
                      type="submit"
                      className="btn btn-success form-control"
                    >
                      Add Student
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
