import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Spinner,
  Box,
  Input,
  HStack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  CheckboxGroup,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/react";
import Layout from "@/Components/PrincipalLayout";
import { useRouter } from "next/router";

export default function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [books, setBooks] = useState([]);
  const [fees, setFees] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedFees, setSelectedFees] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [role, setRole] = useState("");

  //  useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     const role = (localStorage.getItem("role") || "").toLowerCase();
  
  //     if (!token || (role !== "principal")) {
  //       router.push("/StaffLogin");
  //       return;
  //     }
  //     axios
  //       .get("http://localhost:9500/staff/getDashboard", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //       })
  //       .then((response) => {
  //         if (!response.data.status) {
  //           router.push("/StaffLogin");
  //         }
  //       })
  //       .catch(() => router.push("/StaffLogin"));
  //   }, [router]);

  useEffect(() => {
    let storedRole = localStorage.getItem("role") || "";
    storedRole = storedRole.trim().toLowerCase();

    // Handle abbreviations
    if (storedRole === "vp") storedRole = "vice principal";
    if (storedRole === "hm") storedRole = "head master";
    if (storedRole === "ahm") storedRole = "assistant head master";

    setRole(storedRole);
    fetchAll(storedRole);
  }, []);

  const fetchAll = async (userRole) => {
    try {
      const [feesRes, bookRes, teacherRes, subjectRes, studentRes, classRes] =
        await Promise.all([
          axios.get("http://localhost:9500/fees/getFees"),
          axios.get("http://localhost:9500/book/getBooks"),
          axios.get("http://localhost:9500/staff/getTeachers"),
          axios.get("http://localhost:9500/subject/getSubjects"),
          axios.get("http://localhost:9500/student/getStudents"),
          axios.get("http://localhost:9500/class/getAllClasses"),
        ]);

      setFees(feesRes.data.fees || []);
      setBooks(bookRes.data.books || []);
      setTeachers(teacherRes.data.teachers || []);
      setAvailableSubjects(subjectRes.data.subjects || []);
      setStudents(studentRes.data.students || []);

      let allClasses = classRes.data.classes || [];

      // Filter with normalized role
      if (userRole === "principal" || userRole === "vice principal") {
        allClasses = allClasses.filter(
          (c) =>
            c.className.toLowerCase().startsWith("jss") ||
            c.className.toLowerCase().startsWith("ss")
        );
      } else if (
        userRole === "head master" ||
        userRole === "assistant head master"
      ) {
        allClasses = allClasses.filter((c) =>
          c.className.toLowerCase().startsWith("primary")
        );
      }

      setClasses(allClasses);
    } catch (error) {
      console.error("Error fetching:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isAddStudentOpen,
    onOpen: onAddStudentOpen,
    onClose: onAddStudentClose,
  } = useDisclosure();

  const {
    isOpen: isRemoveStudentOpen,
    onOpen: onRemoveStudentOpen,
    onClose: onRemoveStudentClose,
  } = useDisclosure();

  // ✅ Add Formik
  const formik = useFormik({
    initialValues: { className: "", classTeacher: "" },
    validationSchema: yup.object({
      className: yup.string().required("This field is required!"),
      classTeacher: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:9500/class/addClass",
          {
            ...values,
            classSubjects: selectedSubjects,
            classBooks: selectedBooks,
            classFees: selectedFees,
          }
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          resetForm();
          onAddClose();
          fetchAll();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Problem adding class", "error");
      }
    },
  });

  // ✅ Update Formik
  const updateFormik = useFormik({
    initialValues: { className: "", classTeacher: "" },
    validationSchema: yup.object({
      className: yup.string().required("Required"),
      classTeacher: yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:9500/class/updateClass",
          {
            ...values,
            classId: selectedClassId,
            classSubjects: selectedSubjects,
            classBooks: selectedBooks,
            classFees: selectedFees,
          }
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          resetForm();
          onEditClose(); // After add, update, delete, assign, remove student
          fetchAll(role); // always use the state role
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Problem updating class", "error");
      }
    },
  });
  //Add Student to class formik
  const addStudentFormik = useFormik({
    initialValues: { className: "", studentId: "" },
    validationSchema: yup.object({
      className: yup.string().required("Required"),
      studentId: yup.string().required("Required"),
    }),
    // Add Student Submit
    onSubmit: async (values, { resetForm }) => {
      try {
        const student = `${selectedStudent.surName} ${selectedStudent.otherNames}`;
        const response = await axios.post(
          "http://localhost:9500/class/addStudentToClass",
          {
            ...values,
            className: selectedClass.className, // ensure class is included
            student,
          }
        );
        console.log(values, response.data);
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          resetForm();
          onAddStudentClose(); // After add, update, delete, assign, remove student
          fetchAll(role); // always use the state role
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Problem adding student:", error, "error");
      }
    },
  });

  const removeStudentFormik = useFormik({
    initialValues: { className: "", studentId: "" },
    validationSchema: yup.object({
      className: yup.string().required("Required"),
      studentId: yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        // console.log(selectedStudent)
        // const student = `${selectedStudent.surName} ${selectedStudent.otherNames}`;
        const response = await axios.post(
          "http://localhost:9500/class/removeStudentFromClass",
          {
            ...values,
            className: selectedClass.className, // ensure class is included
            // student,
          }
        );
        // console.log(values, response.data);
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          resetForm();
          onRemoveStudentClose(); // After add, update, delete, assign, remove student
          fetchAll(role); // always use the state role
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Problem removing student", "error");
      }
    },
  });

  // ✅ Delete class
  const deleteClass = async () => {
    try {
      console.log(selectedClass);
      const response = await axios.post(
        `http://localhost:9500/class/deleteClass/${selectedClass.classId}`
      );
      if (response.data.status) {
        Swal.fire("Success", response.data.message, "success"); // After add, update, delete, assign, remove student
        fetchAll(role); // always use the state role

        onDeleteClose();
      }
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  const gotToClass = (className) => {
    router.push(`/PClassInfo/${className}`);
  };

  const handleStudentIdChange = (e) => {
    const studentId = e.target.value;
    addStudentFormik.setFieldValue("studentId", studentId);
    const found = students.find((s) => s.studentId === studentId);
    setSelectedStudent(found || null);
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Layout>
      <Box p={5}>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">All Classes</Heading>
          <Button colorScheme="green" onClick={onAddOpen}>
            Add Class
          </Button>
        </HStack>

        <TableContainer>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Class Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {classes.map((cls) => (
                <Tr key={cls._id}>
                  <Td>{cls.className.toUpperCase()}</Td>
                  <Td>
                    <HStack>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => gotToClass(cls.className)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => {
                          setSelectedClass(cls);
                          setSelectedClassId(cls.classId);
                          updateFormik.setValues({
                            className: cls.className,
                            classTeacher: cls.classTeacher,
                          });
                          setSelectedBooks(cls.classBooks || []);
                          setSelectedSubjects(cls.classSubjects || []);
                          setSelectedFees(cls.classFees || []);
                          onEditOpen();
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedClass(cls);
                          onDeleteOpen();
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        size={"sm"}
                        colorScheme={"teal"}
                        onClick={() => {
                          setSelectedClass(cls); // keep track of which class we're adding student to
                          addStudentFormik.setFieldValue(
                            "className",
                            cls.className
                          ); // prefill
                          onAddStudentOpen();
                        }}
                      >
                        Assign Student To Class
                      </Button>
                      <Button
                        size={"sm"}
                        colorScheme={"teal"}
                        onClick={() => {
                          setSelectedClass(cls); // keep track of which class we're adding student to
                          removeStudentFormik.setFieldValue(
                            "className",
                            cls.className
                          ); // prefill
                          onRemoveStudentOpen();
                        }}
                      >
                        Remove Student From Class
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add Class Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <FormControl>
                <FormLabel>Class Name</FormLabel>
                <Input
                  id="className"
                  name="className"
                  onChange={formik.handleChange}
                  value={formik.values.className}
                />
              </FormControl>
              <FormControl mt={3}>
                <FormLabel>Class Teacher</FormLabel>
                <select
                  id="classTeacher"
                  name="classTeacher"
                  onChange={formik.handleChange}
                  value={formik.values.classTeacher}
                  className="form-select"
                >
                  <option value="">---</option>
                  <option value="Mr Lawal">Mr Lawal</option>
                  {teachers.map((t) => (
                    <option
                      key={t.staffId}
                      value={`${t.surName} ${t.otherNames}`}
                    >
                      {t.surName} {t.otherNames}
                    </option>
                  ))}
                </select>
              </FormControl>

              <HStack mt={4} spacing={6}>
                <Box>
                  <FormLabel>Books</FormLabel>
                  <CheckboxGroup
                    value={selectedBooks}
                    onChange={setSelectedBooks}
                  >
                    <Stack>
                      {books.map((b) => (
                        <Checkbox key={b._id} value={b.name}>
                          {b.name}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
                <Box>
                  <FormLabel>Fees</FormLabel>
                  <CheckboxGroup
                    value={selectedFees}
                    onChange={setSelectedFees}
                  >
                    <Stack>
                      {fees.map((f) => (
                        <Checkbox key={f._id} value={f.fee}>
                          {f.fee}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
                <Box>
                  <FormLabel>Subjects</FormLabel>
                  <CheckboxGroup
                    value={selectedSubjects}
                    onChange={setSelectedSubjects}
                  >
                    <Stack>
                      {availableSubjects.map((s) => (
                        <Checkbox key={s._id} value={s.subject}>
                          {s.subject}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </HStack>

              <ModalFooter>
                <Button colorScheme="blue" type="submit">
                  Add
                </Button>
                <Button onClick={onAddClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Class Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={updateFormik.handleSubmit}>
              <FormControl>
                <FormLabel>Class Name</FormLabel>
                <Input
                  id="className"
                  name="className"
                  onChange={updateFormik.handleChange}
                  value={updateFormik.values.className}
                />
              </FormControl>
              <FormControl mt={3}>
                <FormLabel>Class Teacher</FormLabel>
                <select
                  id="classTeacher"
                  name="classTeacher"
                  onChange={updateFormik.handleChange}
                  value={updateFormik.values.classTeacher}
                  className="form-select"
                >
                  <option value="">---</option>
                  <option value="Mr Lawal">Mr Lawal</option>
                  {teachers.map((t) => (
                    <option
                      key={t.staffId}
                      value={`${t.surName} ${t.otherNames}`}
                    >
                      {t.surName} {t.otherNames}
                    </option>
                  ))}
                </select>
              </FormControl>

              <HStack mt={4} spacing={6}>
                <Box>
                  <FormLabel>Books</FormLabel>
                  <CheckboxGroup
                    value={selectedBooks}
                    onChange={setSelectedBooks}
                  >
                    <Stack>
                      {books.map((b) => (
                        <Checkbox key={b._id} value={b.name}>
                          {b.name}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
                <Box>
                  <FormLabel>Fees</FormLabel>
                  <CheckboxGroup
                    value={selectedFees}
                    onChange={setSelectedFees}
                  >
                    <Stack>
                      {fees.map((f) => (
                        <Checkbox key={f._id} value={f.fee}>
                          {f.fee}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
                <Box>
                  <FormLabel>Subjects</FormLabel>
                  <CheckboxGroup
                    value={selectedSubjects}
                    onChange={setSelectedSubjects}
                  >
                    <Stack>
                      {availableSubjects.map((s) => (
                        <Checkbox key={s._id} value={s.subject}>
                          {s.subject}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </HStack>

              <ModalFooter>
                <Button colorScheme="blue" type="submit">
                  Save
                </Button>
                <Button onClick={onEditClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete <b>{selectedClass?.className}</b>?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={deleteClass}>
              Delete
            </Button>
            <Button onClick={onDeleteClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Adding Student*/}
      <Modal isOpen={isAddStudentOpen} onClose={onAddStudentClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Student to {selectedClass?.className}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={addStudentFormik.handleSubmit}>
              {/* No need to select class manually anymore */}
              <Input
                id="studentId"
                name="studentId"
                placeholder="Enter Student ID"
                onChange={handleStudentIdChange}
                value={addStudentFormik.values.studentId}
              />
              {addStudentFormik.errors.studentId && (
                <div className="text-danger">
                  {addStudentFormik.errors.studentId}
                </div>
              )}

              {selectedStudent && (
                <Box mt={3} p={2} borderWidth={1} borderRadius="md">
                  <p>
                    <strong>Name:</strong> {selectedStudent.surName}{" "}
                    {selectedStudent.otherNames}
                  </p>
                </Box>
              )}

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={addStudentFormik.isSubmitting}
                >
                  Add Student
                </Button>
                <Button onClick={onAddStudentClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Modal for Removing Student*/}
      <Modal
        isOpen={isRemoveStudentOpen}
        onClose={onRemoveStudentClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Remove Student From Class {selectedClass?.className}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={removeStudentFormik.handleSubmit}>
            <ModalBody>
              {/* Dropdown for students */}
              <FormControl mb={3}>
                <FormLabel>Select Student</FormLabel>
                <Select
                  id="studentId"
                  name="studentId"
                  placeholder="Select student"
                  value={removeStudentFormik.values.studentId}
                  onChange={(e) =>
                    removeStudentFormik.setFieldValue(
                      "studentId",
                      e.target.value
                    )
                  }
                >
                  {selectedClass?.students?.map((studentId) => {
                    const stu = students.find((s) => s.studentId === studentId);
                    return (
                      <option key={studentId} value={studentId}>
                        {stu
                          ? `${stu.surName} ${stu.otherNames} (${stu.studentId})`
                          : studentId}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>

              {/* Error Message */}
              {removeStudentFormik.errors.studentId && (
                <Text color="red.500" fontSize="sm">
                  {removeStudentFormik.errors.studentId}
                </Text>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={removeStudentFormik.isSubmitting}
              >
                Remove Student
              </Button>
              <Button variant="ghost" onClick={onRemoveStudentClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Layout>
  );
}