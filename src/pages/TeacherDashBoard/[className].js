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
  Text,
  Thead,
  Tr,
  TableContainer,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  VStack
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import TeacherSideNav from "@/Components/TeacherSideNav";
import EventCalendar from "@/Components/Calendar";
import ManagerNavBar from "@/Components/ParentNavBar";
import axios from "axios";
import TeacherLayout from "@/Components/TeacherLayout";

export default function teacherDashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [students, setStudents] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classInfo, setClassInfo] = useState([]);
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState("");
  const { className } = router.query;

  const fetchClassDetails = async () => {
    console.log(className)
    setLoading(true);
    try {
      const { data } = await axios.post(
        `http://localhost:9500/class/classInfo/${className}`
      );
      const foundClass = data.foundClass;

      if (!foundClass) {
        setError("foundClass not found");
        return;
      }
      console.log(data)
      
      setStudents(data?.students || []);
      // setClassInfo(response.classDetails?.[0])
      setClassInfo(foundClass);
      // console.log(response.classDetails[0].className);
      console.log(classInfo)
    } catch (error) {
      console.error(error);
      setError("Failed to load class details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "Teacher") {
      router.push("/Login");
      return;
    }

    axios
      .get("http://localhost:9500/staff/getDashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        // console.log(response.data);
        if (!response.data.status) {
          router.push("/StaffLogin");
        }
      })
      .catch(() => router.push("/Login"));
  }, [router]);

  const handleDetails = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  useEffect(() => {
    if (className) fetchClassDetails();
  }, [className]);

  return (
    <TeacherLayout
      className={className}
    >

      <Box
        flex="1"
        overflowY="auto"
        p={{ base: 4, md: 6, lg: 8 }}
      >

        {loading ? (
          <Spinner size="xl" />

        ) : error ? (
          <Text color="red.500">
            {error}
          </Text>

        ) : (
          <>
            {/* Teacher name */}
            <Heading mb={4}>
              {classInfo.classTeacher}
            </Heading>

            {/* Class */}
            <Heading size="md" mb={3}>
              Class: {classInfo.className}
            </Heading>

            {/* Students */}
            {students.length === 0 ? (

              <Text>
                No students found
              </Text>

            ) : (

              <TableContainer
                border="1px solid #ccc"
                borderRadius="md"
                overflowX="auto"
              >

                <Table variant="simple">

                  <Thead bg="gray.100">
                    <Tr>
                      <Th>SN</Th>
                      <Th>Full Name</Th>
                      <Th>Student ID</Th>
                      <Th>Gender</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>

                  <Tbody>

                    {students.map((student, index) => (

                      <Tr key={student.studentId || index}>

                        <Td>
                          {index + 1}
                        </Td>

                        <Td>
                          {student.surName}{" "}
                          {student.otherNames}
                        </Td>

                        <Td>
                          {student.studentId}
                        </Td>

                        <Td>
                          {student.gender}
                        </Td>

                        <Td>
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() =>
                              handleDetails(student)
                            }
                          >
                            Details
                          </Button>
                        </Td>

                      </Tr>

                    ))}

                  </Tbody>

                </Table>

              </TableContainer>

            )}

            {/* Calendar */}
            <Box
              mt={8}
              mb={5}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={{ base: 3, md: 5 }}
            >
              <Heading
                size="md"
                textAlign="center"
                mb={5}
              >
                Events and Calendar
              </Heading>

              <Grid
                templateColumns={{
                  base: "1fr",
                  lg: "2fr 1fr",
                }}
                gap={6}
              >
                {/* Calendar */}
                <Box>
                  <EventCalendar />
                </Box>

                {/* Upcoming Events */}
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                >
                  <Heading size="md" mb={4}>
                    Upcoming Events
                  </Heading>

                  <VStack align="stretch" spacing={3}>
                    <Box
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      p={3}
                    >
                      <Text fontWeight="bold">
                        Exam Date
                      </Text>

                      <Text fontSize="sm" color="gray.500">
                        April 10, 2025
                      </Text>
                    </Box>

                    <Box
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      p={3}
                    >
                      <Text fontWeight="bold">
                        PTA Meeting
                      </Text>

                      <Text fontSize="sm" color="gray.500">
                        April 15, 2025
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </Grid>
            </Box>
          </>
        )}
      </Box>

      {/* Student Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
      >

        <ModalOverlay />

        <ModalContent>

          <ModalHeader>
            Student Details
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            {selectedStudent && (

              <Box textAlign="center">

                <Image
                  src={
                    selectedStudent.profilePicture ||
                    "/default-avatar.png"
                  }
                  alt="Student Picture"
                  width={100}
                  height={100}
                  borderRadius="full"
                  mx="auto"
                />

                <Box mt={3}>

                  <Text>
                    <strong>Name:</strong>{" "}
                    {selectedStudent.surName}{" "}
                    {selectedStudent.otherNames}
                  </Text>

                  <Text>
                    <strong>Student ID:</strong>{" "}
                    {selectedStudent.studentId}
                  </Text>

                  <Text>
                    <strong>Gender:</strong>{" "}
                    {selectedStudent.gender}
                  </Text>

                  <Text>
                    <strong>Date of Birth:</strong>{" "}
                    {selectedStudent.dateOfBirth}
                  </Text>

                  <Text>
                    <strong>Class:</strong>{" "}
                    {selectedStudent.classTo}
                  </Text>
                </Box>
              </Box>

            )}

          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </TeacherLayout>
  );
}
