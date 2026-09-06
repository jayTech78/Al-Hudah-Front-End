import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

import Layout from "@/Components/ManagerLayout";
import style from "../styles/Home.module.css";

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Select,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

const StudentStatus = () => {
  const router = useRouter();

  const [disciplinary, setDisciplinary] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");

  // Add Modal
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [searchingStudent, setSearchingStudent] = useState(false);

  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  // Authentication
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = (localStorage.getItem("role") || "").toLowerCase();

  //   if (!token || role !== "principal") {
  //     router.push("/StaffLogin");
  //     return;
  //   }

  //   axios
  //     .get("http://localhost:9500/staff/getDashboard", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       if (!response.data.status) {
  //         router.push("/StaffLogin");
  //       }
  //     })
  //     .catch(() => {
  //       router.push("/StaffLogin");
  //     });
  // }, []);

  // Fetch Records

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "http://localhost:9500/disciplinary/get"
      );

      if (data.status) {
        // console.log(data.students)
        setDisciplinary(data.students || []);
        setFilteredStudents(data.students || []);
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Unable to fetch records",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search Table

  const handleSearch = () => {
    if (!searchId.trim()) {
      setFilteredStudents(disciplinary);
      return;
    }

    const result = disciplinary.filter(
      (item) =>
        item.studentId.toLowerCase() ===
        searchId.toLowerCase()
    );

    setFilteredStudents(result);
  };

  // Search Student For Add Modal

  const searchStudent = async () => {
    if (!studentId) return;

    try {
      setSearchingStudent(true);

      const { data } = await axios.post(
        "http://localhost:9500/disciplinary/searchStudent",
        {
          studentId,
        }
      );

      if (data.status) {
        setStudentName(data.student.studentName);
      } else {
        setStudentName("");

        Swal.fire(
          "Error",
          data.message,
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    } finally {
      setSearchingStudent(false);
    }
  };

  // Validation

  const validationSchema = yup.object({
    status: yup.string().required(),

    offence: yup.string().when("status", {
      is: (status) =>
        ["Suspended", "Rusticated", "Blacklisted"].includes(status),

      then: (schema) =>
        schema.required("Offence is required"),

      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // Add Form

  const addFormik = useFormik({
    initialValues: {
      status: "",
      offence: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          "http://localhost:9500/disciplinary/add",
          {
            studentId,
            status: values.status,
            offence: values.offence,
          }
        );

        if (data.status) {
          Swal.fire(
            "Success",
            data.message,
            "success"
          );

          onAddClose();

          addFormik.resetForm();

          setStudentId("");
          setStudentName("");

          fetchStudents();
        } else {
          Swal.fire(
            "Error",
            data.message,
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || error.message,
          "error"
        );
      }
    },
  });

  // ==========================
  // EDIT FORM
  // ==========================

  const editFormik = useFormik({
    initialValues: {
      studentId: "",
      status: "",
      offence: "",
    },

    enableReinitialize: true,

    validationSchema,

    onSubmit: async (values) => {
      try {
        const { data } = await axios.put(
          "http://localhost:9500/disciplinary/update",
          values
        );

        if (data.status) {
          Swal.fire(
            "Success",
            data.message,
            "success"
          );

          onEditClose();

          fetchStudents();
        } else {
          Swal.fire(
            "Error",
            data.message,
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || error.message,
          "error"
        );
      }
    },
  });



  // ==========================
  // DETAILS
  // ==========================

  const handleDetails = (student) => {
    setSelectedStudent(student);
    onOpen();
  };



  // ==========================
  // EDIT
  // ==========================

  const handleEdit = (student) => {
    setSelectedStudent(student);

    editFormik.setValues({
      studentId: student.studentId,
      status: student.status,
      offence: student.offence || "",
    });

    onEditOpen();
  };



  // ==========================
  // STATUS COLOR
  // ==========================

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "admitted":
        return "green";

      case "not admitted":
        return "gray";

      case "suspended":
        return "orange";

      case "rusticated":
        return "purple";

      case "blacklisted":
        return "red";

      default:
        return "blue";
    }
  };

  return (
    <div className={style.unscroll}>
      <Layout>

        <Box p={6}>

          <Flex
            justify="space-between"
            align="center"
            mb={6}
            wrap="wrap"
          >

            <Heading size="lg">
              Student Disciplinary Management
            </Heading>

            <Button
              colorScheme="green"
              onClick={onAddOpen}
            >
              Add Student Status
            </Button>

          </Flex>

          <Flex
            mb={6}
            gap={3}
            wrap="wrap"
          >

            <Input
              placeholder="Search Student ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              maxW="350px"
            />

            <Button
              colorScheme="blue"
              onClick={handleSearch}
            >
              Search
            </Button>

            <Button
              onClick={() => {
                setSearchId("");
                setFilteredStudents(disciplinary);
              }}
            >
              Refresh
            </Button>

          </Flex>

          {loading ? (

            <Box textAlign="center">

              <Spinner
                size="xl"
                mt={20}
              />

            </Box>

          ) : (

            <TableContainer>

              <Table
                variant="striped"
                colorScheme="teal"
              >

                <Thead>

                  <Tr>

                    <Th>Student ID</Th>

                    <Th>Student Name</Th>

                    <Th>Status</Th>

                    <Th>Date</Th>

                    <Th>Action</Th>

                  </Tr>

                </Thead>

                <Tbody>

                  {filteredStudents.length > 0 ? (

                    filteredStudents.map((student) => (

                      <Tr
                        key={student.disciplinaryId}
                      >

                        <Td>
                          {student.studentId}
                        </Td>

                        <Td>
                          {student.studentName}
                        </Td>

                        <Td>

                          <HStack>

                            <Badge
                              colorScheme={getStatusColor(student.status)}
                            >

                              {student.status}

                            </Badge>

                            <Text>

                              {student.status}

                            </Text>

                          </HStack>

                        </Td>

                        <Td>

                          {new Date(
                            student.dateRecorded
                          ).toLocaleDateString()}

                        </Td>

                        <Td>

                          <HStack>

                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() =>
                                handleDetails(student)
                              }
                            >

                              Details

                            </Button>

                            <Button
                              size="sm"
                              colorScheme="yellow"
                              onClick={() =>
                                handleEdit(student)
                              }
                            >

                              Edit

                            </Button>

                          </HStack>

                        </Td>

                      </Tr>

                    ))

                  ) : (

                    <Tr>

                      <Td
                        colSpan={5}
                        textAlign="center"
                      >

                        No disciplinary records found

                      </Td>

                    </Tr>

                  )}

                </Tbody>

              </Table>

            </TableContainer>

          )}

          {/* ================= ADD MODAL ================= */}

          <Modal isOpen={isAddOpen} onClose={onAddClose} size="lg">
            <ModalOverlay />

            <ModalContent>
              <ModalHeader>Add Student Status</ModalHeader>

              <ModalCloseButton />

              <ModalBody>

                <VStack spacing={4}>

                  <Input
                    placeholder="Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    onBlur={searchStudent}
                  />

                  {searchingStudent && <Spinner />}

                  <Input
                    placeholder="Student Name"
                    value={studentName}
                    isReadOnly
                  />

                  <Select
                    name="status"
                    placeholder="Select Status"
                    value={addFormik.values.status}
                    onChange={addFormik.handleChange}
                  >
                    <option value="Admitted">Admitted</option>

                    <option value="Not Admitted">
                      Not Admitted
                    </option>

                    <option value="Suspended">
                      Suspended
                    </option>

                    <option value="Rusticated">
                      Rusticated
                    </option>

                    <option value="Blacklisted">
                      Blacklisted
                    </option>
                  </Select>

                  {["Suspended", "Rusticated", "Blacklisted"].includes(
                    addFormik.values.status
                  ) && (

                      <Textarea
                        placeholder="Enter offence"

                        name="offence"

                        value={addFormik.values.offence}

                        onChange={addFormik.handleChange}
                      />

                    )}

                </VStack>

              </ModalBody>

              <ModalFooter>

                <Button
                  mr={3}
                  onClick={onAddClose}
                >
                  Cancel
                </Button>

                <Button
                  colorScheme="green"
                  onClick={addFormik.handleSubmit}
                >
                  Save
                </Button>

              </ModalFooter>

            </ModalContent>

          </Modal>

          {/* ================= DETAILS ================= */}

          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
          >

            <ModalOverlay />

            <ModalContent>

              <ModalHeader>

                Student Details

              </ModalHeader>

              <ModalCloseButton />

              <ModalBody>

                {selectedStudent && (

                  <VStack
                    align="stretch"
                    spacing={3}
                  >

                    <Text>

                      <b>Student ID:</b>

                      {" "}

                      {selectedStudent.studentId}

                    </Text>

                    <Text>

                      <b>Name:</b>

                      {" "}

                      {selectedStudent.studentName}

                    </Text>

                    <Text>

                      <b>Status:</b>

                      {" "}

                      {selectedStudent.status}

                    </Text>

                    <Text>

                      <b>Offence:</b>

                      {" "}

                      {selectedStudent.offence || "N/A"}

                    </Text>

                    <Text>

                      <b>Date Recorded:</b>

                      {" "}

                      {new Date(
                        selectedStudent.dateRecorded
                      ).toLocaleString()}

                    </Text>

                  </VStack>

                )}

              </ModalBody>

              <ModalFooter>

                <Button
                  colorScheme="red"
                  onClick={onClose}
                >

                  Close

                </Button>

              </ModalFooter>

            </ModalContent>

          </Modal>

          {/* ================= EDIT ================= */}

          <Modal
            isOpen={isEditOpen}
            onClose={onEditClose}
            size="lg"
          >

            <ModalOverlay />

            <ModalContent>

              <ModalHeader>

                Update Student Status

              </ModalHeader>

              <ModalCloseButton />

              <ModalBody>

                <VStack spacing={4}>

                  <Input
                    value={editFormik.values.studentId}
                    isReadOnly
                  />

                  <Select

                    name="status"

                    value={editFormik.values.status}

                    onChange={editFormik.handleChange}

                  >

                    <option value="Admitted">
                      Admitted
                    </option>

                    <option value="Not Admitted">
                      Not Admitted
                    </option>

                    <option value="Suspended">
                      Suspended
                    </option>

                    <option value="Rusticated">
                      Rusticated
                    </option>

                    <option value="Blacklisted">
                      Blacklisted
                    </option>

                  </Select>

                  {["Suspended", "Rusticated", "Blacklisted"].includes(
                    editFormik.values.status
                  ) && (

                      <Textarea

                        name="offence"

                        placeholder="Enter offence"

                        value={editFormik.values.offence}

                        onChange={editFormik.handleChange}

                      />

                    )}

                </VStack>

              </ModalBody>

              <ModalFooter>

                <Button
                  mr={3}
                  onClick={onEditClose}
                >

                  Cancel

                </Button>

                <Button
                  colorScheme="blue"
                  onClick={editFormik.handleSubmit}
                >

                  Update

                </Button>

              </ModalFooter>

            </ModalContent>

          </Modal>

        </Box>

      </Layout>

    </div>

  );

};

export default StudentStatus;