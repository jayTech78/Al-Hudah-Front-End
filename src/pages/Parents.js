import React, { useEffect, useMemo, useState } from "react";
import style from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "@/utils/api";
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
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  TableContainer,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

const GetParents = () => {
  const router = useRouter();
  const [parents, SetParents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState(null);
  const [parentId, setParentId] = useState('');
  const [searchedParent, setSearchedParent] = useState([])

  // NEW: cache all students for instant ID->name lookup
  const [allStudents, setAllStudents] = useState([]);
  const idToStudent = useMemo(() => {
    const map = new Map();
    allStudents.forEach((s) => map.set(String(s.studentId), s));
    return map;
  }, [allStudents]);

  // Add Parent: free-text field for comma-separated IDs + live matches
  const [addStudentIdsText, setAddStudentIdsText] = useState("");
  const [addMatchedStudents, setAddMatchedStudents] = useState([]);
  const [addUnmatchedIds, setAddUnmatchedIds] = useState([]);

  // Update Parent: free-text field for comma-separated IDs + live matches
  const [updateStudentIdsText, setUpdateStudentIdsText] = useState("");
  const [updateMatchedStudents, setUpdateMatchedStudents] = useState([]);
  const [updateUnmatchedIds, setUpdateUnmatchedIds] = useState([]);

  // Details Modal
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();

  // Edit Modal
  const {
    isOpen: isUpdateParentOpen,
    onOpen: onUpdateParentOpen,
    onClose: onUpdateParentClose,
  } = useDisclosure();
  
  // authorization
  //  useEffect(() => {
  //         const token = localStorage.getItem("token");
  //         const role = (localStorage.getItem("role") || "").toLowerCase();

  //         if (!token || (role !== "manager")) {
  //           router.push("/StaffLogin");
  //           return;
  //         }

  //         api
  //           .get("/staff/getDashboard", {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //               "Content-Type": "application/json",
  //               Accept: "application/json",
  //             },
  //           })
  //           .then((response) => {
  //             if (!response.data.status) {
  //               router.push("/StaffLogin");
  //             }
  //           })
  //           .catch(() => router.push("/StaffLogin"));
  //       }, [router]);

  // Fetch parents + students on load
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [parentsRes, studentsRes] = await Promise.all([
          api.get("/parent/getParents"),
          api.get("/student/getStudents"),
        ]);
        SetParents(parentsRes.data?.parents || []);
        setAllStudents(studentsRes.data?.students || []);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const splitIds = (text) =>
    text
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

  const computeMatches = (ids) => {
    const matched = [];
    const unmatched = [];
    ids.forEach((id) => {
      const hit = idToStudent.get(String(id));
      if (hit) matched.push(hit);
      else unmatched.push(id);
    });
    return { matched, unmatched };
  };

  // ADD PARENT FORM
  const addValidationSchema = yup.object({
    surName: yup.string().required("This field Is required"),
    otherNames: yup.string().required("This Field Is Required"),
    email: yup.string().required("This field Is required").email("This is Not a Valid Email"),
    phoneNo: yup.string().required("This field Is required"),
    address: yup.string().required("This field Is required"),
    occupation: yup.string().required("This field Is Required"),
    password: yup
      .string()
      .matches(
        /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/,
        "Password must contain 4-10 Characters, at least One number and at least one UPPERCASE letter"
      )
      .required("This field Is required"),
    studentIds: yup
      .array()
      .of(yup.string().required("Student ID cannot be empty"))
      .min(1, "At least one Student ID is required"),
  });

  const formik = useFormik({
    initialValues: {
      surName: "",
      otherNames: "",
      email: "",
      phoneNo: "",
      address: "",
      password: "",
      confirmPassword: "",
      occupation: "",
      studentIds: [], // keep as array for backend
    },
    validationSchema: addValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await api.post("/parent/parentSignUp", values);
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          resetForm();
          setAddStudentIdsText("");
          setAddMatchedStudents([]);
          setAddUnmatchedIds([]);
          router.reload();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error saving parent:", error);
        Swal.fire("Error", "There was an error saving the parent", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle typing of Add studentIds and show names immediately
  const handleAddStudentIdsChange = (e) => {
    const text = e.target.value;
    setAddStudentIdsText(text);
    const ids = splitIds(text);
    formik.setFieldValue("studentIds", ids);
    const { matched, unmatched } = computeMatches(ids);
    setAddMatchedStudents(matched);
    setAddUnmatchedIds(unmatched);
  };

  const handleDelete = async (parentId) => {
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
          const response = await api.post(`/parent/deleteParent/`, {
            parentId,
          });
          if (response.data.status) {
            Swal.fire("Deleted!", "Parent has been removed.", "success");
            SetParents((prevParents) =>
              prevParents.filter((parent) => parent.parentId !== parentId)
            );
          } else {
            Swal.fire("Error", response.data.message, "error");
          }
        } catch (error) {
          console.error("Error deleting parent:", error);
          Swal.fire("Error", "Unable to delete parent.", "error");
        }
      }
    });
  };

  const handleDetails = (parent) => {
    setSelectedParent(parent);
    onDetailsOpen();
  };
  const handleEdit = (parent) => {
    setSelectedParent(parent);
    // seed the update studentIds input text and preview
    const text = (parent.studentIds || []).join(", ");
    setUpdateStudentIdsText(text);
    const { matched, unmatched } = computeMatches(parent.studentIds || []);
    setUpdateMatchedStudents(matched);
    setUpdateUnmatchedIds(unmatched);
    onUpdateParentOpen();
  };

  // UPDATE PARENT FORM
  const updateFormik = useFormik({
    initialValues: {
      surName: selectedParent ? selectedParent.surName : "",
      otherNames: selectedParent ? selectedParent.otherNames : "",
      email: selectedParent ? selectedParent.email : "",
      phoneNo: selectedParent ? selectedParent.phoneNo : "",
      address: selectedParent ? selectedParent.address : "",
      occupation: selectedParent ? selectedParent.occupation : "",
      studentIds: selectedParent ? selectedParent.studentIds || [] : [],
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      surName: yup.string().required("This field is required!"),
      otherNames: yup.string().required("This field is required!"),
      email: yup.string().required("This field id required").email("This is Not a Valid Email"),
      phoneNo: yup.string().required("This field is required!"),
      address: yup.string().required("This field is required!"),
      occupation: yup.string().required("This field is required!"),
      studentIds: yup
        .array()
        .of(yup.string().required("Student ID cannot be empty"))
        .min(1, "At least one Student ID is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post(`/parent/updateParent/`, {
          ...values,
          parentId: selectedParent.parentId,
        });
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          SetParents((prevParents) =>
            prevParents.map((parent) =>
              parent.parentId === selectedParent.parentId ? { ...parent, ...values } : parent
            )
          );
          onUpdateParentClose();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error updating parent:", error);
        Swal.fire("Error", "There was a problem updating the parent", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle typing of Update studentIds and show names immediately
  const handleUpdateStudentIdsChange = (e) => {
    const text = e.target.value;
    setUpdateStudentIdsText(text);
    const ids = splitIds(text);
    updateFormik.setFieldValue("studentIds", ids);
    const { matched, unmatched } = computeMatches(ids);
    setUpdateMatchedStudents(matched);
    setUpdateUnmatchedIds(unmatched);
  };

  // For details modal: show parent students (from API if provided) or resolve via allStudents
  const detailStudents = useMemo(() => {
    if (!selectedParent) return [];
    if (Array.isArray(selectedParent.students) && selectedParent.students.length > 0) {
      return selectedParent.students;
    }
    const ids = selectedParent.studentIds || [];
    return allStudents.filter((s) => ids.includes(String(s.studentId)));
  }, [selectedParent, allStudents]);

  const searchParent = (e) => {
    const inputId = e.target.value.trim();
    setParentId(inputId);
    // console.log(staffs)
    const foundParent = parents.find((s) => s.parentId === inputId);
    setSelectedParent(foundParent || null);

    if (!foundParent) {
      setDisplayMessage('Parent does not exist')
      return;
    }
    // console.log(foundStaff)
    const foundParentArray = [foundParent]
    // console.log(foundParentArray)
    setSearchedParent(foundParentArray)
  }

  return (
    <Layout>
      <div className="row">
        <div className="container">
          <div className="row flex-nowrap">
            <Box size="lg" maxW="2000px" ratio={15 / 5} className="">
              <Box p={4}>
                <div className="col-12  mx-auto rounded-3">
                  <h2 className="text-center border-bottom">PARENTS</h2>
                  <div className="row d-flex justify-content-center mx-auto my-2 align-items-center">
                    <div className="d-flex justify-content-center border-bottom col-4">
                      <Button
                        variant="Buttonsuccess"
                        onClick={onOpen}
                        className="w-100 btn-success btn p-2"
                      >
                        Add Parent
                      </Button>
                    </div>
                    <div className="col-8">
                      <input
                        className="form-control"
                        placeholder="Search Parent By Id"
                        onChange={searchParent} value={parentId}
                      ></input>
                    </div>
                  </div>
                  {searchedParent.map((staff) => (
                    <Table variant="striped" colorScheme="teal">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Name</Th>
                          <Th>Phone No</Th>
                          <Th>Email</Th>
                          <Th> Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {parents.map((item) => (
                          <Tr key={item.parentId}>
                            <Td>{item.parentId}</Td>
                            <Td>
                              {item.surName} {item.otherNames}
                            </Td>
                            <Td>{item.phoneNo}</Td>
                            <Td>{item.email}</Td>
                            <Td>
                              <div>
                                <Button
                                  variant="Buttondanger"
                                  size="sm"
                                  className="text-primary ms-2 btn-sm btn"
                                  onClick={() => handleDetails(item)}
                                >
                                  Details
                                </Button>
                                <Button
                                  variant="Buttonwarning"
                                  size="sm"
                                  className="text-warning ms-2 btn-sm btn"
                                  onClick={() => handleEdit(item)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="Buttondanger"
                                  size="sm"
                                  className="text-danger btn-sm btn"
                                  onClick={() => handleDelete(item.parentId)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ))}
                  {/* ADD PARENT MODAL */}
                  <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Add Parent</ModalHeader>
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
                              <div className="text-danger">{formik.errors.surName}</div>
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
                              <div className="text-danger">{formik.errors.otherNames}</div>
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
                              <div className="text-danger">{formik.errors.phoneNo}</div>
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
                              <div className="text-danger">{formik.errors.address}</div>
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
                              <div className="text-danger">{formik.errors.password}</div>
                            ) : null}
                          </div>
                          <div className="form-group mb-3">
                            <label htmlFor="occupation">Occupation</label>
                            <input
                              id="occupation"
                              name="occupation"
                              type="text"
                              onChange={formik.handleChange}
                              value={formik.values.occupation}
                              className="form-control"
                            />
                            {formik.errors.occupation ? (
                              <div className="text-danger">{formik.errors.occupation}</div>
                            ) : null}
                          </div>

                          {/* Student IDs input with live name preview */}
                          <div className="form-group mb-2">
                            <label htmlFor="studentIds">Student IDs (comma separated)</label>
                            <input
                              id="studentIds"
                              name="studentIds"
                              type="text"
                              onChange={handleAddStudentIdsChange}
                              value={addStudentIdsText}
                              className="form-control"
                              placeholder="e.g. STU001, STU002"
                            />
                            {formik.errors.studentIds && (
                              <div className="text-danger">{formik.errors.studentIds}</div>
                            )}
                          </div>

                          {/* Live preview for ADD */}
                          {addMatchedStudents.length > 0 && (
                            <div className="mb-2">
                              <strong>Matched Students:</strong>
                              <ul className="mb-0">
                                {addMatchedStudents.map((s) => (
                                  <li key={s.studentId}>
                                    {s.surName} {s.otherNames} ({s.studentId})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {addUnmatchedIds.length > 0 && (
                            <div className="mb-2 text-warning">
                              <strong>Unknown IDs:</strong> {addUnmatchedIds.join(", ")}
                            </div>
                          )}

                          <ModalFooter>
                            <Button colorScheme="green" type="submit" mr={3}>
                              Save Parent
                            </Button>
                          </ModalFooter>
                        </form>
                      </ModalBody>
                    </ModalContent>
                  </Modal>

                  {/* TABLE */}
                  <TableContainer>
                    <Table variant="striped" colorScheme="teal">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Name</Th>
                          <Th>Phone No</Th>
                          <Th>Email</Th>
                          <Th> Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {parents.map((item) => (
                          <Tr key={item.parentId}>
                            <Td>{item.parentId}</Td>
                            <Td>
                              {item.surName} {item.otherNames}
                            </Td>
                            <Td>{item.phoneNo}</Td>
                            <Td>{item.email}</Td>
                            <Td>
                              <div>
                                <Button
                                  variant="Buttondanger"
                                  size="sm"
                                  className="text-primary ms-2 btn-sm btn"
                                  onClick={() => handleDetails(item)}
                                >
                                  Details
                                </Button>
                                <Button
                                  variant="Buttonwarning"
                                  size="sm"
                                  className="text-warning ms-2 btn-sm btn"
                                  onClick={() => handleEdit(item)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="Buttondanger"
                                  size="sm"
                                  className="text-danger btn-sm btn"
                                  onClick={() => handleDelete(item.parentId)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>

                  {/* DETAILS MODAL */}
                  {selectedParent && (
                    <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Parent Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <p>
                            <strong>Parent ID:</strong> {selectedParent.parentId}
                          </p>
                          <p>
                            <strong>Name:</strong> {selectedParent.surName}{" "}
                            {selectedParent.otherNames}
                          </p>
                          <p>
                            <strong>Phone No:</strong> {selectedParent.phoneNo}
                          </p>
                          <p>
                            <strong>Email:</strong> {selectedParent.email}
                          </p>
                          <p>
                            <strong>Address :</strong> {selectedParent.address || "N/A"}
                          </p>
                          <p>
                            <strong>Occupation :</strong> {selectedParent.occupation || "N/A"}
                          </p>
                          <div className="mt-3">
                            <strong>Students:</strong>
                            {detailStudents.length > 0 ? (
                              <ul className="mb-0">
                                {detailStudents.map((s) => (
                                  <li key={s.studentId}>
                                    {s.surName} {s.otherNames} ({s.studentId})
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div>No students linked.</div>
                            )}
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} onClick={onDetailsClose}>
                            Close
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  )}

                  {/* UPDATE PARENT MODAL */}
                  <Modal isOpen={isUpdateParentOpen} onClose={onUpdateParentClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit Parent</ModalHeader>
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
                              <div className="text-danger">{updateFormik.errors.surName}</div>
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
                              <div className="text-danger">{updateFormik.errors.otherNames}</div>
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
                              <div className="text-danger">{updateFormik.errors.email}</div>
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
                              <div className="text-danger">{updateFormik.errors.phoneNo}</div>
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
                              <div className="text-danger">{updateFormik.errors.address}</div>
                            ) : null}
                          </div>
                          <div className="form-group mb-3">
                            <label htmlFor="occupation">Occupation</label>
                            <input
                              id="occupation"
                              name="occupation"
                              type="text"
                              onChange={updateFormik.handleChange}
                              value={updateFormik.values.occupation}
                              className="form-control"
                            />
                            {updateFormik.errors.occupation ? (
                              <div className="text-danger">{updateFormik.errors.occupation}</div>
                            ) : null}
                          </div>

                          {/* Student IDs input with live name preview (UPDATE) */}
                          <div className="form-group mb-2">
                            <label htmlFor="studentIds">Student IDs (comma separated)</label>
                            <input
                              id="studentIds"
                              name="studentIds"
                              type="text"
                              onChange={handleUpdateStudentIdsChange}
                              value={updateStudentIdsText}
                              className="form-control"
                              placeholder="e.g. STU001, STU002"
                            />
                            {updateFormik.errors.studentIds && (
                              <div className="text-danger">{updateFormik.errors.studentIds}</div>
                            )}
                          </div>

                          {/* Live preview for UPDATE */}
                          {updateMatchedStudents.length > 0 && (
                            <div className="mb-2">
                              <strong>Matched Students:</strong>
                              <ul className="mb-0">
                                {updateMatchedStudents.map((s) => (
                                  <li key={s.studentId}>
                                    {s.surName} {s.otherNames} ({s.studentId})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {updateUnmatchedIds.length > 0 && (
                            <div className="mb-2 text-warning">
                              <strong>Unknown IDs:</strong> {updateUnmatchedIds.join(", ")}
                            </div>
                          )}

                          <ModalFooter>
                            <Button colorScheme="green" type="submit">
                              Edit Parent
                            </Button>
                            <Button onClick={onUpdateParentClose} className="ms-2">
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GetParents;
