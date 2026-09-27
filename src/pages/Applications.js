import { useState, useEffect } from "react";
import Layout from "../Components/PrincipalLayout";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  VStack,
} from "@chakra-ui/react";
import api from "@/utils/api";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const Applications = () => {
  const {
    isOpen: isExamDateModalOpen,
    onOpen: onExamDateOpen,
    onClose: onExamDateClose,
  } = useDisclosure();
  const {
    isOpen: isAdmitModalOpen,
    onOpen: onAdmitOpen,
    onClose: onAdmitClose,
  } = useDisclosure();

    const router = useRouter()

    // useEffect(() => {
    //   const token = localStorage.getItem("token");
    //   const role = localStorage.getItem("role");
    //   if (!token || role !== "Principal") {
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
    //       console.log(response.data);
    //       if (!response.data.status) {
    //         router.push("/StaffLogin");
    //       }
    //     })
    //     .catch(() => router.push("/StaffLogin"));
    // }, [router]);

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get(
          "/student/getApplications"
        );
        // console.log(response)
        setApplications(response.applications);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get(
          "/class/getClasses"
        );
        setClasses(response.classes);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchClasses();
  }, []);

  // Formik for sending exam date
  const formikSendExamDate = useFormik({
    initialValues: {
      entranceExamDate: "",
    },
    validationSchema: yup.object({
      entranceExamDate: yup
        .date()
        .min(new Date(), "Date cannot be in the past")
        .required("Entrance Exam Date is required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post(
          "/email/sendEntranceExamDate",
          {
            entranceExamDate: values.entranceExamDate,
            studentName,
            parentName,
            parentEmail,
          }
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          onExamDateClose();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error sending date:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Formik for admitting a student
  const formikAdmitStudent = useFormik({
    initialValues: {
      entranceExamScore: "",
      classAdmittedTo: "",
      resumptionDate: "",
    },
    validationSchema: yup.object({
      entranceExamScore: yup.string().required("This field is required!"),
      classAdmittedTo: yup.string().required("Please select a class."),
      resumptionDate: yup
        .date()
        .min(new Date(), "Date cannot be in the past")
        .required("Resumption date is required!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(values)
        const response = await api.post(
          "/email/sendAdmissionLetter",
          {
            entranceExamScore: values.entranceExamScore,
            classAdmittedTo: values.classAdmittedTo,
            resumptionDate: values.resumptionDate,
            parentEmail,
            parentName,
            studentName,
            studentId,
          }
        );
        if (response.data.status) {
          Swal.fire("Success", response.data.message, "success");
          onAdmitClose();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error sending admission letter:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSendExamDate = async (application) => {
    try {
      const { studentId, parentId } = application;

      const studentResponse = await api.post(
        "/student/findStudentById",
        { studentId }
      );
      if (studentResponse.data.status) {
        const studentData = studentResponse.data.student[0];
        const studentName = `${studentData.surName} ${studentData.otherNames}`;
        setStudentName(studentName);
      }

      const parentResponse = await api.post(
        "/parent/findParentById",
        { id: parentId }
      );
      if (parentResponse.data.status) {
        const parentData = parentResponse.data.parent[0];
        const parentName = `${parentData.surName} ${parentData.otherNames}`;
        setParentName(parentName);
        setParentEmail(parentData.email);
      }

      setSelectedApplication(application);
      onExamDateOpen();
    } catch (error) {
      console.error("Error fetching student or parent data:", error);
    }
  };

  const handleAdmitStudent = async (application) => {
    try {
      const { studentId, parentId } = application;

      const studentResponse = await api.post(
        "/student/findStudentById",
        { studentId }
      );
      if (studentResponse.data.status) {
        const studentData = studentResponse.data.student[0];
        const studentName = `${studentData.surName} ${studentData.otherNames}`;
        setStudentName(studentName);
        setStudentId(studentId);
      }

      const parentResponse = await api.post(
        "/parent/findParentById",
        { id: parentId }
      );
      if (parentResponse.data.status) {
        const parentData = parentResponse.data.parent[0];
        const parentName = `${parentData.surName} ${parentData.otherNames}`;
        setParentName(parentName);
        setParentEmail(parentData.email);
      }

      setSelectedApplication(application);
      onAdmitOpen();
    } catch (error) {
      console.error("Error fetching student or parent data:", error);
    }
  };

  return (
    <Layout>
      <Box size="lg" maxW="2000px" className="py-1">
        <Box p={4}>
          <h2 className="text-center p- border-bottom">APPLICATIONS</h2>
          <div className="d-flex justify-content-between p-3">
            <div></div>
            <div>
              <a className="ms-2 btn btn-success" href="/SentExamDate" >Sent Exam Date</a>
              </div>
          </div>
          <TableContainer>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Applied To Class</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {applications.map((item) => (
                  <Tr key={item.studentId}>
                    <Td>{item.studentId}</Td>
                    <Td>
                      {item.surName} {item.otherNames}
                    </Td>
                    <Td>{item.classTo}</Td>
                    <Td>
                      <Button
                        variant="solid"
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleAdmitStudent(item)}
                      >
                        Admit
                      </Button>
                      <Button
                        variant="solid"
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleSendExamDate(item)}
                        ml={2}
                      >
                        Send Entrance Exam Date
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Admit Modal */}
      <Modal
        isCentered
        onClose={onAdmitClose}
        isOpen={isAdmitModalOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Admit Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formikAdmitStudent.handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={formikAdmitStudent.errors.entranceExamScore}>
                  <FormLabel htmlFor="entranceExamScore">Entrance Exam Result</FormLabel>
                  <Input
                    id="entranceExamScore"
                    name="entranceExamScore"
                    type="text"
                    onChange={formikAdmitStudent.handleChange}
                    value={formikAdmitStudent.values.entranceExamScore}
                  />
                  <FormErrorMessage>{formikAdmitStudent.errors.entranceExamScore}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formikAdmitStudent.errors.classAdmittedTo}>
                  <FormLabel htmlFor="classAdmittedTo">Admit To Class</FormLabel>
                  <Select
                    id="classAdmittedTo"
                    name="classAdmittedTo"
                    onChange={formikAdmitStudent.handleChange}
                    value={formikAdmitStudent.values.classAdmittedTo}
                  >
                    <option value="">---</option>
                    {classes?.map((item) => (
                      <option key={item.classId} value={item.className}>
                        {item.className}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{formikAdmitStudent.errors.classAdmittedTo}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formikAdmitStudent.errors.resumptionDate}>
                  <FormLabel htmlFor="resumptionDate">Resumption Date</FormLabel>
                  <Input
                    id="resumptionDate"
                    name="resumptionDate"
                    type="date"
                    onChange={formikAdmitStudent.handleChange}
                    value={formikAdmitStudent.values.resumptionDate}
                  />
                  <FormErrorMessage>{formikAdmitStudent.errors.resumptionDate}</FormErrorMessage>
                </FormControl>
              </VStack>
              <ModalFooter>
                <Button
                  colorScheme="green"
                  type="submit"
                  isLoading={formikAdmitStudent.isSubmitting}
                >
                  Confirm Admission
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Send Entrance Exam Date Modal */}
      <Modal
        isCentered
        onClose={onExamDateClose}
        isOpen={isExamDateModalOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Entrance Exam Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formikSendExamDate.handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={formikSendExamDate.errors.entranceExamDate}>
                  <FormLabel htmlFor="entranceExamDate">Entrance Exam Date</FormLabel>
                  <Input
                    id="entranceExamDate"
                    name="entranceExamDate"
                    type="date"
                    onChange={formikSendExamDate.handleChange}
                    value={formikSendExamDate.values.entranceExamDate}
                  />
                  <FormErrorMessage>{formikSendExamDate.errors.entranceExamDate}</FormErrorMessage>
                </FormControl>
              </VStack>
              <ModalFooter>
                <Button
                  colorScheme="green"
                  type="submit"
                  isLoading={formikSendExamDate.isSubmitting}
                >
                  Send Date
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default Applications;
