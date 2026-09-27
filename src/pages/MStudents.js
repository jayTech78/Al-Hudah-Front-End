import React, { useEffect, useState } from "react";
import style from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "@/utils/api";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  AspectRatio,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Box,
  TableContainer,
  Input,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Layout from "@/Components/ManagerLayout";

const GetStudents = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [classes, SetClasses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchedStudent, setSearchedStudent] = useState([])
  const [studentId, setStudentId] = useState('')
  //Details Modal
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();
  //Edit Modal
  const {
    isOpen: isUpdateStudentOpen,
    onOpen: onUpdateStudentOpen,
    onClose: onUpdateStudentClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get(
          "/student/getStudents"
        );
        setStudents(response.students);
        // console.log(response.students);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const [displayMessage, setDisplayMessage] = useState("")

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = (localStorage.getItem("role") || "").toLowerCase();

  //   if (!token || (role !== "manager")) {
  //     router.push("/StaffLogin");
  //     return;
  //   }

  //   api
  //     .get("/staff/getDashboard", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       if (!response.data.status) {
  //         router.push("/StaffLogin");
  //       }
  //     })
  //     .catch(() => router.push("/StaffLogin"));
  // }, [router]);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get(
          "/class/getClasses"
        );
        SetClasses(response.classes);
        // console.log(response.classes);
        console.log(classes.className);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchClasses();
  }, []);
  let formik = useFormik({
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
      // file: yup.mixed().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values);
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
        const response = await api.post(
          "/student/addStudent",
          values
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          router.reload();
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

  // const handleDelete = async (studentId) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "This action cannot be undone!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //           `/student/deleteStudent/`,
  //           { studentId }
  //         );
  //         if (response.data.status) {
  //           Swal.fire("Deleted!", "Student has been removed.", "success");
  //           setStudents((prevStudents) =>
  //             prevStudents.filter((student) => student.studentId !== studentId)
  //           );
  //         } else {
  //           Swal.fire("Error", response.data.message, "error");
  //         }
  //       } catch (error) {
  //         console.error("Error deleting student:", error);
  //         Swal.fire("Error", "Unable to delete student.", "error");
  //       }
  //     }
  //   });
  // };

  const handleDetails = (student) => {
    setSelectedStudent(student);
    onDetailsOpen();
  };
  const handleEdit = (student) => {
    setSelectedStudent(student);
    onUpdateStudentOpen();
  };
  //formik for updating student
  const updateFormik =
    useFormik({
      initialValues: {
        surName: selectedStudent?.surName || "",
        otherNames: selectedStudent?.otherNames || "",
        nationality: selectedStudent?.nationality || "",
        tribe: selectedStudent?.tribe || "",
        dateOfBirth: selectedStudent?.dateOfBirth || "",
        gender: selectedStudent?.gender || "",
        previousSchool: selectedStudent?.previousSchool || "",
        religion: selectedStudent?.religion || "",
        status: selectedStudent?.status || "",
        offence: selectedStudent?.offence || "",
      },
      enableReinitialize: true,
      validationSchema: yup.object({
        surName: yup.string().required("This field is required!"),
        otherNames: yup.string().required("This field is required!"),
        nationality: yup.string().required("This field is required!"),
        tribe: yup.string().required("This field is required!"),
        dateOfBirth: yup.string().required("This field is required!"),
        gender: yup.string().required("This field is required!"),
        previousSchool: yup.string().required("This field is required!"),
        religion: yup.string().required("This field is required!"),
        status: yup.string().required("This field is required!"),
        offence: yup.string().required("This field is required!"),

      }),
      onSubmit: async (values, { setSubmitting }) => {
        try {
          const response = await api.post(
            "/student/editStudent",
            { ...values, studentId: selectedStudent.studentId } // Using state value for parentId
          );
          if (response.data.status) {
            Swal.fire("Success", response.data.message, "success");
            setStudents((prevStudents) =>
              prevStudents.map((student) =>
                student.studentId === selectedStudent.studentId
                  ? { ...student, ...values }
                  : student
              )
            );
            onUpdateStudentClose();
          } else {
            Swal.fire("Error", response.data.message, "error");
          }
        } catch (error) {
          console.error("Error updating student:", error);
          Swal.fire("Error", "There was a problem updating the student", "error");
        } finally {
          setSubmitting(false);
        }
      }
    });

  const searchStudent = (e) => {
    const inputId = e.target.value.trim();
    setStudentId(inputId);
    // console.log(staffs)
    const foundStudent = students.find((s) => s.studentId === inputId);
    setSelectedStudent(foundStudent || null);

    if (!foundStudent) {
      setDisplayMessage('Student does not exist')
      return;
    }
    // console.log(foundStaff)
    const foundStudentArray = [foundStudent]
    // console.log(foundParentArray)
    setSearchedStudent(foundStudentArray)
  }

  return (
    <Layout>
      <Box size="lg" maxW="2000px" ratio={15 / 5}>
        <Box p={4}>
          <div className="mx-auto col-12 rounded-3">
            <div className="mx-auto rounded-3">
              <h2 className="text-center ">STUDENTS</h2>
              <div className="row d-flex justify-space-between">
                <div className="col-4">
                  <Button
                    variant="Buttonsuccess"
                    onClick={onOpen}
                    className="w-100 btn-success btn"
                  >
                    Add Student
                  </Button>
                </div>
                <div className="col-8">
                  <div className="col-12">
                    <input
                      className="form-control"
                      placeholder="Search Student"
                      onChange={searchStudent} value={studentId}
                    ></input>
                  </div>
                </div>
              </div>
              {searchedStudent.map((student) => (
                <Table variant="striped" colorScheme="teal">
                  {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                  <Thead>
                    <Tr>
                      <Th>Student Id</Th>
                      <Th>Name</Th>
                      <Th>Class</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {students.map((item) => (
                      <Tr>
                        <Td>{item.studentId}</Td>
                        <Td>
                          {item.surName} {item.otherNames}
                        </Td>
                        <Td>{item.classTo}</Td>
                        <Td>
                          <Button
                            colorScheme=""
                            size="sm"
                            ml={2}
                            className="text-primary"
                            onClick={() => handleDetails(item)}
                          >
                            Details
                          </Button>
                          <Button
                            colorScheme=""
                            size="sm"
                            className="text-warning"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>

                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ))}
              <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset="slideInBottom"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Add Student</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="form-group mb-3">
                        <label htmlFor="surName">SurName</label>
                        <input
                          id="surName"
                          name="surName"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.surName}
                          className="form-control"
                        />
                        {formik.errors.surName ? (
                          <div className="text-danger">
                            {formik.errors.surName}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="otherNames">Other Names</label>
                        <input
                          id="otherNames"
                          name="otherNames"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.otherNames}
                          className="form-control"
                        />
                        {formik.errors.otherNames ? (
                          <div className="text-danger">
                            {formik.errors.otherNames}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="gender">Gender</label>
                        <input
                          id="gender"
                          name="gender"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.gender}
                          className="form-control"
                        />
                        {formik.errors.gender ? (
                          <div className="text-danger">
                            {formik.errors.gender}
                          </div>
                        ) : null}
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="dateOfBirth">Date Of Birth</label>
                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          onChange={formik.handleChange}
                          value={formik.values.dateOfBirth}
                          className="form-control"
                        />
                        {formik.errors.dateOfBirth ? (
                          <div className="text-danger">
                            {formik.errors.dateOfBirth}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="previousClass">Previous Class</label>
                        <select
                          id="previousClass"
                          name="previousClass"
                          type=""
                          onChange={formik.handleChange}
                          value={formik.values.previousClass}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          {classes?.map((item) => (
                            <option
                              key={item.classId}
                              value={item.className}
                              className="form-control"
                            >
                              {item.className}
                            </option>
                          ))}
                        </select>
                        {formik.errors.previousClass ? (
                          <div className="text-danger">
                            {formik.errors.previousClass}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="classTo">Class To</label>
                        <select
                          id="classTo"
                          name="classTo"
                          type=""
                          onChange={formik.handleChange}
                          value={formik.values.classTo}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          {classes?.map((item) => (
                            <option
                              key={item.classId}
                              value={item.className}
                              className="form-control"
                            >
                              {item.className}
                            </option>
                          ))}
                        </select>
                        {formik.errors.classTo ? (
                          <div className="text-danger">
                            {formik.errors.classTo}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="nationality">Nationality</label>
                        <input
                          id="nationality"
                          name="nationality"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.nationality}
                          className="form-control"
                        />
                        {formik.errors.nationality ? (
                          <div className="text-danger">
                            {formik.errors.nationality}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="tribe">Tribe</label>
                        <input
                          id="tribe"
                          name="tribe"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.tribe}
                          className="form-control"
                        />
                        {formik.errors.tribe ? (
                          <div className="text-danger">
                            {formik.errors.tribe}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="religion">Religion</label>
                        <input
                          id="religion"
                          name="religion"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.religion}
                          className="form-control"
                        />
                        {formik.errors.religion ? (
                          <div className="text-danger">
                            {formik.errors.religion}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="schoolingType">School Type</label>
                        <select
                          id="schoolingType"
                          name="schoolingType"
                          type=""
                          onChange={formik.handleChange}
                          value={formik.values.schoolingType}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          <option value="Day" className="form-control">
                            Day
                          </option>
                          <option value="" className="form-control">
                            Boarding
                          </option>
                          {/* {classes.map((item) => {
                            <option
                              value={item.schoolingType}
                              className="form-control"
                            >
                              {item.schoolingType}
                            </option>;
                          })} */}
                        </select>
                        {formik.errors.schoolingType ? (
                          <div className="text-danger">
                            {formik.errors.schoolingType}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="previousSchool">Previous School</label>
                        <input
                          id="previousSchool"
                          name="previousSchool"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.previousSchool}
                          className="form-control"
                        />
                        {formik.errors.previousSchool ? (
                          <div className="text-danger">
                            {formik.errors.previousSchool}
                          </div>
                        ) : null}
                      </div>
                      <ModalFooter>
                        <Button
                          colorScheme="green"
                          onClick={onClose}
                          type="submit"
                          mr={3}
                        >
                          Save Student
                        </Button>
                      </ModalFooter>
                    </form>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <TableContainer>
                <Table variant="striped" colorScheme="teal">
                  {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                  <Thead>
                    <Tr>
                      <Th>Student Id</Th>
                      <Th>Name</Th>
                      <Th>Class</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {students.map((item) => (

                      <Tr key={item._id}>

                        <Td>{item.studentId}</Td>
                        <Td>
                          {item.surName} {item.otherNames}
                        </Td>
                        <Td>{item.classTo}</Td>
                        <Td>
                          <Button
                            colorScheme=""
                            size="sm"
                            ml={2}
                            className="text-primary"
                            onClick={() => handleDetails(item)}
                          >
                            Details
                          </Button>
                          <Button
                            colorScheme=""
                            size="sm"
                            className="text-warning"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>

                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              {/* Modal for student Details */}
              {selectedStudent && (
                <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Student Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <p>
                        <strong>Student ID:</strong> {selectedStudent.studentId}
                      </p>
                      <p>
                        <strong>Name:</strong> {selectedStudent.surName}{" "}
                        {selectedStudent.otherNames}
                      </p>
                      <p>
                        <strong>Parent Name:</strong> {selectedStudent.parentName}
                      </p>

                      <p>
                        <strong>Parent Phone:</strong> {selectedStudent.parentPhone}
                      </p>
                      <p>
                        <strong>Admission Status:</strong>{" "}
                        {selectedStudent.status}
                      </p>
                      <p>
                        <strong>Gender:</strong> {selectedStudent.gender}
                      </p>
                      <p>
                        <strong>Date Of Birth:</strong>{" "}
                        {selectedStudent.dateOfBirth}
                      </p>
                      {selectedStudent.status == 'Admitted' && (
                        <>
                          <p>
                            <strong>Class Admitted To:</strong>{" "}
                            {selectedStudent.classAdmittedTo}
                          </p>
                        </>
                      )}
                      <p>
                        <strong>Previous School:</strong>{" "}
                        {selectedStudent.previousSchool || "N/A"}
                      </p>
                      <p>
                        <strong>Previous Class:</strong>{" "}
                        {selectedStudent.previousClass || "N/A"}
                      </p>
                      <p>
                        <strong>Class To:</strong>{" "}
                        {selectedStudent.classTo || "N/A"}
                      </p>
                      <p>
                        <strong>Religion:</strong> {selectedStudent.religion}
                      </p>
                      <p>
                        <strong>Nationality:</strong>{" "}
                        {selectedStudent.nationality}
                      </p>
                      <p>
                        <strong>Tribe:</strong> {selectedStudent.tribe}
                      </p>
                      <p>
                        <strong>Schooling Type:</strong>{" "}
                        {selectedStudent.schoolingType}
                      </p>
                      <p>
                        <strong>Date Registered:</strong>{" "}
                        {new Date(
                          selectedStudent.dateRegistered
                        ).toLocaleDateString()}
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              )}
              {/*Edit Student Modal*/}
              <Modal
                isOpen={isUpdateStudentOpen}
                onClose={onUpdateStudentClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Edit Student</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form onSubmit={updateFormik.handleSubmit}>
                      <div className="form-group mb-3">
                        <label htmlFor="surName">SurName</label>
                        <input
                          id="surName"
                          name="surName"
                          type="text"
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.surName}
                          className="form-control"
                        />
                        {updateFormik.errors.surName ? (
                          <div className="text-danger">
                            {updateFormik.errors.surName}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="otherNames">Other Names</label>
                        <input
                          id="otherNames"
                          name="otherNames"
                          type="text"
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.otherNames}
                          className="form-control"
                        />
                        {updateFormik.errors.otherNames ? (
                          <div className="text-danger">
                            {updateFormik.errors.otherNames}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="Gender">Gender</label>
                        <select
                          id="schoolingType"
                          name="schoolingType"
                          type=""
                          onChange={formik.handleChange}
                          value={updateFormik.values.gender}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          <option value="Male" className="form-control">
                            Male
                          </option>
                          <option value="Female" className="form-control">
                            Female
                          </option>
                        </select>
                        {updateFormik.errors.gender ? (
                          <div className="text-danger">
                            {updateFormik.errors.gender}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="dateOfBirth">Date Of Birth</label>
                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          onChange={formik.handleChange}
                          value={updateFormik.values.dateOfBirth}
                          className="form-control"
                        />
                        {updateFormik.errors.dateOfBirth ? (
                          <div className="text-danger">
                            {updateFormik.errors.dateOfBirth}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="previousClass">Previous Class</label>
                        <select
                          id="previousClass"
                          name="previousClass"
                          type=""
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.previousClass}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          {classes?.map((item) => (
                            <option
                              key={item.classId}
                              value={item.className}
                              className="form-control"
                            >
                              {item.className}
                            </option>
                          ))}
                        </select>
                        {updateFormik.errors.previousClass ? (
                          <div className="text-danger">
                            {updateFormik.errors.previousClass}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="classTo">Class To</label>
                        <select
                          id="classTo"
                          name="classTo"
                          type=""
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.classTo}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          {classes?.map((item) => (
                            <option
                              key={item.classId}
                              value={item.className}
                              className="form-control"
                            >
                              {item.className}
                            </option>
                          ))}
                        </select>
                        {updateFormik.errors.classTo ? (
                          <div className="text-danger">
                            {updateFormik.errors.classTo}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="nationality">Nationality</label>
                        <input
                          id="nationality"
                          name="nationality"
                          type="text"
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.nationality}
                          className="form-control"
                        />
                        {updateFormik.errors.nationality ? (
                          <div className="text-danger">
                            {updateFormik.errors.nationality}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="tribe">Tribe</label>
                        <input
                          id="tribe"
                          name="tribe"
                          type="text"
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.tribe}
                          className="form-control"
                        />
                        {updateFormik.errors.tribe ? (
                          <div className="text-danger">
                            {updateFormik.errors.tribe}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="religion">Religion</label>
                        <input
                          id="religion"
                          name="religion"
                          type="text"
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.religion}
                          className="form-control"
                        />
                        {updateFormik.errors.religion ? (
                          <div className="text-danger">
                            {updateFormik.errors.religion}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="schoolingType">School Type</label>
                        <select
                          id="schoolingType"
                          name="schoolingType"
                          type=""
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.schoolingType}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          <option value="Day" className="form-control">
                            Day
                          </option>
                          <option value="" className="form-control">
                            Boarding
                          </option>
                          {/* {classes.map((item) => {
                            <option
                              value={item.schoolingType}
                              className="form-control"
                            >
                              {item.schoolingType}
                            </option>;
                          })} */}
                        </select>
                        {updateFormik.errors.schoolingType ? (
                          <div className="text-danger">
                            {updateFormik.errors.schoolingType}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="previousSchool">Previous School</label>
                        <input
                          id="previousSchool"
                          name="previousSchool"
                          type="text"
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.previousSchool}
                          className="form-control"
                        />
                        {updateFormik.errors.previousSchool ? (
                          <div className="text-danger">
                            {updateFormik.errors.previousSchool}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="classTo">Status</label>
                        <select
                          id="status"
                          name="status"
                          type=""
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.status}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          <option value="Admitted" className="form-control">
                            Admitted
                          </option>
                          <option value="Left" className="form-control">
                            Left
                          </option>
                          <option value="Suspended" className="form-control">
                            Suspended
                          </option>
                          <option value="Blacklisted" className="form-control">
                            Blacklisted
                          </option>
                          <option value="rusticated" className="form-control">
                            Rusticated
                          </option>
                        </select>
                        {updateFormik.errors.status ? (
                          <div className="text-danger">
                            {updateFormik.errors.status}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="Offence">Offence</label>
                        <input
                          id="Offence"
                          name="Offence"
                          type="text"
                          onChange={updateFormik.handleChange}
                          value={updateFormik.values.offence}
                          className="form-control"
                        />
                        {updateFormik.errors.offence ? (
                          <div className="text-danger">
                            {updateFormik.errors.offence}
                          </div>
                        ) : null}
                      </div>
                      <ModalFooter>
                        <Button
                          colorScheme="green"
                          onClick={onClose}
                          type="submit"
                          mr={3}
                        >
                          Save Student
                        </Button>
                      </ModalFooter>
                    </form>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </div>
          </div>
        </Box>
      </Box>
    </Layout>
  );
};

export default GetStudents;