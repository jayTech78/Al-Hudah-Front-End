import React, { useEffect, useState } from "react";
import style from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Layout from "@/Components/ManagerLayout";
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
  Input,
} from "@chakra-ui/react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  VStack,
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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

const GetStaffs = () => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [classes, SetClasses] = useState([]);
  const [roles, SetRoles] = useState([]);
  const [subjects, setSubject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffsByRole, setStaffsByRole] = useState({});
  const [staffs, setStaffs] = useState([])
  const [staffId, setStaffId] = useState('')
  const [displayMessage, setDisplayMessage] = useState('')
  const [searchedStaff, setSearchedStaff] = useState([])
  const [classToTake, setClassToTake] = useState([])
  const [subjectToTake, setSubjectToTake] = useState([])

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = (localStorage.getItem("role") || "").toLowerCase();

  //   if (!token || role !== "manager") {
  //     router.push("/StaffLogin");
  //     return;
  //   }

  //   axios
  //     .get("http://localhost:9500/staff/getDashboard", {
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
    const fetchStaffsByRole = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9500/staff/getStaffsByRole"
        );
        setStaffsByRole(response.data.data);
      } catch (error) {
        console.error("Error fetching staff members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffsByRole();
  }, []);

  //get staffs without role
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9500/staff/getStaffs"
        );
        setStaffs(response.data.staffs);
        // console.log(response.data.staffs);
      } catch (error) {
        console.error("Error fetching staff members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:9500/class/getAllClasses"
        );
        SetClasses(response.classes);
        // console.log(response.classes);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:9500/role/getRoles"
        );
        SetRoles(response.roles);
        // console.log(response.roles);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:9500/subject/getSubjects"
        );
        setSubject(response.subjects);
        // console.log(response.subjects);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchSubjects();
  }, []);

  let formik = useFormik({
    initialValues: {
      surName: "",
      otherNames: "",
      email: "",
      phoneNo: "",
      address: "",
      gender: "",
      dateOfBirth: "",
      password: "",
      role: "",
      classTaken: "",
      subjectTaken: "",
      salary: "",
    },
    validationSchema: yup.object({
      surName: yup.string().required("This field is Required!"),
      otherNames: yup.string().required("This field is Required!"),
      gender: yup.string().required("This field is Required!"),
      dateOfBirth: yup.date().required("This field is Required"),
      phoneNo: yup.string().required("This field is Required!"),
      email: yup
        .string()
        .required("This field id required")
        .email("This is Not a Valid Email"),
      address: yup.string().required("This field is Required!"),
      password: yup.string().required("This field is Required!"),
      role: yup.string().required("This field is Required!"),
      classTaken: yup.string(),
      salary: yup.string().required("This field is Required!"),
      subjectTaken: yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values);
      const formData = new FormData();
      formData.append("surName", values.surName);
      formData.append("otherNames", values.otherNames);
      formData.append("gender", values.gender);
      formData.append("dateOfBirth", values.dateOfBirth);
      formData.append("phoneNo", values.phoneNo);
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("password", values.password);
      formData.append("role", values.role);
      formData.append("classTaken", values.classTaken);
      formData.append("salary", values.salary);
      formData.append("subjectTaken", values.subjectTaken);
      try {
        const response = await axios.post(
          "http://localhost:9500/staff/addStaff",
          values
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");

          const newStaff = response.data.staff; // ✅ comes from backend

          setStaffsByRole((prevStaffs) => {
            const role = newStaff.role;
            return {
              ...prevStaffs,
              [role]: [...(prevStaffs[role] || []), newStaff],
            };
          });
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

  //Details Modal
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();

  //Edit Modal
  const {
    isOpen: isUpdateStaffOpen,
    onOpen: onUpdateStaffOpen,
    onClose: onUpdateStaffClose,
  } = useDisclosure();

  const handleDelete = async (staffId, role) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data: response } = await axios.post(
            "http://localhost:9500/staff/deleteStaff",
            { staffId }
          );

          if (response.status) {
            Swal.fire("Deleted!", response.message, "success");

            // ✅ Optimistic update instead of reload
            setStaffsByRole((prevStaffsByRole) => {
              const updatedRoleStaffs = (prevStaffsByRole[role] || []).filter(
                (staff) => staff.staffId !== staffId
              );

              return {
                ...prevStaffsByRole,
                [role]: updatedRoleStaffs,
              };
            });
          } else {
            Swal.fire("Error", response.message, "error");
          }
        } catch (error) {
          console.error("Error deleting staff:", error);
          Swal.fire("Error", "Unable to delete staff.", "error");
        }
      }
    });
  };

  const handleDetails = (staff) => {
    setSelectedStaff(staff);
    onDetailsOpen();
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    console.log(selectedStaff);
    onUpdateStaffOpen();
  };

  //formik for updating staff
  const updateFormik = useFormik({
    initialValues: {
      surName: selectedStaff ? selectedStaff.surName : "",
      otherNames: selectedStaff ? selectedStaff.otherNames : "",
      gender: selectedStaff ? selectedStaff.gender : "",
      dateOfBirth: selectedStaff ? selectedStaff.dateOfBirth : "",
      email: selectedStaff ? selectedStaff.email : "",
      phoneNo: selectedStaff ? selectedStaff.phoneNo : "",
      address: selectedStaff ? selectedStaff.address : "",
      role: selectedStaff ? selectedStaff.role : "",
      classTaken: selectedStaff ? selectedStaff.classTaken : "",
      subjectTaken: selectedStaff ? selectedStaff.subjectTaken : "",
      salary: selectedStaff ? selectedStaff.salary : "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      surName: yup.string().required("This field is required!"),
      otherNames: yup.string().required("This field is required!"),
      email: yup
        .string()
        .required("This field is required!")
        .email("This is Not a Valid Email"),
      phoneNo: yup.string().required("This field is required!"),
      address: yup.string().required("This field is required!"),
      gender: yup.string().required("This field is required!"),
      dateOfBirth: yup.string().required("This field is required!"),
      role: yup.string().required("This field is required!"),
      classTaken: yup.string(),
      subjectTaken: yup.string(),
      salary: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `http://localhost:9500/staff/updateStaff/`,
          { ...values, staffId: selectedStaff.staffId }
        );

        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");

          // ✅ Update the local state correctly
          setStaffsByRole((prevStaffs) => {
            const role = selectedStaff.role;
            return {
              ...prevStaffs,
              [role]: prevStaffs[role].map((staff) =>
                staff.staffId === selectedStaff.staffId
                  ? { ...staff, ...values, staffId: selectedStaff.staffId }
                  : staff
              ),
            };
          });

          onUpdateStaffClose();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error updating staff:", error);
        Swal.fire("Error", "There was a problem updating the staff", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const searchStaff = (e) => {
    const inputId = e.target.value.trim();
    setStaffId(inputId);
    // console.log(staffs)
    const foundStaff = staffs.find((s) => s.staffId === inputId);
    setSelectedStaff(foundStaff || null);

    if (!foundStaff) {
      setDisplayMessage('Staff does not exist')
      return;
    }
    // console.log(foundStaff)
    const foundStaffArray = [foundStaff]
    console.log(foundStaffArray)
    setSearchedStaff(foundStaffArray)
  }

  return (
    <Layout>
      <Box size="lg" maxW="2000px" ratio={15 / 5}>
        <Box p={4}>
          <div className="mx-auto rounded-3">
            <h2 className="text-center ">STAFF</h2>
            <div className="d-flex mb-1 justify-content-between align">

              {/* Add Staff */}
              <div className="d-flex justify-content-center p-1 col-3">
                <Button
                  variant="Buttonsuccess"
                  onClick={onOpen}
                  className="form-control btn-success btn"
                >
                  Add Staff
                </Button>
              </div>
              <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset="slideInBottom"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Add Staff</ModalHeader>
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
                        <select
                          id="gender"
                          name="gender"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.gender}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
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
                        <label htmlFor="phoneNo">Phone No</label>
                        <input
                          id="phoneNo"
                          name="phoneNo"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.phoneNo}
                          className="form-control"
                        />
                        {formik.errors.phoneNo ? (
                          <div className="text-danger">
                            {formik.errors.phoneNo}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                          id="password"
                          name="password"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          className="form-control"
                        />
                        {formik.errors.password ? (
                          <div className="text-danger">
                            {formik.errors.password}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                          id="email"
                          name="email"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.email}
                          className="form-control"
                        />
                        {formik.errors.email ? (
                          <div className="text-danger">{formik.errors.email}</div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="address">Address</label>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.address}
                          className="form-control"
                        />
                        {formik.errors.address ? (
                          <div className="text-danger">
                            {formik.errors.address}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="role">Role</label>
                        <select
                          id="role"
                          name="role"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.role}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          {roles.map((item) => (
                            <option
                              key={item.roleId}
                              value={item.theRole}
                              className="form-control"
                            >
                              {item.theRole}
                            </option>
                          ))}
                        </select>
                        {formik.errors.role ? (
                          <div className="text-danger">{formik.errors.role}</div>
                        ) : null}
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="subjectTaken">Subject To Take</label>
                        <select
                          id="subjectTaken"
                          name="subjectTaken"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.subjectTaken}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          {subjects.map((item) => (
                            <option
                              key={item.subjectId}
                              value={item.subject}
                              className="form-control"
                            >
                              {item.subject}
                            </option>
                          ))}
                        </select>
                        {formik.errors.subjectTaken ? (
                          <div className="text-danger">{formik.errors.subjectTaken}</div>
                        ) : null}
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="classTaken">Class to Take</label>
                        <select
                          id="classTaken"
                          name="classTaken"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.classTaken}
                          className="form-select"
                        >
                          <option value="" className="form-control">
                            ---
                          </option>
                          {classes.map((item) => (
                            <option
                              key={item.classId}
                              value={item.className}
                              className="form-control"
                            >
                              {item.className}
                            </option>
                          ))}
                        </select>
                        {formik.errors.classTaken ? (
                          <div className="text-danger">
                            {formik.errors.classTaken}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="salary">Salary</label>
                        <input
                          id="salary"
                          name="salary"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.salary}
                          className="form-control"
                        />
                        {formik.errors.salary ? (
                          <div className="text-danger">
                            {formik.errors.salary}
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
                          Save Staff
                        </Button>
                      </ModalFooter>
                    </form>
                  </ModalBody>
                </ModalContent>
              </Modal>
              {/* Search Staff */}
              <div className="row p-1 col-9">
                <div className="col-8 d-flex align-tems-center">
                  <input className="form-control col-12" placeholder="Input Staff Id" onChange={searchStaff} value={staffId}></input>
                </div>

              </div>
            </div>
            {/* Display found Staff in a table */}
            {searchedStaff.map((staff) => (
              <Table>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Class Taken</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr key={staff._id}>
                    <Td>{staff.staffId}</Td>
                    <Td>
                      {staff.surName} {staff.otherNames}
                    </Td>
                    <Td>{staff.email}</Td>
                    <Td>{staff.classTaken || "Nill"}</Td>
                    <Td>
                      <Button
                        colorScheme=""
                        size="sm"
                        ml={2}
                        className="text-primary btn"
                        onClick={() => handleDetails(staff)}
                      >
                        Details
                      </Button>
                      <Button
                        colorScheme=""
                        onClick={() => handleEdit(staff)}
                        size="sm"
                        className="text-warning"
                      >
                        Edit
                      </Button>
                      <Button
                        className="text-danger"
                        colorScheme=""
                        onClick={() =>
                          handleDelete(staff.staffId, staff.role)
                        } // 👈 pass role too
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>

                </Tbody>
              </Table>
            ))}

            <Tabs
  variant="enclosed"
  width="100%"
>
  {/* Tabs */}
  <TabList
    overflowX="auto"
    whiteSpace="nowrap"
    width="100%"
  >
    {Object.keys(staffsByRole).map((role) => (
      <Tab key={role} flexShrink={0}>
        {role}
      </Tab>
    ))}
  </TabList>

  <TabPanels>
    {Object.keys(staffsByRole).map((role) => (
      <TabPanel
        key={role}
        px={{ base: 0, md: 4 }}
        py={4}
      >
        {/* IMPORTANT: allow table to scroll horizontally */}
        <Box width="100%" overflowX="auto">
          <Table
            variant="simple"
            width="100%"
            minWidth="800px"
          >
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Class Taken</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>

            <Tbody>
              {staffsByRole[role].map((staff) => (
                <Tr key={staff._id}>
                  <Td>
                    {staff.staffId}
                  </Td>

                  <Td>
                    {staff.surName} {staff.otherNames}
                  </Td>

                  <Td>
                    {staff.email}
                  </Td>

                  <Td>
                    {staff.classTaken || "Nill"}
                  </Td>

                  <Td>
                    <Flex
                      gap={2}
                      wrap="wrap"
                    >
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() =>
                          handleDetails(staff)
                        }
                      >
                        Details
                      </Button>

                      <Button
                        size="sm"
                        colorScheme="yellow"
                        onClick={() =>
                          handleEdit(staff)
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() =>
                          handleDelete(
                            staff.staffId,
                            role
                          )
                        }
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </TabPanel>
    ))}
  </TabPanels>
</Tabs>

            {selectedStaff && (
              <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Student Details</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <p>
                      <strong>Staff ID:</strong> {selectedStaff.staffId}
                    </p>
                    <p>
                      <strong>Name:</strong> {selectedStaff.surName}{" "}
                      {selectedStaff.otherNames}
                    </p>

                    <p>
                      <strong>Gender:</strong> {selectedStaff.gender}
                    </p>
                    <p>
                      <strong>Date Of Birth:</strong>{" "}
                      {selectedStaff.dateOfBirth}
                    </p>
                    <p>
                      <strong>Phone No:</strong>{" "}
                      {selectedStaff.phoneNo || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedStaff.email || "N/A"}
                    </p>
                    <p>
                      <strong>Address</strong> {selectedStaff.address || "N/A"}
                    </p>
                    <p>
                      <strong>Role:</strong> {selectedStaff.role}
                    </p>
                    <p>
                      <strong>Class Taken:</strong> {selectedStaff.classTaken}
                    </p>
                    <p>
                      <strong>Subject Taken:</strong>{" "}
                      {selectedStaff.subjectTaken}
                    </p>
                    <p>
                      <strong>Salary:</strong> {selectedStaff.salary}
                    </p>
                    <p>
                      <strong>Date Registered:</strong>{" "}
                      {new Date(
                        selectedStaff.dateRegistered
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

            <Modal isOpen={isUpdateStaffOpen} onClose={onUpdateStaffClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Staff</ModalHeader>
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
                      <Input
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
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        type="text"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.gender}
                        className="form-select"
                      >
                        <option value="" className="form-control">
                          ---
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
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
                        onChange={updateFormik.handleChange}
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
                      <label htmlFor="phoneNo">Phone No</label>
                      <input
                        id="phoneNo"
                        name="phoneNo"
                        type="text"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.phoneNo}
                        className="form-control"
                      />
                      {updateFormik.errors.phoneNo ? (
                        <div className="text-danger">
                          {updateFormik.errors.phoneNo}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="text"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.email}
                        className="form-control"
                      />
                      {updateFormik.errors.email ? (
                        <div className="text-danger">
                          {updateFormik.errors.email}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="address">Address</label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.address}
                        className="form-control"
                      />
                      {updateFormik.errors.address ? (
                        <div className="text-danger">
                          {updateFormik.errors.address}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="role">Role</label>
                      <select
                        id="role"
                        name="role"
                        type="text"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.role}
                        className="form-select"
                      >
                        <option value="" className="form-control">
                          ---
                        </option>
                        {roles.map((item) => (
                          <option
                            key={item.roleId}
                            value={item.theRole}
                            className="form-control"
                          >
                            {item.theRole}
                          </option>
                        ))}
                      </select>
                      {updateFormik.errors.role ? (
                        <div className="text-danger">
                          {updateFormik.errors.role}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="subjectTaken">Subject To Take</label>
                      <select
                        id="subjectTaken"
                        name="subjectTaken"
                        type="text"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.subjectTaken}
                        className="form-select"
                      >
                        <option value="" className="form-control">
                          ---
                        </option>
                        {subjects.map((item) => (
                          <option
                            key={item.subjectId}
                            value={item.subject}
                            className="form-control"
                          >
                            {item.subject}
                          </option>
                        ))}
                      </select>
                      {updateFormik.errors.role ? (
                        <div className="text-danger">
                          {updateFormik.errors.role}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="classTaken">Class to Take</label>
                      <select
                        id="classTaken"
                        name="classTaken"
                        type="text"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.classTaken}
                        className="form-select"
                      >
                        <option value="" className="form-control">
                          ---
                        </option>
                        {classes.map((item) => (
                          <option
                            key={item.classId}
                            value={item.className}
                            className="form-control"
                          >
                            {item.className}
                          </option>
                        ))}
                      </select>
                      {updateFormik.errors.classTaken ? (
                        <div className="text-danger">
                          {updateFormik.errors.classTaken}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="salary">Salary</label>
                      <input
                        id="salary"
                        name="salary"
                        type="text"
                        onChange={updateFormik.handleChange}
                        value={updateFormik.values.salary}
                        className="form-control"
                      />
                      {updateFormik.errors.salary ? (
                        <div className="text-danger">
                          {updateFormik.errors.salary}
                        </div>
                      ) : null}
                    </div>
                    <ModalFooter>
                      <Button colorScheme="green" type="submit">
                        Edit Staff
                      </Button>
                      <Button onClick={onUpdateStaffClose} className="ms-2">
                        Cancel
                      </Button>
                    </ModalFooter>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        </Box>
      </Box>
    </Layout>
  );
};

export default GetStaffs;