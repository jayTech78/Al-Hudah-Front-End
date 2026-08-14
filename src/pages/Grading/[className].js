import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  useDisclosure,
  useToast,
  Table,
  Td,
  Tr,
  Th,
  Thead,
  Tbody,
} from "@chakra-ui/react";
import axios from "axios";
import ManagerNavBar from "@/Components/ParentNavBar";
import TeacherSideNav from "@/Components/TeacherSideNav";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";

export default function MarkAttendance() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [fetchMode, setFetchMode] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [fetchedGrades, setStudentGrades] = useState("");
  const [GradeBySubject, setGradeBySubject] = useState([]);
  const term = "firstTerm"; // constant term
  const session = "2024/2025";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const { className } = router.query;

  useEffect(() => {
    if (!className) return;

    const fetchData = async () => {
      try {
        const res = await axios.post(
          `http://localhost:9500/class/getStudentsAndSubjectsByClassName/${className}`
        );
        setStudents(res.data.students || []);
        setSubjects(res.data.subjects || []);
      } catch (error) {
        console.error("Failed to fetch class data", error);
      }
    };

    fetchData();
  }, [className]);

  const handleSearchByStudentId = async () => {
    try {
      if (!selectedStudentId) {
        Swal.fire("Error", "Please select a student ID.", "error");
        return;
      }

      const response = await axios.post(
        "http://localhost:9500/grades/getGradeByStudentId",
        { studentId: selectedStudentId }
      );

      if (response.data.status) {
        Swal.fire("Success", "Grades fetched successfully", "success");
        setStudentGrades(response.data.studentGrades);
        // handle grades data here...
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not fetch grades", "error");
    }
  };

  const handleSearchBySubject = async () => {
    try {
      if (!selectedSubjectId || !session) {
        Swal.fire("Error", "Please select subject and session", "error");
        return;
      }

      const response = await axios.post(
        "http://localhost:9500/grades/getGradesBySubject",
        {
          subjectId: selectedSubjectId,
          session,
          term,
          className,
        }
      );

      if (response.data.status) {
        console.log(response.data.data.total);
        setGradeBySubject(response.data.data);
        Swal.fire("Success", "Grades fetched successfully", "success");
        // setSubjectBySubject(response.data.)
        // handle grades data here...
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not fetch grades", "error");
    }
  };

  return (
    <Box height="100vh" overflow="hidden">
      <ManagerNavBar />
      <Box display="flex" height="100vh">
        <Box
          bg="green.600"
          color="white"
          width="250px"
          position="fixed"
          top="80px"
          height="100%"
        >
          <TeacherSideNav className={className} />
        </Box>

        <Box ml="250px" p={6} flex="1" overflowY="auto">
          <Heading mb={5} textAlign="center">
            Grading
          </Heading>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={6}
          >
            <Link href={`/ScoreGrading/${className}`}>
              <Button colorScheme="blue">Score Grade</Button>
            </Link>

            <Select
              width="250px"
              placeholder="Fetch Grades By..."
              onChange={(e) => {
                const selected = e.target.value;
                if (selected === "1") {
                  setFetchMode("byStudentId");
                } else if (selected === "2") {
                  setFetchMode("bySubject");
                }
                onOpen();
              }}
            >
              <option value="1">By Student ID</option>
              <option value="2">By Subject</option>
            </Select>
          </Box>
          {fetchedGrades.length > 0 && (
            <Box mt={10} p={4} bg="white" borderRadius="md" boxShadow="md">
              <Heading size="md" mb={4}>
                Fetched Grades
              </Heading>
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th>Student ID</Th>
                    <Th>Subject</Th>
                    <Th>CA</Th>
                    <Th>Exam</Th>
                    <Th>Total</Th>
                    <Th>Grade</Th>
                    <Th>Remark</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fetchedGrades.map((grade, index) => (
                    <Tr key={index}>
                      <Td>{grade.studentId}</Td>
                      <Td>
                        {grade.firstTermPerSubject.subjectId || grade.subjectId}
                      </Td>
                      <Td>{grade.firstTermPerSubject.continuousAssesment}</Td>
                      <Td>{grade.firstTermPerSubject.exam}</Td>
                      <Td>
                        {grade.firstTermPerSubject.continuousAssesment +
                          grade.firstTermPerSubject.exam}
                      </Td>
                      <Td>{grade.firstTermPerSubject.grade}</Td>
                      <Td>{grade.firstTermPerSubject.teacherRemarks}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
          {GradeBySubject.length > 0 && (
            <Box mt={10}>
              <Heading size="md" mb={4}>
                Grades for {selectedSubjectId}
              </Heading>
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>Student Name</Th>
                    <Th>CA</Th>
                    <Th>Exam</Th>
                    <Th>Total</Th>
                    <Th>Position</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {GradeBySubject.map((grade) => (
                    <Tr key={grade.studentId}>
                      <Td>{grade.name}</Td>
                      <Td>{grade.ca}</Td>
                      <Td>{grade.exam}</Td>
                      <Td>{grade.total}</Td>
                      <Td>{grade.position}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {fetchMode === "byStudentId"
              ? "Fetch Grades by Student ID"
              : "Fetch Grades by Subject"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {fetchMode === "byStudentId" ? (
              <Box>
                <Text mb={2}>Select Student:</Text>
                <Select
                  placeholder="Select student"
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {students.map((student) => (
                    <option key={student._id} value={student.studentId}>
                      {student.surName} {student.otherNames}
                    </option>
                  ))}
                </Select>
              </Box>
            ) : (
              <Box>
                <Text mb={2}>Select Subject:</Text>
                <Select
                  placeholder="Select subject"
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject.subject}>
                      {subject.subject}
                    </option>
                  ))}
                </Select>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={() => {
                fetchMode === "byStudentId"
                  ? handleSearchByStudentId()
                  : handleSearchBySubject();
                onClose();
              }}
            >
              Fetch Grades
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
