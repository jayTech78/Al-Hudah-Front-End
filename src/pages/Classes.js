// ClassStudentTabs.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  CheckboxGroup,
  Checkbox,
  Stack,
  useToast,
  Input,
} from "@chakra-ui/react";
import Layout from "@/Components/VicePrincipalLayout";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const ClassStudentTabs = () => {
  const router = useRouter();
  const toast = useToast();
  const [classes, setClasses] = useState([]);
  const [books, setBooks] = useState([]);
  const [fees, setFees] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedFees, setSelectedFees] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddStudentOpen,
    onOpen: onAddStudentOpen,
    onClose: onAddStudentClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();
  const {
    isOpen: isDetailsModalOpen,
    onOpen: onUpdateDetailsOpen,
    onClose: onUpdateDetailsClose,
  } = useDisclosure();

  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();

  const formik = useFormik({
    initialValues: { className: "", classTeacher: "" },
    validationSchema: yup.object({
      className: yup.string().required("This field is required!"),
      classTeacher: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (
          !selectedBooks.length ||
          !selectedSubjects.length ||
          !selectedFees.length
        ) {
          Swal.fire(
            "Error",
            "Books, subjects, and fees must be selected.",
            "error"
          );
          return;
        }

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
          onClose();
          router.reload();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Problem adding class", "error");
      }
    },
  });

  const updateFormik = useFormik({
    initialValues: { className: "", classTeacher: "" },
    validationSchema: yup.object({
      className: yup.string().required("This field is required!"),
      classTeacher: yup.string().required("This field is required!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (
          !selectedBooks.length ||
          !selectedSubjects.length ||
          !selectedFees.length
        ) {
          Swal.fire(
            "Error",
            "Books, subjects, and fees must be selected.",
            "error"
          );
          return;
        }
        console.log(values);

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
          onUpdateModalClose();
          router.reload();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Problem updating class", "error");
      }
    },
  });

  const addStudentFormik = useFormik({
    initialValues: { className: "", studentId: "" },
    validationSchema: yup.object({
      className: yup.string().required("Required"),
      studentId: yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const student = `${selectedStudent.surName} ${selectedStudent.otherNames}`;
        const response = await axios.post(
          "http://localhost:9500/class/addStudentToClass",
          { ...values, student }
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          resetForm();
          onAddStudentClose();
          router.reload();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Problem adding student", "error");
      }
    },
  });

  const handleStudentIdChange = (e) => {
    const studentId = e.target.value;
    addStudentFormik.setFieldValue("studentId", studentId);
    const found = students.find((s) => s.studentId === studentId);
    setSelectedStudent(found || null);
  };

  const handleEdit = (classId) => {
    console.log(classId);
    const foundClass = allClasses.find((cls) => cls.classId === classId);
    if (!foundClass) return Swal.fire("Error", "Class not found", "error");
    updateFormik.setValues({
      className: foundClass.className,
      classTeacher: foundClass.classTeacher,
    });
    setSelectedBooks(foundClass.classBooks || []);
    setSelectedSubjects(foundClass.classSubjects || []);
    setSelectedFees(foundClass.classFees || []);
    setSelectedClassId(classId);
    onUpdateModalOpen();
  };

  const handleDelete = async (className) => {
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
          const { data } = await axios.post(
            "http://localhost:9500/class/deleteClass",
            { className }
          );
          if (data.status) {
            Swal.fire("Deleted!", data.message, "success");
            router.reload();
          } else {
            Swal.fire("Error", data.message, "error");
          }
        } catch {
          Swal.fire("Error", "Unable to delete class.", "error");
        }
      }
    });
  };
  const handleDetails = (className) => {
    console.log(className);
    setSelectedClass(className);
    onDetailsOpen();
  };
  useEffect(() => {
    const fetchAll = async () => {
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
        setClasses(classRes.data.classes || []);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [toast]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );

  return (
    <Layout>
      <h2>Classes</h2>
      <Box color="gray.500">
        <div className="row p-3">
          <div className="col-6">
            <Button className="btn btn-success form-control" onClick={onOpen}>
              Add New Class
            </Button>
          </div>
          <div className="col-6">
            <Button
              className="btn btn-success form-control"
              onClick={onAddStudentOpen}
            >
              Assign Student To Class
            </Button>
          </div>
        </div>

        <Tabs variant="soft-rounded" colorScheme="teal" isFitted>
          <TabList>
            {classes.map((classItem, index) => (
              <Tab key={index}>{classItem.className}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {classes.map((classItem, index) => (
              <TabPanel key={index}>
                <TableContainer>
                  <div className="p-3 d-flex justify-content-between">
                    <div>Class Teacher: {classItem.classTeacher}</div>
                    <div>No of Students: {classItem.students.length}</div>
                    <div>
                      Approval:{" "}
                      <div
                        className={
                          classItem.isApproved ? "text-success" : "text-danger"
                        }
                      >
                        {classItem.isApproved ? "Approved" : "Pending"}
                      </div>
                    </div>

                    <div className="col-2">
                      <Button
                        onClick={() => handleDelete(classItem.className)}
                        className="form-control text-danger"
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="col-2">
                      <Button
                        onClick={() => handleEdit(classItem.classId)}
                        className="form-control text-warning"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="col-2">
                      <Button
                        onClick={() => handleDetails(classItem)}
                        className="form-control text-warning"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                  <Table variant="striped" colorScheme="teal">
                    <Thead>
                      <Tr>
                        <Th>Student ID</Th>
                        <Th>Name</Th>
                        <Th>Gender</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {classItem.students.map((student, studentIndex) => (
                        <Tr key={studentIndex}>
                          <Td>{student.studentId}</Td>
                          <Td>
                            {student.surName} {student.otherNames}
                          </Td>
                          <Td>{student.gender}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>

      {/* Modal for Creating New Class */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <div className="row mb-3">
                <div className="col-6">
                  <label htmlFor="">Class</label>
                  <Input
                    placeholder="Class Name"
                    id="className"
                    name="className"
                    onChange={formik.handleChange}
                    value={formik.values.className}
                  />
                  {formik.errors.className && (
                    <div className="text-danger">{formik.errors.className}</div>
                  )}
                </div>
                <div className="col-6">
                  <label htmlFor="classTeacher">Class Teacher</label>
                  <select
                    id="classTeacher"
                    name="classTeacher"
                    onChange={formik.handleChange}
                    value={formik.values.classTeacher}
                    className="form-select"
                  >
                    <option value="" className="form-control">
                      ---
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.staffId}
                        value={`${teacher.surName} ${teacher.otherNames}`} // Correctly concatenate the full name for the value
                        className="form-control"
                      >
                        {teacher.surName} {teacher.otherNames}{" "}
                        {/* Display full name and role */}
                      </option>
                    ))}
                  </select>
                  {formik.errors.classTeacher && (
                    <div className="text-danger">
                      {formik.errors.classTeacher}
                    </div>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="" className="">
                    Books
                  </label>
                  <hr></hr>
                  <CheckboxGroup
                    value={selectedBooks.name}
                    onChange={setSelectedBooks}
                  >
                    <Stack spacing={3}>
                      {books.map((book) => (
                        <Checkbox key={book._id} value={book.name}>
                          {book.name}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </div>
                <div className="col-4">
                  <label htmlFor="" className="">
                    Fees
                  </label>
                  <hr></hr>
                  <CheckboxGroup
                    value={selectedFees.fee}
                    onChange={setSelectedFees}
                  >
                    <Stack spacing={3}>
                      {fees.map((fee) => (
                        <Checkbox key={fee._id} value={fee.fee}>
                          {fee.fee}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </div>
                <div className="col-4">
                  <label htmlFor="">Subjects</label>
                  <hr></hr>
                  <CheckboxGroup
                    value={selectedSubjects}
                    onChange={setSelectedSubjects}
                    id="classSubjects"
                    name="classSubjects"
                  >
                    <Stack spacing={3}>
                      {availableSubjects.map((subject) => (
                        <Checkbox key={subject._id} value={subject.subject}>
                          {subject.subject}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </div>
              </div>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isDisabled={!selectedBooks || !selectedSubjects}
                >
                  Add Class
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Modal for editing Class */}
      <Modal isOpen={isUpdateModalOpen} onClose={onUpdateModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={updateFormik.handleSubmit}>
              <div className="row mb-3">
                <div className="col-6">
                  <label htmlFor="">Class</label>
                  <Input
                    placeholder="Class Name"
                    id="className"
                    name="className"
                    onChange={updateFormik.handleChange}
                    value={updateFormik.values.className}
                  />
                  {updateFormik.errors.className && (
                    <div className="text-danger">
                      {updateFormik.errors.className}
                    </div>
                  )}
                </div>
                <div className="col-6">
                  <label htmlFor="classTeacher">Class Teacher</label>
                  <select
                    id="classTeacher"
                    name="classTeacher"
                    onChange={updateFormik.handleChange}
                    value={updateFormik.values.classTeacher}
                    className="form-select"
                  >
                    <option value="" className="form-control">
                      ---
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.staffId}
                        value={`${teacher.surName} ${teacher.otherNames}`} // Correctly concatenate the full name for the value
                        className="form-control"
                      >
                        {teacher.surName} {teacher.otherNames}{" "}
                        {/* Display full name and role */}
                      </option>
                    ))}
                  </select>
                  {updateFormik.errors.classTeacher && (
                    <div className="text-danger">
                      {updateFormik.errors.classTeacher}
                    </div>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <label htmlFor="" className="">
                    Books
                  </label>
                  <hr></hr>
                  <CheckboxGroup
                    value={selectedBooks.name}
                    onChange={setSelectedBooks}
                  >
                    <Stack spacing={3}>
                      {books.map((book) => (
                        <Checkbox key={book._id} value={book.name}>
                          {book.name}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </div>
                <div className="col-4">
                  <label htmlFor="" className="">
                    Fees
                  </label>
                  <hr></hr>
                  <CheckboxGroup
                    value={selectedFees.fee}
                    onChange={setSelectedFees}
                  >
                    <Stack spacing={3}>
                      {fees.map((fee) => (
                        <Checkbox key={fee._id} value={fee.fee}>
                          {fee.fee}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </div>
                <div className="col-4">
                  <label htmlFor="">Subjects</label>
                  <hr></hr>
                  <CheckboxGroup
                    value={selectedSubjects}
                    onChange={setSelectedSubjects}
                    id="classSubjects"
                    name="classSubjects"
                  >
                    <Stack spacing={3}>
                      {availableSubjects.map((subject) => (
                        <Checkbox key={subject._id} value={subject.subject}>
                          {subject.subject}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </div>
              </div>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isDisabled={!selectedBooks || !selectedSubjects}
                >
                  Edit Class
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Modal for Adding Student*/}
      <Modal isOpen={isAddStudentOpen} onClose={onAddStudentClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Student to Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={addStudentFormik.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="classTeacher">Class</label>
                <select
                  id="className"
                  name="className"
                  onChange={addStudentFormik.handleChange}
                  value={addStudentFormik.values.className}
                  className="form-select"
                >
                  <option value="" className="form-control">
                    ---
                  </option>
                  {allClasses.map((clas) => (
                    <option
                      key={clas.classId}
                      value={clas.className}
                      className="form-control"
                    >
                      {clas.className}
                    </option>
                  ))}
                </select>
                {addStudentFormik.errors.className && (
                  <div className="text-danger">
                    {addStudentFormik.errors.className}
                  </div>
                )}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="studentId">Student ID</label>
                <Input
                  id="studentId"
                  name="studentId"
                  onChange={handleStudentIdChange}
                  value={addStudentFormik.values.studentId}
                />
                {addStudentFormik.errors.studentId && (
                  <div className="text-danger">
                    {addStudentFormik.errors.studentId}
                  </div>
                )}
              </div>
              {selectedStudent && (
                <div className="student-info">
                  <p>
                    <strong>Name:</strong> {selectedStudent.surName}{" "}
                    {selectedStudent.otherNames}
                  </p>
                </div>
              )}
              <ModalFooter>
                <Button colorScheme="blue" type="submit">
                  Add Student
                </Button>
                <Button onClick={onAddStudentClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/*Modal for details */}
      {selectedClass && (
        <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xxl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Class Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="row mb-3">
                <div className="col-6">
                  <strong>Class:</strong> {selectedClass.className}
                </div>
                <div className="col-6">
                  <strong>Class Teacher:</strong> {selectedClass.classTeacher}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <label>Books</label>
                  <hr />
                  <Stack spacing={3}>
                    {selectedClass.classBooks?.map((book, index) => (
                      <p key={index}>{book}</p>
                    ))}
                  </Stack>
                </div>
                <div className="col-4">
                  <label>Fees</label>
                  <hr />
                  <Stack spacing={3}>
                    {selectedClass.classFees?.map((fee, index) => (
                      <p key={index}>{fee}</p>
                    ))}
                  </Stack>
                </div>
                <div className="col-4">
                  <label>Subjects</label>
                  <hr />
                  <Stack spacing={3}>
                    {selectedClass.classSubjects?.map((subject, index) => (
                      <p key={index}>{subject}</p>
                    ))}
                  </Stack>
                </div>
                <div className="col-4">
                  <label>Students</label>
                  <hr />
                  <Stack spacing={3}>
                    {selectedClass.students?.map((student, index) => (
                      <p key={index}>{student}</p>
                    ))}
                  </Stack>
                </div>
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
    </Layout>
  );
};

export default ClassStudentTabs;
